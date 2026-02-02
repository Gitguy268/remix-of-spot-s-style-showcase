import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export const useBirthdayMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const loadMusic = useCallback(async () => {
    if (isLoaded || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-birthday-music`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt: 'happy birthday' }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate music: ${response.status}`);
      }

      const audioBlob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrlRef.current);
      audioRef.current.loop = true;
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load birthday music:', error);
      toast.error('Could not load birthday music');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);

  const play = useCallback(async () => {
    if (!isLoaded) {
      await loadMusic();
    }
    
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to play music:', error);
        toast.error('Could not play music');
      }
    }
  }, [isLoaded, loadMusic]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
    setIsLoaded(false);
  }, []);

  return {
    isPlaying,
    isLoading,
    isLoaded,
    play,
    pause,
    toggle,
    loadMusic,
    cleanup,
  };
};
