import { useEffect, useState } from 'react'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import Modal from '../components/ui/Modal'
import ProductForm from '../components/products/ProductForm'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import { formatCurrency } from '../utils/format'

const th = 'px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'
const td = 'px-5 py-3 text-sm text-slate-700'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getProducts().then((d) => {
      if (active) {
        setProducts(d)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const refresh = async () => setProducts(await getProducts())

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleSave = async (values) => {
    setSaving(true)
    if (editing) await updateProduct(editing.id, values)
    else await createProduct(values)
    await refresh()
    setSaving(false)
    setFormOpen(false)
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    await deleteProduct(p.id)
    await refresh()
  }

  const filtered = products.filter((p) =>
    `${p.id} ${p.name} ${p.type}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage what you sell.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus size={16} /> Add product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Type</th>
                <th className={th}>Sales price</th>
                <th className={th}>Cost price</th>
                <th className={`${th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">No products found.</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className={td}>
                    <p className="font-medium text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.id}</p>
                  </td>
                  <td className={td}>{p.type}</td>
                  <td className={td}>{formatCurrency(p.salesPrice)}</td>
                  <td className={td}>{formatCurrency(p.costPrice)}</td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setViewing(p)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="View"><Eye size={16} /></button>
                      <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(p)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50" aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={formOpen} title={editing ? 'Edit product' : 'Add product'} onClose={() => setFormOpen(false)}>
        <ProductForm initial={editing} onSubmit={handleSave} onCancel={() => setFormOpen(false)} saving={saving} />
      </Modal>

      <Modal open={!!viewing} title="Product details" onClose={() => setViewing(null)}>
        {viewing && (
          <dl className="space-y-3 text-sm">
            <div><dt className="text-slate-500">ID</dt><dd className="font-medium">{viewing.id}</dd></div>
            <div><dt className="text-slate-500">Name</dt><dd className="font-medium">{viewing.name}</dd></div>
            <div><dt className="text-slate-500">Type</dt><dd className="font-medium">{viewing.type}</dd></div>
            <div><dt className="text-slate-500">Sales price</dt><dd className="font-medium">{formatCurrency(viewing.salesPrice)}</dd></div>
            <div><dt className="text-slate-500">Cost price</dt><dd className="font-medium">{formatCurrency(viewing.costPrice)}</dd></div>
            <div><dt className="text-slate-500">Notes</dt><dd>{viewing.notes || '—'}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  )
}