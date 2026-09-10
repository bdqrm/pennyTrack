import { useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore.js'
import { translations, CATEGORY_NAMES } from './translations.js'

export function useLang() {
  return useSettingsStore((s) => s.lang)
}

export function useT() {
  const lang = useLang()
  const t = useCallback(
    (key, vars) => {
      let s = translations[lang]?.[key] ?? translations.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.split(`{${k}}`).join(String(v))
        }
      }
      return s
    },
    [lang],
  )
  return t
}

export function categoryName(cat, lang) {
  if (!cat) return ''
  const names = CATEGORY_NAMES[cat.id]
  if (cat.isDefault && names) {
    if (cat.name === names.en) return names[lang] ?? names.en
  }
  return cat.name ?? ''
}

export function pluralWord(lang, n) {
  return n === 1 ? translations[lang]?.expense ?? 'expense' : translations[lang]?.expenses ?? 'expenses'
}

export function otherName(lang) {
  return translations[lang]?.Other ?? translations.en.Other
}