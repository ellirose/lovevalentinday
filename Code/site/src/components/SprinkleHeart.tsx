"use client";

import { useEffect, useRef } from "react";

// A flat heart made of ~650 sugar sprinkles. When it scrolls into view the sprinkles rain down and
// settle into the heart; the pointer scatters them and they spring back. It always reads as a heart.
const COLORS = ["#e91e63", "#ff7aa8", "#ffc21a", "#ffe27a", "#fff6e0", "#b5179e"];

const inHeart = (x: number, y: number) => {
  // implicit heart curve, x and y roughly in [-1.3, 1.3]
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
};

export function SprinkleHeart({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const P: { hx: number; hy: number; x: number; y: number; vx: number; vy: number; a: number; va: number; c: string; l: number; delay: number }[] = [];
    while (P.length < 650) {
      const x = rnd() * 2.6 - 1.3;
      const y = rnd() * 2.6 - 1.3;
      if (inHeart(x, y)) P.push({ hx: x, hy: -y, x: 0, y: 0, vx: 0, vy: 0, a: rnd() * Math.PI, va: (rnd() - 0.5) * 0.02, c: COLORS[Math.floor(rnd() * COLORS.length)], l: 0.7 + rnd() * 0.6, delay: rnd() * 900 });
    }
    let W = 0, H = 0, dpr = 1, raf = 0, visible = false, started = 0, scale = 1, cx = 0, cy = 0;
    const ptr = { x: -9999, y: -9999 };

    const size = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      scale = Math.min(W, H) * 0.36;
      cx = W / 2;
      cy = H * 0.47;
    };
    const home = (p: (typeof P)[number]) => [cx + p.hx * scale, cy + p.hy * scale];
    const reset = () => {
      P.forEach((p) => {
        const [hx] = home(p);
        p.x = hx + (rnd() - 0.5) * 60;
        p.y = -20 - rnd() * H * 0.6;
        p.vx = 0;
        p.vy = 0;
      });
    };
    const settle = () =>
      P.forEach((p) => {
        [p.x, p.y] = home(p);
      });

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      for (const p of P) {
        if (!reduced && t - started > p.delay) {
          const [hx, hy] = home(p);
          const dx = p.x - ptr.x, dy = p.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 3600) {
            const f = (3600 - d2) / 3600;
            p.vx += (dx / Math.sqrt(d2 + 1)) * f * 3;
            p.vy += (dy / Math.sqrt(d2 + 1)) * f * 3;
          }
          p.vx += (hx - p.x) * 0.045;
          p.vy += (hy - p.y) * 0.045;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
          p.a += p.va;
        }
        const L = 5.2 * p.l * (scale / 120);
        ctx.strokeStyle = p.c;
        ctx.lineWidth = 3.2 * (scale / 120);
        ctx.beginPath();
        ctx.moveTo(p.x - Math.cos(p.a) * L, p.y - Math.sin(p.a) * L);
        ctx.lineTo(p.x + Math.cos(p.a) * L, p.y + Math.sin(p.a) * L);
        ctx.stroke();
      }
    };
    const loop = (t: number) => {
      draw(t);
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (reduced) {
        settle();
        draw(0);
        return;
      }
      if (visible) {
        if (!was && !started) {
          reset();
          started = performance.now();
        }
        raf = requestAnimationFrame(loop);
      }
    });
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const leave = () => {
      ptr.x = ptr.y = -9999;
    };
    const ro = new ResizeObserver(() => {
      size();
      if (!started || reduced) settle();
      draw(performance.now());
    });
    ro.observe(cv);
    io.observe(cv);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
