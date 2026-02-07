import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";
import YeezusLoader from "./YeezusLoader";

const THRESHOLD = 80;
const MAX_PULL = 140;

interface PullToRefreshProps {
  children: ReactNode;
}

const PullToRefresh = ({ children }: PullToRefreshProps) => {
  const startY = useRef(0);
  const pulling = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAtTop = () => window.scrollY <= 0;

  const handleStart = useCallback((clientY: number) => {
    if (isAtTop() && !isReloading) {
      startY.current = clientY;
      pulling.current = true;
    }
  }, [isReloading]);

  const handleMove = useCallback((clientY: number) => {
    if (!pulling.current || !isAtTop()) return;
    const delta = clientY - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, MAX_PULL));
    }
  }, []);

  const handleEnd = useCallback(() => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setIsReloading(true);
      setPullDistance(THRESHOLD);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientY);
      if (pulling.current && pullDistance > 10) {
        e.preventDefault();
      }
    };
    const onTouchEnd = () => handleEnd();

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientY);
    const onMouseMove = (e: MouseEvent) => {
      if (pulling.current) {
        e.preventDefault();
        handleMove(e.clientY);
      }
    };
    const onMouseUp = () => handleEnd();

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleStart, handleMove, handleEnd, pullDistance]);

  const showLoader = pullDistance > 10 || isReloading;
  const opacity = Math.min(pullDistance / THRESHOLD, 1);
  const scale = 0.5 + (opacity * 0.5);

  return (
    <div ref={containerRef} className="pull-to-refresh-container">
      {/* Pull-to-refresh overlay */}
      <div
        className="pull-to-refresh__overlay"
        style={{
          height: showLoader ? `${pullDistance}px` : "0px",
          opacity: showLoader ? 1 : 0,
          transition: pulling.current ? "none" : "all 0.3s ease-out",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            opacity,
            transition: pulling.current ? "none" : "all 0.3s ease-out",
          }}
        >
          <YeezusLoader />
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          transform: showLoader ? `translateY(0)` : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
