import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-[#010a15]">
      <main className="w-full max-w-[420px] h-[100dvh] sm:h-[880px] bg-[#021020] relative sm:rounded-[44px] overflow-hidden flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border-[5px] border-[#132c48] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        {/* Dynamic Screen Slot - begins naturally below real system status bar */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />
      </main>
    </div>
  );
};
