import { NextRequest, NextResponse } from 'next/server'
import type { MenuItem, MenuCategory, OptionGroup, MenuOption } from '@/lib/types/menu'

interface CSVRow {
  '﻿*ItemID': string  // Note: BOM character ﻿ at the beginning
  '*ItemName': string
  '*Price': string
  '*CategoryName': string
  'AvailabilitySchedule': string
  '*AvailableStatus': string
  'Description': string
  'Photo1': string
  'Photo2': string
  'Photo3': string
  'Photo4': string
  'OptionGroup1': string
  'OptionGroup2': string
  'OptionGroup3': string
  'OptionGroup4': string
  'OptionGroup5': string
  'OptionGroup6': string
}

function parseOptionGroup(optionGroupString: string): OptionGroup | null {
  if (!optionGroupString || optionGroupString.trim() === '') {
    return null
  }

  try {
    // Format: "Name##MinSelection-MaxSelection##OptionName1:Price#OptionName2:Price"
    // Example: "Đá##0-1##Để riêng:0"
    // Example: "Topping##0-10##Tàu hủ:10000#Trân châu đen:7000#Trân châu trắng:7000"

    const parts = optionGroupString.split('##')
    if (parts.length < 3) {
      return null
    }

    const name = parts[0].trim()
    const selectionRange = parts[1].split('-')
    const minSelection = parseInt(selectionRange[0])
    const maxSelection = parseInt(selectionRange[1])

    const optionsString = parts[2]
    const options: MenuOption[] = []

    if (optionsString) {
      const optionPairs = optionsString.split('#')
      for (const pair of optionPairs) {
        const [optionName, priceStr] = pair.split(':')
        if (optionName && priceStr !== undefined) {
          options.push({
            name: optionName.trim(),
            price: parseInt(priceStr) || 0
          })
        }
      }
    }

    return {
      name,
      minSelection,
      maxSelection,
      options
    }
  } catch (error) {
    console.error('Error parsing option group:', optionGroupString, error)
    return null
  }
}

function csvRowToMenuItem(row: CSVRow): MenuItem | null {
  try {
    // Use the correct key with BOM character
    const itemID = row['﻿*ItemID']?.trim()
    const itemName = row['*ItemName']?.trim()
    const price = row['*Price']?.trim()
    const categoryName = row['*CategoryName']?.trim()

    // Skip header rows, documentation rows, and invalid data
    if (!itemID || !itemName || !price || !categoryName ||
        itemID.includes('ItemID') ||
        itemID.includes('Unique ID') ||
        itemID.includes('[Please refrain') ||
        price.includes('Price') ||
        !itemID.startsWith('VNITE')) {
      return null
    }

    const photos = [row.Photo1, row.Photo2, row.Photo3, row.Photo4]
      .filter(photo => photo && photo.trim() !== '')

    const optionGroups = [
      row.OptionGroup1,
      row.OptionGroup2,
      row.OptionGroup3,
      row.OptionGroup4,
      row.OptionGroup5,
      row.OptionGroup6
    ]
      .map(parseOptionGroup)
      .filter((group): group is OptionGroup => group !== null)

    // Create valid document ID
    const sanitizedID = itemID.replace(/[\/\\\.\#\$\[\]]/g, '_')

    const menuItem: MenuItem = {
      id: sanitizedID,
      name: itemName,
      price: parseInt(price) || 0,
      categoryName: categoryName,
      availableStatus: (row['*AvailableStatus']?.trim() as MenuItem['availableStatus']) || 'AVAILABLE',
      description: row.Description?.trim() || '',
      photos: photos,
      optionGroups: optionGroups,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return menuItem
  } catch (error) {
    console.error('Error converting CSV row to menu item:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { csvData } = await request.json()

    if (!csvData) {
      return NextResponse.json({ error: 'CSV data is required' }, { status: 400 })
    }

    console.log('📊 Processing CSV data for import...')

    // Parse CSV data (assume it's already parsed as JSON array)
    const csvRows = csvData as CSVRow[]
    const menuItems: MenuItem[] = []
    const categories = new Set<string>()

    // Convert CSV records to menu items
    for (const record of csvRows) {
      const menuItem = csvRowToMenuItem(record)
      if (menuItem) {
        menuItems.push(menuItem)
        categories.add(menuItem.categoryName)
      }
    }

    console.log(`✅ Converted ${menuItems.length} valid menu items`)
    console.log(`📂 Found ${categories.size} categories`)

    // Use the existing Firebase services to import data
    const { createMenuCategory } = await import('@/lib/services/menu')
    const { createMenuItem } = await import('@/lib/services/menu')

    // Create categories first
    console.log('📝 Creating categories...')
    for (const categoryName of categories) {
      try {
        const categoryId = categoryName
          .toLowerCase()
          .replace(/[\/\\\.\#\$\[\]\s-]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')

        const category: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'> = {
          name: categoryName,
          displayOrder: 0,
          isActive: true
        }

        await createMenuCategory(category)
        console.log(`  ✅ Created category: ${categoryName}`)
      } catch (error) {
        console.error(`  ❌ Failed to create category: ${categoryName}`, error)
      }
    }

    // Import menu items
    console.log('📝 Importing menu items...')
    let successCount = 0
    let errorCount = 0

    for (const item of menuItems) {
      try {
        const itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
          name: item.name,
          price: item.price,
          categoryName: item.categoryName,
          availableStatus: item.availableStatus,
          description: item.description,
          photos: item.photos,
          optionGroups: item.optionGroups
        }

        await createMenuItem(itemData)
        successCount++

        if (successCount % 10 === 0) {
          console.log(`  📦 Imported ${successCount}/${menuItems.length} items...`)
        }
      } catch (error) {
        console.error(`  ❌ Failed to import item: ${item.name}`, error)
        errorCount++
      }
    }

    console.log('🎉 CSV import completed!')
    console.log(`📊 Final stats:`)
    console.log(`   Categories: ${categories.size}`)
    console.log(`   Menu Items: ${successCount} successful, ${errorCount} failed`)

    return NextResponse.json({
      success: true,
      stats: {
        categories: categories.size,
        menuItemsSuccess: successCount,
        menuItemsError: errorCount,
        totalProcessed: menuItems.length
      }
    })

  } catch (error) {
    console.error('❌ Import API error:', error)
    return NextResponse.json(
      { error: 'Failed to import menu data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}