import { useEffect, useLayoutEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import TopAppBar from './components/TopAppBar.jsx'
import { BottomTabBar, Sidebar } from './components/Navigation.jsx'
import { useDataStore } from './store/dataStore.js'
import { useSettingsStore } from './store/settingsStore.js'
import { setLang } from './i18n/lang.js'
import Dashboard from './pages/Dashboard.jsx'
import History from './pages/History.jsx'
import AddExpense from './pages/AddExpense.jsx'
import Statistics from './pages/Statistics.jsx'
import Budget from './pages/Budget.jsx'
import Settings from './pages/Settings.jsx'
import Categories from './pages/Categories.jsx'
import Reports from './pages/Reports.jsx'

function Shell() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/expenses/new') ||
    /^\/expenses\/[^/]+\/edit/.test(location.pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      {!hideNav && <Sidebar />}
      <div className="app-right">
        <TopAppBar />
        <main className="app-main">
          <div className="page-transition" key={location.pathname}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<History />} />
              <Route path="/expenses/new" element={<AddExpense />} />
              <Route path="/expenses/:id/edit" element={<AddExpense />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
      </div>
      {!hideNav && <BottomTabBar />}
    </div>
  )
}

function Splash() {
  return (
    <div className="app" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <span className="brand splash-badge" style={{ fontSize: 20 }}>
        <span className="brand-badge">
          <Wallet size={17} />
        </span>
        PennyTrack
      </span>
    </div>
  )
}

export default function App() {
  const loadData = useDataStore((s) => s.load)
  const loadSettings = useSettingsStore((s) => s.load)
  const dataReady = useDataStore((s) => s.ready)
  const settingsReady = useSettingsStore((s) => s.ready)
  const theme = useSettingsStore((s) => s.theme)
  const lang = useSettingsStore((s) => s.lang)

  useEffect(() => {
    loadData()
    loadSettings()
  }, [loadData, loadSettings])

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('theme-dark', theme === 'dark')
    root.classList.toggle('theme-light', theme === 'light')
    root.lang = lang || 'en'
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    setLang(lang || 'en')
  }, [theme, lang])

  return (
    <HashRouter>
      <div className={`theme-${theme || 'dark'}`}>
        {dataReady && settingsReady ? <Shell /> : <Splash />}
      </div>
    </HashRouter>
  )
}