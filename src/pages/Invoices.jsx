import { useState } from 'react'
import { useData, money, today } from '../store/DataContext'
import { Page, Card, Field, Table, Badge, inputCls, btn } from '../components/ui'

export default function Invoices() {
  const { db, patch, nameOf, balance, paidOn, isOverdue, recordPayment } = useData()
  const [filter, setFilter] = useState('all')
  const [pf, setPf] = useState(null)
  const [note, setNote] = useState('')
  const status = (i) => (isOverdue(i) ? 'Overdue' : i.status)

  const pay = () => {
    const inv = db.invoices.find((i) => i.id === pf.id)
    const amount = Number(pf.amount)
    if (!(amount > 0) || amount > balance(inv) + 0.001) return setNote('Enter an amount up to the balance due.')
    recordPayment(inv.id, { amount, method: pf.method, date: pf.date, note: pf.note })
    setPf(null)
    setNote('Payment recorded.')
  }

  const rows = db.invoices.filter((i) => filter === 'all' || status(i) === filter).map((i) => [
    i.no, nameOf(i.customerId), money(i.total), money(i.discount), money(i.tax), money(balance(i)), i.due, <Badge key="b" s={status(i)} />,
    <span key="a" className="flex gap-1">
      {i.status === 'Draft' && <button className={btn.ghost} onClick={() => patch('invoices', i.id, { status: 'Confirmed' })}>Confirm</button>}
      {i.status === 'Confirmed' && <button className={btn.ghost} onClick={() => setNote(`Invoice ${i.no} sent to ${nameOf(i.customerId)}.`)}>Send</button>}
      {i.status === 'Confirmed' && <button className={btn.primary} onClick={() => setPf({ id: i.id, amount: balance(i), method: 'Bank transfer', date: today(), note: '' })}>Record payment</button>}
      {['Draft', 'Confirmed'].includes(i.status) && paidOn(i) === 0 && <button className={btn.ghost} onClick={() => patch('invoices', i.id, { status: 'Cancelled' })}>Cancel</button>}
      <button className={btn.ghost} onClick={() => window.print()}>Print</button>
    </span>,
  ])

  return (
    <Page title="Invoices">
      {note && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{note}</p>}
      <Card>
        <select className={inputCls + ' mb-3 !w-48'} value={filter} onChange={(e) => setFilter(e.target.value)}>{['all', 'Draft', 'Confirmed', 'Paid', 'Overdue', 'Cancelled'].map((s) => <option key={s} value={s}>{s === 'all' ? 'All invoices' : s}</option>)}</select>
        <Table head={['Invoice', 'Customer', 'Total', 'Discount', 'Tax', 'Balance', 'Due', 'Status', '']} rows={rows} empty="No invoices yet. Run billing from the Subscriptions page." />
      </Card>
      {pf && (
        <Card>
          <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Amount"><input className={inputCls} type="number" value={pf.amount} onChange={(e) => setPf({ ...pf, amount: e.target.value })} /></Field>
            <Field label="Method"><select className={inputCls} value={pf.method} onChange={(e) => setPf({ ...pf, method: e.target.value })}><option>Bank transfer</option><option>Card</option><option>UPI</option><option>Cash</option></select></Field>
            <Field label="Date"><input className={inputCls} type="date" value={pf.date} onChange={(e) => setPf({ ...pf, date: e.target.value })} /></Field>
            <Field label="Note"><input className={inputCls} value={pf.note} onChange={(e) => setPf({ ...pf, note: e.target.value })} /></Field>
            <button className={btn.primary} onClick={pay}>Save payment</button>
          </div>
        </Card>
      )}
    </Page>
  )
}