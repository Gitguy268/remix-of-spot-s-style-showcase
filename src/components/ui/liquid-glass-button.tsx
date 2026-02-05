import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "default" | "sm" | "lg" | "xl";
}

const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(
  ({ className, size = "default", asChild = false, children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isHovered, setIsHovered] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;
      
      const rect = button.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    }, []);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      setMousePosition({ x: 0.5, y: 0.5 });
    }, []);

    // Calculate dynamic styles based on mouse position
    const gradientX = mousePosition.x * 100;
    const gradientY = mousePosition.y * 100;
    
    // Tilt effect
    const tiltX = (mousePosition.y - 0.5) * 8;
    const tiltY = (mousePosition.x - 0.5) * -8;
    
    // Glow position
    const glowX = mousePosition.x * 100;
    const glowY = mousePosition.y * 100;

    const sizeClasses = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-sm",
      xl: "h-14 px-10 text-lg rounded-3xl",
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={(node: HTMLButtonElement | null) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          "overflow-hidden cursor-pointer",
          "transition-transform duration-300 ease-out",
          sizeClasses[size],
          className
        )}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px) scale(1.02)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Base layer - turquoise tinted glass */}
        <div 
          className="absolute inset-0 rounded-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(
              ${135 + (mousePosition.x - 0.5) * 30}deg,
              hsl(183 63% 47% / ${isHovered ? 0.25 : 0.2}),
              hsl(183 63% 55% / ${isHovered ? 0.15 : 0.1}),
              hsl(183 63% 47% / ${isHovered ? 0.2 : 0.15})
            )`,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        />

        {/* Dynamic highlight layer that follows mouse */}
        <div 
          className="absolute inset-0 rounded-2xl transition-opacity duration-200"
          style={{
            background: `radial-gradient(
              circle at ${glowX}% ${glowY}%,
              hsl(183 63% 70% / ${isHovered ? 0.4 : 0}),
              transparent 50%
            )`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Refraction/light streak layer */}
        <div 
          className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${90 + (mousePosition.x - 0.5) * 60}deg,
              transparent 0%,
              hsl(0 0% 100% / ${isHovered ? 0.15 : 0.08}) ${gradientX - 10}%,
              hsl(0 0% 100% / ${isHovered ? 0.25 : 0.12}) ${gradientX}%,
              hsl(0 0% 100% / ${isHovered ? 0.15 : 0.08}) ${gradientX + 10}%,
              transparent 100%
            )`,
          }}
        />

        {/* Border with gradient */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            border: "1px solid",
            borderImage: `linear-gradient(
              ${135 + (mousePosition.x - 0.5) * 45}deg,
              hsl(183 63% 60% / ${isHovered ? 0.6 : 0.4}),
              hsl(183 63% 47% / ${isHovered ? 0.3 : 0.2}),
              hsl(183 63% 60% / ${isHovered ? 0.6 : 0.4})
            ) 1`,
            borderRadius: "inherit",
            boxShadow: `
              inset 0 1px 0 hsl(0 0% 100% / ${isHovered ? 0.2 : 0.15}),
              inset 0 -1px 0 hsl(183 63% 30% / ${isHovered ? 0.2 : 0.1})
            `,
          }}
        />

        {/* Outer glow */}
        <div 
          className="absolute -inset-1 rounded-3xl pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(
              ellipse at ${glowX}% ${glowY}%,
              hsl(183 63% 47% / ${isHovered ? 0.25 : 0}),
              transparent 70%
            )`,
            filter: "blur(8px)",
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Drop shadow */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            boxShadow: isHovered
              ? `0 12px 40px hsl(183 63% 47% / 0.35), 0 4px 16px hsl(183 63% 47% / 0.2)`
              : `0 8px 24px hsl(183 63% 47% / 0.2), 0 2px 8px hsl(183 63% 47% / 0.1)`,
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2 text-primary-foreground drop-shadow-sm">
          {children}
        </span>
      </Comp>
    );
  }
);

LiquidGlassButton.displayName = "LiquidGlassButton";

export { LiquidGlassButton };
