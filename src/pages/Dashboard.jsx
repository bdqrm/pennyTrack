import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Wallet, Calendar, CalendarRange } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ExpenseRow from '../components/ExpenseRow.jsx'
import AnimatedMoney from '../components/AnimatedMoney.jsx'
import { CardHeader, LinkRow, SectionHeader } from '../components/CardHeader.jsx'
import useEnrichedExpenses from '../hooks/useEnrichedExpenses.js'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency, useFirstDayOfWeek } from '../store/settingsStore.js'
import { formatMoney } from '../utils/currency.js'
import {
  currentMonthKey,
  formatShortDate,
  formatMonthYear,
  startOfWeek,
  toDateStr,
  todayStr,
} from '../utils/date.js'
import { filterByDay, filterByMonth, filterBetween, sum } from '../utils/stats.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const currency = useCurrency()
  const firstDayOfWeek = useFirstDayOfWeek()
  const budget = useDataStore((s) => s.budget)
  const expenses = useEnrichedExpenses()

  const today = todayStr()
  const monthKey = currentMonthKey()

  const { spentToday, spentWeek, spentMonth, budgetAmount, budgetSpent, remaining, pct, weekLabel } =
    useMemo(() => {
      const weekStartDate = startOfWeek(new Date(), firstDayOfWeek)
      const weekStart = toDateStr(weekStartDate)
      const spentToday = sum(filterByDay(expenses, today))
      const spentWeek = sum(filterBetween(expenses, weekStart, today))
      const spentMonth = sum(filterByMonth(expenses, monthKey))
      const budgetAmount = budget && budget.monthKey === monthKey ? Number(budget.amount) : 0
      const budgetSpent = filterByMonth(expenses, monthKey).reduce(
        (acc, e) => acc + Number(e.amount),
        0,
      )
      const remaining = budgetAmount > 0 ? budgetAmount - budgetSpent : 0
      const pct = budgetAmount > 0 ? Math.min(100, Math.round((budgetSpent / budgetAmount) * 100)) : 0
      return {
        spentToday,
        spentWeek,
        spentMonth,
        budgetAmount,
        budgetSpent,
        remaining,
        pct,
        weekLabel: `${weekStartDate.toLocaleDateString('en-US', { weekday: 'long' })} to today`,
      }
    }, [expenses, today, monthKey, firstDayOfWeek, budget])

  const recent = expenses.slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={formatLongDateNow()}
        action={
          <button className="btn btn-primary" onClick={() => navigate('/expenses/new')}>
            <Plus size={16} strokeWidth={2.6} />
            Add expense
          </button>
        }
      />

      <div className="stat-row">
        <StatCard
          index={0}
          icon={<Wallet size={17} />}
          label="Today"
          value={spentToday}
          currency={currency}
          caption={formatShortDate(today)}
        />
        <StatCard
          index={1}
          icon={<Calendar size={17} />}
          label="This week"
          value={spentWeek}
          currency={currency}
          caption={weekLabel}
        />
        <StatCard
          index={2}
          icon={<CalendarRange size={17} />}
          label="This month"
          value={spentMonth}
          currency={currency}
          caption={formatMonthYear(new Date())}
        />
      </div>

      <div className="card fade-up" style={{ animationDelay: '140ms' }}>
        <CardHeader
          label={`Budget · ${formatMonthYear(new Date())}`}
          action={<LinkRow to="/budget">Manage</LinkRow>}
        />
        {budgetAmount > 0 ? (
          <>
            <div className="budget-value">
              <AnimatedMoney value={Math.max(remaining, 0)} currency={currency} />
            </div>
            <div className="budget-caption">
              {remaining < 0
                ? `over budget by ${formatMoney(Math.abs(remaining), currency)}`
                : `left of ${formatMoney(budgetAmount, currency)}`}
            </div>
            <ProgressBar color={pct >= 100 ? 'var(--danger)' : 'var(--success)'} value={pct} />
            <div className="progress-footer">
              <span>{formatMoney(budgetSpent, currency)} spent</span>
              <span>{pct}% used</span>
            </div>
          </>
        ) : (
          <div className="empty" style={{ padding: '28px 12px' }}>
            <p>No budget set for this month.</p>
            <p className="text-muted">
              Set a monthly limit to see how much you can still spend.
            </p>
          </div>
        )}
      </div>

      <SectionHeader
        label="Recent expenses"
        action={
          <LinkRow to="/expenses">View all</LinkRow>
        }
      />

      {recent.length === 0 ? (
        <div className="card">
          <div className="empty">
            <p>No expenses yet.</p>
            <p className="text-muted">Tap + to record your first expense.</p>
          </div>
        </div>
      ) : (
        <div className="card fade-up" style={{ paddingTop: 12, paddingBottom: 12, animationDelay: '220ms' }}>
          <div className="expense-list">
            {recent.map((e, i) => (
              <div key={e.id} className="fade-up" style={{ animationDelay: `${220 + i * 55}ms` }}>
                <ExpenseRow
                  expense={e}
                  currency={currency}
                  onOpen={(exp) => navigate(`/expenses/${exp.id}/edit`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ index, icon, label, value, currency, caption }) {
  return (
    <div className="card stat-card fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <span className="stat-icon">{icon}</span>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        <AnimatedMoney value={value} currency={currency} />
      </div>
      <div className="stat-caption">{caption}</div>
    </div>
  )
}

function ProgressBar({ value, color }) {
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function formatLongDateNow() {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}