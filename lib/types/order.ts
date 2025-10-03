export interface OrderItem {
  id: string
  menuItemId: string
  menuItemName: string
  basePrice: number
  quantity: number
  selectedOptions: SelectedOption[]
  subtotal: number
  notes?: string
}

export interface SelectedOption {
  groupName: string
  optionName: string
  optionPrice: number
}

export interface Customer {
  id?: string
  name: string
  phone: string
  email?: string
  address?: string
}

export interface DeliveryInfo {
  address: string
  deliveryFee: number
  estimatedTime?: string
  driverName?: string
  driverPhone?: string
}

export type OrderStatus =
  | 'PENDING'           // New order, not yet confirmed
  | 'CONFIRMED'         // Order confirmed by restaurant
  | 'PREPARING'         // Food is being prepared
  | 'READY'             // Food ready for pickup/delivery
  | 'OUT_FOR_DELIVERY'  // Driver is on the way
  | 'DELIVERED'         // Order completed successfully
  | 'CANCELLED'         // Order was cancelled
  | 'FAILED'            // Order failed (payment, delivery, etc.)

export type OrderType =
  | 'DINE_IN'          // Customer dining at restaurant
  | 'TAKEAWAY'         // Customer pickup
  | 'DELIVERY'         // Home/office delivery

export type PaymentStatus =
  | 'PENDING'          // Payment not yet processed
  | 'PAID'             // Payment successful
  | 'FAILED'           // Payment failed
  | 'REFUNDED'         // Payment was refunded

export type PaymentMethod =
  | 'CASH'             // Cash payment
  | 'CARD'             // Credit/debit card
  | 'DIGITAL_WALLET'   // Mobile payment (GrabPay, etc.)
  | 'BANK_TRANSFER'    // Bank transfer

export interface Order {
  id: string
  orderNumber: string          // Human-readable order number (e.g., "ORD-001")

  // Customer information
  customer: Customer

  // Order details
  items: OrderItem[]
  subtotal: number             // Sum of all item subtotals
  deliveryFee: number          // Delivery fee (0 for dine-in/takeaway)
  discount: number             // Applied discounts
  tax: number                  // Tax amount
  total: number                // Final amount to pay

  // Order metadata
  orderType: OrderType
  status: OrderStatus
  notes?: string               // Special instructions

  // Payment information
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  paymentId?: string           // Payment processor transaction ID

  // Delivery information (only for delivery orders)
  deliveryInfo?: DeliveryInfo

  // Table information (only for dine-in orders)
  tableNumber?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date           // When restaurant confirmed the order
  readyAt?: Date               // When food was ready
  deliveredAt?: Date           // When order was completed

  // Platform integration
  platform?: string           // 'grab', 'shopee', 'direct', etc.
  platformOrderId?: string    // Original platform order ID

  // Staff handling
  assignedStaff?: string       // Staff member handling the order
}

export interface OrderFilter {
  status?: OrderStatus[]
  orderType?: OrderType[]
  paymentStatus?: PaymentStatus[]
  dateFrom?: Date
  dateTo?: Date
  customerPhone?: string
  orderNumber?: string
  platform?: string
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<OrderStatus, number>
  ordersByType: Record<OrderType, number>
  topItems: Array<{
    menuItemName: string
    quantity: number
    revenue: number
  }>
}

export interface PaginatedOrdersResult {
  orders: Order[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// For real-time order tracking
export interface OrderUpdate {
  orderId: string
  status: OrderStatus
  timestamp: Date
  message?: string
  updatedBy?: string
}