"use client"

import { useState } from "react"
import { X, Plus, Trash2, ChefHat, Copy } from "lucide-react"
import { RecipeEditor } from "@/components/recipe-editor"
import type { MenuItem, OptionGroup, MenuOption, MenuItemSize } from "@/lib/types/menu"
import type { MenuItemRecipe, Recipe, SizeRecipe } from "@/lib/types/inventory"

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
    optionGroups: [] as OptionGroup[],
    sizes: [] as MenuItemSize[],
    defaultSize: "",
    // Legacy fields for backward compatibility
    recipe: null as MenuItemRecipe | null,
    costPrice: 0
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showRecipeEditor, setShowRecipeEditor] = useState(false)
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null)
  const [currentSizeRecipe, setCurrentSizeRecipe] = useState<Recipe | null>(null)

  if (!isOpen) return null

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price).replace('₫', 'đ');
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
      price: parseInt(formData.price) || 0,
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
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      } : undefined,
      costPrice: originalSize.costPrice
    }

    setFormData({
      ...formData,
      sizes: [...formData.sizes, clonedSize]
    })
  }

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
        sizes: formData.sizes,
        defaultSize: formData.defaultSize,
        // Legacy fields for backward compatibility
        recipe: formData.recipe,
        costPrice: formData.costPrice
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
        optionGroups: [],
        sizes: [],
        defaultSize: "",
        // Legacy fields for backward compatibility
        recipe: null,
        costPrice: 0
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

          {/* Sizes, Recipes & Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sizes, Recipes & Pricing</h3>
              <button
                type="button"
                onClick={handleAddSize}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                <Plus className="h-4 w-4" />
                Add Size
              </button>
            </div>

            {formData.sizes.length > 0 ? (
              <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
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
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditSizeRecipe(index)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Edit recipe for this size"
                        >
                          <ChefHat className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCloneSize(index)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="Clone this size"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSize(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                          title="Delete this size"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Recipe Information */}
                    {size.recipe ? (
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <div className="text-xs text-gray-600">
                          <div className="grid grid-cols-3 gap-4">
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
                          {size.costPrice && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <p className="text-green-600">
                                <span className="font-medium">Cost:</span> {formatPrice(size.costPrice)} |
                                <span className="font-medium"> Margin:</span> {formatPrice(size.price - size.costPrice)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded p-3 border border-gray-200 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                          No recipe defined for this size
                        </p>
                        <button
                          type="button"
                          onClick={() => handleEditSizeRecipe(index)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Add Recipe
                        </button>
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
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                >
                  Add Your First Size
                </button>
              </div>
            )}
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