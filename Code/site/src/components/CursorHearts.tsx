"use client";

import { useEffect, useRef } from "react";

// Pointer effects from the demo, in a bright style:
// - floating hearts drift up the page and swerve away from the pointer;
// - a soft gold glow follows the mouse and grows over anything that can be pressed;
// - the mouse leaves a trail of bright hearts and sparkles, and a click bursts into sparkles.
// Off for reduced motion; the glow and trail are for mouse pointers only; paused while the tab is hidden.

type Bit = { x: number; y: number; vx: number; vy: number; l: number; s: number; c: string; r: number; kind: 0 | 1; tw: number };
type Floater = { x: number; y: number; vx: number; vy: number; by: number; s: number; a: number; t: number; c: string };

const BRIGHT = ["#ffd54a", "#ffe98a", "#ff4f8b", "#ff7aa8", "#ffffff", "#ffc21a"];
const SOFT = ["#ff5c8d", "#ff8fb0", "#ffc21a"];
const PRESSABLE = 'a[href], button:not(:disabled), [role="button"], [role="switch"], summary, label[for], select';

export function CursorHearts() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, dpr = 1, raf = 0, lx = -99, ly = -99;
    const p = { x: -999, y: -999, gx: -999, gy: -999, on: false, press: 0, glow: 0 };
    const bits: Bit[] = [];
    const floaters: Floater[] = [];

    const size = () => {
      W = innerWidth;
      H = innerHeight;
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      const want = W < 640 ? 10 : 22;
      while (floaters.length < want) floaters.push(newFloater(Math.random() * H));
      floaters.length = want;
    };
    const newFloater = (y: number): Floater => ({
      x: Math.random() * W, y, vx: 0, vy: 0, by: -(0.18 + Math.random() * 0.45), s: 9 + Math.random() * 16, a: 0.14 + Math.random() * 0.2, t: Math.random() * 6,
      c: SOFT[(Math.random() * SOFT.length) | 0],
    });

    const heart = (s: number) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.75, 0, s);
      ctx.bezierCurveTo(0, s * 0.75, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
      ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
      ctx.fill();
    };
    const star = (s: number) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? s * 0.18 : s * 0.5;
        const a = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    };
    const spawn = (x: number, y: number, n: number, speed: number) => {
      for (let i = 0; i < n && bits.length < 90; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = speed * (0.4 + Math.random());
        bits.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, l: 1, s: 7 + Math.random() * 10,
          c: BRIGHT[(Math.random() * BRIGHT.length) | 0], r: (Math.random() - 0.5) * 0.8, kind: Math.random() < 0.55 ? 1 : 0, tw: Math.random() * 6,
        });
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Floating hearts: drift up, sway, swerve away from the pointer.
      for (const f of floaters) {
        const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy) || 1;
        if (d < 170) {
          f.vx += (dx / d) * 0.7;
          f.vy += (dy / d) * 0.7;
        }
        f.vx *= 0.94;
        f.vy *= 0.94;
        f.x += f.vx + Math.sin((f.t += 0.02)) * 0.4;
        f.y += f.by + f.vy;
        if (f.y < -40) Object.assign(f, newFloater(H + 30));
        if (f.x < -40) f.x = W + 30;
        if (f.x > W + 40) f.x = -30;
        ctx.save();
        ctx.globalAlpha = f.a;
        ctx.fillStyle = f.c;
        ctx.translate(f.x, f.y);
        heart(f.s);
        ctx.restore();
      }

      // Glow that follows the mouse, larger over anything that can be pressed.
      if (fine && p.on) {
        p.gx += (p.x - p.gx) * 0.25;
        p.gy += (p.y - p.gy) * 0.25;
        p.glow += ((p.press ? 1 : 0) - p.glow) * 0.15;
        const R = 34 + p.glow * 26;
        const g = ctx.createRadialGradient(p.gx, p.gy, 0, p.gx, p.gy, R);
        // A light centre keeps text under the pointer readable; the brightness sits in the halo and ring.
        // Over pressable things the centre clears completely, so labels under the pointer stay sharp.
        const core = 1 - p.glow;
        g.addColorStop(0, `rgba(255, 255, 240, ${0.4 * core})`);
        g.addColorStop(0.45, `rgba(255, 226, 122, ${0.34 * core})`);
        g.addColorStop(0.72, `rgba(255, 194, 26, ${0.24 + p.glow * 0.14})`);
        g.addColorStop(1, "rgba(255, 79, 139, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.gx, p.gy, R, 0, Math.PI * 2);
        ctx.fill();
        if (p.glow > 0.05) {
          // Over anything pressable: a bright ring with a soft gold halo.
          ctx.save();
          ctx.shadowColor = "rgba(255, 194, 26, .9)";
          ctx.shadowBlur = 14;
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.95 * p.glow})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(p.gx, p.gy, R * 0.62, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeStyle = `rgba(255, 194, 26, ${0.9 * p.glow})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.gx, p.gy, R * 0.62 + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Bright trail and bursts.
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.96;
        b.vy = b.vy * 0.96 - 0.03;
        b.l -= 0.022;
        if (b.l <= 0) {
          bits.splice(i, 1);
          continue;
        }
        const twinkle = 0.75 + Math.sin((b.tw += 0.35)) * 0.25;
        ctx.save();
        ctx.globalAlpha = Math.min(1, b.l * 1.2);
        ctx.fillStyle = b.c;
        ctx.shadowColor = b.c === "#ffffff" ? "#ffd54a" : b.c;
        ctx.shadowBlur = 12;
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        if (b.kind) star(b.s * twinkle * 1.3);
        else {
          ctx.translate(0, -b.s / 2);
          heart(b.s);
        }
        ctx.restore();
      }
    };

    const move = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (e.pointerType !== "mouse") return;
      if (!p.on) {
        p.gx = p.x;
        p.gy = p.y;
        p.on = true;
      }
      const t = e.target as Element | null;
      p.press = t?.closest?.(PRESSABLE) ? 1 : 0;
      if (Math.hypot(p.x - lx, p.y - ly) > 16) {
        lx = p.x;
        ly = p.y;
        spawn(p.x, p.y, p.press ? 2 : 1, 0.9);
      }
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") spawn(e.clientX, e.clientY, 14, 3.2);
    };
    const leave = () => {
      p.on = false;
      p.x = p.y = -999;
    };

    size();
    raf = requestAnimationFrame(loop);
    addEventListener("resize", size);
    addEventListener("pointermove", move, { passive: true });
    addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      removeEventListener("pointermove", move);
      removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-50 size-full" />;
}
