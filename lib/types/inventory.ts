// Inventory and ingredient management types

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  unit: 'gram' | 'ml' | 'piece' | 'kg' | 'liter' | 'cup' | 'tablespoon' | 'teaspoon';
  currentQuantity: number;
  minimumThreshold: number;
  costPerUnit: number; // Cost per unit in VND
  supplier?: string;
  category: 'dairy' | 'protein' | 'vegetables' | 'fruits' | 'grains' | 'spices' | 'beverages' | 'other';
  expiryDate?: Date;
  lastRestocked?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions?: string;
  prepTime?: number; // in minutes
  servingSize: number;
  costPerServing?: number; // Calculated from ingredients
  createdAt: Date;
  updatedAt: Date;
}

// Size-based recipe variations
export interface SizeRecipe {
  size: string; // e.g., 'S', 'M', 'L', 'XL'
  multiplier: number; // multiplier for base recipe
  ingredients: RecipeIngredient[]; // override specific ingredients if needed
}

export interface MenuItemRecipe {
  baseRecipe: Recipe;
  sizeVariations?: SizeRecipe[];
}

export interface OptionRecipe {
  optionName: string;
  recipe: Recipe;
}

// Inventory transaction types
export interface InventoryTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'waste' | 'adjustment';
  ingredientId: string;
  quantity: number;
  unit: string;
  cost?: number;
  reason?: string;
  relatedOrderId?: string; // for usage transactions
  relatedMenuItemId?: string; // for usage transactions
  createdBy: string;
  createdAt: Date;
}

// Stock alert types
export interface StockAlert {
  id: string;
  ingredientId: string;
  ingredientName: string;
  currentQuantity: number;
  minimumThreshold: number;
  alertLevel: 'low' | 'critical' | 'out_of_stock';
  isAcknowledged: boolean;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

// Inventory analytics
export interface IngredientUsage {
  ingredientId: string;
  totalUsed: number;
  unit: string;
  totalCost: number;
  period: 'day' | 'week' | 'month';
  date: Date;
}

export interface InventoryReport {
  totalValue: number;
  lowStockItems: number;
  criticalStockItems: number;
  totalIngredients: number;
  mostUsedIngredients: IngredientUsage[];
  costByCategory: { [category: string]: number };
  generatedAt: Date;
}

// Purchase order types
export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: {
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
  }[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate?: Date;
  receivedDate?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory filters and search
export interface InventoryFilter {
  category?: string[];
  lowStock?: boolean;
  active?: boolean;
  searchQuery?: string;
  sortBy?: 'name' | 'quantity' | 'cost' | 'lastRestocked';
  sortOrder?: 'asc' | 'desc';
}