import React, { useState, useEffect } from 'react';
import { Category, ScreenType, ExpenseRecord } from '../types';
import { audioManager } from '../utils/audio';

interface AddExpenseScreenProps {
  categories: Category[];
  initialCategoryId?: string;
  activeYear: number;
  activeMonth: number;
  onAddExpense: (expense: ExpenseRecord) => Promise<void> | void;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled?: boolean;
}

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({
  categories,
  initialCategoryId,
  activeYear,
  activeMonth,
  onAddExpense,
  onNavigate,
}) => {
  const getDefaultDate = () => {
    const y = activeYear || 2026;
    const m = String(activeMonth || 9).padStart(2, '0');
    const today = new Date();
    const isCurrentYearMonth = today.getFullYear() === y && today.getMonth() + 1 === (activeMonth || 9);
    const d = isCurrentYearMonth ? String(today.getDate()).padStart(2, '0') : '01';
    return `${y}-${m}-${d}`;
  };

  // Bug 3 & 4: Start with empty amount string, displaying ₹0
  const [amountStr, setAmountStr] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(initialCategoryId || 'home');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');
  const [dateStr, setDateStr] = useState(getDefaultDate);
  const [justSaved, setJustSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form whenever opening with a new category or month
  useEffect(() => {
    setAmountStr('');
    setSelectedCatId(initialCategoryId || 'home');
    setPaymentMethod('UPI');
    setNote('');
    setDateStr(getDefaultDate());
    setJustSaved(false);
  }, [initialCategoryId, activeYear, activeMonth]);

  const quickNotes = ['Skincare', 'Coffee', 'Groceries', 'Books', 'Dining', 'Uber/Metro'];

  const handleKeypad = (val: string) => {
    if (val === 'backspace') {
      audioManager.play('keypadDelete');
      setAmountStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
    } else if (val === 'clear') {
      audioManager.play('keypadClear');
      setAmountStr('');
    } else if (val === '.') {
      audioManager.play('keypadTap');
      if (!amountStr.includes('.')) {
        setAmountStr((prev) => (prev ? prev + '.' : '0.'));
      }
    } else {
      // Numerical digit
      audioManager.play('keypadTap');
      setAmountStr((prev) => (prev === '0' || prev === '' ? val : prev + val));
    }
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    const amt = parseFloat(amountStr || '0');
    // Important: Do not play success sound if validation fails
    if (!amt || isNaN(amt) || amt <= 0) return;

    setIsSaving(true);

    const newExpense: ExpenseRecord = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: amt,
      categoryId: selectedCatId,
      date: dateStr,
      paymentMethod,
      note: note.trim() || 'Expense',
      createdAt: new Date().toISOString(),
    };

    try {
      // Must await persistence BEFORE triggering success state and audio
      await onAddExpense(newExpense);

      setJustSaved(true);

      // Bug 4: Reset all fields after submission so subsequent openings start clean
      setAmountStr('');
      setNote('');
      setPaymentMethod('UPI');
      setSelectedCatId(initialCategoryId || 'home');
      setDateStr(getDefaultDate());

      setTimeout(() => {
        setJustSaved(false);
        setIsSaving(false);
        onNavigate('home');
      }, 400);
    } catch {
      setIsSaving(false);
    }
  };

  const displayAmount = amountStr || '0';

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar text-white pb-3 select-none bg-gradient-to-b from-[#051426] via-[#0c2b4c] to-[#1c2936]">
      {/* Header */}
      <header className="pt-2 px-5 z-20">
        <div className="relative flex items-center justify-center min-h-[44px]">
          <button
            type="button"
            onClick={() => {
              audioManager.play('buttonTap');
              onNavigate('home');
            }}
            aria-label="Back"
            className="absolute left-0 p-1 text-sky-200 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-wide text-white drop-shadow-sm">
              Add Expense
            </h1>
            <p className="text-[11px] text-cyan-200/80 font-light flex items-center justify-center gap-1 mt-0.5">
              <span>A small step towards a bigger you</span>
              <span className="text-sky-400">💙</span>
            </p>
          </div>
        </div>
      </header>

      {/* Amount Clam Shell Section */}
      <section className="mt-1 relative flex flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center justify-center mx-auto w-[280px]">
          <div className="relative w-48 h-40 flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByc-0nuc58VTC8gx3tlc6yQeNQB3LxNaiRqCoEBQrILVvJkK5FXDB_ODD9BWts7v93J5PVOzRkjSGIjGMl02o9IQZO6ZkDfdMhwhEkv7LC4_H0IS7dhylYopeP14cZZDARIqej4t2KyPsagTQJWs3_MAVlBaa-4Zb9zaPIHTPh8DezWpGquz2N0q-V2ENgYlmOOrKG0p7RcEZCzngD9jmIbxW68YQ_4QssEV_cWWRIiOd5StC9a6CWdl2gWaZWnT4Afz9TUUoncrPMWw"
              alt="Pearl Clam Shell"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,180,255,0.45)]"
            />
            <div className="absolute bottom-1 inset-x-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-slate-950/80 backdrop-blur-md px-4 py-1 rounded-full border border-sky-300/40 shadow-lg flex items-center justify-center text-white tracking-tight">
                <span className="text-2xl font-semibold leading-none text-cyan-200">₹</span>
                <span className="text-3xl font-bold leading-none tracking-tight ml-1 text-white">
                  {displayAmount}
                </span>
                <span className="typing-cursor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories 2-col Grid */}
      <section className="px-5 my-1">
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => {
            const isActive = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audioManager.play('buttonTap');
                  setSelectedCatId(cat.id);
                }}
                className={`${
                  isActive ? 'glass-card-active' : 'glass-card hover:bg-white/10'
                } rounded-xl py-2 px-3 flex items-center space-x-2.5 transition active:scale-98 text-left cursor-pointer`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span
                  className={`text-xs font-semibold tracking-wide truncate ${
                    isActive ? 'text-white' : 'text-sky-100'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date Selection Section */}
      <section className="px-5 mt-1">
        <div className="flex items-center justify-between mb-1 text-sky-200/90 text-xs font-medium">
          <div className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-sm text-cyan-300">calendar_month</span>
            <span>Expense Date</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold tracking-wide">{dateStr}</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="flex-1 bg-[#0d2a4d]/70 border border-sky-400/30 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              audioManager.play('buttonTap');
              const today = new Date();
              const y = today.getFullYear();
              const m = String(today.getMonth() + 1).padStart(2, '0');
              const d = String(today.getDate()).padStart(2, '0');
              setDateStr(`${y}-${m}-${d}`);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-400/30 text-[10px] text-cyan-200 font-bold hover:bg-cyan-900/70 active:scale-95 transition cursor-pointer"
          >
            Today
          </button>
        </div>
      </section>

      {/* Payment Method Section */}
      <section className="px-5 mt-1">
        <div className="flex items-center space-x-1 mb-1 text-sky-200/90 text-xs font-medium">
          <span>Payment Method</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['UPI', 'Cash', 'Card', 'Bank'].map((method) => {
            const isSelected = paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => {
                  audioManager.play('buttonTap');
                  setPaymentMethod(method);
                }}
                className={`${
                  isSelected ? 'glass-card-active' : 'glass-card active:bg-white/10'
                } rounded-xl py-1.5 flex flex-col items-center justify-center space-y-0.5 transition cursor-pointer`}
              >
                <span className="text-[11px] font-semibold text-white">{method}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Note Input & Quick Chips */}
      <section className="px-5 mt-1.5">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] text-sky-200/80">Add a note</span>
          <span className="text-[10px] text-sky-400/80">Optional</span>
        </div>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Lunch, Skincare, Bills..."
          className="w-full bg-[#0d2a4d]/60 border border-sky-400/25 rounded-xl px-3 py-1.5 text-xs text-white placeholder-sky-300/40 focus:outline-none focus:border-cyan-400"
        />
        <div className="flex items-center space-x-1.5 mt-1.5 overflow-x-auto no-scrollbar py-0.5">
          {quickNotes.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                audioManager.play('buttonTap');
                setNote(q);
              }}
              className="text-[10px] whitespace-nowrap px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/20 text-cyan-200 hover:bg-cyan-900/60 active:scale-95 transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Action CTA Button */}
      <section className="px-5 mt-2">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full py-2.5 rounded-full flex items-center justify-center relative shadow-lg active:scale-[0.98] transition border border-white/40 ${
            justSaved
              ? 'bg-emerald-500 scale-95'
              : 'bg-gradient-to-r from-[#0e85ca] via-[#15a3df] to-[#22c8ee]'
          }`}
        >
          <span className="font-semibold text-sm text-white tracking-wide drop-shadow-sm">
            {justSaved ? 'Saved! ✨' : `Save Expense (₹${displayAmount})`}
          </span>
          <span className="absolute right-4 text-xl">🐚</span>
        </button>
      </section>

      {/* Frosted Numeric Keypad */}
      <section className="px-5 mt-2">
        <div className="grid grid-cols-3 gap-1.5 text-center text-lg">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypad(digit)}
              className="keypad-btn py-2 rounded-xl"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleKeypad('.')}
            className="keypad-btn py-2 rounded-xl text-xl font-bold flex items-center justify-center"
          >
            .
          </button>
          <button
            type="button"
            onClick={() => handleKeypad('0')}
            className="keypad-btn py-2 rounded-xl"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeypad('backspace')}
            aria-label="Delete"
            className="keypad-btn py-2 rounded-xl flex items-center justify-center text-slate-900"
          >
            <span className="material-symbols-outlined text-lg">backspace</span>
          </button>
        </div>
      </section>

      {/* Sandy Shoreline Motivation */}
      <footer className="mt-2 py-1 px-4 text-center">
        <p className="font-serif italic text-xs text-amber-100/90 tracking-wide drop-shadow-md">
          Good choices today, a brighter tomorrow ♡
        </p>
      </footer>
    </div>
  );
};
