// import api from './api'  // switch to real API later
import {
  dashboardStats, revenueByMonth, subscriptionGrowth,
  recentSubscriptions, recentPayments,
} from '../data/dashboardMock'

const fakeDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 300))

export function getDashboardData() {
  // Later: return api.get('/dashboard').then((res) => res.data)
  return fakeDelay({
    stats: dashboardStats,
    revenueByMonth,
    subscriptionGrowth,
    recentSubscriptions,
    recentPayments,
  })
}