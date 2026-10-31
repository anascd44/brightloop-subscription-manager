import { useData, money } from '../store/DataContext'
import { Page, Card, Table } from '../components/ui'

export default function Overdue() {
  const { db, nameOf, balance, isOverdue } = useData()
  const rows = db.invoices.filter(isOverdue).map((i) => [i.no, nameOf(i.customerId), i.due, money(balance(i))])
  return (
    <Page title="Overdue Invoices">
      <Card><Table head={['Invoice', 'Customer', 'Was due', 'Balance']} rows={rows} empty="No overdue invoices." /></Card>
    </Page>
  )
}