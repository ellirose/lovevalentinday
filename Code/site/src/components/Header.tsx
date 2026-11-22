"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { nav } from "@/content/site";
import { Icon, Logo } from "./Icons";
import { useSound } from "./SoundProvider";

const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
};
const isDark = () => document.documentElement.classList.contains("dark");

function ThemeSwitch() {
  const dark = useSyncExternalStore(subscribeTheme, isDark, () => false);
  const flip = () => {
    const d = !dark;
    document.documentElement.classList.toggle("dark", d);
    try {
      localStorage.setItem("theme", d ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={flip}
      role="switch"
      aria-checked={dark}
      aria-label="Modo oscuro"
      className="group relative flex h-11 w-[78px] shrink-0 items-center rounded-full border border-line bg-surface-2 p-1 transition-colors"
    >
      <span className="absolute left-2.5 size-5 text-gold opacity-60"><Icon name="sun" className="size-5" /></span>
      <span className="absolute right-2.5 size-5 opacity-60"><Icon name="moon" className="size-5" /></span>
      <span
        className={`relative z-10 grid size-9 place-items-center rounded-full bg-surface shadow-[0_4px_12px_rgb(var(--shadow-rgb)/0.25)] transition-transform duration-500 ease-[var(--ease-spring)] ${dark ? "translate-x-[33px]" : ""}`}
      >
        <Icon name={dark ? "moon" : "sun"} className="size-5 text-ink" />
      </span>
    </button>
  );
}

function SoundButton() {
  const { on, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Silenciar música" : "Activar música"}
      className="relative grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface-2 text-rose transition hover:scale-105"
    >
      <Icon name={on ? "soundOn" : "soundOff"} className="size-6" />
      {on && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-rose/40 [animation-duration:2.4s]" />}
    </button>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(10px,env(safe-area-inset-top))] sm:px-5">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[28px] py-2 pl-3 pr-2 transition-all duration-500 sm:pl-5 ${
          solid || open ? "bg-surface/90 lift backdrop-blur-xl" : "bg-surface/0"
        }`}
      >
        <a
          href="#inicio"
          aria-label="Calendario de San Valentín 2027, inicio"
          className={`rounded-2xl transition ${solid || open ? "" : "rounded-full bg-surface/85 p-1.5 backdrop-blur-md lift"}`}
        >
          {/* Over the hero only the heart mark shows, so the title isn't repeated. */}
          <Logo compact={!(solid || open)} />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className={`flex items-center gap-1 rounded-full p-1.5 transition ${solid ? "" : "bg-surface/85 backdrop-blur-md lift"}`}>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="relative block rounded-full px-4 py-2 text-[0.98rem] font-semibold text-ink transition hover:bg-surface-2 hover:text-rose-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Over the hero on phones and tablets only the corner buttons show; theme and buy live in the menu. */}
        <div className={`flex items-center gap-2 rounded-full transition ${solid || open ? "" : "lg:bg-surface/85 lg:p-1.5 lg:backdrop-blur-md lg:lift"}`}>
          <SoundButton />
          <div className={solid ? "hidden sm:block" : "hidden lg:block"}><ThemeSwitch /></div>
          <a href="#precio" className={`btn-shine rounded-full bg-rose px-5 py-2.5 text-base font-bold text-on-rose transition hover:-translate-y-0.5 hover:bg-rose-ink ${solid ? "hidden md:block" : "hidden lg:block"}`}>
            Quiero mi calendario
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="relative grid size-11 place-items-center rounded-full bg-rose text-on-rose lg:hidden"
          >
            <span className={`absolute h-0.5 w-5 rounded bg-current transition duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute h-0.5 w-5 rounded bg-current transition duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="menu-movil"
        hidden={!open}
        className="tex-linen fixed inset-x-3 bottom-3 top-[calc(max(10px,env(safe-area-inset-top))+72px)] overflow-auto rounded-[32px] bg-surface p-6 lift lg:hidden"
      >
        <nav aria-label="Menú">
          <ul className="space-y-2">
            {nav.map((n, i) => (
              <li key={n.href} style={{ animation: `pop-in .5s ${0.05 * i}s var(--ease-soft) backwards` }}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between rounded-3xl border border-line bg-surface-2/70 px-6 py-5 font-display text-3xl font-bold text-ink"
                >
                  {n.label}
                  <Icon name="right" className="size-7 text-rose transition group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-3xl bg-surface-2/70 p-4">
          <span className="font-semibold">Modo oscuro</span>
          <ThemeSwitch />
        </div>
        <a href="#precio" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-rose py-4 text-center text-lg font-bold text-on-rose">
          Quiero mi calendario
        </a>
      </div>
    </header>
  );
}
