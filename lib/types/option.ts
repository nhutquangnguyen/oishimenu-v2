import type { Recipe } from './inventory'

/**
 * Individual option that can be used across multiple option groups
 */
export interface Option {
  id: string
  name: string
  description?: string
  price: number
  recipe?: Recipe
  isActive: boolean
  category?: string // e.g., 'size', 'topping', 'sweetness'
  createdAt: Date
  updatedAt: Date
}

/**
 * Reference to an option within an option group
 */
export interface OptionReference {
  optionId: string
  displayOrder?: number
  isDefault?: boolean
}

/**
 * Filter for options
 */
export interface OptionFilter {
  category?: string
  activeOnly?: boolean
  searchQuery?: string
}