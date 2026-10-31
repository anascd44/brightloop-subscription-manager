import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Layers, Repeat, Percent, Tag, Users, UserCog,
  FileText, FileCheck, Receipt, CreditCard, BarChart3, AlertTriangle,
} from 'lucide-react'

const sections = [
  { label: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Catalog', items: [
    { to: '/products', label: 'Products', icon: Package },
    { to: '/variants', label: 'Variants', icon: Layers },
    { to: '/plans', label: 'Subscription Plans', icon: Repeat },
    { to: '/taxes', label: 'Taxes', icon: Percent },
    { to: '/discounts', label: 'Discounts', icon: Tag },
  ] },
  { label: 'People', items: [
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/staff', label: 'Staff', icon: UserCog },
  ] },
  { label: 'Sales', items: [
    { to: '/quotations', label: 'Quotations', icon: FileText },
    { to: '/subscriptions', label: 'Subscriptions', icon: FileCheck },
    { to: '/invoices', label: 'Invoices', icon: Receipt },
    { to: '/payments', label: 'Payments', icon: CreditCard },
  ] },
  { label: 'Insights', items: [
    { to: '/reports', label: 'Revenue Reports', icon: BarChart3 },
    { to: '/overdue', label: 'Overdue Invoices', icon: AlertTriangle },
  ] },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            B
          </div>
          <span className="text-base font-semibold tracking-tight text-slate-900">Brightloop</span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}