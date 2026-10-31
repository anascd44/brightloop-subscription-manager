import './home.css'
const pad = (n) => String(n).padStart(2, '0')

export default function SystemSummary({ subscribedCount, monthlyCommitment, pendingInvoices, nextPayment }) {
  const cells = [
    { label: 'Subscribed Products', value: pad(subscribedCount) },
    { label: 'Monthly Commitment', value: monthlyCommitment },
    { label: 'Pending Invoices', value: pad(pendingInvoices) },
    { label: 'Next Payment', value: nextPayment },
  ]
  return (
    <section className="panel" aria-labelledby="sum-title">
      <header className="panel-header">
        <h2 id="sum-title" className="panel-title">// System Summary</h2>
      </header>
      <dl className="sum-grid">
        {cells.map((c) => (
          <div key={c.label} className="sum-cell">
            <dt>{c.label}</dt>
            <dd>{c.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
