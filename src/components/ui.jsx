export const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
export const btn = {
  primary: 'rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700',
  ghost: 'rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100',
}

export function Page({ title, children }) {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export const Card = ({ children }) => <div className="rounded-xl border border-slate-200 bg-white p-4">{children}</div>

export const Field = ({ label, children }) => (
  <label className="block text-xs font-medium text-slate-600">{label}<div className="mt-1">{children}</div></label>
)

const tone = { Active: 'bg-emerald-100 text-emerald-700', Paid: 'bg-emerald-100 text-emerald-700', Overdue: 'bg-red-100 text-red-700', Confirmed: 'bg-amber-100 text-amber-700', Quotation: 'bg-amber-100 text-amber-700' }
export const Badge = ({ s }) => <span className={`rounded-full px-2 py-0.5 text-xs ${tone[s] || 'bg-slate-100 text-slate-600'}`}>{s}</span>

export function Table({ head, rows, empty = 'Nothing here yet.' }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-slate-500">{empty}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-slate-200 text-slate-500">{head.map((h, i) => <th key={i} className="px-2 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-slate-100">{r.map((c, j) => <td key={j} className="whitespace-nowrap px-2 py-2">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}