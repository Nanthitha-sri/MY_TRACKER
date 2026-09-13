import React, { useState } from 'react';
import { Category, ScreenType } from '../types';
import { BottomNav } from './BottomNav';
import { audioManager } from '../utils/audio';
import {
  parseYearMonth,
  getMonthDisplayName,
  getPreviousMonth,
  getNextMonth,
  getMonthStatus,
} from '../db/indexedDB';

interface HomeScreenProps {
  categories: Category[];
  activeYear: number;
  activeMonth: number;
  availableMonths: string[];
  onSelectMonth: (year: number, month: number) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (catId: string) => void;
  soundEnabled?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
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
  const percentRemaining = totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : 0;

  const currentMonthLabel = getMonthDisplayName(activeYear, activeMonth);
  const monthStatus = getMonthStatus(activeYear, activeMonth);

  const handleCategoryClick = (catId: string) => {
    audioManager.play('waterRipple');
    onSelectCategory(catId);
  };

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24 pt-1 space-y-3.5">
        {/* Header with Pearls & Starfish */}
        <header className="relative px-2 pt-1">
          <div className="absolute right-1 -top-1 w-12 h-12 pointer-events-none filter drop-shadow-[0_4px_10px_rgba(255,160,80,0.4)]">
            <svg className="w-full h-full rotate-12" viewBox="0 0 100 100">
              <polygon
                fill="url(#homeStarfish)"
                points="50,5 64,36 98,39 72,62 80,95 50,78 20,95 28,62 2,39 36,36"
                stroke="#c97d44"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="50" fill="#ffe0b2" opacity="0.9" r="3" />
              <defs>
                <linearGradient id="homeStarfish" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8a966" />
                  <stop offset="60%" stopColor="#dd7333" />
                  <stop offset="100%" stopColor="#b64e1e" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-0.5">
              <span className="material-symbols-outlined text-amber-300 text-lg">wb_sunny</span>
              <svg
                className="w-7 h-2 text-cyan-300 opacity-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 6"
              >
                <path d="M2 3c3-3 5 3 8 0s5 3 8 0 5 3 6 1" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-handwriting font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)] flex items-center">
              Good Day! <span className="text-rose-300 text-2xl ml-1 font-normal">♡</span>
            </h1>
          </div>
          <p className="text-[13px] text-cyan-200/90 font-medium pl-8 -mt-1 flex items-center tracking-tight">
            Small steps, bigger dreams <span className="ml-1 text-sm">🌊</span>
          </p>

          {/* Month Picker & Summary */}
          <div className="mt-3 flex items-center justify-between relative z-20">
            <div className="relative flex items-center space-x-1">
              {/* Previous Month */}
              <button
                type="button"
                onClick={() => {
                  audioManager.play('monthChange');
                  const prev = getPreviousMonth(activeYear, activeMonth);
                  onSelectMonth(prev.year, prev.month);
                }}
                title="Previous Month"
                aria-label="Previous Month"
                className="w-7 h-7 rounded-full bg-[#0d2a4d]/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-400 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {/* Month Trigger */}
              <button
                type="button"
                onClick={() => {
                  audioManager.play('buttonTap');
                  setShowMonthDropdown(!showMonthDropdown);
                }}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-[#0d2a4d]/90 border border-cyan-500/30 text-xs font-medium text-cyan-100 backdrop-blur-md shadow-sm hover:border-cyan-400 active:scale-95 transition cursor-pointer"
              >
                <span>{currentMonthLabel}</span>
                {monthStatus === 'current' && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
                    title="Current Month"
                  />
                )}
                <span className="material-symbols-outlined text-cyan-300 text-sm">expand_more</span>
              </button>

              {/* Next Month */}
              <button
                type="button"
                onClick={() => {
                  audioManager.play('monthChange');
                  const next = getNextMonth(activeYear, activeMonth);
                  onSelectMonth(next.year, next.month);
                }}
                title="Next Month"
                aria-label="Next Month"
                className="w-7 h-7 rounded-full bg-[#0d2a4d]/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-400 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>

              {/* Calendar Button */}
              <button
                type="button"
                onClick={() => {
                  audioManager.play('buttonTap');
                  onNavigate('month-history');
                }}
                title="Open Month History"
                aria-label="Open Month History"
                className="w-7 h-7 rounded-full bg-[#0d2a4d]/90 border border-cyan-500/30 flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-400 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span>
              </button>

              {showMonthDropdown && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#041a33]/98 border border-cyan-400/40 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg z-30 divide-y divide-cyan-500/20">
                  <div className="px-3 py-1.5 bg-[#021124] flex items-center justify-between text-[10px] text-cyan-300/90 font-semibold">
                    <span>Month Status</span>
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

                  {/* Quick step buttons */}
                  <div className="grid grid-cols-2 gap-1 p-1.5 bg-[#03152a]">
                    <button
                      type="button"
                      onClick={() => {
                        audioManager.play('monthChange');
                        const prev = getPreviousMonth(activeYear, activeMonth);
                        onSelectMonth(prev.year, prev.month);
                        setShowMonthDropdown(false);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-semibold bg-[#072445] text-cyan-200 hover:bg-cyan-500/20 text-center cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        audioManager.play('monthChange');
                        const next = getNextMonth(activeYear, activeMonth);
                        onSelectMonth(next.year, next.month);
                        setShowMonthDropdown(false);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-semibold bg-[#072445] text-cyan-200 hover:bg-cyan-500/20 text-center cursor-pointer"
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
                            audioManager.play('monthChange');
                            onSelectMonth(year, month);
                            setShowMonthDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs transition flex items-center justify-between cursor-pointer ${
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
                      audioManager.play('buttonTap');
                      onNavigate('month-history');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/20 font-bold flex items-center justify-between cursor-pointer"
                  >
                    <span>View All Months</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-cyan-300/80 block">
                Total Budget
              </span>
              <span className="text-base font-bold text-white tracking-tight">
                ₹{totalBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Card - Money Left */}
        <section className="glass-water-card hero-glow-border rounded-3xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#06335a]/50 via-[#01426e]/70 to-[#02213d] pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-4 top-4 text-3xl filter drop-shadow-[0_4px_12px_rgba(255,180,140,0.5)]">
            🐚
          </div>

          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-200/90 flex items-center">
              Money Left
            </span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5 flex items-baseline">
              <span className="text-2xl mr-0.5 font-bold">₹</span>
              {remaining.toLocaleString()}
            </div>

            {/* Aqua Wave Progress */}
            <div className="mt-3 relative h-5 w-full bg-[#02182c]/80 rounded-full p-0.5 border border-cyan-400/30 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#00f2fe] shadow-[0_0_12px_#00c6ff] transition-all duration-700"
                style={{ width: `${percentRemaining}%` }}
              >
                <div className="w-full h-1/2 bg-white/40 rounded-t-full" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-medium text-cyan-100/90 mt-2 px-0.5">
              <span className="flex items-center text-cyan-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 inline-block" />
                ₹{totalSpent.toLocaleString()} spent
              </span>
              <span className="font-semibold text-emerald-300">{percentRemaining}% remaining</span>
            </div>

            {/* Shoreline Sand Message */}
            <div className="mt-4 pt-3 pb-2 px-3 rounded-2xl bg-gradient-to-r from-[#fae7c9]/15 via-[#f0cf9e]/20 to-[#021e3a]/40 border border-amber-200/25 flex flex-col items-center justify-center text-center">
              <p className="font-handwriting text-xl text-[#ffebcc] drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] tracking-wide">
                Spend mindfully
              </p>
              <p className="font-handwriting text-xl text-[#fbe1b8] -mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] tracking-wide flex items-center">
                Live fully <span className="text-rose-300 ml-1 text-base">♡</span>
              </p>
            </div>
          </div>
        </section>

        {/* Mason Jars 3x2 Grid */}
        <section className="pt-1">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Your Categories
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('insights')}
              className="text-xs text-cyan-400 font-medium hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const left = Math.max(0, cat.budget - cat.spent);
              const pct = Math.max(8, Math.round((left / (cat.budget || 1)) * 100));

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex flex-col items-center group cursor-pointer text-left focus:outline-none"
                >
                  <div className="w-full h-28 glass-jar flex flex-col justify-end p-1.5 relative group-hover:border-cyan-300 group-active:scale-95 transition-all">
                    <div className="absolute top-1 left-2 right-2 h-1.5 jar-lid-rim" />
                    <div
                      className="water-fill transition-all duration-700"
                      style={{ height: `${pct}%` }}
                    >
                      <div className="water-line" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full pt-2">
                      <div className="w-9 h-9 rounded-full bg-cyan-950/40 backdrop-blur-sm flex items-center justify-center border border-cyan-300/30 text-lg shadow-sm">
                        {cat.icon}
                      </div>
                    </div>
                    <div className="absolute top-3 left-1.5 w-1 h-16 bg-white/30 rounded-full blur-[0.5px]" />
                  </div>

                  <div className="text-center mt-1.5 w-full">
                    <p className="text-xs font-semibold text-white truncate">{cat.name}</p>
                    <p className="text-[11px] text-cyan-200 font-bold">₹{cat.budget.toLocaleString()}</p>
                    <p className="text-[10px] text-cyan-300/75 truncate">
                      left ₹{left.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <BottomNav
        currentScreen="home"
        onNavigate={onNavigate}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
