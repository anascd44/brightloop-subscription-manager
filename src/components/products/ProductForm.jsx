import { useState } from 'react'
import { productTypes } from '../../data/productsMock'

const input =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400'

export default function ProductForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    type: initial?.type ?? productTypes[0],
    salesPrice: initial?.salesPrice ?? '',
    costPrice: initial?.costPrice ?? '',
    notes: initial?.notes ?? '',
  })
  const [error, setError] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Product name is required.')
    const salesPrice = Number(form.salesPrice)
    const costPrice = Number(form.costPrice)
    if (Number.isNaN(salesPrice) || Number.isNaN(costPrice) || salesPrice < 0 || costPrice < 0) {
      return setError('Prices must be valid numbers (0 or more).')
    }
    setError('')
    onSubmit({ ...form, name: form.name.trim(), salesPrice, costPrice })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Product name</label>
        <input name="name" value={form.name} onChange={change} className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
        <select name="type" value={form.type} onChange={change} className={input}>
          {productTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sales price (₹)</label>
          <input name="salesPrice" type="number" min="0" value={form.salesPrice} onChange={change} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Cost price (₹)</label>
          <input name="costPrice" type="number" min="0" value={form.costPrice} onChange={change} className={input} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <textarea name="notes" rows={3} value={form.notes} onChange={change} className={input} />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save product'}
        </button>
      </div>
    </form>
  )
}