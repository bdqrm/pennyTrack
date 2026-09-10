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
  const categories = useDataStore((s) => s.categories)
  const categoryBudgets = useDataStore((s) => s.categoryBudgets)
  const setCategoryBudget = useDataStore((s) => s.setCategoryBudget)
  const clearCategoryBudget = useDataStore((s) => s.clearCategoryBudget)
  const expenses = useEnrichedExpenses()

  const monthKey = currentMonthKey()
  const isCurrent = budget?.monthKey === monthKey
  const budgetAmount = isCurrent && budget ? Number(budget.amount) : 0
  const spent = useMemo(() => sum(filterByMonth(expenses, monthKey)), [expenses, monthKey])

  const [input, setInput] = useState(budgetAmount ? String(budgetAmount) : '')
  const [error, setError] = useState('')

  const [limitDraft, setLimitDraft] = useState({})
  const [limitErrors, setLimitErrors] = useState({})

  const remaining = budgetAmount - spent
  const pct = budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0

  const monthExpenses = useMemo(() => filterByMonth(expenses, monthKey), [expenses, monthKey])
  const spentByCategory = useMemo(() => {
    const map = new Map()
    for (const e of monthExpenses) {
      map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + Number(e.amount))
    }
    return map
  }, [monthExpenses])

  const limitRows = categories
    .map((cat) => ({
      category: cat,
      spent: spentByCategory.get(cat.id) ?? 0,
      budget: categoryBudgets.find((b) => b.categoryId === cat.id) ?? null,
    }))
    .filter((row) => row.budget || row.spent > 0)

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

  async function handleSetLimit(cat) {
    const amount = Number(limitDraft[cat.id])
    if (!amount || amount <= 0) {
      setLimitErrors((prev) => ({ ...prev, [cat.id]: 'Enter an amount greater than zero.' }))
      return
    }
    await setCategoryBudget(monthKey, cat.id, amount)
    setLimitDraft((prev) => ({ ...prev, [cat.id]: '' }))
    setLimitErrors((prev) => {
      const next = { ...prev }
      delete next[cat.id]
      return next
    })
  }

  async function handleClearLimit(cat) {
    const row = limitRows.find((r) => r.category.id === cat.id)
    if (!row?.budget) return
    if (window.confirm(`Remove the ${cat.name} limit?`)) {
      await clearCategoryBudget(row.budget.id)
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

      <div className="card fade-up" style={{ marginTop: 16, animationDelay: '120ms' }}>
        <div className="card-header">
          <span className="card-header-label">Category budgets</span>
        </div>
        {limitRows.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No expenses or limits yet this month. Set individual category limits below.
          </p>
        ) : null}
        {limitRows.map(({ category: cat, spent: catSpent, budget: catBudget }) => {
          const Icon = cat.icon
          const catPct = catBudget ? Math.min(100, Math.round((catSpent / Number(catBudget.amount)) * 100)) : 0
          const catRemaining = catBudget ? Number(catBudget.amount) - catSpent : 0
          const catColor =
            catBudget && catRemaining < 0 ? 'var(--danger)' : catBudget && catPct >= 80 ? 'var(--warning)' : 'var(--success)'
          return (
            <div key={cat.id} className="cat-budget-row">
              <span className="expense-badge" style={{ background: `${cat.color}2e`, color: '#fff' }}>
                <Icon size={16} strokeWidth={2.1} />
              </span>
              <div className="cat-budget-meta">
                <div className="cat-budget-name">
                  <span>{cat.name}</span>
                  <span>{catSpent > 0 ? formatMoney(catSpent, currency) : '—'}</span>
                </div>
                {catBudget && (
                  <>
                    <div className="progress" style={{ marginTop: 6 }}>
                      <div className="progress-fill" style={{ width: `${catPct}%`, background: catColor }} />
                    </div>
                    <div className={`cat-budget-limit ${catRemaining < 0 ? 'warning' : ''}`}>
                      {catRemaining >= 0
                        ? `${formatMoney(catRemaining, currency)} left of ${formatMoney(Number(catBudget.amount), currency)}`
                        : `over by ${formatMoney(Math.abs(catRemaining), currency)}`}
                    </div>
                  </>
                )}
                <input
                  className="text-input"
                  placeholder={`Limit ${cat.name}`}
                  inputMode="decimal"
                  style={{ padding: '8px 11px', marginTop: 8 }}
                  value={limitDraft[cat.id] ?? ''}
                  onChange={(e) =>
                    setLimitDraft((prev) => ({ ...prev, [cat.id]: e.target.value.replace(/[^\d.,]/g, '') }))
                  }
                />
                {limitErrors[cat.id] && (
                  <p className="alert danger" style={{ margin: '6px 0 0', padding: '6px 10px' }}>
                    {limitErrors[cat.id]}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="btn btn-primary" style={{ padding: '8px 13px' }} onClick={() => handleSetLimit(cat)}>
                  {catBudget ? 'Update' : 'Set'}
                </button>
                {catBudget && (
                  <button
                    className="icon-btn"
                    aria-label={`Remove ${cat.name} limit`}
                    title={`Remove ${cat.name} limit`}
                    onClick={() => handleClearLimit(cat)}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card fade-up" style={{ marginTop: 16, animationDelay: '180ms' }}>
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