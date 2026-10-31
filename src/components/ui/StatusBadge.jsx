const styles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Confirmed: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  Quotation: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  Draft: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Closed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Overdue: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  Failed: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

export default function StatusBadge({ status }) {
  const style = styles[status] || styles.Draft
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {status}
    </span>
  )
}