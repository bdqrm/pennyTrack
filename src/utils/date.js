import { useSettingsStore } from '../store/settingsStore.js'

const pad = (n) => String(n).padStart(2, '0')

function currentLang() {
  return useSettingsStore.getState().lang
}

const DAY_NAMES = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
}

const DAY_SHORT = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fr: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
}

const MONTH_NAMES = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
}

function names(map) {
  return map[currentLang()] ?? map.en
}

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

export function formatLongDate(date) {
  const days = names(DAY_NAMES)
  const months = names(MONTH_NAMES)
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export function formatHeaderDate(dateStr) {
  return formatLongDate(parseDateStr(dateStr))
}

export function formatShortDate(dateStr) {
  const date = parseDateStr(dateStr)
  const days = names(DAY_SHORT)
  const months = names(MONTH_NAMES)
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()].slice(0, 3)}`
}

export function formatDayShort(dateStr) {
  return names(DAY_SHORT)[parseDateStr(dateStr).getDay()]
}

export function formatWeekdayLong(date) {
  return names(DAY_NAMES)[date.getDay()]
}

export function formatMonthYear(date) {
  return `${names(MONTH_NAMES)[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDateGroup(dateStr) {
  const lang = currentLang()
  const today = todayStr()
  const yesterday = toDateStr(new Date(Date.now() - 86400000))
  if (dateStr === today) return lang === 'en' ? 'Today' : lang === 'fr' ? "Aujourd'hui" : 'اليوم'
  if (dateStr === yesterday) return lang === 'fr' ? 'Hier' : lang === 'ar' ? 'أمس' : 'Yesterday'
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