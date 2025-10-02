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
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuItem, MenuCategory, MenuFilter, OptionGroup, MenuOption } from '@/lib/types/menu';
import { calculateRecipeCost } from '@/lib/services/inventory';

/**
 * Fetch all menu categories
 */
export async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning empty categories');
      return [];
    }

    const categoriesQuery = query(
      collection(db, 'menu-categories'),
      orderBy('displayOrder', 'asc')
    );

    const snapshot = await getDocs(categoriesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuCategory));
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
}

/**
 * Fetch menu items with optional filtering
 */
export async function getMenuItems(filter?: MenuFilter): Promise<MenuItem[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning empty menu items');
      return [];
    }

    let menuQuery = collection(db, 'menu-items');
    let queryConstraints: any[] = [];

    // Apply filters
    if (filter?.categories && filter.categories.length > 0) {
      queryConstraints.push(where('categoryName', 'in', filter.categories));
    }

    if (filter?.availableOnly) {
      queryConstraints.push(where('availableStatus', '==', 'AVAILABLE'));
    }

    // Apply sorting
    if (filter?.sortBy === 'name') {
      queryConstraints.push(orderBy('name', filter.sortOrder || 'asc'));
    } else if (filter?.sortBy === 'price') {
      queryConstraints.push(orderBy('price', filter.sortOrder || 'asc'));
    } else {
      // Default sort by name
      queryConstraints.push(orderBy('name', 'asc'));
    }

    const finalQuery = queryConstraints.length > 0
      ? query(menuQuery, ...queryConstraints)
      : menuQuery;

    const snapshot = await getDocs(finalQuery);
    let items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as MenuItem));

    // Apply client-side filters that can't be done in Firestore
    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.categoryName.toLowerCase().includes(searchLower)
      );
    }

    if (filter?.priceRange) {
      items = items.filter(item =>
        item.price >= filter.priceRange!.min &&
        item.price <= filter.priceRange!.max
      );
    }

    return items;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(categoryName: string): Promise<MenuItem[]> {
  return getMenuItems({
    categories: [categoryName],
    availableOnly: true
  });
}

/**
 * Get a single menu item by ID
 */
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    if (!db) {
      console.warn('Firestore not available');
      return null;
    }

    const docRef = doc(db, 'menu-items', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(),
      } as MenuItem;
    }

    return null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return null;
  }
}

/**
 * Add a new menu category
 */
export async function addMenuCategory(category: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const categoryData = {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'menu-categories'), categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu category:', error);
    return null;
  }
}

/**
 * Add a new menu item
 */
export async function addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const itemData = {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'menu-items'), itemData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    return null;
  }
}

// Aliases for consistency
export const createMenuCategory = addMenuCategory;
export const createMenuItem = addMenuItem;

/**
 * Update a menu item
 */
export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'menu-items', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error updating menu item:', error);
    return false;
  }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'menu-items', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
}

/**
 * Update a menu category
 */
export async function updateMenuCategory(id: string, updates: Partial<MenuCategory>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'menu-categories', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error updating menu category:', error);
    return false;
  }
}

/**
 * Delete a menu category
 */
export async function deleteMenuCategory(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'menu-categories', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting menu category:', error);
    return false;
  }
}

/**
 * Update multiple category orders
 */
export async function updateCategoryOrders(categories: Array<{id: string, displayOrder: number}>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    // Update all categories in parallel
    const updatePromises = categories.map(async (category) => {
      const docRef = doc(db, 'menu-categories', category.id);
      return updateDoc(docRef, {
        displayOrder: category.displayOrder,
        updatedAt: new Date(),
      });
    });

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error updating category orders:', error);
    return false;
  }
}

/**
 * Calculate the cost of a single menu option including its recipe
 */
export async function calculateOptionCost(option: MenuOption): Promise<number> {
  try {
    if (option.recipe) {
      return await calculateRecipeCost(option.recipe);
    }
    return 0;
  } catch (error) {
    console.error('Error calculating option cost:', error);
    return 0;
  }
}

/**
 * Calculate the total cost of an option group (all options combined)
 */
export async function calculateOptionGroupCost(optionGroup: OptionGroup): Promise<number> {
  try {
    let totalCost = 0;
    for (const option of optionGroup.options) {
      const optionCost = await calculateOptionCost(option);
      totalCost += optionCost;
    }
    return totalCost;
  } catch (error) {
    console.error('Error calculating option group cost:', error);
    return 0;
  }
}

/**
 * Calculate the total cost of a menu item including its base recipe and all option recipes
 */
export async function calculateMenuItemTotalCost(menuItem: MenuItem): Promise<{
  baseCost: number;
  optionCosts: { [optionGroupName: string]: number };
  totalCost: number;
}> {
  try {
    let baseCost = 0;

    // Calculate base cost from menu item recipe(s)
    if (menuItem.sizes && menuItem.sizes.length > 0) {
      // For items with multiple sizes, calculate average cost or use default size
      const defaultSize = menuItem.sizes.find(size => size.size === menuItem.defaultSize) || menuItem.sizes[0];
      if (defaultSize?.recipe) {
        baseCost = await calculateRecipeCost(defaultSize.recipe);
      }
    } else if (menuItem.recipe) {
      // Legacy single recipe
      baseCost = await calculateRecipeCost(menuItem.recipe);
    }

    // Calculate option costs
    const optionCosts: { [optionGroupName: string]: number } = {};
    let totalOptionCost = 0;

    if (menuItem.optionGroups) {
      for (const optionGroup of menuItem.optionGroups) {
        const groupCost = await calculateOptionGroupCost(optionGroup);
        optionCosts[optionGroup.name] = groupCost;
        totalOptionCost += groupCost;
      }
    }

    return {
      baseCost,
      optionCosts,
      totalCost: baseCost + totalOptionCost
    };
  } catch (error) {
    console.error('Error calculating menu item total cost:', error);
    return {
      baseCost: 0,
      optionCosts: {},
      totalCost: 0
    };
  }
}

/**
 * Calculate the cost for a specific menu item configuration (specific size + selected options)
 */
export async function calculateMenuItemConfigurationCost(
  menuItem: MenuItem,
  sizeOption?: string,
  selectedOptions?: { [optionGroupName: string]: string[] }
): Promise<number> {
  try {
    let totalCost = 0;

    // Calculate base cost for selected size
    if (menuItem.sizes && menuItem.sizes.length > 0) {
      const selectedSize = menuItem.sizes.find(size => size.size === sizeOption) || menuItem.sizes[0];
      if (selectedSize?.recipe) {
        totalCost += await calculateRecipeCost(selectedSize.recipe);
      }
    } else if (menuItem.recipe) {
      // Legacy single recipe
      totalCost += await calculateRecipeCost(menuItem.recipe);
    }

    // Calculate cost for selected options
    if (selectedOptions && menuItem.optionGroups) {
      for (const optionGroup of menuItem.optionGroups) {
        const selectedOptionNames = selectedOptions[optionGroup.name] || [];
        for (const optionName of selectedOptionNames) {
          const option = optionGroup.options.find(opt => opt.name === optionName);
          if (option) {
            totalCost += await calculateOptionCost(option);
          }
        }
      }
    }

    return totalCost;
  } catch (error) {
    console.error('Error calculating menu item configuration cost:', error);
    return 0;
  }
}

/**
 * Get mock data for development/fallback
 */
export function getMockMenuData(): { categories: MenuCategory[], items: MenuItem[] } {
  const categories: MenuCategory[] = [
    {
      id: 'category-coffee',
      name: 'Cà Phê - Coffee',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'category-milk-tea',
      name: 'Trà Sữa',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'category-tea',
      name: 'Trà - Tea',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const items: MenuItem[] = [
    {
      id: 'item-1',
      name: 'Cà Phê Sữa Đá',
      price: 25000,
      categoryName: 'Cà Phê - Coffee',
      availableStatus: 'AVAILABLE',
      description: 'Cà phê phin truyền thống với sữa đặc và đá',
      photos: [],
      optionGroups: [
        {
          name: 'Kích cỡ',
          minSelection: 1,
          maxSelection: 1,
          options: [
            { name: 'Size M', price: 0 },
            { name: 'Size L', price: 5000 },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'item-2',
      name: 'Trà Sữa Trân Châu',
      price: 35000,
      categoryName: 'Trà Sữa',
      availableStatus: 'AVAILABLE',
      description: 'Trà sữa đậm đà với trân châu đen dai ngon',
      photos: [],
      optionGroups: [
        {
          name: 'Kích cỡ',
          minSelection: 1,
          maxSelection: 1,
          options: [
            { name: 'Size M', price: 0 },
            { name: 'Size L', price: 5000 },
          ],
        },
        {
          name: 'Độ ngọt',
          minSelection: 1,
          maxSelection: 1,
          options: [
            { name: 'Bình thường', price: 0 },
            { name: 'Ít ngọt', price: 0 },
            { name: 'Không đường', price: 0 },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'item-3',
      name: 'Trà Đào Cam Sả',
      price: 30000,
      categoryName: 'Trà - Tea',
      availableStatus: 'AVAILABLE',
      description: 'Trà trái cây tươi mát với đào, cam và sả thơm',
      photos: [],
      optionGroups: [
        {
          name: 'Kích cỡ',
          minSelection: 1,
          maxSelection: 1,
          options: [
            { name: 'Size M', price: 0 },
            { name: 'Size L', price: 5000 },
          ],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return { categories, items };
}