import { NavLink, Link } from 'react-router-dom'
import { History, BarChart3, Target, Home, Plus, Wallet, FileBarChart } from 'lucide-react'
import { useT } from '../i18n/index.js'

function useItems() {
  const t = useT()
  return [
    { to: '/', label: t('Home'), icon: Home },
    { to: '/expenses', label: t('History'), icon: History },
    { to: '/statistics', label: t('Statistics'), icon: BarChart3 },
    { to: '/budget', label: t('Budget'), icon: Target },
  ]
}

function useSidebarItems() {
  const t = useT()
  return [...useItems(), { to: '/reports', label: t('Reports'), icon: FileBarChart }]
}

export function BottomTabBar() {
  const items = useItems()
  const t = useT()
  return (
    <nav className="bottom-nav">
      <NavItem to={items[0].to} label={items[0].label} icon={items[0].icon} />
      <NavItem to={items[1].to} label={items[1].label} icon={items[1].icon} />
      <div className="fab-wrap">
        <Link to="/expenses/new" className="fab" aria-label={t('Add expense')} title={t('Add expense')}>
          <Plus size={26} strokeWidth={2.2} />
        </Link>
      </div>
      <NavItem to={items[2].to} label={items[2].label} icon={items[2].icon} />
      <NavItem to={items[3].to} label={items[3].label} icon={items[3].icon} />
    </nav>
  )
}

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={20} strokeWidth={2} />
      <span className="material-label">{label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  const items = useSidebarItems()
  const t = useT()
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-badge">
          <Wallet size={17} strokeWidth={2.2} />
        </span>
        PennyTrack
      </Link>
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={19} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
      <div className="nav-spacer" />
      <Link to="/expenses/new" className="nav-item primary">
        <Plus size={19} strokeWidth={2.4} />
        {t('Add expense')}
      </Link>
    </aside>
  )
}