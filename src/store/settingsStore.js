import { create } from 'zustand'
import { settingsRepository } from '../repositories/repositories.js'

const DEFAULTS = {
  currency: 'MAD',
  theme: 'dark',
  firstDayOfWeek: 1,
}

export const useSettingsStore = create((set) => ({
  ...DEFAULTS,
  ready: false,

  async load() {
    const rows = await settingsRepository.getAll()
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    set({ ...DEFAULTS, ...map, ready: true })
  },

  async setPreference(key, value) {
    await settingsRepository.set(key, value)
    set({ [key]: value })
  },

  currency: DEFAULTS.currency,
  theme: DEFAULTS.theme,
  firstDayOfWeek: DEFAULTS.firstDayOfWeek,
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