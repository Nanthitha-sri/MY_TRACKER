import React, { useState } from 'react';
import { Category, ScreenType, SettingsState } from '../types';
import { BottomNav } from './BottomNav';
import { playWaterDrop, playOceanChime } from '../utils/audio';

interface SettingsScreenProps {
  categories: Category[];
  settings: SettingsState;
  onUpdateSettings: (newSettings: SettingsState) => void;
  onResetData: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  categories,
  settings,
  onUpdateSettings,
  onResetData,
  onNavigate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);

  const toggleSetting = (key: keyof SettingsState) => {
    const nextVal = !settings[key];
    if (nextVal) {
      playOceanChime();
    } else {
      playWaterDrop();
    }
    onUpdateSettings({
      ...settings,
      [key]: nextVal,
    });
  };

  const soundToggles = [
    {
      key: 'soundHaptic' as const,
      label: 'Sounds & Haptics',
      state: settings.soundHaptic,
      icon: 'volume_up',
    },
    {
      key: 'buttonSound' as const,
      label: 'Button Sounds',
      state: settings.buttonSound,
      icon: 'tune',
    },
    {
      key: 'expenseAddedSound' as const,
      label: 'Expense Added Sound',
      state: settings.expenseAddedSound,
      icon: 'music_note',
    },
    {
      key: 'budgetWarningSound' as const,
      label: 'Budget Warning Sound',
      state: settings.budgetWarningSound,
      icon: 'notifications_active',
    },
    {
      key: 'hapticFeedback' as const,
      label: 'Haptic Feedback',
      state: settings.hapticFeedback,
      icon: 'vibration',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between relative overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24 pt-2 space-y-4">
        {/* Header */}
        <section className="relative pt-1 pb-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (settings.buttonSound) playWaterDrop();
              onNavigate('home');
            }}
            aria-label="Go Back"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-200 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h1 className="text-xl font-medium tracking-wide text-white text-center drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)]">
            Settings
          </h1>
          <div className="w-9 h-9 flex items-center justify-center text-2xl">⭐</div>
        </section>

        {/* Sounds & Feedback Toggle List */}
        <section className="glass-card rounded-3xl p-2 divide-y divide-cyan-500/10">
          {soundToggles.map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2.5 px-3">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-cyan-300 text-lg">
                  {item.icon}
                </span>
                <span className="text-xs font-medium text-slate-100">{item.label}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting(item.key)}
                className={`w-11 h-6 rounded-full transition-all duration-300 p-0.5 flex items-center cursor-pointer ${
                  item.state
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-300'
                    : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-all transform shadow-md ${
                    item.state ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </section>

        {/* Ocean Budget & Allocation Links */}
        <section className="glass-card rounded-3xl p-2 divide-y divide-cyan-500/10">
          <button
            type="button"
            onClick={() => {
              if (settings.buttonSound) playWaterDrop();
              onNavigate('insights');
            }}
            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-cyan-500/5 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🐚</span>
              <div>
                <p className="text-xs font-semibold text-slate-100">Budget Setup</p>
                <p className="text-[10px] text-cyan-200/60">
                  Target: ₹{totalBudget.toLocaleString()} / month
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-cyan-400/60 text-sm">
              arrow_forward_ios
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (settings.buttonSound) playWaterDrop();
              onNavigate('insights');
            }}
            className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-cyan-500/5 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🌊</span>
              <div>
                <p className="text-xs font-semibold text-slate-100">Month History</p>
                <p className="text-[10px] text-cyan-200/60">Tidal analytics &amp; archives</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-cyan-400/60 text-sm">
              arrow_forward_ios
            </span>
          </button>

          {/* Reset Demo Data Action */}
          <div className="py-2.5 px-3">
            {showResetConfirm ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-rose-300 font-medium">Reset sample data?</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      playWaterDrop();
                      onResetData();
                      setShowResetConfirm(false);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 text-slate-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔄</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-rose-300 transition">
                      Restore Sample Data
                    </p>
                    <p className="text-[10px] text-slate-400">Re-initialize ocean tracker demo</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-sm">refresh</span>
              </button>
            )}
          </div>
        </section>

        {/* Postcard Sunset Inspiration Card */}
        <article
          className="rounded-3xl overflow-hidden shadow-2xl border border-amber-200/20 text-slate-900 p-5 pt-6 pb-6 relative select-none"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHeGS3_uj2oX12DuKep5Ufbz3iA8XFw55n65dsq1FBvKKghFSC5O_pEZ9RBjUQKDPqnIAw4K7BfhrExaQBkgqf0PhyFVRM3mc7HN2kotMXk44lFQKJOH_dZ0EMCucdu8UKYy0EQaBstjvLH5H0jMIJ9TFSO-cQHs6B6V1OAgBZOFNjgvzaRvfdTweDAF77HsK_vbiiX-02Tnv5PI3cUejRsd_CDxUorAh1tHqYNRof-MBAHpkX5_yZNUx_D2HvSSPQVGMO4Za5m0x4zA")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 max-w-[210px] space-y-1">
            <h2 className="text-3xl font-serif italic tracking-wide text-cyan-950 drop-shadow-sm leading-tight">
              Discipline <br />
              <span className="text-2xl font-serif font-light text-slate-900">today,</span>
            </h2>
            <p className="text-base font-serif italic text-cyan-900 leading-snug">
              a freer tomorrow <span className="text-amber-800 text-sm not-italic">♡</span>
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-amber-900/20 flex items-end justify-between relative z-10">
            <div className="bg-[#e9caa2] border-2 border-[#b58c5d] px-3 py-1.5 rounded-lg shadow-md rotate-[-2deg] text-center">
              <span className="block text-[10px] font-serif font-bold tracking-wider text-[#79532d] leading-tight">
                START
                <br />
                SAVING
              </span>
            </div>
          </div>
        </article>
      </div>
      <BottomNav
        currentScreen="settings"
        onNavigate={onNavigate}
        soundEnabled={settings.buttonSound}
      />
    </div>
  );
};
