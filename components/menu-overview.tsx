"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ChevronDown, MoreHorizontal, Loader2, Edit, ArrowUp, ArrowDown } from "lucide-react"
import { ItemDetailModal } from "./item-detail-modal"
import { AddMenuItemModal } from "./add-menu-item-modal"
import { EditCategoryModal } from "./edit-category-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getMenuCategories, getMenuItems, updateCategoryOrders } from "@/lib/services/menu"
import type { MenuItem as FirebaseMenuItem, MenuCategory } from "@/lib/types/menu"

interface DisplayMenuItem {
  id: string
  name: string
  price: string
  image: string
  firebaseData: FirebaseMenuItem
}

interface DisplayCategory {
  name: string
  count: number
  items: DisplayMenuItem[]
  categoryData: MenuCategory
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function MenuOverview() {
  const [selectedItem, setSelectedItem] = useState<FirebaseMenuItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<DisplayCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterAvailability, setFilterAvailability] = useState("all-schedules")
  const [filterStatus, setFilterStatus] = useState("all-items")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)

  useEffect(() => {
    loadMenuData()
  }, [filterAvailability, filterStatus])

  async function loadMenuData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch real data from Firebase
      const [firebaseCategories, firebaseItems] = await Promise.all([
        getMenuCategories(),
        getMenuItems({
          availableOnly: filterStatus === 'available',
          sortBy: 'name',
          sortOrder: 'asc'
        })
      ])

      const displayCategories = transformToDisplayFormat(firebaseCategories, firebaseItems)
      setCategories(displayCategories)

      // Show helpful message if no data exists
      if (firebaseCategories.length === 0 && firebaseItems.length === 0) {
        console.log('No menu data found in database. Please import menu data first.')
      }
    } catch (err) {
      console.error('Error loading menu data:', err)
      setError('Failed to load menu data from database')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  function transformToDisplayFormat(categories: MenuCategory[], items: FirebaseMenuItem[]): DisplayCategory[] {
    return categories.map((category, index) => {
      const categoryItems = items
        .filter(item => item.categoryName === category.name)
        .filter(item => {
          if (filterStatus === 'available') return item.availableStatus === 'AVAILABLE'
          if (filterStatus === 'unavailable') return item.availableStatus !== 'AVAILABLE'
          return true
        })
        .filter(item => {
          if (!searchTerm) return true
          return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        })
        .map(item => ({
          id: item.id,
          name: item.name,
          price: formatPrice(item.price),
          image: item.photos[0] || "/api/placeholder/60/60",
          firebaseData: item
        }))

      // Ensure displayOrder exists, use index as fallback
      const categoryData = {
        ...category,
        displayOrder: category.displayOrder ?? index + 1
      }

      return {
        name: category.name,
        count: categoryItems.length,
        items: categoryItems,
        categoryData: categoryData
      }
    })
  }

  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const moveCategoryUp = async (categoryIndex: number) => {
    if (categoryIndex === 0) return

    try {
      const newCategories = [...categories]
      const categoryToMove = newCategories[categoryIndex]
      const categoryAbove = newCategories[categoryIndex - 1]

      // Safety checks
      if (!categoryToMove?.categoryData || !categoryAbove?.categoryData) {
        console.error('Invalid category data for move operation')
        return
      }

      // Ensure display orders exist
      const currentOrder = categoryToMove.categoryData.displayOrder ?? categoryIndex + 1
      const aboveOrder = categoryAbove.categoryData.displayOrder ?? categoryIndex

      // Update display orders
      categoryToMove.categoryData.displayOrder = aboveOrder
      categoryAbove.categoryData.displayOrder = currentOrder

      // Swap positions in array
      newCategories[categoryIndex] = categoryAbove
      newCategories[categoryIndex - 1] = categoryToMove

      setCategories(newCategories)

      // Update in database
      await updateCategoryOrders([
        { id: categoryToMove.categoryData.id, displayOrder: categoryToMove.categoryData.displayOrder },
        { id: categoryAbove.categoryData.id, displayOrder: categoryAbove.categoryData.displayOrder }
      ])
    } catch (error) {
      console.error('Error moving category up:', error)
      // Reload data to reset state
      loadMenuData()
    }
  }

  const moveCategoryDown = async (categoryIndex: number) => {
    if (categoryIndex === categories.length - 1) return

    try {
      const newCategories = [...categories]
      const categoryToMove = newCategories[categoryIndex]
      const categoryBelow = newCategories[categoryIndex + 1]

      // Safety checks
      if (!categoryToMove?.categoryData || !categoryBelow?.categoryData) {
        console.error('Invalid category data for move operation')
        return
      }

      // Ensure display orders exist
      const currentOrder = categoryToMove.categoryData.displayOrder ?? categoryIndex + 1
      const belowOrder = categoryBelow.categoryData.displayOrder ?? categoryIndex + 2

      // Update display orders
      categoryToMove.categoryData.displayOrder = belowOrder
      categoryBelow.categoryData.displayOrder = currentOrder

      // Swap positions in array
      newCategories[categoryIndex] = categoryBelow
      newCategories[categoryIndex + 1] = categoryToMove

      setCategories(newCategories)

      // Update in database
      await updateCategoryOrders([
        { id: categoryToMove.categoryData.id, displayOrder: categoryToMove.categoryData.displayOrder },
        { id: categoryBelow.categoryData.id, displayOrder: categoryBelow.categoryData.displayOrder }
      ])
    } catch (error) {
      console.error('Error moving category down:', error)
      // Reload data to reset state
      loadMenuData()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading menu data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading menu</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadMenuData}
            className="mt-2 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg border border-purple-600 bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Add new item
          </button>

          <Select value={filterAvailability} onValueChange={setFilterAvailability}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-schedules">All availability schedules</SelectItem>
              <SelectItem value="weekdays">Weekdays only</SelectItem>
              <SelectItem value="weekends">Weekends only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-items">All items</SelectItem>
              <SelectItem value="available">Available items</SelectItem>
              <SelectItem value="unavailable">Unavailable items</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">CATEGORIES</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            {/* All Categories option */}
            <div
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors ${
                selectedCategory === null
                  ? 'bg-purple-100 border border-purple-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-sm font-medium ${
                selectedCategory === null ? 'text-purple-900' : 'text-gray-900'
              }`}>
                All Categories
              </span>
              <span className="text-sm text-gray-500">
                {filteredCategories.reduce((total, cat) => total + cat.count, 0)}
              </span>
            </div>

            {filteredCategories.map((category, index) => (
              <div
                key={category.name}
                className={`group rounded-lg border transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-purple-100 border-purple-200'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center p-3">
                  <div
                    onClick={() => setSelectedCategory(category.name)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        selectedCategory === category.name ? 'text-purple-900 font-medium' : 'text-gray-900'
                      }`}>
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </div>

                  <div className="ml-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveCategoryUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-3 w-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => moveCategoryDown(index)}
                      disabled={index === filteredCategories.length - 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-3 w-3 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(category.categoryData)}
                      className="p-1 rounded hover:bg-gray-200"
                      title="Edit category"
                    >
                      <Edit className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">ITEMS</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            {filteredCategories
              .filter(category => selectedCategory === null || category.name === selectedCategory)
              .flatMap(category => category.items)
              .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.firebaseData)}
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="h-15 w-15 rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/60/60"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.price}</p>
                  {item.firebaseData.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.firebaseData.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.firebaseData.availableStatus === 'AVAILABLE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.firebaseData.availableStatus === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.firebaseData.categoryName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filteredCategories
              .filter(category => selectedCategory === null || category.name === selectedCategory)
              .every(category => category.items.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No menu items found</p>
                {searchTerm && (
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                )}
                {selectedCategory && !searchTerm && (
                  <p className="text-sm mt-1">No items found in "{selectedCategory}" category</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            loadMenuData() // Refresh the data after successful update
          }}
        />
      )}

      <AddMenuItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadMenuData() // Refresh the data after successful addition
        }}
        categories={categories.map(c => c.name)}
      />

      <EditCategoryModal
        category={editingCategory}
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSuccess={() => {
          loadMenuData() // Refresh the data after successful update
        }}
      />
    </div>
  )
}