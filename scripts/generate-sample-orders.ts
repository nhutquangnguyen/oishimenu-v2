import { createOrder } from '@/lib/services/order'
import { getMenuItems } from '@/lib/services/menu'
import type { MenuItem } from '@/lib/types/menu'

// Sample customer data
const sampleCustomers = [
  { name: "Nguyễn Văn An", phone: "0901234567" },
  { name: "Trần Thị Bích", phone: "0912345678" },
  { name: "Lê Minh Cường", phone: "0923456789" },
  { name: "Phạm Thị Dung", phone: "0934567890" },
  { name: "Hoàng Văn Em", phone: "0945678901" },
  { name: "Vũ Thị Phương", phone: "0956789012" },
  { name: "Đặng Minh Giang", phone: "0967890123" },
  { name: "Ngô Thị Hạnh", phone: "0978901234" },
  { name: "Bùi Văn Inh", phone: "0989012345" },
  { name: "Đinh Thị Kim", phone: "0990123456" },
  { name: "Lý Văn Long", phone: "0901234568" },
  { name: "Mai Thị Minh", phone: "0912345679" },
  { name: "Cao Văn Nam", phone: "0923456780" },
  { name: "Tô Thị Oanh", phone: "0934567891" },
  { name: "Lưu Văn Phúc", phone: "0945678902" },
]

const orderTypes = ['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const
const paymentMethods = ['CASH', 'CARD', 'DIGITAL_WALLET', 'BANK_TRANSFER'] as const
const paymentStatuses = ['PAID', 'PENDING'] as const

// Helper function to get random element from array
function getRandomElement<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper function to get random number between min and max
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to generate random time during business hours
function getRandomBusinessTime(date: Date): Date {
  const businessStart = 7 // 7 AM
  const businessEnd = 22 // 10 PM

  const hour = getRandomInt(businessStart, businessEnd)
  const minute = getRandomInt(0, 59)

  const orderTime = new Date(date)
  orderTime.setHours(hour, minute, getRandomInt(0, 59))

  return orderTime
}

// Generate order status progression
function generateOrderStatus(orderTime: Date): {
  status: any,
  confirmedAt?: Date,
  readyAt?: Date,
  deliveredAt?: Date
} {
  const now = new Date()
  const timeDiff = now.getTime() - orderTime.getTime()
  const hoursAgo = timeDiff / (1000 * 60 * 60)

  // If order is more than 4 hours old, it should be completed
  if (hoursAgo > 4) {
    const confirmedAt = new Date(orderTime.getTime() + getRandomInt(2, 10) * 60 * 1000) // 2-10 mins after order
    const readyAt = new Date(confirmedAt.getTime() + getRandomInt(10, 30) * 60 * 1000) // 10-30 mins after confirmed
    const deliveredAt = new Date(readyAt.getTime() + getRandomInt(5, 15) * 60 * 1000) // 5-15 mins after ready

    return {
      status: 'DELIVERED',
      confirmedAt,
      readyAt,
      deliveredAt
    }
  }

  // Recent orders might still be in progress
  if (hoursAgo > 2) {
    const confirmedAt = new Date(orderTime.getTime() + getRandomInt(2, 10) * 60 * 1000)
    const readyAt = new Date(confirmedAt.getTime() + getRandomInt(10, 30) * 60 * 1000)

    return {
      status: 'READY',
      confirmedAt,
      readyAt
    }
  }

  if (hoursAgo > 0.5) {
    const confirmedAt = new Date(orderTime.getTime() + getRandomInt(2, 10) * 60 * 1000)

    return {
      status: 'PREPARING',
      confirmedAt
    }
  }

  // Very recent orders
  return {
    status: Math.random() > 0.3 ? 'CONFIRMED' : 'PENDING'
  }
}

// Generate order items based on available menu items
function generateOrderItems(menuItems: MenuItem[]) {
  const itemCount = getRandomInt(1, 4) // 1-4 different items per order
  const selectedItems = []

  for (let i = 0; i < itemCount; i++) {
    const item = getRandomElement(menuItems.filter(item => item.availableStatus === 'AVAILABLE'))
    const quantity = getRandomInt(1, 3)

    // Simple option selection (since we don't have detailed option data)
    const selectedOptions = item.optionGroups.length > 0 ?
      item.optionGroups.slice(0, getRandomInt(0, 2)).map(group => ({
        groupName: group.name,
        optionName: group.options[0]?.name || 'Standard',
        additionalPrice: group.options[0]?.price || 0
      })) : []

    const basePrice = item.price
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.additionalPrice, 0)
    const subtotal = (basePrice + optionsPrice) * quantity

    selectedItems.push({
      menuItemId: item.id,
      menuItemName: item.name,
      basePrice,
      quantity,
      selectedOptions,
      subtotal,
      notes: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Ít đường' : 'Nhiều đá') : undefined
    })
  }

  return selectedItems
}

// Calculate order totals
function calculateOrderTotals(items: any[], orderType: string) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const taxRate = 0.1 // 10% VAT
  const tax = Math.round(subtotal * taxRate)

  let deliveryFee = 0
  if (orderType === 'DELIVERY') {
    deliveryFee = getRandomInt(15000, 25000) // 15k-25k delivery fee
  }

  const total = subtotal + tax + deliveryFee

  return { subtotal, tax, deliveryFee, total }
}

// Generate a single order
async function generateSingleOrder(menuItems: MenuItem[], orderTime: Date) {
  const customer = getRandomElement(sampleCustomers)
  const orderType = getRandomElement(orderTypes)
  const paymentMethod = getRandomElement(paymentMethods)
  const paymentStatus = getRandomElement(paymentStatuses)

  const items = generateOrderItems(menuItems)
  const { subtotal, tax, deliveryFee, total } = calculateOrderTotals(items, orderType)
  const statusData = generateOrderStatus(orderTime)

  // Generate table number for dine-in orders
  const tableNumber = orderType === 'DINE_IN' ? `T${getRandomInt(1, 20).toString().padStart(2, '0')}` : undefined

  // Generate delivery address for delivery orders
  const deliveryAddress = orderType === 'DELIVERY' ? {
    street: `${getRandomInt(100, 999)} Đường ${getRandomElement(['Nguyễn Văn Linh', 'Lê Lợi', 'Trần Hưng Đạo', 'Hai Bà Trưng', 'Nguyễn Huệ'])}`,
    district: getRandomElement(['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận Bình Thạnh']),
    city: 'TP. Hồ Chí Minh',
    note: Math.random() > 0.7 ? 'Gọi trước khi đến' : undefined
  } : undefined

  const orderData = {
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: Math.random() > 0.7 ? `${customer.phone}@gmail.com` : undefined
    },
    items,
    orderType,
    paymentMethod,
    paymentStatus,
    status: statusData.status,
    subtotal,
    tax,
    deliveryFee,
    discount: 0, // Add default discount
    total,
    tableNumber,
    deliveryAddress,
    notes: Math.random() > 0.9 ? 'Khách hàng VIP' : undefined,
    platform: 'POS',
    createdAt: orderTime,
    updatedAt: orderTime,
    confirmedAt: statusData.confirmedAt,
    readyAt: statusData.readyAt,
    deliveredAt: statusData.deliveredAt,
  }

  return orderData
}

// Mock menu items for when Firebase is not available
const mockMenuItems: MenuItem[] = [
  {
    id: 'mock-1',
    name: 'Trà sữa Đính- Đình Milk Tea',
    price: 19000,
    categoryName: 'TRÀ SỮA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Đậm vị trà- Béo vị sữa- KHÔNG bột béo',
    photos: ['/api/placeholder/120/120'],
    optionGroups: [
      {
        id: 'size-1',
        name: 'Size',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { name: 'M', price: 0 },
          { name: 'L', price: 5000 }
        ]
      }
    ]
  },
  {
    id: 'mock-2',
    name: 'Trà sữa Matcha- Matcha Milk Tea',
    price: 29000,
    categoryName: 'TRÀ SỮA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Đậm vị trà- Béo vị sữa- KHÔNG bột béo',
    photos: ['/api/placeholder/120/120'],
    optionGroups: [
      {
        id: 'size-2',
        name: 'Size',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { name: 'M', price: 0 },
          { name: 'L', price: 5000 }
        ]
      }
    ]
  },
  {
    id: 'mock-3',
    name: 'Trà sữa Socola- Chocolate Milk Tea',
    price: 25000,
    categoryName: 'TRÀ SỮA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Đậm vị trà- Béo vị sữa- KHÔNG bột béo',
    photos: ['/api/placeholder/120/120'],
    optionGroups: [
      {
        id: 'size-3',
        name: 'Size',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { name: 'M', price: 0 },
          { name: 'L', price: 5000 }
        ]
      }
    ]
  },
  {
    id: 'mock-4',
    name: 'Cà phê đen',
    price: 15000,
    categoryName: 'COFFEE & COCOA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Cà phê đen truyền thống',
    photos: ['/api/placeholder/120/120'],
    optionGroups: []
  },
  {
    id: 'mock-5',
    name: 'Cà phê sữa',
    price: 18000,
    categoryName: 'COFFEE & COCOA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Cà phê sữa đá',
    photos: ['/api/placeholder/120/120'],
    optionGroups: []
  },
  {
    id: 'mock-6',
    name: 'Trà đá',
    price: 5000,
    categoryName: 'TEA',
    availableStatus: 'AVAILABLE' as const,
    description: 'Trà đá giải khát',
    photos: ['/api/placeholder/120/120'],
    optionGroups: []
  }
]

// Main function to generate orders for the past month
export async function generateSampleOrdersForMonth() {
  console.log('Starting to generate sample orders for the past month...')

  try {
    // Get available menu items
    let menuItems = await getMenuItems({ availableOnly: true })

    if (menuItems.length === 0) {
      console.log('No menu items found in database, using mock data...')
      menuItems = mockMenuItems
    }

    console.log(`Found ${menuItems.length} available menu items`)

    // Generate orders for the past 30 days
    const today = new Date()
    const totalOrders = []

    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const orderDate = new Date(today)
      orderDate.setDate(today.getDate() - daysAgo)

      // Generate 10-15 orders per day
      const ordersPerDay = getRandomInt(10, 15)
      console.log(`Generating ${ordersPerDay} orders for ${orderDate.toDateString()}`)

      const dayOrders = []
      for (let i = 0; i < ordersPerDay; i++) {
        const orderTime = getRandomBusinessTime(orderDate)
        const orderData = await generateSingleOrder(menuItems, orderTime)
        dayOrders.push(orderData)
      }

      // Sort orders by time
      dayOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      totalOrders.push(...dayOrders)
    }

    console.log(`Generated ${totalOrders.length} orders total. Now saving to database...`)

    // Save orders to database in batches
    const batchSize = 10
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < totalOrders.length; i += batchSize) {
      const batch = totalOrders.slice(i, i + batchSize)

      await Promise.all(batch.map(async (orderData) => {
        try {
          const orderId = await createOrder(orderData)
          if (orderId) {
            successCount++
            if (successCount % 50 === 0) {
              console.log(`Successfully created ${successCount} orders...`)
            }
          } else {
            errorCount++
          }
        } catch (error) {
          console.error('Error creating order:', error)
          errorCount++
        }
      }))

      // Small delay between batches to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n=== Order Generation Complete ===')
    console.log(`✅ Successfully created: ${successCount} orders`)
    console.log(`❌ Failed to create: ${errorCount} orders`)
    console.log(`📊 Total generated: ${totalOrders.length} orders`)
    console.log(`📅 Date range: ${new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toDateString()} to ${today.toDateString()}`)

  } catch (error) {
    console.error('Error generating sample orders:', error)
  }
}

// Export for direct execution
if (require.main === module) {
  generateSampleOrdersForMonth()
    .then(() => {
      console.log('Script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Script failed:', error)
      process.exit(1)
    })
}