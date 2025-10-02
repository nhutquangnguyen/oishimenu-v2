"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Ingredient } from "@/lib/types/inventory"
import { updateIngredient } from "@/lib/services/inventory"

interface EditIngredientModalProps {
  ingredient: Ingredient | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditIngredientModal({ ingredient, isOpen, onClose, onSuccess }: EditIngredientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit: "kg" as Ingredient['unit'],
    currentQuantity: 0,
    minimumThreshold: 0,
    costPerUnit: 0,
    supplier: "",
    category: "other" as Ingredient['category'],
    expiryDate: "",
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        description: ingredient.description || "",
        unit: ingredient.unit,
        currentQuantity: ingredient.currentQuantity,
        minimumThreshold: ingredient.minimumThreshold,
        costPerUnit: ingredient.costPerUnit,
        supplier: ingredient.supplier || "",
        category: ingredient.category,
        expiryDate: ingredient.expiryDate ? ingredient.expiryDate.toISOString().split('T')[0] : "",
        isActive: ingredient.isActive
      })
    }
  }, [ingredient])

  if (!isOpen || !ingredient) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const updates: Partial<Ingredient> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        unit: formData.unit,
        currentQuantity: formData.currentQuantity,
        minimumThreshold: formData.minimumThreshold,
        costPerUnit: formData.costPerUnit,
        supplier: formData.supplier.trim() || undefined,
        category: formData.category,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        isActive: formData.isActive
      }

      const result = await updateIngredient(ingredient.id, updates)

      if (result) {
        onSuccess()
      } else {
        setError("Failed to update ingredient")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ingredient")
    } finally {
      setLoading(false)
    }
  }

  const units = [
    { value: 'gram', label: 'Gram (g)' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'liter', label: 'Liter (L)' },
    { value: 'piece', label: 'Piece (pcs)' },
    { value: 'cup', label: 'Cup' },
    { value: 'tablespoon', label: 'Tablespoon (tbsp)' },
    { value: 'teaspoon', label: 'Teaspoon (tsp)' }
  ]

  const categories = [
    { value: 'dairy', label: 'Dairy' },
    { value: 'protein', label: 'Protein' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'spices', label: 'Spices' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Ingredient</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredient Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cà phê hạt Robusta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the ingredient"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Ingredient['category'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as Ingredient['unit'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Trung Nguyên Coffee"
              />
            </div>
          </div>

          {/* Inventory Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Inventory Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.currentQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentQuantity: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Threshold *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.minimumThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumThreshold: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost per Unit (VND) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.costPerUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active ingredient</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Ingredient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}