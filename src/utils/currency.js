const CURRENCIES = ['MAD', 'EUR', 'USD', 'GBP']

const formatterCache = {}

function getFormatter(currency) {
  if (!formatterCache[currency]) {
    formatterCache[currency] = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return formatterCache[currency]
}

export function formatMoney(amount, currency = 'MAD') {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—'
  return `${currency} ${getFormatter(currency).format(Number(amount))}`
}

export function formatSigned(amount, currency = 'MAD') {
  return `-${formatMoney(amount, currency)}`
}

export { CURRENCIES }