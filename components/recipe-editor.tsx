"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Calculator, Save } from "lucide-react"
import type { Recipe, RecipeIngredient, Ingredient } from "@/lib/types/inventory"
import { getIngredients, calculateRecipeCost } from "@/lib/services/inventory"

interface RecipeEditorProps {
  recipe?: Recipe | null
  onSave: (recipe: Recipe) => void
  onCancel: () => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function RecipeEditor({ recipe, onSave, onCancel }: RecipeEditorProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [formData, setFormData] = useState<Recipe>({
    id: recipe?.id || `recipe-${Date.now()}`,
    name: recipe?.name || "",
    description: recipe?.description || "",
    instructions: recipe?.instructions || "",
    prepTime: recipe?.prepTime || 0,
    servingSize: recipe?.servingSize || 1,
    ingredients: recipe?.ingredients || [],
    createdAt: recipe?.createdAt || new Date(),
    updatedAt: new Date()
  })
  const [calculatedCost, setCalculatedCost] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadIngredients()
  }, [])

  useEffect(() => {
    calculateCost()
  }, [formData.ingredients])

  const loadIngredients = async () => {
    try {
      const ingredientsData = await getIngredients({ active: true })
      setIngredients(ingredientsData)
    } catch (error) {
      console.error('Error loading ingredients:', error)
    }
  }

  const calculateCost = async () => {
    if (formData.ingredients.length > 0) {
      const cost = await calculateRecipeCost(formData)
      setCalculatedCost(cost)
    }
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, {
        ingredientId: "",
        quantity: 0,
        unit: "kg",
        notes: ""
      }]
    }))
  }

  const updateIngredient = (index: number, updates: Partial<RecipeIngredient>) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, ...updates } : ingredient
      )
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Validate ingredients before saving
      const validIngredients = formData.ingredients.filter(ingredient =>
        ingredient.ingredientId && ingredient.ingredientId.trim() !== ''
      )

      const validatedRecipe = {
        ...formData,
        ingredients: validIngredients
      }

      await onSave(validatedRecipe)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Recipe Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Recipe Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cà phê sữa đá base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size
            </label>
            <input
              type="number"
              min="1"
              value={formData.servingSize}
              onChange={(e) => setFormData(prev => ({ ...prev, servingSize: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the recipe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prep Time (minutes)
          </label>
          <input
            type="number"
            min="0"
            value={formData.prepTime}
            onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
          <button
            onClick={addIngredient}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-4 w-4" />
            Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {formData.ingredients.map((recipeIngredient, index) => {
            const ingredient = ingredients.find(ing => ing.id === recipeIngredient.ingredientId)
            const isIncomplete = !recipeIngredient.ingredientId || recipeIngredient.ingredientId.trim() === ''
            return (
              <div key={index} className={`grid grid-cols-5 gap-3 items-end p-3 border rounded-lg ${
                isIncomplete ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ingredient {isIncomplete && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={recipeIngredient.ingredientId}
                    onChange={(e) => updateIngredient(index, { ingredientId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                      isIncomplete
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select ingredient</option>
                    {ingredients.map(ingredient => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={recipeIngredient.quantity}
                    onChange={(e) => updateIngredient(index, { quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={recipeIngredient.unit}
                    onChange={(e) => updateIngredient(index, { unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder={ingredient?.unit || "unit"}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    value={recipeIngredient.notes || ""}
                    onChange={(e) => updateIngredient(index, { notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Optional notes"
                  />
                </div>

                <div>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    title="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {ingredient && (
                  <div className="col-span-5 text-xs text-gray-500">
                    Cost per unit: {formatPrice(ingredient.costPerUnit)} |
                    Total cost: {formatPrice(recipeIngredient.quantity * ingredient.costPerUnit)}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {calculatedCost > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Calculated Cost per Serving: {formatPrice(calculatedCost)}
              </span>
            </div>
          </div>
        )}
      </div>


      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Step-by-step preparation instructions"
        />
      </div>

      {/* Actions */}
      <div className="pt-4 border-t">
        {/* Validation messages */}
        {(!formData.name || formData.ingredients.length === 0 ||
          formData.ingredients.some(ingredient => !ingredient.ingredientId || ingredient.ingredientId.trim() === '')) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 font-medium mb-1">Recipe validation:</p>
            <ul className="text-xs text-yellow-700 space-y-1">
              {!formData.name && <li>• Recipe name is required</li>}
              {formData.ingredients.length === 0 && <li>• At least one ingredient is required</li>}
              {formData.ingredients.some(ingredient => !ingredient.ingredientId || ingredient.ingredientId.trim() === '') && (
                <li>• All ingredients must be selected (highlighted in red)</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              loading ||
              !formData.name ||
              formData.ingredients.length === 0 ||
              formData.ingredients.some(ingredient => !ingredient.ingredientId || ingredient.ingredientId.trim() === '')
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Recipe'}
          </button>
        </div>
      </div>
    </div>
  )
}