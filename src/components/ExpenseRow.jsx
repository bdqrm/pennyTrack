import { Trash2 } from 'lucide-react'
import { formatSigned } from '../utils/currency.js'
import { formatDateGroup } from '../utils/date.js'

export default function ExpenseRow({ expense, currency, onOpen, onDelete }) {
  const color = expense.color || '#8B8B93'

  return (
    <div className="expense-row" onClick={() => onOpen?.(expense)} role="button" tabIndex={0}>
      <span
        className="expense-badge"
        style={{ background: `${color}2e` }}
        aria-hidden="true"
      >
        {expense.icon && <expense.icon size={19} strokeWidth={2.1} />}
      </span>
      <div className="expense-body">
        <div className="expense-title">
          {expense.note || expense.categoryName || 'Expense'}
        </div>
        <div className="expense-meta">
          {formatDateGroup(expense.date)} · {expense.categoryName}
        </div>
      </div>
      <span className="expense-amount">{formatSigned(expense.amount, currency)}</span>
      {onDelete && (
        <button
          className="expense-delete"
          aria-label="Delete expense"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(expense)
          }}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}