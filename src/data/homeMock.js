import { Activity, Box, ChartColumn, Cloud, Database, Mail, Network, Server, ShieldCheck, TrendingUp } from 'lucide-react'
export const subscriptions = [
  { id: 'storage-plus', name: 'Storage Plus', description: 'Secure and scalable storage', icon: Database, tone: 'green', pricePerMonth: 1200, nextBilling: '2026-11-30', lastUsedAt: '2026-10-31T09:10:00Z', usageCount: 1240, subscribedAt: '2026-03-12T00:00:00Z' },
  { id: 'analytics-plus', name: 'Analytics Plus', description: 'Insights for your business', icon: ChartColumn, tone: 'cyan', pricePerMonth: 1000, nextBilling: '2026-12-30', lastUsedAt: '2026-10-30T16:45:00Z', usageCount: 860, subscribedAt: '2026-06-02T00:00:00Z' },
  { id: 'security-pro', name: 'Security Pro', description: 'Advanced business protection', icon: ShieldCheck, tone: 'green', pricePerMonth: 1300, nextBilling: '2027-01-30', lastUsedAt: '2026-10-28T11:00:00Z', usageCount: 430, subscribedAt: '2026-08-21T00:00:00Z' },
  { id: 'backup-cloud', name: 'Backup Cloud', description: 'Reliable automated backups', icon: Cloud, tone: 'cyan', pricePerMonth: 1000, nextBilling: '2027-02-28', lastUsedAt: '2026-10-25T07:30:00Z', usageCount: 1510, subscribedAt: '2026-01-18T00:00:00Z' },
]
export const recommended = [
  { id: 'team-workspace', name: 'Team Workspace', icon: Box, tone: 'cyan', pricePerMonth: 349 },
  { id: 'advanced-reports', name: 'Advanced Reports', icon: TrendingUp, tone: 'cyan', pricePerMonth: 249 },
]
export const trending = {
  '7d': [
    { id: 'cloud-hosting', name: 'Cloud Hosting', icon: Cloud, tone: 'cyan', users: 24500, growthPct: 18 },
    { id: 'business-analytics', name: 'Business Analytics', icon: ChartColumn, tone: 'green', users: 18200, growthPct: 14 },
  ],
  '30d': [{ id: 'business-analytics', name: 'Business Analytics', icon: ChartColumn, tone: 'green', users: 61300, growthPct: 31 }],
  '1y': [{ id: 'cloud-hosting', name: 'Cloud Hosting', icon: Cloud, tone: 'cyan', users: 412000, growthPct: 64 }],
}
export const pendingInvoices = 2
