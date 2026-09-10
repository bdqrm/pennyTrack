const pad = (n) => String(n).padStart(2, '0')

export function toDateStr(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayStr() {
  return toDateStr(new Date())
}

export function parseDateStr(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function formatLongDate(date) {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

export function formatHeaderDate(dateStr) {
  const date = parseDateStr(dateStr)
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

export function formatShortDate(dateStr) {
  const date = parseDateStr(dateStr)
  return `${DAY_SHORT[date.getDay()]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)}`
}

export function formatDayShort(dateStr) {
  return DAY_SHORT[parseDateStr(dateStr).getDay()]
}

export function formatMonthYear(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDateGroup(dateStr) {
  const today = todayStr()
  const yesterday = toDateStr(new Date(Date.now() - 86400000))
  if (dateStr === today) return 'Today'
  if (dateStr === yesterday) return 'Yesterday'
  return formatHeaderDate(dateStr)
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function isInMonth(dateStr, monthKey) {
  return dateStr && dateStr.slice(0, 7) === monthKey
}

export function startOfWeek(date, firstDayOfWeek) {
  const d = new Date(date)
  const diff = (d.getDay() - firstDayOfWeek + 7) % 7
  d.setDate(d.getDate() - diff)
  return d
}

export function lastNDays(n) {
  const days = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(toDateStr(d))
  }
  return days
}