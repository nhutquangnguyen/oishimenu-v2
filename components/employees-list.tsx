"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"

interface Employee {
  id: string
  username: string
  storeName: string
  role: string
  status: "Active" | "Inactive"
}

interface EmployeesListProps {
  onSelectEmployee: (employee: Employee) => void
  onAddEmployee: () => void
}

const employees: Employee[] = [
  {
    id: "1",
    username: "john.doe",
    storeName: "Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng",
    role: "Store Manager",
    status: "Active"
  },
  {
    id: "2",
    username: "jane.smith",
    storeName: "Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng",
    role: "Cashier",
    status: "Active"
  },
  {
    id: "3",
    username: "mike.wilson",
    storeName: "Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng",
    role: "Barista",
    status: "Inactive"
  },
  {
    id: "4",
    username: "sarah.johnson",
    storeName: "Dinh Barista - Coffee & Tea - 305C Phạm Văn Đồng",
    role: "Shift Supervisor",
    status: "Active"
  }
]

export function EmployeesList({ onSelectEmployee, onAddEmployee }: EmployeesListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(employee =>
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={onAddEmployee}
          className="flex items-center gap-2 rounded-lg bg-grab-green px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Store Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => onSelectEmployee(employee)}
                  className="border-b cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.storeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}