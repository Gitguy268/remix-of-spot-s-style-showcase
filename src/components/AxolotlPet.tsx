import { useEffect, useRef, useCallback, useState } from "react";

const MAX_HEAD_MOVE = 15;
const MAX_PUPIL_MOVE = 4;
const SMOOTHING = 0.1;

const AxolotlPet = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headTrackerRef = useRef<SVGGElement>(null);
  const headBouncerRef = useRef<SVGGElement>(null);
  const pupilRefs = useRef<SVGCircleElement[]>([]);
  const animFrameRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartIdRef = useRef(0);

  const addPupilRef = useCallback((el: SVGCircleElement | null) => {
    if (el && !pupilRefs.current.includes(el)) {
      pupilRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const sensitivity = 20;
      targetRef.current = {
        x: Math.max(-MAX_HEAD_MOVE, Math.min(MAX_HEAD_MOVE, dx / sensitivity)),
        y: Math.max(-MAX_HEAD_MOVE, Math.min(MAX_HEAD_MOVE, dy / sensitivity)),
      };
    };

    const onMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * SMOOTHING;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * SMOOTHING;

      if (headTrackerRef.current) {
        headTrackerRef.current.setAttribute(
          "transform",
          `translate(${currentRef.current.x}, ${currentRef.current.y})`
        );
      }

      const px = (currentRef.current.x / MAX_HEAD_MOVE) * MAX_PUPIL_MOVE;
      const py = (currentRef.current.y / MAX_HEAD_MOVE) * MAX_PUPIL_MOVE;
      pupilRefs.current.forEach((pupil) => {
        pupil.setAttribute("cx", String(3 + px));
        pupil.setAttribute("cy", String(-3 + py));
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Bounce
    const bouncer = headBouncerRef.current;
    if (bouncer) {
      bouncer.classList.remove("axolotl-joy-bounce");
      // Force reflow to restart animation
      bouncer.getBoundingClientRect();
      bouncer.classList.add("axolotl-joy-bounce");
    }

    // Hearts
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const id = ++heartIdRef.current;
      const x = e.clientX - rect.left + (Math.random() - 0.5) * 40;
      const y = e.clientY - rect.top - 20;
      setHearts((prev) => [...prev, { id, x, y }]);
      setTimeout(() => setHearts((prev) => prev.filter((h) => h.id !== id)), 1500);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 cursor-pointer select-none"
      style={{ width: 180, height: 180 }}
      aria-label="Interactive axolotl pet"
    >
      {/* Floating hearts */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="axolotl-heart"
          style={{ left: h.x, top: h.y }}
        >
          ♥
        </span>
      ))}

      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="axoBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffdbe6" />
            <stop offset="100%" stopColor="#ffb7cd" />
          </linearGradient>
          <filter id="axoSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static body */}
        <g transform="translate(150, 240)">
          <ellipse cx="0" cy="0" rx="60" ry="50" fill="url(#axoBodyGradient)" filter="url(#axoSoftShadow)" />
          <ellipse cx="0" cy="10" rx="35" ry="25" fill="#ffeaf0" opacity="0.8" />
          <ellipse cx="-45" cy="20" rx="12" ry="10" fill="#ff8fa3" />
          <ellipse cx="45" cy="20" rx="12" ry="10" fill="#ff8fa3" />
        </g>

        {/* Tracking head group */}
        <g ref={headTrackerRef}>
          <g ref={headBouncerRef} style={{ transformOrigin: "150px 180px" }}>
            <g transform="translate(150, 180)">
              {/* Gills */}
              <g fill="#ff5c7c">
                <path d="M-60 -10 Q-80 -30 -70 -50 Q-55 -40 -50 -25 Z" />
                <path d="M-65 10 Q-90 0 -85 -20 Q-65 -15 -60 0 Z" />
                <path d="M-60 30 Q-80 40 -75 20 Q-60 20 -55 25 Z" />
                <path d="M60 -10 Q80 -30 70 -50 Q55 -40 50 -25 Z" />
                <path d="M65 10 Q90 0 85 -20 Q65 -15 60 0 Z" />
                <path d="M60 30 Q80 40 75 20 Q60 20 55 25 Z" />
              </g>

              {/* Head */}
              <path
                d="M-70 0 C-70 -60 70 -60 70 0 C70 50 -70 50 -70 0 Z"
                fill="url(#axoBodyGradient)"
                stroke="#ff8fa3"
                strokeWidth="3"
                filter="url(#axoSoftShadow)"
              />

              {/* Cheeks */}
              <ellipse cx="-45" cy="15" rx="10" ry="6" fill="#ff9eb5" opacity="0.6" />
              <ellipse cx="45" cy="15" rx="10" ry="6" fill="#ff9eb5" opacity="0.6" />

              {/* Mouth */}
              <path d="M-10 15 Q0 22 10 15" fill="none" stroke="#37282b" strokeWidth="3" strokeLinecap="round" />

              {/* Eyes */}
              <g transform="translate(-35, -5)">
                <circle r="12" fill="#37282b" />
                <circle ref={addPupilRef} cx="3" cy="-3" r="4" fill="white" />
                <circle cx="-3" cy="3" r="2" fill="white" opacity="0.5" />
              </g>
              <g transform="translate(35, -5)">
                <circle r="12" fill="#37282b" />
                <circle ref={addPupilRef} cx="3" cy="-3" r="4" fill="white" />
                <circle cx="-3" cy="3" r="2" fill="white" opacity="0.5" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AxolotlPet;
