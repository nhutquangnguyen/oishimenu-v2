"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle, CheckCircle, XCircle, Bell, BellOff } from "lucide-react"
import { getStockAlerts, acknowledgeStockAlert } from "@/lib/services/inventory"
import type { StockAlert } from "@/lib/types/inventory"

interface StockAlertsProps {
  showAll?: boolean
  onAlertCountChange?: (count: number) => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price).replace('₫', 'đ');
}

export function StockAlerts({ showAll = false, onAlertCountChange }: StockAlertsProps) {
  const { t } = useTranslation()
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [acknowledging, setAcknowledging] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadAlerts()

    // Set up polling for real-time updates
    const interval = setInterval(loadAlerts, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Notify parent of alert count changes
    const unacknowledgedAlerts = alerts.filter(alert => !alert.isAcknowledged)
    onAlertCountChange?.(unacknowledgedAlerts.length)
  }, [alerts, onAlertCountChange])

  const loadAlerts = async () => {
    try {
      const fetchedAlerts = await getStockAlerts()
      setAlerts(fetchedAlerts)
    } catch (error) {
      console.error('Error loading stock alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (alertId: string) => {
    if (acknowledging.has(alertId)) return

    setAcknowledging(prev => new Set(prev).add(alertId))

    try {
      const success = await acknowledgeStockAlert(alertId, 'current-user') // TODO: Get actual user ID
      if (success) {
        setAlerts(prev => prev.map(alert =>
          alert.id === alertId
            ? { ...alert, isAcknowledged: true, acknowledgedAt: new Date() }
            : alert
        ))
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error)
    } finally {
      setAcknowledging(prev => {
        const newSet = new Set(prev)
        newSet.delete(alertId)
        return newSet
      })
    }
  }

  const getAlertIcon = (level: StockAlert['alertLevel']) => {
    switch (level) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'out_of_stock':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'low':
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getAlertColor = (level: StockAlert['alertLevel']) => {
    switch (level) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'out_of_stock':
        return 'border-red-300 bg-red-100'
      case 'low':
      default:
        return 'border-yellow-200 bg-yellow-50'
    }
  }

  const getAlertTitle = (level: StockAlert['alertLevel']) => {
    switch (level) {
      case 'critical':
        return t('stock.criticalLevel')
      case 'out_of_stock':
        return t('stock.outOfStock')
      case 'low':
      default:
        return t('stock.lowStockAlert')
    }
  }

  const filteredAlerts = showAll ? alerts : alerts.filter(alert => !alert.isAcknowledged)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">
          {showAll ? t('stock.noAlertsFound') : t('stock.noPendingAlerts')}
        </p>
        {!showAll && (
          <p className="text-xs text-gray-400 mt-1">
            {t('stock.allIngredientsOk')}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 ${getAlertColor(alert.alertLevel)} ${
            alert.isAcknowledged ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {getAlertIcon(alert.alertLevel)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {getAlertTitle(alert.alertLevel)}
                  </h4>
                  {alert.isAcknowledged && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{alert.ingredientName}</span> {t('stock.isRunningLow')}
                </p>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between items-center">
                    <span>{t('stock.currentStock')}:</span>
                    <span className={`font-medium ${
                      alert.currentQuantity <= 0 ? 'text-red-600' :
                      alert.currentQuantity <= alert.minimumThreshold * 0.5 ? 'text-red-500' :
                      'text-yellow-600'
                    }`}>
                      {alert.currentQuantity} {t('stock.units')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('stock.minimumThreshold')}:</span>
                    <span className="font-medium">{alert.minimumThreshold} {t('stock.units')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('stock.alertCreated')}:</span>
                    <span>{alert.createdAt.toLocaleDateString()} {alert.createdAt.toLocaleTimeString()}</span>
                  </div>
                  {alert.acknowledgedAt && (
                    <div className="flex justify-between items-center">
                      <span>{t('stock.acknowledged')}:</span>
                      <span>{alert.acknowledgedAt.toLocaleDateString()} {alert.acknowledgedAt.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!alert.isAcknowledged && (
              <button
                onClick={() => handleAcknowledge(alert.id)}
                disabled={acknowledging.has(alert.id)}
                className="ml-4 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acknowledging.has(alert.id) ? t('stock.acknowledging') : t('stock.acknowledge')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Notification badge component for showing alert count
export function StockAlertBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
      {count > 9 ? '9+' : count}
    </span>
  )
}

// Quick alerts summary for dashboard
export function StockAlertsSummary() {
  const { t } = useTranslation()
  const [alertCount, setAlertCount] = useState(0)
  const [criticalCount, setCriticalCount] = useState(0)

  const handleAlertCountChange = (alerts: StockAlert[]) => {
    const unacknowledged = alerts.filter(alert => !alert.isAcknowledged)
    setAlertCount(unacknowledged.length)
    setCriticalCount(unacknowledged.filter(alert =>
      alert.alertLevel === 'critical' || alert.alertLevel === 'out_of_stock'
    ).length)
  }

  useEffect(() => {
    const loadAlertsForSummary = async () => {
      try {
        const alerts = await getStockAlerts()
        handleAlertCountChange(alerts)
      } catch (error) {
        console.error('Error loading alerts for summary:', error)
      }
    }

    loadAlertsForSummary()
    const interval = setInterval(loadAlertsForSummary, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  if (alertCount === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-800">
            {t('stock.allIngredientsWellStocked')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${
      criticalCount > 0 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center gap-2">
        {criticalCount > 0 ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        )}
        <div>
          <p className={`text-sm font-medium ${
            criticalCount > 0 ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {alertCount} {t('stock.stockAlert')}{alertCount !== 1 ? 's' : ''}
          </p>
          {criticalCount > 0 && (
            <p className="text-xs text-red-600">
              {criticalCount} {t('stock.criticalOrOutOfStock')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}