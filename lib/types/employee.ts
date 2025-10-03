export interface Employee {
  id: string
  name: string
  phone: string
  email: string
  position: string
  role?: 'admin' | 'manager' | 'staff'
  salary?: number
  startDate?: Date
  status: 'ACTIVE' | 'INACTIVE'
  shift?: string
  createdAt: Date
  updatedAt: Date
}

export interface EmployeeFilter {
  status?: 'ACTIVE' | 'INACTIVE'
  role?: 'admin' | 'manager' | 'staff'
  position?: string
  sortBy?: 'name' | 'startDate'
  sortOrder?: 'asc' | 'desc'
  limit?: number
}