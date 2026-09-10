import {
  UtensilsCrossed,
  Car,
  ShoppingCart,
  Clapperboard,
  Receipt,
  GraduationCap,
  HeartPulse,
  House,
  Repeat,
  Package,
} from 'lucide-react'

export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & drinks', color: '#F5A524', icon: UtensilsCrossed },
  { id: 'transport', name: 'Transport', color: '#4C8DFF', icon: Car },
  { id: 'groceries', name: 'Groceries', color: '#3ECF6E', icon: ShoppingCart },
  { id: 'entertainment', name: 'Entertainment', color: '#E05AC8', icon: Clapperboard },
  { id: 'bills', name: 'Bills & utilities', color: '#E85A4A', icon: Receipt },
  { id: 'education', name: 'Education', color: '#7C6CFF', icon: GraduationCap },
  { id: 'health', name: 'Health', color: '#2EC4B6', icon: HeartPulse },
  { id: 'home', name: 'Home', color: '#FF8A4C', icon: House },
  { id: 'subscriptions', name: 'Subscriptions', color: '#38BDF8', icon: Repeat },
  { id: 'other', name: 'Other', color: '#8B8B93', icon: Package },
]

const byId = new Map(DEFAULT_CATEGORIES.map((c) => [c.id, c]))

export function getCategoryIcon(id) {
  return byId.get(id)?.icon ?? Package
}

export function getCategoryColor(id) {
  return byId.get(id)?.color ?? '#8B8B93'
}