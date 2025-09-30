"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmployeesList } from "@/components/employees-list"
import { EditEmployeeModal } from "@/components/edit-employee-modal"
import { AddEmployeeModal } from "@/components/add-employee-modal"

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showAddEmployee, setShowAddEmployee] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-2 text-gray-600">
            Manage your store employees and their access permissions
          </p>
        </div>

        <EmployeesList
          onSelectEmployee={setSelectedEmployee}
          onAddEmployee={() => setShowAddEmployee(true)}
        />

        {selectedEmployee && (
          <EditEmployeeModal
            employee={selectedEmployee}
            isOpen={!!selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}

        {showAddEmployee && (
          <AddEmployeeModal
            isOpen={showAddEmployee}
            onClose={() => setShowAddEmployee(false)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}