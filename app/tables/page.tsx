"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Search, Edit, Trash2, Users, MapPin, MoreVertical, AlertCircle, CheckCircle, Clock, AlertTriangle, X } from "lucide-react"
import { getTables, createTable, updateTable, deleteTable, updateTableStatus, getTableStats } from "@/lib/services/table"
import type { Table, TableStatus, CreateTableData, UpdateTableData } from "@/lib/types/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TablesPage() {
  const { t } = useTranslation()
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadTables()
    loadStats()
  }, [])

  async function loadTables() {
    try {
      setLoading(true)
      const fetchedTables = await getTables({ limit: 100 })
      setTables(fetchedTables)
    } catch (error) {
      console.error('Error loading tables:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const tableStats = await getTableStats()
      setStats(tableStats)
    } catch (error) {
      console.error('Error loading table stats:', error)
    }
  }

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || table.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'RESERVED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CLEANING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'OUT_OF_ORDER':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="h-4 w-4" />
      case 'OCCUPIED':
        return <AlertCircle className="h-4 w-4" />
      case 'RESERVED':
        return <Clock className="h-4 w-4" />
      case 'CLEANING':
        return <AlertTriangle className="h-4 w-4" />
      case 'OUT_OF_ORDER':
        return <X className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleStatusChange = async (tableId: string, newStatus: TableStatus) => {
    try {
      const success = await updateTableStatus(tableId, newStatus)
      if (success) {
        loadTables()
        loadStats()
      }
    } catch (error) {
      console.error('Error updating table status:', error)
    }
  }

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return

    try {
      const success = await deleteTable(tableId)
      if (success) {
        loadTables()
        loadStats()
      }
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('tables.title')}</h1>
            <p className="text-gray-600">{t('tables.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
          >
            <Plus className="h-4 w-4" />
            {t('tables.addTable')}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('tables.totalTables')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('tables.available')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.available}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('tables.occupied')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.occupied}</dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    %
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{t('tables.occupancyRate')}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.occupancyRate.toFixed(1)}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('tables.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('tables.allStatus')}</SelectItem>
              <SelectItem value="AVAILABLE">{t('tables.available')}</SelectItem>
              <SelectItem value="OCCUPIED">{t('tables.occupied')}</SelectItem>
              <SelectItem value="RESERVED">{t('tables.reserved')}</SelectItem>
              <SelectItem value="CLEANING">{t('tables.cleaning')}</SelectItem>
              <SelectItem value="OUT_OF_ORDER">{t('tables.outOfOrder')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tables Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading tables...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onStatusChange={handleStatusChange}
                onEdit={() => {
                  setSelectedTable(table)
                  setShowEditModal(true)
                }}
                onDelete={() => handleDeleteTable(table.id)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        )}

        {/* Create Table Modal */}
        {showCreateModal && (
          <CreateTableModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              loadTables()
              loadStats()
              setShowCreateModal(false)
            }}
          />
        )}

        {/* Edit Table Modal */}
        {showEditModal && selectedTable && (
          <EditTableModal
            table={selectedTable}
            onClose={() => {
              setShowEditModal(false)
              setSelectedTable(null)
            }}
            onSuccess={() => {
              loadTables()
              loadStats()
              setShowEditModal(false)
              setSelectedTable(null)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

// Table Card Component
function TableCard({ table, onStatusChange, onEdit, onDelete, getStatusColor, getStatusIcon }: {
  table: Table
  onStatusChange: (id: string, status: TableStatus) => void
  onEdit: () => void
  onDelete: () => void
  getStatusColor: (status: TableStatus) => string
  getStatusIcon: (status: TableStatus) => React.ReactNode
}) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="relative rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{table.name}</h3>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-md border bg-white py-1 shadow-lg">
              <button
                onClick={() => {
                  onEdit()
                  setShowDropdown(false)
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="mr-3 h-4 w-4" />
{t('tables.editTable')}
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowDropdown(false)
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="mr-3 h-4 w-4" />
{t('tables.deleteTable')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium mb-3 ${getStatusColor(table.status)}`}>
        {getStatusIcon(table.status)}
        {table.status.replace('_', ' ')}
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{table.seats} seats</span>
        </div>
        {table.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{table.location}</span>
          </div>
        )}
      </div>

      {/* Status Change */}
      <div className="mt-4">
        <Select
          value={table.status}
          onValueChange={(value: TableStatus) => onStatusChange(table.id, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">{t('tables.available')}</SelectItem>
            <SelectItem value="OCCUPIED">{t('tables.occupied')}</SelectItem>
            <SelectItem value="RESERVED">{t('tables.reserved')}</SelectItem>
            <SelectItem value="CLEANING">{t('tables.cleaning')}</SelectItem>
            <SelectItem value="OUT_OF_ORDER">{t('tables.outOfOrder')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Create Table Modal
function CreateTableModal({ onClose, onSuccess }: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<CreateTableData>({
    name: '',
    seats: 2,
    location: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setLoading(true)
      const success = await createTable({
        ...formData,
        location: formData.location || undefined,
        description: formData.description || undefined
      })
      if (success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating table:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('tables.addNewTable')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.tableName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={t('tables.tableNamePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.numberOfSeats')} *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.seats}
              onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 2 }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.location')}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={t('tables.locationPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={2}
              placeholder={t('tables.descriptionPlaceholder')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
{t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
            >
{loading ? t('common.creating') : t('common.createTable')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Table Modal
function EditTableModal({ table, onClose, onSuccess }: {
  table: Table
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<UpdateTableData>({
    name: table.name,
    seats: table.seats,
    location: table.location || '',
    description: table.description || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) return

    try {
      setLoading(true)
      const success = await updateTable(table.id, {
        ...formData,
        location: formData.location || undefined,
        description: formData.description || undefined
      })
      if (success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating table:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('tables.editTable')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.tableName')} *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={t('tables.tableNamePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.numberOfSeats')} *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.seats || 2}
              onChange={(e) => setFormData(prev => ({ ...prev, seats: parseInt(e.target.value) || 2 }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.location')}
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={t('tables.locationPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('tables.description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={2}
              placeholder={t('tables.descriptionPlaceholder')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
{t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name?.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
            >
{loading ? t('common.updating') : t('common.updateTable')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}