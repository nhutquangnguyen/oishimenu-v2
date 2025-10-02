"use client"

import { useState, useEffect } from "react"
import { X, Edit3, Save, Trash2, Eye, EyeOff } from "lucide-react"
import { updateMenuItem, deleteMenuItem } from "@/lib/services/menu"
import { OptionGroupEditor } from "@/components/option-group-editor"
import type { MenuItem, OptionGroup } from "@/lib/types/menu"

interface ItemDetailModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function ItemDetailModal({ item, isOpen, onClose, onSuccess }: ItemDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availableStatus: "AVAILABLE" as MenuItem['availableStatus'],
    availabilitySchedule: "",
    optionGroups: [] as OptionGroup[]
  })

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || "",
        price: item.price,
        availableStatus: item.availableStatus,
        availabilitySchedule: item.availabilitySchedule || "",
        optionGroups: item.optionGroups || []
      })
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
    // Reset form data
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      availableStatus: item.availableStatus,
      availabilitySchedule: item.availabilitySchedule || "",
      optionGroups: item.optionGroups || []
    })
  }

  const handleSave = async () => {
    if (!item) return

    setLoading(true)
    setError(null)

    try {
      const updates: Partial<MenuItem> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        availableStatus: formData.availableStatus,
        availabilitySchedule: formData.availabilitySchedule.trim(),
        optionGroups: formData.optionGroups
      }

      const success = await updateMenuItem(item.id, updates)

      if (success) {
        setIsEditing(false)
        onSuccess() // Refresh the parent data
      } else {
        setError("Failed to update item")
      }
    } catch (err) {
      console.error('Error updating item:', err)
      setError("Failed to update item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This cannot be undone.`
    )

    if (!confirmed) return

    setLoading(true)
    setError(null)

    try {
      const success = await deleteMenuItem(item.id)

      if (success) {
        onSuccess() // Refresh the parent data
        onClose()
      } else {
        setError("Failed to delete item")
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      setError("Failed to delete item")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: MenuItem['availableStatus']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'UNAVAILABLE_TODAY':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNAVAILABLE_PERMANENTLY':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: MenuItem['availableStatus']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available'
      case 'UNAVAILABLE_TODAY':
        return 'Unavailable Today'
      case 'UNAVAILABLE_PERMANENTLY':
        return 'Permanently Unavailable'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Item' : 'Item Details'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
                title="Edit item"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Photos */}
            {item.photos && item.photos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {item.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo || "/api/placeholder/150/150"}
                        alt={`${item.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/150/150"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{item.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-lg font-semibold text-purple-600">{formatPrice(item.price)}</p>
                )}
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{item.categoryName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {isEditing ? (
                  <select
                    value={formData.availableStatus}
                    onChange={(e) => setFormData({ ...formData, availableStatus: e.target.value as MenuItem['availableStatus'] })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                    disabled={loading}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE_TODAY">Unavailable Today</option>
                    <option value="UNAVAILABLE_PERMANENTLY">Permanently Unavailable</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.availableStatus)}`}>
                    {getStatusText(item.availableStatus)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="Enter item description"
                  disabled={loading}
                />
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg min-h-[3rem]">
                  {item.description || "No description available"}
                </p>
              )}
            </div>

            {/* Availability Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Schedule</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.availabilitySchedule}
                  onChange={(e) => setFormData({ ...formData, availabilitySchedule: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., Weekdays only, 9AM-6PM"
                  disabled={loading}
                />
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  {item.availabilitySchedule || "Available during all opening hours"}
                </p>
              )}
            </div>

            {/* Option Groups */}
            <div>
              <OptionGroupEditor
                optionGroups={isEditing ? formData.optionGroups : (item.optionGroups || [])}
                onUpdate={(updatedGroups) => {
                  if (isEditing) {
                    setFormData({ ...formData, optionGroups: updatedGroups })
                  }
                }}
                disabled={!isEditing}
              />
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                {item.createdAt && (
                  <div>
                    <span className="font-medium">Created:</span> {item.createdAt.toLocaleDateString()}
                  </div>
                )}
                {item.updatedAt && (
                  <div>
                    <span className="font-medium">Updated:</span> {item.updatedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-3 justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Item
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}