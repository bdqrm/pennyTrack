import { useCountUp } from '../hooks/useCountUp.js'
import { formatMoney } from '../utils/currency.js'

export default function AnimatedMoney({ value, currency, duration }) {
  const display = useCountUp(value, duration)
  return formatMoney(display, currency)
}