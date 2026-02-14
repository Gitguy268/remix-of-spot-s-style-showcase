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
      {/* Glass Layers */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
        style={{
          backdropFilter: "blur(8px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />

      <div
        className="absolute inset-0 z-10 rounded-3xl"
        style={{ background: "rgba(44, 187, 195, 0.08)" }}
      />

      <div
        className="absolute inset-0 z-20 rounded-3xl overflow-hidden"
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

// SVG Filter Component
const GlassFilter: React.FC = () => (
  <svg className="hidden" aria-hidden="true">
    <defs>
      <filter id="glass-distortion">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="3"
          xChannelSelector="R"
          yChannelSelector="G"
        />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in="SourceGraphic" operator="over" />
      </filter>
    </defs>
  </svg>
);

export { GlassEffect, GlassDock, GlassButton, GlassFilter };
export type { GlassEffectProps, DockIcon };
