import { describe, it, expect } from 'vitest'
import { parseAmount, calcBalances, settle, tripDay, daysUntil } from './util.js'

const IDS = ['a', 'b', 'c', 'd']

describe('parseAmount', () => {
  it('akzeptiert Komma und Punkt', () => {
    expect(parseAmount('12,50')).toBe(12.5)
    expect(parseAmount('12.50')).toBe(12.5)
    expect(parseAmount('1.234,56')).toBe(1234.56)
    expect(parseAmount(' 42 € ')).toBe(42)
  })
  it('lehnt Unsinn ab', () => {
    expect(parseAmount('')).toBeNaN()
    expect(parseAmount('abc')).toBeNaN()
    expect(parseAmount('-5')).toBeNaN()
    expect(parseAmount('0')).toBeNaN()
  })
})

describe('calcBalances', () => {
  it('gleichmäßig geteilte Ausgabe', () => {
    const bal = calcBalances([{ amount: 100, paidBy: 'a', parts: IDS }], IDS)
    expect(bal.a).toBe(75)
    expect(bal.b).toBe(-25)
    expect(bal.c).toBe(-25)
    expect(bal.d).toBe(-25)
  })
  it('Teilmenge der Gruppe (Uber für 2)', () => {
    const bal = calcBalances([{ amount: 30, paidBy: 'a', parts: ['a', 'b'] }], IDS)
    expect(bal.a).toBe(15)
    expect(bal.b).toBe(-15)
    expect(bal.c).toBe(0)
  })
  it('Zahler nicht beteiligt', () => {
    const bal = calcBalances([{ amount: 60, paidBy: 'a', parts: ['b', 'c'] }], IDS)
    expect(bal.a).toBe(60)
    expect(bal.b).toBe(-30)
  })
  it('Summe aller Salden ist 0', () => {
    const bal = calcBalances([
      { amount: 630, paidBy: 'a', parts: IDS },
      { amount: 99.99, paidBy: 'b', parts: ['b', 'c', 'd'] },
    ], IDS)
    const sum = Object.values(bal).reduce((s, v) => s + v, 0)
    expect(Math.abs(sum)).toBeLessThan(0.05)
  })
})

describe('settle (Greedy-Ausgleich)', () => {
  it('eine Zahlung bei zwei Personen', () => {
    expect(settle({ a: 50, b: -50 })).toEqual([{ from: 'b', to: 'a', amount: 50 }])
  })
  it('minimiert Zahlungen', () => {
    const res = settle({ a: 90, b: -30, c: -30, d: -30 })
    expect(res).toHaveLength(3)
    expect(res.every(r => r.to === 'a')).toBe(true)
    expect(res.reduce((s, r) => s + r.amount, 0)).toBeCloseTo(90, 2)
  })
  it('leer wenn quitt', () => {
    expect(settle({ a: 0, b: 0 })).toEqual([])
  })
  it('Zahlungen decken exakt alle Schulden', () => {
    const bal = calcBalances([
      { amount: 630, paidBy: 'a', parts: IDS },
      { amount: 420, paidBy: 'b', parts: IDS },
      { amount: 55.5, paidBy: 'c', parts: ['c', 'd'] },
    ], IDS)
    const res = settle(bal)
    const after = { ...bal }
    for (const r of res) { after[r.from] += r.amount; after[r.to] -= r.amount }
    for (const v of Object.values(after)) expect(Math.abs(v)).toBeLessThan(0.02)
  })
})

describe('Reise-Datumslogik', () => {
  it('Tag X von 8', () => {
    expect(tripDay('2026-08-13', '2026-08-20', '2026-08-13')).toBe(1)
    expect(tripDay('2026-08-13', '2026-08-20', '2026-08-17')).toBe(5)
    expect(tripDay('2026-08-13', '2026-08-20', '2026-08-20')).toBe(8)
    expect(tripDay('2026-08-13', '2026-08-20', '2026-08-01')).toBeNull()
    expect(tripDay('2026-08-13', '2026-08-20', '2026-08-21')).toBeNull()
  })
  it('Countdown', () => {
    expect(daysUntil('2026-08-13', '2026-08-01')).toBe(12)
    expect(daysUntil('2026-08-13', '2026-08-13')).toBe(0)
  })
})
