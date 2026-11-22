"use client";

import { useEffect, useRef } from "react";

// Small hearts that follow the mouse, which Pedro asked to keep from the demo.
// Mouse only, capped in number, paused when idle, off for reduced motion.
export function CursorHearts() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, dpr = 1, raf = 0, running = false, lx = 0, ly = 0;
    const hs: { x: number; y: number; vx: number; vy: number; l: number; s: number; c: string; r: number }[] = [];
    const size = () => {
      W = innerWidth;
      H = innerHeight;
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
    };
    const heart = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
      ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.75, x, y + s);
      ctx.bezierCurveTo(x, y + s * 0.75, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
      ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
      ctx.fill();
    };
    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let i = hs.length - 1; i >= 0; i--) {
        const h = hs[i];
        h.x += h.vx;
        h.y += h.vy;
        h.vy -= 0.02;
        h.l -= 0.018;
        if (h.l <= 0) {
          hs.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = h.l * 0.85;
        ctx.fillStyle = h.c;
        ctx.translate(h.x, h.y);
        ctx.rotate(h.r);
        heart(0, -h.s / 2, h.s);
        ctx.restore();
      }
      if (hs.length) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const d = Math.hypot(e.clientX - lx, e.clientY - ly);
      if (d < 14 || hs.length > 40) return;
      lx = e.clientX;
      ly = e.clientY;
      hs.push({ x: lx, y: ly, vx: (Math.random() - 0.5) * 1.2, vy: -0.4 - Math.random(), l: 1, s: 9 + Math.random() * 9, c: Math.random() < 0.3 ? "#f2c46b" : "#ff4f86", r: (Math.random() - 0.5) * 0.6 });
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    size();
    addEventListener("resize", size);
    addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      removeEventListener("pointermove", move);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-50 size-full" />;
}
