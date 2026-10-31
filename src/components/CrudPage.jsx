import { useState } from 'react'
import { useData } from '../store/DataContext'
import { Page, Card, Field, Table, inputCls, btn } from './ui'

export default function CrudPage({ title, collection, fields, columns }) {
  const { db, add } = useData()
  const blank = Object.fromEntries(fields.map((f) => [f.key, f.default ?? '']))
  const [form, setForm] = useState(blank)
  const [err, setErr] = useState('')

  const save = () => {
    const missing = fields.find((f) => f.required && form[f.key] === '')
    if (missing) return setErr(`${missing.label} is required.`)
    const row = { ...form }
    fields.forEach((f) => { if (f.type === 'number') row[f.key] = Number(row[f.key]) })
    add(collection, row)
    setForm(blank)
    setErr('')
  }

  return (
    <Page title={title}>
      <Card>
        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === 'checkbox' ? (
                <input type="checkbox" checked={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
              ) : f.options ? (
                <select className={inputCls} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
              ) : (
                <input className={inputCls} type={f.type || 'text'} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              )}
            </Field>
          ))}
          <button className={btn.primary} onClick={save}>Save</button>
        </div>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </Card>
      <Card><Table head={columns.map((c) => c[0])} rows={db[collection].map((r) => columns.map((c) => c[1](r)))} /></Card>
    </Page>
  )
}