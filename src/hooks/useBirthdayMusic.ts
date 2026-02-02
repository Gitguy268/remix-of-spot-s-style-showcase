import { useState, useRef, useCallback } from 'react';

// Happy Birthday melody notes (frequency in Hz, duration in seconds)
const BIRTHDAY_MELODY = [
  { freq: 262, dur: 0.3 }, // C4
  { freq: 262, dur: 0.3 }, // C4
  { freq: 294, dur: 0.6 }, // D4
  { freq: 262, dur: 0.6 }, // C4
  { freq: 349, dur: 0.6 }, // F4
  { freq: 330, dur: 1.2 }, // E4
  
  { freq: 262, dur: 0.3 }, // C4
  { freq: 262, dur: 0.3 }, // C4
  { freq: 294, dur: 0.6 }, // D4
  { freq: 262, dur: 0.6 }, // C4
  { freq: 392, dur: 0.6 }, // G4
  { freq: 349, dur: 1.2 }, // F4
  
  { freq: 262, dur: 0.3 }, // C4
  { freq: 262, dur: 0.3 }, // C4
  { freq: 523, dur: 0.6 }, // C5
  { freq: 440, dur: 0.6 }, // A4
  { freq: 349, dur: 0.6 }, // F4
  { freq: 330, dur: 0.6 }, // E4
  { freq: 294, dur: 1.2 }, // D4
  
  { freq: 466, dur: 0.3 }, // Bb4
  { freq: 466, dur: 0.3 }, // Bb4
  { freq: 440, dur: 0.6 }, // A4
  { freq: 349, dur: 0.6 }, // F4
  { freq: 392, dur: 0.6 }, // G4
  { freq: 349, dur: 1.2 }, // F4
];

export const useBirthdayMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scheduledNotesRef = useRef<OscillatorNode[]>([]);
  const isPlayingRef = useRef(false);

  const stopAllNotes = useCallback(() => {
    scheduledNotesRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    scheduledNotesRef.current = [];
  }, []);

  const playMelody = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    stopAllNotes();
    isPlayingRef.current = true;
    
    let time = ctx.currentTime;
    
    const playLoop = () => {
      if (!isPlayingRef.current) return;
      
      const startTime = ctx.currentTime;
      
      BIRTHDAY_MELODY.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + note.dur - 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + note.dur);
        
        scheduledNotesRef.current.push(osc);
        time += note.dur;
      });
      
      // Loop the melody
      const melodyDuration = BIRTHDAY_MELODY.reduce((sum, n) => sum + n.dur, 0);
      setTimeout(() => {
        if (isPlayingRef.current) {
          time = ctx.currentTime;
          playLoop();
        }
      }, melodyDuration * 1000);
    };
    
    playLoop();
  }, [stopAllNotes]);

  const play = useCallback(async () => {
    setIsLoading(true);
    try {
      await playMelody();
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  }, [playMelody]);

  const pause = useCallback(() => {
    isPlayingRef.current = false;
    stopAllNotes();
    setIsPlaying(false);
  }, [stopAllNotes]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const cleanup = useCallback(() => {
    isPlayingRef.current = false;
    stopAllNotes();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  }, [stopAllNotes]);

  return {
    isPlaying,
    isLoading,
    isLoaded: true,
    play,
    pause,
    toggle,
    loadMusic: () => Promise.resolve(),
    cleanup,
  };
};
