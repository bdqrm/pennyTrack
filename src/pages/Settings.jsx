import { ShieldCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
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