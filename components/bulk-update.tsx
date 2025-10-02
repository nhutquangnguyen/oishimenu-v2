"use client"

import { useState, useEffect } from "react"
import { Plus, Edit3, Download, Package, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { getMenuItems, getMenuCategories } from "@/lib/services/menu"
import type { MenuItem, MenuCategory } from "@/lib/types/menu"

interface BulkActivity {
  id: string
  fileName: string
  itemCount: number
  status: 'completed' | 'failed' | 'in_progress'
  date: Date
  userEmail: string
  downloadUrl?: string
}

export function BulkUpdate() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [activities, setActivities] = useState<BulkActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    loadMenuData()
    loadActivities()
  }, [])

  const loadMenuData = async () => {
    try {
      const [items, categories] = await Promise.all([
        getMenuItems(),
        getMenuCategories()
      ])
      setMenuItems(items)
      setMenuCategories(categories)
    } catch (error) {
      console.error('Error loading menu data:', error)
    }
  }

  const loadActivities = () => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem('bulkUpdateActivities')
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities)
      setActivities(parsed.map((activity: any) => ({
        ...activity,
        date: new Date(activity.date)
      })))
    }
  }

  const saveActivity = (activity: BulkActivity) => {
    const updatedActivities = [activity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem('bulkUpdateActivities', JSON.stringify(updatedActivities))
  }

  const downloadCurrentMenu = async () => {
    setLoading(true)
    try {
      // Create CSV content
      const csvHeaders = [
        '*ItemID',
        '*ItemName',
        '*Price',
        '*CategoryName',
        'AvailabilitySchedule',
        '*AvailableStatus',
        'Description',
        'Photo1',
        'Photo2',
        'Photo3',
        'Photo4',
        'OptionGroup1',
        'OptionGroup2',
        'OptionGroup3',
        'OptionGroup4',
        'OptionGroup5',
        'OptionGroup6'
      ]

      const csvRows = [
        csvHeaders.join(','),
        ...menuItems.map(item => [
          item.id,
          `"${item.name}"`,
          item.price,
          `"${item.categoryName}"`,
          item.availabilitySchedule || '',
          item.availableStatus,
          `"${item.description || ''}"`,
          item.photos[0] || '',
          item.photos[1] || '',
          item.photos[2] || '',
          item.photos[3] || '',
          item.optionGroups[0]?.name || '',
          item.optionGroups[1]?.name || '',
          item.optionGroups[2]?.name || '',
          item.optionGroups[3]?.name || '',
          item.optionGroups[4]?.name || '',
          item.optionGroups[5]?.name || ''
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `menu_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Save activity
      const activity: BulkActivity = {
        id: Date.now().toString(),
        fileName: `menu_export_${new Date().toISOString().split('T')[0]}.csv`,
        itemCount: menuItems.length,
        status: 'completed',
        date: new Date(),
        userEmail: 'current_user@example.com' // Would come from auth
      }
      saveActivity(activity)

    } catch (error) {
      console.error('Error downloading menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setUploadLoading(true)
    const activity: BulkActivity = {
      id: Date.now().toString(),
      fileName: file.name,
      itemCount: 0,
      status: 'in_progress',
      date: new Date(),
      userEmail: 'current_user@example.com'
    }
    saveActivity(activity)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim() !== '')

      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row.')
      }

      const headers = lines[0].split(',').map(h => h.trim())

      // Basic CSV validation
      if (!headers.includes('*ItemName') || !headers.includes('*Price')) {
        throw new Error('Invalid CSV format. Must include *ItemName and *Price columns.')
      }

      // Parse CSV data
      const csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const row: { [key: string]: string } = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })

      // Send to API for processing
      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process CSV')
      }

      // Update activity as completed
      const updatedActivity = {
        ...activity,
        status: 'completed' as const,
        itemCount: result.itemsProcessed || csvData.length
      }
      const updatedActivities = activities.map(a => a.id === activity.id ? updatedActivity : a)
      setActivities(updatedActivities)
      localStorage.setItem('bulkUpdateActivities', JSON.stringify(updatedActivities))

      // Refresh menu data
      await loadMenuData()

      let message = `Successfully processed ${result.itemsProcessed} items`
      if (result.categoriesCreated) {
        message += ` and created ${result.categoriesCreated} categories`
      }
      if (result.errors && result.errors.length > 0) {
        message += `\n\nWarnings:\n${result.errors.slice(0, 5).join('\n')}`
        if (result.errors.length > 5) {
          message += `\n... and ${result.errors.length - 5} more warnings`
        }
      }
      alert(message)

    } catch (error) {
      console.error('Error processing CSV:', error)

      // Update activity as failed
      const updatedActivity = { ...activity, status: 'failed' as const }
      const updatedActivities = activities.map(a => a.id === activity.id ? updatedActivity : a)
      setActivities(updatedActivities)
      localStorage.setItem('bulkUpdateActivities', JSON.stringify(updatedActivities))

      alert('Error processing CSV: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploadLoading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const triggerFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = handleBulkUpload
    input.click()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk update</h2>
        <p className="text-gray-600 mb-6">
          Bulk update helps you manage an extensive menu efficiently. Add or edit up to 20,000 items in one go.{" "}
          <button className="text-blue-600 hover:underline">
            Learn more about bulk update
          </button>
        </p>

        <div className="flex gap-4">
          <button
            onClick={triggerFileUpload}
            disabled={uploadLoading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-indigo-600 hover:to-purple-700 shadow-md disabled:opacity-50"
          >
            {uploadLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {uploadLoading ? 'Processing...' : 'Add items in bulk'}
          </button>

          <button
            onClick={downloadCurrentMenu}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            ) : (
              <Download className="h-4 w-4" />
            )}
            {loading ? 'Generating...' : 'Download current menu'}
          </button>

          <button
            onClick={() => {
              if (menuItems.length === 0) {
                alert('No menu items found. Please add some items first.')
                return
              }
              alert('To edit items in bulk:\n1. Click "Download current menu"\n2. Edit the CSV file\n3. Click "Add items in bulk" to upload the edited file\n\nThe system will update existing items based on ItemID.')
            }}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit3 className="h-4 w-4" />
            Edit items in bulk
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>

        <div className="rounded-lg border bg-white">
          <div className="border-b p-4">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600">
              <div>FILE NAME</div>
              <div>NO. OF ITEMS</div>
              <div>STATUS</div>
              <div>DATE</div>
              <div>USER EMAIL</div>
              <div>DOWNLOAD</div>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-lg bg-yellow-100 p-4">
                <Package className="h-12 w-12 text-yellow-600" />
              </div>
              <p className="text-gray-600">Your bulk updates will show up here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div key={activity.id} className="grid grid-cols-6 gap-4 p-4 text-sm">
                  <div className="font-medium text-gray-900">{activity.fileName}</div>
                  <div className="text-gray-600">{activity.itemCount}</div>
                  <div className="flex items-center gap-2">
                    {activity.status === 'completed' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Completed</span>
                      </>
                    )}
                    {activity.status === 'failed' && (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Failed</span>
                      </>
                    )}
                    {activity.status === 'in_progress' && (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-blue-600">Processing</span>
                      </>
                    )}
                  </div>
                  <div className="text-gray-600">{formatDate(activity.date)}</div>
                  <div className="text-gray-600">{activity.userEmail}</div>
                  <div>
                    {activity.downloadUrl ? (
                      <button className="text-blue-600 hover:underline">
                        <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for bulk update:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download the current menu first to see the proper CSV format</li>
          <li>• Required fields are marked with asterisk (*): *ItemID, *ItemName, *Price, *CategoryName, *AvailableStatus</li>
          <li>• Maximum file size: 10MB, up to 20,000 items</li>
          <li>• Supported format: CSV files only</li>
          <li>•
            <a
              href="/sample-menu-template.csv"
              download
              className="text-blue-600 hover:underline font-medium"
            >
              Download sample CSV template
            </a> to get started
          </li>
        </ul>
      </div>
    </div>
  )
}