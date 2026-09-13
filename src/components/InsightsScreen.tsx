import React, { useState } from 'react';
import { Category, ScreenType } from '../types';
import { BottomNav } from './BottomNav';
import { playWaterDrop } from '../utils/audio';
import {
  getMonthDisplayName,
  parseYearMonth,
  getPreviousMonth,
  getNextMonth,
  getMonthStatus,
} from '../db/indexedDB';

interface InsightsScreenProps {
  categories: Category[];
  activeYear: number;
  activeMonth: number;
  availableMonths: string[];
  onSelectMonth: (year: number, month: number) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (catId: string) => void;
  soundEnabled: boolean;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  categories,
  activeYear,
  activeMonth,
  availableMonths,
  onSelectMonth,
  onNavigate,
  onSelectCategory,
  soundEnabled,
}) => {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const savedPct = totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : 0;

  const monthLabel = getMonthDisplayName(activeYear, activeMonth);
  const monthStatus = getMonthStatus(activeYear, activeMonth);

  // Donut chart calculations (circumference = 2 * PI * 38 ≈ 238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // 238.76

  let accumulatedPercent = 0;
  const donutSegments = categories.map((cat) => {
    const fraction = totalSpent > 0 ? cat.spent / totalSpent : 0;
    const strokeDash = fraction * circumference;
    const strokeOffset = -(accumulatedPercent * circumference);
    accumulatedPercent += fraction;

    return {
      id: cat.id,
      color: cat.color,
      name: cat.name,
      spent: cat.spent,
      percent: Math.round(fraction * 100),
      strokeDasharray: `${strokeDash} ${circumference}`,
      strokeDashoffset: strokeOffset,
    };
  });

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24 pt-2 space-y-4">
        {/* Header & Month Pill */}
        <div className="flex items-center justify-between mt-1 mb-2 relative z-20">
          <div className="relative flex items-center space-x-1">
            {/* Previous Month */}
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playWaterDrop();
                const prev = getPreviousMonth(activeYear, activeMonth);
                onSelectMonth(prev.year, prev.month);
              }}
              title="Previous Month"
              aria-label="Previous Month"
              className="w-8 h-8 rounded-full bg-[#0f294a]/80 border border-sky-400/25 flex items-center justify-center text-sky-200 hover:text-white hover:border-cyan-400 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {/* Month Trigger */}
            <button
              type="button"
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-sky-400/25 bg-[#0f294a]/80 text-sky-100 text-xs sm:text-sm shadow-sm hover:border-cyan-400 active:scale-95 transition cursor-pointer"
            >
              <span>{monthLabel}</span>
              {monthStatus === 'current' && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
                  title="Current Month"
                />
              )}
              <span className="material-symbols-outlined text-sky-300 text-sm">expand_more</span>
            </button>

            {/* Next Month */}
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playWaterDrop();
                const next = getNextMonth(activeYear, activeMonth);
                onSelectMonth(next.year, next.month);
              }}
              title="Next Month"
              aria-label="Next Month"
              className="w-8 h-8 rounded-full bg-[#0f294a]/80 border border-sky-400/25 flex items-center justify-center text-sky-200 hover:text-white hover:border-cyan-400 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>

            {showMonthDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#041a33]/98 border border-cyan-400/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg z-30 divide-y divide-cyan-500/20">
                <div className="px-3 py-1.5 bg-[#021124] flex items-center justify-between text-[10px] text-cyan-300/90 font-semibold">
                  <span>Period</span>
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                      monthStatus === 'current'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : monthStatus === 'future'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-400/30'
                    }`}
                  >
                    {monthStatus === 'current' ? 'Current' : monthStatus === 'future' ? 'Future' : 'Past'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 p-1.5 bg-[#03152a]">
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playWaterDrop();
                      const prev = getPreviousMonth(activeYear, activeMonth);
                      onSelectMonth(prev.year, prev.month);
                      setShowMonthDropdown(false);
                    }}
                    className="px-2 py-1 rounded text-[10px] font-semibold bg-[#072445] text-cyan-200 hover:bg-cyan-500/20 text-center"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playWaterDrop();
                      const next = getNextMonth(activeYear, activeMonth);
                      onSelectMonth(next.year, next.month);
                      setShowMonthDropdown(false);
                    }}
                    className="px-2 py-1 rounded text-[10px] font-semibold bg-[#072445] text-cyan-200 hover:bg-cyan-500/20 text-center"
                  >
                    Next →
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto no-scrollbar">
                  {availableMonths.map((ym) => {
                    const { year, month } = parseYearMonth(ym);
                    const isCurrent = activeYear === year && activeMonth === month;
                    const status = getMonthStatus(year, month);
                    const label = getMonthDisplayName(year, month);
                    return (
                      <button
                        key={ym}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) playWaterDrop();
                          onSelectMonth(year, month);
                          setShowMonthDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between ${
                          isCurrent
                            ? 'bg-cyan-500/20 text-cyan-200 font-bold'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        <div className="flex items-center space-x-1 ml-1.5">
                          {status === 'current' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/25 text-emerald-300 font-bold">
                              Now
                            </span>
                          )}
                          {isCurrent && <span className="text-cyan-400 text-[10px]">●</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthDropdown(false);
                    if (soundEnabled) playWaterDrop();
                    onNavigate('month-history');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/20 font-bold flex items-center justify-between"
                >
                  <span>View Month History</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playWaterDrop();
              onNavigate('month-history');
            }}
            title="Open Month History"
            aria-label="Open Month History"
            className="w-9 h-9 rounded-full bg-[#0f294a]/70 flex items-center justify-center text-sky-200 border border-sky-400/25 shadow-sm hover:text-white transition active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
          </button>
        </div>

        {/* Overview Filter Segmented Tab */}
        <div className="flex items-center justify-between p-1 bg-[#092244]/80 border border-sky-500/20 rounded-full shadow-inner">
          <button
            type="button"
            className="flex-1 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 text-slate-950 shadow-md"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playWaterDrop();
              onNavigate('home');
            }}
            className="flex-1 py-1.5 text-xs font-semibold rounded-full text-slate-300 hover:text-white transition"
          >
            Jars View
          </button>
        </div>

        {/* Key Budget Stats 2x2 Matrix */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="glass-card rounded-2xl p-3 border border-sky-400/20 relative">
            <span className="text-[11px] font-medium text-sky-300/80 uppercase tracking-wider block">
              Total Budget
            </span>
            <span className="text-lg font-bold tracking-tight text-white mt-0.5 block">
              ₹{totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="glass-card rounded-2xl p-3 border border-sky-400/20 relative">
            <span className="text-[11px] font-medium text-sky-300/80 uppercase tracking-wider block">
              Total Spent
            </span>
            <span className="text-lg font-bold tracking-tight text-white mt-0.5 block">
              ₹{totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="glass-card rounded-2xl p-3 border border-sky-400/20 relative">
            <span className="text-[11px] font-medium text-sky-300/80 uppercase tracking-wider block">
              Remaining
            </span>
            <span className="text-lg font-bold tracking-tight text-emerald-300 mt-0.5 block">
              ₹{remaining.toLocaleString()}
            </span>
          </div>
          <div className="glass-card rounded-2xl p-3 border border-sky-400/20 relative">
            <span className="text-[11px] font-medium text-sky-300/80 uppercase tracking-wider block">
              Saved
            </span>
            <span className="text-lg font-bold tracking-tight text-cyan-300 mt-0.5 block">
              {savedPct}%
            </span>
          </div>
        </section>

        {/* Spending Distribution Donut Chart & Seashell */}
        <section className="glass-card rounded-2xl p-4 border border-sky-400/25 relative shadow-lg">
          <h3 className="text-xs font-medium text-sky-200/90 tracking-wide mb-3">
            Where did your money go?
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r={radius}
                  stroke="#0e2a4a"
                  strokeWidth="12"
                />
                {totalSpent > 0 &&
                  donutSegments.map((seg) => (
                    <circle
                      key={seg.id}
                      cx="50"
                      cy="50"
                      fill="none"
                      r={radius}
                      stroke={seg.color}
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeWidth="12"
                      className="transition-all duration-500"
                    />
                  ))}
              </svg>
              <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-b from-[#1b4372] to-[#0a2342] flex items-center justify-center shadow-inner border border-sky-300/30">
                <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,200,160,0.5)]">
                  🐚
                </span>
              </div>
            </div>

            <div className="flex-1 pl-2 space-y-1.5 text-xs">
              {categories.map((c) => {
                const pct = totalSpent > 0 ? Math.round((c.spent / totalSpent) * 100) : 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playWaterDrop();
                      onSelectCategory(c.id);
                    }}
                    className="w-full flex items-center justify-between hover:bg-white/5 py-0.5 px-1 rounded transition text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-slate-300 text-[11px] truncate max-w-[70px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-100 text-[11px]">{pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Category Breakdown Progress Rows */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-100 tracking-wide">
            <span>Category Breakdown</span>
            <span className="text-[10px] text-sky-300/70">Click to view jar</span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const pct = cat.budget > 0 ? Math.min(100, Math.round((cat.spent / cat.budget) * 100)) : 0;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playWaterDrop();
                    onSelectCategory(cat.id);
                  }}
                  className="w-full text-left block glass-card p-2.5 rounded-xl border border-sky-500/20 space-y-1.5 hover:bg-white/5 active:scale-98 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium text-slate-200">{cat.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-sky-200/90 font-mono">
                        ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-sky-300 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Beach Motivational Card */}
        <div className="relative rounded-2xl overflow-hidden border border-sky-400/25 shadow-lg h-24 mt-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWxuCo254bNlJ6c-v_8WJrRf-IVzokrs2Xz2uctSAAhDliWhSsb2mKQs3H7sdp56P-KrxoFavwDZsx02tcXePyNN47QSeU-OK6eYa0pOlA_elyfOd1cPdc3-39UFNr8L5yu1XEeDtPoMR__1RvuKMSfNyJsq5FsemEXI_cyx-z6TV9yhi_y0DFzMd0g6HR2n_yjRhVgdce8t9DgGsxHYtBX3VdSCs5mgsk4oE3HphBgCYxUygwd_13zw8oQjHPuVB2Rw"
            alt="Beach Shore"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030b17]/80 via-transparent to-transparent flex items-end justify-center p-2">
            <p className="text-xs font-medium text-sky-100 italic drop-shadow-md">
              "Saving takes you closer to your dreams"
            </p>
          </div>
        </div>
      </div>
      <BottomNav
        currentScreen="insights"
        onNavigate={onNavigate}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
