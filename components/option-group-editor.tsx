"use client"

import { useState } from "react"
import { Plus, X, Edit3, Trash2, Save, Move, GripVertical, Package } from "lucide-react"
import type { OptionGroup, MenuOption } from "@/lib/types/menu"

interface OptionGroupEditorProps {
  optionGroups: OptionGroup[]
  onUpdate: (optionGroups: OptionGroup[]) => void
  disabled?: boolean
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function OptionGroupEditor({ optionGroups, onUpdate, disabled = false }: OptionGroupEditorProps) {
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null)
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null)
  const [newGroup, setNewGroup] = useState<Partial<OptionGroup>>({
    name: "",
    minSelection: 0,
    maxSelection: 1,
    options: []
  })
  const [showNewGroupForm, setShowNewGroupForm] = useState(false)
  const [newOption, setNewOption] = useState<Partial<MenuOption>>({
    name: "",
    price: 0
  })

  const handleAddGroup = () => {
    if (!newGroup.name?.trim()) return

    const group: OptionGroup = {
      name: newGroup.name.trim(),
      minSelection: newGroup.minSelection || 0,
      maxSelection: newGroup.maxSelection || 1,
      options: []
    }

    const updatedGroups = [...optionGroups, group]
    onUpdate(updatedGroups)

    setNewGroup({ name: "", minSelection: 0, maxSelection: 1, options: [] })
    setShowNewGroupForm(false)
  }

  const handleUpdateGroup = (groupIndex: number, updates: Partial<OptionGroup>) => {
    const updatedGroups = optionGroups.map((group, index) =>
      index === groupIndex ? { ...group, ...updates } : group
    )
    onUpdate(updatedGroups)
    setEditingGroupIndex(null)
  }

  const handleDeleteGroup = (groupIndex: number) => {
    if (confirm("Are you sure you want to delete this option group?")) {
      const updatedGroups = optionGroups.filter((_, index) => index !== groupIndex)
      onUpdate(updatedGroups)
    }
  }

  const handleAddOption = (groupIndex: number) => {
    if (!newOption.name?.trim()) return

    const option: MenuOption = {
      name: newOption.name.trim(),
      price: newOption.price || 0
    }

    const updatedGroups = optionGroups.map((group, index) =>
      index === groupIndex
        ? { ...group, options: [...group.options, option] }
        : group
    )

    onUpdate(updatedGroups)
    setNewOption({ name: "", price: 0 })
  }

  const handleUpdateOption = (groupIndex: number, optionIndex: number, updates: Partial<MenuOption>) => {
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
    onUpdate(updatedGroups)
    setEditingOptionIndex(null)
  }

  const handleDeleteOption = (groupIndex: number, optionIndex: number) => {
    if (confirm("Are you sure you want to delete this option?")) {
      const updatedGroups = optionGroups.map((group, gIndex) =>
        gIndex === groupIndex
          ? { ...group, options: group.options.filter((_, oIndex) => oIndex !== optionIndex) }
          : group
      )
      onUpdate(updatedGroups)
    }
  }

  const moveGroup = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= optionGroups.length) return

    const updatedGroups = [...optionGroups]
    const [movedGroup] = updatedGroups.splice(fromIndex, 1)
    updatedGroups.splice(toIndex, 0, movedGroup)
    onUpdate(updatedGroups)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Option Groups</h3>
        {!disabled && (
          <button
            onClick={() => setShowNewGroupForm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
          >
            <Plus className="h-4 w-4" />
            Add Group
          </button>
        )}
      </div>

      {/* New Group Form */}
      {showNewGroupForm && !disabled && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <h4 className="font-medium text-blue-900 mb-3">New Option Group</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                type="text"
                value={newGroup.name || ""}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                placeholder="e.g., Size, Toppings"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Selection</label>
              <input
                type="number"
                value={newGroup.minSelection || 0}
                onChange={(e) => setNewGroup({ ...newGroup, minSelection: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Selection</label>
              <input
                type="number"
                value={newGroup.maxSelection || 1}
                onChange={(e) => setNewGroup({ ...newGroup, maxSelection: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddGroup}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Add Group
            </button>
            <button
              onClick={() => {
                setShowNewGroupForm(false)
                setNewGroup({ name: "", minSelection: 0, maxSelection: 1, options: [] })
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Option Groups List */}
      <div className="space-y-4">
        {optionGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No option groups defined</p>
            <p className="text-sm">Add option groups to allow customers to customize this item</p>
          </div>
        ) : (
          optionGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border rounded-lg bg-gray-50">
              {/* Group Header */}
              <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  {!disabled && (
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveGroup(groupIndex, groupIndex - 1)}
                        disabled={groupIndex === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move up"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {editingGroupIndex === groupIndex ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={group.name}
                        onBlur={(e) => handleUpdateGroup(groupIndex, { name: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateGroup(groupIndex, { name: (e.target as HTMLInputElement).value })
                          }
                        }}
                        className="text-lg font-medium border border-purple-300 rounded px-2 py-1"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{group.name}</h4>
                      <p className="text-sm text-gray-600">
                        {group.minSelection}-{group.maxSelection} selections
                        {group.minSelection === 0 ? " (optional)" : " (required)"}
                      </p>
                    </div>
                  )}
                </div>

                {!disabled && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingGroupIndex(editingGroupIndex === groupIndex ? null : groupIndex)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit group"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(groupIndex)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                      title="Delete group"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Group Settings (when editing) */}
              {editingGroupIndex === groupIndex && !disabled && (
                <div className="p-4 bg-yellow-50 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Selection</label>
                      <input
                        type="number"
                        defaultValue={group.minSelection}
                        onBlur={(e) => handleUpdateGroup(groupIndex, { minSelection: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Selection</label>
                      <input
                        type="number"
                        defaultValue={group.maxSelection}
                        onBlur={(e) => handleUpdateGroup(groupIndex, { maxSelection: parseInt(e.target.value) || 1 })}
                        min="1"
                        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="p-4">
                <div className="space-y-2">
                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center justify-between bg-white rounded border p-3">
                      <div className="flex-1">
                        {editingOptionIndex === optionIndex ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              defaultValue={option.name}
                              onBlur={(e) => handleUpdateOption(groupIndex, optionIndex, { name: e.target.value })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateOption(groupIndex, optionIndex, { name: (e.target as HTMLInputElement).value })
                                }
                              }}
                              className="border border-purple-300 rounded px-2 py-1"
                              autoFocus
                            />
                            <input
                              type="number"
                              defaultValue={option.price}
                              onBlur={(e) => handleUpdateOption(groupIndex, optionIndex, { price: parseInt(e.target.value) || 0 })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateOption(groupIndex, optionIndex, { price: parseInt((e.target as HTMLInputElement).value) || 0 })
                                }
                              }}
                              className="border border-purple-300 rounded px-2 py-1"
                              min="0"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900">{option.name}</span>
                            <span className="font-medium text-gray-700">
                              {option.price > 0 ? `+${formatPrice(option.price)}` : 'Free'}
                            </span>
                          </div>
                        )}
                      </div>

                      {!disabled && (
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => setEditingOptionIndex(editingOptionIndex === optionIndex ? null : optionIndex)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Edit option"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteOption(groupIndex, optionIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete option"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add New Option Form */}
                  {!disabled && (
                    <div className="border-2 border-dashed border-gray-300 rounded p-3 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Option Name</label>
                          <input
                            type="text"
                            value={newOption.name || ""}
                            onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                            placeholder="e.g., Large, Extra Sauce"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Price (VND)</label>
                          <input
                            type="number"
                            value={newOption.price || 0}
                            onChange={(e) => setNewOption({ ...newOption, price: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            min="0"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => handleAddOption(groupIndex)}
                            disabled={!newOption.name?.trim()}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                            Add Option
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {group.options.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No options added yet</p>
                    <p className="text-xs">Add options that customers can choose from</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}