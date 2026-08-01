export const fmtEUR = (n) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)

export const fmtEUR0 = (n) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

// Akzeptiert "12,50", "12.50", "1.234,56"
export function parseAmount(str) {
  if (typeof str !== 'string') return NaN
  let s = str.trim().replace(/[€\s]/g, '')
  if (!s) return NaN
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : NaN
}

const r2 = (n) => Math.round(n * 100) / 100

// Nettosaldo pro Person: + hat mehr gezahlt als verbraucht, − schuldet.
export function calcBalances(expenses, memberIds) {
  const bal = Object.fromEntries(memberIds.map(id => [id, 0]))
  for (const e of expenses) {
    const parts = e.parts.filter(p => p in bal)
    if (!parts.length || !(e.paidBy in bal)) continue
    const share = e.amount / parts.length
    bal[e.paidBy] += e.amount
    for (const p of parts) bal[p] -= share
  }
  for (const k in bal) bal[k] = r2(bal[k])
  return bal
}

// Greedy: größter Schuldner zahlt an größten Gläubiger → minimale Zahlungsliste.
export function settle(balances) {
  const debt = [], cred = []
  for (const [id, b] of Object.entries(balances)) {
    if (b < -0.005) debt.push({ id, amt: -b })
    else if (b > 0.005) cred.push({ id, amt: b })
  }
  const res = []
  debt.sort((a, b) => b.amt - a.amt)
  cred.sort((a, b) => b.amt - a.amt)
  let i = 0, j = 0
  while (i < debt.length && j < cred.length) {
    const pay = r2(Math.min(debt[i].amt, cred[j].amt))
    if (pay > 0.005) res.push({ from: debt[i].id, to: cred[j].id, amount: pay })
    debt[i].amt = r2(debt[i].amt - pay)
    cred[j].amt = r2(cred[j].amt - pay)
    if (debt[i].amt < 0.005) i++
    if (cred[j].amt < 0.005) j++
  }
  return res
}

export const toDate = (iso) => new Date(iso + 'T12:00:00')

export const fmtDay = (iso) =>
  toDate(iso).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' })

export const fmtDayLong = (iso) =>
  toDate(iso).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

export const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Tag X von N (1-basiert), null wenn außerhalb der Reise
export function tripDay(start, end, today = todayISO()) {
  if (today < start || today > end) return null
  return Math.round((toDate(today) - toDate(start)) / 86400000) + 1
}

export function daysUntil(start, today = todayISO()) {
  return Math.max(0, Math.round((toDate(start) - toDate(today)) / 86400000))
}

export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
export const mapsDirUrl = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
export const uberUrl = (lat, lng, name) =>
  `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
export const boltUrl = () => 'https://bolt.eu/'

export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3)
