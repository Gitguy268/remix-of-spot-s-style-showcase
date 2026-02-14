import { useState, useEffect } from "react";

/**
 * Throttle function to limit execution frequency
 * @param func - Function to throttle
 * @param limit - Minimum time between executions in ms
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook to track scroll visibility based on a threshold
 * Optimized with throttling and passive event listeners
 * 
 * @param threshold - Y scroll position to trigger visibility (in pixels)
 * @param throttleMs - Throttle delay in ms (default: 150ms)
 * @returns boolean indicating whether scroll position exceeds threshold
 */
export function useScrollVisibility(threshold: number = 500, throttleMs: number = 150): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = throttle(() => {
      setIsVisible(window.scrollY > threshold);
    }, throttleMs);

    // Run once on mount to set initial state
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold, throttleMs]);

  return isVisible;
}

/**
 * Hook to track scroll progress as a percentage
 * Optimized with throttling and passive event listeners
 * 
 * @param throttleMs - Throttle delay in ms (default: 150ms)
 * @returns number from 0-100 representing scroll progress
 */
export function useScrollProgress(throttleMs: number = 150): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    }, throttleMs);

    // Run once on mount to set initial state
    updateProgress();

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [throttleMs]);

  return progress;
}
