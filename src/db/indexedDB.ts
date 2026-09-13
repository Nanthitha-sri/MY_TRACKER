import { ExpenseRecord, MonthlySummary, CategorySummary, MonthStatus } from '../types';

export const BASE_CATEGORY_BUDGETS: Record<string, number> = {
  home: 10000,
  pg: 8500,
  'self-care': 1000,
  'self-expenses': 1000,
  recharge: 700,
  rem: 1300,
};

export const CATEGORY_NAMES: Record<string, string> = {
  home: 'Home',
  pg: 'PG',
  'self-care': 'Self Care',
  'self-expenses': 'Self Expenses',
  recharge: 'Recharge',
  rem: 'REM',
};

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DB_NAME = 'OceanBudgetDB';
const DB_VERSION = 1;
const EXPENSES_STORE = 'expenses';
const BUDGETS_STORE = 'monthly_budgets';

let dbInstance: IDBDatabase | null = null;

export function getDeviceYearMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function parseYearMonth(yearMonth: string): { year: number; month: number } {
  const [yStr, mStr] = yearMonth.split('-');
  return {
    year: parseInt(yStr, 10),
    month: parseInt(mStr, 10),
  };
}

export function getMonthDisplayName(year: number, month: number): string {
  const name = MONTH_NAMES[month - 1] || 'Month';
  return `${name} ${year}`;
}

export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

export function getMonthStatus(year: number, month: number): MonthStatus {
  const device = getDeviceYearMonth();
  if (year < device.year || (year === device.year && month < device.month)) {
    return 'past';
  }
  if (year === device.year && month === device.month) {
    return 'current';
  }
  return 'future';
}

export function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
        const expenseStore = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' });
        expenseStore.createIndex('yearMonth', 'yearMonth', { unique: false });
        expenseStore.createIndex('date', 'date', { unique: false });
        expenseStore.createIndex('categoryId', 'categoryId', { unique: false });
        expenseStore.createIndex('yearMonth_categoryId', ['yearMonth', 'categoryId'], { unique: false });
      }

      if (!db.objectStoreNames.contains(BUDGETS_STORE)) {
        db.createObjectStore(BUDGETS_STORE, { keyPath: 'yearMonth' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Ensures a month has an independent budget record in BUDGETS_STORE.
 * If the month does not yet exist, it initializes with the default budget template:
 * Total ₹22,500 (Home 10000, PG 8500, Self Care 1000, Self Expenses 1000, Recharge 700, REM 1300).
 * Does NOT copy any previous month's expenses.
 */
export async function ensureMonthInitialized(year: number, month: number): Promise<void> {
  const db = await openDB();
  const targetYearMonth = formatYearMonth(year, month);

  return new Promise((resolve, reject) => {
    const tx = db.transaction([BUDGETS_STORE], 'readwrite');
    const store = tx.objectStore(BUDGETS_STORE);
    const getReq = store.get(targetYearMonth);

    getReq.onsuccess = () => {
      if (!getReq.result) {
        const record = {
          yearMonth: targetYearMonth,
          budgets: { ...BASE_CATEGORY_BUDGETS },
          initializedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        const putReq = store.put(record);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      } else {
        resolve();
      }
    };

    getReq.onerror = () => reject(getReq.error);
  });
}

/**
 * Get all expenses for a specific year and month (1-12)
 */
export async function getExpensesByMonth(year: number, month: number): Promise<ExpenseRecord[]> {
  const db = await openDB();
  const targetYearMonth = formatYearMonth(year, month);

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE], 'readonly');
    const store = tx.objectStore(EXPENSES_STORE);
    const index = store.index('yearMonth');
    const request = index.getAll(IDBKeyRange.only(targetYearMonth));

    request.onsuccess = () => {
      const results: ExpenseRecord[] = (request.result || []).map((item: any) => ({
        id: item.id,
        amount: Number(item.amount),
        categoryId: item.categoryId,
        date: item.date,
        paymentMethod: item.paymentMethod || 'UPI',
        note: item.note || 'Expense',
        createdAt: item.createdAt || `${item.date}T12:00:00`,
      }));

      // Sort newest date & createdAt first
      results.sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));
      resolve(results);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all expenses for a category in a specific month
 */
export async function getExpensesByCategory(
  year: number,
  month: number,
  categoryId: string
): Promise<ExpenseRecord[]> {
  const allMonthly = await getExpensesByMonth(year, month);
  return allMonthly.filter((exp) => exp.categoryId === categoryId);
}

/**
 * Add a new expense into persistent storage.
 * The expense date strictly determines which month the expense belongs to.
 */
export async function addExpense(expense: ExpenseRecord): Promise<void> {
  const db = await openDB();
  const yearMonth = expense.date.substring(0, 7);
  const { year, month } = parseYearMonth(yearMonth);

  // Ensure this month's budget record is initialized
  await ensureMonthInitialized(year, month);

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = tx.objectStore(EXPENSES_STORE);

    const record = {
      ...expense,
      yearMonth,
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update an existing expense
 */
export async function updateExpense(expense: ExpenseRecord): Promise<void> {
  const db = await openDB();
  const yearMonth = expense.date.substring(0, 7);

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = tx.objectStore(EXPENSES_STORE);

    const record = {
      ...expense,
      yearMonth,
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an expense by ID or record
 */
export async function deleteExpense(expenseOrId: string | ExpenseRecord): Promise<void> {
  const db = await openDB();
  const id = typeof expenseOrId === 'string' ? expenseOrId : expenseOrId.id;

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = tx.objectStore(EXPENSES_STORE);

    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get monthly category budgets (stored independently per month so previous months are never overwritten)
 */
export async function getMonthlyBudgets(year: number, month: number): Promise<Record<string, number>> {
  const db = await openDB();
  const targetYearMonth = formatYearMonth(year, month);

  return new Promise((resolve) => {
    const tx = db.transaction([BUDGETS_STORE], 'readonly');
    const store = tx.objectStore(BUDGETS_STORE);
    const request = store.get(targetYearMonth);

    request.onsuccess = () => {
      if (request.result && request.result.budgets) {
        resolve({
          ...BASE_CATEGORY_BUDGETS,
          ...request.result.budgets,
        });
      } else {
        // Return default monthly budget allocation (Total: ₹22,500)
        resolve({ ...BASE_CATEGORY_BUDGETS });
      }
    };

    request.onerror = () => {
      resolve({ ...BASE_CATEGORY_BUDGETS });
    };
  });
}

/**
 * Set category budget for a specific month.
 * Modifying a budget for one month NEVER changes another month's historical budget.
 */
export async function setCategoryBudget(
  year: number,
  month: number,
  categoryId: string,
  newBudget: number
): Promise<void> {
  const db = await openDB();
  const targetYearMonth = formatYearMonth(year, month);
  const currentBudgets = await getMonthlyBudgets(year, month);

  const updatedBudgets = {
    ...currentBudgets,
    [categoryId]: newBudget,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction([BUDGETS_STORE], 'readwrite');
    const store = tx.objectStore(BUDGETS_STORE);

    const record = {
      yearMonth: targetYearMonth,
      budgets: updatedBudgets,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get comprehensive summary for a category in a specific month
 */
export async function getCategorySummary(
  year: number,
  month: number,
  categoryId: string
): Promise<CategorySummary> {
  const expenses = await getExpensesByCategory(year, month, categoryId);
  const budgets = await getMonthlyBudgets(year, month);

  const budget = budgets[categoryId] ?? (BASE_CATEGORY_BUDGETS[categoryId] || 1000);
  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = Math.max(0, budget - spent);
  const percentageUsed = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const percentageLeft = Math.max(0, 100 - percentageUsed);

  return {
    categoryId,
    categoryName: CATEGORY_NAMES[categoryId] || categoryId,
    budget,
    spent,
    remaining,
    percentageUsed,
    percentageLeft,
    transactionCount: expenses.length,
    transactions: expenses,
  };
}

/**
 * Get complete monthly summary calculated strictly from stored records.
 * Automatically initializes budget record if first time accessing this month.
 */
export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
  await ensureMonthInitialized(year, month);

  const expenses = await getExpensesByMonth(year, month);
  const budgets = await getMonthlyBudgets(year, month);
  const targetYearMonth = formatYearMonth(year, month);
  const status = getMonthStatus(year, month);

  const categoryIds = Object.keys(BASE_CATEGORY_BUDGETS);
  const categorySummaries: Record<string, CategorySummary> = {};

  let totalBudget = 0;
  let totalSpent = 0;

  for (const catId of categoryIds) {
    const catExpenses = expenses.filter((e) => e.categoryId === catId);
    const budget = budgets[catId] ?? BASE_CATEGORY_BUDGETS[catId];
    const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = Math.max(0, budget - spent);
    const percentageUsed = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
    const percentageLeft = Math.max(0, 100 - percentageUsed);

    categorySummaries[catId] = {
      categoryId: catId,
      categoryName: CATEGORY_NAMES[catId] || catId,
      budget,
      spent,
      remaining,
      percentageUsed,
      percentageLeft,
      transactionCount: catExpenses.length,
      transactions: catExpenses,
    };

    totalBudget += budget;
    totalSpent += spent;
  }

  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const percentageLeft = Math.max(0, 100 - percentageUsed);

  return {
    year,
    month,
    yearMonth: targetYearMonth,
    monthName: getMonthDisplayName(year, month),
    status,
    totalBudget,
    totalSpent,
    remainingBudget,
    percentageUsed,
    percentageLeft,
    categorySummaries,
    expenses,
  };
}

/**
 * Dynamically discover all months that have expenses OR have been initialized/configured in BUDGETS_STORE.
 * Also ensures device current month is always present.
 * Returns sorted array of "YYYY-MM" (newest first).
 */
export async function getAllDiscoveredMonths(): Promise<string[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE, BUDGETS_STORE], 'readonly');
    const expStore = tx.objectStore(EXPENSES_STORE);
    const budStore = tx.objectStore(BUDGETS_STORE);

    const monthsSet = new Set<string>();

    // Add current device month
    const device = getDeviceYearMonth();
    monthsSet.add(formatYearMonth(device.year, device.month));

    // Also include September 2026 as starting baseline
    monthsSet.add('2026-09');

    // Read from EXPENSES_STORE
    const expCursorReq = expStore.openCursor();
    expCursorReq.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        if (cursor.value.yearMonth) {
          monthsSet.add(cursor.value.yearMonth);
        } else if (cursor.value.date) {
          monthsSet.add(cursor.value.date.substring(0, 7));
        }
        cursor.continue();
      }
    };

    // Read from BUDGETS_STORE
    const budCursorReq = budStore.openCursor();
    budCursorReq.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        if (cursor.value.yearMonth) {
          monthsSet.add(cursor.value.yearMonth);
        }
        cursor.continue();
      }
    };

    tx.oncomplete = () => {
      const sorted = Array.from(monthsSet).sort().reverse();
      resolve(sorted);
    };

    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Seed initial real expense data for September 2026 once if empty
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE], 'readonly');
    const store = tx.objectStore(EXPENSES_STORE);
    const countReq = store.count();

    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        // Seed actual September 2026 expenses
        const initialExpenses: ExpenseRecord[] = [
          {
            id: 'exp-sep-home-1',
            amount: 4000,
            categoryId: 'home',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'Expense',
            createdAt: '2026-09-13T10:00:00',
          },
          {
            id: 'exp-sep-pg-1',
            amount: 4250,
            categoryId: 'pg',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'PG Advance & Maintenance',
            createdAt: '2026-09-13T10:30:00',
          },
          {
            id: 'exp-sep-selfcare-1',
            amount: 400,
            categoryId: 'self-care',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'Skincare & Wellness',
            createdAt: '2026-09-13T11:15:00',
          },
          {
            id: 'exp-sep-selfexpenses-1',
            amount: 350,
            categoryId: 'self-expenses',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'Coffee & Journal Book',
            createdAt: '2026-09-13T12:00:00',
          },
          {
            id: 'exp-sep-recharge-1',
            amount: 299,
            categoryId: 'recharge',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'Mobile Unlimited Data',
            createdAt: '2026-09-13T14:20:00',
          },
          {
            id: 'exp-sep-rem-1',
            amount: 500,
            categoryId: 'rem',
            date: '2026-09-13',
            paymentMethod: 'UPI',
            note: 'Voyage Emergency Reserve',
            createdAt: '2026-09-13T15:45:00',
          },
        ];

        for (const exp of initialExpenses) {
          await addExpense(exp);
        }

        // Initialize 2026-09 budget
        await ensureMonthInitialized(2026, 9);
      }
      resolve();
    };

    countReq.onerror = () => reject(countReq.error);
  });
}

/**
 * Reset database to default initial state (used by Settings Reset)
 */
export async function resetDatabase(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([EXPENSES_STORE, BUDGETS_STORE], 'readwrite');
    const expStore = tx.objectStore(EXPENSES_STORE);
    const budStore = tx.objectStore(BUDGETS_STORE);

    expStore.clear();
    budStore.clear();

    tx.oncomplete = async () => {
      await seedInitialDataIfEmpty();
      resolve();
    };

    tx.onerror = () => reject(tx.error);
  });
}
