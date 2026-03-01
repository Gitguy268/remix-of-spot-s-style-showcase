import { useCallback, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * Sound effects system for the Spot shop.
 * 
 * Uses the Web Audio API to generate short, subtle sounds programmatically
 * (no external audio files needed). Sounds are only created on user interaction.
 * 
 * Mute state is persisted in localStorage under "spot-sound-enabled".
 * 
 * Usage:
 *   const { playClick, playHover, isSoundEnabled, toggleSound } = useSound();
 */

// Generate a short "click/pop" sound using oscillator
function createClickSound(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.15);
}

// Generate a soft "hover" blip
function createHoverSound(audioCtx: AudioContext) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.08);
}

export function useSound() {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage("spot-sound-enabled", true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (!isSoundEnabled) return;
    try { createClickSound(getAudioCtx()); } catch {}
  }, [isSoundEnabled, getAudioCtx]);

  const playHover = useCallback(() => {
    if (!isSoundEnabled) return;
    try { createHoverSound(getAudioCtx()); } catch {}
  }, [isSoundEnabled, getAudioCtx]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev: boolean) => !prev);
  }, [setIsSoundEnabled]);

  return { playClick, playHover, isSoundEnabled, toggleSound };
}
