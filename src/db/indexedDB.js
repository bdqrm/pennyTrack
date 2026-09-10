import { openDB } from 'idb'

const DB_NAME = 'pennytrack'
const DB_VERSION = 1

export const STORES = {
  expenses: 'expenses',
  categories: 'categories',
  budgets: 'budgets',
  settings: 'settings',
}

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.expenses)) {
          const store = db.createObjectStore(STORES.expenses, { keyPath: 'id' })
          store.createIndex('date', 'date')
          store.createIndex('categoryId', 'categoryId')
        }
        if (!db.objectStoreNames.contains(STORES.categories)) {
          db.createObjectStore(STORES.categories, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(STORES.budgets)) {
          const store = db.createObjectStore(STORES.budgets, { keyPath: 'id' })
          store.createIndex('monthKey', 'monthKey')
        }
        if (!db.objectStoreNames.contains(STORES.settings)) {
          db.createObjectStore(STORES.settings, { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

export function uid() {
  return crypto.randomUUID()
}