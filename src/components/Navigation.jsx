import { NavLink, Link } from 'react-router-dom'
import { History, BarChart3, Target, Home, Plus, Wallet, FileBarChart } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/expenses', label: 'History', icon: History },
  { to: '/statistics', label: 'Statistics', icon: BarChart3 },
  { to: '/budget', label: 'Budget', icon: Target },
]

const SIDEBAR_ITEMS = [
  ...ITEMS,
  { to: '/reports', label: 'Reports', icon: FileBarChart },
]

export function BottomTabBar() {
  return (
    <nav className="bottom-nav">
      <NavItem to={ITEMS[0].to} label={ITEMS[0].label} icon={ITEMS[0].icon} />
      <NavItem to={ITEMS[1].to} label={ITEMS[1].label} icon={ITEMS[1].icon} />
      <div className="fab-wrap">
        <Link to="/expenses/new" className="fab" aria-label="Add expense" title="Add expense">
          <Plus size={26} strokeWidth={2.2} />
        </Link>
      </div>
      <NavItem to={ITEMS[2].to} label={ITEMS[2].label} icon={ITEMS[2].icon} />
      <NavItem to={ITEMS[3].to} label={ITEMS[3].label} icon={ITEMS[3].icon} />
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
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-badge">
          <Wallet size={17} strokeWidth={2.2} />
        </span>
        PennyTrack
      </Link>
      {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => (
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
        Add expense
      </Link>
    </aside>
  )
}