export const dashboardStats = {
  activeSubscriptions: 128,
  totalCustomers: 342,
  mrr: 485000,
  revenueCollected: 1240000,
  outstanding: 186000,
  overdueInvoices: 14,
}

export const revenueByMonth = [
  { month: 'May', revenue: 310000 },
  { month: 'Jun', revenue: 352000 },
  { month: 'Jul', revenue: 398000 },
  { month: 'Aug', revenue: 421000 },
  { month: 'Sep', revenue: 458000 },
  { month: 'Oct', revenue: 485000 },
]

export const subscriptionGrowth = [
  { month: 'May', subscriptions: 82 },
  { month: 'Jun', subscriptions: 91 },
  { month: 'Jul', subscriptions: 103 },
  { month: 'Aug', subscriptions: 112 },
  { month: 'Sep', subscriptions: 121 },
  { month: 'Oct', subscriptions: 128 },
]

export const recentSubscriptions = [
  { id: 'SUB-1042', customer: 'Acme Corp', plan: 'Pro Monthly', status: 'Active', date: '2026-10-29' },
  { id: 'SUB-1041', customer: 'Northwind Ltd', plan: 'Business Yearly', status: 'Confirmed', date: '2026-10-28' },
  { id: 'SUB-1040', customer: 'Globex Inc', plan: 'Starter Monthly', status: 'Active', date: '2026-10-27' },
  { id: 'SUB-1039', customer: 'Initech', plan: 'Pro Weekly', status: 'Draft', date: '2026-10-26' },
  { id: 'SUB-1038', customer: 'Umbrella Co', plan: 'Business Monthly', status: 'Active', date: '2026-10-25' },
]

export const recentPayments = [
  { id: 'PAY-5521', customer: 'Acme Corp', method: 'Card', amount: 12999, status: 'Paid', date: '2026-10-30' },
  { id: 'PAY-5520', customer: 'Globex Inc', method: 'UPI', amount: 4999, status: 'Paid', date: '2026-10-29' },
  { id: 'PAY-5519', customer: 'Northwind Ltd', method: 'Bank Transfer', amount: 89999, status: 'Pending', date: '2026-10-28' },
  { id: 'PAY-5518', customer: 'Umbrella Co', method: 'Card', amount: 24999, status: 'Paid', date: '2026-10-27' },
  { id: 'PAY-5517', customer: 'Initech', method: 'UPI', amount: 2999, status: 'Failed', date: '2026-10-26' },
]
