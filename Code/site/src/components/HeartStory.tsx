import { type DayState as State } from "./days";
import { Icon } from "./Icons";

const HEART = "M50 93C17 70 3 52 3 32 3 16 15 5 29 5c9 0 17 5 21 13 4-8 12-13 21-13 14 0 26 11 26 27 0 20-14 38-47 61z";

/** Heart-shaped story bubble: gradient ring, inner heart that splits open on its hinges. */
export function HeartStory({ n, state, opening, size }: { n: number; state: State; opening: boolean; size: number }) {
  const locked = state === "locked";
  const half = (side: "l" | "r") => (
    <span
      className={`absolute inset-0 transition-transform duration-[700ms] ease-[var(--ease-soft)] ${side === "l" ? "origin-left [clip-path:inset(0_50%_0_0)]" : "origin-right [clip-path:inset(0_0_0_50%)]"}`}
      style={{ transform: opening ? `rotateY(${side === "l" ? -125 : 125}deg)` : undefined }}
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <path d={HEART} fill={locked ? "var(--c-line)" : "var(--c-rose)"} transform="translate(13 13) scale(.74)" />
        {!locked && <path d="M30 34c0-7 5-11 11-11" stroke="#fff" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" fill="none" />}
      </svg>
    </span>
  );
  return (
    <span className="relative block [perspective:500px]" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id={`ring${n}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd34d" />
            <stop offset=".45" stopColor="#ff3d7f" />
            <stop offset="1" stopColor="#b5179e" />
            {state === "preview" && <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="3s" repeatCount="indefinite" />}
          </linearGradient>
        </defs>
        <path d={HEART} fill="none" stroke={locked ? "var(--c-line)" : `url(#ring${n})`} strokeWidth="5" />
      </svg>
      <span aria-hidden className="absolute inset-[26%] rounded-full bg-goldfoil opacity-90 blur-[2px]" />
      {half("l")}
      {half("r")}
      <span className={`pointer-events-none absolute inset-0 grid place-items-center pb-[6%] transition-opacity ${opening ? "opacity-0" : ""}`}>
        {locked ? (
          <Icon name="lock" className="size-[34%] text-muted" />
        ) : (
          <span className="font-display font-extrabold text-white [text-shadow:0_2px_0_rgb(0_0_0/.15)]" style={{ fontSize: size * 0.3 }}>{n}</span>
        )}
      </span>
    </span>
  );
}
