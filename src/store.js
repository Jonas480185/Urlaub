import { signal, computed } from '@preact/signals'
import { MEMBERS, TRIP, SHOP_SEED, EXPENSE_SEED, SAFEHOME_DEFAULT } from './data.js'

// ---------------------------------------------------------------------------
// Local-first Store: alles landet sofort in localStorage (offline-fähig).
// Optionaler geteilter Sync über Supabase-REST (kv-Tabelle, Last-write-wins).
// ---------------------------------------------------------------------------

// v2: Demodaten entfernt – neuer Prefix, damit alte Seed-Daten auf bereits
// benutzten Geräten nicht wieder auftauchen. Die gewählte Identität wird migriert.
const PREFIX = 'ss2:'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
      ?? (key === 'profile' || key === 'synccfg' ? localStorage.getItem('ss:' + key) : null)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.error('load failed', key, err)
    return fallback
  }
}

// Geteilte Daten (werden gesynct, wenn Sync konfiguriert ist)
export const shopping = signal(load('shopping', { items: SHOP_SEED }))
export const kasse = signal(load('kasse', {
  expenses: EXPENSE_SEED, budget: TRIP.budget, settled: [],
}))
export const plan = signal(load('plan', { participation: {}, extra: {}, removed: [] }))
export const safehome = signal(load('safehome', SAFEHOME_DEFAULT))

// Lokale Daten (pro Gerät)
export const profile = signal(load('profile', { memberId: null }))
export const syncCfg = signal(load('synccfg', { url: '', key: '' }))

// UI-State
export const tab = signal('heute')
export const sheet = signal(null) // { type, props }
export const toastMsg = signal(null)
export const syncState = signal('idle') // idle | saving | loading | error

const SHARED = { shopping, kasse, plan, safehome }
let toastTimer
export function toast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastMsg.value = null), 2600)
}

function persist(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) }
  catch (err) { console.error('persist failed', key, err) }
}

// Optimistisch: UI sofort, Persistenz danach, Sync im Hintergrund.
export function update(sig, key, fn) {
  const next = fn(structuredClone(sig.value))
  sig.value = next
  persist(key, next)
  if (key in SHARED) pushKey(key, next)
}

export const me = computed(() => MEMBERS.find(m => m.id === profile.value.memberId) || null)

// --------------------------- Supabase-REST-Sync ----------------------------
// Tabelle: kv (k text primary key, v jsonb, t timestamptz) – siehe supabase/schema.sql

const hasSync = () => !!(syncCfg.value.url && syncCfg.value.key)

function sbHeaders() {
  const { key } = syncCfg.value
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
}

async function pushKey(k, v) {
  if (!hasSync()) return
  syncState.value = 'saving'
  try {
    const res = await fetch(`${syncCfg.value.url}/rest/v1/kv`, {
      method: 'POST',
      headers: { ...sbHeaders(), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify([{ k, v, t: new Date().toISOString() }]),
    })
    syncState.value = res.ok ? 'idle' : 'error'
    if (!res.ok) console.error('sync push failed', res.status)
  } catch (err) {
    syncState.value = 'error'
    console.error('sync push failed', err)
  }
}

export async function pullAll(showToast = false) {
  if (!hasSync()) { if (showToast) toast('Kein Sync konfiguriert – lokaler Modus') ; return }
  syncState.value = 'loading'
  try {
    const res = await fetch(`${syncCfg.value.url}/rest/v1/kv?select=k,v`, { headers: sbHeaders() })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    for (const row of await res.json()) {
      if (row.k in SHARED && row.v) {
        SHARED[row.k].value = row.v
        persist(row.k, row.v)
      }
    }
    syncState.value = 'idle'
    if (showToast) toast('Alles aktuell ✓')
  } catch (err) {
    syncState.value = 'error'
    console.error('sync pull failed', err)
    if (showToast) toast('Sync fehlgeschlagen – Daten bleiben lokal')
  }
}

export function saveSyncCfg(url, key) {
  syncCfg.value = { url: url.trim().replace(/\/$/, ''), key: key.trim() }
  persist('synccfg', syncCfg.value)
  pullAll(true)
}

export function setMember(id) {
  profile.value = { memberId: id }
  persist('profile', profile.value)
}

// Beim Start + bei Fokus + alle 30 s aktualisieren (poor man's realtime)
if (typeof window !== 'undefined') {
  pullAll()
  window.addEventListener('focus', () => pullAll())
  setInterval(() => { if (document.visibilityState === 'visible') pullAll() }, 30000)
}
