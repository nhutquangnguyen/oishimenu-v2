// Menu data types based on CSV structure
export interface MenuOption {
  name: string;
  price: number;
  recipe?: import('./inventory').Recipe; // Recipe for this option
}

export interface OptionGroup {
  id?: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  options: MenuOption[]; // Legacy embedded options (for backward compatibility)
  optionReferences?: import('./option').OptionReference[]; // New reference-based options
  connectedMenuItems?: string[]; // Array of menu item IDs that this option group is connected to
}

export interface MenuItemSize {
  size: string; // e.g., 'S', 'M', 'L', 'XL'
  price: number; // Price for this size in VND
  recipe?: import('./inventory').Recipe; // Complete recipe for this size
  costPrice?: number; // Calculated cost for this size
}

export interface MenuItem {
  id: string; // ItemID from CSV
  name: string; // ItemName
  price: number; // Base/default price (for backward compatibility)
  categoryName: string; // CategoryName
  availabilitySchedule?: string; // AvailabilitySchedule
  availableStatus: 'AVAILABLE' | 'UNAVAILABLE_TODAY' | 'UNAVAILABLE_PERMANENTLY';
  description?: string; // Description
  photos: string[]; // Photo1, Photo2, Photo3, Photo4
  optionGroups: OptionGroup[]; // OptionGroup1-6
  sizes?: MenuItemSize[]; // Multiple sizes with individual recipes and prices
  defaultSize?: string; // Which size to show by default
  // Legacy fields for backward compatibility
  recipe?: import('./inventory').MenuItemRecipe; // Deprecated: use sizes instead
  costPrice?: number; // Deprecated: use sizes instead
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For displaying menu in UI
export interface MenuDisplayItem extends MenuItem {
  isPopular?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
}

// For cart/order functionality
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: {
    [optionGroupName: string]: MenuOption[];
  };
  totalPrice: number;
}

// CSV parsing interface
export interface CSVMenuItem {
  '﻿*ItemID': string;
  '*ItemName': string;
  '*Price': string;
  '*CategoryName': string;
  'AvailabilitySchedule'?: string;
  '*AvailableStatus': string;
  'Description'?: string;
  'Photo1'?: string;
  'Photo2'?: string;
  'Photo3'?: string;
  'Photo4'?: string;
  'OptionGroup1'?: string;
  'OptionGroup2'?: string;
  'OptionGroup3'?: string;
  'OptionGroup4'?: string;
  'OptionGroup5'?: string;
  'OptionGroup6'?: string;
}

// Database collections
export interface MenuCollections {
  menuItems: 'menu-items';
  categories: 'menu-categories';
}

// Menu management
export interface MenuItemFormData {
  name: string;
  price: number;
  categoryName: string;
  description?: string;
  photos: File[];
  optionGroups: OptionGroup[];
  availableStatus: MenuItem['availableStatus'];
  availabilitySchedule?: string;
}

// Statistics and analytics
export interface MenuAnalytics {
  itemId: string;
  itemName: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating?: number;
  isPopular: boolean;
  lastOrderDate?: Date;
}

// Search and filter
export interface MenuFilter {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  availableOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'name' | 'price' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Menu configuration
export interface RestaurantMenuConfig {
  restaurantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  operatingHours: {
    [day: string]: {
      open: string;
      close: string;
      isClosed?: boolean;
    };
  };
  currency: string;
  taxRate?: number;
  serviceCharge?: number;
}