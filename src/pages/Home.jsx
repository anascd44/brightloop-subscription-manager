import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubscribedProducts from '../components/home/SubscribedProducts'
import RecommendedPanel from '../components/home/RecommendedPanel'
import TrendingPanel from '../components/home/TrendingPanel'
import SystemSummary from '../components/home/SystemSummary'
import { getHomeData } from '../services/homeService'
import { formatCurrency } from '../utils/format'
import { formatBillingDate } from '../components/home/subscribedProducts.utils'
import './home.css'

export default function Home() {
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    getHomeData().then((d) => {
      if (active) setData(d)
    })
    return () => {
      active = false
    }
  }, [])

  if (!data) {
    return <p className="home-loading">// loading your products...</p>
  }

  const { subscriptions, recommended, trending, pendingInvoices } = data
  const monthly = subscriptions.reduce((sum, s) => sum + s.pricePerMonth, 0)
  const nextBilling = subscriptions.map((s) => s.nextBilling).sort()[0]

  return (
    <div className="home">
      <SubscribedProducts products={subscriptions} onManage={() => navigate('/subscriptions')} />

      <div className="home-row">
        <RecommendedPanel items={recommended} />
        <TrendingPanel trending={trending} />
      </div>

      <SystemSummary
        subscribedCount={subscriptions.length}
        monthlyCommitment={formatCurrency(monthly)}
        pendingInvoices={pendingInvoices}
        nextPayment={nextBilling ? formatBillingDate(nextBilling) : '—'}
      />
    </div>
  )
}
