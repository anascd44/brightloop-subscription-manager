import { createContext, useContext, useState } from 'react'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

export const today = () => new Date().toISOString().slice(0, 10)
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
export const addPeriod = (d, p) => {
  const x = new Date(d)
  if (p === 'daily') x.setDate(x.getDate() + 1)
  else if (p === 'weekly') x.setDate(x.getDate() + 7)
  else if (p === 'monthly') x.setMonth(x.getMonth() + 1)
  else x.setFullYear(x.getFullYear() + 1)
  return x.toISOString().slice(0, 10)
}
export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })
let seq = 100
export const nid = (p) => `${p}-${String(++seq).padStart(4, '0')}`
export const STEPS = ['Draft', 'Quotation', 'Confirmed', 'Active', 'Closed']

const seed = () => ({
  customers: [{ id: 'c1', name: 'Nila Traders' }, { id: 'c2', name: 'Orbit Retail' }],
  plans: [{ id: 'pl1', name: 'CRM Monthly', period: 'monthly', minQty: 1, from: '2026-01-01', to: '2027-12-31', closeOnEnd: true, pausable: true }],
  taxes: [{ id: 't1', name: 'GST', rate: 18, active: true }],
  discounts: [{ id: 'd1', code: 'SEATS10', kind: 'percent', value: 10, minAmount: 0, minQty: 5, from: '2026-01-01', to: '2026-12-31', limit: 50, used: 0 }],
  subs: [{ id: 's1', no: 'SUB-0001', customerId: 'c1', planId: 'pl1', start: '2026-09-01', end: '2027-08-31', terms: 'Net 15', status: 'Active', nextBill: '2026-10-01', paused: false, lines: [{ productId: 'p1', name: 'Brightloop CRM', qty: 6, price: 2000 }] }],
  invoices: [],
  payments: [],
})

export function DataProvider({ children }) {
  const [db, setDb] = useState(seed)

  const add = (k, row) => setDb((d) => ({ ...d, [k]: [...d[k], { id: nid(k[0]), ...row }] }))
  const patch = (k, id, ch) => setDb((d) => ({ ...d, [k]: d[k].map((x) => (x.id === id ? { ...x, ...ch } : x)) }))
  const nameOf = (id) => db.customers.find((c) => c.id === id)?.name || '—'
  const paidOn = (inv) => db.payments.filter((p) => p.invoiceId === inv.id).reduce((s, p) => s + p.amount, 0)
  const balance = (inv) => (inv.status === 'Cancelled' ? 0 : inv.total - paidOn(inv))
  const isOverdue = (inv) => inv.status === 'Confirmed' && inv.due < today() && balance(inv) > 0

  // Creates one draft invoice per due subscription, then moves its next billing date forward.
  const generate = () => {
    let made = 0
    let discounts = db.discounts
    const invoices = []
    const taxRate = db.taxes.filter((t) => t.active).reduce((s, t) => s + t.rate, 0)
    const subs = db.subs.map((s) => {
      const plan = db.plans.find((p) => p.id === s.planId)
      if (!plan || s.status !== 'Active' || s.paused || s.nextBill > today() || s.nextBill > s.end) return s
      const lines = s.lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price }))
      const subtotal = lines.reduce((t, l) => t + l.qty * l.price, 0)
      const qty = lines.reduce((t, l) => t + l.qty, 0)
      let discount = 0
      discounts = discounts.map((d) => {
        const ok = today() >= d.from && today() <= d.to && d.used < d.limit && subtotal >= d.minAmount && qty >= d.minQty
        if (!ok) return d
        discount += d.kind === 'percent' ? (subtotal * d.value) / 100 : Math.min(d.value, subtotal)
        return { ...d, used: d.used + 1 }
      })
      const tax = ((subtotal - discount) * taxRate) / 100
      invoices.push({ id: nid('i'), no: nid('INV'), subId: s.id, customerId: s.customerId, lines, subtotal, discount, tax, total: subtotal - discount + tax, status: 'Draft', date: today(), due: addDays(today(), parseInt(s.terms.replace(/\D/g, '')) || 0) })
      made++
      const next = addPeriod(s.nextBill, plan.period)
      return { ...s, nextBill: next, status: plan.closeOnEnd && next > s.end ? 'Closed' : s.status }
    })
    setDb({ ...db, subs, discounts, invoices: [...db.invoices, ...invoices] })
    return made
  }

  const recordPayment = (invoiceId, pay) => setDb((d) => {
    const inv = d.invoices.find((i) => i.id === invoiceId)
    const already = d.payments.filter((p) => p.invoiceId === invoiceId).reduce((s, p) => s + p.amount, 0)
    const settled = already + pay.amount >= inv.total - 0.01
    return {
      ...d,
      payments: [...d.payments, { id: nid('pay'), invoiceId, ...pay }],
      invoices: d.invoices.map((i) => (i.id === invoiceId && settled ? { ...i, status: 'Paid' } : i)),
    }
  })

  return <Ctx.Provider value={{ db, add, patch, nameOf, paidOn, balance, isOverdue, generate, recordPayment }}>{children}</Ctx.Provider>
}