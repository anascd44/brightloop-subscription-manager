import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import './home.css'

const RANGES = ['7d', '30d', '1y']
const compactUsers = (n) => `${(n / 1000).toFixed(1)}k+ users`

export default function TrendingPanel({ trending }) {
  const [range, setRange] = useState('7d')
  const rows = trending[range] ?? []

  return (
    <section className="panel" aria-labelledby="trend-title">
      <header className="panel-header">
        <h2 id="trend-title" className="panel-title">// Trending Products</h2>
        <div className="pill-group" role="group" aria-label="Trending period">
          {RANGES.map((r) => (
            <button key={r} type="button" aria-pressed={range === r} className={`pill${range === r ? ' is-active' : ''}`} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </header>
      <ol className="trend-list">
        {rows.map((t, i) => {
          const Icon = t.icon
          return (
            <li key={t.id} className="trend-row">
              <span className="trend-rank">{i + 1}</span>
              <Icon size={24} className={`trend-icon${t.tone === 'cyan' ? ' is-cyan' : ''}`} />
              <span className="trend-name">{t.name}</span>
              <span className="trend-users">{compactUsers(t.users)}</span>
              <span className="trend-growth"><ArrowUp size={16} /> +{t.growthPct}%</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
