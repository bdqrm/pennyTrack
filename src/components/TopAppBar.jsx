import { Link } from 'react-router-dom'
import { Settings, Wallet } from 'lucide-react'
import { useT } from '../i18n/index.js'

export default function TopAppBar() {
  const t = useT()
  return (
    <header className="app-bar">
      <div className="app-bar-inner">
        <Link to="/" className="brand">
          <span className="brand-badge">
            <Wallet size={17} strokeWidth={2.2} />
          </span>
          PennyTrack
        </Link>
        <Link to="/settings" className="icon-btn" aria-label={t('Settings')} title={t('Settings')}>
          <Settings size={19} />
        </Link>
      </div>
    </header>
  )
}