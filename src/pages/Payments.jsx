import { useData, money } from '../store/DataContext'
import { Page, Card, Table } from '../components/ui'

export default function Payments() {
  const { db } = useData()
  const rows = db.payments.map((p) => [p.date, db.invoices.find((i) => i.id === p.invoiceId)?.no, p.method, money(p.amount), p.note])
  return (
    <Page title="Payments">
      <Card><Table head={['Date', 'Invoice', 'Method', 'Amount', 'Note']} rows={rows} empty="No payments yet. Record one from the Invoices page." /></Card>
    </Page>
  )
}