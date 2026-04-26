import * as React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: number;
}

const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, children, intensity = 1, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    // Calculate 3D transform based on mouse position
    const rotateX = isHovering ? (mousePosition.y - 0.5) * -8 * intensity : 0;
    const rotateY = isHovering ? (mousePosition.x - 0.5) * 8 * intensity : 0;

    // Dynamic highlight position
    const highlightX = mousePosition.x * 100;
    const highlightY = mousePosition.y * 100;

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-300 ease-out",
          "bg-card/40 dark:bg-card/30 backdrop-blur-xl",
          "border border-primary/20 dark:border-primary/20 border-border",
          "shadow-[0_4px_24px_hsl(216_28%_12%/0.08)] dark:shadow-[0_8px_32px_hsl(183_63%_47%/0.15)]",
          isHovering && "shadow-[0_12px_32px_hsl(216_28%_12%/0.12)] dark:shadow-[0_16px_48px_hsl(183_63%_47%/0.25)]",
          className
        )}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* SVG refraction layer — bends background pixels (Chrome). Falls back to blur otherwise. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            backdropFilter: "url(#lg-glass) blur(2px) saturate(140%)",
            WebkitBackdropFilter: "blur(12px) saturate(140%)",
          }}
        />

        {/* Turquoise tint */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            background: "hsl(183 63% 47% / 0.08)",
          }}
        />

        {/* Specular rim highlight (top-left convex shine) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(120% 90% at 12% 8%, hsl(183 80% 92% / 0.55) 0%, hsl(183 80% 92% / 0.18) 18%, transparent 40%)",
            mixBlendMode: "screen",
            opacity: isHovering ? 0.95 : 0.7,
          }}
        />

        {/* Inner bezel — emphasises the glass edge */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 1px 0 hsl(0 0% 100% / 0.25), inset 0 -1px 0 hsl(183 63% 30% / 0.18), inset 1px 0 0 hsl(0 0% 100% / 0.12), inset -1px 0 0 hsl(183 63% 30% / 0.12)",
          }}
        />

        {/* Dynamic mouse highlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, hsl(183 63% 70% / ${isHovering ? 0.18 : 0}) 0%, transparent 55%)`,
            opacity: isHovering ? 1 : 0,
          }}
        />

        {/* Top edge light refraction */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(183 63% 80% / ${isHovering ? 0.6 : 0.3}) ${highlightX}%, transparent)`,
          }}
        />

        {/* Left edge light refraction */}
        <div
          className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent, hsl(183 63% 80% / ${isHovering ? 0.5 : 0.2}) ${highlightY}%, transparent)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Bottom ambient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 pointer-events-none transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse at center bottom, hsl(183 63% 47% / 0.08) 0%, transparent 70%)",
            opacity: isHovering ? 1 : 0.5,
          }}
        />
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

export { LiquidGlassCard };
