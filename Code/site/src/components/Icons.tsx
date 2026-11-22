// Original duotone icon set: a soft filled body, a crisp line drawing and a gold accent.
type P = { className?: string; title?: string };

const wrap = (body: React.ReactNode) =>
  function Icon({ className = "size-6", title }: P) {
    return (
      <svg viewBox="0 0 48 48" fill="none" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
        {title && <title>{title}</title>}
        <g strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">{body}</g>
      </svg>
    );
  };

const soft = "currentColor";
const gold = "var(--c-gold)";

export const icons = {
  heart: wrap(
    <>
      <path d="M24 41C11 32 5 25 5 17.5 5 11.6 9.6 7 15.2 7c3.7 0 7 2 8.8 5 1.8-3 5.1-5 8.8-5C38.4 7 43 11.6 43 17.5 43 25 37 32 24 41Z" fill={soft} fillOpacity=".16" stroke={soft} />
      <path d="M13 17c0-2.8 2-5 4.6-5" stroke={gold} />
    </>,
  ),
  ticket: wrap(
    <>
      <path d="M6 14a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v5a5 5 0 0 0 0 10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-5a5 5 0 0 0 0-10v-5Z" fill={soft} fillOpacity=".16" stroke={soft} />
      <path d="M30 11v26" stroke={soft} strokeDasharray="2 4" />
      <path d="M18 27c-4-2.6-6-4.6-6-6.8a2.7 2.7 0 0 1 6-1.3 2.7 2.7 0 0 1 6 1.3c0 2.2-2 4.2-6 6.8Z" fill={gold} stroke={gold} strokeWidth="1.6" />
    </>,
  ),
  whisk: wrap(
    <>
      <path d="M24 27C15 27 11 19 11 13c0-5 5.8-9 13-9s13 4 13 9c0 6-4 14-13 14Z" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M24 27c-5 0-7.5-8-7.5-14S20 4 24 4m0 23c5 0 7.5-8 7.5-14S28 4 24 4m0 0v23" stroke={soft} strokeWidth="2" />
      <rect x="21" y="27" width="6" height="17" rx="3" fill={gold} stroke="none" />
    </>,
  ),
  device: wrap(
    <>
      <rect x="5" y="9" width="30" height="21" rx="3" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M12 37h16" stroke={soft} />
      <rect x="31" y="17" width="12" height="22" rx="3" fill="var(--c-surface)" stroke={soft} />
      <path d="M36 35h2" stroke={gold} />
    </>,
  ),
  download: wrap(
    <>
      <path d="M8 30v6a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4v-6" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M24 7v23m-9-9 9 9 9-9" stroke={gold} strokeWidth="3" />
    </>,
  ),
  chat: wrap(
    <>
      <path d="M8 12a5 5 0 0 1 5-5h22a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H21l-9 8v-8h1a5 5 0 0 1-5-5V12Z" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M16 17h16M16 23h10" stroke={gold} />
    </>,
  ),
  play: wrap(<path d="M16 10.5v27a2 2 0 0 0 3 1.7l21-13.5a2 2 0 0 0 0-3.4L19 8.8a2 2 0 0 0-3 1.7Z" fill="currentColor" stroke="currentColor" />),
  pause: wrap(
    <>
      <rect x="12" y="9" width="8" height="30" rx="2.5" fill="currentColor" stroke="none" />
      <rect x="28" y="9" width="8" height="30" rx="2.5" fill="currentColor" stroke="none" />
    </>,
  ),
  lock: wrap(
    <>
      <rect x="9" y="21" width="30" height="21" rx="5" fill={soft} fillOpacity=".16" stroke={soft} />
      <path d="M16 21v-5a8 8 0 0 1 16 0v5" stroke={soft} />
      <circle cx="24" cy="31" r="3" fill={gold} stroke="none" />
    </>,
  ),
  video: wrap(
    <>
      <rect x="5" y="10" width="38" height="28" rx="6" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M21 18v12l10-6-10-6Z" fill={gold} stroke={gold} strokeWidth="1.8" />
    </>,
  ),
  recipe: wrap(
    <>
      <path d="M11 5h19l9 9v25a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Z" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M30 5v9h9" stroke={soft} />
      <path d="M14 22h14M14 28h18M14 34h10" stroke={gold} />
    </>,
  ),
  gift: wrap(
    <>
      <rect x="7" y="18" width="34" height="23" rx="3" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M5 13h38v6H5zM24 13v28" stroke={soft} />
      <path d="M24 13c-3-6-10-7-10-2.5S21 13 24 13Zm0 0c3-6 10-7 10-2.5S27 13 24 13Z" stroke={gold} />
    </>,
  ),
  soundOn: wrap(
    <>
      <path d="M8 19h7l10-8v26l-10-8H8z" fill={soft} fillOpacity=".16" stroke={soft} />
      <path d="M31 18a8 8 0 0 1 0 12M35 13a15 15 0 0 1 0 22" stroke={gold} />
    </>,
  ),
  soundOff: wrap(
    <>
      <path d="M8 19h7l10-8v26l-10-8H8z" fill={soft} fillOpacity=".16" stroke={soft} />
      <path d="m32 19 9 10m0-10-9 10" stroke={soft} />
    </>,
  ),
  sun: wrap(
    <>
      <circle cx="24" cy="24" r="8" fill={gold} stroke={gold} />
      <path d="M24 5v4M24 39v4M5 24h4M39 24h4M10.6 10.6l2.8 2.8M34.6 34.6l2.8 2.8M10.6 37.4l2.8-2.8M34.6 13.4l2.8-2.8" stroke="currentColor" />
    </>,
  ),
  moon: wrap(<path d="M37 30.5A15 15 0 0 1 17.5 11 15 15 0 1 0 37 30.5Z" fill={gold} fillOpacity=".9" stroke={gold} />),
  left: wrap(<path d="M29 11 16 24l13 13" stroke="currentColor" strokeWidth="3.2" />),
  right: wrap(<path d="m19 11 13 13-13 13" stroke="currentColor" strokeWidth="3.2" />),
  close: wrap(<path d="m13 13 22 22M35 13 13 35" stroke="currentColor" strokeWidth="3.2" />),
  plus: wrap(<path d="M24 11v26M11 24h26" stroke="currentColor" strokeWidth="3.2" />),
  check: wrap(
    <>
      <circle cx="24" cy="24" r="18" fill={soft} fillOpacity=".14" stroke="none" />
      <path d="m15 24 6 6 12-13" stroke={gold} strokeWidth="3.4" />
    </>,
  ),
  down: wrap(<path d="m12 18 12 12 12-12" stroke="currentColor" strokeWidth="3.2" />),
  calendar: wrap(
    <>
      <rect x="6" y="9" width="36" height="32" rx="6" fill={soft} fillOpacity=".14" stroke={soft} />
      <path d="M6 18h36M15 5v8M33 5v8" stroke={soft} />
      <path d="M24 35c-4.2-2.8-6.4-5-6.4-7.4a2.9 2.9 0 0 1 6.4-1.4 2.9 2.9 0 0 1 6.4 1.4c0 2.4-2.2 4.6-6.4 7.4Z" fill={gold} stroke={gold} strokeWidth="1.6" />
    </>,
  ),
};

export type IconName = keyof typeof icons;
export function Icon({ name, className, title }: { name: IconName } & P) {
  const C = icons[name];
  return <C className={className} title={title} />;
}

/** Heart badge with a gold bow and "14": the product mark until Pedro picks a brand (Q7). */
export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 58C14 46 5 36 5 25 5 16.7 11.5 10 19.6 10c5.1 0 9.6 2.7 12.4 6.8C34.8 12.7 39.3 10 44.4 10 52.5 10 59 16.7 59 25c0 11-9 21-27 33Z" fill="var(--c-rose)" />
      <path d="M14 24c0-4.4 3.2-7.6 7.2-7.6" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 15 22 8.5c-2-1.3-4.4.6-3.6 2.8l1.8 4.9c.6 1.6 2.4 2.4 4 1.8L32 15Zm0 0 10-6.5c2-1.3 4.4.6 3.6 2.8l-1.8 4.9c-.6 1.6-2.4 2.4-4 1.8L32 15Z" fill="var(--c-gold)" />
      <circle cx="32" cy="15" r="3.2" fill="var(--c-gold-soft)" stroke="var(--c-gold)" strokeWidth="1.5" />
      <text x="32" y="42" textAnchor="middle" fontFamily="var(--font-playfair), Georgia, serif" fontWeight="800" fontSize="18" fill="#fff">14</text>
    </svg>
  );
}

export function Logo({ size = "md", compact = false }: { size?: "md" | "lg"; compact?: boolean }) {
  const lg = size === "lg";
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark className={lg ? "size-20 drop" : "size-11"} />
      <span className={`flex-col leading-none ${compact ? "hidden" : "flex"}`} style={{ animation: compact ? undefined : "pop-in .5s var(--ease-soft)" }}>
        <span className={`font-sans font-semibold uppercase tracking-[0.22em] text-muted ${lg ? "text-sm" : "text-[0.62rem]"}`}>Calendario de</span>
        <span className={`mt-1 whitespace-nowrap font-script leading-[0.9] text-rose ${lg ? "text-5xl sm:text-6xl" : "text-[1.9rem]"}`}>San Valentín</span>
        <span className={`self-end font-display font-bold text-gold ${lg ? "text-xl" : "text-xs"} -mt-1 tracking-[0.2em]`}>2027</span>
      </span>
    </span>
  );
}
