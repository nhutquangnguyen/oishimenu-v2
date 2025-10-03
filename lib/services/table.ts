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
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { Table, TableFilter, CreateTableData, UpdateTableData, TableStatus } from '@/lib/types/table';

/**
 * Fetch tables with optional filtering
 */
export async function getTables(filter?: TableFilter): Promise<Table[]> {
  try {
    const db = getDb();
    if (!db) {
      console.warn('Firestore not available, returning empty tables');
      return [];
    }

    let tablesQuery = collection(db, 'tables');
    let queryConstraints: any[] = [];

    // Apply filters
    if (filter?.status && filter.status.length > 0) {
      queryConstraints.push(where('status', 'in', filter.status));
    }

    if (filter?.seats) {
      queryConstraints.push(where('seats', '>=', filter.seats));
    }

    if (filter?.location) {
      queryConstraints.push(where('location', '==', filter.location));
    }

    // Only apply orderBy if no status filter (to avoid composite index requirement)
    const hasStatusFilter = filter?.status && filter.status.length > 0;
    if (!hasStatusFilter) {
      queryConstraints.push(orderBy('name', 'asc'));
    }

    // Apply limit
    if (filter?.limit) {
      queryConstraints.push(firestoreLimit(filter.limit));
    }

    const finalQuery = queryConstraints.length > 0
      ? query(tablesQuery, ...queryConstraints)
      : query(tablesQuery, orderBy('name', 'asc'));

    const snapshot = await getDocs(finalQuery);

    let tables = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        reservedAt: data.reservedAt?.toDate?.() || undefined,
      } as Table;
    });

    // Sort client-side if we have status filter (since we skipped orderBy to avoid index requirement)
    if (hasStatusFilter) {
      tables.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Apply limit client-side if we had status filter
    if (hasStatusFilter && filter?.limit) {
      tables = tables.slice(0, filter.limit);
    }

    return tables;

  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}

/**
 * Get a single table by ID
 */
export async function getTable(id: string): Promise<Table | null> {
  try {
    const db = getDb();
    if (!db) {
      console.warn('Firestore not available');
      return null;
    }

    const docRef = doc(db, 'tables', id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        reservedAt: data.reservedAt?.toDate?.() || undefined,
      } as Table;
    }

    return null;
  } catch (error) {
    console.error('Error fetching table:', error);
    return null;
  }
}

/**
 * Create a new table
 */
export async function createTable(tableData: CreateTableData): Promise<string | null> {
  try {
    const db = getDb();
    if (!db) {
      throw new Error('Firestore not available');
    }

    const now = new Date();
    const table = {
      ...tableData,
      status: 'AVAILABLE' as TableStatus,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'tables'), table);
    return docRef.id;
  } catch (error) {
    console.error('Error creating table:', error);
    return null;
  }
}

/**
 * Update a table
 */
export async function updateTable(id: string, updates: UpdateTableData): Promise<boolean> {
  try {
    const db = getDb();
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'tables', id);

    // Clean undefined values
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    await updateDoc(docRef, {
      ...cleanUpdates,
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error updating table:', error);
    return false;
  }
}

/**
 * Delete a table
 */
export async function deleteTable(id: string): Promise<boolean> {
  try {
    const db = getDb();
    if (!db) {
      throw new Error('Firestore not available');
    }

    const docRef = doc(db, 'tables', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('Error deleting table:', error);
    return false;
  }
}

/**
 * Get available tables
 */
export async function getAvailableTables(): Promise<Table[]> {
  return getTables({
    status: ['AVAILABLE'],
    limit: 100
  });
}

/**
 * Get occupied tables
 */
export async function getOccupiedTables(): Promise<Table[]> {
  return getTables({
    status: ['OCCUPIED', 'RESERVED'],
    limit: 100
  });
}

/**
 * Update table status
 */
export async function updateTableStatus(id: string, status: TableStatus, orderId?: string, reservedBy?: string): Promise<boolean> {
  try {
    const updates: UpdateTableData = { status };

    if (status === 'OCCUPIED' && orderId) {
      updates.currentOrderId = orderId;
    } else if (status === 'RESERVED' && reservedBy) {
      updates.reservedBy = reservedBy;
      updates.reservedAt = new Date();
    } else if (status === 'AVAILABLE') {
      updates.currentOrderId = '';
      updates.reservedBy = '';
      updates.reservedAt = undefined;
    }

    return await updateTable(id, updates);
  } catch (error) {
    console.error('Error updating table status:', error);
    return false;
  }
}

/**
 * Get table statistics
 */
export async function getTableStats() {
  try {
    const tables = await getTables({ limit: 1000 });

    const stats = {
      total: tables.length,
      available: tables.filter(t => t.status === 'AVAILABLE').length,
      occupied: tables.filter(t => t.status === 'OCCUPIED').length,
      reserved: tables.filter(t => t.status === 'RESERVED').length,
      cleaning: tables.filter(t => t.status === 'CLEANING').length,
      outOfOrder: tables.filter(t => t.status === 'OUT_OF_ORDER').length,
      totalSeats: tables.reduce((sum, t) => sum + t.seats, 0),
      occupancyRate: tables.length > 0 ?
        ((tables.filter(t => t.status === 'OCCUPIED' || t.status === 'RESERVED').length / tables.length) * 100) : 0
    };

    return stats;
  } catch (error) {
    console.error('Error calculating table stats:', error);
    return null;
  }
}