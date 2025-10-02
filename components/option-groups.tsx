"use client"

import { useState, useEffect } from "react"
import { Plus, Search, MoreHorizontal, Package, Edit3, Trash2, Calculator, X } from "lucide-react"
import { EnhancedOptionGroupModal } from "./enhanced-option-group-modal"
import { RecipeEditor } from "./recipe-editor"
import type { OptionGroup, MenuItem } from "@/lib/types/menu"
import type { Recipe } from "@/lib/types/inventory"
import { getMenuItems, getMockMenuData } from "@/lib/services/menu"
import { calculateRecipeCost } from "@/lib/services/inventory"

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function OptionGroups() {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<OptionGroup | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null)
  const [editingOption, setEditingOption] = useState<{groupIndex: number, optionIndex: number} | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Comprehensive option editing state
  const [showOptionEditor, setShowOptionEditor] = useState(false)
  const [editingOptionData, setEditingOptionData] = useState<{
    groupIndex: number,
    optionIndex: number,
    name: string,
    price: number,
    recipe: Recipe | null
  } | null>(null)

  // Load option groups from localStorage or Firebase (placeholder for now)
  useEffect(() => {
    loadOptionGroups()
    loadMenuItems()
  }, [])

  // Auto-select first group when option groups load
  useEffect(() => {
    if (optionGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(optionGroups[0])
    }
  }, [optionGroups, selectedGroup])

  const loadMenuItems = async () => {
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
    }
  }

  const loadOptionGroups = async () => {
    setLoading(true)
    try {
      // For now, we'll use a placeholder implementation
      // In a real app, this would fetch from Firebase/Firestore
      const savedGroups = localStorage.getItem('globalOptionGroups')
      const version = localStorage.getItem('optionGroupsVersion')

      if (savedGroups && version === '2.0') {
        setOptionGroups(JSON.parse(savedGroups))
      } else {
        // Initialize with some sample Vietnamese option groups matching the interface
        const initialGroups: OptionGroup[] = [
          {
            id: "size-group",
            name: "Kích cỡ",
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: "Size L (mặc định)", price: 0 }
            ],
            connectedMenuItems: []
          },
          {
            id: "coffee-type-group",
            name: "Loại Cafe- Cafe type",
            minSelection: 0,
            maxSelection: 7,
            options: [
              { name: "Cà phê đen", price: 0 },
              { name: "Cà phê sữa", price: 5000 },
              { name: "Cà phê sữa đá", price: 5000 },
              { name: "Cappuccino", price: 15000 },
              { name: "Latte", price: 15000 },
              { name: "Americano", price: 10000 },
              { name: "Espresso", price: 8000 }
            ],
            connectedMenuItems: []
          },
          {
            id: "topping-group",
            name: "Topping",
            minSelection: 0,
            maxSelection: 10,
            options: [
              { name: "Thạch café", price: 5000 },
              { name: "Kem cheese", price: 8000 },
              { name: "Trân châu đen", price: 5000 },
              { name: "Trân châu trắng", price: 5000 },
              { name: "Pudding", price: 6000 },
              { name: "Thạch dừa", price: 5000 },
              { name: "Sương sáo", price: 3000 },
              { name: "Thạch lychee", price: 5000 },
              { name: "Kem vanilla", price: 8000 },
              { name: "Kem chocolate", price: 8000 }
            ],
            connectedMenuItems: []
          },
          {
            id: "milk-type-group",
            name: "Chọn loại sữa",
            minSelection: 0,
            maxSelection: 2,
            options: [
              { name: "Sữa yến mạch", price: 3000 },
              { name: "Sữa tươi", price: 0 }
            ],
            connectedMenuItems: []
          },
          {
            id: "bread-group",
            name: "Ban có đòi bung không? Dừng thêm bánh mì nhé!",
            minSelection: 0,
            maxSelection: 1,
            options: [
              { name: "Có bánh mì", price: 15000 }
            ],
            connectedMenuItems: []
          },
          {
            id: "sweetness-group",
            name: "độ ngọt",
            minSelection: 0,
            maxSelection: 2,
            options: [
              { name: "Không đường", price: 0 },
              { name: "Ít đường (30%)", price: 0 },
              { name: "Vừa đường (50%)", price: 0 },
              { name: "Nhiều đường (100%)", price: 0 }
            ],
            connectedMenuItems: []
          },
          {
            id: "matcha-type-group",
            name: "Chọn loại Matcha",
            minSelection: 0,
            maxSelection: 7,
            options: [
              { name: "Matcha Nhật Bản", price: 10000 },
              { name: "Matcha Việt Nam", price: 5000 },
              { name: "Matcha Ceremonial", price: 20000 },
              { name: "Matcha Latte", price: 15000 },
              { name: "Matcha Frappé", price: 18000 },
              { name: "Matcha Kem", price: 12000 },
              { name: "Matcha Truyền thống", price: 8000 }
            ],
            connectedMenuItems: []
          }
        ]
        setOptionGroups(initialGroups)
        localStorage.setItem('globalOptionGroups', JSON.stringify(initialGroups))
        localStorage.setItem('optionGroupsVersion', '2.0')
      }
    } catch (error) {
      console.error('Error loading option groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = () => {
    setEditingGroup(null)
    setIsModalOpen(true)
  }

  const handleEditGroup = (group: OptionGroup) => {
    setEditingGroup(group)
    setIsModalOpen(true)
  }

  const handleSaveGroup = (group: OptionGroup) => {
    let updatedGroups: OptionGroup[]

    if (editingGroup) {
      // Update existing group - preserve existing options and assign ID if it doesn't exist
      updatedGroups = optionGroups.map(g =>
        g === editingGroup ? {
          ...group,
          id: g.id || `option-group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          options: g.options
        } : g
      )
    } else {
      // Add new group with unique ID
      const newGroup = {
        ...group,
        id: `option-group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      updatedGroups = [...optionGroups, newGroup]
    }

    setOptionGroups(updatedGroups)
    localStorage.setItem('globalOptionGroups', JSON.stringify(updatedGroups))
    localStorage.setItem('optionGroupsVersion', '2.0')
    setIsModalOpen(false)
    setEditingGroup(null)
  }

  const handleAddOption = (groupIndex: number) => {
    const newOption = { name: "New Option", price: 0 }
    const updatedGroups = optionGroups.map((group, index) =>
      index === groupIndex
        ? { ...group, options: [...group.options, newOption] }
        : group
    )
    setOptionGroups(updatedGroups)
    localStorage.setItem('globalOptionGroups', JSON.stringify(updatedGroups))
    localStorage.setItem('optionGroupsVersion', '2.0')
  }

  const handleUpdateOption = (groupIndex: number, optionIndex: number, updates: Partial<typeof optionGroups[0]['options'][0]>) => {
    const updatedGroups = optionGroups.map((group, gIndex) =>
      gIndex === groupIndex
        ? {
            ...group,
            options: group.options.map((option, oIndex) =>
              oIndex === optionIndex ? { ...option, ...updates } : option
            )
          }
        : group
    )
    setOptionGroups(updatedGroups)
    localStorage.setItem('globalOptionGroups', JSON.stringify(updatedGroups))
    localStorage.setItem('optionGroupsVersion', '2.0')
  }

  const handleDeleteOption = (groupIndex: number, optionIndex: number) => {
    if (confirm("Are you sure you want to delete this option?")) {
      const updatedGroups = optionGroups.map((group, gIndex) =>
        gIndex === groupIndex
          ? { ...group, options: group.options.filter((_, oIndex) => oIndex !== optionIndex) }
          : group
      )
      setOptionGroups(updatedGroups)
      localStorage.setItem('globalOptionGroups', JSON.stringify(updatedGroups))
      localStorage.setItem('optionGroupsVersion', '2.0')
    }
  }

  const handleDeleteGroup = (group: OptionGroup) => {
    if (confirm(`Are you sure you want to delete option group "${group.name}"?`)) {
      const updatedGroups = optionGroups.filter(g => g !== group)
      setOptionGroups(updatedGroups)
      localStorage.setItem('globalOptionGroups', JSON.stringify(updatedGroups))
      localStorage.setItem('optionGroupsVersion', '2.0')

      // If deleted group was selected, select another group
      if (selectedGroup === group) {
        setSelectedGroup(updatedGroups.length > 0 ? updatedGroups[0] : null)
      }
    }
  }

  // Comprehensive option editing functions
  const handleEditOptionComprehensive = (groupIndex: number, optionIndex: number) => {
    const option = optionGroups[groupIndex].options[optionIndex]
    setEditingOptionData({
      groupIndex,
      optionIndex,
      name: option.name,
      price: option.price,
      recipe: option.recipe || {
        id: `recipe-${Date.now()}`,
        name: `${option.name} Recipe`,
        description: "",
        instructions: "",
        prepTime: 0,
        servingSize: 1,
        ingredients: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    setShowOptionEditor(true)
  }

  const handleSaveOptionComprehensive = async () => {
    if (!editingOptionData) return

    try {
      const { groupIndex, optionIndex, name, recipe } = editingOptionData

      // Calculate cost for the recipe if it has ingredients
      let calculatedPrice = editingOptionData.price
      if (recipe && recipe.ingredients.length > 0) {
        calculatedPrice = await calculateRecipeCost(recipe)
      }

      // Update the option with all data
      handleUpdateOption(groupIndex, optionIndex, {
        name: name,
        price: calculatedPrice,
        recipe: recipe
      })

      setShowOptionEditor(false)
      setEditingOptionData(null)
    } catch (error) {
      console.error('Error saving option:', error)
    }
  }

  const handleCancelOptionEditing = () => {
    setShowOptionEditor(false)
    setEditingOptionData(null)
  }

  const filteredGroups = optionGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Update selected group if current selection is not in filtered results
  useEffect(() => {
    if (selectedGroup && !filteredGroups.includes(selectedGroup)) {
      setSelectedGroup(filteredGroups.length > 0 ? filteredGroups[0] : null)
    }
  }, [filteredGroups, selectedGroup])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading option groups...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleCreateGroup}
          className="flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create New Option Group
        </button>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by option group name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Option Groups */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">OPTION GROUPS</h2>
            <button className="rounded p-1 hover:bg-gray-100">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-1">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">
                  {searchTerm ? 'No option groups match your search.' : 'No option groups created yet.'}
                </p>
              </div>
            ) : (
              filteredGroups.map((group, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors group ${
                    selectedGroup === group ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    onClick={() => setSelectedGroup(group)}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-900">{group.name}</span>
                    <span className="text-sm text-gray-500">{group.options.length}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditGroup(group)
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit group"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteGroup(group)
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Delete group"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Options */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">OPTIONS</h2>
            <div className="flex items-center gap-2">
              {selectedGroup && (
                <button
                  onClick={() => {
                    const groupIndex = optionGroups.indexOf(selectedGroup)
                    if (groupIndex !== -1) {
                      handleAddOption(groupIndex)
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                >
                  <Plus className="h-4 w-4" />
                  Add new option
                </button>
              )}
              <button className="rounded p-1 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Connected Menu Items Info */}
          {selectedGroup && selectedGroup.connectedMenuItems && selectedGroup.connectedMenuItems.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Connected to Menu Items:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedGroup.connectedMenuItems.map((menuItemId) => {
                  const menuItem = menuItems.find(item => item.id === menuItemId)
                  return menuItem ? (
                    <span key={menuItemId} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {menuItem.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {!selectedGroup ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Select an option group to view its options</p>
              </div>
            ) : selectedGroup.options.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No options in this group</p>
                <button
                  onClick={() => {
                    const groupIndex = optionGroups.indexOf(selectedGroup)
                    if (groupIndex !== -1) {
                      handleAddOption(groupIndex)
                    }
                  }}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  Add first option
                </button>
              </div>
            ) : (
              selectedGroup.options.map((option, optionIndex) => {
                const groupIndex = optionGroups.indexOf(selectedGroup)
                const isEditing = editingOption?.groupIndex === groupIndex && editingOption?.optionIndex === optionIndex

                return (
                  <div key={optionIndex} className="rounded-lg border p-4 bg-white hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Option Name</label>
                              <input
                                type="text"
                                defaultValue={option.name}
                                onBlur={(e) => {
                                  handleUpdateOption(groupIndex, optionIndex, { name: e.target.value })
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateOption(groupIndex, optionIndex, { name: (e.target as HTMLInputElement).value })
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Additional Price (VND)</label>
                              <input
                                type="number"
                                defaultValue={option.price}
                                onBlur={(e) => {
                                  handleUpdateOption(groupIndex, optionIndex, { price: parseInt(e.target.value) || 0 })
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleUpdateOption(groupIndex, optionIndex, { price: parseInt((e.target as HTMLInputElement).value) || 0 })
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">Recipe</label>
                              <button
                                type="button"
                                onClick={() => setEditingOption(null)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                              >
                                <Calculator className="h-4 w-4" />
                                Use the Edit button for full recipe editing
                              </button>
                              {option.recipe && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="flex items-center gap-2 text-green-800 text-xs">
                                    <Calculator className="h-3 w-3" />
                                    <span>Recipe with {option.recipe.ingredients.length} ingredients</span>
                                    <span>•</span>
                                    <span>Cost: {formatPrice(option.price)}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => setEditingOption(null)}
                                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-medium text-gray-900">{option.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">
                                {option.price > 0 ? formatPrice(option.price) : 'Free'}
                              </p>
                              {option.recipe && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                                  <Calculator className="h-3 w-3 mr-1" />
                                  Recipe
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!isEditing && (
                          <>
                            <button
                              onClick={() => handleEditOptionComprehensive(groupIndex, optionIndex)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                              title="Edit option"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOption(groupIndex, optionIndex)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              title="Delete option"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <div className="text-sm text-gray-500">
                          In stock
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <EnhancedOptionGroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingGroup(null)
        }}
        onSave={handleSaveGroup}
        optionGroup={editingGroup}
      />

      {/* Comprehensive Option Editor Modal */}
      {showOptionEditor && editingOptionData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Option & Recipe
              </h2>
              <button
                onClick={handleCancelOptionEditing}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                {/* Option Details Section */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Option Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingOptionData.name}
                        onChange={(e) => setEditingOptionData(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter option name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Price (VND)
                      </label>
                      <input
                        type="number"
                        value={editingOptionData.price}
                        onChange={(e) => setEditingOptionData(prev => prev ? { ...prev, price: parseInt(e.target.value) || 0 } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    The price will be automatically calculated based on recipe ingredients if a recipe is provided.
                  </p>
                </div>

                {/* Recipe Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recipe</h3>
                  {editingOptionData.recipe && (
                    <RecipeEditor
                      recipe={editingOptionData.recipe}
                      onSave={(updatedRecipe) => {
                        setEditingOptionData(prev => prev ? { ...prev, recipe: updatedRecipe } : null)
                      }}
                      onCancel={() => {}}
                      hideButtons={true}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 bg-gray-50 rounded-b-lg flex-shrink-0">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelOptionEditing}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOptionComprehensive}
                  disabled={!editingOptionData?.name.trim()}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}