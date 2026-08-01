import { Icon } from '../icons.jsx'
import { TRIP } from '../data.js'
import { setMember } from '../store.js'
import { initials, allMembers } from '../components.jsx'
import { Scene } from '../scenes.jsx'
import { useState } from 'preact/hooks'

export function Onboarding() {
  const [picked, setPicked] = useState(null)
  return (
    <div class="onboard">
      <Scene kind="sunset" />
      <div class="shade" />
      <div class="ob-in">
        <div>
          <div class="logo-script">Split Squad</div>
          <div class="claim">{TRIP.claim}</div>
          <span class="tripline">
            <Icon name="pin" size={15} />{TRIP.destination} · 13.–20. August 2026
          </span>
        </div>

        <div style={{ marginTop: 34 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Wer bist du?</h2>
        <p style={{ fontSize: '.86rem', opacity: .8, marginTop: 4 }}>Wähl deinen Namen – so weiß die Crew, wer was macht.</p>
        <div class="membergrid">
          {allMembers().map(m => (
            <button key={m.id} class={`memberpick ${picked === m.id ? 'on' : ''}`} onClick={() => setPicked(m.id)}>
              <span class="avatar" style={{ background: m.color }}>{initials(m.name)}</span>
              {m.name}
              {picked === m.id && <Icon name="check" size={17} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>
        <button class="btn orange block" style={{ marginTop: 22, minHeight: 52 }} disabled={!picked}
          onClick={() => setMember(picked)}>
          Los geht's <Icon name="chevR" size={18} />
        </button>
          <p style={{ fontSize: '.72rem', opacity: .65, marginTop: 16 }}>
            Privates Urlaubscockpit für 7 Freunde. Deine Auswahl bleibt auf diesem Gerät gespeichert.
          </p>
        </div>
      </div>
    </div>
  )
}
