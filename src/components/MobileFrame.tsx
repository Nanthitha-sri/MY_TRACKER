import React, { useState, useEffect } from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      // 12-hour or 24-hour style
      const formatted = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-[#010a15]">
      <main className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] bg-[#021020] relative sm:rounded-[44px] overflow-hidden flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border-[5px] border-[#132c48]">
        {/* iOS Top Status Bar */}
        <div className="h-11 px-7 flex justify-between items-center z-30 pt-2 shrink-0 select-none text-white text-xs font-semibold tracking-wide">
          <span>{timeStr}</span>
          <div className="w-24 h-4 bg-black/40 rounded-full border border-white/5 backdrop-blur-md" />
          <div className="flex items-center space-x-1.5 opacity-90">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2 17h3v4H2v-4zm5-5h3v9H7v-9zm5-5h3v14h-3V7zm5-5h3v19h-3V2z" />
            </svg>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4c4.08 0 7.74 1.52 10.53 4.04l-2.02 2.39C18.17 8.54 15.24 7.2 12 7.2s-6.17 1.34-8.51 3.23L1.47 8.04C4.26 5.52 7.92 4 12 4zm0 6c2.5 0 4.74.93 6.47 2.47l-2.02 2.39C15.17 13.82 13.67 13 12 13s-3.17.82-4.45 1.86L5.53 12.47C7.26 10.93 9.5 10 12 10zm0 6c1.13 0 2.16.42 2.94 1.13L12 20.21l-2.94-3.08C9.84 16.42 10.87 16 12 16z" />
            </svg>
            <div className="w-5 h-2.5 rounded-xs border border-white flex items-center p-0.5">
              <div className="w-3 h-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Screen Slot */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* iOS Bottom Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
      </main>
    </div>
  );
};
