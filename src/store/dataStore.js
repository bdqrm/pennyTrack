import { create } from 'zustand'
import {
  expenseRepository,
  categoryRepository,
  budgetRepository,
} from '../repositories/repositories.js'
import { currentMonthKey } from '../utils/date.js'
import { DEFAULT_CATEGORIES } from '../utils/categories.js'
import { Package } from 'lucide-react'

const DEFAULT_ICON_MAP = new Map(DEFAULT_CATEGORIES.map((c) => [c.id, c.icon]))

export const useDataStore = create((set, get) => ({
  ready: false,
  expenses: [],
  categories: [],
  budget: null,

  async load() {
    const [expenses, categories, budget] = await Promise.all([
      expenseRepository.getAll(),
      categoryRepository.getAll(),
      budgetRepository.getCurrentOrRecent(),
    ])
    set({
      expenses,
      categories: categories.map((c) => ({
        ...c,
        icon: DEFAULT_ICON_MAP.get(c.id) ?? Package,
      })),
      budget,
      ready: true,
    })
  },

  async addExpense(input) {
    const expense = await expenseRepository.create(input)
    set({ expenses: [expense, ...get().expenses] })
    return expense
  },

  async updateExpense(id, input) {
    const updated = await expenseRepository.update(id, input)
    set({
      expenses: get().expenses
        .map((e) => (e.id === id ? updated : e))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    })
  },

  async deleteExpense(id) {
    await expenseRepository.remove(id)
    set({ expenses: get().expenses.filter((e) => e.id !== id) })
  },

  async setBudget(amount) {
    const monthKey = currentMonthKey()
    const budget = await budgetRepository.setForMonth(monthKey, amount)
    set({ budget })
  },

  async clearBudget() {
    const { budget } = get()
    if (!budget) return
    await budgetRepository.remove(budget.id)
    set({ budget: null })
  },

  categoryById: (id) => get().categories.find((c) => c.id === id),
}))