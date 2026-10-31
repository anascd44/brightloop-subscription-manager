import { useState } from 'react'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import { useData, money } from '../store/DataContext'

const th = 'px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500'
const td = 'px-4 py-2.5 text-sm text-slate-700'
const input = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400'
const blank = { name: '', email: '', phone: '', address: '' }

function MiniTable({ title, head, rows }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {rows.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">Nothing yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>{head.map((h) => <th key={h} className={th}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i}>{r.map((cell, j) => <td key={j} className={td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function Customers() {
  const { db, add, patch, remove, balance } = useData()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const [viewingId, setViewingId] = useState(null)

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openAdd = () => {
    setEditing(null)
    setForm(blank)
    setError('')
    setFormOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', address: c.address || '' })
    setError('')
    setFormOpen(true)
  }

  const save = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Customer name is required.')
    if (form.email && !form.email.includes('@')) return setError('Enter a valid email address.')
    const values = { ...form, name: form.name.trim() }
    if (editing) patch('customers', editing.id, values)
    else add('customers', values)
    setFormOpen(false)
  }

  const handleDelete = (c) => {
    if (db.subs.some((s) => s.customerId === c.id)) {
      return window.alert(`${c.name} has subscriptions and cannot be deleted.`)
    }
    if (window.confirm(`Delete "${c.name}"?`)) remove('customers', c.id)
  }

  const statsFor = (c) => {
    const active = db.subs.filter((s) => s.customerId === c.id && s.status === 'Active').length
    const due = db.invoices
      .filter((i) => i.customerId === c.id && i.status === 'Confirmed')
      .reduce((t, i) => t + balance(i), 0)
    return { active, due }
  }

  const filtered = db.customers.filter((c) =>
    `${c.name} ${c.email || ''} ${c.phone || ''}`.toLowerCase().includes(query.toLowerCase())
  )

  const viewed = db.customers.find((c) => c.id === viewingId)
  const vSubs = viewed ? db.subs.filter((s) => s.customerId === viewed.id) : []
  const vInvoices = viewed ? db.invoices.filter((i) => i.customerId === viewed.id) : []
  const vPayments = db.payments.filter((p) => vInvoices.some((i) => i.id === p.invoiceId))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Contacts and their billing history.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={16} /> Add customer
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Customer</th>
                <th className={th}>Contact</th>
                <th className={th}>Active subs</th>
                <th className={th}>Outstanding</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">No customers found.</td></tr>
              )}
              {filtered.map((c) => {
                const st = statsFor(c)
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className={td}>
                      <p className="font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.id}</p>
                    </td>
                    <td className={td}>
                      <p>{c.email || '—'}</p>
                      <p className="text-xs text-slate-400">{c.phone || ''}</p>
                    </td>
                    <td className={td}>{st.active}</td>
                    <td className={td}>{money(st.due)}</td>
                    <td className={`${td} text-right`}>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setViewingId(c.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="View"><Eye size={16} /></button>
                        <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Edit"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(c)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={formOpen} title={editing ? 'Edit customer' : 'Add customer'} onClose={() => setFormOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input name="name" value={form.name} onChange={change} className={input} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input name="email" value={form.email} onChange={change} className={input} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
              <input name="phone" value={form.phone} onChange={change} className={input} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <textarea name="address" rows={2} value={form.address} onChange={change} className={input} />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Save customer</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewed} title={viewed?.name || 'Customer'} onClose={() => setViewingId(null)} wide>
        {viewed && (
          <div className="space-y-5">
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{viewed.email || '—'}</dd></div>
              <div><dt className="text-slate-500">Phone</dt><dd className="font-medium">{viewed.phone || '—'}</dd></div>
              <div><dt className="text-slate-500">Address</dt><dd className="font-medium">{viewed.address || '—'}</dd></div>
            </dl>
            <MiniTable
              title="Subscription history"
              head={['No.', 'Plan', 'Status', 'Next bill']}
              rows={vSubs.map((s) => [
                s.no,
                db.plans.find((p) => p.id === s.planId)?.name || '—',
                <StatusBadge key={s.id} status={s.status} />,
                s.nextBill,
              ])}
            />
            <MiniTable
              title="Invoice history"
              head={['No.', 'Date', 'Total', 'Status']}
              rows={vInvoices.map((i) => [i.no, i.date, money(i.total), <StatusBadge key={i.id} status={i.status} />])}
            />
            <MiniTable
              title="Payment history"
              head={['Payment', 'Invoice', 'Amount', 'Date']}
              rows={vPayments.map((p) => [
                p.id,
                vInvoices.find((i) => i.id === p.invoiceId)?.no || '—',
                money(p.amount),
                p.date || '—',
              ])}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}