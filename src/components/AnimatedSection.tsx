import { ReactNode } from "react";
import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  parallax?: boolean;
  parallaxSpeed?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  parallax = false,
  parallaxSpeed = 0.3,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: parallaxRef, offset } = useParallax(parallaxSpeed);

  const animationClasses = {
    "fade-up": "translate-y-12 opacity-0",
    "fade-in": "opacity-0",
    "scale-in": "scale-95 opacity-0",
    "slide-left": "-translate-x-12 opacity-0",
    "slide-right": "translate-x-12 opacity-0",
  };

  const visibleClasses = "translate-y-0 translate-x-0 scale-100 opacity-100";

  return (
    <div
      ref={(el) => {
        (ref as any).current = el;
        if (parallax) (parallaxRef as any).current = el;
      }}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? visibleClasses : animationClasses[animation],
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transform: parallax && isVisible ? `translateY(${offset}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
