export function sum(list) {
  return list.reduce((acc, item) => acc + Number(item.amount ?? 0), 0)
}

export function filterByMonth(expenses, monthKey) {
  return expenses.filter((e) => e.date && e.date.slice(0, 7) === monthKey)
}

export function filterByDay(expenses, dayStr) {
  return expenses.filter((e) => e.date === dayStr)
}

export function filterBetween(expenses, startDateStr, endDateStr) {
  return expenses.filter((e) => e.date >= startDateStr && e.date <= endDateStr)
}

const pad = (n) => String(n).padStart(2, '0')

export function groupByCategory(expenses) {
  const totals = new Map()
  for (const e of expenses) {
    const id = e.categoryId ?? 'other'
    totals.set(id, (totals.get(id) ?? 0) + Number(e.amount))
  }
  return [...totals.entries()]
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function dateStrsInMonth(monthKey) {
  const [yearStr, monthStr] = monthKey.split('-')
  const year = Number(yearStr)
  const monthIndex = Number(monthStr) - 1
  const days = daysInMonth(year, monthIndex)
  return Array.from({ length: days }, (_, i) => `${monthKey}-${pad(i + 1)}`)
}

export function byDayInMonth(expenses, monthKey) {
  const totals = new Map()
  for (const e of expenses) {
    if (e.date && e.date.slice(0, 7) === monthKey) {
      totals.set(e.date, (totals.get(e.date) ?? 0) + Number(e.amount))
    }
  }
  return totals
}

export function monthlyTotals(expenses, monthsBack = 3) {
  const now = new Date()
  const totals = []
  for (let i = monthsBack - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
    totals.push({ monthKey: key, amount: sum(filterByMonth(expenses, key)) })
  }
  return totals
}