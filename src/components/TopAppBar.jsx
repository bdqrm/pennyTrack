import { Link } from 'react-router-dom'
import { Settings, Wallet } from 'lucide-react'

export default function TopAppBar() {
  return (
    <header className="app-bar">
      <div className="app-bar-inner">
        <Link to="/" className="brand">
          <span className="brand-badge">
            <Wallet size={17} strokeWidth={2.2} />
          </span>
          PennyTrack
        </Link>
        <Link to="/settings" className="icon-btn" aria-label="Settings" title="Settings">
          <Settings size={19} />
        </Link>
      </div>
    </header>
  )
}