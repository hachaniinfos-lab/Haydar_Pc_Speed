// Audio controller for the attached Douaa MP3:
// /assets/aistudio/doaa-al-maiet-allahum-eghfir-lh_f4c1b1ca.mp3
// Supports auto-play on application startup, Play/Pause toggle, and Volume Up/Down controls.

export const DOUAA_MP3_URL = '/assets/aistudio/doaa-al-maiet-allahum-eghfir-lh_f4c1b1ca.mp3';

export interface DouaaAudioState {
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  isBoxOpen: boolean;
}

type Listener = (state: DouaaAudioState) => void;

let audioInstance: HTMLAudioElement | null = null;
let currentState: DouaaAudioState = {
  isPlaying: false,
  volume: 0.8,
  isBoxOpen: true, // Open automatically on app startup when Douaa starts
};

const listeners = new Set<Listener>();
let hasAutoStarted = false;
let unlockListenersAttached = false;

function notifyListeners() {
  const snapshot = { ...currentState };
  listeners.forEach((fn) => fn(snapshot));
}

function getResolvedAudioUrl(): string {
  if (typeof window !== 'undefined' && (window as any).__HAYDAR_DOUAA_URI__) {
    return (window as any).__HAYDAR_DOUAA_URI__;
  }
  return DOUAA_MP3_URL;
}

function getAudioElement(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio(getResolvedAudioUrl());
    audioInstance.preload = 'auto';
    audioInstance.volume = currentState.volume;

    audioInstance.addEventListener('play', () => {
      currentState.isPlaying = true;
      notifyListeners();
    });

    audioInstance.addEventListener('pause', () => {
      currentState.isPlaying = false;
      notifyListeners();
    });

    audioInstance.addEventListener('ended', () => {
      currentState.isPlaying = false;
      notifyListeners();
    });

    audioInstance.addEventListener('volumechange', () => {
      if (audioInstance) {
        currentState.volume = Math.round(audioInstance.volume * 100) / 100;
        notifyListeners();
      }
    });
  }
  return audioInstance;
}

function removeUnlockListeners() {
  if (!unlockListenersAttached || typeof window === 'undefined') return;
  unlockListenersAttached = false;
  window.removeEventListener('pointerdown', handleFirstUserInteraction);
  window.removeEventListener('keydown', handleFirstUserInteraction);
}

function handleFirstUserInteraction() {
  removeUnlockListeners();
  const audio = getAudioElement();
  if (audio.paused) {
    audio.play().catch(() => {
      // Ignore if still blocked
    });
  }
}

export function autoStartDouaaOnAppLoad(): void {
  if (hasAutoStarted || typeof window === 'undefined') return;
  hasAutoStarted = true;
  currentState.isBoxOpen = true;
  notifyListeners();

  try {
    const audio = getAudioElement();
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser blocked un-interacted autoplay: start immediately on first click/touch anywhere
        if (!unlockListenersAttached) {
          unlockListenersAttached = true;
          window.addEventListener('pointerdown', handleFirstUserInteraction, { once: true });
          window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
        }
      });
    }
  } catch {
    // Ignore errors
  }
}

export function togglePlayPauseDouaa(): void {
  removeUnlockListeners();
  try {
    const audio = getAudioElement();
    currentState.isBoxOpen = true;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    notifyListeners();
  } catch {
    // Ignore
  }
}

export function playDouaaAudio(onEnd?: () => void): void {
  removeUnlockListeners();
  try {
    const audio = getAudioElement();
    currentState.isBoxOpen = true;
    if (audio.paused) {
      audio.play().catch(() => {});
    }
    if (onEnd) {
      const handleEnded = () => {
        audio.removeEventListener('ended', handleEnded);
        onEnd();
      };
      audio.addEventListener('ended', handleEnded);
    }
    notifyListeners();
  } catch {
    // Ignore
  }
}

export function stopDouaaAudio(): void {
  removeUnlockListeners();
  try {
    if (audioInstance) {
      audioInstance.pause();
    }
    currentState.isPlaying = false;
    notifyListeners();
  } catch {
    // Ignore
  }
}

export function adjustDouaaVolume(delta: number): void {
  try {
    const audio = getAudioElement();
    const nextVol = Math.max(0, Math.min(1, Math.round((audio.volume + delta) * 10) / 10));
    audio.volume = nextVol;
    currentState.volume = nextVol;
    notifyListeners();
  } catch {
    // Ignore
  }
}

export function setDouaaBoxOpen(open: boolean): void {
  currentState.isBoxOpen = open;
  notifyListeners();
}

export function getDouaaState(): DouaaAudioState {
  return { ...currentState };
}

export function subscribeDouaaAudio(listener: Listener): () => void {
  listeners.add(listener);
  listener({ ...currentState });
  return () => {
    listeners.delete(listener);
  };
}
