"use client"

import { useState, useEffect } from "react"
import { X, Search, Check } from "lucide-react"
import type { OptionGroup, MenuOption, MenuItem } from "@/lib/types/menu"
import { getMenuItems, getMockMenuData } from "@/lib/services/menu"

interface EnhancedOptionGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (optionGroup: OptionGroup) => void
  optionGroup?: OptionGroup | null
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function EnhancedOptionGroupModal({
  isOpen,
  onClose,
  onSave,
  optionGroup
}: EnhancedOptionGroupModalProps) {
  const [formData, setFormData] = useState<OptionGroup>({
    name: "",
    minSelection: 0,
    maxSelection: 1,
    options: [],
    connectedMenuItems: []
  })

  const [loading, setLoading] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuItemsLoading, setMenuItemsLoading] = useState(false)
  const [menuItemSearch, setMenuItemSearch] = useState("")
  const modalId = `selection-type-${Math.floor(Math.random() * 10000)}`

  // Load menu items when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMenuItems()
    }
  }, [isOpen])

  useEffect(() => {
    if (optionGroup) {
      setFormData({
        name: optionGroup.name,
        minSelection: optionGroup.minSelection,
        maxSelection: optionGroup.maxSelection,
        options: optionGroup.options || [],
        connectedMenuItems: optionGroup.connectedMenuItems || []
      })
    } else {
      setFormData({
        name: "",
        minSelection: 0,
        maxSelection: 1,
        options: [],
        connectedMenuItems: []
      })
    }
  }, [optionGroup, isOpen])

  const loadMenuItems = async () => {
    setMenuItemsLoading(true)
    try {
      // Try to load from Firebase first, fallback to mock data
      let items = await getMenuItems()
      if (items.length === 0) {
        // Use mock data if no items in Firebase
        const mockData = getMockMenuData()
        items = mockData.items
      }
      setMenuItems(items)
    } catch (error) {
      console.error('Error loading menu items:', error)
      // Fallback to mock data on error
      const mockData = getMockMenuData()
      setMenuItems(mockData.items)
    } finally {
      setMenuItemsLoading(false)
    }
  }

  const handleMenuItemToggle = (menuItemId: string) => {
    setFormData(prev => {
      const connectedItems = prev.connectedMenuItems || []
      const isConnected = connectedItems.includes(menuItemId)

      return {
        ...prev,
        connectedMenuItems: isConnected
          ? connectedItems.filter(id => id !== menuItemId)
          : [...connectedItems, menuItemId]
      }
    })
  }

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(menuItemSearch.toLowerCase()) ||
    (item.categoryName && item.categoryName.toLowerCase().includes(menuItemSearch.toLowerCase()))
  )

  if (!isOpen) return null

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!formData.name.trim()) return

    setLoading(true)
    try {
      // Save only group-level settings, preserve existing options
      const finalData = {
        ...formData,
        options: optionGroup?.options || []
      }

      onSave(finalData)
      onClose()
    } catch (error) {
      console.error('Error saving option group:', error)
    } finally {
      setLoading(false)
    }
  }

  const isOptional = formData.minSelection === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {optionGroup ? 'EDIT OPTION GROUP' : 'CREATE NEW OPTION GROUP'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 space-y-4">
            {/* Option Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                OPTION GROUP NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="e.g., Kích cỡ, Topping"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Option group name is translated to 4 languages.
              </p>
              <button className="text-sm text-blue-600 hover:underline mt-1">
                Edit translations
              </button>
            </div>


            {/* Selection Rules */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">SELECTION RULES</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 mb-2">Your customer must select</p>

                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={modalId}
                        checked={!isOptional}
                        onChange={() => setFormData(prev => ({ ...prev, minSelection: 1 }))}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        At least 1 option
                      </span>
                    </label>

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={modalId}
                        checked={isOptional}
                        onChange={() => setFormData(prev => ({ ...prev, minSelection: 0 }))}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Optional for your customer to select
                      </span>
                    </label>
                  </div>
                </div>

                {/* Max Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UP TO
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={formData.maxSelection}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        maxSelection: Math.max(1, parseInt(e.target.value) || 1)
                      }))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                    <span className="ml-2 text-sm text-gray-700">option(s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Menu Items */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">CONNECTED MENU ITEMS</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select which menu items will show this option group when customers order them.
              </p>

              {/* Search Menu Items */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={menuItemSearch}
                  onChange={(e) => setMenuItemSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Menu Items List */}
              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {menuItemsLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading menu items...
                  </div>
                ) : filteredMenuItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {menuItemSearch ? 'No menu items match your search.' : 'No menu items available.'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMenuItems.map((menuItem) => {
                      const isConnected = formData.connectedMenuItems?.includes(menuItem.id) || false
                      return (
                        <label
                          key={menuItem.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isConnected}
                            onChange={() => handleMenuItemToggle(menuItem.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{menuItem.name}</p>
                                <p className="text-xs text-gray-500">{menuItem.categoryName || 'No category'}</p>
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatPrice(menuItem.price)}
                              </div>
                            </div>
                          </div>
                          {isConnected && (
                            <Check className="h-4 w-4 text-blue-600 ml-2" />
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Connected Items Summary */}
              {formData.connectedMenuItems && formData.connectedMenuItems.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    Connected to <strong>{formData.connectedMenuItems.length}</strong> menu item(s)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 rounded-b-lg flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSave(e)}
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}