import { Link } from 'react-router-dom'
import { useData, money } from '../store/DataContext'
import RevenueChart from '../components/dashboard/RevenueChart'

const th = 'px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'
const td = 'px-5 py-3 text-sm text-slate-700'

function Stat({ label, value, tone = '' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </div>
  )
}

function monthlyRevenue(payments) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    return {
      month: d.toLocaleString('en', { month: 'short' }),
      revenue: payments.filter((p) => p.date.startsWith(key)).reduce((s, p) => s + p.amount, 0),
    }
  })
}

export default function Dashboard() {
  const { db, nameOf, balance, isOverdue } = useData()
  const active = db.subs.filter((s) => s.status === 'Active').length
  const revenue = db.payments.reduce((s, p) => s + p.amount, 0)
  const owed = db.invoices.reduce((s, i) => s + balance(i), 0)
  const overdue = db.invoices.filter(isOverdue)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Subscriptions, revenue and what is still owed.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active subscriptions" value={active} />
        <Stat label="Revenue collected" value={money(revenue)} />
        <Stat label="Still owed" value={money(owed)} />
        <Stat label="Overdue invoices" value={overdue.length} tone={overdue.length ? 'text-rose-600' : ''} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-medium">Revenue, last 6 months</h2>
        <RevenueChart data={monthlyRevenue(db.payments)} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-base font-medium">Overdue invoices</h2>
          <Link to="/overdue" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{['Invoice', 'Customer', 'Was due', 'Balance'].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {overdue.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">No overdue invoices.</td></tr>}
              {overdue.slice(0, 5).map((i) => (
                <tr key={i.id}><td className={td}>{i.no}</td><td className={td}>{nameOf(i.customerId)}</td><td className={td}>{i.due}</td><td className={td}>{money(balance(i))}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}