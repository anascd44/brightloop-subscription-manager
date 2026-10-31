import { useId, useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, ChevronDown, ChevronUp, Package } from 'lucide-react'
import { DEFAULT_VISIBLE, SORT_OPTIONS, formatBillingDate, sortProducts } from './subscribedProducts.utils'
import './SubscribedProducts.css'

export default function SubscribedProducts({ products, onManage, initialSort = 'recent', visibleCount = DEFAULT_VISIBLE }) {
  const [sort, setSort] = useState(initialSort)
  const [expanded, setExpanded] = useState(false)
  const listId = useId()

  const sorted = useMemo(() => sortProducts(products, sort), [products, sort])
  const hiddenCount = Math.max(0, sorted.length - visibleCount)
  const shown = expanded ? sorted : sorted.slice(0, visibleCount)

  return (
    <section className="panel" aria-labelledby={`${listId}-title`}>
      <header className="panel-header">
        <div className="sp-title-wrap">
          <h2 id={`${listId}-title`} className="panel-title">// Subscribed Products</h2>
          <span className="sp-count">{String(products.length).padStart(2, '0')} PRODUCTS</span>
        </div>
        <div className="pill-group" role="group" aria-label="Sort subscribed products">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={sort === opt.id}
              className={`pill${sort === opt.id ? ' is-active' : ''}`}
              onClick={() => setSort(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {products.length === 0 ? (
        <p className="sp-empty">No subscribed products yet.</p>
      ) : (
        <ul id={listId} className="sp-grid">
          {shown.map((p) => {
            const Icon = p.icon ?? Package
            return (
              <li key={p.id} className="sp-card">
                <div className="sp-card-top">
                  <div className={`icon-tile${p.tone === 'cyan' ? ' icon-tile--cyan' : ''}`}><Icon size={26} strokeWidth={2} /></div>
                  <div className="sp-card-text">
                    <h3 className="sp-name">{p.name}</h3>
                    <p className="sp-desc">{p.description}</p>
                  </div>
                  <button type="button" className="btn-outline" onClick={() => onManage?.(p)}>
                    Manage <ArrowRight size={16} />
                  </button>
                </div>
                <div className="sp-card-bottom">
                  <CalendarDays size={16} />
                  <span>Next billing: {formatBillingDate(p.nextBilling)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {hiddenCount > 0 && (
        <div className="sp-footer">
          <button
            type="button"
            className="btn-outline"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  )
}
