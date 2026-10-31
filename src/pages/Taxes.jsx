import CrudPage from '../components/CrudPage'

export default function Taxes() {
  return (
    <CrudPage
      title="Taxes"
      collection="taxes"
      fields={[
        { key: 'name', label: 'Tax name', required: true },
        { key: 'rate', label: 'Rate (%)', type: 'number', required: true },
        { key: 'active', label: 'Apply to invoices', type: 'checkbox', default: true },
      ]}
      columns={[['Tax', (r) => r.name], ['Rate', (r) => `${r.rate}%`], ['Applied', (r) => (r.active ? 'Yes' : 'No')]]}
    />
  )
}