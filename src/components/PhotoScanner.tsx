import { useEffect, useRef, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";
import { RotateCcw } from "lucide-react";
import { LiquidGlassButton } from "./ui/liquid-glass-button";

import scannerImg1 from "@/assets/spot-scanner-1.jpeg";
import scannerImg2 from "@/assets/spot-scanner-2.png";
import scannerImg3 from "@/assets/spot-scanner-3.jpeg";
import scannerImg4 from "@/assets/spot-scanner-4.jpeg";
import scannerImg5 from "@/assets/spot-scanner-5.jpeg";
import scannerImg6 from "@/assets/spot-scanner-6.jpeg";

const PHOTO_URLS = [scannerImg1, scannerImg2, scannerImg3, scannerImg4, scannerImg5, scannerImg6];
const CARD_COUNT = 30;
const CARD_WIDTH = 400;
const CARD_HEIGHT = 250;
const CARD_GAP = 60;
const CRUISE_SPEED = 35;
const MOMENTUM_DECAY = 0.985;
const EASE_BLEND = 0.04;
const MAX_FLICK = 600;
const SCANNER_WIDTH = 8;
const ASCII_COLS = Math.floor(CARD_WIDTH / 6);
const ASCII_ROWS = Math.floor(CARD_HEIGHT / 13);
const POOL_MAX = 3000;

// Code text generator
const CODE_LINES = [
  "// compiled preview", "/* visual effect only */", "const SCAN_WIDTH = 8;",
  "const FADE_ZONE = 35;", "const MAX_PARTICLES = 2500;",
  "function clamp(n,a,b){return Math.max(a,Math.min(b,n));}",
  "function lerp(a,b,t){return a+(b-a)*t;}", "const now=()=>performance.now();",
  "class Particle{constructor(x,y){this.x=x;this.y=y;}}",
  "function draw(ctx,p){ctx.globalAlpha=p.a;}", "const state={intensity:1.2};",
  "ctx.globalCompositeOperation='lighter';"
];
for (let fi = 0; fi < 30; fi++) {
  CODE_LINES.push(`const v${fi}=(${Math.floor(Math.random()*9)+1}+${Math.floor(Math.random()*90)+10})*0.${Math.floor(Math.random()*9)+1};`);
}
const CODE_POOL = CODE_LINES.join(" ").replace(/\s+/g, " ");

function generateCode(cols: number, rows: number): string {
  const need = cols * rows + cols;
  let flow = CODE_POOL;
  while (flow.length < need) flow += " " + CODE_POOL;
  let out = "";
  let off = 0;
  for (let r = 0; r < rows; r++) {
    let line = flow.slice(off, off + cols);
    while (line.length < cols) line += " ";
    if (r < rows - 1) line += "\n";
    out += line;
    off += cols;
  }
  return out;
}

function clamp(n: number, lo: number, hi: number): number {
  return n < lo ? lo : n > hi ? hi : n;
}
function rf(a: number, b: number): number {
  return Math.random() * (b - a) + a;
}

const SCOPED_CSS = `
.ps-scanner-section {
  position: relative;
  overflow: hidden;
}
.ps-container {
  position: relative;
  width: 100%;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.ps-card-stream {
  position: absolute;
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  overflow: visible;
}
.ps-card-line {
  display: flex;
  align-items: center;
  gap: 60px;
  white-space: nowrap;
  cursor: grab;
  user-select: none;
  will-change: transform;
}
.ps-card-line.ps-dragging { cursor: grabbing; }
.ps-card-wrapper {
  position: relative;
  width: 400px;
  height: 250px;
  flex-shrink: 0;
}
.ps-card {
  position: absolute;
  top: 0; left: 0;
  width: 400px;
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
}
.ps-card-normal {
  background: transparent;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4);
  z-index: 2;
  clip-path: inset(0 0 0 var(--clip-right, 0%));
}
.ps-card-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  filter: brightness(1.1) contrast(1.1);
  transition: filter 0.3s ease;
}
.ps-card-image:hover { filter: brightness(1.2) contrast(1.2); }
.ps-card-ascii {
  background: transparent;
  z-index: 1;
  clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0);
}
.ps-ascii-content {
  position: absolute;
  inset: 0;
  color: rgba(220,210,255,0.6);
  font-family: "Courier New", monospace;
  font-size: 11px;
  line-height: 13px;
  overflow: hidden;
  white-space: pre;
  animation: ps-glitch 0.1s infinite linear alternate-reverse;
  mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%);
  -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%);
}
@keyframes ps-glitch {
  0%   { opacity: 1; }
  15%  { opacity: 0.9; }
  16%  { opacity: 1; }
  49%  { opacity: 0.8; }
  50%  { opacity: 1; }
  99%  { opacity: 0.9; }
  100% { opacity: 1; }
}
.ps-scan-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent);
  animation: ps-scanEffect 0.6s ease-out forwards;
  pointer-events: none;
  z-index: 5;
}
@keyframes ps-scanEffect {
  0%   { transform: translateX(-100%); opacity: 0; }
  50%  { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
.ps-particle-canvas {
  position: absolute;
  top: 50%; left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 250px;
  z-index: 0;
  pointer-events: none;
}
.ps-scanner-canvas {
  position: absolute;
  top: 50%; left: -3px;
  transform: translateY(-50%);
  width: 100%;
  height: 300px;
  z-index: 15;
  pointer-events: none;
}
.ps-reset-btn {
  position: absolute;
  bottom: 16px;
  left: 24px;
  z-index: 100;
}
`;

const PhotoScanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleReset = useCallback(() => {
    if ((window as any).__psReset) (window as any).__psReset();
  }, []);

  useEffect(() => {
    const particleCanvas = particleCanvasRef.current;
    const scannerCanvas = scannerCanvasRef.current;
    const cardLine = cardLineRef.current;
    const section = sectionRef.current;
    if (!particleCanvas || !scannerCanvas || !cardLine || !section) return;

    const pCtx = particleCanvas.getContext("2d");
    const sCtx = scannerCanvas.getContext("2d");
    if (!pCtx || !sCtx) return;

    let alive = true;
    let visible = true;
    const rafs: number[] = [];
    const intervals: number[] = [];
    const eventCleanups: (() => void)[] = [];

    function vw() { return document.documentElement.clientWidth; }

    // ── IntersectionObserver ──
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(section);

    // ── Card Stream Controller ──
    let position = 0;
    let velocity = CRUISE_SPEED;
    let isAnimating = true;
    let isDragging = false;
    let lastTime = performance.now();
    let lastMouseX = 0;
    let mouseVelocity = 0;
    let containerW = vw();
    let lineW = 1;

    function makeCard(index: number): HTMLDivElement {
      const wrapper = document.createElement("div");
      wrapper.className = "ps-card-wrapper";
      const normal = document.createElement("div");
      normal.className = "ps-card ps-card-normal";
      const img = document.createElement("img");
      img.className = "ps-card-image";
      img.alt = "Spot " + (index + 1);
      img.loading = "lazy";
      img.decoding = "async";
      let errorHandled = false;
      img.onerror = () => {
        if (errorHandled) return;
        errorHandled = true;
        const c = document.createElement("canvas");
        c.width = CARD_WIDTH; c.height = CARD_HEIGHT;
        const cx = c.getContext("2d");
        if (!cx) return;
        const g = cx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
        g.addColorStop(0, "#667eea"); g.addColorStop(1, "#764ba2");
        cx.fillStyle = g; cx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
        img.src = c.toDataURL();
      };
      img.src = PHOTO_URLS[index % PHOTO_URLS.length];
      normal.appendChild(img);
      const ascii = document.createElement("div");
      ascii.className = "ps-card ps-card-ascii";
      const pre = document.createElement("div");
      pre.className = "ps-ascii-content";
      pre.textContent = generateCode(ASCII_COLS, ASCII_ROWS);
      ascii.appendChild(pre);
      wrapper.appendChild(normal);
      wrapper.appendChild(ascii);
      return wrapper;
    }

    // Populate
    cardLine.innerHTML = "";
    for (let i = 0; i < CARD_COUNT; i++) cardLine.appendChild(makeCard(i));

    function measure() {
      containerW = vw();
      const n = cardLine.children.length;
      lineW = n > 0 ? (CARD_WIDTH + CARD_GAP) * n : 1;
    }
    measure();
    position = containerW;

    function applyTransform() {
      cardLine.style.transform = "translateX(" + position + "px)";
    }

    function wrapPosition() {
      if (position < -lineW) position += lineW + containerW;
      else if (position > containerW) position -= lineW + containerW;
    }

    let scannerScanning = false;

    function clipAll() {
      const w = vw();
      const scanX = w / 2;
      const halfSW = SCANNER_WIDTH / 2;
      const sL = scanX - halfSW;
      const sR = scanX + halfSW;
      let anyScan = false;
      const wrappers = cardLine.children;
      for (let i = 0; i < wrappers.length; i++) {
        const wr = wrappers[i] as HTMLElement;
        const rect = wr.getBoundingClientRect();
        if (rect.right < -400 || rect.left > w + 400) continue;
        const normal = wr.firstElementChild as HTMLElement;
        const ascii = normal ? normal.nextElementSibling as HTMLElement : null;
        if (!normal || !ascii) continue;
        const cw = rect.width || 1;
        if (rect.left < sR && rect.right > sL) {
          anyScan = true;
          const iL = rect.left < sL ? sL - rect.left : 0;
          const iR = rect.right > sR ? sR - rect.left : cw;
          normal.style.setProperty("--clip-right", (iL / cw * 100) + "%");
          ascii.style.setProperty("--clip-left", (iR / cw * 100) + "%");
          if (!wr.dataset.scanned && iL > 0) {
            wr.dataset.scanned = "1";
            const fx = document.createElement("div");
            fx.className = "ps-scan-effect";
            wr.appendChild(fx);
            fx.addEventListener("animationend", function() {
              if (this.parentNode) this.parentNode.removeChild(this);
            }, { once: true });
          }
        } else if (rect.right < sL) {
          normal.style.setProperty("--clip-right", "100%");
          ascii.style.setProperty("--clip-left", "100%");
          delete wr.dataset.scanned;
        } else {
          normal.style.setProperty("--clip-right", "0%");
          ascii.style.setProperty("--clip-left", "0%");
          delete wr.dataset.scanned;
        }
      }
      scannerScanning = anyScan;
    }

    applyTransform();
    clipAll();

    // Drag handlers
    function startDrag(e: { clientX: number }) {
      isDragging = true;
      lastMouseX = e.clientX;
      mouseVelocity = 0;
      const t = getComputedStyle(cardLine).transform;
      if (t && t !== "none") {
        try { position = new DOMMatrix(t).m41; } catch (_) { /* keep */ }
      }
      cardLine.classList.add("ps-dragging");
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    }
    function handleMove(e: { clientX: number }) {
      if (!isDragging) return;
      const cx = e.clientX;
      if (typeof cx !== "number") return;
      const dx = cx - lastMouseX;
      lastMouseX = cx;
      if (dx < 0) { position += dx; mouseVelocity = dx * 60; }
      else { mouseVelocity = 0; }
      applyTransform();
      clipAll();
    }
    function handleUp() {
      if (!isDragging) return;
      isDragging = false;
      cardLine.classList.remove("ps-dragging");
      if (mouseVelocity < 0 && Math.abs(mouseVelocity) > CRUISE_SPEED) {
        velocity = Math.min(Math.abs(mouseVelocity), MAX_FLICK);
      } else { velocity = CRUISE_SPEED; }
      isAnimating = true;
      lastTime = performance.now();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    const onMouseDown = (e: MouseEvent) => startDrag(e);
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) { e.preventDefault(); startDrag(e.touches[0]); } };
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onTouchMove = (e: TouchEvent) => { if (isDragging && e.touches.length === 1) { e.preventDefault(); handleMove(e.touches[0]); } };
    const onMouseUp = () => handleUp();
    const onWheel = (e: WheelEvent) => { e.preventDefault(); if (e.deltaY > 0) { position -= 15; wrapPosition(); applyTransform(); clipAll(); } };
    const onSelectStart = (e: Event) => e.preventDefault();
    const onDragStart = (e: Event) => e.preventDefault();

    cardLine.addEventListener("mousedown", onMouseDown);
    cardLine.addEventListener("touchstart", onTouchStart, { passive: false });
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onMouseUp);
    document.addEventListener("touchcancel", onMouseUp);
    cardLine.addEventListener("wheel", onWheel, { passive: false });
    cardLine.addEventListener("selectstart", onSelectStart);
    cardLine.addEventListener("dragstart", onDragStart);

    eventCleanups.push(() => {
      cardLine.removeEventListener("mousedown", onMouseDown);
      cardLine.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onMouseUp);
      document.removeEventListener("touchcancel", onMouseUp);
      cardLine.removeEventListener("wheel", onWheel);
      cardLine.removeEventListener("selectstart", onSelectStart);
      cardLine.removeEventListener("dragstart", onDragStart);
    });

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { measure(); wrapPosition(); applyTransform(); clipAll(); }, 100);
    };
    window.addEventListener("resize", onResize);
    eventCleanups.push(() => window.removeEventListener("resize", onResize));

    // Reset
    (window as any).__psReset = () => {
      position = containerW;
      velocity = CRUISE_SPEED;
      isAnimating = true;
      isDragging = false;
      lastTime = performance.now();
      cardLine.classList.remove("ps-dragging");
      applyTransform();
      clipAll();
    };

    // ── Card stream tick ──
    function streamTick() {
      if (!alive) return;
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dt > 0.05) dt = 0.05;
      if (dt < 0) dt = 0;
      if (visible && isAnimating && !isDragging && dt > 0) {
        if (velocity > CRUISE_SPEED) {
          velocity *= MOMENTUM_DECAY;
          if (velocity - CRUISE_SPEED < 0.5) velocity = CRUISE_SPEED;
        } else if (velocity < CRUISE_SPEED) {
          velocity += (CRUISE_SPEED - velocity) * EASE_BLEND;
        }
        position -= velocity * dt;
        wrapPosition();
        applyTransform();
      }
      rafs.push(requestAnimationFrame(streamTick));
    }
    rafs.push(requestAnimationFrame(streamTick));

    // Clip loop
    function clipLoop() {
      if (!alive) return;
      if (visible) clipAll();
      rafs.push(requestAnimationFrame(clipLoop));
    }
    rafs.push(requestAnimationFrame(clipLoop));

    // Periodic ASCII refresh
    const asciiInterval = setInterval(() => {
      if (!visible) return;
      const els = cardLine.querySelectorAll(".ps-ascii-content");
      for (let i = 0; i < els.length; i++) {
        if (Math.random() < 0.15) els[i].textContent = generateCode(ASCII_COLS, ASCII_ROWS);
      }
    }, 200);
    intervals.push(asciiInterval as unknown as number);

    // ── Particle Background ──
    let pW = vw();
    const pH = 250;
    particleCanvas.width = pW;
    particleCanvas.height = pH;
    const pCount = 400;
    const px = new Float32Array(pCount);
    const py = new Float32Array(pCount);
    const pvx = new Float32Array(pCount);
    const pr = new Float32Array(pCount);
    const pa = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      px[i] = Math.random() * pW;
      py[i] = Math.random() * pH;
      pvx[i] = Math.random() * 60 + 30;
      pr[i] = Math.random() * 1.5 + 0.3;
      pa[i] = Math.random() * 0.6 + 0.2;
    }
    let pLastTime = performance.now();

    function particleTick() {
      if (!alive) return;
      if (!visible) { rafs.push(requestAnimationFrame(particleTick)); return; }
      const now = performance.now();
      const dt = clamp((now - pLastTime) / 1000, 0, 0.05);
      pLastTime = now;
      pCtx.clearRect(0, 0, pW, pH);
      pCtx.fillStyle = "#c4b5fd";
      const t = now * 0.001;
      for (let i = 0; i < pCount; i++) {
        px[i] += pvx[i] * dt;
        if (px[i] > pW + 10) { px[i] = -10; py[i] = Math.random() * pH; }
        py[i] += Math.sin(t + px[i] * 0.01) * 0.3;
        if (Math.random() < 0.05) { pa[i] += (Math.random() - 0.5) * 0.1; pa[i] = clamp(pa[i], 0.1, 0.8); }
        pCtx.globalAlpha = pa[i];
        pCtx.beginPath();
        pCtx.arc(px[i], py[i], pr[i], 0, 6.2832);
        pCtx.fill();
      }
      rafs.push(requestAnimationFrame(particleTick));
    }
    rafs.push(requestAnimationFrame(particleTick));

    const pResize = () => { pW = vw(); particleCanvas.width = pW; };
    window.addEventListener("resize", pResize);
    eventCleanups.push(() => window.removeEventListener("resize", pResize));

    // ── Scanner Particles ──
    let sW = vw();
    const sH = 300;
    scannerCanvas.width = sW;
    scannerCanvas.height = sH;
    let barX = sW / 2;
    const barW = 3;
    let fadeZone = 60;
    let glow = 1;
    let targetCount = 800;
    const speed = 0.05;

    const spx = new Float32Array(POOL_MAX);
    const spy = new Float32Array(POOL_MAX);
    const spvx = new Float32Array(POOL_MAX);
    const spvy = new Float32Array(POOL_MAX);
    const spr = new Float32Array(POOL_MAX);
    const spa = new Float32Array(POOL_MAX);
    const spoa = new Float32Array(POOL_MAX);
    const splife = new Float32Array(POOL_MAX);
    const spdecay = new Float32Array(POOL_MAX);
    const sptw = new Float32Array(POOL_MAX);
    const spta = new Float32Array(POOL_MAX);
    const spt = new Float32Array(POOL_MAX);
    let active = 0;

    // Build dot gradient
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = dotCanvas.height = 16;
    const dotCtx = dotCanvas.getContext("2d");
    if (dotCtx) {
      const g = dotCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, "rgba(196,181,253,0.8)");
      g.addColorStop(0.7, "rgba(139,92,246,0.4)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      dotCtx.fillStyle = g;
      dotCtx.beginPath();
      dotCtx.arc(8, 8, 8, 0, 6.2832);
      dotCtx.fill();
    }

    function initParticle(i: number) {
      spx[i] = barX + rf(-barW / 2, barW / 2);
      spy[i] = rf(0, sH);
      spvx[i] = rf(0.2, 1);
      spvy[i] = rf(-0.15, 0.15);
      spr[i] = rf(0.4, 1);
      spa[i] = rf(0.6, 1);
      spoa[i] = spa[i];
      splife[i] = 1;
      spdecay[i] = rf(0.005, 0.025);
      sptw[i] = rf(0.02, 0.08);
      spta[i] = rf(0.1, 0.25);
      spt[i] = 0;
    }

    // Seed initial particles
    for (let i = 0; i < 800 && active < POOL_MAX; i++) { initParticle(active); active++; }

    function removeParticle(i: number) {
      active--;
      if (i < active) {
        spx[i]=spx[active]; spy[i]=spy[active]; spvx[i]=spvx[active]; spvy[i]=spvy[active];
        spr[i]=spr[active]; spa[i]=spa[active]; spoa[i]=spoa[active]; splife[i]=splife[active];
        spdecay[i]=spdecay[active]; sptw[i]=sptw[active]; spta[i]=spta[active]; spt[i]=spt[active];
      }
    }

    function drawBar() {
      const g2 = glow;
      const fzRatio = clamp(fadeZone / sH, 0.01, 0.49);
      const vg = sCtx.createLinearGradient(0, 0, 0, sH);
      vg.addColorStop(0, "rgba(255,255,255,0)");
      vg.addColorStop(fzRatio, "rgba(255,255,255,1)");
      vg.addColorStop(1 - fzRatio, "rgba(255,255,255,1)");
      vg.addColorStop(1, "rgba(255,255,255,0)");

      sCtx.globalCompositeOperation = "lighter";
      const ga = clamp(g2, 0, 1);

      // Core line
      const cg = sCtx.createLinearGradient(barX - barW / 2, 0, barX + barW / 2, 0);
      cg.addColorStop(0, "rgba(255,255,255,0)");
      cg.addColorStop(0.3, `rgba(255,255,255,${clamp(0.9 * ga, 0, 1)})`);
      cg.addColorStop(0.5, `rgba(255,255,255,${ga})`);
      cg.addColorStop(0.7, `rgba(255,255,255,${clamp(0.9 * ga, 0, 1)})`);
      cg.addColorStop(1, "rgba(255,255,255,0)");
      sCtx.globalAlpha = 1;
      sCtx.fillStyle = cg;
      sCtx.beginPath();
      sCtx.roundRect(barX - barW / 2, 0, barW, sH, 15);
      sCtx.fill();

      // Glow 1
      const g1 = sCtx.createLinearGradient(barX - barW * 2, 0, barX + barW * 2, 0);
      g1.addColorStop(0, "rgba(139,92,246,0)");
      g1.addColorStop(0.5, `rgba(196,181,253,${clamp(0.8 * ga, 0, 1)})`);
      g1.addColorStop(1, "rgba(139,92,246,0)");
      sCtx.globalAlpha = scannerScanning ? 1 : 0.8;
      sCtx.fillStyle = g1;
      sCtx.beginPath();
      sCtx.roundRect(barX - barW * 2, 0, barW * 4, sH, 25);
      sCtx.fill();

      // Glow 2
      const g2g = sCtx.createLinearGradient(barX - barW * 4, 0, barX + barW * 4, 0);
      g2g.addColorStop(0, "rgba(139,92,246,0)");
      g2g.addColorStop(0.5, `rgba(139,92,246,${clamp(0.4 * ga, 0, 1)})`);
      g2g.addColorStop(1, "rgba(139,92,246,0)");
      sCtx.globalAlpha = scannerScanning ? 0.8 : 0.6;
      sCtx.fillStyle = g2g;
      sCtx.beginPath();
      sCtx.roundRect(barX - barW * 4, 0, barW * 8, sH, 35);
      sCtx.fill();

      if (scannerScanning) {
        const g3 = sCtx.createLinearGradient(barX - barW * 8, 0, barX + barW * 8, 0);
        g3.addColorStop(0, "rgba(139,92,246,0)");
        g3.addColorStop(0.5, "rgba(139,92,246,0.2)");
        g3.addColorStop(1, "rgba(139,92,246,0)");
        sCtx.globalAlpha = 0.6;
        sCtx.fillStyle = g3;
        sCtx.beginPath();
        sCtx.roundRect(barX - barW * 8, 0, barW * 16, sH, 45);
        sCtx.fill();
      }

      // Vertical fade mask
      sCtx.globalCompositeOperation = "destination-in";
      sCtx.globalAlpha = 1;
      sCtx.fillStyle = vg;
      sCtx.fillRect(0, 0, sW, sH);
    }

    function scannerTick() {
      if (!alive) return;
      if (!visible) { rafs.push(requestAnimationFrame(scannerTick)); return; }

      const tGlow = scannerScanning ? 3.5 : 1;
      const tCount = scannerScanning ? 2500 : 800;
      const tFade = scannerScanning ? 35 : 60;
      glow += (tGlow - glow) * speed;
      targetCount += (tCount - targetCount) * speed;
      fadeZone += (tFade - fadeZone) * speed;

      sCtx.globalCompositeOperation = "source-over";
      sCtx.clearRect(0, 0, sW, sH);
      drawBar();
      sCtx.globalCompositeOperation = "lighter";

      let i = 0;
      while (i < active) {
        spx[i] += spvx[i];
        spy[i] += spvy[i];
        spt[i]++;
        spa[i] = spoa[i] * splife[i] + Math.sin(spt[i] * sptw[i]) * spta[i];
        splife[i] -= spdecay[i];
        if (spx[i] > sW + 10 || splife[i] <= 0) { removeParticle(i); continue; }
        const pyv = spy[i];
        let fa = 1;
        if (pyv < fadeZone) fa = pyv / fadeZone;
        else if (pyv > sH - fadeZone) fa = (sH - pyv) / fadeZone;
        fa = clamp(fa, 0, 1);
        const alpha = spa[i] * fa;
        if (alpha > 0.01) {
          sCtx.globalAlpha = alpha;
          const r2 = spr[i] * 2;
          sCtx.drawImage(dotCanvas, spx[i] - spr[i], pyv - spr[i], r2, r2);
        }
        i++;
      }

      const cap = Math.floor(targetCount);
      const intensity = scannerScanning ? 1.8 : 0.8;
      if (Math.random() < intensity && active < cap && active < POOL_MAX) { initParticle(active); active++; }
      while (active > cap + 50 && active > 0) active--;

      rafs.push(requestAnimationFrame(scannerTick));
    }
    rafs.push(requestAnimationFrame(scannerTick));

    const sResize = () => { sW = vw(); barX = sW / 2; scannerCanvas.width = sW; };
    window.addEventListener("resize", sResize);
    eventCleanups.push(() => window.removeEventListener("resize", sResize));

    // Cleanup
    cleanupRef.current = () => {
      alive = false;
      observer.disconnect();
      rafs.forEach(id => cancelAnimationFrame(id));
      intervals.forEach(id => clearInterval(id));
      eventCleanups.forEach(fn => fn());
      delete (window as any).__psReset;
    };

    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, []);

  return (
    <section ref={sectionRef} id="scanner" className="ps-scanner-section py-16 md:py-24">
      <style>{SCOPED_CSS}</style>
      <svg style={{ display: "none" }} aria-hidden="true">
        <defs>
          <filter id="scanner-glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves={1} seed={17} result="turbulence"/>
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5}/>
              <feFuncG type="gamma" amplitude={0} exponent={1} offset={0}/>
              <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5}/>
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap"/>
            <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
              <fePointLight x={-200} y={-200} z={300}/>
            </feSpecularLighting>
            <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage"/>
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale={200} xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <div className="max-w-7xl mx-auto px-4 mb-8 md:mb-12">
        <AnimatedSection>
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Spot <span className="text-primary">Scanner</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Drag to explore — watch Spot get decoded
            </p>
          </div>
        </AnimatedSection>
      </div>

      <div className="ps-container">
        <canvas ref={particleCanvasRef} className="ps-particle-canvas" />
        <canvas ref={scannerCanvasRef} className="ps-scanner-canvas" />
        <div ref={cardStreamRef} className="ps-card-stream">
          <div ref={cardLineRef} className="ps-card-line" />
        </div>
        <div className="ps-reset-btn">
          <LiquidGlassButton size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </LiquidGlassButton>
        </div>
      </div>
    </section>
  );
};

export default PhotoScanner;
