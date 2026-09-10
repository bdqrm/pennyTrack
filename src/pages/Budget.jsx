import { useMemo, useState } from 'react'
import { Target, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AnimatedMoney from '../components/AnimatedMoney.jsx'
import useEnrichedExpenses from '../hooks/useEnrichedExpenses.js'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency } from '../store/settingsStore.js'
import { formatMoney } from '../utils/currency.js'
import { currentMonthKey, formatMonthYear } from '../utils/date.js'
import { filterByMonth, sum } from '../utils/stats.js'

export default function Budget() {
  const currency = useCurrency()
  const budget = useDataStore((s) => s.budget)
  const setBudget = useDataStore((s) => s.setBudget)
  const clearBudget = useDataStore((s) => s.clearBudget)
  const expenses = useEnrichedExpenses()

  const monthKey = currentMonthKey()
  const isCurrent = budget?.monthKey === monthKey
  const budgetAmount = isCurrent && budget ? Number(budget.amount) : 0
  const spent = useMemo(() => sum(filterByMonth(expenses, monthKey)), [expenses, monthKey])

  const [input, setInput] = useState(budgetAmount ? String(budgetAmount) : '')
  const [error, setError] = useState('')

  const remaining = budgetAmount - spent
  const pct = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0

  async function handleSave() {
    const value = Number(input)
    if (!value || value <= 0) {
      setError('Enter a budget amount greater than zero.')
      return
    }
    await setBudget(value)
    setError('')
  }

  async function handleClear() {
    if (window.confirm('Remove your monthly budget?')) {
      await clearBudget()
      setInput('')
    }
  }

  return (
    <div>
      <PageHeader
        title="Budget"
        subtitle={formatMonthYear(new Date())}
      />

      {budgetAmount > 0 && (
        <div className="card fade-up" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <span className="card-header-label">Monthly budget</span>
            <Target size={18} style={{ color: 'var(--text-faint)' }} />
          </div>
          <div className="budget-value">
            <AnimatedMoney value={Math.max(remaining, 0)} currency={currency} />
          </div>
          <div className="budget-caption">
            {remaining >= 0
              ? `remaining of ${formatMoney(budgetAmount, currency)}`
              : `over budget by ${formatMoney(Math.abs(remaining), currency)}`}
          </div>
          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, pct)}%`,
                background:
                  pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warning)' : 'var(--success)',
              }}
            />
          </div>
          <div className="progress-footer">
            <span>{formatMoney(spent, currency)} spent</span>
            <span>{Math.round(pct)}% used</span>
          </div>
        </div>
      )}

      {budgetAmount > 0 && remaining >= 0 && remaining <= budgetAmount * 0.2 && (
        <div className="alert warning">
          <div>
            <strong>You're close to your monthly budget.</strong>
            You have {formatMoney(remaining, currency)} remaining.
          </div>
        </div>
      )}

      {budgetAmount > 0 && remaining < 0 && (
        <div className="alert danger">
          <div>
            <strong>Budget exceeded</strong>
            You've spent {formatMoney(spent, currency)}. Your budget was{' '}
            {formatMoney(budgetAmount, currency)}.
          </div>
        </div>
      )}

      <div className="card fade-up" style={{ animationDelay: '120ms' }}>
        <label className="field-label">Monthly budget · {formatMonthYear(new Date())}</label>
        <input
          className="text-input"
          inputMode="decimal"
          placeholder="e.g. 3000"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^\d.,]/g, ''))}
        />
        {error && (
          <div className="field">
            <p className="alert danger" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}
        <div className="field" style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>
            {budgetAmount > 0 ? 'Update budget' : 'Set budget'}
          </button>
          {budgetAmount > 0 && (
            <button className="btn" onClick={handleClear} style={{ border: '1px solid var(--danger)', color: 'var(--danger)' }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}