"use client"

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, Trash2, Download, Database, Image, Wifi, WifiOff } from 'lucide-react'

import { storageCache, userPreferencesCache, tableSelectionCache } from '@/lib/utils/storage'
import { imageCacheUtils, useImageCache } from '@/components/optimized-image'
import { menuCache, orderCache, inventoryCache, statsCache, networkAwareCache } from '@/lib/utils/api-cache'
import { networkUtils, cacheUtils } from '@/lib/firebase'

interface CacheManagerProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CacheManager({ isOpen = false, onClose }: CacheManagerProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [stats, setStats] = useState({
    reactQuery: { size: 0, queries: 0 },
    localStorage: { used: 0, total: 0 },
    apiCache: { total: 0, fresh: 0, stale: 0 },
    imageCache: { cachedImages: 0, loadingImages: 0, totalMemoryUsage: 0 },
    firestore: { usage: 0, quota: 0 }
  })

  const queryClient = useQueryClient()
  const { cacheStats: imageCacheStats, clearCache: clearImageCache } = useImageCache()

  // Monitor network status
  useEffect(() => {
    const cleanup = networkUtils.onNetworkChange(setIsOnline)
    setIsOnline(networkUtils.isOnline())
    return cleanup
  }, [])

  // Update stats
  const updateStats = async () => {
    try {
      // React Query stats
      const queryCache = queryClient.getQueryCache()
      const queries = queryCache.getAll()
      const reactQuerySize = queries.reduce((total, query) => {
        const data = query.state.data
        return total + (data ? JSON.stringify(data).length : 0)
      }, 0)

      // Local storage stats
      const storageStats = storageCache.getStats('localStorage') || { used: 0, total: 0 }

      // API cache stats
      const menuStats = menuCache.getStats()
      const orderStats = orderCache.getStats()
      const inventoryStats = inventoryCache.getStats()
      const statsStats = statsCache.getStats()

      const totalApiEntries = menuStats.size + orderStats.size + inventoryStats.size + statsStats.size
      const freshEntries = [menuStats, orderStats, inventoryStats, statsStats]
        .reduce((total, cache) => {
          return total + cache.entries.filter(entry => !entry.expired).length
        }, 0)

      // Firestore cache info
      const firestoreInfo = await cacheUtils.getCacheInfo()

      setStats({
        reactQuery: {
          size: Math.round(reactQuerySize / 1024), // KB
          queries: queries.length
        },
        localStorage: storageStats,
        apiCache: {
          total: totalApiEntries,
          fresh: freshEntries,
          stale: totalApiEntries - freshEntries
        },
        imageCache: imageCacheStats,
        firestore: {
          usage: Math.round((firestoreInfo.usage || 0) / 1024 / 1024), // MB
          quota: Math.round((firestoreInfo.quota || 0) / 1024 / 1024) // MB
        }
      })
    } catch (error) {
      console.error('Error updating cache stats:', error)
    }
  }

  useEffect(() => {
    updateStats()
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const clearAllCaches = async () => {
    try {
      // Clear React Query cache
      queryClient.clear()

      // Clear API caches
      menuCache.clear()
      orderCache.clear()
      inventoryCache.clear()
      statsCache.clear()

      // Clear browser storage
      storageCache.clear('localStorage')
      storageCache.clear('sessionStorage')

      // Clear image cache
      clearImageCache()

      // Clear Firestore cache
      await cacheUtils.clearFirestoreCache()

      updateStats()
      console.log('All caches cleared')
    } catch (error) {
      console.error('Error clearing caches:', error)
    }
  }

  const toggleFirestore = async () => {
    try {
      if (isOnline) {
        await networkUtils.disableFirestore()
      } else {
        await networkUtils.enableFirestore()
      }
      setIsOnline(!isOnline)
    } catch (error) {
      console.error('Error toggling Firestore network:', error)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Cache Manager
            </CardTitle>
            <CardDescription>
              Monitor and manage application caching
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={updateStats}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllCaches}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="react-query">React Query</TabsTrigger>
              <TabsTrigger value="api-cache">API Cache</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">React Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.reactQuery.queries}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(stats.reactQuery.size * 1024)} cached
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">API Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.apiCache.total}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.apiCache.fresh} fresh, {stats.apiCache.stale} stale
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Image Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.imageCache.cachedImages}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(stats.imageCache.totalMemoryUsage * 1024)} in memory
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Local Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round((stats.localStorage.used / stats.localStorage.total) * 100)}%</div>
                    <Progress
                      value={(stats.localStorage.used / stats.localStorage.total) * 100}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatBytes(stats.localStorage.used)} / {formatBytes(stats.localStorage.total)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Firestore Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.firestore.usage} MB</div>
                    <p className="text-xs text-muted-foreground">
                      of {stats.firestore.quota} MB quota
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Connection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{networkAwareCache.getConnectionType()}</div>
                    <p className="text-xs text-muted-foreground">
                      Strategy: {networkAwareCache.getCacheStrategy()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="react-query" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">React Query Cache</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => queryClient.invalidateQueries()}
                  >
                    Invalidate All
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => queryClient.clear()}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {queryClient.getQueryCache().getAll().map((query, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-mono text-sm text-muted-foreground">
                            {JSON.stringify(query.queryKey)}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={query.state.status === 'success' ? 'default' : 'destructive'}>
                              {query.state.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(JSON.stringify(query.state.data || {}).length)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => queryClient.invalidateQueries({ queryKey: query.queryKey })}
                        >
                          Invalidate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api-cache" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Menu Cache', cache: menuCache },
                  { name: 'Order Cache', cache: orderCache },
                  { name: 'Inventory Cache', cache: inventoryCache },
                  { name: 'Stats Cache', cache: statsCache }
                ].map(({ name, cache }) => {
                  const cacheStats = cache.getStats()
                  return (
                    <Card key={name}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex justify-between">
                          {name}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              cache.clear()
                              updateStats()
                            }}
                          >
                            Clear
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Entries:</strong> {cacheStats.size} / {cacheStats.maxSize}
                          </div>
                          <Progress value={(cacheStats.size / cacheStats.maxSize) * 100} />
                          <div className="text-xs text-muted-foreground">
                            Fresh: {cacheStats.entries.filter(e => !e.expired).length},
                            Stale: {cacheStats.entries.filter(e => e.expired).length}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Local Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={(stats.localStorage.used / stats.localStorage.total) * 100} />
                    <div className="mt-2 text-sm">
                      {formatBytes(stats.localStorage.used)} / {formatBytes(stats.localStorage.total)}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        storageCache.clear('localStorage')
                        updateStats()
                      }}
                    >
                      Clear Local Storage
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">User Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs font-mono">
                        {JSON.stringify(userPreferencesCache.get(), null, 2)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          userPreferencesCache.clear()
                          updateStats()
                        }}
                      >
                        Clear Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Image Cache</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Clear service worker cache
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then(registration => {
                          const messageChannel = new MessageChannel()
                          registration.active?.postMessage(
                            { type: 'CLEAR_IMAGE_CACHE' },
                            [messageChannel.port2]
                          )
                        })
                      }
                    }}
                  >
                    Clear SW Cache
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      clearImageCache()
                      updateStats()
                    }}
                  >
                    Clear Memory Cache
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Memory Cache</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.imageCache.cachedImages}</div>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(stats.imageCache.totalMemoryUsage * 1024)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Loading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.imageCache.loadingImages}</div>
                    <p className="text-xs text-muted-foreground">
                      images currently loading
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Service Worker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {'serviceWorker' in navigator ? 'Active' : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      browser image caching
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}