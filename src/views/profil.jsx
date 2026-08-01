import { Icon } from '../icons.jsx'
import { MEMBERS, TRIP } from '../data.js'
import { me, setMember, syncCfg, saveSyncCfg, toast } from '../store.js'
import { Sheet, closeSheet, Avatar } from '../components.jsx'
import { useState } from 'preact/hooks'

export function ProfileSheet() {
  const [url, setUrl] = useState(syncCfg.value.url)
  const [key, setKey] = useState(syncCfg.value.key)
  const [showSync, setShowSync] = useState(false)

  return (
    <Sheet title="Gruppe & Einstellungen" onClose={closeSheet}>
      <div class="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {me.value && <Avatar id={me.value.id} size="lg" />}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800 }}>{me.value?.name}</div>
          <div class="hint">{TRIP.destination} · 13.–20.08.2026</div>
        </div>
      </div>

      <label class="label">Die Crew (antippen zum Wechseln)</label>
      <div class="card" style={{ padding: '6px 16px' }}>
        {MEMBERS.map(m => (
          <button key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', width: '100%', textAlign: 'left' }}
            onClick={() => { setMember(m.id); toast(`Du bist jetzt ${m.name}`) }}>
            <Avatar id={m.id} />
            <span style={{ flex: 1, fontWeight: 700, fontSize: '.92rem' }}>{m.name}</span>
            {m.id === me.value?.id && <span class="tag teal"><Icon name="check" size={12} />Du</span>}
          </button>
        ))}
      </div>

      <label class="label">App installieren</label>
      <div class="card" style={{ fontSize: '.86rem', color: 'var(--ink-2)' }}>
        <strong style={{ color: 'var(--ink)' }}><Icon name="install" size={15} /> Als App auf den Homescreen:</strong>
        <div style={{ marginTop: 6 }}>iPhone: Teilen-Menü → „Zum Home-Bildschirm". Android: Menü → „App installieren".</div>
      </div>

      <label class="label">Geteilter Sync (optional)</label>
      <div class="card">
        <p class="hint">
          Ohne Sync läuft die App lokal auf jedem Gerät. Mit einem kostenlosen Supabase-Projekt
          (Anleitung im README) synchronisiert sich die Crew automatisch. Geteilte Daten sind für
          alle sichtbar – bei gleichzeitigen Änderungen gewinnt der letzte Schreibzugriff.
        </p>
        {showSync ? (
          <>
            <input class="input" style={{ marginTop: 10 }} placeholder="https://xyz.supabase.co" value={url} onInput={e => setUrl(e.target.value)} />
            <input class="input" style={{ marginTop: 8 }} placeholder="Anon-Key" value={key} onInput={e => setKey(e.target.value)} />
            <button class="btn primary sm block" style={{ marginTop: 10 }} onClick={() => { saveSyncCfg(url, key); toast('Sync-Einstellungen gespeichert') }}>
              Speichern & verbinden
            </button>
          </>
        ) : (
          <button class="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setShowSync(true)}>
            {syncCfg.value.url ? 'Sync konfiguriert – bearbeiten' : 'Sync einrichten'}
          </button>
        )}
      </div>
    </Sheet>
  )
}
