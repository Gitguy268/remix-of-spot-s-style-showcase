"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
}

interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
}) => {
  const glassStyle: React.CSSProperties = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  const content = (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden cursor-pointer transition-all duration-700 hover:scale-[1.02] rounded-3xl",
        className
      )}
      style={glassStyle}
    >
      {/* Glass refraction layer (shared SVG filter) */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-3xl pointer-events-none"
        style={{
          backdropFilter: "url(#lg-glass) blur(8px) saturate(160%)",
          WebkitBackdropFilter: "blur(10px) saturate(160%)",
          isolation: "isolate",
        }}
      />

      {/* Turquoise tint */}
      <div
        className="absolute inset-0 z-10 rounded-3xl pointer-events-none"
        style={{ background: "rgba(44, 187, 195, 0.08)" }}
      />

      {/* Specular rim highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 14% 10%, hsl(183 80% 92% / 0.5) 0%, hsl(183 80% 92% / 0.15) 20%, transparent 45%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Inner bezel highlights */}
      <div
        className="absolute inset-0 z-20 rounded-3xl overflow-hidden pointer-events-none"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 h-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
}) => (
  <div className="flex items-center justify-center">
    <GlassEffect className="p-3">
      <div className="flex items-center gap-3">
        {icons.map((icon, index) => (
          <button
            key={index}
            onClick={icon.onClick}
            className="w-12 h-12 rounded-xl overflow-hidden transition-transform hover:scale-110"
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </GlassEffect>
  </div>
);

// Button Component
const GlassButton: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => (
  <GlassEffect href={href} className="px-6 py-3">
    <span className="text-foreground font-medium">{children}</span>
  </GlassEffect>
);

// SVG Filter Component — kept for backward compatibility.
// Real filters now live in <LiquidGlassFilter /> (mounted once in App.tsx).
const GlassFilter: React.FC = () => null;

export { GlassEffect, GlassDock, GlassButton, GlassFilter };
export type { GlassEffectProps, DockIcon };
