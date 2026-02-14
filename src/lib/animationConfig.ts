/**
 * Centralized animation configuration constants
 * Prevents duplication of animation values across components
 */

export const ANIMATION_DURATIONS = {
  fast: 200,
  medium: 300,
  slow: 500,
  slower: 700,
} as const;

export const ANIMATION_EASING = {
  out: "ease-out",
  linear: "linear",
  in: "ease-in",
  inOut: "ease-in-out",
} as const;

/**
 * Pre-configured transition class combinations for common animations
 */
export const TRANSITION_CLASSES = {
  fadeUp: "transition-all duration-700 ease-out",
  fadeIn: "transition-all duration-300 ease-out",
  scaleIn: "transition-all duration-300 ease-out",
  quick: "transition-all duration-200 ease-out",
  smooth: "transition-all duration-500 ease-out",
} as const;

/**
 * Animation states for scroll-triggered animations
 */
export const SCROLL_ANIMATION_STATES = {
  fadeUp: {
    hidden: "translate-y-12 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  fadeIn: {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  scaleIn: {
    hidden: "scale-95 opacity-0",
    visible: "scale-100 opacity-100",
  },
  slideInLeft: {
    hidden: "-translate-x-12 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  slideInRight: {
    hidden: "translate-x-12 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
} as const;
