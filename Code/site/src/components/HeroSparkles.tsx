"use client";

import { useEffect, useRef } from "react";

// Gold glints that twinkle exactly on the glowing heart outline of the background.
// The outline is found by sampling the active crop's own pixels, so the glints follow the art
// on every screen shape. A few warm motes drift upward; glints gather near the pointer.

type Crop = { name: string; ar: number; src: string };
const CROPS: Crop[] = [
  { name: "portrait", ar: 9 / 16, src: "/img/cover-portrait-1080.webp" },
  { name: "square", ar: 1, src: "/img/cover-square-1200.webp" },
  { name: "landscape", ar: 16 / 9, src: "/img/cover-landscape-1600.webp" },
];
const pick = (w: number, h: number) => (w / h <= 0.8 ? CROPS[0] : w / h <= 1.3 ? CROPS[1] : CROPS[2]);

const cache = new Map<string, Float32Array>();
async function goldPoints(c: Crop) {
  // Sample the background file the browser already picked, so nothing is downloaded twice.
  const shown = (document.querySelector(".hero-bg img") as HTMLImageElement | null)?.currentSrc;
  const src = shown && shown.includes(`cover-${c.name}`) ? shown : c.src;
  if (cache.has(src)) return cache.get(src)!;
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = 260;
  const H = Math.round(W / c.ar);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d", { willReadFrequently: true })!;
  x.drawImage(img, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data;
  const pts: number[] = [];
  for (let y = 0; y < H; y++)
    for (let i = 0; i < W; i++) {
      const k = (y * W + i) * 4;
      const r = d[k], g = d[k + 1], b = d[k + 2];
      if (r > 225 && g > 165 && b < 175 && r - b > 95) pts.push(i / W, y / H);
    }
  const a = new Float32Array(pts);
  cache.set(src, a);
  return a;
}

export function HeroSparkles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1, raf = 0, visible = true, alive = true;
    let pts: Float32Array<ArrayBufferLike> = new Float32Array();
    let geo = { w: 0, h: 0, x: 0, y: 0 };
    const glints: { x: number; y: number; t: number; life: number; s: number }[] = [];
    const motes = Array.from({ length: 22 }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.5, v: 0.00012 + Math.random() * 0.00025, p: Math.random() * 6 }));
    const ptr = { x: -1, y: -1 };

    const resize = async () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      const c = pick(W, H);
      const aw = Math.max(W, H * c.ar);
      geo = { w: aw, h: aw / c.ar, x: (W - aw) / 2, y: (H - aw / c.ar) / 2 };
      try {
        pts = await goldPoints(c);
      } catch {
        pts = new Float32Array();
      }
    };

    const star = (x: number, y: number, s: number, a: number) => {
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(x, y, 0, x, y, s * 2.4);
      g.addColorStop(0, "rgba(255,240,200,.9)");
      g.addColorStop(1, "rgba(255,190,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, s * 2.4, 0, 7);
      ctx.fill();
      ctx.fillStyle = "#fff8e6";
      ctx.beginPath();
      ctx.moveTo(x, y - s * 2);
      ctx.quadraticCurveTo(x, y, x + s * 2, y);
      ctx.quadraticCurveTo(x, y, x, y + s * 2);
      ctx.quadraticCurveTo(x, y, x - s * 2, y);
      ctx.quadraticCurveTo(x, y, x, y - s * 2);
      ctx.fill();
    };

    const spawn = (near?: { x: number; y: number }) => {
      const n = pts.length / 2;
      if (!n) return;
      let best = Math.floor(Math.random() * n);
      if (near) {
        // pick the closest of a few random outline points to the pointer
        let bd = Infinity;
        for (let k = 0; k < 12; k++) {
          const j = Math.floor(Math.random() * n);
          const dx = geo.x + pts[j * 2] * geo.w - near.x;
          const dy = geo.y + pts[j * 2 + 1] * geo.h - near.y;
          const dd = dx * dx + dy * dy;
          if (dd < bd) {
            bd = dd;
            best = j;
          }
        }
      }
      glints.push({ x: pts[best * 2], y: pts[best * 2 + 1], t: 0, life: 900 + Math.random() * 900, s: 1.2 + Math.random() * 2.2 });
    };

    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (glints.length < 46 && Math.random() < dt / 40) spawn();
      if (ptr.x >= 0 && Math.random() < dt / 60) spawn(ptr);
      for (let i = glints.length - 1; i >= 0; i--) {
        const g = glints[i];
        g.t += dt;
        if (g.t > g.life) {
          glints.splice(i, 1);
          continue;
        }
        const k = g.t / g.life;
        star(geo.x + g.x * geo.w, geo.y + g.y * geo.h, g.s, Math.sin(k * Math.PI));
      }
      for (const m of motes) {
        m.y -= m.v * dt;
        m.p += dt * 0.0012;
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        ctx.globalAlpha = 0.18 + 0.14 * Math.sin(m.p);
        ctx.fillStyle = "#ffd9a0";
        ctx.beginPath();
        ctx.arc(m.x * W + Math.sin(m.p) * 8, m.y * H, m.r, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (visible && alive) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const leave = () => (ptr.x = ptr.y = -1);
    const ro = new ResizeObserver(() => void resize());

    void resize().then(() => {
      if (!alive) return;
      ro.observe(cv);
      if (!reduced) io.observe(cv);
    });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
