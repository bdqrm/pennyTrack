import { getIconComponent } from './icons.js'

export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & drinks', color: '#F5A524', iconKey: 'UtensilsCrossed' },
  { id: 'transport', name: 'Transport', color: '#4C8DFF', iconKey: 'Car' },
  { id: 'groceries', name: 'Groceries', color: '#3ECF6E', iconKey: 'ShoppingCart' },
  { id: 'entertainment', name: 'Entertainment', color: '#E05AC8', iconKey: 'Clapperboard' },
  { id: 'bills', name: 'Bills & utilities', color: '#E85A4A', iconKey: 'Receipt' },
  { id: 'education', name: 'Education', color: '#7C6CFF', iconKey: 'GraduationCap' },
  { id: 'health', name: 'Health', color: '#2EC4B6', iconKey: 'HeartPulse' },
  { id: 'home', name: 'Home', color: '#FF8A4C', iconKey: 'House' },
  { id: 'subscriptions', name: 'Subscriptions', color: '#38BDF8', iconKey: 'Repeat' },
  { id: 'other', name: 'Other', color: '#8B8B93', iconKey: 'Package' },
]

export const DEFAULT_ICONS = new Map(DEFAULT_CATEGORIES.map((c) => [c.id, c.iconKey]))

export function getCategoryIcon(id) {
  return getIconComponent(DEFAULT_ICONS.get(id))
}

export function getCategoryColor(id) {
  return DEFAULT_CATEGORIES.find((c) => c.id === id)?.color ?? '#8B8B93'
}