"use client"

import { useState } from "react"
import { X, User, Mail, Phone, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Employee {
  id: string
  username: string
  storeName: string
  role: string
  status: "Active" | "Inactive"
}

interface EditEmployeeModalProps {
  employee: Employee
  isOpen: boolean
  onClose: () => void
}

export function EditEmployeeModal({ employee, isOpen, onClose }: EditEmployeeModalProps) {
  const [selectedRole, setSelectedRole] = useState(employee.role)
  const [selectedStore, setSelectedStore] = useState(employee.storeName)
  const [status, setStatus] = useState(employee.status)

  if (!isOpen) return null

  const handleSave = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Employee Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Store Manager">Store Manager</SelectItem>
                  <SelectItem value="Shift Supervisor">Shift Supervisor</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Barista">Barista</SelectItem>
                  <SelectItem value="Kitchen Staff">Kitchen Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store
              </label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng">
                    Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng
                  </SelectItem>
                  <SelectItem value="Dinh Barista - Coffee & Tea - Central Location">
                    Dinh Barista - Coffee & Tea - Central Location
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Username</p>
                  <p className="text-sm text-gray-600">{employee.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{employee.username}@example.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+84 123 456 789</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">Ho Chi Minh City, Vietnam</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}