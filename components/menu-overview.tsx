"use client"

import { useState, useEffect } from "react"
import { Plus, Search, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react"
import { EditItemModal } from "./edit-item-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getMenuCategories, getMenuItems, getMockMenuData } from "@/lib/services/menu"
import type { MenuItem as FirebaseMenuItem, MenuCategory } from "@/lib/types/menu"
import { AddMenuItemModal } from "./add-menu-item-modal"

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
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function MenuOverview() {
  const [selectedItem, setSelectedItem] = useState<DisplayMenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<DisplayCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterAvailability, setFilterAvailability] = useState("all-schedules")
  const [filterStatus, setFilterStatus] = useState("all-items")
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadMenuData()
  }, [filterAvailability, filterStatus])

  async function loadMenuData() {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from Firebase first
      const [firebaseCategories, firebaseItems] = await Promise.all([
        getMenuCategories(),
        getMenuItems({
          availableOnly: filterStatus === 'available',
          sortBy: 'name',
          sortOrder: 'asc'
        })
      ])

      // If no data from Firebase, use mock data
      if (firebaseCategories.length === 0 && firebaseItems.length === 0) {
        console.log('No Firebase data found, using mock data')
        const mockData = getMockMenuData()
        const displayCategories = transformToDisplayFormat(mockData.categories, mockData.items)
        setCategories(displayCategories)
      } else {
        const displayCategories = transformToDisplayFormat(firebaseCategories, firebaseItems)
        setCategories(displayCategories)
      }
    } catch (err) {
      console.error('Error loading menu data:', err)
      setError('Failed to load menu data')

      // Fallback to mock data on error
      const mockData = getMockMenuData()
      const displayCategories = transformToDisplayFormat(mockData.categories, mockData.items)
      setCategories(displayCategories)
    } finally {
      setLoading(false)
    }
  }

  function transformToDisplayFormat(categories: MenuCategory[], items: FirebaseMenuItem[]): DisplayCategory[] {
    return categories.map(category => {
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

      return {
        name: category.name,
        count: categoryItems.length,
        items: categoryItems
      }
    })
  }

  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })

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
            {filteredCategories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-sm text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">{category.count}</span>
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
            {filteredCategories.flatMap(category => category.items).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
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
            {filteredCategories.every(category => category.items.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No menu items found</p>
                {searchTerm && (
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <EditItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <AddMenuItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadMenuData() // Refresh the data after successful addition
        }}
        categories={[
          ...categories.map(c => c.name),
          "Cà Phê - Coffee",
          "Trà Sữa",
          "Trà - Tea",
          "Matcha",
          "Đồ Ăn Nhanh"
        ].filter((category, index, arr) => arr.indexOf(category) === index)} // Remove duplicates
      />
    </div>
  )
}