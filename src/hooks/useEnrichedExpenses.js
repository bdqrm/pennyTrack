import { useMemo } from 'react'
import { useDataStore } from '../store/dataStore.js'
import { useLang, categoryName, otherName } from '../i18n/index.js'

export default function useEnrichedExpenses() {
  const expenses = useDataStore((s) => s.expenses)
  const categories = useDataStore((s) => s.categories)
  const lang = useLang()

  return useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]))
    return expenses.map((e) => {
      const cat = byId.get(e.categoryId)
      return {
        ...e,
        categoryName: cat ? categoryName(cat, lang) : otherName(lang),
        color: cat?.color ?? '#8B8B93',
        icon: cat?.icon ?? null,
      }
    })
  }, [expenses, categories, lang])
}