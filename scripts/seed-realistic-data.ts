import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
  connectFirestoreEmulator
} from 'firebase/firestore'
// Removed Firebase Auth imports as we now use Google OAuth only
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
})

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Connect to emulator if running locally
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.log('Connected to Firebase emulators')
  } catch (error) {
    console.log('Emulators already connected or not available')
  }
}

async function seedDatabase() {
  try {
    console.log('Starting comprehensive database seed...')

    // First, let's seed data without authentication for now
    const batch = writeBatch(db)

    // 1. Seed menu categories
    const categories = [
      {
        id: 'coffee',
        name: 'COFFEE & COCOA',
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'matcha',
        name: 'MATCHA',
        displayOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tea',
        name: 'TEA',
        displayOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'milk-tea',
        name: 'TRÀ SỮA - MILK TEA',
        displayOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'iced-blend',
        name: 'ICED BLEND',
        displayOrder: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'fast-food',
        name: 'FAST FOOD',
        displayOrder: 6,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]

    categories.forEach(category => {
      batch.set(doc(db, 'menu-categories', category.id), category)
    })

    // 2. Seed ingredients for inventory
    const ingredients = [
      {
        id: 'espresso-beans',
        name: 'Espresso Coffee Beans',
        description: 'Premium Arabica coffee beans',
        unit: 'kg',
        currentQuantity: 25,
        minimumThreshold: 5,
        costPerUnit: 280000, // 280k VND per kg
        supplier: 'Coffee Import Co.',
        category: 'beverages',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'matcha-powder',
        name: 'Premium Matcha Powder',
        description: 'Japanese ceremonial grade matcha',
        unit: 'kg',
        currentQuantity: 3,
        minimumThreshold: 1,
        costPerUnit: 1200000, // 1.2M VND per kg
        supplier: 'Tea Masters Ltd',
        category: 'beverages',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'milk',
        name: 'Fresh Milk',
        description: 'Whole milk for drinks',
        unit: 'liter',
        currentQuantity: 50,
        minimumThreshold: 10,
        costPerUnit: 25000, // 25k VND per liter
        supplier: 'Local Dairy',
        category: 'dairy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sugar',
        name: 'Cane Sugar',
        description: 'Organic cane sugar',
        unit: 'kg',
        currentQuantity: 20,
        minimumThreshold: 5,
        costPerUnit: 35000, // 35k VND per kg
        supplier: 'Sugar Corp',
        category: 'other',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tapioca-pearls',
        name: 'Tapioca Pearls',
        description: 'Black tapioca pearls for bubble tea',
        unit: 'kg',
        currentQuantity: 8,
        minimumThreshold: 2,
        costPerUnit: 45000, // 45k VND per kg
        supplier: 'Asian Ingredients',
        category: 'other',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    ingredients.forEach(ingredient => {
      batch.set(doc(db, 'ingredients', ingredient.id), ingredient)
    })

    // 3. Seed option groups for menu customization
    const optionGroups = [
      {
        id: 'size-options',
        name: 'Size',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { name: 'Small (S)', price: 0 },
          { name: 'Medium (M)', price: 5000 },
          { name: 'Large (L)', price: 10000 }
        ],
        connectedMenuItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'sweetness-level',
        name: 'Sweetness Level',
        minSelection: 1,
        maxSelection: 1,
        options: [
          { name: '0% Sugar', price: 0 },
          { name: '25% Sugar', price: 0 },
          { name: '50% Sugar', price: 0 },
          { name: '75% Sugar', price: 0 },
          { name: '100% Sugar', price: 0 }
        ],
        connectedMenuItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'toppings',
        name: 'Toppings',
        minSelection: 0,
        maxSelection: 3,
        options: [
          { name: 'Tapioca Pearls', price: 8000 },
          { name: 'Jelly', price: 6000 },
          { name: 'Extra Cream', price: 5000 },
          { name: 'Coconut Flakes', price: 7000 }
        ],
        connectedMenuItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    optionGroups.forEach(optionGroup => {
      batch.set(doc(db, 'option-groups', optionGroup.id), optionGroup)
    })

    // 4. Seed comprehensive menu items
    const menuItems = [
      {
        id: 'matcha-latte-oat',
        name: 'Matcha Latte Sữa Yến Mạch',
        price: 55000,
        categoryName: 'MATCHA',
        availableStatus: 'AVAILABLE',
        description: 'Premium matcha latte with creamy oat milk, perfect balance of earthy and sweet',
        photos: ['/images/matcha-latte.jpg'],
        optionGroups: [
          {
            name: 'Size',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'Small (S)', price: 0 },
              { name: 'Medium (M)', price: 8000 },
              { name: 'Large (L)', price: 15000 }
            ]
          },
          {
            name: 'Sweetness Level',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: '0% Sugar', price: 0 },
              { name: '50% Sugar', price: 0 },
              { name: '100% Sugar', price: 0 }
            ]
          }
        ],
        recipe: {
          id: 'matcha-latte-recipe',
          name: 'Matcha Latte Recipe',
          ingredients: [
            { ingredientId: 'matcha-powder', quantity: 15, unit: 'gram' },
            { ingredientId: 'milk', quantity: 200, unit: 'ml' },
            { ingredientId: 'sugar', quantity: 10, unit: 'gram' }
          ],
          servingSize: 1,
          costPerServing: 18500
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'vietnamese-iced-coffee',
        name: 'Cà Phê Sữa Đá',
        price: 32000,
        categoryName: 'COFFEE & COCOA',
        availableStatus: 'AVAILABLE',
        description: 'Traditional Vietnamese iced coffee with condensed milk, strong and sweet',
        photos: ['/images/vietnamese-coffee.jpg'],
        optionGroups: [
          {
            name: 'Size',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'Small (S)', price: 0 },
              { name: 'Medium (M)', price: 5000 },
              { name: 'Large (L)', price: 10000 }
            ]
          }
        ],
        recipe: {
          id: 'vietnamese-coffee-recipe',
          name: 'Vietnamese Coffee Recipe',
          ingredients: [
            { ingredientId: 'espresso-beans', quantity: 25, unit: 'gram' },
            { ingredientId: 'milk', quantity: 50, unit: 'ml' },
            { ingredientId: 'sugar', quantity: 15, unit: 'gram' }
          ],
          servingSize: 1,
          costPerServing: 9200
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'classic-milk-tea',
        name: 'Trà Sữa Truyền Thống',
        price: 38000,
        categoryName: 'TRÀ SỮA - MILK TEA',
        availableStatus: 'AVAILABLE',
        description: 'Classic milk tea with black tea base and fresh milk, includes tapioca pearls',
        photos: ['/images/milk-tea.jpg'],
        optionGroups: [
          {
            name: 'Size',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'Medium (M)', price: 0 },
              { name: 'Large (L)', price: 8000 }
            ]
          },
          {
            name: 'Sweetness Level',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: '0% Sugar', price: 0 },
              { name: '25% Sugar', price: 0 },
              { name: '50% Sugar', price: 0 },
              { name: '75% Sugar', price: 0 },
              { name: '100% Sugar', price: 0 }
            ]
          },
          {
            name: 'Toppings',
            minSelection: 0,
            maxSelection: 2,
            options: [
              { name: 'Extra Tapioca', price: 8000 },
              { name: 'Jelly', price: 6000 },
              { name: 'Pudding', price: 10000 }
            ]
          }
        ],
        recipe: {
          id: 'milk-tea-recipe',
          name: 'Milk Tea Recipe',
          ingredients: [
            { ingredientId: 'milk', quantity: 150, unit: 'ml' },
            { ingredientId: 'sugar', quantity: 20, unit: 'gram' },
            { ingredientId: 'tapioca-pearls', quantity: 30, unit: 'gram' }
          ],
          servingSize: 1,
          costPerServing: 12100
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'peach-green-tea',
        name: 'Trà Xanh Đào',
        price: 42000,
        categoryName: 'TEA',
        availableStatus: 'AVAILABLE',
        description: 'Refreshing green tea infused with fresh peach flavor and fruit pieces',
        photos: ['/images/peach-tea.jpg'],
        optionGroups: [
          {
            name: 'Size',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'Medium (M)', price: 0 },
              { name: 'Large (L)', price: 8000 }
            ]
          },
          {
            name: 'Ice Level',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'No Ice', price: 0 },
              { name: 'Less Ice', price: 0 },
              { name: 'Normal Ice', price: 0 },
              { name: 'Extra Ice', price: 0 }
            ]
          }
        ],
        recipe: {
          id: 'peach-tea-recipe',
          name: 'Peach Green Tea Recipe',
          ingredients: [
            { ingredientId: 'sugar', quantity: 15, unit: 'gram' }
          ],
          servingSize: 1,
          costPerServing: 8500
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'iced-americano',
        name: 'Americano Đá',
        price: 28000,
        categoryName: 'COFFEE & COCOA',
        availableStatus: 'AVAILABLE',
        description: 'Classic iced americano with double shot espresso over ice',
        photos: ['/images/americano.jpg'],
        optionGroups: [
          {
            name: 'Size',
            minSelection: 1,
            maxSelection: 1,
            options: [
              { name: 'Small (S)', price: 0 },
              { name: 'Medium (M)', price: 5000 },
              { name: 'Large (L)', price: 10000 }
            ]
          },
          {
            name: 'Extra Shots',
            minSelection: 0,
            maxSelection: 2,
            options: [
              { name: 'Extra Shot', price: 15000 }
            ]
          }
        ],
        recipe: {
          id: 'americano-recipe',
          name: 'Iced Americano Recipe',
          ingredients: [
            { ingredientId: 'espresso-beans', quantity: 20, unit: 'gram' }
          ],
          servingSize: 1,
          costPerServing: 5600
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    menuItems.forEach(item => {
      batch.set(doc(db, 'menu-items', item.id), item)
    })

    // 5. Seed sample customers
    const customers = [
      {
        id: 'customer-1',
        name: 'Nguyễn Văn Quang',
        phone: '0344270427',
        email: 'quang.nguyen@example.com',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        totalOrders: 28,
        totalSpent: 1840000,
        lastOrderDate: new Date('2024-09-28'),
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date()
      },
      {
        id: 'customer-2',
        name: 'Trần Thị Mai',
        phone: '0901234567',
        email: 'mai.tran@example.com',
        address: '456 Lê Lợi, Q3, TP.HCM',
        totalOrders: 15,
        totalSpent: 980000,
        lastOrderDate: new Date('2024-09-29'),
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date()
      },
      {
        id: 'customer-3',
        name: 'Lê Minh Hoàng',
        phone: '0912345678',
        email: 'hoang.le@example.com',
        address: '789 Điện Biên Phủ, Q10, TP.HCM',
        totalOrders: 8,
        totalSpent: 520000,
        lastOrderDate: new Date('2024-09-30'),
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date()
      }
    ]

    customers.forEach(customer => {
      batch.set(doc(db, 'customers', customer.id), customer)
    })

    // 6. Seed sample orders
    const orders = [
      {
        id: 'order-1',
        orderNumber: 'ORD-240930-1425-001',
        customer: {
          id: 'customer-1',
          name: 'Nguyễn Văn Quang',
          phone: '0344270427'
        },
        items: [
          {
            id: 'item-1',
            menuItemId: 'matcha-latte-oat',
            menuItemName: 'Matcha Latte Sữa Yến Mạch',
            basePrice: 55000,
            quantity: 1,
            selectedOptions: [
              { groupName: 'Size', optionName: 'Medium (M)', optionPrice: 8000 },
              { groupName: 'Sweetness Level', optionName: '50% Sugar', optionPrice: 0 }
            ],
            subtotal: 63000
          },
          {
            id: 'item-2',
            menuItemId: 'vietnamese-iced-coffee',
            menuItemName: 'Cà Phê Sữa Đá',
            basePrice: 32000,
            quantity: 1,
            selectedOptions: [
              { groupName: 'Size', optionName: 'Large (L)', optionPrice: 10000 }
            ],
            subtotal: 42000
          }
        ],
        subtotal: 105000,
        deliveryFee: 0,
        discount: 0,
        tax: 10500,
        total: 115500,
        orderType: 'DINE_IN',
        status: 'DELIVERED',
        tableNumber: '05',
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        platform: 'direct',
        assignedStaff: 'staff-1',
        createdAt: new Date('2024-09-30T14:25:00'),
        updatedAt: new Date('2024-09-30T15:10:00'),
        confirmedAt: new Date('2024-09-30T14:26:00'),
        readyAt: new Date('2024-09-30T14:35:00'),
        deliveredAt: new Date('2024-09-30T14:38:00')
      },
      {
        id: 'order-2',
        orderNumber: 'ORD-240930-1530-002',
        customer: {
          id: 'customer-2',
          name: 'Trần Thị Mai',
          phone: '0901234567'
        },
        items: [
          {
            id: 'item-3',
            menuItemId: 'classic-milk-tea',
            menuItemName: 'Trà Sữa Truyền Thống',
            basePrice: 38000,
            quantity: 2,
            selectedOptions: [
              { groupName: 'Size', optionName: 'Large (L)', optionPrice: 8000 },
              { groupName: 'Sweetness Level', optionName: '75% Sugar', optionPrice: 0 },
              { groupName: 'Toppings', optionName: 'Extra Tapioca', optionPrice: 8000 }
            ],
            subtotal: 108000
          }
        ],
        subtotal: 108000,
        deliveryFee: 25000,
        discount: 10000,
        tax: 12300,
        total: 135300,
        orderType: 'DELIVERY',
        status: 'DELIVERED',
        deliveryInfo: {
          address: '456 Lê Lợi, Q3, TP.HCM',
          deliveryFee: 25000,
          estimatedTime: '30-40 minutes',
          driverName: 'Nguyễn Tài',
          driverPhone: '0987654321'
        },
        paymentMethod: 'DIGITAL_WALLET',
        paymentStatus: 'PAID',
        platform: 'shopee',
        platformOrderId: 'SPF-202409301530-456',
        assignedStaff: 'staff-2',
        createdAt: new Date('2024-09-30T15:30:00'),
        updatedAt: new Date('2024-09-30T16:15:00'),
        confirmedAt: new Date('2024-09-30T15:32:00'),
        readyAt: new Date('2024-09-30T15:50:00'),
        deliveredAt: new Date('2024-09-30T16:15:00')
      },
      {
        id: 'order-3',
        orderNumber: 'ORD-241001-0915-003',
        customer: {
          id: 'customer-3',
          name: 'Lê Minh Hoàng',
          phone: '0912345678'
        },
        items: [
          {
            id: 'item-4',
            menuItemId: 'peach-green-tea',
            menuItemName: 'Trà Xanh Đào',
            basePrice: 42000,
            quantity: 1,
            selectedOptions: [
              { groupName: 'Size', optionName: 'Medium (M)', optionPrice: 0 },
              { groupName: 'Ice Level', optionName: 'Less Ice', optionPrice: 0 }
            ],
            subtotal: 42000
          },
          {
            id: 'item-5',
            menuItemId: 'iced-americano',
            menuItemName: 'Americano Đá',
            basePrice: 28000,
            quantity: 1,
            selectedOptions: [
              { groupName: 'Size', optionName: 'Large (L)', optionPrice: 10000 },
              { groupName: 'Extra Shots', optionName: 'Extra Shot', optionPrice: 15000 }
            ],
            subtotal: 53000
          }
        ],
        subtotal: 95000,
        deliveryFee: 0,
        discount: 0,
        tax: 9500,
        total: 104500,
        orderType: 'TAKEAWAY',
        status: 'READY',
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        platform: 'direct',
        assignedStaff: 'staff-1',
        createdAt: new Date('2024-10-01T09:15:00'),
        updatedAt: new Date('2024-10-01T09:30:00'),
        confirmedAt: new Date('2024-10-01T09:16:00'),
        readyAt: new Date('2024-10-01T09:30:00')
      }
    ]

    orders.forEach(order => {
      batch.set(doc(db, 'orders', order.id), order)
    })

    // 7. Seed employees
    const employees = [
      {
        id: 'employee-1',
        name: 'Nguyễn Thị Lan',
        phone: '0933123456',
        email: 'lan.nguyen@dinhbarista.com',
        position: 'Barista',
        role: 'staff',
        salary: 8500000,
        startDate: new Date('2024-06-01'),
        status: 'ACTIVE',
        shift: 'morning',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'employee-2',
        name: 'Trần Văn Minh',
        phone: '0944234567',
        email: 'minh.tran@dinhbarista.com',
        position: 'Shift Supervisor',
        role: 'manager',
        salary: 12000000,
        startDate: new Date('2024-05-15'),
        status: 'ACTIVE',
        shift: 'afternoon',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'employee-3',
        name: 'Lê Thị Hoa',
        phone: '0955345678',
        email: 'hoa.le@dinhbarista.com',
        position: 'Cashier',
        role: 'staff',
        salary: 7800000,
        startDate: new Date('2024-07-01'),
        status: 'ACTIVE',
        shift: 'evening',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    employees.forEach(employee => {
      batch.set(doc(db, 'employees', employee.id), employee)
    })

    // 8. Seed user auth documents (for Google OAuth)
    // Note: These UIDs are examples - actual UIDs will be generated by Google OAuth
    const users = [
      {
        uid: 'google-admin-example-uid',
        email: 'admin@oishimenu.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'google-manager-example-uid',
        email: 'manager@oishimenu.com',
        name: 'Manager User',
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'google-staff-example-uid',
        email: 'staff@oishimenu.com',
        name: 'Staff User',
        role: 'staff',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    users.forEach(user => {
      batch.set(doc(db, 'users', user.uid), user)
    })

    // 9. Seed feedback/reviews
    const feedback = [
      {
        id: 'feedback-1',
        customerId: 'customer-1',
        customerName: 'Nguyễn Văn Quang',
        orderId: 'order-1',
        rating: 5,
        comment: 'Matcha latte rất ngon, vị đậm đà và không quá ngọt. Nhân viên phục vụ nhiệt tình!',
        category: 'service',
        status: 'published',
        response: 'Cảm ơn anh Quang đã ủng hộ! Chúng tôi sẽ tiếp tục cải thiện chất lượng phục vụ.',
        respondedBy: 'employee-2',
        respondedAt: new Date('2024-10-01T10:00:00'),
        createdAt: new Date('2024-09-30T20:00:00'),
        updatedAt: new Date('2024-10-01T10:00:00')
      },
      {
        id: 'feedback-2',
        customerId: 'customer-2',
        customerName: 'Trần Thị Mai',
        orderId: 'order-2',
        rating: 4,
        comment: 'Trà sữa ngon, giao hàng đúng giờ. Chỉ có điều muốn có thêm lựa chọn topping.',
        category: 'product',
        status: 'published',
        response: 'Cảm ơn chị Mai! Chúng tôi sẽ bổ sung thêm nhiều loại topping trong thời gian tới.',
        respondedBy: 'employee-2',
        respondedAt: new Date('2024-10-01T11:00:00'),
        createdAt: new Date('2024-09-30T21:30:00'),
        updatedAt: new Date('2024-10-01T11:00:00')
      },
      {
        id: 'feedback-3',
        customerId: 'customer-3',
        customerName: 'Lê Minh Hoàng',
        rating: 3,
        comment: 'Americano ổn nhưng hơi nhạt. Không gian quán đẹp, phù hợp làm việc.',
        category: 'product',
        status: 'pending',
        createdAt: new Date('2024-10-01T12:00:00'),
        updatedAt: new Date('2024-10-01T12:00:00')
      }
    ]

    feedback.forEach(review => {
      batch.set(doc(db, 'feedback', review.id), review)
    })

    // Commit all data
    await batch.commit()
    console.log('✅ Comprehensive database seeded successfully!')

    console.log('\n📊 Summary:')
    console.log(`- ${categories.length} menu categories`)
    console.log(`- ${ingredients.length} ingredients`)
    console.log(`- ${optionGroups.length} option groups`)
    console.log(`- ${menuItems.length} menu items`)
    console.log(`- ${customers.length} customers`)
    console.log(`- ${orders.length} orders`)
    console.log(`- ${employees.length} employees`)
    console.log(`- ${feedback.length} feedback entries`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()