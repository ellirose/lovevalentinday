"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { dayDate, months, preview, site } from "@/content/site";
import { Icon } from "./Icons";
import { useSound } from "./SoundProvider";
import { Eyebrow, Reveal, useReducedMotion } from "./ui";
import { VideoPlayer } from "./VideoPlayer";
import { FrostingEdge } from "./Edges";

type State = "locked" | "preview" | "open";
const N = site.days;
const STEP = 360 / N;
const weekday = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
// Date parts in the release time zone (Puerto Rico, UTC-4), whatever the visitor's clock zone is.
const pr = (d: Date) => new Date(d.getTime() - 4 * 3600_000);
const label = (n: number) => {
  const d = pr(dayDate(n));
  return `${weekday[d.getUTCDay()]} ${d.getUTCDate()} de ${months[d.getUTCMonth()]}`;
};
const short = (n: number) => `${pr(dayDate(n)).getUTCDate()} feb`;

// Current time, refreshed each minute; null while prerendering so the static HTML is date-neutral.
const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;
function useNow() {
  return useSyncExternalStore<number | null>(subscribeMinute, minuteNow, () => null);
}

const HEART = "M50 92C18 70 4 52 4 33 4 18 15 7 29 7c9 0 17 5 21 13 4-8 12-13 21-13 14 0 25 11 25 26 0 19-14 37-46 59z";

function HeartArt({ state, n }: { state: State; n: number }) {
  const fill = state === "locked" ? "#cdb3bd" : "var(--c-rose)";
  const dark = state === "locked" ? "#8e7380" : "var(--c-wine-2)";
  const half = (side: "l" | "r") => (
    <span
      className={`heart-half absolute inset-0 transition-transform duration-[750ms] ease-[var(--ease-soft)] ${side === "l" ? "origin-left [clip-path:inset(0_50%_0_0)]" : "origin-right [clip-path:inset(0_0_0_50%)]"}`}
      data-side={side}
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <path d={HEART} fill={fill} />
        <path d={HEART} fill={dark} opacity=".35" transform="translate(0 4)" style={{ mixBlendMode: "multiply" }} />
        <path d={HEART} fill={fill} transform="translate(0 -1) scale(.98) translate(1 1)" />
        <path d="M20 30c0-8 6-13 13-13" stroke="#fff" strokeOpacity=".55" strokeWidth="5" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
  return (
    <span className="relative block size-full [transform-style:preserve-3d]">
      <span aria-hidden className="absolute inset-[18%] rounded-full bg-gold-soft shadow-[0_0_40px_10px_var(--c-gold)] dark:bg-gold" />
      {half("l")}
      {half("r")}
      {/* bow */}
      <svg aria-hidden viewBox="0 0 100 100" className="heart-bow absolute inset-0 size-full transition-transform duration-700 ease-[var(--ease-soft)]">
        <path d="M50 18 34 9c-3-2-7 1-5 5l3 7c1 2 4 3 6 2l12-5Zm0 0 16-9c3-2 7 1 5 5l-3 7c-1 2-4 3-6 2l-12-5Z" fill="var(--c-gold)" />
        <circle cx="50" cy="18" r="4.5" fill="#fbe2a4" stroke="var(--c-gold)" strokeWidth="2" />
      </svg>
      <span className="heart-num pointer-events-none absolute inset-0 grid place-items-center pt-[6%] font-display font-extrabold text-white transition-opacity duration-300 [text-shadow:0_3px_0_rgb(0_0_0/.18)]">
        {state === "locked" ? <Icon name="lock" className="size-[30%] text-white" /> : <span className="text-[2.1em] leading-none">{n}</span>}
      </span>
    </span>
  );
}

export function Calendar() {
  const now = useNow();
  const reduced = useReducedMotion();
  const { chime } = useSound();
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [front, setFront] = useState(0);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [radius, setRadius] = useState(420);
  // touched: the visitor interacted; the animation loop then restarts the idle timer.
  const m = useRef({ angle: 0, vel: 0, target: null as number | null, drag: false, moved: 0, lastX: 0, idleAt: 0, hover: false, touched: false });

  const state = useCallback(
    (n: number): State => {
      if (now === null) return n === 1 ? "preview" : "locked";
      if (now >= dayDate(n).getTime()) return "open";
      return n === 1 && now < dayDate(1).getTime() ? "preview" : "locked";
    },
    [now],
  );
  const daysLeft = now === null ? null : Math.ceil((dayDate(1).getTime() - now) / 86_400_000);

  // Ring physics: drag, inertia, snapping and a slow idle spin.
  useEffect(() => {
    const el = stage.current!;
    const fit = () => setRadius(Math.round(Math.min(460, Math.max(150, el.clientWidth * 0.34))));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const s = m.current;
      const dt = Math.min(50, t - last) / 16.67;
      last = t;
      if (s.touched || s.drag) {
        s.idleAt = t;
        s.touched = false;
      }
      if (!s.drag) {
        if (s.target !== null) {
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
          s.angle -= 0.06 * dt;
        }
      }
      ring.current!.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(-9deg) rotateY(${s.angle}deg)`;
      // Hearts turning away fade out and stop taking clicks, so only the front of the ring is interactive.
      const kids = ring.current!.children;
      for (let i = 0; i < kids.length; i++) {
        const facing = Math.cos(((i * STEP + s.angle) * Math.PI) / 180);
        const el = kids[i] as HTMLElement;
        el.style.opacity = String(Math.min(1, Math.max(0, (facing - 0.08) / 0.42)));
        el.style.pointerEvents = facing > 0.2 ? "auto" : "none";
        el.style.visibility = facing < -0.3 ? "hidden" : "visible";
      }
      const f = (((Math.round(-s.angle / STEP) % N) + N) % N);
      setFront((p) => (p === f ? p : f));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  const goTo = (i: number) => {
    const s = m.current;
    const cur = Math.round(-s.angle / STEP);
    const delta = ((((i - cur) % N) + N + N / 2) % N) - N / 2;
    s.target = -(cur + delta) * STEP;
    s.vel = 0;
    s.touched = true;
  };

  // The pointer is captured only once it really drags; capturing on press would send the click to the ring
  // instead of the heart under the pointer.
  const press = useRef(false);
  const onDown = (e: React.PointerEvent) => {
    const s = m.current;
    press.current = true;
    s.moved = 0;
    s.lastX = e.clientX;
  };
  const onMove = (e: React.PointerEvent) => {
    const s = m.current;
    if (!press.current) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.moved += Math.abs(dx);
    if (!s.drag) {
      if (s.moved < 6) return;
      s.drag = true;
      s.vel = 0;
      s.target = null;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const k = 0.32 * (420 / radius);
    s.angle += dx * k;
    s.vel = dx * k;
  };
  const onUp = () => {
    const s = m.current;
    press.current = false;
    s.drag = false;
    s.touched = true;
  };

  // Pointer clicks are resolved here rather than by the browser: hit-testing inside the 3D ring is
  // unreliable in Chrome. The front-most heart whose on-screen box contains the pointer wins.
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
    const st = state(n);
    if (st === "locked") {
      setShake(n);
      window.setTimeout(() => setShake(null), 600);
      goTo(n - 1);
      return;
    }
    goTo(n - 1);
    setOpening(n);
    chime();
    window.setTimeout(() => {
      setOpenDay(n);
      dlg.current?.showModal();
    }, reduced ? 0 : 650);
  };
  const close = () => {
    dlg.current?.close();
  };

  const frontDay = front + 1;
  const fs = state(frontDay);
  const items = useMemo(() => Array.from({ length: N }, (_, i) => i + 1), []);

  return (
    <section id="calendario" className="tex-linen relative bg-surface-2 pb-24 pt-20 sm:pt-24">
      <FrostingEdge color="var(--c-surface-2)" />
      <div className="mx-auto max-w-7xl px-5 text-center">
        <Reveal><Eyebrow className="justify-center">Del 1 al 14 de febrero</Eyebrow></Reveal>
        <Reveal delay={0.08} as="h2" className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.8rem)] font-bold leading-[1.02] text-ink">
          Un corazón nuevo <em className="font-script text-[1.25em] font-normal not-italic text-rose">cada día</em>
        </Reveal>
        <Reveal delay={0.16} as="p" className="mx-auto mt-5 max-w-2xl text-[clamp(1.1rem,1.6vw,1.3rem)] text-muted">
          Cada corazón guarda una clase en video y su receta para descargar. Se abre en su fecha y se queda abierto.
        </Reveal>
        {daysLeft !== null && daysLeft > 0 && (
          <Reveal delay={0.22} className="mt-7 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5 lift">
            <Icon name="calendar" className="size-7 text-rose" />
            <span className="text-base font-semibold">
              Faltan <b className="font-display text-xl text-rose">{daysLeft}</b> días para el primer corazón
            </span>
          </Reveal>
        )}
      </div>

      {/* 3D ring */}
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
          onUp();
        }}
        className="relative mx-auto mt-4 h-[clamp(330px,40vw,520px)] max-w-[1400px] cursor-grab touch-pan-y select-none overflow-hidden [perspective:1600px] active:cursor-grabbing"
        style={{ "--r": `${radius}px` } as React.CSSProperties}
        aria-roledescription="carrusel"
        aria-label="Los 14 corazones del calendario"
      >
        <div aria-hidden className="absolute bottom-[12%] left-1/2 h-16 w-[min(70%,820px)] -translate-x-1/2 rounded-[50%] bg-rose/15 blur-2xl" />
        <div ref={ring} className="absolute left-1/2 top-[40%] size-0 [transform-style:preserve-3d]">
          {items.map((n) => {
            const st = state(n);
            const isFront = n === frontDay;
            const size = Math.round(Math.max(100, Math.min(176, radius * 0.38)));
            return (
              <div
                key={n}
                className="absolute [transform-style:preserve-3d]"
                style={{ width: size, height: size + 34, left: -size / 2, top: -size / 2, transform: `rotateY(${(n - 1) * STEP}deg) translateZ(var(--r))` }}
              >
                <button
                  type="button"
                  onClick={(e) => e.detail === 0 && activate(n)}
                  onFocus={() => goTo(n - 1)}
                  aria-label={`Día ${n}, ${label(n)}. ${st === "locked" ? "Bloqueado" : st === "preview" ? "Vista previa disponible" : "Disponible"}`}
                  className={`heart-door group relative block [perspective:600px] transition-transform duration-500 ease-[var(--ease-spring)] ${isFront ? "scale-110" : "scale-90 opacity-90"} ${st === "locked" ? "cursor-not-allowed" : "cursor-pointer hover:scale-[1.16]"} ${opening === n ? "is-opening" : ""}`}
                  style={{ width: size, height: size, fontSize: size / 5.2, animation: shake === n ? "shake .5s" : undefined }}
                >
                  <span className={`block size-full drop ${st !== "locked" && !reduced ? "[animation:float_4s_ease-in-out_infinite]" : ""}`} style={{ animationDelay: `${-n * 0.4}s` }}>
                    <HeartArt state={st} n={n} />
                  </span>
                  {st === "preview" && (
                    <span className="absolute -right-3 -top-2 rounded-full bg-gold px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-wine shadow-lg">Ábreme</span>
                  )}
                </button>
                <span className={`mt-2 block text-center text-sm font-bold uppercase tracking-[0.16em] ${isFront ? "text-rose-ink" : "text-muted"}`}>{short(n)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption + controls */}
      <div className="mx-auto -mt-10 flex max-w-3xl flex-col items-center gap-5 px-5">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => goTo((front - 1 + N) % N)} aria-label="Corazón anterior" className="grid size-14 place-items-center rounded-full border border-line bg-surface text-rose lift transition hover:-translate-x-0.5">
            <Icon name="left" className="size-6" />
          </button>
          <div className="min-w-[15rem] rounded-[28px] border border-line bg-surface px-6 py-3 text-center lift" aria-live="polite">
            <p className="font-display text-2xl font-bold">Día {frontDay}</p>
            <p className="text-base text-muted first-letter:uppercase">{label(frontDay)}</p>
            <p className={`mt-1 text-sm font-bold uppercase tracking-wider ${fs === "locked" ? "text-muted" : "text-rose-ink"}`}>
              {fs === "locked" ? "Se abre en su fecha" : fs === "preview" ? "Toca para ver la vista previa" : "Disponible"}
            </p>
          </div>
          <button type="button" onClick={() => goTo((front + 1) % N)} aria-label="Corazón siguiente" className="grid size-14 place-items-center rounded-full border border-line bg-surface text-rose lift transition hover:translate-x-0.5">
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
                className={`grid size-10 place-items-center rounded-full text-sm font-bold transition ${n === frontDay ? "scale-110 bg-rose text-on-rose shadow-lg" : state(n) === "locked" ? "bg-surface text-muted" : "bg-gold-soft text-wine"}`}
              >
                {n}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Day window */}
      <dialog
        ref={dlg}
        onClose={() => {
          setOpenDay(null);
          setOpening(null);
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[min(1040px,calc(100%-24px))] max-h-[calc(100dvh-24px)] overflow-auto rounded-[36px] bg-surface p-0 text-ink lift backdrop:bg-transparent"
        aria-labelledby="day-title"
      >
        {openDay !== null && (
          <div className="tex-paper relative p-5 sm:p-8">
            <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-4 top-4 z-10 grid size-12 place-items-center rounded-full bg-surface-2 text-rose transition hover:rotate-90">
              <Icon name="close" className="size-5" />
            </button>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-ink">
              Día {openDay} · {label(openDay)}
            </p>
            <h3 id="day-title" className="mt-2 pr-12 text-balance font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight">
              {state(openDay) === "preview" ? preview.title : `Tu corazón del día ${openDay}`}
            </h3>
            {state(openDay) === "preview" ? (
              <>
                <p className="mt-2 max-w-2xl text-muted">{preview.note}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-[1.35fr_1fr]">
                  <VideoPlayer src="/media/baking-cookies-720p.webm" poster="/media/baking-cookies-poster.webp" label="Clase de muestra" className="aspect-video rounded-[28px]" />
                  <article className="shape-fold relative bg-cream p-6 text-ink lift">
                    <span aria-hidden className="absolute right-0 top-0 size-14 bg-gold-soft [clip-path:polygon(0_0,0_100%,100%_100%)]" />
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rose-ink">
                      <Icon name="recipe" className="size-6" /> Receta en PDF
                    </p>
                    <h4 className="mt-2 font-display text-2xl font-bold">{preview.recipe.title}</h4>
                    <ul className="mt-4 space-y-2 border-t border-dashed border-line pt-4">
                      {preview.recipe.ingredients.map((i) => (
                        <li key={i} className="flex items-center gap-3 text-base">
                          <span className="size-2 rounded-full bg-rose" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-5 py-3 font-semibold text-muted">
                    <Icon name="download" className="size-6" /> Descargas disponibles al comprar
                  </span>
                  <a href="#precio" onClick={close} className="btn-shine rounded-full bg-rose px-6 py-3 font-bold text-on-rose">Quiero mi calendario</a>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-[28px] bg-surface-2 p-6">
                <p className="text-lg">Este corazón ya está abierto. Entra a tu cuenta para ver la clase y descargar la receta.</p>
                {site.buyerAreaUrl ? (
                  <a href={site.buyerAreaUrl} className="mt-4 inline-block rounded-full bg-rose px-6 py-3 font-bold text-on-rose">Entrar a mi calendario</a>
                ) : (
                  <a href="#precio" onClick={close} className="mt-4 inline-block rounded-full bg-rose px-6 py-3 font-bold text-on-rose">Quiero mi calendario</a>
                )}
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
