"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Save } from "lucide-react"
import { updateMenuCategory, deleteMenuCategory } from "@/lib/services/menu"
import type { MenuCategory } from "@/lib/types/menu"

interface EditCategoryModalProps {
  category: MenuCategory | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditCategoryModal({ category, isOpen, onClose, onSuccess }: EditCategoryModalProps) {
  const [name, setName] = useState("")
  const [displayOrder, setDisplayOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setDisplayOrder(category.displayOrder)
      setIsActive(category.isActive)
    } else {
      setName("")
      setDisplayOrder(1)
      setIsActive(true)
    }
    setError(null)
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    setLoading(true)
    setError(null)

    try {
      const updates: Partial<MenuCategory> = {
        name: name.trim(),
        displayOrder,
        isActive,
      }

      const success = await updateMenuCategory(category.id, updates)

      if (success) {
        onSuccess()
        onClose()
      } else {
        setError("Failed to update category")
      }
    } catch (err) {
      console.error('Error updating category:', err)
      setError("Failed to update category")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!category) return

    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${category.name}"? This cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)
    setError(null)

    try {
      const success = await deleteMenuCategory(category.id)

      if (success) {
        onSuccess()
        onClose()
      } else {
        setError("Failed to delete category")
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      setError("Failed to delete category")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !category) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              placeholder="Enter category name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
              min="1"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              disabled={loading}
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active category
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}