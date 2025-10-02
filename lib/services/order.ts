import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderFilter, OrderStats, OrderStatus } from '@/lib/types/order';

/**
 * Generate a human-readable order number
 */
function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString().slice(-2) +
                  (now.getMonth() + 1).toString().padStart(2, '0') +
                  now.getDate().toString().padStart(2, '0');
  const timeStr = now.getHours().toString().padStart(2, '0') +
                  now.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');

  return `ORD-${dateStr}-${timeStr}-${random}`;
}

/**
 * Fetch orders with optional filtering
 */
export async function getOrders(filter?: OrderFilter): Promise<Order[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning empty orders');
      return [];
    }

    let ordersQuery = collection(db, 'orders');
    let queryConstraints: any[] = [];

    // Apply filters
    if (filter?.status && filter.status.length > 0) {
      queryConstraints.push(where('status', 'in', filter.status));
    }

    if (filter?.orderType && filter.orderType.length > 0) {
      queryConstraints.push(where('orderType', 'in', filter.orderType));
    }

    if (filter?.paymentStatus && filter.paymentStatus.length > 0) {
      queryConstraints.push(where('paymentStatus', 'in', filter.paymentStatus));
    }

    if (filter?.dateFrom) {
      queryConstraints.push(where('createdAt', '>=', Timestamp.fromDate(filter.dateFrom)));
    }

    if (filter?.dateTo) {
      queryConstraints.push(where('createdAt', '<=', Timestamp.fromDate(filter.dateTo)));
    }

    if (filter?.customerPhone) {
      queryConstraints.push(where('customer.phone', '==', filter.customerPhone));
    }

    if (filter?.orderNumber) {
      queryConstraints.push(where('orderNumber', '==', filter.orderNumber));
    }

    if (filter?.platform) {
      queryConstraints.push(where('platform', '==', filter.platform));
    }

    // Default sorting by creation date (newest first)
    queryConstraints.push(orderBy('createdAt', 'desc'));

    // Apply limit
    if (filter?.limit) {
      queryConstraints.push(firestoreLimit(filter.limit));
    }

    const finalQuery = queryConstraints.length > 0
      ? query(ordersQuery, ...queryConstraints)
      : query(ordersQuery, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(finalQuery);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      confirmedAt: doc.data().confirmedAt?.toDate?.() || undefined,
      readyAt: doc.data().readyAt?.toDate?.() || undefined,
      deliveredAt: doc.data().deliveredAt?.toDate?.() || undefined,
    } as Order));

  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(id: string): Promise<Order | null> {
  try {
    if (!db) {
      console.warn('Firestore not available');
      return null;
    }

    const docRef = doc(db, 'orders', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(),
        confirmedAt: snapshot.data().confirmedAt?.toDate?.() || undefined,
        readyAt: snapshot.data().readyAt?.toDate?.() || undefined,
        deliveredAt: snapshot.data().deliveredAt?.toDate?.() || undefined,
      } as Order;
    }

    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const orderNumber = generateOrderNumber();
    const now = new Date();

    const order = {
      ...orderData,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

/**
 * Update an order
 */
export async function updateOrder(id: string, updates: Partial<Order>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}

/**
 * Update order status with timestamp tracking and inventory deduction
 */
export async function updateOrderStatus(id: string, status: OrderStatus, updatedBy?: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const updates: any = {
      status,
      updatedAt: new Date(),
    };

    // Add timestamp for specific status changes
    if (status === 'CONFIRMED') {
      updates.confirmedAt = new Date();

      // Deduct inventory when order is confirmed
      await processInventoryDeductionForOrder(id);

    } else if (status === 'READY') {
      updates.readyAt = new Date();
    } else if (status === 'DELIVERED') {
      updates.deliveredAt = new Date();
    }

    if (updatedBy) {
      updates.assignedStaff = updatedBy;
    }

    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, updates);

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

/**
 * Process inventory deduction for an order
 */
async function processInventoryDeductionForOrder(orderId: string): Promise<void> {
  try {
    const order = await getOrder(orderId);
    if (!order) {
      console.error('Order not found for inventory deduction:', orderId);
      return;
    }

    // Import the inventory service function
    const { processOrderInventoryDeduction } = await import('@/lib/services/inventory');

    // Convert order items to the format expected by inventory service
    const orderItems = order.items.map(item => ({
      menuItemId: item.menuItemId,
      selectedSize: undefined, // TODO: Extract from selectedOptions if size-based ordering is implemented
      selectedOptions: item.selectedOptions.map(option => ({
        groupName: option.groupName,
        optionName: option.optionName
      })),
      quantity: item.quantity
    }));

    const success = await processOrderInventoryDeduction(orderId, orderItems);

    if (!success) {
      console.error('Failed to process inventory deduction for order:', orderId);
      // TODO: Could create a notification or alert for manual review
    } else {
      console.log('Successfully processed inventory deduction for order:', orderId);
    }

  } catch (error) {
    console.error('Error processing inventory deduction for order:', orderId, error);
  }
}

/**
 * Delete an order
 */
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'orders', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

/**
 * Get orders for today
 */
export async function getTodayOrders(): Promise<Order[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getOrders({
    dateFrom: today,
    dateTo: tomorrow,
    limit: 100
  });
}

/**
 * Get pending orders (orders that need attention)
 */
export async function getPendingOrders(): Promise<Order[]> {
  return getOrders({
    status: ['PENDING', 'CONFIRMED', 'PREPARING'],
    limit: 50
  });
}

/**
 * Get order statistics
 */
export async function getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OrderStats | null> {
  try {
    const orders = await getOrders({
      dateFrom,
      dateTo,
      limit: 1000 // Adjust based on your needs
    });

    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByStatus: {} as Record<OrderStatus, number>,
        ordersByType: {} as Record<any, number>,
        topItems: []
      };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders;

    // Count by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);

    // Count by type
    const ordersByType = orders.reduce((acc, order) => {
      acc[order.orderType] = (acc[order.orderType] || 0) + 1;
      return acc;
    }, {} as Record<any, number>);

    // Calculate top items
    const itemStats = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const key = item.menuItemName;
        if (!acc[key]) {
          acc[key] = { quantity: 0, revenue: 0 };
        }
        acc[key].quantity += item.quantity;
        acc[key].revenue += item.subtotal;
      });
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number }>);

    const topItems = Object.entries(itemStats)
      .map(([menuItemName, stats]) => ({
        menuItemName,
        quantity: stats.quantity,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      ordersByType,
      topItems
    };

  } catch (error) {
    console.error('Error calculating order stats:', error);
    return null;
  }
}

/**
 * Get recent orders for dashboard
 */
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  return getOrders({ limit });
}

/**
 * Search orders by customer phone or order number
 */
export async function searchOrders(searchTerm: string): Promise<Order[]> {
  try {
    // Try to search by order number first
    if (searchTerm.startsWith('ORD-')) {
      const orderByNumber = await getOrders({ orderNumber: searchTerm });
      if (orderByNumber.length > 0) {
        return orderByNumber;
      }
    }

    // Search by customer phone
    const ordersByPhone = await getOrders({ customerPhone: searchTerm });
    return ordersByPhone;

  } catch (error) {
    console.error('Error searching orders:', error);
    return [];
  }
}