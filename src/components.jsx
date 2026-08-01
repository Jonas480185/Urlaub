import { Icon } from './icons.jsx'
import { MEMBERS } from './data.js'
import { sheet } from './store.js'

export const memberById = (id) => MEMBERS.find(m => m.id === id)
export const initials = (name) => name.slice(0, 2).toUpperCase()

export function Avatar({ id, size = '', off = false }) {
  const m = memberById(id)
  if (!m) return null
  return <span class={`avatar ${size} ${off ? 'off' : ''}`} style={{ background: m.color }} title={m.name}>{initials(m.name)}</span>
}

export function AvStack({ ids, max = 7 }) {
  return (
    <span class="avstack">
      {ids.slice(0, max).map(id => <Avatar key={id} id={id} size="sm" />)}
    </span>
  )
}

export function Sheet({ title, onClose, children }) {
  return (
    <div class="scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div class="sheetbox">
        <div class="grabber" />
        <div class="sheethead">
          <h2>{title}</h2>
          <button class="iconbtn" onClick={onClose} aria-label="Schließen"><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function closeSheet() { sheet.value = null }

export function Empty({ icon = 'sun', text, action, onAction }) {
  return (
    <div class="empty">
      <div class="eicon"><Icon name={icon} size={30} /></div>
      <p>{text}</p>
      {action && <button class="btn primary" onClick={onAction}>{action}</button>}
    </div>
  )
}

// Mehrfach-Auswahl von Mitgliedern als Chips
export function MemberChips({ selected, onToggle, single = false }) {
  return (
    <div class="chiprow" style={{ flexWrap: 'wrap' }}>
      {MEMBERS.map(m => {
        const on = single ? selected === m.id : selected.includes(m.id)
        return (
          <button key={m.id} class={`chip member ${on ? 'on' : ''}`} onClick={() => onToggle(m.id)}>
            <span class="avatar sm" style={{ background: on ? 'rgba(255,255,255,.3)' : m.color }}>{initials(m.name)}</span>
            {m.name}
          </button>
        )
      })}
    </div>
  )
}
