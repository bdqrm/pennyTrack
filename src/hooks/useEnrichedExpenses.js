import { useMemo } from 'react'
import { useDataStore } from '../store/dataStore.js'

export default function useEnrichedExpenses() {
  const expenses = useDataStore((s) => s.expenses)
  const categories = useDataStore((s) => s.categories)

  return useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]))
    return expenses.map((e) => ({
      ...e,
      categoryName: byId.get(e.categoryId)?.name ?? 'Other',
      color: byId.get(e.categoryId)?.color ?? '#8B8B93',
      icon: byId.get(e.categoryId)?.icon ?? null,
    }))
  }, [expenses, categories])
}