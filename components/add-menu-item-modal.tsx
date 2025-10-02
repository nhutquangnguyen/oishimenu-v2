"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import type { MenuItem, OptionGroup, MenuOption } from "@/lib/types/menu"

interface AddMenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  categories: string[]
}

export function AddMenuItemModal({ isOpen, onClose, onSuccess, categories }: AddMenuItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryName: "",
    description: "",
    availableStatus: "AVAILABLE" as MenuItem['availableStatus'],
    photos: [""],
    optionGroups: [] as OptionGroup[]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        price: parseInt(formData.price),
        categoryName: formData.categoryName,
        description: formData.description.trim(),
        availableStatus: formData.availableStatus,
        photos: formData.photos.filter(photo => photo.trim() !== ""),
        optionGroups: formData.optionGroups,
      }

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-item', data: menuItem })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add menu item')
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        categoryName: "",
        description: "",
        availableStatus: "AVAILABLE",
        photos: [""],
        optionGroups: []
      })

      onSuccess?.()
      onClose()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPhoto = () => {
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ""]
    }))
  }

  const updatePhoto = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => i === index ? value : photo)
    }))
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const addOptionGroup = () => {
    setFormData(prev => ({
      ...prev,
      optionGroups: [...prev.optionGroups, {
        name: "",
        minSelection: 1,
        maxSelection: 1,
        options: [{ name: "", price: 0 }]
      }]
    }))
  }

  const updateOptionGroup = (groupIndex: number, field: keyof OptionGroup, value: any) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === groupIndex ? { ...group, [field]: value } : group
      )
    }))
  }

  const removeOptionGroup = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.filter((_, i) => i !== groupIndex)
    }))
  }

  const addOption = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, options: [...group.options, { name: "", price: 0 }] }
          : group
      )
    }))
  }

  const updateOption = (groupIndex: number, optionIndex: number, field: keyof MenuOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              options: group.options.map((option, oi) =>
                oi === optionIndex ? { ...option, [field]: value } : option
              )
            }
          : group
      )
    }))
  }

  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, gi) =>
        gi === groupIndex
          ? { ...group, options: group.options.filter((_, oi) => oi !== optionIndex) }
          : group
      )
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Menu Item</h2>
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
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter item name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (VND) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.availableStatus}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  availableStatus: e.target.value as MenuItem['availableStatus']
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE_TODAY">Unavailable Today</option>
                <option value="UNAVAILABLE_PERMANENTLY">Unavailable Permanently</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter item description"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Photos</h3>
              <button
                type="button"
                onClick={addPhoto}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Photo
              </button>
            </div>

            {formData.photos.map((photo, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => updatePhoto(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter photo URL"
                />
                {formData.photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Option Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Option Groups</h3>
              <button
                type="button"
                onClick={addOptionGroup}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Option Group
              </button>
            </div>

            {formData.optionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Option Group {groupIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeOptionGroup(groupIndex)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateOptionGroup(groupIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Size"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Selection
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={group.minSelection}
                      onChange={(e) => updateOptionGroup(groupIndex, 'minSelection', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Selection
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={group.maxSelection}
                      onChange={(e) => updateOptionGroup(groupIndex, 'maxSelection', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <button
                      type="button"
                      onClick={() => addOption(groupIndex)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add Option
                    </button>
                  </div>

                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateOption(groupIndex, optionIndex, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Option name"
                      />
                      <input
                        type="number"
                        min="0"
                        value={option.price}
                        onChange={(e) => updateOption(groupIndex, optionIndex, 'price', parseInt(e.target.value))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Price"
                      />
                      {group.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(groupIndex, optionIndex)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}