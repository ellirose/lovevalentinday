"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type DayState, label, N, short } from "./days";
import { Icon } from "./Icons";
import { HeartStory } from "./HeartStory";
import { useReducedMotion } from "./ui";

const STEP = 360 / N;

/**
 * The demo's rotating ring of 14 hearts (desktop). Move the pointer left or right to steer it, drag it,
 * or use the arrows and day buttons; it snaps a heart to the front and spins slowly when left alone.
 */
export function HeartRing({
  state,
  opening,
  shake,
  onOpen,
}: {
  state: (n: number) => DayState;
  opening: number | null;
  shake: number | null;
  onOpen: (n: number) => void;
}) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(380);
  const m = useRef({ angle: 0, vel: 0, target: null as number | null, drag: false, moved: 0, lastX: 0, idleAt: 0, hover: false, hx: 0, steering: false, touched: false });
  const press = useRef(false);

  useEffect(() => {
    const el = stage.current!;
    const fit = () => setRadius(Math.round(Math.min(430, Math.max(260, el.clientWidth * 0.36))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const s = m.current;
      const dt = Math.min(50, t - last) / 16.67;
      last = t;
      if (s.touched || s.drag) {
        s.idleAt = t;
        s.touched = false;
      }
      // Pointer steering: outside a calm centre band, the ring turns toward the pointer's side.
      const steer = s.hover && !s.drag && s.target === null && Math.abs(s.hx) > 0.14;
      if (!s.drag) {
        if (steer) {
          s.angle -= (s.hx - Math.sign(s.hx) * 0.14) * 2.4 * dt;
          s.steering = true;
          s.idleAt = t;
        } else if (s.steering) {
          s.steering = false;
          s.target = Math.round(s.angle / STEP) * STEP;
        } else if (s.target !== null) {
          const diff = s.target - s.angle;
          s.angle += diff * Math.min(1, 0.14 * dt);
          if (Math.abs(diff) < 0.05) {
            s.angle = s.target;
            s.target = null;
          }
        } else if (Math.abs(s.vel) > 0.02) {
          s.angle += s.vel * dt;
          s.vel *= Math.pow(0.93, dt);
          if (Math.abs(s.vel) <= 0.02) s.target = Math.round(s.angle / STEP) * STEP;
        } else if (!reduced && !s.hover && t - s.idleAt > 4000) {
          s.angle -= 0.05 * dt;
        }
      }
      ring.current!.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(-9deg) rotateY(${s.angle}deg)`;
      // Hearts turning away fade and stop taking clicks, so only the front of the ring is interactive.
      const kids = ring.current!.children;
      for (let i = 0; i < kids.length; i++) {
        const facing = Math.cos(((i * STEP + s.angle) * Math.PI) / 180);
        const k = kids[i] as HTMLElement;
        k.style.opacity = String(Math.min(1, Math.max(0, (facing - 0.08) / 0.42)));
        k.style.pointerEvents = facing > 0.2 ? "auto" : "none";
        k.style.visibility = facing < -0.3 ? "hidden" : "visible";
      }
      const f = ((Math.round(-s.angle / STEP) % N) + N) % N;
      setFront((p) => (p === f ? p : f));
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  const goTo = (i: number) => {
    const s = m.current;
    const cur = Math.round(-s.angle / STEP);
    const delta = ((((i - cur) % N) + N + N / 2) % N) - N / 2;
    s.target = -(cur + delta) * STEP;
    s.vel = 0;
    s.steering = false;
    s.touched = true;
  };

  // The pointer is captured only once it really drags; capturing on press would send the click to the
  // stage instead of the heart under the pointer.
  const onDown = (e: React.PointerEvent) => {
    press.current = true;
    m.current.moved = 0;
    m.current.lastX = e.clientX;
  };
  const onMove = (e: React.PointerEvent) => {
    const s = m.current;
    const r = stage.current!.getBoundingClientRect();
    s.hx = (e.clientX - r.left) / r.width - 0.5;
    if (!press.current) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.moved += Math.abs(dx);
    if (!s.drag) {
      if (s.moved < 6) return;
      s.drag = true;
      s.vel = 0;
      s.target = null;
      s.steering = false;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const k = 0.32 * (420 / radius);
    s.angle += dx * k;
    s.vel = dx * k;
  };
  const onUp = () => {
    press.current = false;
    m.current.drag = false;
    m.current.touched = true;
  };

  // Clicks are resolved here: hit-testing inside a 3D ring is unreliable in Chrome. The front-most heart
  // whose on-screen box contains the pointer wins.
  const onStageClick = (e: React.MouseEvent) => {
    if (e.detail === 0 || m.current.moved > 8) return;
    let best = -1;
    let bestFacing = 0.2;
    const kids = ring.current!.children;
    for (let i = 0; i < kids.length; i++) {
      const facing = Math.cos(((i * STEP + m.current.angle) * Math.PI) / 180);
      const btn = kids[i].querySelector("button");
      if (!btn || facing <= bestFacing) continue;
      const r = btn.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        best = i;
        bestFacing = facing;
      }
    }
    if (best >= 0) activate(best + 1);
  };
  const activate = (n: number) => {
    goTo(n - 1);
    onOpen(n);
  };

  const frontDay = front + 1;
  const fs = state(frontDay);
  const items = useMemo(() => Array.from({ length: N }, (_, i) => i + 1), []);
  const size = Math.round(Math.max(96, Math.min(150, radius * 0.36)));

  return (
    <div className="mt-6">
      <p className="text-center text-base font-semibold text-muted">
        <Icon name="sparkle" className="mr-1.5 inline size-5 align-[-4px] text-gold-deep" />
        Mueve el cursor a los lados para girar la rueda. Toca un corazón para abrirlo.
      </p>
      <div
        ref={stage}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClick={onStageClick}
        onPointerEnter={() => (m.current.hover = true)}
        onPointerLeave={() => {
          m.current.hover = false;
          m.current.hx = 0;
          onUp();
        }}
        className="relative mx-auto h-[clamp(300px,25vw,360px)] cursor-grab select-none overflow-hidden [perspective:1500px] active:cursor-grabbing"
        style={{ "--r": `${radius}px` } as React.CSSProperties}
        aria-roledescription="carrusel"
        aria-label="Rueda de los 14 corazones"
      >
        <div aria-hidden className="absolute bottom-[10%] left-1/2 h-14 w-[min(70%,760px)] -translate-x-1/2 rounded-[50%] bg-rose/20 blur-2xl" />
        <div ref={ring} className="absolute left-1/2 top-[30%] size-0 [transform-style:preserve-3d]">
          {items.map((n) => {
            const st = state(n);
            const isFront = n === frontDay;
            return (
              <div
                key={n}
                className="absolute flex flex-col items-center [transform-style:preserve-3d]"
                style={{ width: size, left: -size / 2, top: -size / 2, transform: `rotateY(${(n - 1) * STEP}deg) translateZ(var(--r))` }}
              >
                <button
                  type="button"
                  onClick={(e) => e.detail === 0 && activate(n)}
                  onFocus={() => goTo(n - 1)}
                  aria-label={`Día ${n}, ${label(n)}. ${st === "locked" ? "Bloqueado" : st === "preview" ? "Vista previa" : "Disponible"}`}
                  className={`relative block rounded-full transition-transform duration-500 ease-[var(--ease-spring)] ${isFront ? "scale-110" : "scale-90"} ${st === "locked" ? "cursor-not-allowed" : "hover:scale-[1.16]"}`}
                  style={{ animation: shake === n ? "shake .5s" : undefined }}
                >
                  <span className={`block drop ${st !== "locked" && !reduced ? "[animation:float_4s_ease-in-out_infinite]" : ""}`} style={{ animationDelay: `${-n * 0.4}s` }}>
                    <HeartStory n={n} state={st} opening={opening === n} size={size} />
                  </span>
                  {st === "preview" && (
                    <span className="absolute -right-2 top-0 rounded-full bg-goldfoil px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-wine shadow-[0_2px_0_#d98400]">Ábreme</span>
                  )}
                </button>
                <span className={`mt-2 text-sm font-extrabold uppercase tracking-[0.16em] ${isFront ? "text-rose-ink" : "text-muted"}`}>{short(n)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-5">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => goTo((front - 1 + N) % N)} aria-label="Corazón anterior" className="btn3d icon-only cream">
            <Icon name="left" className="size-6" />
          </button>
          <div className="min-w-[16rem] rounded-[28px] border border-line bg-surface px-6 py-3 text-center lift" aria-live="polite">
            <p className="font-display text-2xl font-bold">Día {frontDay}</p>
            <p className="text-base text-muted first-letter:uppercase">{label(frontDay)}</p>
            <p className={`mt-1 text-sm font-bold uppercase tracking-wider ${fs === "locked" ? "text-muted" : "text-rose-ink"}`}>
              {fs === "locked" ? "Se abre en su fecha" : fs === "preview" ? "Toca para ver la vista previa" : "Disponible"}
            </p>
          </div>
          <button type="button" onClick={() => goTo((front + 1) % N)} aria-label="Corazón siguiente" className="btn3d icon-only cream">
            <Icon name="right" className="size-6" />
          </button>
        </div>
        <ol className="flex flex-wrap justify-center gap-2" aria-label="Elegir día">
          {items.map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => goTo(n - 1)}
                aria-label={`Ir al día ${n}`}
                aria-current={n === frontDay}
                className={`grid size-10 place-items-center rounded-full text-sm font-bold transition ${n === frontDay ? "scale-110 bg-rose text-white shadow-[0_3px_0_#a10d44]" : state(n) === "locked" ? "bg-surface-2 text-muted" : "bg-goldfoil text-wine"}`}
              >
                {n}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
