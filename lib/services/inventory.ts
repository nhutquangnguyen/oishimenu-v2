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
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  Ingredient,
  Recipe,
  InventoryTransaction,
  StockAlert,
  PurchaseOrder,
  InventoryFilter,
  InventoryReport,
  IngredientUsage
} from '@/lib/types/inventory';

/**
 * Ingredient Management
 */
export async function getIngredients(filter?: InventoryFilter): Promise<Ingredient[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning mock ingredients');
      return getMockIngredients();
    }

    let ingredientsQuery = collection(db, 'ingredients');
    let queryConstraints: any[] = [];

    // Apply filters
    if (filter?.category && filter.category.length > 0) {
      queryConstraints.push(where('category', 'in', filter.category));
    }

    if (filter?.active !== undefined) {
      queryConstraints.push(where('isActive', '==', filter.active));
    }

    // Apply sorting
    if (filter?.sortBy === 'name') {
      queryConstraints.push(orderBy('name', filter.sortOrder || 'asc'));
    } else if (filter?.sortBy === 'quantity') {
      queryConstraints.push(orderBy('currentQuantity', filter.sortOrder || 'asc'));
    } else {
      queryConstraints.push(orderBy('name', 'asc'));
    }

    const finalQuery = queryConstraints.length > 0
      ? query(ingredientsQuery, ...queryConstraints)
      : ingredientsQuery;

    const snapshot = await getDocs(finalQuery);
    let ingredients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      expiryDate: doc.data().expiryDate?.toDate?.() || undefined,
      lastRestocked: doc.data().lastRestocked?.toDate?.() || undefined,
    } as Ingredient));

    // Apply client-side filters
    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      ingredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchLower) ||
        ingredient.description?.toLowerCase().includes(searchLower) ||
        ingredient.supplier?.toLowerCase().includes(searchLower)
      );
    }

    if (filter?.lowStock) {
      ingredients = ingredients.filter(ingredient =>
        ingredient.currentQuantity <= ingredient.minimumThreshold
      );
    }

    return ingredients;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return getMockIngredients();
  }
}

export async function getIngredient(id: string): Promise<Ingredient | null> {
  try {
    if (!db) {
      console.warn('Firestore not available');
      return null;
    }

    const docRef = doc(db, 'ingredients', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(),
        expiryDate: snapshot.data().expiryDate?.toDate?.() || undefined,
        lastRestocked: snapshot.data().lastRestocked?.toDate?.() || undefined,
      } as Ingredient;
    }

    return null;
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return null;
  }
}

export async function addIngredient(ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const ingredientData = {
      ...ingredient,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'ingredients'), ingredientData);

    // Check if ingredient is below threshold and create alert if needed
    if (ingredient.currentQuantity <= ingredient.minimumThreshold) {
      await createStockAlert(docRef.id, ingredient.name, ingredient.currentQuantity, ingredient.minimumThreshold);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding ingredient:', error);
    return null;
  }
}

export async function updateIngredient(id: string, updates: Partial<Ingredient>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'ingredients', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    // Check for low stock after update
    if (updates.currentQuantity !== undefined && updates.minimumThreshold !== undefined) {
      if (updates.currentQuantity <= updates.minimumThreshold) {
        const ingredient = await getIngredient(id);
        if (ingredient) {
          await createStockAlert(id, ingredient.name, updates.currentQuantity, updates.minimumThreshold);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return false;
  }
}

export async function deleteIngredient(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'ingredients', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return false;
  }
}

/**
 * Recipe Management
 */
export async function getRecipes(): Promise<Recipe[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning empty recipes');
      return [];
    }

    const recipesQuery = query(collection(db, 'recipes'), orderBy('name', 'asc'));
    const snapshot = await getDocs(recipesQuery);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Recipe));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Stock Alert Management
 */
export async function getStockAlerts(): Promise<StockAlert[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning empty alerts');
      return [];
    }

    const alertsQuery = query(
      collection(db, 'stock-alerts'),
      where('isAcknowledged', '==', false),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(alertsQuery);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      acknowledgedAt: doc.data().acknowledgedAt?.toDate?.() || undefined,
    } as StockAlert));
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    return [];
  }
}

export async function createStockAlert(
  ingredientId: string,
  ingredientName: string,
  currentQuantity: number,
  minimumThreshold: number
): Promise<void> {
  try {
    if (!db) return;

    // Check if alert already exists for this ingredient
    const existingAlertsQuery = query(
      collection(db, 'stock-alerts'),
      where('ingredientId', '==', ingredientId),
      where('isAcknowledged', '==', false)
    );

    const existingAlerts = await getDocs(existingAlertsQuery);
    if (!existingAlerts.empty) {
      // Alert already exists, update it instead
      const alertDoc = existingAlerts.docs[0];
      await updateDoc(doc(db, 'stock-alerts', alertDoc.id), {
        currentQuantity,
        minimumThreshold,
        alertLevel: currentQuantity <= 0 ? 'out_of_stock' : currentQuantity <= minimumThreshold * 0.5 ? 'critical' : 'low'
      });
      return;
    }

    const alertLevel = currentQuantity <= 0 ? 'out_of_stock' :
                      currentQuantity <= minimumThreshold * 0.5 ? 'critical' : 'low';

    const alert: Omit<StockAlert, 'id'> = {
      ingredientId,
      ingredientName,
      currentQuantity,
      minimumThreshold,
      alertLevel,
      isAcknowledged: false,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'stock-alerts'), alert);
  } catch (error) {
    console.error('Error creating stock alert:', error);
  }
}

export async function acknowledgeStockAlert(alertId: string, userId: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'stock-alerts', alertId);
    await updateDoc(docRef, {
      isAcknowledged: true,
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
    });

    return true;
  } catch (error) {
    console.error('Error acknowledging stock alert:', error);
    return false;
  }
}

/**
 * Inventory Transaction Management
 */
export async function recordInventoryTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const transactionData = {
      ...transaction,
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'inventory-transactions'), transactionData);

    // Update ingredient quantity
    const ingredient = await getIngredient(transaction.ingredientId);
    if (ingredient) {
      let newQuantity = ingredient.currentQuantity;

      switch (transaction.type) {
        case 'purchase':
          newQuantity += transaction.quantity;
          break;
        case 'usage':
        case 'waste':
          newQuantity -= transaction.quantity;
          break;
        case 'adjustment':
          newQuantity = transaction.quantity; // Set to exact quantity
          break;
      }

      await updateIngredient(transaction.ingredientId, { currentQuantity: Math.max(0, newQuantity) });
    }

    return true;
  } catch (error) {
    console.error('Error recording inventory transaction:', error);
    return false;
  }
}

/**
 * Recipe cost calculation
 */
export async function calculateRecipeCost(recipe: Recipe): Promise<number> {
  try {
    let totalCost = 0;

    for (const recipeIngredient of recipe.ingredients) {
      // Skip ingredients without valid IDs
      if (!recipeIngredient.ingredientId || recipeIngredient.ingredientId.trim() === '') {
        continue;
      }

      const ingredient = await getIngredient(recipeIngredient.ingredientId);
      if (ingredient) {
        totalCost += recipeIngredient.quantity * ingredient.costPerUnit;
      }
    }

    return totalCost / recipe.servingSize; // Cost per serving
  } catch (error) {
    console.error('Error calculating recipe cost:', error);
    return 0;
  }
}

/**
 * Deduct ingredients for a single recipe
 */
export async function deductIngredientsFromRecipe(recipe: Recipe, servings: number): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const batch = writeBatch(db);
    const transactions: Omit<InventoryTransaction, 'id' | 'createdAt'>[] = [];

    for (const recipeIngredient of recipe.ingredients) {
      // Skip ingredients without valid IDs
      if (!recipeIngredient.ingredientId || recipeIngredient.ingredientId.trim() === '') {
        console.warn('Skipping ingredient with empty ID');
        continue;
      }

      const ingredient = await getIngredient(recipeIngredient.ingredientId);
      if (!ingredient) {
        console.warn(`Ingredient ${recipeIngredient.ingredientId} not found`);
        continue;
      }

      // Calculate total quantity needed (recipe quantity * servings)
      const totalQuantityNeeded = recipeIngredient.quantity * servings;

      // Check if enough stock is available
      if (ingredient.currentQuantity < totalQuantityNeeded) {
        console.warn(`Insufficient stock for ${ingredient.name}. Need: ${totalQuantityNeeded}, Available: ${ingredient.currentQuantity}`);
        // Continue anyway but create alert for out-of-stock
        await createStockAlert(ingredient.id, ingredient.name, 0, ingredient.minimumThreshold);
      }

      // Calculate new quantity (ensure it doesn't go below 0)
      const newQuantity = Math.max(0, ingredient.currentQuantity - totalQuantityNeeded);

      // Prepare batch update for ingredient
      const ingredientRef = doc(db, 'ingredients', ingredient.id);
      batch.update(ingredientRef, {
        currentQuantity: newQuantity,
        updatedAt: new Date()
      });

      // Prepare transaction record
      transactions.push({
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        type: 'usage',
        quantity: totalQuantityNeeded,
        unit: ingredient.unit,
        reason: `Used in recipe: ${recipe.name}`,
        relatedOrderId: undefined, // Will be set by caller if available
        performedBy: 'system'
      });

      // Check if ingredient is now below threshold
      if (newQuantity <= ingredient.minimumThreshold) {
        await createStockAlert(ingredient.id, ingredient.name, newQuantity, ingredient.minimumThreshold);
      }
    }

    // Execute batch update
    await batch.commit();

    // Record all transactions
    for (const transaction of transactions) {
      await addDoc(collection(db, 'inventory-transactions'), {
        ...transaction,
        createdAt: new Date()
      });
    }

    return true;
  } catch (error) {
    console.error('Error deducting ingredients from recipe:', error);
    return false;
  }
}

/**
 * Deduct ingredients for a menu item (with size and options)
 */
export async function deductIngredientsForMenuItem(
  menuItemId: string,
  selectedSize: string | undefined,
  selectedOptions: Array<{ groupName: string; optionName: string }>,
  quantity: number,
  orderId?: string
): Promise<boolean> {
  try {
    // Import getMenuItem here to avoid circular dependency
    const { getMenuItem } = await import('@/lib/services/menu');

    const menuItem = await getMenuItem(menuItemId);
    if (!menuItem) {
      console.error('Menu item not found:', menuItemId);
      return false;
    }

    // Determine which recipe to use based on size
    let recipeToUse: Recipe | undefined;

    if (menuItem.sizes && menuItem.sizes.length > 0) {
      // Multi-size item - find the recipe for the selected size
      const sizeData = menuItem.sizes.find(size =>
        size.size === selectedSize ||
        (selectedSize === undefined && size.size === menuItem.defaultSize)
      );

      if (sizeData && sizeData.recipe) {
        recipeToUse = sizeData.recipe;
      }
    } else if (menuItem.recipe?.baseRecipe) {
      // Legacy single recipe item
      recipeToUse = menuItem.recipe.baseRecipe;
    }

    if (!recipeToUse) {
      console.warn('No recipe found for menu item:', menuItem.name);
      return true; // Not an error - item might not have recipe
    }

    // Deduct ingredients for the main recipe
    const success = await deductIngredientsFromRecipe(recipeToUse, quantity);
    if (!success) {
      return false;
    }

    // Deduct ingredients for selected options (if they have recipes)
    let optionDeductionSuccess = true;
    if (selectedOptions && selectedOptions.length > 0 && menuItem.optionGroups) {
      for (const selectedOption of selectedOptions) {
        // Find the option group
        const optionGroup = menuItem.optionGroups.find(group => group.name === selectedOption.groupName);
        if (optionGroup) {
          // Find the specific option
          const option = optionGroup.options.find(opt => opt.name === selectedOption.optionName);
          if (option && option.recipe) {
            // Deduct ingredients for this option's recipe
            const optionSuccess = await deductIngredientsFromRecipe(option.recipe, quantity);
            if (!optionSuccess) {
              console.error(`Failed to deduct ingredients for option: ${selectedOption.optionName} in group: ${selectedOption.groupName}`);
              optionDeductionSuccess = false;
            } else {
              console.log(`Successfully deducted ingredients for option: ${selectedOption.optionName} (${quantity}x)`);
            }
          }
        }
      }
    }

    if (!optionDeductionSuccess) {
      console.warn(`Some option ingredient deductions failed for ${menuItem.name}`);
      return false;
    }

    console.log(`Successfully deducted ingredients for ${quantity}x ${menuItem.name} (${selectedSize || 'default size'}) with ${selectedOptions.length} options`);
    return true;

  } catch (error) {
    console.error('Error deducting ingredients for menu item:', error);
    return false;
  }
}

/**
 * Process inventory deduction for a complete order
 */
export async function processOrderInventoryDeduction(orderId: string, orderItems: Array<{
  menuItemId: string;
  selectedSize?: string;
  selectedOptions: Array<{ groupName: string; optionName: string }>;
  quantity: number;
}>): Promise<boolean> {
  try {
    let allSuccessful = true;

    for (const item of orderItems) {
      const success = await deductIngredientsForMenuItem(
        item.menuItemId,
        item.selectedSize,
        item.selectedOptions,
        item.quantity,
        orderId
      );

      if (!success) {
        allSuccessful = false;
        console.error(`Failed to deduct ingredients for item: ${item.menuItemId}`);
      }
    }

    if (allSuccessful) {
      console.log(`Successfully processed inventory deduction for order: ${orderId}`);
    } else {
      console.warn(`Some ingredient deductions failed for order: ${orderId}`);
    }

    return allSuccessful;
  } catch (error) {
    console.error('Error processing order inventory deduction:', error);
    return false;
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function deductIngredients(menuItemId: string, optionIds: string[], quantity: number): Promise<boolean> {
  // Convert to new format
  const selectedOptions = optionIds.map(optionId => ({
    groupName: 'legacy',
    optionName: optionId
  }));

  return deductIngredientsForMenuItem(menuItemId, undefined, selectedOptions, quantity);
}

/**
 * Mock data for development
 */
export function getMockIngredients(): Ingredient[] {
  return [
    {
      id: 'ing-1',
      name: 'Cà phê hạt Robusta',
      description: 'Cà phê hạt Robusta cao cấp từ Đắk Lắk',
      unit: 'kg',
      currentQuantity: 15.5,
      minimumThreshold: 5,
      costPerUnit: 180000,
      supplier: 'Trung Nguyên Coffee',
      category: 'beverages',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-2',
      name: 'Sữa đặc có đường',
      description: 'Sữa đặc Ngôi Sao Phương Nam 380g',
      unit: 'piece',
      currentQuantity: 24,
      minimumThreshold: 10,
      costPerUnit: 25000,
      supplier: 'Công ty Sữa Việt Nam',
      category: 'dairy',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-3',
      name: 'Trân châu đen',
      description: 'Trân châu đen Taiwan cao cấp',
      unit: 'kg',
      currentQuantity: 2.5,
      minimumThreshold: 5,
      costPerUnit: 120000,
      supplier: 'Taiwan Pearl Co.',
      category: 'other',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-4',
      name: 'Đá viên',
      description: 'Đá viên sạch đóng túi',
      unit: 'kg',
      currentQuantity: 50,
      minimumThreshold: 20,
      costPerUnit: 3000,
      supplier: 'Công ty Đá Sạch Miền Nam',
      category: 'other',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'ing-5',
      name: 'Đường trắng',
      description: 'Đường cát trắng tinh luyện',
      unit: 'kg',
      currentQuantity: 8,
      minimumThreshold: 15,
      costPerUnit: 25000,
      supplier: 'Đường Biên Hòa',
      category: 'other',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
}