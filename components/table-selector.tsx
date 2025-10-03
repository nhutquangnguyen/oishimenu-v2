"use client"

import { useState, useEffect } from "react"
import { Grid3X3, Users, MapPin, CheckCircle, AlertCircle, Clock, AlertTriangle, X } from "lucide-react"
import { getAvailableTables } from "@/lib/services/table"
import type { Table, TableStatus } from "@/lib/types/table"

interface TableSelectorProps {
  selectedTableId?: string
  onTableSelect: (table: Table | null) => void
  className?: string
}

export function TableSelector({ selectedTableId, onTableSelect, className = "" }: TableSelectorProps) {
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadAvailableTables()
  }, [])

  async function loadAvailableTables() {
    try {
      setLoading(true)
      const tables = await getAvailableTables()
      setAvailableTables(tables)
    } catch (error) {
      console.error('Error loading available tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedTable = availableTables.find(t => t.id === selectedTableId)

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'OCCUPIED':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'RESERVED':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'CLEANING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'OUT_OF_ORDER':
        return <X className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'border-green-200 bg-green-50 hover:bg-green-100'
      case 'OCCUPIED':
        return 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
      case 'RESERVED':
        return 'border-blue-200 bg-blue-50 cursor-not-allowed opacity-60'
      case 'CLEANING':
        return 'border-yellow-200 bg-yellow-50 cursor-not-allowed opacity-60'
      case 'OUT_OF_ORDER':
        return 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Select Table
        </label>
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-left"
        >
          <div className="flex items-center gap-3">
            <Grid3X3 className="h-5 w-5 text-gray-400" />
            {selectedTable ? (
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedTable.name}</span>
                {getStatusIcon(selectedTable.status)}
                <span className="text-sm text-gray-500">
                  ({selectedTable.seats} seats)
                </span>
              </div>
            ) : (
              <span className="text-gray-500">Choose a table</span>
            )}
          </div>
          <div className="text-gray-400">
            {availableTables.length} available
          </div>
        </button>
      </div>

      {/* Table Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[80vh] rounded-lg bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Table</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-600">Loading tables...</div>
              </div>
            ) : (
              <>
                {/* Clear Selection */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      onTableSelect(null)
                      setShowModal(false)
                    }}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    No table (takeaway/delivery)
                  </button>
                </div>

                {/* Available Tables */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Available Tables ({availableTables.filter(t => t.status === 'AVAILABLE').length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableTables.filter(t => t.status === 'AVAILABLE').map((table) => (
                      <button
                        key={table.id}
                        onClick={() => {
                          onTableSelect(table)
                          setShowModal(false)
                        }}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          selectedTableId === table.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : getStatusColor(table.status)
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{table.name}</span>
                            {getStatusIcon(table.status)}
                          </div>
                          {selectedTableId === table.id && (
                            <CheckCircle className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{table.seats} seats</span>
                          </div>
                          {table.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{table.location}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unavailable Tables (for reference) */}
                {availableTables.filter(t => t.status !== 'AVAILABLE').length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Unavailable Tables ({availableTables.filter(t => t.status !== 'AVAILABLE').length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableTables.filter(t => t.status !== 'AVAILABLE').map((table) => (
                        <div
                          key={table.id}
                          className={`p-4 border-2 rounded-lg ${getStatusColor(table.status)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{table.name}</span>
                              {getStatusIcon(table.status)}
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                              {table.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{table.seats} seats</span>
                            </div>
                            {table.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{table.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {availableTables.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tables available. Please create tables in the Tables section.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}