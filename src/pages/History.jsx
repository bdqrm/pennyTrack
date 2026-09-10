import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Receipt } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ExpenseRow from '../components/ExpenseRow.jsx'
import useEnrichedExpenses from '../hooks/useEnrichedExpenses.js'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency } from '../store/settingsStore.js'
import { useT, useLang, categoryName, pluralWord } from '../i18n/index.js'
import { formatDateGroup } from '../utils/date.js'

export default function History() {
  const navigate = useNavigate()
  const currency = useCurrency()
  const t = useT()
  const lang = useLang()
  const categories = useDataStore((s) => s.categories)
  const deleteExpense = useDataStore((s) => s.deleteExpense)
  const expenses = useEnrichedExpenses()

  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')

  const hasFilters = query.trim() !== '' || categoryId !== '' || date !== ''

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return expenses.filter((e) => {
      if (q && !`${e.note} ${e.categoryName}`.toLowerCase().includes(q)) return false
      if (categoryId && e.categoryId !== categoryId) return false
      if (date && e.date !== date) return false
      return true
    })
  }, [expenses, query, categoryId, date])

  const groups = useMemo(() => {
    const map = new Map()
    for (const e of filtered) {
      const key = e.date
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    }
    return [...map.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([key, list]) => ({
        key,
        label: formatDateGroup(key),
        items: list,
      }))
  }, [filtered])

  async function handleDelete(expense) {
    if (window.confirm(t('Delete "{name}" ({amount})?', { name: expense.note || expense.categoryName, amount: expense.amount }))) {
      await deleteExpense(expense.id)
    }
  }

  return (
    <div>
      <PageHeader
        title={t('History')}
        subtitle={`${filtered.length} ${pluralWord(lang, filtered.length)}${hasFilters ? ` ${t('found')}` : ''}`}
      />

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input
            className="text-input search-input"
            placeholder={t('Search expenses…')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="select-input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">{t('All categories')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {categoryName(c, lang)}
            </option>
          ))}
        </select>
        <input
          className="text-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {hasFilters && (
          <button
            className="clear-filters"
            onClick={() => {
              setQuery('')
              setCategoryId('')
              setDate('')
            }}
          >
            <X size={15} /> {t('Clear')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">
              <Receipt size={26} />
            </div>
            <p>{hasFilters ? t('No expenses match your filters.') : t('No expenses yet.')}</p>
            <p className="text-muted">{t('Tap + to record your first expense.')}</p>
          </div>
        </div>
      ) : (
        <div className="card" style={{ paddingTop: 12 }}>
          {groups.map((group) => (
            <section key={group.key}>
              <div className="day-group-label">{group.label}</div>
              <div className="expense-list">
                {group.items.map((e, i) => (
                  <div
                    key={e.id}
                    className="fade-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  >
                    <ExpenseRow
                      expense={e}
                      currency={currency}
                      onOpen={(exp) => navigate(`/expenses/${exp.id}/edit`)}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}