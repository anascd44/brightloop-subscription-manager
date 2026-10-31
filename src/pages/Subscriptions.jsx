import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { useData, money, today, addPeriod, nid, STEPS } from '../store/DataContext'
import { Page, Card, Field, Table, Badge, inputCls, btn } from '../components/ui'

export default function Subscriptions() {
  const { db, add, patch, nameOf, generate } = useData()
  const [f, setF] = useState({ customerId: '', planId: db.plans[0]?.id || '', productId: '', qty: 1, start: today(), terms: 'Net 15' })
  const [note, setNote] = useState('')
  const [products, setProducts] = useState([])
  useEffect(() => {
    getProducts().then((d) => { setProducts(d); setF((x) => ({ ...x, productId: x.productId || d[0]?.id || '' })) })
  }, [])
  const [filter, setFilter] = useState('all')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const planName = (id) => db.plans.find((p) => p.id === id)?.name

  const create = () => {
    const plan = db.plans.find((p) => p.id === f.planId)
    const prod = products.find((p) => p.id === f.productId)
    if (!f.customerId || !plan || !prod) return setNote('Choose a customer, plan and product.')
    if (+f.qty < plan.minQty) return setNote(`This plan needs a quantity of at least ${plan.minQty}.`)
    add('subs', { no: nid('SUB'), customerId: f.customerId, planId: plan.id, start: f.start, end: addPeriod(f.start, 'yearly'), terms: f.terms, status: 'Draft', nextBill: f.start, paused: false, lines: [{ productId: prod.id, name: prod.name, qty: +f.qty, price: prod.salesPrice }] })
    setNote('Subscription created as Draft.')
  }
  const advance = (s) => patch('subs', s.id, { status: STEPS[STEPS.indexOf(s.status) + 1] })
  const rows = db.subs.filter((s) => filter === 'all' || s.status === filter).map((s) => [
    s.no, nameOf(s.customerId), planName(s.planId), s.lines.map((l) => `${l.qty} × ${money(l.price)}`).join(', '), `${s.start} to ${s.end}`,
    <Badge key="b" s={s.paused ? 'Paused' : s.status} />,
    <span key="a" className="flex gap-1">
      {s.status !== 'Closed' && <button className={btn.ghost} onClick={() => advance(s)}>Move to {STEPS[STEPS.indexOf(s.status) + 1]}</button>}
      {s.status === 'Active' && <button className={btn.ghost} onClick={() => patch('subs', s.id, { paused: !s.paused })}>{s.paused ? 'Resume' : 'Pause'}</button>}
    </span>,
  ])

  return (
    <Page title="Subscriptions">
      {note && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{note}</p>}
      <Card>
        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Customer"><select className={inputCls} value={f.customerId} onChange={set('customerId')}><option value="">Choose…</option>{db.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Plan"><select className={inputCls} value={f.planId} onChange={set('planId')}>{db.plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Product"><select className={inputCls} value={f.productId} onChange={set('productId')}>{products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          <Field label="Quantity"><input className={inputCls} type="number" min="1" value={f.qty} onChange={set('qty')} /></Field>
          <Field label="Start date"><input className={inputCls} type="date" value={f.start} onChange={set('start')} /></Field>
          <Field label="Payment terms"><select className={inputCls} value={f.terms} onChange={set('terms')}><option>Net 7</option><option>Net 15</option><option>Net 30</option></select></Field>
          <button className={btn.primary} onClick={create}>Create subscription</button>
        </div>
      </Card>
      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          <select className={inputCls + ' !w-48'} value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{STEPS.map((s) => <option key={s}>{s}</option>)}</select>
          <button className={btn.primary} onClick={() => { const n = generate(); setNote(n ? `Created ${n} draft invoice${n > 1 ? 's' : ''}.` : 'Nothing is due. Every active subscription is already billed.') }}>Run billing for today</button>
        </div>
        <Table head={['Number', 'Customer', 'Plan', 'Lines', 'Dates', 'Status', '']} rows={rows} />
      </Card>
    </Page>
  )
}