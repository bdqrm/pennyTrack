import { create } from 'zustand'
import {
  expenseRepository,
  categoryRepository,
  budgetRepository,
  categoryBudgetRepository,
} from '../repositories/repositories.js'
import { currentMonthKey } from '../utils/date.js'
import { DEFAULT_ICONS } from '../utils/categories.js'
import { getIconComponent } from '../utils/icons.js'

function enrichCategories(rows) {
  return rows.map((c) => ({
    ...c,
    iconKey: c.icon || DEFAULT_ICONS.get(c.id),
    icon: getIconComponent(c.icon || DEFAULT_ICONS.get(c.id)),
  }))
}

export const useDataStore = create((set, get) => ({
  ready: false,
  expenses: [],
  categories: [],
  budget: null,
  categoryBudgets: [],

  async load() {
    const [expenses, categories, budget, categoryBudgets] = await Promise.all([
      expenseRepository.getAll(),
      categoryRepository.getAll(),
      budgetRepository.getCurrentOrRecent(),
      categoryBudgetRepository.getAllForMonth(currentMonthKey()),
    ])
    set({
      expenses,
      categories: enrichCategories(categories),
      budget,
      categoryBudgets,
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

  async addCategory(input) {
    const category = await categoryRepository.create(input)
    set({ categories: [...get().categories, ...enrichCategories([category])] })
    return category
  },

  async updateCategory(id, patch) {
    const updated = await categoryRepository.update(id, patch)
    set({
      categories: get().categories.map((c) => (c.id === id ? enrichCategories([updated])[0] : c)),
    })
  },

  async deleteCategory(id) {
    const category = get().categories.find((c) => c.id === id)
    if (category?.isDefault) return
    await categoryRepository.remove(id)
    set({ categories: get().categories.filter((c) => c.id !== id) })
  },

  categoryUsedCount: async (id) => categoryRepository.usedCount(id),

  async setCategoryBudget(monthKey, categoryId, amount) {
    const budget = await categoryBudgetRepository.setForMonth(monthKey, categoryId, amount)
    set({
      categoryBudgets: [
        ...get().categoryBudgets.filter((b) => !(b.monthKey === monthKey && b.categoryId === categoryId)),
        budget,
      ],
    })
    return budget
  },

  async clearCategoryBudget(id) {
    await categoryBudgetRepository.remove(id)
    set({ categoryBudgets: get().categoryBudgets.filter((b) => b.id !== id) })
  },

  categoryById: (id) => get().categories.find((c) => c.id === id),
}))