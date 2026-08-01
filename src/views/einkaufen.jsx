import { Icon } from '../icons.jsx'
import { SHOP_CATS } from '../data.js'
import { uid } from '../util.js'
import { shopping, me, update, toast, sheet } from '../store.js'
import { Sheet, closeSheet, Avatar, MemberChips, Empty } from '../components.jsx'
import { useState } from 'preact/hooks'
import { HeadButtons } from './heute.jsx'
import { Scene } from '../scenes.jsx'

const catName = (id) => SHOP_CATS.find(c => c.id === id)?.name || 'Sonstiges'
const catIcon = (id) => SHOP_CATS.find(c => c.id === id)?.icon || 'dots'

export function Einkaufen() {
  const [filter, setFilter] = useState('alle')
  const [text, setText] = useState('')
  const [showDone, setShowDone] = useState(true)
  const items = shopping.value.items

  const matches = (i) =>
    filter === 'alle' ? true :
    filter === 'meine' ? i.who === me.value?.id :
    i.cat === filter
  const open = items.filter(i => !i.done && matches(i))
  const done = items.filter(i => i.done && matches(i))

  const add = () => {
    const name = text.trim()
    if (!name) return
    update(shopping, 'shopping', s => {
      s.items.push({ id: uid(), name, qty: '', cat: filter !== 'alle' && filter !== 'meine' ? filter : 'sonstiges', who: null, done: false })
      return s
    })
    setText('')
    toast('Artikel hinzugefügt')
  }

  const toggle = (id) => update(shopping, 'shopping', s => {
    const it = s.items.find(i => i.id === id)
    if (it) it.done = !it.done
    return s
  })

  const grouped = SHOP_CATS.map(c => ({ cat: c, list: open.filter(i => i.cat === c.id) })).filter(g => g.list.length)

  return (
    <div class="screen">
      <div class="pagehead">
        <div>
          <h1>Einkaufen</h1>
          <div class="sub">{items.filter(i => !i.done).length} offen · gemeinsame Liste</div>
        </div>
        <HeadButtons />
      </div>

      <div class="card sand" style={{ padding: 12 }}>
        <div class="inputrow">
          <input class="input" placeholder="Was fehlt? z. B. Limetten" value={text}
            onInput={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }} />
          <button class="btn primary" style={{ minWidth: 52 }} onClick={add} disabled={!text.trim()} aria-label="Hinzufügen">
            <Icon name="plus" />
          </button>
        </div>
      </div>

      <div class="chiprow">
        <button class={`chip ${filter === 'alle' ? 'on' : ''}`} onClick={() => setFilter('alle')}>Alle</button>
        <button class={`chip ${filter === 'meine' ? 'on' : ''}`} onClick={() => setFilter('meine')}>
          <Icon name="users" size={15} />Meine
        </button>
        {SHOP_CATS.map(c => (
          <button key={c.id} class={`chip ${filter === c.id ? 'on' : ''}`} onClick={() => setFilter(c.id)}>
            <Icon name={c.icon} size={15} />{c.name}
          </button>
        ))}
      </div>

      {open.length === 0 && done.length === 0 && (
        <Empty icon="cart" text="Nichts auf der Liste. Erster Eintrag: Eiswürfel für den ersten Abend?" />
      )}

      {grouped.map(g => (
        <div key={g.cat.id}>
          <div class="sectionhead" style={{ margin: '14px 0 8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--teal-deep)', fontSize: '.9rem' }}>
              <Icon name={g.cat.icon} size={16} />{g.cat.name}
            </h3>
          </div>
          {g.list.map(i => <ShopRow key={i.id} item={i} onToggle={toggle} />)}
        </div>
      ))}

      {done.length > 0 && (
        <>
          <div class="sectionhead">
            <h3>Im Korb ({done.length})</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <button class="more" onClick={() => setShowDone(!showDone)}>{showDone ? 'Ausblenden' : 'Anzeigen'}</button>
              <button class="more" style={{ color: 'var(--red)' }} onClick={() => {
                if (!confirm(`${done.length} erledigte Artikel löschen?`)) return
                update(shopping, 'shopping', s => { s.items = s.items.filter(i => !i.done); return s })
                toast('Erledigte gelöscht')
              }}>Löschen</button>
            </div>
          </div>
          {showDone && done.map(i => <ShopRow key={i.id} item={i} onToggle={toggle} />)}
        </>
      )}
      <p class="hint" style={{ marginTop: 16, textAlign: 'center' }}>
        Tipp: Artikel antippen für Menge, Zuständigkeit & Löschen.
      </p>
    </div>
  )
}

function ShopRow({ item, onToggle }) {
  return (
    <div class={`row ${item.done ? 'done' : ''}`}>
      <button class={`checkbox ${item.done ? 'on' : ''}`} onClick={() => { onToggle(item.id); toast(item.done ? 'Zurück auf die Liste' : 'Im Korb ✓') }}
        aria-label={item.done ? 'Wieder auf die Liste' : 'Abhaken'}>
        <Icon name="check" size={15} />
      </button>
      <button class="grow" style={{ textAlign: 'left' }} onClick={() => (sheet.value = { type: 'shopitem', id: item.id })}>
        <span class="title">{item.name}</span>
        {(item.qty || !item.done) && (
          <span class="sub" style={{ display: 'block' }}>
            {item.qty}{item.qty && item.who ? ' · ' : ''}{item.who ? `bringt ${nameOf(item.who)} mit` : item.qty ? '' : 'Niemand zugeteilt'}
          </span>
        )}
      </button>
      {item.who && <Avatar id={item.who} />}
    </div>
  )
}

import { memberById } from '../components.jsx'
const nameOf = (id) => memberById(id)?.name || '?'

export function ShopItemSheet({ id }) {
  const item = shopping.value.items.find(i => i.id === id)
  if (!item) return null
  const set = (fn) => update(shopping, 'shopping', s => {
    const it = s.items.find(i => i.id === id)
    if (it) fn(it)
    return s
  })
  return (
    <Sheet title={item.name} onClose={closeSheet}>
      <span class="tag teal"><Icon name={catIcon(item.cat)} size={13} />{catName(item.cat)}</span>
      <label class="label">Menge / Notiz</label>
      <input class="input" value={item.qty} placeholder="z. B. 2 Kästen" onChange={e => set(it => { it.qty = e.target.value })} />
      <label class="label">Kategorie</label>
      <div class="chiprow" style={{ flexWrap: 'wrap' }}>
        {SHOP_CATS.map(c => (
          <button key={c.id} class={`chip ${item.cat === c.id ? 'on' : ''}`} onClick={() => set(it => { it.cat = c.id })}>
            <Icon name={c.icon} size={15} />{c.name}
          </button>
        ))}
      </div>
      <label class="label">Wer bringt's mit?</label>
      <MemberChips single selected={item.who} onToggle={(mid) => { set(it => { it.who = it.who === mid ? null : mid }); toast('Zuständigkeit geändert') }} />
      <div class="inputrow" style={{ marginTop: 18 }}>
        <button class="btn danger" onClick={() => {
          update(shopping, 'shopping', s => { s.items = s.items.filter(i => i.id !== id); return s })
          toast('Artikel gelöscht')
          closeSheet()
        }}><Icon name="trash" size={16} />Löschen</button>
        <button class="btn primary" style={{ flex: 1 }} onClick={closeSheet}>Fertig</button>
      </div>
    </Sheet>
  )
}
