import React from 'react';

interface VisualizerProps {
  pctLeft: number;
  size?: 'sm' | 'lg';
}

/**
 * 1. Flower Jar Visualizer (for Self Expenses)
 * Matches the uploaded flower water jar:
 * - Glass jar with lid rim
 * - Deep aqua water body
 * - Golden sandy bed at bottom
 * - Animated floating bubbles
 * - Glowing 5-petal pink cherry blossom / sakura flower with soft pink radiance
 */
export const FlowerJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const effectiveWaterHeight = Math.max(18, Math.min(92, pctLeft));

  return (
    <div
      className={`relative ${heightClass} rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/25 to-cyan-950/70 border border-cyan-400/40 shadow-[0_15px_30px_rgba(0,229,255,0.22)] overflow-hidden flex flex-col justify-end select-none`}
    >
      {/* Jar Top Lid Rim */}
      <div className="absolute top-1 left-3 right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />

      {/* Glass Specular Reflection on left */}
      <div className="absolute top-3 left-1.5 w-1 h-28 sm:h-36 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Water Fill Body */}
      <div
        className="water-fill transition-all duration-700 z-10 overflow-hidden"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />

        {/* Ambient deep water glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0091ea]/40 via-[#005fb8]/60 to-[#022c5e]/90 pointer-events-none" />

        {/* Animated Floating Bubbles */}
        <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-6 right-5 w-2.5 h-2.5 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
        <div className="absolute bottom-10 left-6 w-1.5 h-1.5 rounded-full bg-white/50 animate-float-bubble-1" />
        <div className="absolute bottom-3 right-8 w-1 h-1 rounded-full bg-white/60 animate-float-bubble-2" />

        {/* THE GLOWING PINK CHERRY BLOSSOM FLOWER */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center justify-center pointer-events-none z-15">
          <div className="relative animate-float-gentle flex items-center justify-center">
            {/* Soft pink bloom aura glow */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ff3385]/35 blur-xl pointer-events-none" />
            <div className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#ff70a6]/40 blur-md pointer-events-none" />

            {/* SVG Flower with 5 rounded petals */}
            <svg
              className={`${isLarge ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-9 h-9'} drop-shadow-[0_0_12px_rgba(255,105,180,0.9)]`}
              viewBox="0 0 100 100"
            >
              <defs>
                <radialGradient id="sakuraPetalGrad" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffaac9" />
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
                  {/* Organic petal shape with gentle notch at tip */}
                  <path
                    d="M50,50 C40,40 33,26 40,16 C45,10 49,12 50,14 C51,12 55,10 60,16 C67,26 60,40 50,50 Z"
                    fill="url(#sakuraPetalGrad)"
                    stroke="#fca5a5"
                    strokeWidth="0.75"
                  />
                </g>
              ))}

              {/* Flower Center Core */}
              <circle cx="50" cy="50" r="10" fill="url(#sakuraCenterGrad)" />

              {/* 5 Delicate White Pistils */}
              {[0, 72, 144, 216, 288].map((angle, idx) => (
                <g key={idx} transform={`rotate(${angle + 36} 50 50)`}>
                  <line x1="50" y1="50" x2="50" y2="42" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="50" cy="41" r="1.8" fill="#ffffff" />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-4 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      {/* Bottom Underglow */}
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/40 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 2. Shell Jar Visualizer (for REM / YEM)
 * Matches the uploaded shell water jar:
 * - Glass jar with lid rim
 * - Deep blue ocean water
 * - Floating bubbles
 * - Sandy bed at base
 * - Glowing circular aqua aura with white/lavender spiral conch shell
 */
export const ShellJarVisualizer: React.FC<VisualizerProps> = ({ pctLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const effectiveWaterHeight = Math.max(18, Math.min(92, pctLeft));

  return (
    <div
      className={`relative ${heightClass} rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/25 to-cyan-950/70 border border-cyan-400/40 shadow-[0_15px_30px_rgba(0,229,255,0.22)] overflow-hidden flex flex-col justify-end select-none`}
    >
      {/* Jar Top Lid Rim */}
      <div className="absolute top-1 left-3 right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />

      {/* Specular Highlight */}
      <div className="absolute top-3 left-1.5 w-1 h-28 sm:h-36 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-full z-20 pointer-events-none blur-[0.5px]" />

      {/* Water Fill Body */}
      <div
        className="water-fill transition-all duration-700 z-10 overflow-hidden"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />

        {/* Ambient deep water gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#008be3]/40 via-[#014d9e]/60 to-[#022147]/90 pointer-events-none" />

        {/* Animated Floating Bubbles */}
        <div className="absolute bottom-5 left-4 w-2 h-2 rounded-full bg-white/40 animate-float-bubble-1 blur-[0.3px]" />
        <div className="absolute bottom-8 right-4 w-2.5 h-2.5 rounded-full bg-white/45 animate-float-bubble-2 blur-[0.3px]" />
        <div className="absolute bottom-12 right-6 w-1.5 h-1.5 rounded-full bg-white/50 animate-float-bubble-1" />

        {/* GLOWING ORB WITH 3D SPIRAL SHELL */}
        <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex flex-col items-center justify-center pointer-events-none z-15">
          <div className="relative animate-float-gentle flex items-center justify-center">
            {/* Luminous Aqua Sphere Aura */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#00d2ff]/40 via-[#38bdf8]/35 to-[#a5f3fc]/50 border border-cyan-300/40 shadow-[0_0_20px_rgba(0,210,255,0.7)] flex items-center justify-center backdrop-blur-xs">
              {/* 3D Spiral Conch Shell SVG */}
              <svg
                className={`${isLarge ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-6 h-6'} filter drop-shadow-[0_2px_8px_rgba(0,229,255,0.6)]`}
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
                    <stop offset="70%" stopColor="#581c87" />
                    <stop offset="100%" stopColor="#7e22ce" />
                  </linearGradient>
                  <linearGradient id="shellHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Shell Spire & Body Whorls */}
                <g transform="rotate(-25 50 50)">
                  {/* Spire Tip */}
                  <path d="M50,14 C46,14 44,18 45,22 C46,26 54,26 55,22 C56,18 54,14 50,14 Z" fill="url(#shellBodyGrad)" />
                  {/* First Whorl */}
                  <path d="M43,22 C38,24 38,32 44,35 C52,38 60,34 58,26 C57,22 47,20 43,22 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                  {/* Second Whorl */}
                  <path d="M37,33 C30,37 31,48 40,51 C54,55 67,49 65,37 C64,31 43,30 37,33 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                  {/* Third Whorl */}
                  <path d="M31,48 C22,54 24,67 36,71 C55,77 75,69 72,52 C70,43 40,43 31,48 Z" fill="url(#shellBodyGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                  {/* Main Body Whorl with Ribbed Ridges */}
                  <path d="M26,67 C17,76 22,90 38,91 C58,92 78,82 82,68 C84,54 36,58 26,67 Z" fill="url(#shellBodyGrad)" stroke="#94a3b8" strokeWidth="1" />

                  {/* Deep Violet/Purple Shell Mouth Aperture */}
                  <ellipse cx="62" cy="74" rx="14" ry="10" fill="url(#shellApertureGrad)" transform="rotate(-25 62 74)" />
                  <ellipse cx="63" cy="74" rx="10" ry="6.5" fill="#1c0a2a" transform="rotate(-25 63 74)" />

                  {/* Pearlescent Edge Highlight */}
                  <path d="M28,68 C34,62 50,60 70,66" stroke="url(#shellHighlight)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </g>
              </svg>
            </div>
            {/* Under-glow pool */}
            <div className="absolute -bottom-2 w-12 h-2 rounded-full bg-cyan-400/50 blur-xs" />
          </div>
        </div>
      </div>

      {/* Sandy Bed at Base */}
      <div className="absolute bottom-0 inset-x-0 h-4 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20 shadow-inner" />
      {/* Underglow bar */}
      <div className="absolute -bottom-1 inset-x-2 h-1 bg-cyan-400/40 rounded-full blur-xs z-20" />
    </div>
  );
};

/**
 * 3. Battery Thunderstorm Visualizer (for Recharge)
 * Matches the uploaded battery thunderstorm image:
 * - Rounded rectangular battery capsule with top battery terminal button
 * - Frosted glass casing with cyan edge illumination
 * - Center rounded cyan square tile with dark thunderstorm bolt (⚡)
 * - Dynamic percentage text ("14%" or pctLeft%)
 * - Horizontal translucent gauge line
 * - Luminous cyan energy fluid fill at bottom with glowing pearl dot
 */
export const BatteryThunderVisualizer: React.FC<VisualizerProps> = ({ pctLeft, size = 'lg' }) => {
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  // If budget remaining is zero or near zero, show min 14% as in the screenshot
  const displayPercent = Math.max(14, pctLeft);
  const fluidHeight = Math.max(16, Math.min(88, pctLeft));

  return (
    <div
      className={`relative ${heightClass} rounded-[24px] sm:rounded-[30px] bg-gradient-to-b from-[#0a233f]/70 via-[#07192d]/80 to-[#020e1a]/95 border-[1.8px] border-cyan-400/50 shadow-[0_0_25px_rgba(0,210,255,0.3)] overflow-hidden flex flex-col justify-between p-1.5 select-none`}
    >
      {/* Top Battery Terminal Rim */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-2.5 rounded-t-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 border border-white/60 shadow-[0_0_8px_#00e5ff] z-20" />

      {/* Double glass reflection lines */}
      <div className="absolute inset-1 rounded-[20px] sm:rounded-[26px] border border-cyan-300/15 pointer-events-none z-20" />
      <div className="absolute top-3 left-2 w-1 h-20 sm:h-28 bg-white/20 rounded-full blur-[0.5px] pointer-events-none z-20" />

      {/* Translucent Horizontal Gauge Line */}
      <div className="absolute top-[48%] left-3 right-3 h-[1px] bg-cyan-400/25 pointer-events-none z-10" />

      {/* CENTER GLOWING THUNDER TILE & PERCENTAGE */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto pt-2">
        {/* Rounded Cyan Square Tile */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-[#38bdf8] via-[#5eead4] to-[#a5f3fc] shadow-[0_0_16px_rgba(56,189,248,0.85)] flex items-center justify-center border border-white/60 animate-bolt-pulse">
          {/* Black/Dark Thunderstorm Lightning Bolt */}
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950 fill-current" viewBox="0 0 24 24">
            <path d="M13 2L3 14h7v8l10-12h-7z" />
          </svg>
        </div>

        {/* Dynamic Percentage Display */}
        <div className="mt-1 sm:mt-1.5 text-center">
          <span className="text-sm sm:text-base font-extrabold text-[#7dd3fc] tracking-wider drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">
            {displayPercent}%
          </span>
        </div>
      </div>

      {/* Liquid Energy Fluid Fill at Base */}
      <div
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0099ff] via-[#00d2ff] to-[#70f1ff] shadow-[0_0_18px_rgba(0,210,255,0.75)] transition-all duration-700 z-15 flex flex-col justify-start"
        style={{ height: `${fluidHeight}%` }}
      >
        {/* Radiant fluid meniscus line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#bbf7d0] via-white to-[#38bdf8] shadow-[0_0_8px_#ffffff]" />

        {/* Glowing Energy Pearl Indicator on right */}
        <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
        <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#00e5ff]" />
      </div>
    </div>
  );
};

/**
 * Master Visualizer Dispatcher
 * Automatically chooses the exact visualizer for:
 * - 'self-expenses' -> FlowerJarVisualizer
 * - 'recharge' -> BatteryThunderVisualizer
 * - 'rem' -> ShellJarVisualizer
 * - default -> Underwater jar with custom art/creature
 */
export const CategoryVisualizer: React.FC<{
  categoryId: string;
  pctLeft: number;
  size?: 'sm' | 'lg';
  image?: string;
  creatureImg?: string;
  icon?: string;
}> = ({ categoryId, pctLeft, size = 'lg', image, creatureImg, icon }) => {
  if (categoryId === 'self-expenses') {
    return <FlowerJarVisualizer pctLeft={pctLeft} size={size} />;
  }

  if (categoryId === 'recharge') {
    return <BatteryThunderVisualizer pctLeft={pctLeft} size={size} />;
  }

  if (categoryId === 'rem') {
    return <ShellJarVisualizer pctLeft={pctLeft} size={size} />;
  }

  // Fallback for Home, PG, Self Care:
  const isLarge = size === 'lg';
  const heightClass = isLarge ? 'w-36 h-48 sm:h-52' : 'w-full h-28';
  const effectiveWaterHeight = Math.max(12, Math.min(92, pctLeft));

  return (
    <div
      className={`relative ${heightClass} rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-white/20 via-cyan-950/20 to-cyan-950/60 border border-cyan-400/40 shadow-[0_15px_30px_rgba(0,229,255,0.22)] overflow-hidden flex flex-col justify-end select-none`}
    >
      <div className="absolute top-1 left-3 right-3 h-1.5 sm:h-2 jar-lid-rim z-20" />
      <div className="absolute top-3 left-1.5 w-1 h-24 sm:h-36 bg-white/30 rounded-full blur-[0.5px] z-20" />

      {image && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={image}
            alt="Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041326]/80 via-transparent to-[#041326]/40 pointer-events-none" />
        </div>
      )}

      {creatureImg && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center z-10 pointer-events-none">
          <img
            src={creatureImg}
            alt="Creature"
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse"
          />
        </div>
      )}

      {!image && !creatureImg && icon && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-950/50 backdrop-blur-sm flex items-center justify-center border border-cyan-300/30 text-2xl shadow-sm">
            {icon}
          </div>
        </div>
      )}

      <div
        className="water-fill transition-all duration-700 z-10"
        style={{ height: `${effectiveWaterHeight}%` }}
      >
        <div className="water-line" />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-4 sm:h-5 bg-gradient-to-t from-[#8c5e2d] via-[#b6854b] to-transparent z-20" />
    </div>
  );
};
