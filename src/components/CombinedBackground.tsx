import { useEffect, useRef } from "react";
import * as THREE from "three";

// =========================================================================
//  CONFIGURATION
// =========================================================================
const CONFIG = {
  // Colors
  base1: { r: 44, g: 187, b: 195 },
  base2: { r: 225, g: 241, b: 242 },
  blueShades: [
    { r: 24, g: 66, b: 175 },
    { r: 34, g: 99, b: 210 },
    { r: 15, g: 70, b: 190 },
    { r: 60, g: 120, b: 220 },
    { r: 40, g: 140, b: 235 },
  ],
  primaryHex: 0x2cbbc3,
  hoverHex1: 0x0077be,
  hoverHex2: 0x004488,
  // Particle system
  particleCount: 180,
  orbCount: 6,
  fieldSize: 2000,
  perspective: 900,
  parallaxStrength: 320,
  // Easing
  mouseEase: 0.06,
  blendEase: 0.032,
  idleEase: 0.02,
  idleDelay: 1500,
  // Three.js plane
  planeSize: 200,
  planeSegments: 60,
  wireframeOpacity: 0.25,
  fogDensity: 0.003,
  cameraZ: 50,
  cameraY: 10,
  waveSpeed: 0.005,
  // Grid reactivity
  gridCameraFollowX: 7,
  gridCameraFollowY: 3.5,
  gridCameraEase: 0.028,
  gridColorEase: 0.065,
  gridWaveMouseAmp: 2.5,
  gridOpacityBoost: 0.10,
  gridTiltX: 0.06,
  gridTiltZ: 0.04,
  gridTiltEase: 0.024,
  gridActivityEase: 0.032,
  // Vignette
  vignetteAlpha: 0.38,
} as const;

// =========================================================================
//  HELPERS
// =========================================================================
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function safeNum(v: number, fallback: number) {
  return Number.isFinite(v) ? v : fallback;
}
function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${clamp(safeNum(r | 0, 0), 0, 255)},${clamp(safeNum(g | 0, 0), 0, 255)},${clamp(safeNum(b | 0, 0), 0, 255)},${clamp(safeNum(a, 0), 0, 1).toFixed(3)})`;
}
function rgbStr(r: number, g: number, b: number) {
  return `rgb(${clamp(safeNum(r | 0, 0), 0, 255)},${clamp(safeNum(g | 0, 0), 0, 255)},${clamp(safeNum(b | 0, 0), 0, 255)})`;
}

// =========================================================================
//  Particle + Orb classes
// =========================================================================
interface SharedState {
  width: number; height: number; dpr: number; time: number; threeTime: number;
  targetMX: number; targetMY: number; mx: number; my: number;
  targetBlend: number; blend: number; lastInputTime: number; lastFrameTime: number;
}

class Particle {
  ox = 0; oy = 0; z = 0; x = 0; y = 0;
  size = 0; speedZ = 0; phase = 0; amp = 0; freq = 0;
  blueIdx = 0; brightness = 0;
  constructor() { this.reset(); }
  reset() {
    const S = CONFIG.fieldSize;
    this.ox = (Math.random() - 0.5) * S;
    this.oy = (Math.random() - 0.5) * S;
    this.z = Math.random() * S;
    this.x = this.ox; this.y = this.oy;
    this.size = Math.random() * 1.5 + 0.6;
    this.speedZ = Math.random() * 0.9 + 0.25;
    this.phase = Math.random() * Math.PI * 2;
    this.amp = Math.random() * 18 + 8;
    this.freq = Math.random() * 0.015 + 0.005;
    this.blueIdx = (Math.random() * CONFIG.blueShades.length) | 0;
    this.brightness = Math.random() * 0.35 + 0.4;
  }
  update(dt: number, state: SharedState) {
    const S = CONFIG.fieldSize;
    this.z -= this.speedZ * dt;
    if (this.z <= 0) {
      this.z = S;
      this.ox = (Math.random() - 0.5) * S;
      this.oy = (Math.random() - 0.5) * S;
    }
    const t = state.time;
    this.x = this.ox + Math.sin(t * this.freq * 0.001 + this.phase) * this.amp;
    this.y = this.oy + Math.cos(t * this.freq * 0.0008 + this.phase) * this.amp * 0.6;
    const depth = 1 - this.z / S;
    this.x += (state.mx - 0.5) * CONFIG.parallaxStrength * depth;
    this.y += (state.my - 0.5) * CONFIG.parallaxStrength * depth;
  }
  draw(ctx: CanvasRenderingContext2D, state: SharedState) {
    const { perspective, fieldSize, base1, base2, blueShades } = CONFIG;
    const { width, height, blend } = state;
    const scale = perspective / (perspective + this.z);
    const sx = width * 0.5 + this.x * scale;
    const sy = height * 0.5 + this.y * scale;
    if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) return;
    const radius = this.size * scale * 2.2;
    const alpha = (1 - this.z / fieldSize) * 0.55 * this.brightness;
    if (alpha < 0.005) return;
    const depthT = this.z / fieldSize;
    const bR = base1.r + (base2.r - base1.r) * depthT;
    const bG = base1.g + (base2.g - base1.g) * depthT;
    const bB = base1.b + (base2.b - base1.b) * depthT;
    const blue = blueShades[this.blueIdx];
    const r = bR + (blue.r - bR) * blend;
    const g = bG + (blue.g - bG) * blend;
    const b = bB + (blue.b - bB) * blend;
    const outerR = radius * 2.2;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, outerR);
    grad.addColorStop(0, rgba(r + 40, g + 40, b + 40, alpha * 0.9));
    grad.addColorStop(0.45, rgba(r, g, b, alpha * 0.6));
    grad.addColorStop(1, rgba(r, g, b, 0));
    ctx.beginPath();
    ctx.arc(sx, sy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

class FloatingOrb {
  x = 0; y = 0; z = 0; r = 0; phase = 0; vx = 0; vy = 0; blueIdx = 0; pulse = 0;
  constructor() {
    this.x = Math.random() * 2000 - 1000;
    this.y = Math.random() * 2000 - 1000;
    this.z = Math.random() * 1500 + 500;
    this.r = Math.random() * 110 + 70;
    this.phase = Math.random() * Math.PI * 2;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.blueIdx = (Math.random() * CONFIG.blueShades.length) | 0;
    this.pulse = Math.random() * 0.02 + 0.01;
  }
  update(dt: number, state: SharedState) {
    this.x += (this.vx + (state.mx - 0.5) * 1.68) * dt;
    this.y += (this.vy + (state.my - 0.5) * 1.68) * dt;
    const LIMIT = 1500, RANGE = LIMIT * 2;
    if (this.x > LIMIT) this.x -= RANGE;
    if (this.x < -LIMIT) this.x += RANGE;
    if (this.y > LIMIT) this.y -= RANGE;
    if (this.y < -LIMIT) this.y += RANGE;
  }
  draw(ctx: CanvasRenderingContext2D, state: SharedState) {
    const { perspective, fieldSize, base2, blueShades } = CONFIG;
    const { width, height, blend, time } = state;
    const scale = perspective / (perspective + this.z);
    const sx = width * 0.5 + this.x * scale;
    const sy = height * 0.5 + this.y * scale;
    const sr = this.r * scale;
    const pulseV = Math.sin(time * this.pulse * 0.001 + this.phase) * 0.18 + 0.82;
    const alpha = 0.09 * pulseV * (1 - this.z / fieldSize);
    if (alpha < 0.003) return;
    const blue = blueShades[this.blueIdx];
    const r = base2.r + (blue.r - base2.r) * blend;
    const g = base2.g + (blue.g - base2.g) * blend;
    const b = base2.b + (blue.b - base2.b) * blend;
    const grad = ctx.createRadialGradient(sx - sr * 0.28, sy - sr * 0.28, 0, sx, sy, sr);
    grad.addColorStop(0, rgba(r + 28, g + 28, b + 28, alpha * 1.4));
    grad.addColorStop(0.55, rgba(r, g, b, alpha));
    grad.addColorStop(1, rgba(r * 0.85, g * 0.85, b * 0.85, 0));
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// =========================================================================
//  COMPONENT
// =========================================================================
const CombinedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const threeContainer = threeContainerRef.current;
    if (!canvas || !threeContainer) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Shared state
    const state: SharedState = {
      width: 0, height: 0, dpr: 1, time: 0, threeTime: 0,
      targetMX: 0.5, targetMY: 0.5, mx: 0.5, my: 0.5,
      targetBlend: 0, blend: 0,
      lastInputTime: performance.now(), lastFrameTime: performance.now(),
    };

    // Particles & orbs
    const particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
    const orbs = Array.from({ length: CONFIG.orbCount }, () => new FloatingOrb());

    // Vignette
    let vignetteGrad: CanvasGradient | null = null;
    function rebuildVignetteGrad() {
      const cx = state.width * 0.5, cy = state.height * 0.5;
      vignetteGrad = ctx!.createRadialGradient(cx, cy, state.height * 0.33, cx, cy, Math.max(state.width, state.height) * 0.85);
      vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGrad.addColorStop(1, `rgba(0,0,0,${CONFIG.vignetteAlpha})`);
    }

    function drawBackground() {
      const { width, height, mx, my, blend } = state;
      const { base1 } = CONFIG;
      const baseR1 = 10, baseG1 = 22, baseB1 = 40;
      const blueR = 6 + blend * 18, blueG = 18 + blend * 28, blueB = 52 + blend * 32;
      const r1 = (baseR1 + (base1.r * 0.18 - baseR1) * (1 - blend) + blueR * blend) | 0;
      const g1 = (baseG1 + (base1.g * 0.18 - baseG1) * (1 - blend) + blueG * blend) | 0;
      const b1 = (baseB1 + (base1.b * 0.18 - baseB1) * (1 - blend) + blueB * blend) | 0;
      const grad = ctx!.createRadialGradient(width * mx, height * my, 0, width * 0.5, height * 0.5, Math.max(width, height));
      grad.addColorStop(0, rgbStr(r1 + 18, g1 + 26, b1 + 36));
      grad.addColorStop(0.55, rgbStr(r1, g1, b1));
      grad.addColorStop(1, rgbStr(Math.max(0, r1 - 12), Math.max(0, g1 - 12), Math.max(0, b1 - 12)));
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawVignette() {
      if (!vignetteGrad) return;
      ctx!.fillStyle = vignetteGrad;
      ctx!.fillRect(0, 0, state.width, state.height);
    }

    // Resize canvas
    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.dpr = dpr;
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas!.width = state.width * dpr;
      canvas!.height = state.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Three.js setup
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0a1628, CONFIG.fogDensity);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, CONFIG.cameraY, CONFIG.cameraZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const threeCanvas = renderer.domElement;
    Object.assign(threeCanvas.style, {
      position: "absolute", inset: "0",
      width: "100%", height: "100%",
      pointerEvents: "none",
    });
    threeContainer.appendChild(threeCanvas);

    const planeGeo = new THREE.PlaneGeometry(CONFIG.planeSize, CONFIG.planeSize, CONFIG.planeSegments, CONFIG.planeSegments);
    const planeMat = new THREE.MeshBasicMaterial({
      color: CONFIG.primaryHex,
      wireframe: true,
      transparent: true,
      opacity: CONFIG.wireframeOpacity,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = -Math.PI * 0.5;
    scene.add(planeMesh);

    const vtxCount = planeGeo.attributes.position.count;
    const origPos = Float32Array.from(planeGeo.attributes.position.array);
    const planePos = planeGeo.attributes.position.array as Float32Array;

    const threeMouse = new THREE.Vector2();
    const threeTargetColor = new THREE.Color(CONFIG.primaryHex);
    const threePrimaryCol = new THREE.Color(CONFIG.primaryHex);
    let smoothGridActivity = 0;

    // Pointer handling
    function updatePointer(nx: number, ny: number) {
      state.targetMX = nx;
      state.targetMY = ny;
      const dx = nx - 0.5, dy = ny - 0.5;
      state.targetBlend = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2.2);
      state.lastInputTime = performance.now();
      threeMouse.x = nx * 2 - 1;
      threeMouse.y = -(ny * 2 - 1);
      threeTargetColor.setHex(threeMouse.x > 0 ? CONFIG.hoverHex1 : CONFIG.hoverHex2);
    }

    function resetPointer() {
      state.targetMX = 0.5;
      state.targetMY = 0.5;
      state.targetBlend = 0;
      threeTargetColor.setHex(CONFIG.primaryHex);
    }

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };
    const handleMouseLeave = () => resetPointer();
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updatePointer(t.clientX / window.innerWidth, t.clientY / window.innerHeight);
    };
    const handleTouchEnd = () => resetPointer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Resize
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeCanvas();
        rebuildVignetteGrad();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }, 100);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let rafId = 0;
    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      const rawDt = now - state.lastFrameTime;
      state.lastFrameTime = now;
      const dt = Math.min(rawDt, 100) / 16.667;
      state.time = now;

      // Easing
      state.mx = lerp(state.mx, state.targetMX, 1 - Math.pow(1 - CONFIG.mouseEase, dt));
      state.my = lerp(state.my, state.targetMY, 1 - Math.pow(1 - CONFIG.mouseEase, dt));
      state.blend = lerp(state.blend, state.targetBlend, 1 - Math.pow(1 - CONFIG.blendEase, dt));

      // Idle recovery
      const idle = now - state.lastInputTime;
      if (idle > CONFIG.idleDelay) {
        const e = 1 - Math.pow(1 - CONFIG.idleEase, dt);
        state.targetMX = lerp(state.targetMX, 0.5, e);
        state.targetMY = lerp(state.targetMY, 0.5, e);
        state.targetBlend = lerp(state.targetBlend, 0, e);
        threeTargetColor.lerp(threePrimaryCol, e);
      }

      // Grid activity
      const mouseDistFromCenter = Math.sqrt(threeMouse.x * threeMouse.x + threeMouse.y * threeMouse.y);
      const targetActivity = clamp(mouseDistFromCenter, 0, 1);
      smoothGridActivity = lerp(smoothGridActivity, targetActivity, 1 - Math.pow(1 - CONFIG.gridActivityEase, dt));

      // 2D Canvas
      drawBackground();
      for (let i = 0; i < orbs.length; i++) { orbs[i].update(dt, state); orbs[i].draw(ctx!, state); }
      particles.sort((a, b) => b.z - a.z);
      for (let i = 0; i < particles.length; i++) { particles[i].update(dt, state); particles[i].draw(ctx!, state); }
      drawVignette();

      // Three.js
      state.threeTime += CONFIG.waveSpeed * dt;
      const tt = state.threeTime;
      const mouseWaveBoost = smoothGridActivity * CONFIG.gridWaveMouseAmp;
      for (let i = 0; i < vtxCount; i++) {
        const i3 = i * 3;
        const x = origPos[i3], y = origPos[i3 + 1];
        planePos[i3 + 2] =
          Math.sin(x * 0.05 + tt) * (3 + mouseWaveBoost) +
          Math.cos(y * 0.05 + tt) * (3 + mouseWaveBoost) +
          Math.sin(x * 0.1 + y * 0.1 + tt) * (2 + mouseWaveBoost * 0.6);
      }
      planeGeo.attributes.position.needsUpdate = true;
      planeMat.color.lerp(threeTargetColor, 1 - Math.pow(1 - CONFIG.gridColorEase, dt));
      planeMat.opacity = CONFIG.wireframeOpacity + CONFIG.gridOpacityBoost * smoothGridActivity;

      const tiltEase = 1 - Math.pow(1 - CONFIG.gridTiltEase, dt);
      planeMesh.rotation.x = lerp(planeMesh.rotation.x, -Math.PI * 0.5 + threeMouse.y * CONFIG.gridTiltX, tiltEase);
      planeMesh.rotation.z = lerp(planeMesh.rotation.z, threeMouse.x * CONFIG.gridTiltZ, tiltEase);

      const camEase = 1 - Math.pow(1 - CONFIG.gridCameraEase, dt);
      camera.position.x += (threeMouse.x * CONFIG.gridCameraFollowX - camera.position.x) * camEase;
      camera.position.y += (CONFIG.cameraY + threeMouse.y * CONFIG.gridCameraFollowY - camera.position.y) * camEase;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    // Init
    resizeCanvas();
    rebuildVignetteGrad();
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", onResize);
      if (threeContainer.contains(threeCanvas)) threeContainer.removeChild(threeCanvas);
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, display: "block" }}
      />
      <div
        ref={threeContainerRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
};

export default CombinedBackground;
