import { useEffect, useState } from 'react'
import { Download, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { LinkRow } from '../components/CardHeader.jsx'
import { useSettingsStore } from '../store/settingsStore.js'
import { CURRENCIES, formatMoney } from '../utils/currency.js'

export default function Settings() {
  const currency = useSettingsStore((s) => s.currency)
  const theme = useSettingsStore((s) => s.theme)
  const firstDayOfWeek = useSettingsStore((s) => s.firstDayOfWeek)
  const setPreference = useSettingsStore((s) => s.setPreference)

  return (
    <div>
      <PageHeader title="Settings" subtitle="Preferences are stored locally on this device." />

      <InstallPrompt />

      <div className="card" style={{ marginBottom: 16 }}>
        <SettingRow
          title="Categories"
          desc="Add, rename, recolor or change icons for your spending categories."
          control={<LinkRow to="/categories">Manage</LinkRow>}
        />
      </div>

      <div className="card">
        <SettingRow
          title="Currency"
          desc={`Displayed amount format: ${formatMoney(1234.56, currency)}`}
          control={
            <select
              className="select-input select-input-compact"
              value={currency}
              onChange={(e) => setPreference('currency', e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          }
        />

        <SettingRow
          title="Theme"
          desc="Appearance of the interface."
          control={
            <select
              className="select-input select-input-compact"
              value={theme}
              onChange={(e) => setPreference('theme', e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          }
        />

        <SettingRow
          title="First day of week"
          desc="Used for weekly summaries and statistics."
          control={
            <select
              className="select-input select-input-compact"
              value={String(firstDayOfWeek)}
              onChange={(e) => setPreference('firstDayOfWeek', Number(e.target.value))}
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </select>
          }
        />
      </div>

      <div className="card" style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="expense-badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <ShieldCheck size={20} />
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Offline & private</div>
          <p className="muted" style={{ margin: '2px 0 0' }}>
            PennyTrack never sends your expenses anywhere. All data stays on this device.
          </p>
        </div>
      </div>
    </div>
  )
}

function SettingRow({ title, desc, control }) {
  return (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-title">{title}</div>
        <div className="setting-desc">{desc}</div>
      </div>
      <div className="setting-control">{control}</div>
    </div>
  )
}

function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    const onInstalled = () => setDeferred(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferred) return null

  return (
    <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
      <span className="expense-badge" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
        <Download size={20} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Install PennyTrack</div>
        <p className="muted" style={{ margin: '2px 0 0' }}>
          Add it to your home screen to use it like an app, completely offline.
        </p>
      </div>
      <button
        className="btn btn-primary"
        style={{ padding: '8px 14px' }}
        onClick={async () => {
          await deferred.prompt()
          setDeferred(null)
        }}
      >
        Install
      </button>
    </div>
  )
}