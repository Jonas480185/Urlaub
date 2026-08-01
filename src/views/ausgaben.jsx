import { Icon } from '../icons.jsx'
import { MEMBERS, EXPENSE_CATS } from '../data.js'
import { fmtEUR, fmtEUR0, parseAmount, calcBalances, settle, uid, todayISO } from '../util.js'
import { kasse, me, update, toast, sheet } from '../store.js'
import { Sheet, closeSheet, Avatar, memberById, allMembers, MemberChips, Empty } from '../components.jsx'
import { useState } from 'preact/hooks'
import { HeadButtons, Waves } from './heute.jsx'

const ids = MEMBERS.map(m => m.id)

// Transfers (erledigte Ausgleichszahlungen) wirken wie Ausgaben von→an.
export function allMovements(k) {
  return [
    ...k.expenses,
    ...k.settled.map(t => ({ id: t.id, title: 'Ausgleich', amount: t.amount, paidBy: t.from, parts: [t.to], cat: 'sonstiges', transfer: true })),
  ]
}

export function openSettlements(k) {
  return settle(calcBalances(allMovements(k), ids))
}

export function Ausgaben() {
  const k = kasse.value
  const total = k.expenses.reduce((s, e) => s + e.amount, 0)
  const perHead = total / MEMBERS.length
  const pct = Math.min(100, Math.round((total / k.budget) * 100))
  const balances = calcBalances(allMovements(k), ids)
  const settlements = openSettlements(k)
  const byCat = EXPENSE_CATS
    .map(c => ({ cat: c, sum: k.expenses.filter(e => e.cat === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter(x => x.sum > 0)
    .sort((a, b) => b.sum - a.sum)

  return (
    <div class="screen">
      <div class="pagehead">
        <div>
          <h1>Ausgaben</h1>
          <div class="sub">Gruppenkasse · alle in EUR</div>
        </div>
        <HeadButtons />
      </div>

      <div class="hero" style={{ paddingBottom: 26 }}>
        <div class="deco" /><div class="deco2" />
        <div class="eyebrow">Gesamtausgaben</div>
        <div class="bignum">{fmtEUR(total)}</div>
        <div class="meta">
          <span><Icon name="users" size={15} />{fmtEUR(perHead)} pro Person</span>
          <span><Icon name="wallet" size={15} />{pct}% des Budgets</span>
        </div>
        <div class="progress"><div style={{ width: pct + '%' }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.76rem', opacity: .85, marginTop: 6 }}>
          <span>Budget: {fmtEUR0(k.budget)}</span>
          <span>Übrig: {fmtEUR0(Math.max(0, k.budget - total))}</span>
        </div>
        <Waves />
      </div>

      <button class="btn primary block" onClick={() => (sheet.value = { type: 'expense' })}>
        <Icon name="plus" size={18} />Ausgabe hinzufügen
      </button>

      {settlements.length > 0 && (
        <>
          <div class="sectionhead"><h3>So seid ihr quitt</h3><span class="hint">{settlements.length} Zahlung{settlements.length > 1 ? 'en' : ''}</span></div>
          {settlements.map(s => (
            <div key={s.from + s.to} class="row">
              <Avatar id={s.from} />
              <span class="grow">
                <span class="title">{memberById(s.from)?.name} → {memberById(s.to)?.name}</span>
                <span class="sub" style={{ display: 'block' }}>{fmtEUR(s.amount)}</span>
              </span>
              <button class="btn ghost sm" onClick={() => {
                update(kasse, 'kasse', kk => {
                  kk.settled.push({ id: uid(), from: s.from, to: s.to, amount: s.amount, date: todayISO() })
                  return kk
                })
                toast('Als bezahlt markiert ✓')
              }}><Icon name="check" size={15} />Bezahlt</button>
            </div>
          ))}
        </>
      )}
      {settlements.length === 0 && k.expenses.length > 0 && (
        <div class="card" style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', background: 'var(--green-soft)' }}>
          <Icon name="check" size={20} style={{ color: 'var(--green)' }} />
          <span style={{ fontWeight: 700, color: 'var(--green)' }}>Alles ausgeglichen – ihr seid quitt!</span>
        </div>
      )}

      <div class="sectionhead"><h3>Salden</h3></div>
      <div class="card" style={{ padding: '6px 16px' }}>
        {allMembers().map(m => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
            <Avatar id={m.id} />
            <span class="grow" style={{ fontWeight: 700, fontSize: '.92rem' }}>{m.name}{m.id === me.value?.id ? ' (du)' : ''}</span>
            <span class={`balance ${balances[m.id] > 0.005 ? 'pos' : balances[m.id] < -0.005 ? 'neg' : ''}`}>
              {balances[m.id] > 0 ? '+' : ''}{fmtEUR(balances[m.id])}
            </span>
          </div>
        ))}
        <p class="hint" style={{ padding: '8px 0' }}>Plus = bekommt Geld zurück · Minus = schuldet der Gruppe</p>
      </div>

      {byCat.length > 0 && (
        <>
          <div class="sectionhead"><h3>Nach Kategorien</h3></div>
          <div class="card" style={{ padding: '6px 16px' }}>
            {byCat.map(x => (
              <div key={x.cat.id} style={{ padding: '9px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Icon name={x.cat.icon} size={17} style={{ color: 'var(--teal-deep)' }} />
                  <span class="grow" style={{ fontWeight: 700, fontSize: '.92rem', flex: 1 }}>{x.cat.name}</span>
                  <span style={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{fmtEUR(x.sum)}</span>
                </div>
                <div class="progress light" style={{ marginTop: 6, height: 6 }}><div style={{ width: Math.round((x.sum / total) * 100) + '%' }} /></div>
              </div>
            ))}
          </div>
        </>
      )}

      <div class="sectionhead"><h3>Alle Ausgaben</h3><span class="hint">{k.expenses.length}</span></div>
      {k.expenses.length === 0 && <Empty icon="euro" text="Noch keine Ausgabe. Erste Ausgabe: der Van-Transfer?" action="Ausgabe erfassen" onAction={() => (sheet.value = { type: 'expense' })} />}
      {[...k.expenses].reverse().map(e => (
        <div key={e.id} class="row">
          <Avatar id={e.paidBy} />
          <span class="grow">
            <span class="title">{e.title}</span>
            <span class="sub" style={{ display: 'block' }}>
              {memberById(e.paidBy)?.name} · {e.parts.length === 7 ? 'alle' : `${e.parts.length} Pers.`} · {fmtEUR(e.amount / e.parts.length)} p. P.
            </span>
          </span>
          <span style={{ textAlign: 'right' }}>
            <span class="balance" style={{ display: 'block' }}>{fmtEUR(e.amount)}</span>
            <button class="more" style={{ color: 'var(--red)', fontSize: '.76rem' }} onClick={() => {
              if (!confirm(`„${e.title}" (${fmtEUR(e.amount)}) löschen?`)) return
              update(kasse, 'kasse', kk => { kk.expenses = kk.expenses.filter(x => x.id !== e.id); return kk })
              toast('Ausgabe gelöscht')
            }}>Löschen</button>
          </span>
        </div>
      ))}
      {k.settled.length > 0 && (
        <p class="hint" style={{ textAlign: 'center', marginTop: 10 }}>
          {k.settled.length} Ausgleichszahlung{k.settled.length > 1 ? 'en' : ''} bereits erledigt ({fmtEUR(k.settled.reduce((s, t) => s + t.amount, 0))})
        </p>
      )}
    </div>
  )
}

export function ExpenseSheet() {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState('sonstiges')
  const [paidBy, setPaidBy] = useState(me.value?.id || 'jonas')
  const [parts, setParts] = useState(ids)
  const val = parseAmount(amount)
  const valid = title.trim() && !isNaN(val) && parts.length > 0

  return (
    <Sheet title="Neue Ausgabe" onClose={closeSheet}>
      <label class="label" style={{ marginTop: 0 }}>Wofür?</label>
      <input class="input" placeholder="z. B. Konoba-Abendessen" value={title} onInput={e => setTitle(e.target.value)} />
      <label class="label">Betrag</label>
      <div class="inputrow">
        <input class="input" inputMode="decimal" placeholder="0,00" value={amount} onInput={e => setAmount(e.target.value)} />
        <span class="btn ghost" style={{ pointerEvents: 'none', minWidth: 52 }}>€</span>
      </div>
      {amount && isNaN(val) && <p class="hint" style={{ color: 'var(--red)', marginTop: 4 }}>Betrag bitte als Zahl, z. B. 42,50</p>}
      <label class="label">Kategorie</label>
      <div class="chiprow" style={{ flexWrap: 'wrap' }}>
        {EXPENSE_CATS.map(c => (
          <button key={c.id} class={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
            <Icon name={c.icon} size={15} />{c.name}
          </button>
        ))}
      </div>
      <label class="label">Wer hat gezahlt?</label>
      <MemberChips single selected={paidBy} onToggle={setPaidBy} />
      <label class="label">Wer war dabei? <span class="hint">({parts.length} ausgewählt{!isNaN(val) && parts.length ? ` · ${fmtEUR(val / parts.length)} p. P.` : ''})</span></label>
      <MemberChips selected={parts} onToggle={(mid) => setParts(p => p.includes(mid) ? p.filter(x => x !== mid) : [...p, mid])} />
      <button class="btn primary block" style={{ marginTop: 16 }} disabled={!valid} onClick={() => {
        update(kasse, 'kasse', kk => {
          kk.expenses.push({ id: uid(), title: title.trim(), amount: val, cat, paidBy, parts, date: todayISO() })
          return kk
        })
        toast('Ausgabe wurde hinzugefügt')
        closeSheet()
      }}>
        <Icon name="check" size={18} />{isNaN(val) ? 'Speichern' : `${fmtEUR(val)} speichern`}
      </button>
    </Sheet>
  )
}
