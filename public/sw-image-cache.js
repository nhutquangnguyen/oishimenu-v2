// Service Worker for aggressive image caching
const CACHE_NAME = 'oishimenu-images-v1'
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 days

// Image file extensions to cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

// Check if URL is for an image
function isImageRequest(url) {
  const pathname = new URL(url).pathname.toLowerCase()
  return IMAGE_EXTENSIONS.some(ext => pathname.includes(ext)) ||
         url.includes('/api/placeholder/') ||
         url.includes('images/') ||
         url.includes('photos/')
}

// Install event - precache critical images
self.addEventListener('install', (event) => {
  console.log('Image cache service worker installing...')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache critical images
      const criticalImages = [
        '/images/placeholder.jpg',
        '/images/logo.png',
        '/images/no-image.jpg'
      ]

      return cache.addAll(criticalImages.filter(url => url))
        .catch(error => {
          console.log('Some critical images failed to cache:', error)
        })
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Image cache service worker activating...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('oishimenu-images-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old image cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch event - implement caching strategy for images
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = request.url

  // Only handle image requests
  if (!isImageRequest(url) || request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        // Try to get from cache first
        const cachedResponse = await cache.match(request)

        if (cachedResponse) {
          // Check if cache is expired
          const cachedDate = cachedResponse.headers.get('sw-cache-date')
          if (cachedDate) {
            const age = Date.now() - parseInt(cachedDate)
            if (age < CACHE_EXPIRY) {
              console.log('Serving image from cache:', url)

              // Optionally fetch in background to update cache
              if (age > (CACHE_EXPIRY / 2)) { // Refresh if older than 15 days
                fetchAndUpdateCache(cache, request).catch(console.error)
              }

              return cachedResponse
            }
          } else {
            // Old cache without date, serve but update
            fetchAndUpdateCache(cache, request).catch(console.error)
            return cachedResponse
          }
        }

        // Not in cache or expired, fetch from network
        console.log('Fetching image from network:', url)
        const networkResponse = await fetch(request)

        if (networkResponse.ok) {
          // Clone the response for caching
          const responseToCache = networkResponse.clone()

          // Add timestamp header
          const headers = new Headers(responseToCache.headers)
          headers.set('sw-cache-date', Date.now().toString())

          const cachedResponse = new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers
          })

          // Cache the response
          await cache.put(request, cachedResponse)
          console.log('Image cached:', url)
        }

        return networkResponse

      } catch (error) {
        console.error('Error handling image request:', error)

        // Try to serve stale cache as fallback
        const staleResponse = await cache.match(request)
        if (staleResponse) {
          console.log('Serving stale image from cache:', url)
          return staleResponse
        }

        // Return a fallback image or error
        return new Response('Image not available', {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'text/plain' }
        })
      }
    })
  )
})

// Background function to update cache
async function fetchAndUpdateCache(cache, request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const headers = new Headers(response.headers)
      headers.set('sw-cache-date', Date.now().toString())

      const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      })

      await cache.put(request, cachedResponse)
      console.log('Background updated cache for:', request.url)
    }
  } catch (error) {
    console.error('Background cache update failed:', error)
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data

  switch (type) {
    case 'PRELOAD_IMAGES':
      preloadImages(data.urls)
        .then(() => {
          event.ports[0].postMessage({ success: true })
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message })
        })
      break

    case 'CLEAR_IMAGE_CACHE':
      caches.delete(CACHE_NAME)
        .then(() => {
          event.ports[0].postMessage({ success: true })
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message })
        })
      break

    case 'GET_CACHE_STATS':
      getCacheStats()
        .then((stats) => {
          event.ports[0].postMessage({ success: true, data: stats })
        })
        .catch((error) => {
          event.ports[0].postMessage({ success: false, error: error.message })
        })
      break
  }
})

// Preload images function
async function preloadImages(urls) {
  const cache = await caches.open(CACHE_NAME)

  const promises = urls.map(async (url) => {
    try {
      const request = new Request(url)
      const cachedResponse = await cache.match(request)

      if (!cachedResponse) {
        const response = await fetch(request)
        if (response.ok) {
          const headers = new Headers(response.headers)
          headers.set('sw-cache-date', Date.now().toString())

          const cachedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          })

          await cache.put(request, cachedResponse)
          console.log('Preloaded and cached:', url)
        }
      }
      return url
    } catch (error) {
      console.error('Failed to preload:', url, error)
      return null
    }
  })

  return Promise.all(promises)
}

// Get cache statistics
async function getCacheStats() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const keys = await cache.keys()

    let totalSize = 0
    const items = []

    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size

        items.push({
          url: request.url,
          size: blob.size,
          cachedDate: response.headers.get('sw-cache-date')
        })
      }
    }

    return {
      totalImages: keys.length,
      totalSize: totalSize,
      items: items
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return {
      totalImages: 0,
      totalSize: 0,
      items: []
    }
  }
}