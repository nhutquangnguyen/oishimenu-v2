import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Employee, EmployeeFilter } from '@/lib/types/employee'

/**
 * Fetch all employees with optional filtering
 */
export async function getEmployees(filter?: EmployeeFilter): Promise<Employee[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning mock employees')
      return getMockEmployees()
    }

    let employeesQuery = collection(db, 'employees')
    let queryConstraints: any[] = []

    // Apply filters
    if (filter?.status) {
      queryConstraints.push(where('status', '==', filter.status))
    }

    if (filter?.role) {
      queryConstraints.push(where('role', '==', filter.role))
    }

    if (filter?.position) {
      queryConstraints.push(where('position', '==', filter.position))
    }

    // Apply sorting
    if (filter?.sortBy === 'name') {
      queryConstraints.push(orderBy('name', filter.sortOrder || 'asc'))
    } else if (filter?.sortBy === 'startDate') {
      queryConstraints.push(orderBy('startDate', filter.sortOrder || 'desc'))
    } else {
      queryConstraints.push(orderBy('name', 'asc'))
    }

    const finalQuery = queryConstraints.length > 0
      ? query(employeesQuery, ...queryConstraints)
      : employeesQuery

    const snapshot = await getDocs(finalQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate?.toDate?.() || undefined,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Employee))
  } catch (error) {
    console.error('Error fetching employees:', error)
    return getMockEmployees()
  }
}

/**
 * Get a single employee by ID
 */
export async function getEmployee(id: string): Promise<Employee | null> {
  try {
    if (!db) {
      console.warn('Firestore not available')
      return null
    }

    const docRef = doc(db, 'employees', id)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        startDate: snapshot.data().startDate?.toDate?.() || undefined,
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(),
      } as Employee
    }

    return null
  } catch (error) {
    console.error('Error fetching employee:', error)
    return null
  }
}

/**
 * Add a new employee
 */
export async function addEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const employeeData = {
      ...employee,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await addDoc(collection(db, 'employees'), employeeData)
    return docRef.id
  } catch (error) {
    console.error('Error adding employee:', error)
    return null
  }
}

/**
 * Update an employee
 */
export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'employees', id)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    })

    return true
  } catch (error) {
    console.error('Error updating employee:', error)
    return false
  }
}

/**
 * Update employee status
 */
export async function updateEmployeeStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'employees', id)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    })

    return true
  } catch (error) {
    console.error('Error updating employee status:', error)
    return false
  }
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available')
    }

    const docRef = doc(db, 'employees', id)
    await deleteDoc(docRef)

    return true
  } catch (error) {
    console.error('Error deleting employee:', error)
    return false
  }
}

/**
 * Get employees by role
 */
export async function getEmployeesByRole(role: string): Promise<Employee[]> {
  return getEmployees({ role: role as any })
}

/**
 * Get active employees
 */
export async function getActiveEmployees(): Promise<Employee[]> {
  return getEmployees({ status: 'ACTIVE' })
}

/**
 * Get employee statistics
 */
export async function getEmployeeStats(): Promise<{
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  totalPayroll: number
  averageSalary: number
  roleDistribution: { [role: string]: number }
}> {
  try {
    const employees = await getEmployees()

    const totalEmployees = employees.length
    const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE').length
    const inactiveEmployees = employees.filter(emp => emp.status === 'INACTIVE').length

    const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)
    const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0

    const roleDistribution: { [role: string]: number } = {}
    employees.forEach(emp => {
      const role = emp.role || 'staff'
      roleDistribution[role] = (roleDistribution[role] || 0) + 1
    })

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalPayroll,
      averageSalary,
      roleDistribution
    }
  } catch (error) {
    console.error('Error calculating employee stats:', error)
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      inactiveEmployees: 0,
      totalPayroll: 0,
      averageSalary: 0,
      roleDistribution: {}
    }
  }
}

/**
 * Mock data for development
 */
function getMockEmployees(): Employee[] {
  return [
    {
      id: 'employee-1',
      name: 'Nguyễn Thị Lan',
      phone: '0933123456',
      email: 'lan.nguyen@dinhbarista.com',
      position: 'Barista',
      role: 'staff',
      salary: 8500000,
      startDate: new Date('2024-06-01'),
      status: 'ACTIVE',
      shift: 'morning',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'employee-2',
      name: 'Trần Văn Minh',
      phone: '0944234567',
      email: 'minh.tran@dinhbarista.com',
      position: 'Shift Supervisor',
      role: 'manager',
      salary: 12000000,
      startDate: new Date('2024-05-15'),
      status: 'ACTIVE',
      shift: 'afternoon',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'employee-3',
      name: 'Lê Thị Hoa',
      phone: '0955345678',
      email: 'hoa.le@dinhbarista.com',
      position: 'Cashier',
      role: 'staff',
      salary: 7800000,
      startDate: new Date('2024-07-01'),
      status: 'ACTIVE',
      shift: 'evening',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}