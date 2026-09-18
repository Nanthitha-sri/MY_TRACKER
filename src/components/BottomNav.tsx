import React from 'react';
import { ScreenType } from '../types';
import { playWaterDrop } from '../utils/audio';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
}) => {
  const handleNav = (screen: ScreenType) => {
    if (soundEnabled) playWaterDrop();
    onNavigate(screen);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 sand-glass-bar h-[74px] px-8 flex justify-between items-center z-40">
      {/* Home Tab */}
      <button
        type="button"
        onClick={() => handleNav('home')}
        className={`flex flex-col items-center justify-center transition-colors ${
          currentScreen === 'home' ? 'text-cyan-300' : 'text-cyan-100/60 hover:text-cyan-200'
        }`}
      >
        <div className="p-1 rounded-xl">
          <svg
            className={`w-5 h-5 ${currentScreen === 'home' ? 'text-cyan-300 drop-shadow-[0_0_8px_#38bdf8]' : ''}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold tracking-wider">Home</span>
      </button>

      {/* Center Elevated (+) Action Button */}
      <div className="relative -top-5">
        <button
          type="button"
          onClick={() => handleNav('add-expense')}
          aria-label="Add Expense"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0099ff] via-[#00d2ff] to-[#70f1ff] p-[2px] shadow-[0_4px_22px_rgba(0,195,255,0.7)] flex items-center justify-center active:scale-95 transition-transform hover:brightness-110"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0094d4] to-[#01579b] flex items-center justify-center border border-white/40 shadow-inner">
            <svg
              className="w-7 h-7 text-white drop-shadow-md"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </button>
      </div>

      {/* Insights Tab */}
      <button
        type="button"
        onClick={() => handleNav('insights')}
        className={`flex flex-col items-center justify-center transition-colors ${
          currentScreen === 'insights' ? 'text-cyan-300' : 'text-cyan-100/60 hover:text-cyan-200'
        }`}
      >
        <div className="p-1 rounded-xl relative">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {currentScreen === 'insights' && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#38bdf8]" />
          )}
        </div>
        <span className="text-[10px] font-semibold tracking-wider">Insights</span>
      </button>

      {/* Settings Tab */}
      <button
        type="button"
        onClick={() => handleNav('settings')}
        className={`flex flex-col items-center justify-center transition-colors ${
          currentScreen === 'settings' ? 'text-cyan-300' : 'text-cyan-100/60 hover:text-cyan-200'
        }`}
      >
        <div className="p-1 rounded-xl">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-[10px] font-semibold tracking-wider">Settings</span>
      </button>
    </nav>
  );
};
