// Browser storage utilities with caching and error handling

type StorageType = 'localStorage' | 'sessionStorage'

interface StorageOptions {
  ttl?: number // Time to live in milliseconds
  type?: StorageType
}

interface CachedData<T> {
  data: T
  timestamp: number
  ttl?: number
}

class StorageCache {
  private getStorage(type: StorageType): Storage | null {
    try {
      if (typeof window === 'undefined') return null
      return type === 'localStorage' ? window.localStorage : window.sessionStorage
    } catch {
      return null
    }
  }

  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    try {
      const storage = this.getStorage(options.type || 'localStorage')
      if (!storage) return false

      const cachedData: CachedData<T> = {
        data: value,
        timestamp: Date.now(),
        ttl: options.ttl
      }

      storage.setItem(key, JSON.stringify(cachedData))
      return true
    } catch (error) {
      console.warn(`Failed to set storage item ${key}:`, error)
      return false
    }
  }

  get<T>(key: string, type: StorageType = 'localStorage'): T | null {
    try {
      const storage = this.getStorage(type)
      if (!storage) return null

      const item = storage.getItem(key)
      if (!item) return null

      const cachedData: CachedData<T> = JSON.parse(item)

      // Check if data has expired
      if (cachedData.ttl && Date.now() - cachedData.timestamp > cachedData.ttl) {
        this.remove(key, type)
        return null
      }

      return cachedData.data
    } catch (error) {
      console.warn(`Failed to get storage item ${key}:`, error)
      return null
    }
  }

  remove(key: string, type: StorageType = 'localStorage'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) return false

      storage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove storage item ${key}:`, error)
      return false
    }
  }

  clear(type: StorageType = 'localStorage'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) return false

      storage.clear()
      return true
    } catch (error) {
      console.warn(`Failed to clear storage:`, error)
      return false
    }
  }

  // Get multiple items at once
  getMultiple<T>(keys: string[], type: StorageType = 'localStorage'): Record<string, T | null> {
    const result: Record<string, T | null> = {}

    for (const key of keys) {
      result[key] = this.get<T>(key, type)
    }

    return result
  }

  // Check if storage is available
  isAvailable(type: StorageType = 'localStorage'): boolean {
    try {
      const storage = this.getStorage(type)
      if (!storage) return false

      const testKey = '__storage_test__'
      storage.setItem(testKey, 'test')
      storage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  // Get storage usage stats
  getStats(type: StorageType = 'localStorage'): { used: number; total: number } | null {
    try {
      const storage = this.getStorage(type)
      if (!storage) return null

      let used = 0
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key) {
          const value = storage.getItem(key)
          used += key.length + (value?.length || 0)
        }
      }

      // Estimate total available (varies by browser)
      const total = 5 * 1024 * 1024 // 5MB typical for localStorage

      return { used, total }
    } catch {
      return null
    }
  }
}

// Singleton instance
export const storageCache = new StorageCache()

// Predefined cache keys for the application
export const CACHE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LAST_SELECTED_TABLE: 'last_selected_table',
  POS_SETTINGS: 'pos_settings',
  MENU_VIEW_PREFERENCES: 'menu_view_preferences',
  SIDEBAR_STATE: 'sidebar_state',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
} as const

// User preferences types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'vi' | 'en'
  menuViewMode: 'grid' | 'list'
  sidebarCollapsed: boolean
  tableId?: string
  posSettings: {
    showImages: boolean
    showPrices: boolean
    categoryFilter: string[]
  }
}

// Helper functions for common use cases
export const userPreferencesCache = {
  get: (): UserPreferences | null =>
    storageCache.get<UserPreferences>(CACHE_KEYS.USER_PREFERENCES),

  set: (preferences: Partial<UserPreferences>): boolean => {
    const current = userPreferencesCache.get() || {}
    const updated = { ...current, ...preferences }
    return storageCache.set(CACHE_KEYS.USER_PREFERENCES, updated, { ttl: 30 * 24 * 60 * 60 * 1000 }) // 30 days
  },

  clear: (): boolean =>
    storageCache.remove(CACHE_KEYS.USER_PREFERENCES)
}

export const tableSelectionCache = {
  get: (): string | null =>
    storageCache.get<string>(CACHE_KEYS.LAST_SELECTED_TABLE),

  set: (tableId: string): boolean =>
    storageCache.set(CACHE_KEYS.LAST_SELECTED_TABLE, tableId, { ttl: 24 * 60 * 60 * 1000 }), // 24 hours

  clear: (): boolean =>
    storageCache.remove(CACHE_KEYS.LAST_SELECTED_TABLE)
}