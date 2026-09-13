import { SettingsState } from '../types';
import { defaultSettings } from '../data/initialData';

export type SoundEvent =
  | 'oceanAmbience'
  | 'tabChange'
  | 'buttonTap'
  | 'keypadTap'
  | 'keypadDelete'
  | 'keypadClear'
  | 'expenseAdded'
  | 'expenseDeleted'
  | 'expenseEdited'
  | 'budgetUpdated'
  | 'waterRipple'
  | 'budgetWarning80'
  | 'budgetWarning90'
  | 'budgetWarning100'
  | 'monthChange';

const SOUND_ASSET_MAP: Record<SoundEvent, string> = {
  oceanAmbience: '/sounds/ocean-deep-ambience.mp3',
  tabChange: '/sounds/tab-change.mp3',
  buttonTap: '/sounds/button-tap.mp3',
  keypadTap: '/sounds/keypad-tap.mp3',
  keypadDelete: '/sounds/keypad-delete.mp3',
  keypadClear: '/sounds/keypad-clear.mp3',
  expenseAdded: '/sounds/expense-added.mp3',
  expenseDeleted: '/sounds/expense-deleted.mp3',
  expenseEdited: '/sounds/expense-edited.mp3',
  budgetUpdated: '/sounds/budget-updated.mp3',
  waterRipple: '/sounds/water-ripple.mp3',
  budgetWarning80: '/sounds/budget-warning-80.mp3',
  budgetWarning90: '/sounds/budget-warning-90.mp3',
  budgetWarning100: '/sounds/budget-warning-100.mp3',
  monthChange: '/sounds/month-change.mp3',
};

class AudioManager {
  private settings: SettingsState = defaultSettings;
  private audioCtx: AudioContext | null = null;
  private isUnlocked = false;

  // Layer A: Ambience nodes & elements
  private ambientAudio: HTMLAudioElement | null = null;
  private bubbleTimer: ReturnType<typeof setTimeout> | null = null;
  private fishTimer: ReturnType<typeof setTimeout> | null = null;
  private whaleTimer: ReturnType<typeof setTimeout> | null = null;

  // Layer B: Audio elements cache for instant low-latency triggering
  private audioCache = new Map<string, HTMLAudioElement>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAutoplayUnlock();
    }
  }

  /**
   * Set up browser-compliant first-interaction unlock listeners
   */
  private initAutoplayUnlock() {
    const unlockHandler = () => {
      this.unlockAudio();
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('click', unlockHandler);
    };

    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('click', unlockHandler, { passive: true });
  }

  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    } catch {
      // Ignore
    }

    // Start Layer A continuous ocean ambience if enabled
    this.syncOceanAmbience();
    this.startAmbientTimers();
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public updateSettings(newSettings: SettingsState) {
    const prevMaster = this.settings.masterSound;
    const prevAmbience = this.settings.oceanAmbience;
    const prevVolume = this.settings.oceanVolume;
    const prevEffects = this.settings.ambientEffects;

    this.settings = { ...newSettings };

    if (
      prevMaster !== newSettings.masterSound ||
      prevAmbience !== newSettings.oceanAmbience ||
      prevVolume !== newSettings.oceanVolume
    ) {
      this.syncOceanAmbience();
    }

    if (
      prevMaster !== newSettings.masterSound ||
      prevEffects !== newSettings.ambientEffects
    ) {
      if (newSettings.masterSound && newSettings.ambientEffects) {
        this.startAmbientTimers();
      } else {
        this.stopAmbientTimers();
      }
    }
  }

  /* =======================================================================
   * LAYER A: CONTINUOUS OCEAN AMBIENCE & NATURAL TIMERS
   * ======================================================================= */

  private syncOceanAmbience() {
    if (typeof window === 'undefined') return;

    const shouldPlay = this.isUnlocked && this.settings.masterSound && this.settings.oceanAmbience;
    const targetVolume = Math.min(1, Math.max(0, (this.settings.oceanVolume / 100) * 0.3));

    if (!this.ambientAudio) {
      this.ambientAudio = new Audio(SOUND_ASSET_MAP.oceanAmbience);
      this.ambientAudio.loop = true;
      this.ambientAudio.preload = 'auto';
    }

    this.ambientAudio.volume = targetVolume;

    if (shouldPlay) {
      if (this.ambientAudio.paused) {
        this.ambientAudio.play().catch(() => {
          // Autoplay policy or asset loading delayed
        });
      }
    } else {
      if (!this.ambientAudio.paused) {
        this.ambientAudio.pause();
      }
    }
  }

  private startAmbientTimers() {
    this.stopAmbientTimers();
    if (!this.isUnlocked || !this.settings.masterSound || !this.settings.ambientEffects) {
      return;
    }

    this.scheduleNextBubble();
    this.scheduleNextFish();
    this.scheduleNextWhale();
  }

  private stopAmbientTimers() {
    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = null;
    }
    if (this.fishTimer) {
      clearTimeout(this.fishTimer);
      this.fishTimer = null;
    }
    if (this.whaleTimer) {
      clearTimeout(this.whaleTimer);
      this.whaleTimer = null;
    }
  }

  private scheduleNextBubble() {
    // 15 - 30 seconds random interval
    const delay = Math.floor(15000 + Math.random() * 15000);
    this.bubbleTimer = setTimeout(() => {
      if (this.settings.masterSound && this.settings.ambientEffects && this.settings.bubbleSounds) {
        this.playAmbientFile('/sounds/bubbles.mp3', 0.25);
      }
      this.scheduleNextBubble();
    }, delay);
  }

  private scheduleNextFish() {
    // 20 - 45 seconds random interval
    const delay = Math.floor(20000 + Math.random() * 25000);
    this.fishTimer = setTimeout(() => {
      if (this.settings.masterSound && this.settings.ambientEffects && this.settings.fishSounds) {
        this.playAmbientFile('/sounds/fish-distant.mp3', 0.2);
      }
      this.scheduleNextFish();
    }, delay);
  }

  private scheduleNextWhale() {
    // 45 - 80 seconds random interval, very quiet
    const delay = Math.floor(45000 + Math.random() * 35000);
    this.whaleTimer = setTimeout(() => {
      if (this.settings.masterSound && this.settings.ambientEffects && this.settings.whaleSounds) {
        this.playAmbientFile('/sounds/whale-distant.mp3', 0.12);
      }
      this.scheduleNextWhale();
    }, delay);
  }

  private playAmbientFile(src: string, volume: number) {
    if (!this.settings.masterSound) return;
    try {
      const audio = new Audio(src);
      audio.volume = Math.min(1, Math.max(0, volume * (this.settings.oceanVolume / 100 + 0.5)));
      audio.play().catch(() => {});
    } catch {
      // Safe fallback
    }
  }

  /* =======================================================================
   * LAYER B: INTERACTION & EVENT SOUNDS
   * ======================================================================= */

  public play(event: SoundEvent) {
    // 1. Check Master Sound
    if (!this.settings.masterSound) {
      return;
    }

    // 2. Check granular setting permissions
    if (event === 'tabChange' && (!this.settings.interactionSounds || !this.settings.tabSounds)) {
      return;
    }

    if (event === 'buttonTap' && !this.settings.interactionSounds) {
      return;
    }

    if (
      (event === 'keypadTap' || event === 'keypadDelete' || event === 'keypadClear') &&
      (!this.settings.interactionSounds || !this.settings.keypadSounds)
    ) {
      return;
    }

    if (
      (event === 'expenseAdded' || event === 'expenseDeleted' || event === 'expenseEdited') &&
      (!this.settings.interactionSounds || !this.settings.expenseSounds)
    ) {
      return;
    }

    if (event === 'budgetUpdated' && !this.settings.interactionSounds) {
      return;
    }

    if (event === 'waterRipple' && !this.settings.waterRipple) {
      return;
    }

    if (
      (event === 'budgetWarning80' || event === 'budgetWarning90' || event === 'budgetWarning100') &&
      !this.settings.budgetWarning
    ) {
      return;
    }

    if (event === 'monthChange' && !this.settings.interactionSounds) {
      return;
    }

    // 3. Trigger Haptic Feedback where supported
    this.triggerHaptic(event);

    // 4. Play dedicated audio asset with fallback to procedural synthesis
    this.playAudioAssetWithFallback(event);
  }

  private triggerHaptic(event: SoundEvent) {
    if (!this.settings.hapticFeedback) return;
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

    try {
      switch (event) {
        case 'tabChange':
          navigator.vibrate(12);
          break;
        case 'keypadTap':
          navigator.vibrate(8);
          break;
        case 'keypadDelete':
          navigator.vibrate(10);
          break;
        case 'buttonTap':
          navigator.vibrate(12);
          break;
        case 'expenseAdded':
          navigator.vibrate([25, 40, 25]);
          break;
        case 'expenseDeleted':
          navigator.vibrate(35);
          break;
        case 'expenseEdited':
          navigator.vibrate([20, 30]);
          break;
        case 'budgetUpdated':
          navigator.vibrate([20, 25]);
          break;
        case 'budgetWarning80':
          navigator.vibrate([40, 60, 40]);
          break;
        case 'budgetWarning90':
          navigator.vibrate([50, 70, 50]);
          break;
        case 'budgetWarning100':
          navigator.vibrate([70, 90, 70]);
          break;
        default:
          break;
      }
    } catch {
      // Haptics not allowed or failed safely
    }
  }

  private playAudioAssetWithFallback(event: SoundEvent) {
    const assetUrl = SOUND_ASSET_MAP[event];
    if (!assetUrl) {
      this.playFallbackTone(event);
      return;
    }

    try {
      let audio = this.audioCache.get(assetUrl);
      if (!audio) {
        audio = new Audio(assetUrl);
        audio.preload = 'auto';
        this.audioCache.set(assetUrl, audio);
      }

      // Clone or reset to allow rapid subsequent taps without clipping
      const playInstance = audio.cloneNode() as HTMLAudioElement;

      // Calibration of default volumes per event type
      switch (event) {
        case 'keypadTap':
          playInstance.volume = 0.45;
          break;
        case 'keypadDelete':
        case 'keypadClear':
          playInstance.volume = 0.5;
          break;
        case 'buttonTap':
        case 'tabChange':
          playInstance.volume = 0.55;
          break;
        case 'expenseAdded':
        case 'expenseEdited':
        case 'budgetUpdated':
          playInstance.volume = 0.65;
          break;
        case 'expenseDeleted':
        case 'waterRipple':
        case 'monthChange':
          playInstance.volume = 0.6;
          break;
        case 'budgetWarning80':
        case 'budgetWarning90':
        case 'budgetWarning100':
          playInstance.volume = 0.7;
          break;
        default:
          playInstance.volume = 0.5;
      }

      playInstance.play().catch(() => {
        // Fallback directly to procedural synthesis if file playback encounters error
        this.playFallbackTone(event);
      });
    } catch {
      this.playFallbackTone(event);
    }
  }

  /* =======================================================================
   * SECTION 19: DISTINCT PROCEDURAL WEB AUDIO API SYNTHESIS FALLBACK
   * ======================================================================= */

  private playFallbackTone(event: SoundEvent) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      switch (event) {
        case 'tabChange': {
          // Soft, subtle rising droplet (560Hz -> 840Hz, 100ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(560, now);
          osc.frequency.exponentialRampToValueAtTime(840, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'buttonTap': {
          // Soft organic low-mid aquatic pop (420Hz -> 260Hz, 110ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.1);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'keypadTap': {
          // Very short soft tick/bubble (840Hz -> 1100Hz, 60ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(840, now);
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'keypadDelete': {
          // Downward aquatic water drop (640Hz -> 320Hz, 110ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(640, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'keypadClear': {
          // Double soft sweep (580Hz then 440Hz, 180ms)
          [
            { f: 580, delay: 0 },
            { f: 440, delay: 0.06 },
          ].forEach(({ f, delay }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + delay);
            osc.frequency.exponentialRampToValueAtTime(f - 180, now + delay + 0.08);
            gain.gain.setValueAtTime(0.1, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.1);
          });
          break;
        }

        case 'expenseAdded': {
          // Multi-stage: 1. Soft water drop, 2. Ripple, 3. Gentle C major chord
          const oscDrop = ctx.createOscillator();
          const gainDrop = ctx.createGain();
          oscDrop.type = 'sine';
          oscDrop.frequency.setValueAtTime(680, now);
          oscDrop.frequency.exponentialRampToValueAtTime(1050, now + 0.12);
          gainDrop.gain.setValueAtTime(0.18, now);
          gainDrop.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          oscDrop.connect(gainDrop);
          gainDrop.connect(ctx.destination);
          oscDrop.start(now);
          oscDrop.stop(now + 0.15);

          // Confirmation chord
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const start = now + 0.15 + idx * 0.04;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.09, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.6);
          });
          break;
        }

        case 'expenseEdited': {
          // Soft glass/water confirmation sound (crisp harmonic chime)
          [880, 1174.66, 1480].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const start = now + idx * 0.05;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.08, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.5);
          });
          break;
        }

        case 'expenseDeleted': {
          // Soft downward water/drain sound + low confirmation tone
          const oscDrain = ctx.createOscillator();
          const gainDrain = ctx.createGain();
          oscDrain.type = 'sine';
          oscDrain.frequency.setValueAtTime(480, now);
          oscDrain.frequency.exponentialRampToValueAtTime(220, now + 0.35);
          gainDrain.gain.setValueAtTime(0.16, now);
          gainDrain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          oscDrain.connect(gainDrain);
          gainDrain.connect(ctx.destination);
          oscDrain.start(now);
          oscDrain.stop(now + 0.4);

          const oscLow = ctx.createOscillator();
          const gainLow = ctx.createGain();
          oscLow.type = 'triangle';
          oscLow.frequency.setValueAtTime(220, now + 0.2);
          oscLow.frequency.exponentialRampToValueAtTime(165, now + 0.6);
          gainLow.gain.setValueAtTime(0.12, now + 0.2);
          gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          oscLow.connect(gainLow);
          gainLow.connect(ctx.destination);
          oscLow.start(now + 0.2);
          oscLow.stop(now + 0.65);
          break;
        }

        case 'budgetUpdated': {
          // Warm resonant double-tone chime (587.33Hz and 880Hz)
          [587.33, 880].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const start = now + idx * 0.1;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.55);
          });
          break;
        }

        case 'waterRipple': {
          // Water level displacement ripple sound
          [480, 380, 320].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const start = now + idx * 0.08;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.11, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.38);
          });
          break;
        }

        case 'monthChange': {
          // Soft underwater transition swell
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.3);
          osc.frequency.exponentialRampToValueAtTime(280, now + 0.65);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
          break;
        }

        case 'budgetWarning80': {
          // 80% Cautionary amber water bell
          [493.88, 440].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const start = now + idx * 0.15;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.14, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.5);
          });
          break;
        }

        case 'budgetWarning90': {
          // 90% Heightened warning - 3 deeper pulses
          [440, 392, 349.23].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const start = now + idx * 0.14;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.16, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.45);
          });
          break;
        }

        case 'budgetWarning100': {
          // 100% Deep resonant water bell gong
          [164.81, 329.63, 261.63].forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.95);
          });
          break;
        }

        default:
          break;
      }
    } catch {
      // Ignore
    }
  }
}

export const audioManager = new AudioManager();

// Backward compatibility legacy helper functions
export function playWaterDrop() {
  audioManager.play('buttonTap');
}

export function playOceanChime() {
  audioManager.play('expenseAdded');
}

export function playRippleAlert() {
  audioManager.play('waterRipple');
}
