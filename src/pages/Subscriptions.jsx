import { useState } from 'react'
import { CheckCircle, Download, FileText, RefreshCw, XCircle } from 'lucide-react'
import { formatCurrency } from '../utils/format'
import './subscriptions.css'

export default function Subscriptions() {
  const [products, setProducts] = useState([
    { id: 'sub-1', name: 'Storage Plus', plan: 'Enterprise Monthly', price: 1200, nextBilling: '2026-11-30', autoRenew: true, status: 'Active' },
    { id: 'sub-2', name: 'Analytics Plus', plan: 'Pro Monthly', price: 1000, nextBilling: '2026-12-30', autoRenew: true, status: 'Active' },
    { id: 'sub-3', name: 'Security Pro', plan: 'Business Yearly', price: 1300, nextBilling: '2027-01-30', autoRenew: false, status: 'Active' }
  ])

  const [invoices, setInvoices] = useState([
    { id: 'INV/2026/0001', date: '2026-10-15', dueDate: '2026-10-30', total: 1200, status: 'Paid' },
    { id: 'INV/2026/0002', date: '2026-10-01', dueDate: '2026-10-15', total: '1000', status: 'Posted' },
    { id: 'INV/2026/0003', date: '2026-09-15', dueDate: '2026-09-30', total: 1200, status: 'Paid' }
  ])

  // Global Actions
  const handleCancelAll = () => {
    setProducts(products.map(p => ({ ...p, autoRenew: false, status: 'Cancelled' })))
  }

  const handleRenewAllCurrent = () => {
    setProducts(products.map(p => ({ ...p, autoRenew: true, status: 'Active' })))
  }

  // Per Product Actions
  const toggleAutoRenew = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, autoRenew: !p.autoRenew } : p))
  }

  const cancelRenewal = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, autoRenew: false } : p))
  }

  const extendCurrentPlan = (id) => {
    alert(`Extended subscription ${id} with current plan successfully.`)
  }

  const extendDifferentPlan = (id) => {
    alert(`Opening plan selector for subscription ${id}...`)
  }

  return (
    <div className="sub-page">
      <h1 className="page-title">// Subscription Management</h1>

      {/* Current Plans Section */}
      <section className="panel" style={{ marginBottom: '24px' }}>
        <header className="panel-header">
          <h2 className="panel-title">// Current Plans & Global Controls</h2>
          <div className="pill-group">
            <button type="button" className="btn-outline" onClick={handleRenewAllCurrent}>
              Renew All (Current Plan)
            </button>
            <button type="button" className="btn-outline" style={{ borderColor: '#ef4444', color: '#fca5a5' }} onClick={handleCancelAll}>
              Cancel All
            </button>
          </div>
        </header>

        <div className="sub-product-list">
          {products.map((prod) => (
            <div key={prod.id} className="sub-product-card">
              <div className="sub-product-info">
                <h3 className="sub-prod-name">{prod.name}</h3>
                <p className="sub-prod-details">Plan: {prod.plan} | {formatCurrency(prod.price)}/mo</p>
                <p className="sub-prod-billing">Next renewal: {prod.nextBilling} | Status: <span className={prod.status === 'Active' ? 'text-accent' : 'text-muted'}>{prod.status}</span></p>
              </div>

              <div className="sub-product-actions">
                <label className="sub-toggle-label">
                  <input 
                    type="checkbox" 
                    checked={prod.autoRenew} 
                    onChange={() => toggleAutoRenew(prod.id)} 
                  />
                  Auto-renew
                </label>
                <button type="button" className="btn-outline" onClick={() => extendCurrentPlan(prod.id)}>
                  Extend (Current)
                </button>
                <button type="button" className="btn-outline" onClick={() => extendDifferentPlan(prod.id)}>
                  Extend (Different)
                </button>
                <button type="button" className="btn-outline" onClick={() => cancelRenewal(prod.id)}>
                  Cancel Renewal
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Odoo Style Invoices & Payments Section */}
      <section className="panel">
        <header className="panel-header">
          <h2 className="panel-title">// Invoices & Payments (Odoo Accounting)</h2>
        </header>

        <div className="odoo-table-wrapper">
          <table className="odoo-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-accent">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td>{formatCurrency(Number(inv.total))}</td>
                  <td>
                    <span className={`odoo-badge ${inv.status === 'Paid' ? 'is-paid' : 'is-posted'}`}>
                      {inv.status === 'Paid' ? <CheckCircle size={14} /> : <FileText size={14} />}
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button type="button" className="btn-outline" style={{ padding: '4px 10px', fontSize: '13px' }} onClick={() => alert(`Downloading PDF for ${inv.id}`)}>
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
