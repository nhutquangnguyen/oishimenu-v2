"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Search, Plus, Loader2 } from "lucide-react"
import { getMenuCategories, getMenuItems } from "@/lib/services/menu"
import type { MenuItem as FirebaseMenuItem, MenuCategory } from "@/lib/types/menu"

interface POSMenuItem {
  id: string
  menuItemId: string
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
  const { t } = useTranslation()
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

      // Remove duplicates by category name
      const uniqueCategories = firebaseCategories.filter((category, index, self) =>
        index === self.findIndex(c => c.name === category.name)
      )
      setCategories(uniqueCategories)

      // Transform Firebase menu items to POS format
      const posMenuItems: POSMenuItem[] = firebaseItems.map(item => ({
        id: item.id,
        menuItemId: item.id,
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
    // Mobile-first responsive grid
    const baseClasses = "grid-cols-2 sm:grid-cols-3"

    switch (itemsPerRow) {
      case 2: return `${baseClasses} lg:grid-cols-2`
      case 3: return `${baseClasses} lg:grid-cols-3`
      case 4: return `${baseClasses} lg:grid-cols-4`
      case 5: return `${baseClasses} lg:grid-cols-5`
      case 6: return `${baseClasses} lg:grid-cols-6`
      default: return `${baseClasses} lg:grid-cols-4`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">{t('pos.loading')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="text-red-800">
          <h3 className="font-medium">{t('pos.errorLoading')}</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadMenuData}
            className="mt-2 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
          >
            {t('pos.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('pos.searchMenu')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('pos.itemsPerRow')}:</label>
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
          className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-purple-50 text-gray-700"
          }`}
        >
          <span className="text-lg sm:text-xl">🍽️</span>
          <span className="text-xs font-medium">{t('pos.allCategories')}</span>
        </button>

        {/* Dynamic Categories from Firebase */}
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-purple-50 text-gray-700"
            }`}
          >
            <span className="text-lg sm:text-xl">{categoryIcons[category.name] || "🍴"}</span>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      <div className={`grid ${getGridClass()} gap-4`}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onAddItem(item)}
          >
            <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {item.image && item.image !== "/api/placeholder/120/120" ? (
                <>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.opacity = '1';
                    }}
                    style={{ opacity: 0 }}
                  />
                  <div className="fallback-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-900" style={{ display: 'none' }}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">No Image</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-700 to-teal-900">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-medium">No Image</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-4">
              <h3
                className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 overflow-hidden whitespace-nowrap text-ellipsis"
                title={item.name}
              >
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {item.price.toLocaleString()}₫
                </p>
                <button className="px-2 py-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 transition-colors duration-200 font-medium text-xs touch-manipulation">
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