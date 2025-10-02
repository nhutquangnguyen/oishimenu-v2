#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, writeBatch, Timestamp } from 'firebase/firestore'
import type { MenuItem, MenuCategory, OptionGroup, MenuOption } from '../lib/types/menu'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

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
      console.warn('Invalid option group format:', optionGroupString)
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

    console.log(`✅ Processing item: ${itemName} (${itemID})`)

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

    // Create valid Firestore document ID (remove any invalid characters)
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
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    }

    return menuItem
  } catch (error) {
    console.error('Error converting CSV row to menu item:', error, row)
    return null
  }
}

async function importMenuFromCSV(csvFilePath: string) {
  console.log('🚀 Starting CSV import from:', csvFilePath)

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found: ${csvFilePath}`)
  }

  const csvContent = fs.readFileSync(csvFilePath, 'utf-8')

  return new Promise<void>((resolve, reject) => {
    const menuItems: MenuItem[] = []
    const categories = new Set<string>()

    parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }, async (err, records: CSVRow[]) => {
      if (err) {
        reject(err)
        return
      }

      console.log(`📊 Processing ${records.length} CSV records...`)

      // Convert CSV records to menu items
      for (const record of records) {
        const menuItem = csvRowToMenuItem(record)
        if (menuItem) {
          menuItems.push(menuItem)
          categories.add(menuItem.categoryName)
        }
      }

      console.log(`✅ Converted ${menuItems.length} valid menu items`)
      console.log(`📂 Found ${categories.size} categories:`, Array.from(categories))

      try {
        // Create categories first
        console.log('📝 Creating categories...')
        const categoryPromises = Array.from(categories).map(async (categoryName) => {
          // Create valid Firestore document ID for category
          const categoryId = categoryName
            .toLowerCase()
            .replace(/[\/\\\.\#\$\[\]\s-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')

          const category: MenuCategory = {
            id: categoryId,
            name: categoryName,
            displayOrder: 0,
            isActive: true,
            createdAt: Timestamp.now().toDate(),
            updatedAt: Timestamp.now().toDate()
          }

          await setDoc(doc(db, 'menuCategories', categoryId), category)
          console.log(`  ✅ Created category: ${categoryName} (ID: ${categoryId})`)
        })

        await Promise.all(categoryPromises)

        // Import menu items in batches
        console.log('📝 Importing menu items...')
        const batchSize = 500 // Firestore batch limit
        const batches = []

        for (let i = 0; i < menuItems.length; i += batchSize) {
          const batch = writeBatch(db)
          const batchItems = menuItems.slice(i, i + batchSize)

          for (const item of batchItems) {
            // Clean the item data for Firestore
            const cleanItem = {
              ...item,
              // Remove any undefined or null values that could cause issues
              description: item.description || '',
              photos: item.photos.filter(photo => photo && photo.trim() !== ''),
              optionGroups: item.optionGroups.map(group => ({
                ...group,
                name: group.name.trim(),
                options: group.options.map(option => ({
                  name: option.name.trim(),
                  price: Number(option.price) || 0
                }))
              }))
            }

            const docRef = doc(db, 'menuItems', item.id)
            batch.set(docRef, cleanItem)
          }

          batches.push(batch.commit())
          console.log(`  📦 Prepared batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(menuItems.length / batchSize)}`)
        }

        await Promise.all(batches)

        console.log('🎉 CSV import completed successfully!')
        console.log(`📊 Final stats:`)
        console.log(`   Categories: ${categories.size}`)
        console.log(`   Menu Items: ${menuItems.length}`)

        // Display sample items
        console.log(`\n📋 Sample imported items:`)
        menuItems.slice(0, 3).forEach(item => {
          console.log(`   • ${item.name} - ${item.price.toLocaleString('vi-VN')} VND`)
          console.log(`     Category: ${item.categoryName}`)
          console.log(`     Options: ${item.optionGroups.length} groups`)
        })

        resolve()
      } catch (error) {
        console.error('❌ Error importing to Firebase:', error)
        reject(error)
      }
    })
  })
}

// Main execution
async function main() {
  const csvFilePath = process.argv[2] || '/Users/macbook/Downloads/5-C7LJTXBYA7CWNA_20251001_c0ae8db383364a12ae120be7c313a07a/5-C7LJTXBYA7CWNA_20251001_c0ae8db383364a12ae120be7c313a07a.csv'

  try {
    await importMenuFromCSV(csvFilePath)
    process.exit(0)
  } catch (error) {
    console.error('💥 Import failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

export { importMenuFromCSV }