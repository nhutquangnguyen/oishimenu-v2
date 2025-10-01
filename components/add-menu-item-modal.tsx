"use client"

import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MenuItem, OptionGroup, MenuOption } from "@/lib/types/menu"

interface AddMenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  categories: string[]
}

export function AddMenuItemModal({ isOpen, onClose, onSuccess, categories }: AddMenuItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryName: "",
    description: "",
    availableStatus: "AVAILABLE" as const,
    photos: [""],
    optionGroups: [] as Array<{
      name: string
      minSelection: number
      maxSelection: number
      options: Array<{ name: string, price: number }>
    }>
  })

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      categoryName: "",
      description: "",
      availableStatus: "AVAILABLE",
      photos: [""],
      optionGroups: []
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.categoryName) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add-item',
          data: {
            id: `item-${Date.now()}`, // Simple ID generation
            name: formData.name,
            price: parseInt(formData.price),
            categoryName: formData.categoryName,
            description: formData.description,
            availableStatus: formData.availableStatus,
            photos: formData.photos.filter(photo => photo.trim() !== ""),
            optionGroups: formData.optionGroups.map(group => ({
              name: group.name,
              minSelection: group.minSelection,
              maxSelection: group.maxSelection,
              options: group.options.filter(option => option.name.trim() !== "")
            })).filter(group => group.name.trim() !== ""),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || 'Failed to add menu item')
      }

      const result = await response.json()
      console.log('Menu item added successfully:', result)

      resetForm()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding menu item:', error)
      alert(`Failed to add menu item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const addOptionGroup = () => {
    setFormData(prev => ({
      ...prev,
      optionGroups: [...prev.optionGroups, {
        name: "",
        minSelection: 1,
        maxSelection: 1,
        options: [{ name: "", price: 0 }]
      }]
    }))
  }

  const updateOptionGroup = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === index ? { ...group, [field]: value } : group
      )
    }))
  }

  const removeOptionGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.filter((_, i) => i !== index)
    }))
  }

  const addOption = (groupIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, options: [...group.options, { name: "", price: 0 }] }
          : group
      )
    }))
  }

  const updateOption = (groupIndex: number, optionIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              options: group.options.map((option, j) =>
                j === optionIndex ? { ...option, [field]: value } : option
              )
            }
          : group
      )
    }))
  }

  const removeOption = (groupIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      optionGroups: prev.optionGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, options: group.options.filter((_, j) => j !== optionIndex) }
          : group
      )
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price (VND) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="25000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryName}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Enter custom category</SelectItem>
                </SelectContent>
              </Select>
              {formData.categoryName === 'custom' && (
                <Input
                  className="mt-2"
                  placeholder="Enter category name"
                  value={formData.categoryName === 'custom' ? '' : formData.categoryName}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                />
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.availableStatus}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, availableStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="UNAVAILABLE_TODAY">Unavailable Today</SelectItem>
                  <SelectItem value="UNAVAILABLE_PERMANENTLY">Unavailable Permanently</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              value={formData.photos[0]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                photos: [e.target.value, ...prev.photos.slice(1)]
              }))}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Option Groups */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Option Groups</Label>
              <Button type="button" onClick={addOptionGroup} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Option Group
              </Button>
            </div>

            {formData.optionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Option Group {groupIndex + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeOptionGroup(groupIndex)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label>Group Name</Label>
                    <Input
                      value={group.name}
                      onChange={(e) => updateOptionGroup(groupIndex, 'name', e.target.value)}
                      placeholder="Size, Topping, etc."
                    />
                  </div>
                  <div>
                    <Label>Min Selection</Label>
                    <Input
                      type="number"
                      value={group.minSelection}
                      onChange={(e) => updateOptionGroup(groupIndex, 'minSelection', parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Max Selection</Label>
                    <Input
                      type="number"
                      value={group.maxSelection}
                      onChange={(e) => updateOptionGroup(groupIndex, 'maxSelection', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Options</Label>
                    <Button
                      type="button"
                      onClick={() => addOption(groupIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  {group.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2 items-center">
                      <Input
                        value={option.name}
                        onChange={(e) => updateOption(groupIndex, optionIndex, 'name', e.target.value)}
                        placeholder="Option name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={option.price}
                        onChange={(e) => updateOption(groupIndex, optionIndex, 'price', parseInt(e.target.value) || 0)}
                        placeholder="Price"
                        className="w-24"
                      />
                      <Button
                        type="button"
                        onClick={() => removeOption(groupIndex, optionIndex)}
                        variant="ghost"
                        size="sm"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Menu Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}