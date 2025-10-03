"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Loader2 } from "lucide-react"
import { getMenuCategories, getMenuItems } from "@/lib/services/menu"
import type { MenuItem as FirebaseMenuItem, MenuCategory } from "@/lib/types/menu"

interface POSMenuItem {
  id: string
  name: string
  price: number
  category: string
  image?: string
  firebaseData: FirebaseMenuItem
}

interface POSMenuGridProps {
  onAddItem: (item: POSMenuItem) => void
}

const categoryIcons: { [key: string]: string } = {
  "COFFEE & COCOA": "☕",
  "MATCHA": "🍵",
  "TEA": "🫖",
  "TRÀ SỮA - MILK TEA": "🧋",
  "ICED BLEND": "🧊",
  "FAST FOOD": "🍔"
}

export function POSMenuGrid({ onAddItem }: POSMenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menuItems, setMenuItems] = useState<POSMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemsPerRow, setItemsPerRow] = useState(4)

  useEffect(() => {
    loadMenuData()
  }, [])

  async function loadMenuData() {
    try {
      setLoading(true)
      setError(null)

      const [firebaseCategories, firebaseItems] = await Promise.all([
        getMenuCategories(),
        getMenuItems({
          availableOnly: true,
          sortBy: 'name',
          sortOrder: 'asc'
        })
      ])

      setCategories(firebaseCategories)

      // Transform Firebase menu items to POS format
      const posMenuItems: POSMenuItem[] = firebaseItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.categoryName,
        image: item.photos[0] || "/api/placeholder/120/120",
        firebaseData: item
      }))

      setMenuItems(posMenuItems)
    } catch (err) {
      console.error('Error loading menu data:', err)
      setError('Failed to load menu data')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getGridClass = () => {
    switch (itemsPerRow) {
      case 2: return "grid-cols-2"
      case 3: return "grid-cols-3"
      case 4: return "grid-cols-4"
      case 5: return "grid-cols-5"
      case 6: return "grid-cols-6"
      default: return "grid-cols-4"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading menu...</span>
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Menu Item"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Items per row:</label>
          <select
            value={itemsPerRow}
            onChange={(e) => setItemsPerRow(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* All Items Category */}
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-purple-50 text-gray-700"
          }`}
        >
          <span className="text-xl">🍽️</span>
          <span className="text-xs font-medium">All Items</span>
        </button>

        {/* Dynamic Categories from Firebase */}
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-purple-50 text-gray-700"
            }`}
          >
            <span className="text-xl">{categoryIcons[category.name] || "🍴"}</span>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      <div className={`grid ${getGridClass()} gap-4`}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => onAddItem(item)}
          >
            <div className="aspect-square relative bg-gradient-to-br from-teal-700 to-teal-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg shadow-inner" />
              </div>
            </div>
            <div className="p-4">
              <h3
                className="text-sm font-semibold text-gray-900 mb-3 overflow-hidden whitespace-nowrap text-ellipsis"
                title={item.name}
              >
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">
                  {item.price.toLocaleString()}₫
                </p>
                <button className="px-2 py-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors duration-200 font-medium text-xs">
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}