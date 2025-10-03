import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getTodayOrders,
  getPendingOrders,
  getOrderStats,
  getRecentOrders,
  searchOrders
} from '@/lib/services/order'
import type { Order, OrderFilter, OrderStats, OrderStatus } from '@/lib/types/order'

// Query Keys
export const orderQueryKeys = {
  all: ['orders'] as const,
  lists: () => [...orderQueryKeys.all, 'list'] as const,
  listsWithFilters: (filters: OrderFilter) => [...orderQueryKeys.lists(), filters] as const,
  details: () => [...orderQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
  today: () => [...orderQueryKeys.all, 'today'] as const,
  pending: () => [...orderQueryKeys.all, 'pending'] as const,
  recent: (limit: number) => [...orderQueryKeys.all, 'recent', limit] as const,
  stats: (dateFrom?: Date, dateTo?: Date) => [...orderQueryKeys.all, 'stats', { dateFrom, dateTo }] as const,
  search: (term: string) => [...orderQueryKeys.all, 'search', term] as const,
}

// Hook for orders with filters and caching
export function useOrders(filters: OrderFilter = {}) {
  return useQuery({
    queryKey: orderQueryKeys.listsWithFilters(filters),
    queryFn: () => getOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - orders change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    refetchOnWindowFocus: true, // Orders need fresh data
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for active orders
  })
}

// Hook for a single order
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => getOrder(id),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    enabled: !!id, // Only run if id is provided
  })
}

// Hook for today's orders
export function useTodayOrders() {
  return useQuery({
    queryKey: orderQueryKeys.today(),
    queryFn: getTodayOrders,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// Hook for pending orders (that need attention)
export function usePendingOrders() {
  return useQuery({
    queryKey: orderQueryKeys.pending(),
    queryFn: getPendingOrders,
    staleTime: 30 * 1000, // 30 seconds - pending orders need very fresh data
    gcTime: 2 * 60 * 1000, // 2 minutes in cache
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for real-time updates
  })
}

// Hook for recent orders
export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: orderQueryKeys.recent(limit),
    queryFn: () => getRecentOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    refetchOnWindowFocus: true,
  })
}

// Hook for order statistics
export function useOrderStats(dateFrom?: Date, dateTo?: Date) {
  return useQuery({
    queryKey: orderQueryKeys.stats(dateFrom, dateTo),
    queryFn: () => getOrderStats(dateFrom, dateTo),
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
    gcTime: 15 * 60 * 1000, // 15 minutes in cache
    refetchOnWindowFocus: false, // Stats are less critical for real-time updates
  })
}

// Hook for searching orders
export function useSearchOrders(searchTerm: string, enabled: boolean = true) {
  return useQuery({
    queryKey: orderQueryKeys.search(searchTerm),
    queryFn: () => searchOrders(searchTerm),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
    enabled: enabled && searchTerm.length > 0, // Only search if term is provided and enabled
  })
}

// Hook for creating orders with cache invalidation
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) =>
      createOrder(orderData),
    onSuccess: () => {
      // Invalidate all order-related queries to show the new order
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
    },
    onError: (error) => {
      console.error('Failed to create order:', error)
    },
  })
}

// Hook for updating orders with optimistic updates
export function useUpdateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Order> }) =>
      updateOrder(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.lists() })

      // Snapshot previous values
      const previousOrder = queryClient.getQueryData(orderQueryKeys.detail(id))
      const previousLists = queryClient.getQueriesData({ queryKey: orderQueryKeys.lists() })

      // Optimistically update the single order
      queryClient.setQueryData(orderQueryKeys.detail(id), (old: Order | undefined) => {
        if (!old) return old
        return { ...old, ...updates, updatedAt: new Date() }
      })

      // Optimistically update orders in lists
      queryClient.setQueriesData({ queryKey: orderQueryKeys.lists() }, (old: Order[] | undefined) => {
        if (!old) return old
        return old.map(order =>
          order.id === id
            ? { ...order, ...updates, updatedAt: new Date() }
            : order
        )
      })

      return { previousOrder, previousLists }
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderQueryKeys.detail(variables.id), context.previousOrder)
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to update order:', err)
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() })
    },
  })
}

// Hook for updating order status with optimistic updates
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, updatedBy }: { id: string; status: OrderStatus; updatedBy?: string }) =>
      updateOrderStatus(id, status, updatedBy),
    onMutate: async ({ id, status, updatedBy }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.lists() })

      // Snapshot previous values
      const previousOrder = queryClient.getQueryData(orderQueryKeys.detail(id))
      const previousLists = queryClient.getQueriesData({ queryKey: orderQueryKeys.lists() })

      const now = new Date()
      const statusUpdates: any = { status, updatedAt: now }

      // Add timestamp for specific status changes
      if (status === 'CONFIRMED') {
        statusUpdates.confirmedAt = now
      } else if (status === 'READY') {
        statusUpdates.readyAt = now
      } else if (status === 'DELIVERED') {
        statusUpdates.deliveredAt = now
      }

      if (updatedBy) {
        statusUpdates.assignedStaff = updatedBy
      }

      // Optimistically update the single order
      queryClient.setQueryData(orderQueryKeys.detail(id), (old: Order | undefined) => {
        if (!old) return old
        return { ...old, ...statusUpdates }
      })

      // Optimistically update orders in lists
      queryClient.setQueriesData({ queryKey: orderQueryKeys.lists() }, (old: Order[] | undefined) => {
        if (!old) return old
        return old.map(order =>
          order.id === id
            ? { ...order, ...statusUpdates }
            : order
        )
      })

      return { previousOrder, previousLists }
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderQueryKeys.detail(variables.id), context.previousOrder)
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to update order status:', err)
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() })
      // Also invalidate pending and today orders as they might be affected
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.pending() })
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.today() })
    },
  })
}

// Hook for deleting orders with cache updates
export function useDeleteOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOrder,
    onMutate: async (id: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: orderQueryKeys.lists() })

      // Snapshot previous values
      const previousOrder = queryClient.getQueryData(orderQueryKeys.detail(id))
      const previousLists = queryClient.getQueriesData({ queryKey: orderQueryKeys.lists() })

      // Optimistically remove from cache
      queryClient.removeQueries({ queryKey: orderQueryKeys.detail(id) })
      queryClient.setQueriesData({ queryKey: orderQueryKeys.lists() }, (old: Order[] | undefined) => {
        if (!old) return old
        return old.filter(order => order.id !== id)
      })

      return { previousOrder, previousLists }
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates on error
      if (context?.previousOrder) {
        queryClient.setQueryData(orderQueryKeys.detail(variables), context.previousOrder)
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to delete order:', err)
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
    },
  })
}

// Hook for prefetching order data
export function usePrefetchOrderData() {
  const queryClient = useQueryClient()

  const prefetchOrders = (filters: OrderFilter = {}) => {
    queryClient.prefetchQuery({
      queryKey: orderQueryKeys.listsWithFilters(filters),
      queryFn: () => getOrders(filters),
      staleTime: 2 * 60 * 1000,
    })
  }

  const prefetchOrder = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: orderQueryKeys.detail(id),
      queryFn: () => getOrder(id),
      staleTime: 1 * 60 * 1000,
    })
  }

  const prefetchTodayOrders = () => {
    queryClient.prefetchQuery({
      queryKey: orderQueryKeys.today(),
      queryFn: getTodayOrders,
      staleTime: 1 * 60 * 1000,
    })
  }

  const prefetchPendingOrders = () => {
    queryClient.prefetchQuery({
      queryKey: orderQueryKeys.pending(),
      queryFn: getPendingOrders,
      staleTime: 30 * 1000,
    })
  }

  return {
    prefetchOrders,
    prefetchOrder,
    prefetchTodayOrders,
    prefetchPendingOrders
  }
}