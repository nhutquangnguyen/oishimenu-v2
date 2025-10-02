"use client"

import { useState, useEffect } from "react"
import { X, Edit3, Save, Trash2, Eye, EyeOff, Plus, ChefHat } from "lucide-react"
import { updateMenuItem, deleteMenuItem } from "@/lib/services/menu"
import { EnhancedOptionGroupModal } from "@/components/enhanced-option-group-modal"
import { RecipeEditor } from "@/components/recipe-editor"
import type { MenuItem, OptionGroup, MenuItemSize } from "@/lib/types/menu"
import type { MenuItemRecipe, Recipe, SizeRecipe } from "@/lib/types/inventory"

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
  const [isOptionGroupModalOpen, setIsOptionGroupModalOpen] = useState(false)
  const [editingOptionGroupIndex, setEditingOptionGroupIndex] = useState<number | null>(null)
  const [currentOptionGroup, setCurrentOptionGroup] = useState<OptionGroup | null>(null)
  const [showRecipeEditor, setShowRecipeEditor] = useState(false)
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null)
  const [currentSizeRecipe, setCurrentSizeRecipe] = useState<Recipe | null>(null)

  // Form data for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availableStatus: "AVAILABLE" as MenuItem['availableStatus'],
    availabilitySchedule: "",
    optionGroups: [] as OptionGroup[],
    sizes: [] as MenuItemSize[],
    defaultSize: "",
    // Legacy fields for backward compatibility
    recipe: null as MenuItemRecipe | null,
    costPrice: 0
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
        optionGroups: item.optionGroups || [],
        sizes: item.sizes || [],
        defaultSize: item.defaultSize || "",
        // Legacy fields for backward compatibility
        recipe: item.recipe || null,
        costPrice: item.costPrice || 0
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
      optionGroups: item.optionGroups || [],
      sizes: item.sizes || [],
      defaultSize: item.defaultSize || "",
      // Legacy fields for backward compatibility
      recipe: item.recipe || null,
      costPrice: item.costPrice || 0
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
        optionGroups: formData.optionGroups,
        sizes: formData.sizes,
        defaultSize: formData.defaultSize,
        // Legacy fields for backward compatibility
        recipe: formData.recipe,
        costPrice: formData.costPrice
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

  const handleAddOptionGroup = () => {
    setCurrentOptionGroup(null)
    setEditingOptionGroupIndex(null)
    setIsOptionGroupModalOpen(true)
  }

  const handleEditOptionGroup = (index: number) => {
    setCurrentOptionGroup(formData.optionGroups[index])
    setEditingOptionGroupIndex(index)
    setIsOptionGroupModalOpen(true)
  }

  const handleSaveOptionGroup = (optionGroup: OptionGroup) => {
    if (editingOptionGroupIndex !== null) {
      // Editing existing option group
      const updatedGroups = formData.optionGroups.map((group, index) =>
        index === editingOptionGroupIndex ? optionGroup : group
      )
      setFormData({ ...formData, optionGroups: updatedGroups })
    } else {
      // Adding new option group
      setFormData({
        ...formData,
        optionGroups: [...formData.optionGroups, optionGroup]
      })
    }
    setIsOptionGroupModalOpen(false)
    setCurrentOptionGroup(null)
    setEditingOptionGroupIndex(null)
  }

  const handleDeleteOptionGroup = (index: number) => {
    if (confirm("Are you sure you want to delete this option group?")) {
      const updatedGroups = formData.optionGroups.filter((_, i) => i !== index)
      setFormData({ ...formData, optionGroups: updatedGroups })
    }
  }

  const handleSaveRecipe = (recipe: Recipe) => {
    // If we're editing a size-specific recipe, use the size-specific handler
    if (editingSizeIndex !== null) {
      return handleSaveSizeRecipe(recipe)
    }

    // Legacy support: if no sizes are defined, save to the legacy recipe field
    if (formData.sizes.length === 0) {
      const menuItemRecipe: MenuItemRecipe = {
        baseRecipe: recipe,
        sizeVariations: undefined
      }

      setFormData({
        ...formData,
        recipe: menuItemRecipe,
        costPrice: recipe.costPerServing || 0
      })
    }

    setShowRecipeEditor(false)
  }

  const handleDeleteRecipe = () => {
    if (confirm("Are you sure you want to delete this recipe? This will remove the cost calculation for this item.")) {
      setFormData({
        ...formData,
        recipe: null,
        costPrice: 0
      })
    }
  }

  // Size management handlers
  const handleAddSize = () => {
    const defaultSizes = ['S', 'M', 'L', 'XL']
    const usedSizes = formData.sizes.map(s => s.size)
    const availableSize = defaultSizes.find(size => !usedSizes.includes(size)) || `Size ${formData.sizes.length + 1}`

    const newSize: MenuItemSize = {
      size: availableSize,
      price: formData.price, // Start with base price
      recipe: undefined,
      costPrice: 0
    }

    setFormData({
      ...formData,
      sizes: [...formData.sizes, newSize],
      defaultSize: formData.defaultSize || availableSize
    })
  }

  const handleEditSizeRecipe = (sizeIndex: number) => {
    const size = formData.sizes[sizeIndex]
    setEditingSizeIndex(sizeIndex)
    setCurrentSizeRecipe(size.recipe || null)
    setShowRecipeEditor(true)
  }

  const handleSaveSizeRecipe = (recipe: Recipe) => {
    if (editingSizeIndex !== null) {
      const updatedSizes = formData.sizes.map((size, index) =>
        index === editingSizeIndex
          ? { ...size, recipe: recipe, costPrice: recipe.costPerServing || 0 }
          : size
      )

      setFormData({
        ...formData,
        sizes: updatedSizes
      })
    }

    setShowRecipeEditor(false)
    setEditingSizeIndex(null)
    setCurrentSizeRecipe(null)
  }

  const handleUpdateSize = (sizeIndex: number, updates: Partial<MenuItemSize>) => {
    const updatedSizes = formData.sizes.map((size, index) =>
      index === sizeIndex ? { ...size, ...updates } : size
    )

    setFormData({
      ...formData,
      sizes: updatedSizes
    })
  }

  const handleCloneSize = (sizeIndex: number) => {
    const originalSize = formData.sizes[sizeIndex]
    const clonedSize: MenuItemSize = {
      size: `${originalSize.size} Copy`,
      price: originalSize.price,
      recipe: originalSize.recipe ? {
        ...originalSize.recipe,
        id: `recipe-${Date.now()}`,
        name: `${originalSize.recipe.name} (Copy)`,
        ingredients: originalSize.recipe.ingredients.map(ingredient => ({
          ...ingredient
        }))
      } : undefined,
      costPrice: originalSize.costPrice
    }

    setFormData({
      ...formData,
      sizes: [...formData.sizes, clonedSize]
    })
  }

  const handleDeleteSize = (sizeIndex: number) => {
    if (confirm("Are you sure you want to delete this size? This will remove its recipe and pricing.")) {
      const sizeToDelete = formData.sizes[sizeIndex]
      const updatedSizes = formData.sizes.filter((_, index) => index !== sizeIndex)

      setFormData({
        ...formData,
        sizes: updatedSizes,
        defaultSize: formData.defaultSize === sizeToDelete.size
          ? (updatedSizes[0]?.size || "")
          : formData.defaultSize
      })
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
      <div className="w-full max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'EDIT ITEM' : 'ITEM DETAILS'}
          </h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Edit item"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 space-y-4">
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
                <label className="block text-sm font-medium text-gray-900 mb-2">NAME</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    disabled={loading}
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-900">{item.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">PRICE</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
                <label className="block text-sm font-medium text-gray-900 mb-2">CATEGORY</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{item.categoryName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">STATUS</label>
                {isEditing ? (
                  <select
                    value={formData.availableStatus}
                    onChange={(e) => setFormData({ ...formData, availableStatus: e.target.value as MenuItem['availableStatus'] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
              <label className="block text-sm font-medium text-gray-900 mb-2">DESCRIPTION</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter item description"
                  disabled={loading}
                />
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg min-h-[3rem]">
                  {item.description || "No description available"}
                </p>
              )}
            </div>

            {/* Sizes, Recipes & Pricing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">SIZES, RECIPES & PRICING</h3>
                {isEditing && (
                  <button
                    onClick={handleAddSize}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Size
                  </button>
                )}
              </div>

              {(isEditing ? formData.sizes : item.sizes || []).length > 0 ? (
                <div className="space-y-3">
                  {(isEditing ? formData.sizes : item.sizes || []).map((size, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                                <input
                                  type="text"
                                  value={size.size}
                                  onChange={(e) => handleUpdateSize(index, { size: e.target.value })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="e.g., S, M, L"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Price (VND)</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={size.price}
                                  onChange={(e) => handleUpdateSize(index, { price: parseInt(e.target.value) || 0 })}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex items-end">
                                <label className="flex items-center text-xs">
                                  <input
                                    type="radio"
                                    name="defaultSize"
                                    checked={formData.defaultSize === size.size}
                                    onChange={() => setFormData({ ...formData, defaultSize: size.size })}
                                    className="mr-1"
                                  />
                                  Default
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                Size {size.size}
                                {item.defaultSize === size.size && (
                                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Default</span>
                                )}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Price: {formatPrice(size.price)}
                              </p>
                              {size.costPrice && (
                                <p className="text-xs text-gray-500">
                                  Cost: {formatPrice(size.costPrice)} | Margin: {formatPrice(size.price - size.costPrice)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {isEditing && (
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditSizeRecipe(index)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                              title="Edit recipe for this size"
                            >
                              <ChefHat className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCloneSize(index)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                              title="Clone this size"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSize(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              title="Delete this size"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Recipe Information */}
                      {size.recipe ? (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="grid grid-cols-3 gap-4 flex-1">
                              <p>
                                <span className="font-medium">Recipe:</span> {size.recipe.name}
                              </p>
                              <p>
                                <span className="font-medium">Ingredients:</span> {size.recipe.ingredients.length}
                              </p>
                              {size.recipe.prepTime && (
                                <p>
                                  <span className="font-medium">Prep:</span> {size.recipe.prepTime}min
                                </p>
                              )}
                            </div>
                            {!isEditing && (
                              <button
                                onClick={() => handleEditSizeRecipe(index)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                title="View recipe details"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded p-3 border border-gray-200 text-center">
                          <p className="text-xs text-gray-500">
                            No recipe defined for this size
                          </p>
                          {isEditing && (
                            <button
                              onClick={() => handleEditSizeRecipe(index)}
                              className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Add Recipe
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <ChefHat className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No sizes defined</p>
                  <p className="text-xs">Add different sizes with individual recipes and pricing</p>
                  {isEditing && (
                    <button
                      onClick={handleAddSize}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Add Your First Size
                    </button>
                  )}
                </div>
              )}

              {/* Legacy Recipe Support */}
              {((isEditing ? formData.recipe : item.recipe) && (isEditing ? formData.sizes : item.sizes || []).length === 0) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 mb-2">
                    <strong>Legacy Recipe Detected:</strong> This item uses the old recipe system.
                  </p>
                  {isEditing && (
                    <button
                      onClick={() => {
                        // Migrate legacy recipe to first size
                        if (formData.recipe) {
                          const newSize: MenuItemSize = {
                            size: 'Regular',
                            price: formData.price,
                            recipe: formData.recipe.baseRecipe,
                            costPrice: formData.costPrice
                          }
                          setFormData({
                            ...formData,
                            sizes: [newSize],
                            defaultSize: 'Regular'
                          })
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Migrate to Size-Based Recipes
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Availability Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">AVAILABILITY SCHEDULE</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.availabilitySchedule}
                  onChange={(e) => setFormData({ ...formData, availabilitySchedule: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">OPTION GROUPS</h3>
                {isEditing && (
                  <button
                    onClick={handleAddOptionGroup}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    Add Group
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {(isEditing ? formData.optionGroups : (item.optionGroups || [])).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <p className="text-sm">No option groups defined</p>
                    <p className="text-xs">Add option groups to allow customers to customize this item</p>
                  </div>
                ) : (
                  (isEditing ? formData.optionGroups : (item.optionGroups || [])).map((group, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{group.name}</h4>
                          <p className="text-sm text-gray-600">
                            {group.minSelection === 0 ? 'Optional' : `Required ${group.minSelection}`} -
                            Up to {group.maxSelection} selection{group.maxSelection > 1 ? 's' : ''}
                          </p>
                        </div>
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditOptionGroup(index)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                              title="Edit option group"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOptionGroup(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              title="Delete option group"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {group.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex justify-between items-center bg-white rounded border p-3">
                            <span className="text-gray-900">{option.name}</span>
                            <span className="font-medium text-gray-700">
                              {option.price > 0 ? `+${formatPrice(option.price)}` : 'Free'}
                            </span>
                          </div>
                        ))}
                        {group.options.length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">No options added yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
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
        <div className="border-t p-4 bg-gray-50 rounded-b-lg flex-shrink-0">
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Item
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Option Group Modal */}
      <EnhancedOptionGroupModal
        isOpen={isOptionGroupModalOpen}
        onClose={() => {
          setIsOptionGroupModalOpen(false)
          setCurrentOptionGroup(null)
          setEditingOptionGroupIndex(null)
        }}
        onSave={handleSaveOptionGroup}
        optionGroup={currentOptionGroup}
      />

      {/* Recipe Editor Modal */}
      {showRecipeEditor && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSizeIndex !== null
                  ? `Edit Recipe for Size ${formData.sizes[editingSizeIndex]?.size || ''}`
                  : (formData.recipe ? 'Edit Recipe' : 'Add Recipe')
                }
              </h2>
              <button
                onClick={() => {
                  setShowRecipeEditor(false)
                  setEditingSizeIndex(null)
                  setCurrentSizeRecipe(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <RecipeEditor
                recipe={editingSizeIndex !== null ? currentSizeRecipe : (formData.recipe?.baseRecipe || null)}
                onSave={handleSaveRecipe}
                onCancel={() => {
                  setShowRecipeEditor(false)
                  setEditingSizeIndex(null)
                  setCurrentSizeRecipe(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}