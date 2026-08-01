import { Icon } from '../icons.jsx'
import { TRIP } from '../data.js'
import { me, setMember, syncCfg, saveSyncCfg, toast, crew, update } from '../store.js'
import { Sheet, closeSheet, Avatar, allMembers } from '../components.jsx'
import { useState } from 'preact/hooks'

export function ProfileSheet() {
  const [url, setUrl] = useState(syncCfg.value.url)
  const [key, setKey] = useState(syncCfg.value.key)
  const [showSync, setShowSync] = useState(false)
  const [renaming, setRenaming] = useState(false)

  return (
    <Sheet title="Gruppe & Einstellungen" onClose={closeSheet}>
      <div class="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {me.value && <Avatar id={me.value.id} size="lg" />}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800 }}>{me.value?.name}</div>
          <div class="hint">{TRIP.destination} · 13.–20.08.2026</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <label class="label">Die Crew {renaming ? '(Namen tippen & ändern)' : '(antippen zum Wechseln)'}</label>
        <button class="more" onClick={() => setRenaming(!renaming)}>
          {renaming ? 'Fertig' : 'Namen bearbeiten'}
        </button>
      </div>
      <div class="card" style={{ padding: '6px 16px' }}>
        {allMembers().map(m => (
          renaming ? (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
              <Avatar id={m.id} />
              <input class="input" style={{ minHeight: 40 }} value={m.name} maxLength={20}
                onChange={e => {
                  const name = e.target.value.trim()
                  if (!name) return
                  update(crew, 'crew', c => { c.names[m.id] = name; return c })
                  toast('Name gespeichert')
                }} />
            </div>
          ) : (
            <button key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', width: '100%', textAlign: 'left' }}
              onClick={() => { setMember(m.id); toast(`Du bist jetzt ${m.name}`) }}>
              <Avatar id={m.id} />
              <span style={{ flex: 1, fontWeight: 700, fontSize: '.92rem' }}>{m.name}</span>
              {m.id === me.value?.id && <span class="tag teal"><Icon name="check" size={12} />Du</span>}
            </button>
          )
        ))}
        {renaming && <p class="hint" style={{ padding: '6px 0' }}>Umbenennungen gelten überall – Kasse, Liste, Plan und Autos hängen an der Person, nicht am Namen.</p>}
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
