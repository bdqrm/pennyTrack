import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CardHeader({ label, action }) {
  return (
    <div className="card-header">
      <span className="card-header-label">{label}</span>
      {action}
    </div>
  )
}

export function LinkRow({ to, children }) {
  return (
    <Link to={to} className="link-row">
      {children}
      <ArrowRight size={15} strokeWidth={2.4} />
    </Link>
  )
}

export function SectionHeader({ label, action }) {
  return (
    <div className="section-header">
      <span className="section-label">{label}</span>
      {action}
    </div>
  )
}