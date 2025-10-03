"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  placeholder?: React.ReactNode
  loading?: 'eager' | 'lazy'
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  cacheStrategy?: 'browser' | 'memory' | 'both'
}

// In-memory cache for images
const imageCache = new Map<string, HTMLImageElement>()
const loadingPromises = new Map<string, Promise<HTMLImageElement>>()

// Cache management
export const imageCacheUtils = {
  // Preload an image and cache it
  preload: (src: string): Promise<HTMLImageElement> => {
    if (imageCache.has(src)) {
      return Promise.resolve(imageCache.get(src)!)
    }

    if (loadingPromises.has(src)) {
      return loadingPromises.get(src)!
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        imageCache.set(src, img)
        loadingPromises.delete(src)
        resolve(img)
      }

      img.onerror = () => {
        loadingPromises.delete(src)
        reject(new Error(`Failed to load image: ${src}`))
      }

      img.src = src
    })

    loadingPromises.set(src, promise)
    return promise
  },

  // Check if image is cached
  isCached: (src: string): boolean => {
    return imageCache.has(src)
  },

  // Clear cache
  clearCache: () => {
    imageCache.clear()
    loadingPromises.clear()
  },

  // Get cache stats
  getCacheStats: () => ({
    cachedImages: imageCache.size,
    loadingImages: loadingPromises.size,
    totalMemoryUsage: imageCache.size * 50 // Rough estimate in KB
  }),

  // Remove from cache
  remove: (src: string) => {
    imageCache.delete(src)
    loadingPromises.delete(src)
  },

  // Preload multiple images
  preloadBatch: async (urls: string[]): Promise<(HTMLImageElement | Error)[]> => {
    const promises = urls.map(url =>
      imageCacheUtils.preload(url).catch(error => error)
    )
    return Promise.all(promises)
  }
}

// Service Worker registration for image caching
export const registerImageCacheServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw-image-cache.js')
        .then(registration => {
          console.log('Image cache SW registered:', registration.scope)
        })
        .catch(error => {
          console.log('Image cache SW registration failed:', error)
        })
    })
  }
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/images/placeholder.jpg',
  placeholder,
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  cacheStrategy = 'both'
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(!loading || loading === 'eager' || priority)

  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver>()

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!isInView && loading === 'lazy' && !priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
              observer.disconnect()
            }
          })
        },
        {
          rootMargin: '50px' // Start loading 50px before the image comes into view
        }
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
        observerRef.current = observer
      }

      return () => {
        observer.disconnect()
      }
    }
  }, [isInView, loading, priority])

  // Handle image loading
  useEffect(() => {
    if (!isInView || !src) return

    const loadImage = async () => {
      try {
        setIsLoading(true)
        setHasError(false)

        // Check memory cache first if enabled
        if (cacheStrategy === 'memory' || cacheStrategy === 'both') {
          if (imageCacheUtils.isCached(src)) {
            setCurrentSrc(src)
            setIsLoading(false)
            onLoad?.()
            return
          }
        }

        // For browser caching, we can still preload to trigger cache
        if (cacheStrategy === 'browser' || cacheStrategy === 'both') {
          await imageCacheUtils.preload(src)
        }

        setCurrentSrc(src)
        setIsLoading(false)
        onLoad?.()
      } catch (error) {
        console.error('Error loading image:', error)
        setHasError(true)
        setIsLoading(false)

        // Try fallback image
        if (fallbackSrc && fallbackSrc !== src) {
          try {
            await imageCacheUtils.preload(fallbackSrc)
            setCurrentSrc(fallbackSrc)
            setHasError(false)
          } catch (fallbackError) {
            console.error('Error loading fallback image:', fallbackError)
            onError?.()
          }
        } else {
          onError?.()
        }
      }
    }

    loadImage()
  }, [isInView, src, fallbackSrc, cacheStrategy, onLoad, onError])

  // Show placeholder while loading or not in view
  if ((!isInView && loading === 'lazy' && !priority) || isLoading) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'flex items-center justify-center bg-gray-100 animate-pulse',
          className
        )}
      >
        {placeholder || (
          <div className="text-gray-400 text-sm">Loading...</div>
        )}
      </div>
    )
  }

  // Show error state
  if (hasError && !currentSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
      >
        <div className="text-center">
          <div className="text-xs">Image not available</div>
        </div>
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      loading={loading}
      onLoad={() => {
        setIsLoading(false)
        onLoad?.()
      }}
      onError={() => {
        setHasError(true)
        setIsLoading(false)
        onError?.()
      }}
      style={{
        opacity: isLoading ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  )
}

// Hook for batch image preloading
export function useImagePreloader() {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadProgress, setPreloadProgress] = useState(0)

  const preloadImages = async (urls: string[]) => {
    if (urls.length === 0) return

    setIsPreloading(true)
    setPreloadProgress(0)

    let loaded = 0
    const total = urls.length

    const updateProgress = () => {
      loaded++
      setPreloadProgress((loaded / total) * 100)
    }

    try {
      const promises = urls.map(async (url) => {
        try {
          await imageCacheUtils.preload(url)
          updateProgress()
          return url
        } catch (error) {
          updateProgress()
          return null
        }
      })

      await Promise.all(promises)
    } finally {
      setIsPreloading(false)
    }
  }

  return {
    preloadImages,
    isPreloading,
    preloadProgress
  }
}

// Hook for managing image cache
export function useImageCache() {
  const [cacheStats, setCacheStats] = useState(imageCacheUtils.getCacheStats())

  const updateStats = () => {
    setCacheStats(imageCacheUtils.getCacheStats())
  }

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return {
    cacheStats,
    preload: imageCacheUtils.preload,
    clearCache: () => {
      imageCacheUtils.clearCache()
      updateStats()
    },
    remove: (src: string) => {
      imageCacheUtils.remove(src)
      updateStats()
    },
    isCached: imageCacheUtils.isCached,
    updateStats
  }
}