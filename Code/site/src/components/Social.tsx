"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { site } from "@/content/site";
import { Icon, IconName } from "./Icons";

/* ───────── Toast ───────── */
const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<number | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setMsg(null), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[70]">
        {msg && (
          <p className="flex -translate-x-1/2 items-center gap-3 rounded-full bg-wine px-5 py-3 font-semibold text-white shadow-2xl" style={{ animation: "toast-in .4s var(--ease-soft)" }}>
            <Icon name="heartFill" className="size-5 text-gold" />
            {msg}
          </p>
        )}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── Sharing ───────── */
export const pageUrl = () => (typeof window === "undefined" ? "" : window.location.origin + window.location.pathname);

export function useShare() {
  const toast = useToast();
  return useCallback(
    async (text = site.shareText, url = pageUrl()) => {
      try {
        if (navigator.share) {
          await navigator.share({ title: site.title, text, url });
          return;
        }
      } catch (e) {
        if ((e as DOMException)?.name === "AbortError") return;
      }
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        toast("Enlace copiado. ¡Compártelo con amor!");
      } catch {
        toast("No se pudo copiar el enlace");
      }
    },
    [toast],
  );
}

const targets: { name: string; icon: IconName; href: (t: string, u: string) => string }[] = [
  { name: "WhatsApp", icon: "whatsapp", href: (t, u) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
  { name: "Facebook", icon: "facebook", href: (_t, u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { name: "X", icon: "x", href: (t, u) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
];

/** Row of share targets with a copy-link button, styled as small 3D buttons. */
export function ShareRow({ text = site.shareText, tone = "cream", className = "" }: { text?: string; tone?: "cream" | "glass"; className?: string }) {
  const toast = useToast();
  const open = (h: (t: string, u: string) => string) => window.open(h(text, pageUrl()), "_blank", "noopener,noreferrer");
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {targets.map((t) => (
        <button key={t.name} type="button" onClick={() => open(t.href)} aria-label={`Compartir en ${t.name}`} className={`btn3d sm icon-only ${tone}`}>
          <Icon name={t.icon} className="size-6" />
        </button>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pageUrl());
            toast("Enlace copiado");
          } catch {
            toast("No se pudo copiar el enlace");
          }
        }}
        aria-label="Copiar enlace"
        className={`btn3d sm icon-only ${tone}`}
      >
        <Icon name="link" className="size-6" />
      </button>
    </div>
  );
}

/* ───────── Reminders (.ics) ───────── */
export function downloadReminders() {
  const pad = (n: number) => String(n).padStart(2, "0");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//San Valentin 2027//ES", "CALSCALE:GREGORIAN"];
  for (let n = 1; n <= site.days; n++) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:sv2027-dia-${n}@calendario`,
      `DTSTAMP:20261201T000000Z`,
      `DTSTART;VALUE=DATE:202702${pad(n)}`,
      `DTEND;VALUE=DATE:202702${pad(n + 1)}`,
      `SUMMARY:Día ${n} · Calendario de San Valentín`,
      `DESCRIPTION:Hoy se abre tu corazón del día ${n}.`,
      "BEGIN:VALARM",
      "TRIGGER:PT9H",
      "ACTION:DISPLAY",
      `DESCRIPTION:Tu corazón del día ${n} ya está abierto`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "san-valentin-2027.ics";
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ───────── Heart burst (like reaction) ───────── */
export function burst(x: number, y: number, glyphs = ["❤", "♥", "✦"]) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#e91e63", "#ff4f8b", "#ffc21a", "#ffe27a"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const d = 40 + Math.random() * 50;
    Object.assign(s.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: "80",
      pointerEvents: "none",
      color: colors[i % colors.length],
      fontSize: `${12 + Math.random() * 14}px`,
      transform: "translate(-50%,-50%)",
    } as CSSStyleDeclaration);
    document.body.appendChild(s);
    s.animate(
      [
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 30}px)) scale(1)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" },
    ).onfinish = () => s.remove();
  }
}

/** Like button with a heart pop and burst. Counts only the visitor's own like — no invented numbers. */
export function LikeButton({ label = "Me encanta", className = "", light = false }: { label?: string; className?: string; light?: boolean }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={(e) => {
        setOn((v) => !v);
        if (!on) burst(e.clientX || e.currentTarget.getBoundingClientRect().x + 20, e.clientY || e.currentTarget.getBoundingClientRect().y + 20);
      }}
      className={`grid size-12 place-items-center rounded-full transition ${light ? "hover:bg-white/15" : "hover:bg-surface-2"} ${on ? (light ? "text-rose-hi" : "text-rose") : light ? "text-white" : "text-ink"} ${className}`}
    >
      <span key={String(on)} style={{ animation: on ? "like-pop .45s var(--ease-spring)" : undefined }}>
        <Icon name={on ? "heartFill" : "heart"} className="size-8" />
      </span>
    </button>
  );
}
