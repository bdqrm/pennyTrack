import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileBarChart } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import useEnrichedExpenses from '../hooks/useEnrichedExpenses.js'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency } from '../store/settingsStore.js'
import { useT, useLang, categoryName, pluralWord } from '../i18n/index.js'
import { budgetRepository } from '../repositories/repositories.js'
import { formatMoney } from '../utils/currency.js'
import { formatMonthYear } from '../utils/date.js'
import {
  filterByMonth,
  sum,
  groupByCategory,
  dateStrsInMonth,
  byDayInMonth,
  monthlyTotals,
} from '../utils/stats.js'

export default function Reports() {
  const currency = useCurrency()
  const t = useT()
  const lang = useLang()
  const expenses = useEnrichedExpenses()
  const categories = useDataStore((s) => s.categories)

  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [monthBudget, setMonthBudget] = useState(null)

  const monthKey = `${ym.y}-${String(ym.m + 1).padStart(2, '0')}`
  const monthLabel = formatMonthYear(new Date(ym.y, ym.m, 1))

  useEffect(() => {
    let alive = true
    budgetRepository.getForMonth(monthKey).then((b) => {
      if (alive) setMonthBudget(b)
    })
    return () => {
      alive = false
    }
  }, [monthKey])

  const monthExpenses = useMemo(() => filterByMonth(expenses, monthKey), [expenses, monthKey])
  const total = sum(monthExpenses)
  const count = monthExpenses.length

  const topCategories = useMemo(() => {
    return groupByCategory(monthExpenses)
      .map((row) => ({
        ...row,
        category: categories.find((c) => c.id === row.categoryId) ?? categories[0],
      }))
      .filter((row) => row.category)
  }, [monthExpenses, categories])

  const dayChart = useMemo(() => {
    const totals = byDayInMonth(expenses, monthKey)
    const max = Math.max(1, ...totals.values())
    return dateStrsInMonth(monthKey).map((day) => ({
      day,
      date: Number(day.slice(8)),
      amount: totals.get(day) ?? 0,
      height: Math.max(2, ((totals.get(day) ?? 0) / max) * 100),
    }))
  }, [expenses, monthKey])

  const trend = useMemo(() => monthlyTotals(expenses, 3), [expenses])
  const maxTrend = Math.max(1, ...trend.map((tt) => tt.amount))

  const budgetAmount = monthBudget ? Number(monthBudget.amount) : 0
  const budgetPct = budgetAmount > 0 ? Math.min(100, Math.round((total / budgetAmount) * 100)) : 0
  const budgetRemaining = budgetAmount - total

  function shiftMonth(delta) {
    const totalMonths = ym.y * 12 + ym.m + delta
    const y = Math.floor(totalMonths / 12)
    const m = ((totalMonths % 12) + 12) % 12
    setYm({ y, m })
  }

  return (
    <div>
      <PageHeader title={t('Reports')} subtitle={t('Spending breakdown by month.')} />

      <div className="month-nav">
        <button className="icon-btn" aria-label={t('Previous month')} onClick={() => shiftMonth(-1)}>
          <ChevronLeft size={19} />
        </button>
        <span className="month-nav-label">{monthLabel}</span>
        <button className="icon-btn" aria-label={t('Next month')} onClick={() => shiftMonth(1)}>
          <ChevronRight size={19} />
        </button>
      </div>

      <div className="card fade-up">
        <div className="card-header">
          <span className="card-header-label">{t('Total spent')}</span>
        </div>
        <div className="stat-big">{formatMoney(total, currency)}</div>
        <div className="budget-caption">
          {count === 0 ? t('No expenses recorded.') : `${count} ${pluralWord(lang, count)} ${t('this month')}`}
        </div>

        {budgetAmount > 0 && (
          <>
            <div className="progress" style={{ marginTop: 18 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${budgetPct}%`,
                  background:
                    budgetRemaining < 0 ? 'var(--danger)' : budgetPct >= 80 ? 'var(--warning)' : 'var(--success)',
                }}
              />
            </div>
            <div className="cat-budget-limit">
              {budgetRemaining >= 0
                ? t('{amount} left of {total}', {
                    amount: formatMoney(budgetRemaining, currency),
                    total: formatMoney(budgetAmount, currency),
                  })
                : t('over budget by {amount}', { amount: formatMoney(Math.abs(budgetRemaining), currency) })}
            </div>
          </>
        )}
      </div>

      {count === 0 ? (
        <div className="card fade-up" style={{ marginTop: 16, animationDelay: '80ms' }}>
          <div className="empty">
            <div className="empty-icon">
              <FileBarChart size={26} />
            </div>
            <p>{t('No spending data for {month}.', { month: monthLabel })}</p>
            <p className="text-muted">{t('Add expenses to see charts for this month.')}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card fade-up" style={{ marginTop: 16, animationDelay: '80ms' }}>
            <div className="card-header">
              <span className="card-header-label">{t('Daily spending')}</span>
            </div>
            <div className="day-chart">
              {dayChart.map((d) => (
                <div
                  key={d.day}
                  className={`day-bar ${d.amount === 0 ? 'zero' : ''}`}
                  style={{
                    height: d.amount === 0 ? 3 : `${d.height}%`,
                    background: d.amount === 0 ? undefined : 'var(--accent)',
                  }}
                  title={`${d.day}: ${formatMoney(d.amount, currency)}`}
                />
              ))}
            </div>
            <div className="cat-budget-limit" style={{ marginTop: 8 }}>
              {dayChart[0].day} — {dayChart[dayChart.length - 1].day}
            </div>
          </div>

          <div className="card fade-up" style={{ marginTop: 16, animationDelay: '160ms' }}>
            <div className="card-header">
              <span className="card-header-label">{t('Top categories · share of total')}</span>
            </div>
            {topCategories.map((row) => {
              const Icon = row.category.icon
              const name = categoryName(row.category, lang)
              const share = total > 0 ? Math.round((row.amount / total) * 100) : 0
              const sharePct = total > 0 ? (row.amount / Math.max(...topCategories.map((tt) => tt.amount))) * 100 : 0
              return (
                <div key={row.categoryId} className="share-row">
                  <span className="expense-badge" style={{ background: `${row.category.color}2e`, color: '#fff' }}>
                    <Icon size={16} strokeWidth={2.1} />
                  </span>
                  <div className="share-meta">
                    <div className="cat-budget-name">
                      <span>{name}</span>
                      <span>{formatMoney(row.amount, currency)}</span>
                    </div>
                    <div className="progress" style={{ marginTop: 6 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.max(2, sharePct)}%`, background: row.category.color }}
                      />
                    </div>
                    <div className="cat-budget-limit">{t('{n}% of total', { n: share })}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="card fade-up" style={{ marginTop: 16, animationDelay: '120ms' }}>
        <div className="card-header">
          <span className="card-header-label">{t('Last 3 months')}</span>
        </div>
        <div className="trend-chart">
          {trend.map((tt, i) => (
            <div key={tt.monthKey} className="trend-col">
              <div
                className="trend-bar"
                style={{
                  height: `${tt.amount > 0 ? Math.max(4, (tt.amount / maxTrend) * 100) : 4}%`,
                  background: i === trend.length - 1 ? 'var(--accent)' : 'var(--text-faint)',
                  opacity: tt.amount > 0 ? 1 : 0.35,
                }}
                title={formatMoney(tt.amount, currency)}
              />
              <div className="trend-label">
                {formatMonthYear(new Date(Number(tt.monthKey.slice(0, 4)), Number(tt.monthKey.slice(5)) - 1, 1))
                  .split(' ')[0]
                  .slice(0, 3)}
              </div>
            </div>
          ))}
        </div>
        <div className="cat-budget-limit" style={{ marginTop: 8 }}>
          {trend.map((tt) => `${tt.monthKey} · ${formatMoney(tt.amount, currency)}`).join('   ')}
        </div>
      </div>
    </div>
  )
}