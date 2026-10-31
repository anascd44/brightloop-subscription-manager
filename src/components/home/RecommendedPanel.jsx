import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import './home.css'

export default function RecommendedPanel({ items, onExplore }) {
  return (
    <section className="panel" aria-labelledby="rec-title">
      <header className="panel-header">
        <h2 id="rec-title" className="panel-title">// Recommended for you</h2>
      </header>
      <ul className="rec-grid">
        {items.map((r) => {
          const Icon = r.icon
          return (
            <li key={r.id} className="rec-card">
              <div className={`icon-tile icon-tile--sm${r.tone === 'cyan' ? ' icon-tile--cyan' : ''}`}><Icon size={24} /></div>
              <h3 className="rec-name">{r.name}</h3>
              <p className="rec-price">{formatCurrency(r.pricePerMonth)}/mo</p>
              <button type="button" className="btn-outline" onClick={() => onExplore?.(r)}>
                Explore <ArrowRight size={16} />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
