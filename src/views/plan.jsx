import { Icon } from '../icons.jsx'
import { PLAN_SEED } from '../data.js'
import { fmtDay, fmtDayLong, todayISO, mapsDirUrl, uid } from '../util.js'
import { plan, me, sheet, update, toast } from '../store.js'
import { Sheet, closeSheet, AvStack } from '../components.jsx'
import { Scene, sceneForIcon } from '../scenes.jsx'
import { useState } from 'preact/hooks'
import { MEMBERS } from '../data.js'

// Seed-Items minus gelöschte, plus selbst angelegte – chronologisch sortiert.
export function visibleItems(day) {
  const p = plan.value
  const items = [
    ...day.items.filter(it => !p.removed.includes(it.id)),
    ...(p.extra[day.date] || []),
  ]
  return items.sort((a, b) => (a.time || '').localeCompare(b.time || ''))
}

// Zugesagte Mitglieder; ohne Antwort gilt als zugesagt (Default: alle dabei).
export function participantsOf(itemId) {
  const part = plan.value.participation[itemId] || {}
  return MEMBERS.filter(m => (part[m.id] || 'yes') === 'yes').map(m => m.id)
}

export function myStatus(itemId) {
  const part = plan.value.participation[itemId] || {}
  return part[me.value?.id] || 'yes'
}

export function setStatus(itemId, status) {
  if (!me.value) return
  update(plan, 'plan', p => {
    p.participation[itemId] = { ...(p.participation[itemId] || {}), [me.value.id]: status }
    return p
  })
}

export function Plan() {
  const today = todayISO()
  return (
    <div class="screen">
      <div class="pagehead">
        <div>
          <h1>Plan</h1>
          <div class="sub">13.–20. August · Kaštel Sućurac & Split</div>
        </div>
      </div>
      {PLAN_SEED.map(day => {
        const items = visibleItems(day)
        const isToday = day.date === today
        const past = day.date < today
        return (
          <button key={day.date} class="row" style={{ width: '100%', textAlign: 'left', opacity: past ? .55 : 1 }}
            onClick={() => (sheet.value = { type: 'day', date: day.date })}>
            <span class="thumb"><Scene kind={sceneForIcon[day.icon] || 'beach'} /></span>
            <span class="grow">
              <span class="sub" style={{ display: 'block', fontWeight: 700 }}>
                {fmtDay(day.date)} {isToday && <span class="tag orange" style={{ marginLeft: 4 }}>Heute</span>}
              </span>
              <span class="title">{day.title}</span>
              <span class="sub" style={{ display: 'block' }}>{day.sub}</span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <Icon name="chevR" size={18} />
              <span class="hint">{items.length} {items.length === 1 ? 'Punkt' : 'Punkte'}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

const STATI = [['yes', 'Dabei'], ['maybe', 'Vielleicht'], ['no', 'Nicht dabei']]

export function DaySheet({ date }) {
  const day = PLAN_SEED.find(d => d.date === date)
  const [adding, setAdding] = useState(false)
  if (!day) return null
  const items = visibleItems(day)

  return (
    <Sheet title={day.title} onClose={closeSheet}>
      <div class="sheetbanner">
        <Scene kind={sceneForIcon[day.icon] || 'beach'} />
        <div class="shade" />
        <div class="bannertext">{fmtDayLong(date)}</div>
      </div>
      <div class="hint" style={{ marginTop: -6, marginBottom: 14 }}>{day.sub}</div>
      <div class="timeline">
        {items.map(it => {
          const yes = participantsOf(it.id)
          const mine = myStatus(it.id)
          return (
            <div key={it.id} class="tl-item">
              <div class="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <span class="tag teal">{it.time} Uhr</span>
                    <h3 style={{ marginTop: 6 }}>{it.title}</h3>
                    <div class="sub" style={{ color: 'var(--ink-2)', fontSize: '.84rem' }}>
                      <Icon name="pin" size={13} /> {it.place}
                    </div>
                  </div>
                  <button class="iconbtn" style={{ width: 36, height: 36, boxShadow: 'none', background: 'var(--red-soft)', color: 'var(--red)' }}
                    aria-label="Programmpunkt löschen"
                    onClick={() => {
                      if (!confirm(`„${it.title}" wirklich löschen?`)) return
                      update(plan, 'plan', p => {
                        p.removed.push(it.id)
                        for (const d in p.extra) p.extra[d] = p.extra[d].filter(x => x.id !== it.id)
                        return p
                      })
                      toast('Programmpunkt gelöscht')
                    }}><Icon name="trash" size={16} /></button>
                </div>
                {it.note && <p class="hint" style={{ marginTop: 8 }}>{it.note}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <AvStack ids={yes} />
                  <span class="hint">{yes.length}/7 dabei</span>
                  <button class="btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => window.open(mapsDirUrl(it.place), '_blank', 'noopener')}>
                    <Icon name="nav" size={14} />Route
                  </button>
                </div>
                <div class="seg" style={{ marginTop: 10, boxShadow: 'none', background: 'var(--bg)' }}>
                  {STATI.map(([val, label]) => (
                    <button key={val} class={mine === val ? 'on' : ''} onClick={() => { setStatus(it.id, val); toast(`Du bist: ${label}`) }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {adding
        ? <AddItemForm date={date} onDone={() => setAdding(false)} />
        : <button class="btn primary block" style={{ marginTop: 6 }} onClick={() => setAdding(true)}>
            <Icon name="plus" size={18} />Programmpunkt hinzufügen
          </button>}
    </Sheet>
  )
}

function AddItemForm({ date, onDone }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('12:00')
  const [place, setPlace] = useState('')
  return (
    <div class="card sand" style={{ marginTop: 6 }}>
      <label class="label" style={{ marginTop: 0 }}>Was ist geplant?</label>
      <input class="input" placeholder="z. B. Sunset-Drinks an der Riva" value={title} onInput={e => setTitle(e.target.value)} />
      <div class="inputrow" style={{ marginTop: 8 }}>
        <input class="input" type="time" value={time} onInput={e => setTime(e.target.value)} style={{ maxWidth: '9rem' }} />
        <input class="input" placeholder="Treffpunkt" value={place} onInput={e => setPlace(e.target.value)} />
      </div>
      <div class="inputrow" style={{ marginTop: 10 }}>
        <button class="btn ghost" onClick={onDone}>Abbrechen</button>
        <button class="btn primary" style={{ flex: 1 }} disabled={!title.trim()} onClick={() => {
          update(plan, 'plan', p => {
            p.extra[date] = [...(p.extra[date] || []), { id: uid(), time, title: title.trim(), place: place.trim() || 'Wird noch geklärt', note: '' }]
            return p
          })
          toast('Programmpunkt hinzugefügt')
          onDone()
        }}>Speichern</button>
      </div>
    </div>
  )
}
