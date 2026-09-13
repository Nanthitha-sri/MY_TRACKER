import { useState, useEffect, useMemo } from 'react';
import { Category, ScreenType, SettingsState, Transaction, ExpenseRecord, MonthlySummary } from './types';
import { initialCategories, defaultSettings } from './data/initialData';
import { MobileFrame } from './components/MobileFrame';
import { HomeScreen } from './components/HomeScreen';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { CategoryDetailScreen } from './components/CategoryDetailScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { MonthHistoryScreen } from './components/MonthHistoryScreen';
import {
  seedInitialDataIfEmpty,
  getAllDiscoveredMonths,
  getMonthlySummary,
  addExpense,
  updateExpense,
  deleteExpense,
  setCategoryBudget,
  resetDatabase,
} from './db/indexedDB';

const STORAGE_KEY_SETTINGS = 'good_day_ocean_settings_v3';

export default function App() {
  const [activeYear, setActiveYear] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('nanz_active_year');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 2000) return parsed;
      }
    }
    return 2026;
  });

  const [activeMonth, setActiveMonth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('nanz_active_month');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) return parsed;
      }
    }
    return 9;
  });

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [availableMonths, setAvailableMonths] = useState<string[]>(['2026-09']);
  const [, setIsLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (saved) {
          return { ...defaultSettings, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to default
      }
    }
    return defaultSettings;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCatId, setSelectedCatId] = useState<string>('home');

  // Persistence for user app settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Storage unavailable
    }
  }, [settings]);

  // Load active month data from IndexedDB
  const refreshMonthData = async (year: number, month: number) => {
    try {
      await seedInitialDataIfEmpty();
      const discovered = await getAllDiscoveredMonths();
      const currentYM = `${year}-${String(month).padStart(2, '0')}`;
      if (!discovered.includes(currentYM)) {
        discovered.push(currentYM);
        discovered.sort().reverse();
      }
      setAvailableMonths(discovered);

      const summary = await getMonthlySummary(year, month);
      setMonthlySummary(summary);
    } catch (err) {
      console.error('Error loading month data from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMonthData(activeYear, activeMonth);
  }, [activeYear, activeMonth]);

  // Merge base category info (icons, artwork, colors) with active month's data from IndexedDB
  const categories: Category[] = useMemo(() => {
    return initialCategories.map((base) => {
      const catSummary = monthlySummary?.categorySummaries[base.id];
      const budget = catSummary ? catSummary.budget : base.budget;
      const spent = catSummary ? catSummary.spent : 0;
      const transactions: Transaction[] = (catSummary?.transactions || []).map((t) => {
        let shortDate = t.date;
        try {
          const d = new Date(t.date + 'T12:00:00');
          shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(d);
        } catch {
          // Keep string as fallback
        }
        return {
          id: t.id,
          amount: t.amount,
          date: shortDate,
          fullDate: t.date,
          mode: t.paymentMethod,
          note: t.note,
          categoryId: t.categoryId,
          createdAt: t.createdAt,
        };
      });

      return {
        ...base,
        budget,
        spent,
        transactions,
      };
    });
  }, [monthlySummary]);

  const handleAddExpense = async (newExpense: ExpenseRecord) => {
    await addExpense(newExpense);
    const parts = newExpense.date.split('-');
    const expYear = parseInt(parts[0], 10);
    const expMonth = parseInt(parts[1], 10);

    if (expYear && expMonth && (expYear !== activeYear || expMonth !== activeMonth)) {
      // If user logged an expense in a different month, switch to that month
      setActiveYear(expYear);
      setActiveMonth(expMonth);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nanz_active_year', expYear.toString());
        sessionStorage.setItem('nanz_active_month', expMonth.toString());
      }
    } else {
      await refreshMonthData(activeYear, activeMonth);
    }
  };

  const handleUpdateExpense = async (updatedExpense: ExpenseRecord) => {
    await updateExpense(updatedExpense);
    const parts = updatedExpense.date.split('-');
    const expYear = parseInt(parts[0], 10);
    const expMonth = parseInt(parts[1], 10);

    if (expYear && expMonth && (expYear !== activeYear || expMonth !== activeMonth)) {
      // If user changed the expense date to a different month, navigate to that month
      setActiveYear(expYear);
      setActiveMonth(expMonth);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nanz_active_year', expYear.toString());
        sessionStorage.setItem('nanz_active_month', expMonth.toString());
      }
    } else {
      await refreshMonthData(activeYear, activeMonth);
    }
  };

  const handleEditBudget = async (catId: string, newBudget: number) => {
    await setCategoryBudget(activeYear, activeMonth, catId, newBudget);
    await refreshMonthData(activeYear, activeMonth);
  };

  const handleDeleteTransaction = async (_catId: string, txId: string) => {
    await deleteExpense(txId);
    await refreshMonthData(activeYear, activeMonth);
  };

  const handleSelectMonth = (year: number, month: number) => {
    setActiveYear(year);
    setActiveMonth(month);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nanz_active_year', year.toString());
      sessionStorage.setItem('nanz_active_month', month.toString());
    }
  };

  const handleResetData = async () => {
    await resetDatabase();
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch {
      // Ignore
    }
    await refreshMonthData(activeYear, activeMonth);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    setCurrentScreen('category');
  };

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  return (
    <MobileFrame>
      {currentScreen === 'home' && (
        <HomeScreen
          categories={categories}
          activeYear={activeYear}
          activeMonth={activeMonth}
          availableMonths={availableMonths}
          onSelectMonth={handleSelectMonth}
          onNavigate={setCurrentScreen}
          onSelectCategory={handleSelectCategory}
          soundEnabled={settings.buttonSound}
        />
      )}

      {currentScreen === 'add-expense' && (
        <AddExpenseScreen
          categories={categories}
          initialCategoryId={selectedCatId}
          activeYear={activeYear}
          activeMonth={activeMonth}
          onAddExpense={handleAddExpense}
          onNavigate={setCurrentScreen}
          soundEnabled={settings.buttonSound}
        />
      )}

      {currentScreen === 'category' && (
        <CategoryDetailScreen
          category={activeCategory}
          categories={categories}
          activeYear={activeYear}
          activeMonth={activeMonth}
          onEditBudget={handleEditBudget}
          onDeleteTransaction={handleDeleteTransaction}
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          onNavigate={setCurrentScreen}
          soundEnabled={settings.buttonSound}
        />
      )}

      {currentScreen === 'insights' && (
        <InsightsScreen
          categories={categories}
          activeYear={activeYear}
          activeMonth={activeMonth}
          availableMonths={availableMonths}
          onSelectMonth={handleSelectMonth}
          onNavigate={setCurrentScreen}
          onSelectCategory={handleSelectCategory}
          soundEnabled={settings.buttonSound}
        />
      )}

      {currentScreen === 'month-history' && (
        <MonthHistoryScreen
          activeYear={activeYear}
          activeMonth={activeMonth}
          onSelectMonth={handleSelectMonth}
          onNavigate={setCurrentScreen}
          soundEnabled={settings.buttonSound}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          categories={categories}
          settings={settings}
          onUpdateSettings={setSettings}
          onResetData={handleResetData}
          onNavigate={setCurrentScreen}
        />
      )}
    </MobileFrame>
  );
}
