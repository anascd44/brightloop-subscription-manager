import CrudPage from '../components/CrudPage'

export default function Staff() {
  return (
    <CrudPage
      title="Staff"
      collection="staff"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'email', label: 'Email', type: 'email', required: true },
        { key: 'role', label: 'Access', options: ['staff', 'admin'], default: 'staff' },
      ]}
      columns={[['Name', (r) => r.name], ['Email', (r) => r.email], ['Access', (r) => r.role]]}
    />
  )
}