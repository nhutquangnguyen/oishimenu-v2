"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calculator, Search } from "lucide-react"
import type { Option } from "@/lib/types/option"
import type { Recipe } from "@/lib/types/inventory"
import { getOptions, addOption, updateOption, deleteOption } from "@/lib/services/option"
import { calculateRecipeCost } from "@/lib/services/inventory"
import { RecipeEditor } from "@/components/recipe-editor"

interface OptionManagementProps {
  className?: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function OptionManagement({ className = "" }: OptionManagementProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Modal states
  const [editingOption, setEditingOption] = useState<Option | null>(null)
  const [showOptionEditor, setShowOptionEditor] = useState(false)
  const [showRecipeEditor, setShowRecipeEditor] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = async () => {
    setLoading(true)
    try {
      const data = await getOptions({ activeOnly: false })
      setOptions(data)
    } catch (error) {
      console.error('Error loading options:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    setEditingOption({
      id: '',
      name: '',
      description: '',
      price: 0,
      isActive: true,
      category: 'topping',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    setShowOptionEditor(true)
  }

  const handleEditOption = (option: Option) => {
    setEditingOption(option)
    setShowOptionEditor(true)
  }

  const handleSaveOption = async (optionData: Partial<Option>) => {
    if (!editingOption) return

    setLoading(true)
    try {
      if (editingOption.id) {
        // Update existing option
        await updateOption(editingOption.id, optionData)
      } else {
        // Add new option
        await addOption(optionData as Omit<Option, 'id' | 'createdAt' | 'updatedAt'>)
      }

      await loadOptions()
      setShowOptionEditor(false)
      setEditingOption(null)
    } catch (error) {
      console.error('Error saving option:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('Are you sure you want to delete this option?')) return

    setLoading(true)
    try {
      await deleteOption(optionId)
      await loadOptions()
    } catch (error) {
      console.error('Error deleting option:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditRecipe = (option: Option) => {
    setEditingOption(option)
    setEditingRecipe(option.recipe || {
      id: `recipe-${Date.now()}`,
      name: `${option.name} Recipe`,
      description: "",
      instructions: "",
      prepTime: 0,
      servingSize: 1,
      ingredients: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })
    setShowRecipeEditor(true)
  }

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!editingOption) return

    try {
      // Calculate cost for the recipe
      const cost = await calculateRecipeCost(recipe)

      // Update the option with the new recipe and calculated price
      await updateOption(editingOption.id, {
        recipe: recipe,
        price: cost
      })

      await loadOptions()
      setShowRecipeEditor(false)
      setEditingOption(null)
      setEditingRecipe(null)
    } catch (error) {
      console.error('Error saving recipe:', error)
    }
  }

  const cancelRecipeEditing = () => {
    setShowRecipeEditor(false)
    setEditingOption(null)
    setEditingRecipe(null)
  }

  // Filter options
  const filteredOptions = options.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || option.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(options.map(o => o.category).filter(Boolean)))]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Option Management</h2>
          <p className="text-gray-600">Manage individual options with recipes and pricing</p>
        </div>
        <button
          onClick={handleAddOption}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Options List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Option
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading options...
                  </td>
                </tr>
              ) : filteredOptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery || selectedCategory !== 'all' ? 'No options match your filters.' : 'No options found. Add your first option to get started.'}
                  </td>
                </tr>
              ) : (
                filteredOptions.map((option) => (
                  <tr key={option.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{option.name}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500">{option.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {option.category || 'uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(option.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {option.recipe ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Calculator className="h-3 w-3" />
                          <span>{option.recipe.ingredients.length} ingredients</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No recipe</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        option.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {option.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditRecipe(option)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Recipe"
                        >
                          <Calculator className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditOption(option)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Option"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Option Editor Modal */}
      {showOptionEditor && editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOption.id ? 'Edit Option' : 'Add New Option'}
              </h3>
              <button
                onClick={() => setShowOptionEditor(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option Name *
                </label>
                <input
                  type="text"
                  value={editingOption.name}
                  onChange={(e) => setEditingOption(prev => prev ? {...prev, name: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Extra Shot, Size L"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingOption.description || ''}
                  onChange={(e) => setEditingOption(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Brief description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingOption.category || ''}
                    onChange={(e) => setEditingOption(prev => prev ? {...prev, category: e.target.value} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="size">Size</option>
                    <option value="topping">Topping</option>
                    <option value="milk">Milk</option>
                    <option value="sweetness">Sweetness</option>
                    <option value="temperature">Temperature</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (VND)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingOption.price}
                    onChange={(e) => setEditingOption(prev => prev ? {...prev, price: parseFloat(e.target.value) || 0} : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingOption.isActive}
                  onChange={(e) => setEditingOption(prev => prev ? {...prev, isActive: e.target.checked} : null)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              {/* Recipe Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipe
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleEditRecipe(editingOption)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Calculator className="h-4 w-4" />
                    {editingOption.recipe ? 'Edit Recipe' : 'Add Recipe'}
                  </button>

                  {editingOption.recipe && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 text-sm">
                        <Calculator className="h-4 w-4" />
                        <span>Recipe with {editingOption.recipe.ingredients.length} ingredients</span>
                        <span>•</span>
                        <span>Cost: {formatPrice(editingOption.price)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowOptionEditor(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveOption(editingOption)}
                disabled={!editingOption.name.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Option'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Editor Modal */}
      {showRecipeEditor && editingRecipe && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Recipe for "{editingOption?.name || 'Option'}"
              </h2>
              <button
                onClick={cancelRecipeEditing}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <RecipeEditor
                recipe={editingRecipe}
                onSave={handleSaveRecipe}
                onCancel={cancelRecipeEditing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}