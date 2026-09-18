import React, { useState } from 'react';

export interface VisualizerProps {
  pctLeft?: number;
  percentageLeft?: number;
  percentageUsed?: number;
  spent?: number;
  budget?: number;
  size?: 'sm' | 'lg';
  image?: string;
  badgeImg?: string;
  creatureImg?: string;
  icon?: string;
}

const getSafePct = (pctLeft?: number, percentageLeft?: number): number => {
  if (typeof pctLeft === 'number' && !isNaN(pctLeft)) return pctLeft;
  if (typeof percentageLeft === 'number' && !isNaN(percentageLeft)) return percentageLeft;
  return 100;
};

/**
 * 1. Flower Jar Visualizer (for Self Expenses)
 * - Glass jar with lid rim
 * - Translucent aqua ocean water
 * - Golden sandy bed at bottom
 * - Animated floating bubbles
 * - Glowing 5-petal pink cherry blossom / sakura flower with soft pink radiance
 */
export const FlowerJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, percentageLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const effectiveWaterHeight = Math.max(16, Math.min(92, val));

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/30 to-cyan-950/75 border border-cyan-400/40 shadow-[0_12px_28px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col justify-end select-none`}
    >
      {/* Jar Top Lid Rim */}
      <div className="absolute top-1 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />

      {/* Glass Specular Reflection on left */}
      <div className="absolute top-3 left-1.5 w-1 h-20 sm:h-36 bg-gradient-to-b from-white/50 via-white/25 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Translucent Water Fill Body */}
      <div
        className="water-fill transition-all duration-700 z-10 pointer-events-none"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />

        {/* Ambient deep water glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8]/20 via-[#0077b6]/35 to-[#03045e]/60 pointer-events-none" />

        {/* Animated Floating Bubbles */}
        <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
        {isLarge && (
          <>
            <div className="absolute bottom-10 left-6 w-1.5 h-1.5 rounded-full bg-white/50 animate-float-bubble-1" />
            <div className="absolute bottom-3 right-8 w-1 h-1 rounded-full bg-white/60 animate-float-bubble-2" />
          </>
        )}
      </div>

      {/* THE GLOWING PINK CHERRY BLOSSOM FLOWER (Always in foreground and visible!) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15 pt-2">
        <div className="relative animate-float-gentle flex items-center justify-center">
          {/* Soft pink bloom aura glow */}
          <div
            className={`absolute ${isLarge ? 'w-20 h-20' : 'w-14 h-14'} rounded-full bg-[#ff3385]/40 blur-xl pointer-events-none`}
          />
          <div
            className={`absolute ${isLarge ? 'w-14 h-14' : 'w-10 h-10'} rounded-full bg-[#ff70a6]/50 blur-md pointer-events-none`}
          />

          {/* SVG Flower with 5 rounded petals */}
          <svg
            className={`${isLarge ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-9 h-9 sm:w-10 sm:h-10'} filter drop-shadow-[0_0_12px_rgba(255,105,180,0.95)]`}
            viewBox="0 0 100 100"
          >
            <defs>
              <radialGradient id="sakuraPetalGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffc0d3" />
                <stop offset="45%" stopColor="#ff659b" />
                <stop offset="100%" stopColor="#e61d6e" />
              </radialGradient>
              <radialGradient id="sakuraCenterGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fed7e2" />
                <stop offset="100%" stopColor="#f472b6" />
              </radialGradient>
            </defs>

            {/* 5 Petals rotated at 72 deg */}
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <path
                  d="M50,50 C40,40 33,26 40,16 C45,10 49,12 50,14 C51,12 55,10 60,16 C67,26 60,40 50,50 Z"
                  fill="url(#sakuraPetalGrad)"
                  stroke="#ffe4e6"
                  strokeWidth="0.8"
                />
              </g>
            ))}

            {/* Flower Center Core */}
            <circle cx="50" cy="50" r="10" fill="url(#sakuraCenterGrad)" />

            {/* 5 Delicate Pistils */}
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle + 36} 50 50)`}>
                <line x1="50" y1="50" x2="50" y2="42" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="50" cy="41" r="1.8" fill="#ffe066" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-3.5 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      {/* Bottom Underglow */}
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/50 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 2. Shell Jar Visualizer (for REM)
 * - Glass jar with lid rim
 * - Translucent deep blue ocean water
 * - Glowing circular aqua aura with 3D spiral conch shell
 * - Sandy bed at base
 */
export const ShellJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, percentageLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const effectiveWaterHeight = Math.max(16, Math.min(92, val));

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/30 to-cyan-950/75 border border-cyan-400/40 shadow-[0_12px_28px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col justify-end select-none`}
    >
      {/* Jar Top Lid Rim */}
      <div className="absolute top-1 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />

      {/* Specular Highlight */}
      <div className="absolute top-3 left-1.5 w-1 h-20 sm:h-36 bg-gradient-to-b from-white/50 via-white/25 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Translucent Water Fill */}
      <div
        className="water-fill transition-all duration-700 z-10 pointer-events-none"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0096c7]/20 via-[#023e8a]/35 to-[#03045e]/60 pointer-events-none" />

        {/* Animated Floating Bubbles */}
        <div className="absolute bottom-5 left-4 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-8 right-4 w-2 h-2 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
      </div>

      {/* GLOWING ORB WITH 3D SPIRAL SHELL (Visible in foreground!) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15 pt-2">
        <div className="relative animate-float-gentle flex items-center justify-center">
          {/* Luminous Aqua Sphere Aura */}
          <div
            className={`${
              isLarge ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-11 h-11'
            } rounded-full bg-gradient-to-tr from-[#00d2ff]/40 via-[#38bdf8]/35 to-[#a5f3fc]/50 border border-cyan-300/50 shadow-[0_0_22px_rgba(0,210,255,0.85)] flex items-center justify-center backdrop-blur-xs`}
          >
            {/* 3D Spiral Conch Shell SVG */}
            <svg
              className={`${isLarge ? 'w-9 h-9 sm:w-11 sm:h-11' : 'w-7 h-7'} filter drop-shadow-[0_2px_8px_rgba(0,229,255,0.7)]`}
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="shellBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#f1f5f9" />
                  <stop offset="80%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="shellApertureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#311942" />
                  <stop offset="70%" stopColor="#6b21a8" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="shellHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              <g transform="rotate(-25 50 50)">
                <path d="M50,14 C46,14 44,18 45,22 C46,26 54,26 55,22 C56,18 54,14 50,14 Z" fill="url(#shellBodyGrad)" />
                <path d="M43,22 C38,24 38,32 44,35 C52,38 60,34 58,26 C57,22 47,20 43,22 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                <path d="M37,33 C30,37 31,48 40,51 C54,55 67,49 65,37 C64,31 43,30 37,33 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                <path d="M31,48 C22,54 24,67 36,71 C55,77 75,69 72,52 C70,43 40,43 31,48 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                <path d="M26,67 C17,76 22,90 38,91 C58,92 78,82 82,68 C84,54 36,58 26,67 Z" fill="url(#shellBodyGrad)" stroke="#94a3b8" strokeWidth="1" />

                {/* Violet Aperture */}
                <ellipse cx="62" cy="74" rx="14" ry="10" fill="url(#shellApertureGrad)" transform="rotate(-25 62 74)" />
                <ellipse cx="63" cy="74" rx="10" ry="6.5" fill="#1c0a2a" transform="rotate(-25 63 74)" />

                {/* Highlight */}
                <path d="M28,68 C34,62 50,60 70,66" stroke="url(#shellHighlight)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            </svg>
          </div>
          {/* Under-glow pool */}
          <div className="absolute -bottom-2 w-12 h-2 rounded-full bg-cyan-400/50 blur-xs" />
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-3.5 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/50 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 3. Battery Thunderstorm Visualizer (for Recharge)
 * - Rounded rectangular battery capsule with top terminal
 * - Frosted glass casing with cyan edge illumination
 * - Center rounded cyan square tile with dark thunderstorm bolt (⚡)
 * - Dynamic percentage text
 * - Luminous energy fluid at base with glowing indicator
 */
export const BatteryThunderVisualizer: React.FC<VisualizerProps> = ({ pctLeft, percentageLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const displayPercent = Math.max(14, val);
  const fluidHeight = Math.max(16, Math.min(88, val));

  return (
    <div
      className={`relative ${heightClass} rounded-[22px] sm:rounded-[30px] bg-gradient-to-b from-[#0a233f]/75 via-[#07192d]/85 to-[#020e1a]/95 border-[1.8px] border-cyan-400/50 shadow-[0_0_25px_rgba(0,210,255,0.35)] overflow-hidden flex flex-col justify-between p-1 select-none`}
    >
      {/* Top Battery Terminal Rim */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-2 sm:h-2.5 rounded-t-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 border border-white/70 shadow-[0_0_8px_#00e5ff] z-20" />

      {/* Glass highlights */}
      <div className="absolute inset-1 rounded-[18px] sm:rounded-[26px] border border-cyan-300/20 pointer-events-none z-20" />
      <div className="absolute top-2.5 left-2 w-1 h-14 sm:h-28 bg-white/25 rounded-full blur-[0.5px] pointer-events-none z-20" />

      {/* Horizontal Gauge Line */}
      <div className="absolute top-[48%] left-2 right-2 h-[1px] bg-cyan-400/30 pointer-events-none z-10" />

      {/* CENTER GLOWING THUNDER TILE & PERCENTAGE */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto pt-2 pointer-events-none">
        <div
          className={`${
            isLarge ? 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl' : 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl'
          } bg-gradient-to-tr from-[#38bdf8] via-[#5eead4] to-[#a5f3fc] shadow-[0_0_18px_rgba(56,189,248,0.9)] flex items-center justify-center border border-white/70 animate-bolt-pulse`}
        >
          <svg
            className={`${isLarge ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-4 h-4 sm:w-5 sm:h-5'} text-slate-950 fill-current`}
            viewBox="0 0 24 24"
          >
            <path d="M13 2L3 14h7v8l10-12h-7z" />
          </svg>
        </div>

        {/* Dynamic Percentage Display */}
        <div className="mt-1 text-center">
          <span
            className={`${
              isLarge ? 'text-sm sm:text-base' : 'text-xs'
            } font-extrabold text-[#7dd3fc] tracking-wider drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]`}
          >
            {displayPercent}%
          </span>
        </div>
      </div>

      {/* Liquid Energy Fluid Fill at Base */}
      <div
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0099ff] via-[#00d2ff] to-[#70f1ff] shadow-[0_0_18px_rgba(0,210,255,0.75)] transition-all duration-700 z-15 flex flex-col justify-start"
        style={{ height: `${fluidHeight}%` }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#bbf7d0] via-white to-[#38bdf8] shadow-[0_0_8px_#ffffff]" />
        <div className="absolute top-1.5 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
        <div className="absolute top-1.5 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_6px_#00e5ff]" />
      </div>
    </div>
  );
};

/**
 * 4. Home Jar Visualizer (for Home)
 * - Glass jar with lid rim & reflections
 * - Full-bleed home picture fitting the whole jar (no circle shape)
 * - Translucent aqua water level overlay with animated bubbles
 * - Fallback cozy cottage vector illustration if image fails
 * - Golden sandy bed
 */
export const HomeJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, percentageLeft, size = 'lg', image }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const effectiveWaterHeight = Math.max(16, Math.min(92, val));

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/30 to-cyan-950/75 border border-cyan-400/40 shadow-[0_12px_28px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col justify-end select-none`}
    >
      {/* Full-bleed Home Image fitting the whole jar without any circular frame */}
      <div className="absolute inset-0 z-0">
        {image && !imgFailed ? (
          <img
            src={image}
            alt="Home Sanctuary"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#082b4c] via-[#0f4c81] to-[#082b4c] flex items-center justify-center p-3">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="homeSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#082b4c" />
                  <stop offset="100%" stopColor="#0f4c81" />
                </linearGradient>
                <linearGradient id="homeRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="url(#homeSkyGrad)" />
              <circle cx="75" cy="25" r="8" fill="#fef08a" opacity="0.9" />
              <rect x="30" y="48" width="40" height="34" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="50,24 22,48 78,48" fill="url(#homeRoofGrad)" stroke="#fef08a" strokeWidth="1" />
              <rect x="42" y="56" width="16" height="16" rx="2" fill="#fef08a" className="animate-pulse" />
              <line x1="50" y1="56" x2="50" y2="72" stroke="#d97706" strokeWidth="1" />
              <line x1="42" y1="64" x2="58" y2="64" stroke="#d97706" strokeWidth="1" />
              <rect x="44" y="72" width="12" height="10" rx="1" fill="#b45309" />
            </svg>
          </div>
        )}
      </div>

      {/* Jar Top Lid Rim */}
      <div className="absolute top-1 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />

      {/* Glass Specular Reflection on left */}
      <div className="absolute top-3 left-1.5 w-1 h-20 sm:h-36 bg-gradient-to-b from-white/60 via-white/30 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Translucent Water Fill overlay */}
      <div
        className="water-fill transition-all duration-700 z-10 pointer-events-none"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8]/20 via-[#0077b6]/30 to-[#03045e]/50 pointer-events-none" />
        <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-3.5 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/50 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 5. Self Care Jar Visualizer (for Self Care)
 * - Glass jar with lid rim & reflections
 * - Translucent aqua ocean water with bubbles
 * - Displays the cute aquatic creature picture (`creatureImg` or `badgeImg`)
 * - Fallback aquatic dolphin/otter illustration
 * - Sandy bed
 */
export const SelfCareJarVisualizer: React.FC<VisualizerProps> = ({
  pctLeft,
  percentageLeft,
  size = 'lg',
  creatureImg,
  badgeImg,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const effectiveWaterHeight = Math.max(16, Math.min(92, val));
  const activeImg = creatureImg || badgeImg;

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/30 to-cyan-950/75 border border-cyan-400/40 shadow-[0_12px_28px_rgba(0,229,255,0.25)] overflow-hidden flex flex-col justify-end select-none`}
    >
      <div className="absolute top-1 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />
      <div className="absolute top-3 left-1.5 w-1 h-20 sm:h-36 bg-gradient-to-b from-white/50 via-white/25 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Translucent Water Fill */}
      <div
        className="water-fill transition-all duration-700 z-10 pointer-events-none"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00b4d8]/20 via-[#0077b6]/35 to-[#03045e]/60 pointer-events-none" />
        <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
      </div>

      {/* Aquatic Creature Picture Floating (Always in foreground!) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15 pt-2">
        <div className="relative animate-float-gentle flex items-center justify-center">
          {/* Luminous Teal/Cyan Glow */}
          <div
            className={`absolute ${
              isLarge ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16'
            } rounded-full bg-cyan-400/35 blur-xl pointer-events-none`}
          />

          {activeImg && !imgFailed ? (
            <div className="relative flex items-center justify-center">
              <img
                src={activeImg}
                alt="Self Care Creature"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className={`${
                  isLarge ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-14 h-14 sm:w-16 sm:h-16'
                } object-contain filter drop-shadow-[0_0_16px_rgba(56,189,248,0.95)]`}
              />
            </div>
          ) : (
            /* Fallback Glowing Pearl & Seashell Illustration */
            <div
              className={`${
                isLarge ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-11 h-11'
              } rounded-full bg-gradient-to-tr from-cyan-500/40 via-teal-300/40 to-white/60 border border-cyan-300/60 shadow-[0_0_20px_rgba(0,210,255,0.75)] flex items-center justify-center`}
            >
              <svg className={`${isLarge ? 'w-10 h-10' : 'w-7 h-7'}`} viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" fill="url(#careWaterGrad)" />
                <defs>
                  <radialGradient id="careWaterGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="70%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="16" fill="#ffffff" filter="drop-shadow(0 0 8px #a7f3d0)" />
                <circle cx="46" cy="46" r="4" fill="#e0f2fe" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-3.5 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/50 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 6. PG Jar Visualizer (for PG / Rent Shelter)
 * - Glass jar with lid rim & reflections
 * - Translucent deep cyan water fill
 * - Warm shelter / peaceful hostel building illustration with glowing windows
 * - Sandy bed
 */
export const PGJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, percentageLeft, size = 'lg', icon }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const val = getSafePct(pctLeft, percentageLeft);
  const effectiveWaterHeight = Math.max(16, Math.min(92, val));

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-indigo-950/30 to-indigo-950/75 border border-indigo-400/40 shadow-[0_12px_28px_rgba(99,102,241,0.25)] overflow-hidden flex flex-col justify-end select-none`}
    >
      <div className="absolute top-1 left-2 sm:left-3 right-2 sm:right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />
      <div className="absolute top-3 left-1.5 w-1 h-20 sm:h-36 bg-gradient-to-b from-white/50 via-white/25 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Translucent Water Fill */}
      <div
        className="water-fill transition-all duration-700 z-10 pointer-events-none"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/20 via-[#4338ca]/35 to-[#1e1b4b]/65 pointer-events-none" />
        <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
      </div>

      {/* Peaceful Shelter Building Picture Floating (Always visible!) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15 pt-2">
        <div className="relative animate-float-gentle flex items-center justify-center">
          {/* Indigo / Lavender Aura */}
          <div
            className={`absolute ${
              isLarge ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16'
            } rounded-full bg-indigo-500/35 blur-xl pointer-events-none`}
          />

          <div
            className={`${
              isLarge ? 'w-18 h-18 sm:w-22 sm:h-22' : 'w-12 h-12'
            } rounded-2xl p-1 bg-gradient-to-tr from-indigo-500/50 via-sky-400/40 to-indigo-200/60 border border-indigo-300/50 shadow-[0_0_20px_rgba(99,102,241,0.7)] flex items-center justify-center`}
          >
            {/* Shelter SVG */}
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="pgBldgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              {/* Moon */}
              <circle cx="78" cy="22" r="7" fill="#fef08a" />
              {/* Main Building */}
              <rect x="25" y="32" width="50" height="58" rx="4" fill="url(#pgBldgGrad)" stroke="#818cf8" strokeWidth="1.5" />
              {/* Roof Antenna */}
              <line x1="50" y1="20" x2="50" y2="32" stroke="#818cf8" strokeWidth="1.5" />
              <circle cx="50" cy="19" r="2.5" fill="#f43f5e" />
              {/* Glowing Windows Grid */}
              <rect x="33" y="40" width="12" height="10" rx="2" fill="#fef08a" />
              <rect x="55" y="40" width="12" height="10" rx="2" fill="#fef08a" />
              <rect x="33" y="56" width="12" height="10" rx="2" fill="#fef08a" />
              <rect x="55" y="56" width="12" height="10" rx="2" fill="#38bdf8" />
              {/* Warm Entrance Door */}
              <rect x="44" y="74" width="12" height="16" rx="2" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-3.5 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-indigo-400/50 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * Master Visualizer Dispatcher
 * Automatically chooses the exact visualizer for:
 * - 'self-expenses' -> FlowerJarVisualizer (Sakura flower)
 * - 'rem'           -> ShellJarVisualizer (Conch shell)
 * - 'recharge'      -> BatteryThunderVisualizer (Lightning bolt)
 * - 'home'          -> HomeJarVisualizer (Home sanctuary photo)
 * - 'self-care'     -> SelfCareJarVisualizer (Aquatic creature)
 * - 'pg'            -> PGJarVisualizer (Shelter building)
 * - default         -> HomeJarVisualizer (or Fallback)
 */
export const CategoryVisualizer: React.FC<
  VisualizerProps & {
    categoryId: string;
  }
> = (props) => {
  const { categoryId } = props;

  if (categoryId === 'self-expenses') {
    return <FlowerJarVisualizer {...props} />;
  }

  if (categoryId === 'recharge') {
    return <BatteryThunderVisualizer {...props} />;
  }

  if (categoryId === 'rem') {
    return <ShellJarVisualizer {...props} />;
  }

  if (categoryId === 'self-care') {
    return <SelfCareJarVisualizer {...props} />;
  }

  if (categoryId === 'pg') {
    return <PGJarVisualizer {...props} />;
  }

  // 'home' and any custom category:
  return <HomeJarVisualizer {...props} />;
};
