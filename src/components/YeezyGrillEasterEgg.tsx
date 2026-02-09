import { useState, useRef, useCallback, useEffect } from "react";
import yeezyGrill from "@/assets/yeezy-grill.png";

const YeezyGrillEasterEgg = () => {
  const [isWobbling, setIsWobbling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasCustomPos, setHasCustomPos] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isDragging) return;
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 600);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      setHasCustomPos(true);
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  const positionStyle = hasCustomPos
    ? { left: position.x, top: position.y, right: "auto", bottom: "auto" }
    : { right: "1.5rem", bottom: "1.5rem" };

  return (
    <div
      ref={imgRef}
      className={`fixed z-40 cursor-grab select-none transition-transform duration-300 ${
        isDragging ? "cursor-grabbing scale-105" : "hover:scale-110 hover:rotate-0"
      } ${isWobbling ? "yeezy-wobble" : ""}`}
      style={{
        ...positionStyle,
        transform: isDragging ? "none" : "rotate(8deg)",
        width: 140,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      aria-label="Yeezy grill paper cutout Easter egg"
    >
      <img
        src={yeezyGrill}
        alt="Yeezy grill paper cutout"
        className="w-full h-auto pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
        draggable={false}
      />
    </div>
  );
};

export default YeezyGrillEasterEgg;
