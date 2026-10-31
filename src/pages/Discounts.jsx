import CrudPage from '../components/CrudPage'
import { today, addDays, money } from '../store/DataContext'

export default function Discounts() {
  return (
    <CrudPage
      title="Discounts"
      collection="discounts"
      fields={[
        { key: 'code', label: 'Code', required: true },
        { key: 'kind', label: 'Type', options: ['percent', 'fixed'], default: 'percent' },
        { key: 'value', label: 'Value', type: 'number', required: true },
        { key: 'minAmount', label: 'Minimum purchase', type: 'number', default: 0 },
        { key: 'minQty', label: 'Minimum quantity', type: 'number', default: 0 },
        { key: 'from', label: 'Starts', type: 'date', default: today() },
        { key: 'to', label: 'Ends', type: 'date', default: addDays(today(), 90) },
        { key: 'limit', label: 'Usage limit', type: 'number', default: 100 },
        { key: 'used', label: 'Used so far', type: 'number', default: 0 },
      ]}
      columns={[['Code', (r) => r.code], ['Value', (r) => (r.kind === 'percent' ? `${r.value}%` : money(r.value))], ['Needs', (r) => `${money(r.minAmount)} / ${r.minQty} qty`], ['Valid', (r) => `${r.from} to ${r.to}`], ['Used', (r) => `${r.used} / ${r.limit}`]]}
    />
  )
}