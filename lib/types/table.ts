export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'OUT_OF_ORDER'

export interface Table {
  id: string
  name: string
  seats: number
  status: TableStatus
  location?: string
  description?: string
  currentOrderId?: string
  reservedBy?: string
  reservedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TableFilter {
  status?: TableStatus[]
  seats?: number
  location?: string
  limit?: number
}

export interface CreateTableData {
  name: string
  seats: number
  location?: string
  description?: string
}

export interface UpdateTableData {
  name?: string
  seats?: number
  status?: TableStatus
  location?: string
  description?: string
  currentOrderId?: string
  reservedBy?: string
  reservedAt?: Date
}