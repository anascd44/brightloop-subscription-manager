import CrudPage from '../components/CrudPage'
import { today, addDays } from '../store/DataContext'

export default function Plans() {
  return (
    <CrudPage
      title="Subscription Plans"
      collection="plans"
      fields={[
        { key: 'name', label: 'Plan name', required: true },
        { key: 'period', label: 'Billing period', options: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly' },
        { key: 'minQty', label: 'Minimum quantity', type: 'number', default: 1 },
        { key: 'from', label: 'Available from', type: 'date', default: today() },
        { key: 'to', label: 'Available until', type: 'date', default: addDays(today(), 365) },
        { key: 'closeOnEnd', label: 'Closes on its own', type: 'checkbox', default: true },
        { key: 'pausable', label: 'Can be paused', type: 'checkbox', default: true },
      ]}
      columns={[['Plan', (r) => r.name], ['Billing', (r) => r.period], ['Min qty', (r) => r.minQty], ['Available', (r) => `${r.from} to ${r.to}`], ['Rules', (r) => [r.closeOnEnd && 'auto-close', r.pausable && 'pausable'].filter(Boolean).join(', ')]]}
    />
  )
}