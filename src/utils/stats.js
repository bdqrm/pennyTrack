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