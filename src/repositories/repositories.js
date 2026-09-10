import { getDB, STORES, uid } from '../db/indexedDB.js'
import { DEFAULT_CATEGORIES } from '../utils/categories.js'
import { currentMonthKey, todayStr } from '../utils/date.js'

export const expenseRepository = {
  async getAll() {
    const db = await getDB()
    const rows = await db.getAll(STORES.expenses)
    return rows.sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1
      return a.createdAt < b.createdAt ? 1 : -1
    })
  },

  async create(input) {
    const db = await getDB()
    const expense = {
      id: uid(),
      amount: Number(input.amount),
      categoryId: input.categoryId,
      note: (input.note || '').trim(),
      date: input.date || todayStr(),
      createdAt: new Date().toISOString(),
    }
    await db.put(STORES.expenses, expense)
    return expense
  },

  async update(id, input) {
    const db = await getDB()
    const existing = await db.get(STORES.expenses, id)
    if (!existing) throw new Error('Expense not found')
    const updated = {
      ...existing,
      amount: Number(input.amount),
      categoryId: input.categoryId,
      note: (input.note || '').trim(),
      date: input.date || existing.date,
    }
    await db.put(STORES.expenses, updated)
    return updated
  },

  async remove(id) {
    const db = await getDB()
    await db.delete(STORES.expenses, id)
  },
}

export const categoryRepository = {
  async getAll() {
    const db = await getDB()
    const rows = await db.getAll(STORES.categories)
    if (rows.length > 0) return rows
    await this.seedDefaults()
    return db.getAll(STORES.categories)
  },

  async seedDefaults() {
    const db = await getDB()
    const existing = await db.getAll(STORES.categories)
    if (existing.length > 0) return
    const tx = db.transaction(STORES.categories, 'readwrite')
    for (const category of DEFAULT_CATEGORIES) {
      tx.store.put({
        id: category.id,
        name: category.name,
        color: category.color,
        isDefault: true,
        sortOrder: DEFAULT_CATEGORIES.indexOf(category),
      })
    }
    await tx.done
  },
}

export const budgetRepository = {
  async getForMonth(monthKey) {
    const db = await getDB()
    const all = await db.getAll(STORES.budgets)
    return all.find((b) => b.monthKey === monthKey) ?? null
  },

  async getCurrentOrRecent() {
    const db = await getDB()
    const all = await db.getAll(STORES.budgets)
    if (all.length === 0) return null
    const key = currentMonthKey()
    const current = all.find((b) => b.monthKey === key)
    if (current) return current
    return all.sort((a, b) => (a.monthKey < b.monthKey ? 1 : -1))[0]
  },

  async setForMonth(monthKey, amount) {
    const db = await getDB()
    const existing = await this.getForMonth(monthKey)
    const budget = {
      id: existing?.id ?? uid(),
      monthKey,
      amount: Number(amount),
    }
    await db.put(STORES.budgets, budget)
    return budget
  },

  async remove(id) {
    const db = await getDB()
    await db.delete(STORES.budgets, id)
  },
}

export const settingsRepository = {
  async getAll() {
    const db = await getDB()
    return db.getAll(STORES.settings)
  },

  async set(key, value) {
    const db = await getDB()
    await db.put(STORES.settings, { key, value })
  },
}