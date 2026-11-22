"use client";

import { useEffect, useRef } from "react";

// A puffy 3D heart built from ~900 sugar sprinkles, rotating slowly and leaning toward the pointer.
// Points sit on a heart-shaped shell; each sprinkle is a short rounded rod with its own colour and spin.
const COLORS = ["#d81b60", "#ff7aa6", "#f2c46b", "#fff3dc", "#8e1542", "#ffb3c8"];

export function SugarHeart({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const P = Array.from({ length: 900 }, () => {
      const t = rnd() * Math.PI * 2;
      const z = rnd() * 2 - 1;
      const k = Math.sqrt(1 - z * z * 0.92);
      const hx = 16 * Math.sin(t) ** 3;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x: (hx / 17) * k, y: (hy / 17) * k + 0.1, z: z * 0.48, a: rnd() * Math.PI, c: COLORS[Math.floor(rnd() * COLORS.length)], l: 0.7 + rnd() * 0.6 };
    });
    let W = 0, H = 0, dpr = 1, raf = 0, rot = 0, tilt = 0, tx = 0, ty = 0, visible = false;

    const size = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const s = Math.min(W, H) * 0.42;
      const cy = Math.cos(rot), sy = Math.sin(rot), cx = Math.cos(tilt), sx = Math.sin(tilt);
      const pts = P.map((p) => {
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const f = 3.2 / (3.2 + z2);
        return { X: W / 2 + x1 * s * f, Y: H / 2 + y2 * s * f, z: z2, f, p };
      }).sort((a, b) => b.z - a.z);
      ctx.lineCap = "round";
      for (const q of pts) {
        const L = 5.5 * q.f * q.p.l;
        const ang = q.p.a + rot * 0.6;
        ctx.globalAlpha = 0.55 + 0.45 * (1 - (q.z + 0.6) / 1.2);
        ctx.strokeStyle = q.p.c;
        ctx.lineWidth = 3.1 * q.f;
        ctx.beginPath();
        ctx.moveTo(q.X - Math.cos(ang) * L, q.Y - Math.sin(ang) * L);
        ctx.lineTo(q.X + Math.cos(ang) * L, q.Y + Math.sin(ang) * L);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      rot += dt * 0.00045 + (tx - 0) * 0.0004 * dt;
      tilt += (ty * 0.5 - tilt) * 0.05;
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const leave = () => (tx = ty = 0);
    const ro = new ResizeObserver(() => {
      size();
      draw();
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
