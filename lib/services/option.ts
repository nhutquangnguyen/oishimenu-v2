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
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Option, OptionFilter } from '@/lib/types/option';

/**
 * Fetch all options with optional filtering
 */
export async function getOptions(filter?: OptionFilter): Promise<Option[]> {
  try {
    if (!db) {
      console.warn('Firestore not available, returning mock options');
      return getMockOptions();
    }

    let optionsQuery = collection(db, 'options');
    let queryConstraints: any[] = [];

    // Apply filters
    if (filter?.category) {
      queryConstraints.push(where('category', '==', filter.category));
    }

    if (filter?.activeOnly) {
      queryConstraints.push(where('isActive', '==', true));
    }

    // Default sort by name
    queryConstraints.push(orderBy('name', 'asc'));

    const finalQuery = queryConstraints.length > 0
      ? query(optionsQuery, ...queryConstraints)
      : optionsQuery;

    const snapshot = await getDocs(finalQuery);
    let options = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
    } as Option));

    // Apply client-side filters
    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      options = options.filter(option =>
        option.name.toLowerCase().includes(searchLower) ||
        option.description?.toLowerCase().includes(searchLower)
      );
    }

    return options;
  } catch (error) {
    console.error('Error fetching options:', error);
    return getMockOptions();
  }
}

/**
 * Get a single option by ID
 */
export async function getOption(id: string): Promise<Option | null> {
  try {
    if (!db) {
      console.warn('Firestore not available');
      return getMockOptions().find(o => o.id === id) || null;
    }

    const docRef = doc(db, 'options', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date(),
      } as Option;
    }

    return null;
  } catch (error) {
    console.error('Error fetching option:', error);
    return null;
  }
}

/**
 * Add a new option
 */
export async function addOption(option: Omit<Option, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const optionData = {
      ...option,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'options'), optionData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding option:', error);
    return null;
  }
}

/**
 * Update an option
 */
export async function updateOption(id: string, updates: Partial<Option>): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'options', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error updating option:', error);
    return false;
  }
}

/**
 * Delete an option
 */
export async function deleteOption(id: string): Promise<boolean> {
  try {
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'options', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting option:', error);
    return false;
  }
}

/**
 * Get options by IDs
 */
export async function getOptionsByIds(ids: string[]): Promise<Option[]> {
  try {
    if (ids.length === 0) return [];

    const options = await Promise.all(
      ids.map(id => getOption(id))
    );

    return options.filter(option => option !== null) as Option[];
  } catch (error) {
    console.error('Error fetching options by IDs:', error);
    return [];
  }
}

/**
 * Mock data for development
 */
export function getMockOptions(): Option[] {
  return [
    {
      id: 'opt-size-s',
      name: 'Size S',
      description: 'Small size portion',
      price: 0,
      isActive: true,
      category: 'size',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'opt-size-m',
      name: 'Size M',
      description: 'Medium size portion',
      price: 0,
      isActive: true,
      category: 'size',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'opt-size-l',
      name: 'Size L',
      description: 'Large size portion',
      price: 5000,
      isActive: true,
      category: 'size',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'opt-extra-shot',
      name: 'Extra Coffee Shot',
      description: 'Add an extra shot of espresso',
      price: 8000,
      isActive: true,
      category: 'topping',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'opt-oat-milk',
      name: 'Oat Milk',
      description: 'Replace regular milk with oat milk',
      price: 7000,
      isActive: true,
      category: 'milk',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'opt-less-sugar',
      name: 'Less Sugar',
      description: 'Reduce sugar content',
      price: 0,
      isActive: true,
      category: 'sweetness',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}