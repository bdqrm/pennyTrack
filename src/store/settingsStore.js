import { create } from 'zustand'
import { settingsRepository } from '../repositories/repositories.js'

export const LANGS = ['en', 'fr', 'ar']

function detectLang() {
  const l = (typeof navigator !== 'undefined' ? navigator.language : 'en') || 'en'
  if (l.toLowerCase().startsWith('ar')) return 'ar'
  if (l.toLowerCase().startsWith('fr')) return 'fr'
  return 'en'
}

const DEFAULTS = {
  currency: 'MAD',
  theme: 'dark',
  firstDayOfWeek: 1,
  lang: 'en',
}

export const useSettingsStore = create((set) => ({
  ...DEFAULTS,
  ready: false,

  async load() {
    const rows = await settingsRepository.getAll()
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    const lang = LANGS.includes(map.lang) ? map.lang : detectLang()
    set({ ...DEFAULTS, ...map, lang, ready: true })
  },

  async setPreference(key, value) {
    await settingsRepository.set(key, value)
    set({ [key]: value })
  },

  currency: DEFAULTS.currency,
  theme: DEFAULTS.theme,
  firstDayOfWeek: DEFAULTS.firstDayOfWeek,
  lang: DEFAULTS.lang,
}))

export function useCurrency() {
  return useSettingsStore((s) => s.currency)
}

export function useTheme() {
  return useSettingsStore((s) => s.theme)
}

export function useFirstDayOfWeek() {
  const fd = useSettingsStore((s) => s.firstDayOfWeek)
  return Number(fd ?? 1)
}

export function useLangSetting() {
  return useSettingsStore((s) => s.lang)
}