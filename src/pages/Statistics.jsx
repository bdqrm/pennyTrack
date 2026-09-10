import { useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { LinkRow } from '../components/CardHeader.jsx'
import useEnrichedExpenses from '../hooks/useEnrichedExpenses.js'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency } from '../store/settingsStore.js'
import { formatMoney } from '../utils/currency.js'
import { currentMonthKey, formatDayShort, lastNDays } from '../utils/date.js'
import { filterByMonth, sum } from '../utils/stats.js'

const PERIODS = [
  { id: 'month', label: 'This month' },
  { id: 'all', label: 'All time' },
]

export default function Statistics() {
  const currency = useCurrency()
  const expenses = useEnrichedExpenses()
  const categories = useDataStore((s) => s.categories)
  const [period, setPeriod] = useState('month')

  const monthKey = currentMonthKey()

  const periodExpenses = useMemo(() => {
    return period === 'month' ? filterByMonth(expenses, monthKey) : expenses
  }, [expenses, period, monthKey])

  const byCategory = useMemo(() => {
    const totals = new Map()
    for (const e of periodExpenses) {
      totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + Number(e.amount))
    }
    const max = Math.max(0, ...totals.values())
    return [...totals.entries()]
      .map(([categoryId, amount]) => ({
        category: categories.find((c) => c.id === categoryId) ?? categories[0],
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .map((row) => ({ ...row, pct: max > 0 ? (row.amount / max) * 100 : 0 }))
  }, [periodExpenses, categories])

  const byDay = useMemo(() => {
    const days = lastNDays(7)
    return days.map((day) => ({
      day,
      label: formatDayShort(day),
      amount: sum(expenses.filter((e) => e.date === day)),
    }))
  }, [expenses])

  const maxDay = Math.max(1, ...byDay.map((d) => d.amount))
  const totalPeriod = sum(periodExpenses)

  return (
    <div>
      <PageHeader
        title="Statistics"
        subtitle={`${formatMoney(totalPeriod, currency)} spent · ${periodExpenses.length} expense${periodExpenses.length === 1 ? '' : 's'}`}
        action={<LinkRow to="/reports">Report</LinkRow>}
      />

      <div className="segmented">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            className={period === p.id ? 'active' : ''}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {periodExpenses.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <BarChart3 size={26} />
            </div>
            <p>No spending data for this period.</p>
            <p className="text-muted">Add expenses to see your statistics.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card fade-up" style={{ paddingBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>
              Spending by category
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {period === 'month' ? 'Current month' : 'All recorded expenses'}
            </p>
            <div style={{ marginTop: 10 }}>
              {byCategory.map((row, i) => (
                <div key={row.category.id} className="fade-up" style={{ animationDelay: `${i * 45}ms` }}>
                  <div className="bar-row">
                    <span
                      className="expense-badge"
                      style={{ width: 34, height: 34, borderRadius: 10, background: `${row.category.color}2e`, color: '#fff' }}
                    >
                      {row.category.icon && <row.category.icon size={16} strokeWidth={2.1} />}
                    </span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${row.pct}%`, background: row.category.color }}
                      />
                    </div>
                    <div className="bar-value">{formatMoney(row.amount, currency)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card fade-up" style={{ marginTop: 8, paddingBottom: 8, animationDelay: '80ms' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>Spending by day</h2>
            <p className="muted" style={{ margin: 0 }}>
              Last 7 days
            </p>
            <div style={{ marginTop: 10 }}>
              {byDay.map((d, i) => (
                <div key={d.day} className="fade-up" style={{ animationDelay: `${80 + i * 45}ms` }}>
                  <div className="bar-row">
                    <div className="bar-meta">
                      <div className="bar-name">{d.label}</div>
                      <div className="bar-sub">{d.amount > 0 ? formatMoney(d.amount, currency) : 'no expenses'}</div>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(d.amount / maxDay) * 100}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}