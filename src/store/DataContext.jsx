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
  const remove = (k, id) => setDb((d) => ({ ...d, [k]: d[k].filter((x) => x.id !== id) }))
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
      const lines = s.lines.map((l) => ({