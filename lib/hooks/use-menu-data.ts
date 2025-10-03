import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMenuItems, getMenuCategories, createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/services/menu'
import type { MenuItem, MenuCategory, MenuFilter } from '@/lib/types/menu'

// Query Keys
export const menuQueryKeys = {
  all: ['menu'] as const,
  categories: () => [...menuQueryKeys.all, 'categories'] as const,
  items: () => [...menuQueryKeys.all, 'items'] as const,
  itemsWithFilters: (filters: MenuFilter) => [...menuQueryKeys.items(), filters] as const,
  item: (id: string) => [...menuQueryKeys.items(), id] as const,
}

// Hook for menu categories with caching
export function useMenuCategories() {
  return useQuery({
    queryKey: menuQueryKeys.categories(),
    queryFn: getMenuCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change infrequently
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    refetchOnWindowFocus: false, // Categories rarely change
  })
}

// Hook for menu items with filters and caching
export function useMenuItems(filters: MenuFilter = {}) {
  return useQuery({
    queryKey: menuQueryKeys.itemsWithFilters(filters),
    queryFn: () => getMenuItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - menu items may change more frequently
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
    refetchOnWindowFocus: true, // Menu items might need fresh data
  })
}

// Hook for creating menu items with cache invalidation
export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      // Invalidate all menu-related queries
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.all })
    },
  })
}

// Hook for updating menu items with optimistic updates
export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<MenuItem> }) =>
      updateMenuItem(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: menuQueryKeys.items() })

      // Snapshot previous value
      const previousItems = queryClient.getQueriesData({ queryKey: menuQueryKeys.items() })

      // Optimistically update cache
      queryClient.setQueriesData({ queryKey: menuQueryKeys.items() }, (old: MenuItem[] | undefined) => {
        if (!old) return old
        return old.map(item => item.id === id ? { ...item, ...updates } : item)
      })

      return { previousItems }
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousItems) {
        context.previousItems.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() })
    },
  })
}

// Hook for deleting menu items with cache updates
export function useDeleteMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMenuItem,
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: menuQueryKeys.items() })

      // Snapshot previous value
      const previousItems = queryClient.getQueriesData({ queryKey: menuQueryKeys.items() })

      // Optimistically remove from cache
      queryClient.setQueriesData({ queryKey: menuQueryKeys.items() }, (old: MenuItem[] | undefined) => {
        if (!old) return old
        return old.filter(item => item.id !== id)
      })

      return { previousItems }
    },
    onError: (err, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousItems) {
        context.previousItems.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.items() })
    },
  })
}

// Hook for prefetching menu data
export function usePrefetchMenuData() {
  const queryClient = useQueryClient()

  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: menuQueryKeys.categories(),
      queryFn: getMenuCategories,
      staleTime: 10 * 60 * 1000,
    })
  }

  const prefetchItems = (filters: MenuFilter = {}) => {
    queryClient.prefetchQuery({
      queryKey: menuQueryKeys.itemsWithFilters(filters),
      queryFn: () => getMenuItems(filters),
      staleTime: 5 * 60 * 1000,
    })
  }

  return { prefetchCategories, prefetchItems }
}