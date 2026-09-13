export interface ExpenseRecord {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // "YYYY-MM-DD" e.g. "2026-09-12"
  paymentMethod: string; // "UPI" | "Cash" | "Card" | "Bank"
  note: string;
  createdAt: string; // "2026-09-12T18:30:00"
}

export interface Transaction {
  id: string;
  date: string;
  note: string;
  mode: string;
  amount: number;
  fullDate?: string; // e.g. "2026-09-12"
  categoryId?: string;
  createdAt?: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  percentageLeft: number;
  transactionCount: number;
  transactions: ExpenseRecord[];
}

export type MonthStatus = 'past' | 'current' | 'future';

export interface MonthlySummary {
  year: number;
  month: number;
  yearMonth: string; // "2026-09"
  monthName: string; // "September 2026"
  status?: MonthStatus;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  percentageLeft: number;
  categorySummaries: Record<string, CategorySummary>;
  expenses: ExpenseRecord[];
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  budget: number;
  spent: number;
  icon: string;
  color: string;
  tag?: string;
  image?: string;
  badgeImg?: string;
  creatureImg?: string;
  quote: string;
  transactions: Transaction[];
}

export type ScreenType = 'home' | 'add-expense' | 'category' | 'insights' | 'settings' | 'month-history';

export interface SettingsState {
  // Master switch
  masterSound: boolean;

  // Layer A: Continuous Ocean Ambience & Natural Effects
  oceanAmbience: boolean;
  oceanVolume: number; // 0–100 (percentage, default ~25)
  ambientEffects: boolean;
  fishSounds: boolean;
  bubbleSounds: boolean;
  whaleSounds: boolean;

  // Layer B: Interaction & Event Sounds
  interactionSounds: boolean;
  tabSounds: boolean;
  keypadSounds: boolean;
  expenseSounds: boolean;
  waterRipple: boolean;
  budgetWarning: boolean;
  hapticFeedback: boolean;

  // Backward compatibility alias properties
  soundHaptic?: boolean;
  buttonSound?: boolean;
  expenseAddedSound?: boolean;
  budgetWarningSound?: boolean;
}
