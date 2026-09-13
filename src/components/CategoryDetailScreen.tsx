import React, { useState } from 'react';
import { Category, ScreenType, ExpenseRecord } from '../types';
import { playWaterDrop, playOceanChime } from '../utils/audio';
import { CategoryVisualizer } from './CategoryVisualizers';
import { getMonthDisplayName } from '../db/indexedDB';

interface CategoryDetailScreenProps {
  category: Category;
  activeYear: number;
  activeMonth: number;
  onEditBudget: (catId: string, newBudget: number) => void;
  onDeleteTransaction: (catId: string, txId: string) => void;
  onAddExpense: (expense: ExpenseRecord) => void;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  category,
  activeYear,
  activeMonth,
  onEditBudget,
  onDeleteTransaction,
  onAddExpense,
  onNavigate,
  soundEnabled,
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState(category.budget.toString());
  const [showAddModal, setShowAddModal] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickMode, setQuickMode] = useState('UPI');

  const getDefaultDate = () => {
    const y = activeYear || 2026;
    const m = String(activeMonth || 9).padStart(2, '0');
    const today = new Date();
    const isCurrentYearMonth = today.getFullYear() === y && today.getMonth() + 1 === (activeMonth || 9);
    const d = isCurrentYearMonth ? String(today.getDate()).padStart(2, '0') : '01';
    return `${y}-${m}-${d}`;
  };

  const [quickDate, setQuickDate] = useState(getDefaultDate);

  const remaining = Math.max(0, category.budget - category.spent);
  const pctUsed =
    category.budget > 0
      ? Math.min(100, Math.round((category.spent / category.budget) * 100))
      : 0;
  const pctLeft = Math.max(0, 100 - pctUsed);

  const monthLabel = getMonthDisplayName(activeYear, activeMonth);

  const saveBudget = () => {
    const parsed = parseInt(newBudgetVal, 10);
    if (parsed > 0) {
      if (soundEnabled) playOceanChime();
      onEditBudget(category.id, parsed);
    }
    setIsEditingBudget(false);
  };

  const handleQuickAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(quickAmount);
    if (!amt || isNaN(amt) || amt <= 0) return;

    if (soundEnabled) playOceanChime();
    const newExpense: ExpenseRecord = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: amt,
      categoryId: category.id,
      date: quickDate,
      paymentMethod: quickMode,
      note: quickNote.trim() || `${category.name} Expense`,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setQuickAmount('');
    setQuickNote('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar px-5 pb-6 pt-1 space-y-4 relative">
      {/* Top Bar Navigation */}
      <nav className="flex items-center justify-between pt-1 pb-1">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playWaterDrop();
            onNavigate('home');
          }}
          aria-label="Go Back"
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-white/10 text-white/90 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-base font-semibold text-white tracking-wide">Category Detail</h1>
        <button
          type="button"
          aria-label="Settings"
          onClick={() => {
            if (soundEnabled) playWaterDrop();
            onNavigate('settings');
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-white/10 text-white/90 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">more_horiz</span>
        </button>
      </nav>

      {/* Category Identity Header */}
      <section className="flex items-center space-x-3.5 pl-1">
        <div className="w-14 h-14 relative flex-shrink-0 flex items-center justify-center rounded-2xl glass-card border border-white/20 shadow-sm bg-cyan-950/60 text-3xl">
          {category.badgeImg ? (
            <img
              src={category.badgeImg}
              alt={category.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]"
            />
          ) : (
            <span>{category.icon}</span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {category.name}
            {category.tag && (
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {category.tag}
              </span>
            )}
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d2a4d] border border-cyan-400/30 text-cyan-300 font-semibold">
              {monthLabel}
            </span>
          </h2>
          <p className="text-xs text-sky-200/80 font-normal flex items-center gap-1 mt-0.5">
            {category.subtitle}
          </p>
        </div>
      </section>

      {/* 3D Glass Jar Graphic & Visual Left/Spent Display */}
      <section className="flex items-center justify-between pt-1 px-1">
        {/* 3D Visualizer Graphic */}
        <div className="flex flex-col items-center">
          <CategoryVisualizer
            categoryId={category.id}
            pctLeft={pctLeft}
            size="lg"
            image={category.image}
            creatureImg={category.creatureImg}
            icon={category.icon}
          />
          <div className="w-32 h-2.5 rounded-full bg-cyan-400/30 blur-sm mt-1" />
        </div>

        {/* Metrics Breakdown */}
        <div className="flex-1 pl-6 flex flex-col justify-center space-y-3.5">
          <div>
            <span className="text-base font-bold text-slate-300 tracking-tight">
              ₹{category.budget.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Budget</p>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-400/30 shadow-md">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-cyan-200 glow-cyan-text">
                ₹{remaining.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-sky-300 font-semibold tracking-wide flex items-center gap-1">
              Left{' '}
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            </p>
          </div>

          <div>
            <span className="text-base font-bold text-slate-300 tracking-tight">
              ₹{category.spent.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 font-medium">Spent</p>
          </div>
        </div>
      </section>

      {/* FEATURE 1: Progress Bar matching screenshot */}
      <section className="space-y-1.5 pt-1">
        <div className="w-full h-2 bg-[#021d38] rounded-full overflow-hidden border border-cyan-500/20 p-[1px] shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-cyan-300 shadow-[0_0_12px_#00d2ff] transition-all duration-700"
            style={{ width: `${pctUsed}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-sm font-semibold px-0.5">
          <span className="text-cyan-200/90">{pctUsed}% used</span>
          <span className="text-[#38bdf8] font-bold">{pctLeft}% remaining</span>
        </div>
      </section>

      {/* FEATURE 2: Monthly Allocated Budget Card with Edit Button matching screenshot */}
      <section className="bg-[#051c33]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,20,40,0.6)] backdrop-blur-md">
        {isEditingBudget ? (
          <div className="space-y-2">
            <div className="text-xs text-cyan-300 font-medium">Edit Monthly Allocated Budget</div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-cyan-200 font-bold">₹</span>
              <input
                type="number"
                value={newBudgetVal}
                onChange={(e) => setNewBudgetVal(e.target.value)}
                autoFocus
                className="flex-1 bg-black/50 border border-cyan-400/50 rounded-xl px-3 py-1.5 text-base font-bold text-white focus:outline-none focus:border-cyan-300"
              />
              <button
                type="button"
                onClick={saveBudget}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold text-white hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingBudget(false)}
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-[13px] font-medium text-cyan-300/80 block mb-1">
                Monthly Allocated
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Budget: ₹{category.budget.toLocaleString()}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playWaterDrop();
                setNewBudgetVal(category.budget.toString());
                setIsEditingBudget(true);
              }}
              className="rounded-full border border-cyan-400/50 bg-[#031e3b]/80 hover:bg-cyan-500/20 active:scale-95 px-4 py-1.5 flex items-center gap-1.5 text-cyan-200 hover:text-white transition-all text-xs sm:text-sm font-semibold shadow-[0_0_12px_rgba(0,210,255,0.15)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Edit</span>
            </button>
          </div>
        )}
      </section>

      {/* FEATURE 3: Transactions Header with + Add Expense Button matching screenshot */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-white tracking-tight">Transactions</h3>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playWaterDrop();
              setShowAddModal(true);
            }}
            className="text-[#38bdf8] hover:text-cyan-300 active:scale-95 transition flex items-center gap-1 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <span className="text-base font-bold leading-none">+</span>
            <span>Add Expense</span>
          </button>
        </div>

        {/* FEATURE 4: Transaction Item Cards matching screenshot */}
        <div className="space-y-2.5">
          {category.transactions && category.transactions.length > 0 ? (
            category.transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#051c33]/80 border border-cyan-500/25 rounded-2xl p-3.5 flex items-center justify-between shadow-md hover:border-cyan-400/40 transition-colors group"
              >
                {/* Left: Wave / ocean avatar + note & date info */}
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className="w-11 h-11 rounded-full bg-[#052647] border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-inner text-xl">
                    <span role="img" aria-label="ocean wave">
                      🌊
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-white tracking-tight truncate">
                      {tx.note || 'Expense'}
                    </p>
                    <p className="text-xs text-cyan-200/70 font-medium mt-0.5">
                      {tx.date} • {tx.mode || 'UPI'}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Trash Icon */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                    ₹{tx.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playWaterDrop();
                      onDeleteTransaction(category.id, tx.id);
                    }}
                    title="Delete transaction"
                    aria-label="Delete transaction"
                    className="text-cyan-400/80 hover:text-rose-400 active:scale-90 transition-all p-1.5 flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 px-4 bg-[#051c33]/40 rounded-2xl border border-cyan-500/15">
              <p className="text-sm font-medium text-cyan-200/70">No transactions recorded yet</p>
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playWaterDrop();
                  setShowAddModal(true);
                }}
                className="mt-2 text-xs text-cyan-300 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                + Add your first expense
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Inspirational Beach Footer Banner */}
      <footer className="relative mt-2 p-4 rounded-2xl overflow-hidden border border-white/10 text-center shadow-lg bg-gradient-to-t from-[#c5a67c]/50 via-[#18466b]/70 to-[#07192f]">
        <p className="font-handwriting text-lg text-sky-100 font-medium tracking-wide leading-relaxed drop-shadow-md">
          "{category.quote}"
        </p>
      </footer>

      {/* Quick Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#051c33] border border-cyan-400/40 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add {category.name} Expense
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddExpense} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">
                  Amount (₹)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-cyan-200 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    value={quickAmount}
                    onChange={(e) => setQuickAmount(e.target.value)}
                    placeholder="e.g. 4000"
                    autoFocus
                    required
                    className="w-full bg-[#031426] border border-cyan-400/30 rounded-xl pl-8 pr-3 py-2 text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Expense (or specific item)"
                  className="w-full bg-[#031426] border border-cyan-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">
                  Expense Date
                </label>
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full bg-[#031426] border border-cyan-400/30 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['UPI', 'Cash', 'Card', 'Bank'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setQuickMode(mode)}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition ${
                        quickMode === mode
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                          : 'bg-[#031426] border border-cyan-400/20 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#0072ff] font-bold text-xs sm:text-sm text-white shadow-lg active:scale-98 transition"
                >
                  Save Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    onNavigate('add-expense');
                  }}
                  title="Use Clam Shell keypad"
                  className="px-3 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 hover:text-white text-xs font-semibold"
                >
                  🐚 Keypad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
