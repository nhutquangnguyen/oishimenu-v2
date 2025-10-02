"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Package,
  Edit3,
  Trash2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Bell,
  CheckCircle,
  XCircle
} from "lucide-react"
import type { Ingredient, StockAlert, InventoryFilter } from "@/lib/types/inventory"
import { getIngredients, getStockAlerts, acknowledgeStockAlert } from "@/lib/services/inventory"
import { AddIngredientModal } from "./add-ingredient-modal"
import { EditIngredientModal } from "./edit-ingredient-modal"

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

function formatUnit(quantity: number, unit: string): string {
  return `${quantity} ${unit}${quantity !== 1 ? 's' : ''}`
}

export function InventoryManagement() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'cost'>('name')

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'protein', label: 'Protein' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'spices', label: 'Spices' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    loadInventoryData()
  }, [selectedCategory, filterLowStock, sortBy])

  const loadInventoryData = async () => {
    setLoading(true)
    try {
      const filter: InventoryFilter = {
        category: selectedCategory === 'all' ? undefined : [selectedCategory],
        lowStock: filterLowStock || undefined,
        active: true,
        sortBy: sortBy,
        sortOrder: 'asc'
      }

      const [ingredientsData, alertsData] = await Promise.all([
        getIngredients(filter),
        getStockAlerts()
      ])

      setIngredients(ingredientsData)
      setAlerts(alertsData)
    } catch (error) {
      console.error('Error loading inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledgeAlert = async (alertId: string) => {
    const success = await acknowledgeStockAlert(alertId, 'current_user')
    if (success) {
      setAlerts(alerts.filter(alert => alert.id !== alertId))
    }
  }

  const filteredIngredients = ingredients.filter(ingredient => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        ingredient.name.toLowerCase().includes(searchLower) ||
        ingredient.description?.toLowerCase().includes(searchLower) ||
        ingredient.supplier?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const totalValue = filteredIngredients.reduce((total, ingredient) =>
    total + (ingredient.currentQuantity * ingredient.costPerUnit), 0
  )

  const lowStockCount = filteredIngredients.filter(ingredient =>
    ingredient.currentQuantity <= ingredient.minimumThreshold
  ).length

  const criticalStockCount = filteredIngredients.filter(ingredient =>
    ingredient.currentQuantity <= ingredient.minimumThreshold * 0.5
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ingredients</p>
              <p className="text-2xl font-bold text-gray-900">{filteredIngredients.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">Stock Alerts ({alerts.length})</h3>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between bg-white rounded p-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.alertLevel === 'critical' ? 'text-red-600' :
                    alert.alertLevel === 'out_of_stock' ? 'text-red-800' : 'text-orange-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{alert.ingredientName}</p>
                    <p className="text-sm text-gray-600">
                      Current: {alert.currentQuantity} | Minimum: {alert.minimumThreshold}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Acknowledge
                </button>
              </div>
            ))}
            {alerts.length > 3 && (
              <p className="text-sm text-gray-600">
                ... and {alerts.length - 3} more alerts
              </p>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'quantity' | 'cost')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="cost">Sort by Cost</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Low stock only</span>
          </label>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Ingredient
        </button>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingredient
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost/Unit
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredients.map((ingredient) => {
                const isLowStock = ingredient.currentQuantity <= ingredient.minimumThreshold
                const isCritical = ingredient.currentQuantity <= ingredient.minimumThreshold * 0.5
                const totalValue = ingredient.currentQuantity * ingredient.costPerUnit

                return (
                  <tr key={ingredient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{ingredient.name}</div>
                        {ingredient.description && (
                          <div className="text-sm text-gray-500">{ingredient.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {ingredient.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {formatUnit(ingredient.currentQuantity, ingredient.unit)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {formatUnit(ingredient.minimumThreshold, ingredient.unit)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {ingredient.currentQuantity <= 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3" />
                          Out of Stock
                        </span>
                      ) : isCritical ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3" />
                          Critical
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TrendingDown className="h-3 w-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatPrice(ingredient.costPerUnit)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(totalValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ingredient.supplier || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingIngredient(ingredient)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit ingredient"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete ingredient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No ingredients found</p>
              {searchTerm && (
                <p className="text-sm">Try adjusting your search or filters</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false)
          loadInventoryData()
        }}
      />

      <EditIngredientModal
        ingredient={editingIngredient}
        isOpen={!!editingIngredient}
        onClose={() => setEditingIngredient(null)}
        onSuccess={() => {
          setEditingIngredient(null)
          loadInventoryData()
        }}
      />
    </div>
  )
}