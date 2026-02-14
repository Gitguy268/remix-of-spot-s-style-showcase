import { useRef, useEffect, useCallback } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const BASE1: RGB = { r: 44, g: 187, b: 195 };   // #2cbbc3
const BASE2: RGB = { r: 225, g: 241, b: 242 };  // #e1f1f2

const BLUE_SHADES: RGB[] = [
  { r: 24, g: 66, b: 175 },
  { r: 34, g: 99, b: 210 },
  { r: 15, g: 70, b: 190 },
  { r: 60, g: 120, b: 220 },
  { r: 40, g: 140, b: 235 },
];

const PARTICLE_COUNT = 120;
const ORB_COUNT = 4;

class Particle {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  ox: number = 0;
  oy: number = 0;
  size: number = 0;
  speedZ: number = 0;
  phase: number = 0;
  amp: number = 0;
  freq: number = 0;
  blueIndex: number = 0;
  brightness: number = 0;

  constructor() {
    this.reset(true);
  }

  reset(randomizePos = false) {
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 2000;
    this.z = Math.random() * 2000;
    this.size = Math.random() * 1.5 + 0.6;
    this.speedZ = Math.random() * 0.9 + 0.25;
    this.phase = Math.random() * Math.PI * 2;
    this.amp = Math.random() * 18 + 8;
    this.freq = Math.random() * 0.015 + 0.005;
    this.ox = this.x;
    this.oy = this.y;
    this.blueIndex = Math.floor(Math.random() * BLUE_SHADES.length);
    this.brightness = Math.random() * 0.35 + 0.4;
  }

  update(time: number, mouseX: number, mouseY: number) {
    this.z -= this.speedZ;
    if (this.z <= 0) {
      this.z = 2000;
      this.ox = (Math.random() - 0.5) * 2000;
      this.oy = (Math.random() - 0.5) * 2000;
    }
    this.x = this.ox + Math.sin(time * this.freq + this.phase) * this.amp;
    this.y = this.oy + Math.cos(time * this.freq * 0.8 + this.phase) * this.amp * 0.6;
    const mx = (mouseX - 0.5) * 320;
    const my = (mouseY - 0.5) * 320;
    const depthFactor = 1 - this.z / 2000;
    this.x += mx * depthFactor;
    this.y += my * depthFactor;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, blend: number) {
    const perspective = 900;
    const scale = perspective / (perspective + this.z);
    const sx = width / 2 + this.x * scale;
    const sy = height / 2 + this.y * scale;
    if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) return;
    const radius = this.size * scale * 2.2;
    const alpha = (1 - this.z / 2000) * 0.55 * this.brightness;
    const baseR = BASE1.r + (BASE2.r - BASE1.r) * (this.z / 2000);
    const baseG = BASE1.g + (BASE2.g - BASE1.g) * (this.z / 2000);
    const baseB = BASE1.b + (BASE2.b - BASE1.b) * (this.z / 2000);
    const blue = BLUE_SHADES[this.blueIndex];
    const r = Math.round(baseR + (blue.r - baseR) * blend);
    const g = Math.round(baseG + (blue.g - baseG) * blend);
    const b = Math.round(baseB + (blue.b - baseB) * blend);
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 2.2);
    grad.addColorStop(0.0, `rgba(${r + 40}, ${g + 40}, ${b + 40}, ${alpha * 0.9})`);
    grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
    grad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.beginPath();
    ctx.arc(sx, sy, radius * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

class FloatingOrb {
  x: number = 0;
  y: number = 0;
  z: number = 0;
  radius: number = 0;
  phase: number = 0;
  vx: number = 0;
  vy: number = 0;
  blueIndex: number = 0;
  pulse: number = 0;

  constructor() {
    this.x = Math.random() * 2000 - 1000;
    this.y = Math.random() * 2000 - 1000;
    this.z = Math.random() * 1500 + 500;
    this.radius = Math.random() * 110 + 70;
    this.phase = Math.random() * Math.PI * 2;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.blueIndex = Math.floor(Math.random() * BLUE_SHADES.length);
    this.pulse = Math.random() * 0.02 + 0.01;
  }

  update(mouseX: number, mouseY: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > 1500) this.x = -1500;
    if (this.x < -1500) this.x = 1500;
    if (this.y > 1500) this.y = -1500;
    if (this.y < -1500) this.y = 1500;
    const mx = (mouseX - 0.5) * 140;
    const my = (mouseY - 0.5) * 140;
    this.x += mx * 0.012;
    this.y += my * 0.012;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, blend: number) {
    const perspective = 900;
    const scale = perspective / (perspective + this.z);
    const sx = width / 2 + this.x * scale;
    const sy = height / 2 + this.y * scale;
    const sr = this.radius * scale;
    const pulseVal = Math.sin(time * this.pulse + this.phase) * 0.18 + 0.82;
    const alpha = 0.09 * pulseVal * (1 - this.z / 2000);
    const baseR = BASE2.r, baseG = BASE2.g, baseB = BASE2.b;
    const blue = BLUE_SHADES[this.blueIndex];
    const r = Math.round(baseR + (blue.r - baseR) * blend);
    const g = Math.round(baseG + (blue.g - baseG) * blend);
    const b = Math.round(baseB + (blue.b - baseB) * blend);
    const grad = ctx.createRadialGradient(sx - sr * 0.28, sy - sr * 0.28, 0, sx, sy, sr);
    grad.addColorStop(0.0, `rgba(${r + 28}, ${g + 28}, ${b + 28}, ${alpha * 1.4})`);
    grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    grad.addColorStop(1.0, `rgba(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)}, 0)`);
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const stateRef = useRef({
    particles: [] as Particle[],
    orbs: [] as FloatingOrb[],
    time: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    blend: 0,
    targetBlend: 0,
    lastInputTime: performance.now(),
    width: 0,
    height: 0,
  });

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, blend: number) => {
    const { width, height } = stateRef.current;
    const baseR1 = 10, baseG1 = 22, baseB1 = 40;
    const blueR = 6 + blend * 18;
    const blueG = 18 + blend * 28;
    const blueB = 52 + blend * 32;
    const grad = ctx.createRadialGradient(
      width * mouseX, height * mouseY, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    const r1 = Math.round(baseR1 + (BASE1.r * 0.18 - baseR1) * (1 - blend) + blueR * blend);
    const g1 = Math.round(baseG1 + (BASE1.g * 0.18 - baseG1) * (1 - blend) + blueG * blend);
    const b1 = Math.round(baseB1 + (BASE1.b * 0.18 - baseB1) * (1 - blend) + blueB * blend);
    grad.addColorStop(0, `rgb(${r1 + 18}, ${g1 + 26}, ${b1 + 36})`);
    grad.addColorStop(0.55, `rgb(${r1}, ${g1}, ${b1})`);
    grad.addColorStop(1, `rgb(${Math.max(0, r1 - 12)}, ${Math.max(0, g1 - 12)}, ${Math.max(0, b1 - 12)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }, []);

  const drawVignette = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = stateRef.current;
    const grad = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.33,
      width / 2, height / 2, Math.max(width, height) * 0.85
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const state = stateRef.current;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      state.width = canvas.width = parent.offsetWidth;
      state.height = canvas.height = parent.offsetHeight;
    };

    const init = () => {
      resize();
      state.particles = [];
      state.orbs = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        state.particles.push(new Particle());
      }
      for (let i = 0; i < ORB_COUNT; i++) {
        state.orbs.push(new FloatingOrb());
      }
    };

    const animate = () => {
      state.time++;
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.06;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.06;
      state.blend += (state.targetBlend - state.blend) * 0.032;

      // Idle easing
      const now = performance.now();
      const idleMs = now - state.lastInputTime;
      if (idleMs > 1500) {
        state.targetMouseX += (0.5 - state.targetMouseX) * 0.02;
        state.targetMouseY += (0.5 - state.targetMouseY) * 0.02;
        state.targetBlend += (0 - state.targetBlend) * 0.02;
      }

      drawBackground(ctx, state.mouseX, state.mouseY, state.blend);
      
      state.orbs.forEach(o => {
        o.update(state.mouseX, state.mouseY);
        o.draw(ctx, state.width, state.height, state.time, state.blend);
      });
      

        state.particles.sort((a, b) => b.z - a.z);
      }
      state.particles.forEach(p => {
        p.update(state.time, state.mouseX, state.mouseY);
        p.draw(ctx, state.width, state.height, state.blend);
      });
      
      drawVignette(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    const updateBlendFromPointer = (nx: number, ny: number) => {
      state.targetMouseX = nx;
      state.targetMouseY = ny;
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      state.targetBlend = Math.min(1, dist * 2.2);
      state.lastInputTime = performance.now();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      updateBlendFromPointer(nx, ny);
    };

    const handleMouseLeave = () => {
      state.targetMouseX = 0.5;
      state.targetMouseY = 0.5;
      state.targetBlend = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const nx = (touch.clientX - rect.left) / rect.width;
        const ny = (touch.clientY - rect.top) / rect.height;
        updateBlendFromPointer(nx, ny);
      }
    };

    const handleTouchEnd = () => {
      state.targetBlend = 0;
    };

    init();
    animate();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement!);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [drawBackground, drawVignette]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      style={{ display: 'block' }}
    />
  );
};

export default ParticleBackground;
