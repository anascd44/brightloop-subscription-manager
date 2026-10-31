import { useEffect, useState } from 'react'
import { Repeat, Users, TrendingUp, Wallet, Clock, AlertTriangle } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import RevenueChart from '../components/dashboard/RevenueChart'
import GrowthChart from '../components/dashboard/GrowthChart'
import { getDashboardData } from '../services/dashboardService'
import { formatCurrency, formatNumber } from '../utils/format'

const th = 'px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'
const td = 'px-5 py-3 text-sm text-slate-700'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true
    getDashboardData().then((d) => {
      if (active) setData(d)
    })
    return () => {
      active = false
    }
  }, [])

  if (!data) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>
  }

  const { stats } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your subscription business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active subscriptions" value={formatNumber(stats.activeSubscriptions)} icon={Repeat} tone="indigo" />
        <StatCard label="Total customers" value={formatNumber(stats.totalCustomers)} icon={Users} tone="slate" />
        <StatCard label="Monthly recurring revenue" value={formatCurrency(stats.mrr)} icon={TrendingUp} tone="emerald" />
        <StatCard label="Revenue collected" value={formatCurrency(stats.revenueCollected)} icon={Wallet} tone="emerald" />
        <StatCard label="Outstanding payments" value={formatCurrency(stats.outstanding)} icon={Clock} tone="amber" />
        <StatCard label="Overdue invoices" value={formatNumber(stats.overdueInvoices)} icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Revenue" subtitle="Monthly recurring revenue, last 6 months">
          <RevenueChart data={data.revenueByMonth} />
        </Card>
        <Card title="Subscription growth" subtitle="Active subscriptions, last 6 months">
          <GrowthChart data={data.subscriptionGrowth} />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold">Recent subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={th}>ID</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Plan</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentSubscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className={`${td} font-medium text-slate-900`}>{s.id}</td>
                    <td className={td}>{s.customer}</td>
                    <td className={td}>{s.plan}</td>
                    <td className={td}><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold">Recent payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className={th}>ID</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Amount</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className={`${td} font-medium text-slate-900`}>{p.id}</td>
                    <td className={td}>{p.customer}</td>
                    <td className={td}>{formatCurrency(p.amount)}</td>
                    <td className={td}><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}