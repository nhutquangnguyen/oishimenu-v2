"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Loader2, Users, Mail, Phone, UserCheck, UserX } from "lucide-react"
import { getEmployees, updateEmployeeStatus } from "@/lib/services/employee"
import type { Employee } from "@/lib/types/employee"

interface EmployeesListProps {
  onSelectEmployee: (employee: Employee) => void
  onAddEmployee: () => void
}

export function EmployeesList({ onSelectEmployee, onAddEmployee }: EmployeesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  async function loadEmployees() {
    try {
      setLoading(true)
      setError(null)
      const employeesData = await getEmployees()
      setEmployees(employeesData)
    } catch (err) {
      console.error('Error loading employees:', err)
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusToggle(employeeId: string, currentStatus: string) {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      const success = await updateEmployeeStatus(employeeId, newStatus)
      if (success) {
        await loadEmployees() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating employee status:', error)
    }
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount).replace('₫', '₫')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading employees...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading employees</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadEmployees}
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
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {employees.filter(emp => emp.status === 'ACTIVE').length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {employees.filter(emp => emp.status === 'INACTIVE').length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(employees.reduce((sum, emp) => sum + (emp.salary || 0), 0))}
              </p>
            </div>
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No employees found</p>
            {searchTerm && (
              <p className="text-sm">Try adjusting your search</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {employee.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                      <div className="text-sm text-gray-500">
                        Role: {employee.role || 'staff'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {employee.salary ? formatCurrency(employee.salary) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {employee.startDate?.toLocaleDateString('vi-VN') || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          employee.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectEmployee(employee)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleStatusToggle(employee.id, employee.status)}
                          className={`${
                            employee.status === 'ACTIVE'
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {employee.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}