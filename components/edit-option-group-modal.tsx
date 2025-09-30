"use client"

import { useState } from "react"
import { X, Plus, Trash2, ShoppingBag } from "lucide-react"

interface OptionGroup {
  id: string
  name: string
  optionCount: number
}

interface OptionItem {
  id: string
  name: string
  price: string
}

interface EditOptionGroupModalProps {
  group: OptionGroup
  isOpen: boolean
  onClose: () => void
}

export function EditOptionGroupModal({ group, isOpen, onClose }: EditOptionGroupModalProps) {
  const [formData, setFormData] = useState({
    name: "Chọn Matcha",
    selectionRules: "exactly-1",
    optional: false
  })

  const [options, setOptions] = useState<OptionItem[]>([
    { id: "1", name: "Matcha cookie", price: "10000" },
    { id: "2", name: "Matcha sữa dừa", price: "10000" },
    { id: "3", name: "Matcha đá xay", price: "3000" },
    { id: "4", name: "Matcha Latte sữa yến mạch", price: "0" },
    { id: "5", name: "Matcha Latte", price: "0" }
  ])

  if (!isOpen) return null

  const addNewOption = () => {
    const newOption: OptionItem = {
      id: Date.now().toString(),
      name: "",
      price: "0"
    }
    setOptions([...options, newOption])
  }

  const updateOption = (id: string, field: keyof OptionItem, value: string) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    ))
  }

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">EDIT OPTION GROUP</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OPTION GROUP NAME *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-sm text-gray-600">
              Option group name is translated to 4 languages.
            </p>
            <button className="text-sm text-blue-600 hover:underline">
              Edit translations
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">OPTIONS</h3>
              <button
                onClick={addNewOption}
                className="text-sm text-blue-600 hover:underline"
              >
                Add new option
              </button>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={option.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">=</span>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        OPTION NAME *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateOption(option.id, "name", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        {index < 4 && (
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Option name is translated to 4 languages.
                      </p>
                      <button className="text-xs text-blue-600 hover:underline">
                        Edit translations
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ADDITIONAL PRICE
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">₫</span>
                      <input
                        type="number"
                        value={option.price}
                        onChange={(e) => updateOption(option.id, "price", e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <button className="mt-1 text-xs text-blue-600 hover:underline">
                      Set custom prices
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">SELECTION RULES</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-sm">Your customer must select</span>
              </label>
              <div className="ml-7 flex items-center gap-2">
                <span className="text-sm">Exactly</span>
                <input
                  type="number"
                  value="1"
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <label className="ml-7 flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                Optional for your customer to select
              </label>
              <label className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                <span className="text-sm text-blue-600">Your customer can only choose 1 option(s) when ordering.</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">LINKED ITEMS</h3>
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="mb-4 rounded-full bg-orange-100 p-4">
                <ShoppingBag className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-sm text-center mb-2">
                Link the items on your menu for customers to customise using this option group.
              </p>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Link Items
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t p-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            Delete Option Group
          </button>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="rounded-lg bg-grab-green px-6 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}