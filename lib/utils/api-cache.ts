// Advanced API response caching utilities

interface CacheConfig {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of entries
  staleWhileRevalidate?: boolean // Return stale data while fetching fresh
  version?: string // Cache version for invalidation
}

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  etag?: string
  version?: string
}

class APICache<T = any> {
  private cache = new Map<string, CacheEntry<T>>()
  private revalidationPromises = new Map<string, Promise<T>>()
  private defaultConfig: Required<CacheConfig>

  constructor(config: CacheConfig = {}) {
    this.defaultConfig = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      staleWhileRevalidate: true,
      version: '1.0'
    }

    // Override defaults with provided config
    Object.assign(this.defaultConfig, config)
  }

  // Generate cache key from URL and params
  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ''
    return `${url}:${paramString}`
  }

  // Check if cache entry is expired
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Ensure cache doesn't exceed max size
  private enforceMaxSize(): void {
    if (this.cache.size <= this.defaultConfig.maxSize) return

    // Remove oldest entries
    const entries = Array.from(this.cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

    const toRemove = entries.slice(0, this.cache.size - this.defaultConfig.maxSize)
    toRemove.forEach(([key]) => this.cache.delete(key))
  }

  // Get cached data
  get(url: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(url, params)
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check version compatibility
    if (entry.version !== this.defaultConfig.version) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  // Set cached data
  set(
    url: string,
    data: T,
    params?: Record<string, any>,
    config?: Partial<CacheConfig>
  ): void {
    const key = this.generateKey(url, params)
    const ttl = config?.ttl || this.defaultConfig.ttl
    const version = config?.version || this.defaultConfig.version

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      version
    })

    this.enforceMaxSize()
  }

  // Check if data is cached and fresh
  isFresh(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params)
    const entry = this.cache.get(key)

    if (!entry) return false
    if (entry.version !== this.defaultConfig.version) return false

    return !this.isExpired(entry)
  }

  // Check if data is cached (regardless of freshness)
  has(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params)
    const entry = this.cache.get(key)

    if (!entry) return false
    if (entry.version !== this.defaultConfig.version) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Remove specific cache entry
  delete(url: string, params?: Record<string, any>): void {
    const key = this.generateKey(url, params)
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    this.revalidationPromises.clear()
  }

  // Get cache statistics
  getStats() {
    this.cleanup()
    return {
      size: this.cache.size,
      maxSize: this.defaultConfig.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        size: JSON.stringify(entry.data).length,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        expired: this.isExpired(entry)
      }))
    }
  }

  // Fetch with cache-first strategy
  async fetchCacheFirst<R = T>(
    url: string,
    fetchFn: () => Promise<R>,
    params?: Record<string, any>,
    config?: Partial<CacheConfig>
  ): Promise<R> {
    const cached = this.get(url, params) as R

    if (cached && this.isFresh(url, params)) {
      return cached
    }

    const data = await fetchFn()
    this.set(url, data as any, params, config)
    return data
  }

  // Fetch with stale-while-revalidate strategy
  async fetchStaleWhileRevalidate<R = T>(
    url: string,
    fetchFn: () => Promise<R>,
    params?: Record<string, any>,
    config?: Partial<CacheConfig>
  ): Promise<R> {
    const key = this.generateKey(url, params)
    const cached = this.get(url, params) as R

    // If we have fresh data, return it
    if (cached && this.isFresh(url, params)) {
      return cached
    }

    // If we have stale data and staleWhileRevalidate is enabled
    if (cached && (config?.staleWhileRevalidate ?? this.defaultConfig.staleWhileRevalidate)) {
      // Start background revalidation if not already in progress
      if (!this.revalidationPromises.has(key)) {
        const revalidationPromise = fetchFn()
          .then(data => {
            this.set(url, data as any, params, config)
            return data
          })
          .finally(() => {
            this.revalidationPromises.delete(key)
          })

        this.revalidationPromises.set(key, revalidationPromise as unknown as Promise<T>)
      }

      return cached
    }

    // No cache or stale-while-revalidate disabled, fetch fresh data
    const data = await fetchFn()
    this.set(url, data as any, params, config)
    return data
  }

  // Fetch with network-first strategy
  async fetchNetworkFirst<R = T>(
    url: string,
    fetchFn: () => Promise<R>,
    params?: Record<string, any>,
    config?: Partial<CacheConfig>
  ): Promise<R> {
    try {
      const data = await fetchFn()
      this.set(url, data as any, params, config)
      return data
    } catch (error) {
      // Fallback to cache if network fails
      const cached = this.get(url, params) as R
      if (cached) {
        console.warn('Network failed, serving stale cache:', url)
        return cached
      }
      throw error
    }
  }

  // Prefetch data
  async prefetch<R = T>(
    url: string,
    fetchFn: () => Promise<R>,
    params?: Record<string, any>,
    config?: Partial<CacheConfig>
  ): Promise<void> {
    if (!this.has(url, params)) {
      try {
        const data = await fetchFn()
        this.set(url, data as any, params, config)
      } catch (error) {
        console.error('Prefetch failed:', url, error)
      }
    }
  }

  // Invalidate cache entries matching pattern
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  // Update cache version (invalidates all entries)
  updateVersion(version: string): void {
    this.defaultConfig.version = version
    this.clear()
  }
}

// Create global cache instances for different data types
export const menuCache = new APICache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 50,
  staleWhileRevalidate: true,
  version: '1.0'
})

export const orderCache = new APICache({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 100,
  staleWhileRevalidate: true,
  version: '1.0'
})

export const inventoryCache = new APICache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 50,
  staleWhileRevalidate: true,
  version: '1.0'
})

export const statsCache = new APICache({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 20,
  staleWhileRevalidate: true,
  version: '1.0'
})

// HTTP cache headers utilities
export const cacheHeaders = {
  // Generate cache headers for responses
  generateHeaders(maxAge: number = 300): Record<string, string> {
    return {
      'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
      'ETag': `"${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    }
  },

  // Parse cache control header
  parseCacheControl(header: string): Record<string, string | number> {
    const directives: Record<string, string | number> = {}

    header.split(',').forEach(directive => {
      const [key, value] = directive.trim().split('=')
      directives[key] = value ? (isNaN(Number(value)) ? value : Number(value)) : 'true'
    })

    return directives
  },

  // Check if response is cacheable
  isCacheable(headers: Headers): boolean {
    const cacheControl = headers.get('cache-control')
    if (!cacheControl) return false

    const directives = this.parseCacheControl(cacheControl)

    return !directives['no-cache'] &&
           !directives['no-store'] &&
           !directives['private']
  }
}

// Network-aware caching
export const networkAwareCache = {
  // Get effective connection type
  getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      return connection?.effectiveType || 'unknown'
    }
    return 'unknown'
  },

  // Adjust cache strategy based on connection
  getCacheStrategy(): 'cache-first' | 'network-first' | 'stale-while-revalidate' {
    const connectionType = this.getConnectionType()

    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return 'cache-first'
      case '3g':
        return 'stale-while-revalidate'
      case '4g':
      default:
        return 'network-first'
    }
  },

  // Get TTL based on connection
  getTTL(): number {
    const connectionType = this.getConnectionType()

    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return 30 * 60 * 1000 // 30 minutes
      case '3g':
        return 10 * 60 * 1000 // 10 minutes
      case '4g':
      default:
        return 5 * 60 * 1000 // 5 minutes
    }
  }
}

// Export main cache class for custom instances
export { APICache }