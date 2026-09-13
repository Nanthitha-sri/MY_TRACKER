import React, { useState, useEffect } from 'react';
import { ScreenType, MonthlySummary, CategorySummary } from '../types';
import {
  getAllDiscoveredMonths,
  getMonthlySummary,
  parseYearMonth,
  MONTH_NAMES,
  formatYearMonth,
  getDeviceYearMonth,
  getMonthStatus,
  ensureMonthInitialized,
} from '../db/indexedDB';
import { playWaterDrop, playOceanChime } from '../utils/audio';

interface MonthHistoryScreenProps {
  activeYear: number;
  activeMonth: number;
  onSelectMonth: (year: number, month: number) => void;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
}

export const MonthHistoryScreen: React.FC<MonthHistoryScreenProps> = ({
  activeYear,
  activeMonth,
  onSelectMonth,
  onNavigate,
  soundEnabled,
}) => {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMonthPicker, setShowAddMonthPicker] = useState(false);

  const deviceDate = getDeviceYearMonth();
  const [pickerYear, setPickerYear] = useState(activeYear);
  const [pickerMonth, setPickerMonth] = useState(activeMonth);

  const activeYearMonth = formatYearMonth(activeYear, activeMonth);
  const currentDeviceYM = formatYearMonth(deviceDate.year, deviceDate.month);

  const loadAllMonthlySummaries = async () => {
    setLoading(true);
    try {
      const discovered = await getAllDiscoveredMonths();
      // Ensure active month and device current month are in discovered list
      if (!discovered.includes(activeYearMonth)) {
        discovered.push(activeYearMonth);
      }
      if (!discovered.includes(currentDeviceYM)) {
        discovered.push(currentDeviceYM);
      }
      discovered.sort().reverse();

      const results: MonthlySummary[] = [];
      for (const ym of discovered) {
        const { year, month } = parseYearMonth(ym);
        const summary = await getMonthlySummary(year, month);
        results.push(summary);
      }
      setSummaries(results);
    } catch (err) {
      console.error('Error loading monthly summaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMonthlySummaries();
  }, [activeYear, activeMonth]);

  const handleChooseMonth = (year: number, month: number) => {
    if (soundEnabled) playOceanChime();
    onSelectMonth(year, month);
    onNavigate('home');
  };

  const handleStartNewMonth = async () => {
    if (soundEnabled) playOceanChime();
    // Ensure month is initialized in IndexedDB
    await ensureMonthInitialized(pickerYear, pickerMonth);
    onSelectMonth(pickerYear, pickerMonth);
    setShowAddMonthPicker(false);
    onNavigate('home');
  };

  const handleJumpToDeviceMonth = () => {
    if (soundEnabled) playOceanChime();
    onSelectMonth(deviceDate.year, deviceDate.month);
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar px-5 pb-8 pt-2 space-y-4 relative bg-gradient-to-b from-[#041326] via-[#071d37] to-[#020e1a] text-white select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playWaterDrop();
            onNavigate('home');
          }}
          aria-label="Back to Home"
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-white/10 text-cyan-200 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>

        <div className="text-center">
          <h1 className="text-base font-bold text-white tracking-wide">Month History</h1>
          <p className="text-[11px] text-cyan-300/80 font-normal">
            Continuous monthly budget & expense records
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (soundEnabled) playWaterDrop();
            setPickerYear(activeYear);
            setPickerMonth(activeMonth);
            setShowAddMonthPicker(true);
          }}
          title="Switch / Add Any Month"
          aria-label="Add or switch month"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#072445] border border-cyan-400/30 text-cyan-300 hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">calendar_add_on</span>
        </button>
      </header>

      {/* Overview Info Banner */}
      <section className="bg-gradient-to-r from-[#07264a] to-[#041d3b] border border-cyan-400/30 rounded-2xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌊</span>
            <span className="text-xs font-semibold text-cyan-200">Active Viewing Period</span>
          </div>
          <div className="flex items-center space-x-1.5">
            {activeYearMonth === currentDeviceYM ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                Current Month
              </span>
            ) : (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  getMonthStatus(activeYear, activeMonth) === 'future'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                }`}
              >
                {getMonthStatus(activeYear, activeMonth) === 'future' ? 'Future Period' : 'Historical Period'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-xl font-extrabold text-white">
            {MONTH_NAMES[activeMonth - 1]} {activeYear}
          </div>
          {activeYearMonth !== currentDeviceYM && (
            <button
              type="button"
              onClick={handleJumpToDeviceMonth}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 transition cursor-pointer"
            >
              Jump to Current Month →
            </button>
          )}
        </div>

        <p className="text-xs text-slate-300/90 leading-relaxed">
          Every month retains an independent budget and expense ledger in IndexedDB. Previous months are permanently preserved and never overwritten.
        </p>
      </section>

      {/* Discovered Months List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-cyan-200 uppercase tracking-wider">
            Recorded Months ({summaries.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              setPickerYear(activeYear);
              setPickerMonth(activeMonth);
              setShowAddMonthPicker(true);
            }}
            className="text-xs text-cyan-400 hover:text-cyan-200 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>+ Jump / Add Month</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-cyan-300/70 text-sm animate-pulse">
            Querying IndexedDB monthly records...
          </div>
        ) : (
          <div className="space-y-3">
            {summaries.map((sum) => {
              const isActive = sum.yearMonth === activeYearMonth;
              const isDeviceCurrent = sum.yearMonth === currentDeviceYM;
              const status = sum.status || getMonthStatus(sum.year, sum.month);
              const hasExpenses = sum.expenses.length > 0;

              return (
                <div
                  key={sum.yearMonth}
                  className={`rounded-2xl p-4 border transition-all duration-300 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-b from-[#082a52] to-[#051c38] border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)]'
                      : 'bg-[#051c35]/80 border-cyan-500/25 hover:border-cyan-400/40'
                  }`}
                >
                  {/* Card Header: Month Name & Badges */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-sm font-bold shadow-inner">
                        🗓️
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {sum.monthName}
                          </h3>
                          {isDeviceCurrent ? (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                              Current
                            </span>
                          ) : status === 'future' ? (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                              Future
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-500/20 text-slate-300 border border-slate-400/30">
                              Past
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-cyan-300/70">
                          {sum.expenses.length}{' '}
                          {sum.expenses.length === 1 ? 'transaction' : 'transactions'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {isActive ? (
                        <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_10px_#00e5ff] tracking-wider">
                          Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleChooseMonth(sum.year, sum.month)}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 active:scale-95 transition cursor-pointer"
                        >
                          Select →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metrics Row: Budget, Spent, Remaining */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#031326]/70 border border-cyan-500/15 mb-3 text-center">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Budget</span>
                      <span className="text-sm font-bold text-white">
                        ₹{sum.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Spent</span>
                      <span className="text-sm font-bold text-sky-300">
                        ₹{sum.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Remaining</span>
                      <span className="text-sm font-bold text-emerald-300">
                        ₹{sum.remainingBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-2">
                    <div className="w-full h-1.5 bg-[#020e1a] rounded-full overflow-hidden border border-cyan-500/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${sum.percentageUsed}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-cyan-200/80 font-medium px-0.5">
                      <span>{sum.percentageUsed}% spent</span>
                      <span>{sum.percentageLeft}% remaining</span>
                    </div>
                  </div>

                  {/* Category mini pills */}
                  {hasExpenses ? (
                    <div className="pt-2 border-t border-cyan-500/15 flex flex-wrap gap-1.5">
                      {(Object.values(sum.categorySummaries) as CategorySummary[])
                        .filter((c) => c.spent > 0)
                        .map((c) => (
                          <span
                            key={c.categoryId}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[#02182e] border border-cyan-400/20 text-cyan-300 font-medium"
                          >
                            {c.categoryName}: ₹{c.spent.toLocaleString()}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-cyan-500/15 text-[11px] text-cyan-200/50 italic flex items-center justify-between">
                      <span>Budget initialized • ₹0 spent</span>
                      <span className="text-[10px] text-cyan-400">Ready for expenses</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Month Switcher / Creator Modal */}
      {showAddMonthPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#051c33] border border-cyan-400/40 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🗓️</span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Select or Initialize Month
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMonthPicker(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-cyan-200/80 leading-relaxed">
              Navigate to any month or year across past, current, and future. Unvisited months are automatically initialized with starting budget of ₹22,500 and ₹0 spent.
            </p>

            <div className="space-y-3">
              {/* Year Stepper & Chips */}
              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">Year</label>
                <div className="flex items-center justify-between bg-[#031426] border border-cyan-400/30 rounded-xl px-3 py-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-95"
                  >
                    ‹
                  </button>
                  <span className="text-base font-extrabold text-white tracking-wider">{pickerYear}</span>
                  <button
                    type="button"
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-95"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2025, 2026, 2027, 2028].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setPickerYear(y)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition ${
                        pickerYear === y
                          ? 'bg-cyan-400 text-slate-950 shadow'
                          : 'bg-[#031426] border border-cyan-400/20 text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Grid */}
              <div>
                <label className="text-xs font-semibold text-cyan-300 block mb-1">Month</label>
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto no-scrollbar p-1">
                  {MONTH_NAMES.map((name, idx) => {
                    const mNumber = idx + 1;
                    const isSel = pickerMonth === mNumber;
                    const status = getMonthStatus(pickerYear, mNumber);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setPickerMonth(mNumber)}
                        className={`py-2 px-2 rounded-lg text-[11px] font-semibold transition flex flex-col items-center justify-center ${
                          isSel
                            ? 'bg-cyan-400 text-slate-950 font-bold shadow'
                            : 'bg-[#031426] border border-cyan-400/20 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{name.slice(0, 3)}</span>
                        <span
                          className={`text-[8px] uppercase tracking-tighter ${
                            isSel
                              ? 'text-slate-900 font-extrabold'
                              : status === 'current'
                              ? 'text-emerald-300 font-bold'
                              : status === 'future'
                              ? 'text-purple-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {status === 'current' ? 'Now' : status === 'future' ? 'Future' : 'Past'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartNewMonth}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#0072ff] font-bold text-xs sm:text-sm text-white shadow-lg active:scale-98 transition cursor-pointer"
              >
                Go to {MONTH_NAMES[pickerMonth - 1]} {pickerYear}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
