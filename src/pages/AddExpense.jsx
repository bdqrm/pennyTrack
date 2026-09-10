import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Save } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { useDataStore } from '../store/dataStore.js'
import { useCurrency } from '../store/settingsStore.js'
import { useT, useLang, categoryName } from '../i18n/index.js'
import { todayStr } from '../utils/date.js'

export default function AddExpense() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currency = useCurrency()
  const t = useT()
  const lang = useLang()
  const expenses = useDataStore((s) => s.expenses)
  const categories = useDataStore((s) => s.categories)
  const addExpense = useDataStore((s) => s.addExpense)
  const updateExpense = useDataStore((s) => s.updateExpense)

  const editing = useMemo(() => expenses.find((e) => e.id === id) ?? null, [expenses, id])

  const [amount, setAmount] = useState(editing ? String(editing.amount) : '')
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? (categories[0]?.id ?? ''))
  const [note, setNote] = useState(editing?.note ?? '')
  const [date, setDate] = useState(editing?.date ?? todayStr())
  const [error, setError] = useState('')

  const isEdit = Boolean(editing)

  function handleAmount(value) {
    const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
    if (/^\d*\.?\d{0,2}$/.test(cleaned)) setAmount(cleaned)
  }

  async function handleSave() {
    const value = Number(amount)
    if (!value || value <= 0) {
      setError(t('Enter the amount you spent.'))
      return
    }
    if (!categoryId) {
      setError(t('Choose a category.'))
      return
    }
    const payload = { amount: value, categoryId, note, date }
    if (isEdit) await updateExpense(id, payload)
    else await addExpense(payload)
    navigate(isEdit ? -1 : '/')
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? t('Edit Expense') : t('Add Expense')}
        subtitle={
          isEdit
            ? t('Update the details of this expense.')
            : t('Record where your money went — it only takes seconds.')
        }
      />

      <div className="card fade-up">
        <label className="field-label">{t('Amount')}</label>
        <div className="amount-input-wrap">
          <input
            className="amount-input"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmount(e.target.value)}
            autoFocus
          />
          <div className="amount-currency">{currency}</div>
        </div>

        <div className="field">
          <label className="field-label">{t('Category')}</label>
          <div className="category-grid">
            {categories.map((c, i) => {
              const selected = c.id === categoryId
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`category-item fade-up ${selected ? 'selected' : ''}`}
                  style={{ animationDelay: `${i * 30}ms` }}
                  onClick={() => setCategoryId(c.id)}
                >
                  <span
                    className="category-badge"
                    style={{ background: selected && !isEdit ? c.color : `${c.color}2e` }}
                  >
                    {c.icon && <c.icon size={19} strokeWidth={2.1} />}
                  </span>
                  <span className="category-name">{categoryName(c, lang)}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="field">
          <label className="field-label">{t('Note')}</label>
          <input
            className="text-input"
            data-testid="note-input"
            placeholder={t('Optional — e.g. Lunch with colleagues')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={120}
          />
        </div>

        <div className="field">
          <label className="field-label">{t('Date')}</label>
          <input
            className="text-input"
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {error && (
          <div className="field">
            <p className="alert danger" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <div className="field" style={{ marginTop: 26 }}>
          <button className="btn btn-primary btn-block" onClick={handleSave}>
            {isEdit ? <Check size={17} strokeWidth={2.6} /> : <Save size={16} strokeWidth={2.4} />}
            {isEdit ? t('Save changes') : t('Save expense')}
          </button>
        </div>
      </div>
    </div>
  )
}