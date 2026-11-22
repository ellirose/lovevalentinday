// Section transitions drawn for this theme: piped frosting, torn paper, a satin ribbon and a stitched seam.
// Each one is placed at the top edge of a section and painted in that section's own colour.

type EdgeProps = { color: string; className?: string };

/** Two rows of piped frosting: large scallops with small pearls, like a cake border. */
export function FrostingEdge({ color, className = "" }: EdgeProps) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 -top-[34px] h-[36px] ${className}`}>
      <div
        className="absolute inset-x-0 bottom-0 h-[26px]"
        style={{
          background: color,
          mask: "radial-gradient(circle at 50% 100%, #000 25px, #0000 26px) 0 100% / 52px 26px repeat-x",
          WebkitMask: "radial-gradient(circle at 50% 100%, #000 25px, #0000 26px) 0 100% / 52px 26px repeat-x",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-[16px] h-[14px]"
        style={{
          background: color,
          mask: "radial-gradient(circle at 50% 50%, #000 5px, #0000 6px) 26px 50% / 52px 14px repeat-x",
          WebkitMask: "radial-gradient(circle at 50% 50%, #000 5px, #0000 6px) 26px 50% / 52px 14px repeat-x",
        }}
      />
    </div>
  );
}

/** Deterministic torn-paper edge with a soft fibre shadow. */
export function TornEdge({ color, className = "", seed = 7 }: EdgeProps & { seed?: number }) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pts: string[] = [];
  for (let x = 0; x <= 1200; x += 14 + rnd() * 18) pts.push(`${x.toFixed(0)},${(10 + rnd() * 26).toFixed(1)}`);
  const d = `M0,60 L0,${pts[0].split(",")[1]} L${pts.join(" L")} L1200,22 L1200,60 Z`;
  return (
    <svg aria-hidden viewBox="0 0 1200 60" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 -top-[46px] h-[48px] w-full ${className}`}>
      <path d={d} fill="rgb(var(--shadow-rgb) / .12)" transform="translate(0 -3)" />
      <path d={d} fill={color} />
    </svg>
  );
}

/** A satin ribbon that crosses the boundary, with a highlight and a fold. */
export function RibbonEdge({ color, className = "" }: EdgeProps) {
  return (
    <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 -top-[70px] h-[120px] w-full ${className}`}>
      <path d="M0 70 C 240 20 420 120 720 66 S 1200 10 1440 58 L1440 120 L0 120 Z" fill={color} />
      <path d="M0 54 C 240 4 420 104 720 50 S 1200 -6 1440 42 L1440 64 C1200 16 1000 92 720 76 S 240 34 0 80 Z" fill="var(--c-rose)" />
      <path d="M0 58 C 240 8 420 108 720 54 S 1200 -2 1440 46" stroke="#fff" strokeOpacity=".45" strokeWidth="2" fill="none" />
      <path d="M0 76 C 240 30 420 112 720 72 S 1200 14 1440 60" stroke="var(--c-gold)" strokeOpacity=".8" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A gentle arch, like a wall niche. */
export function ArchEdge({ color, className = "" }: EdgeProps) {
  return (
    <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 -top-[78px] h-[80px] w-full ${className}`}>
      <path d="M0 80 L0 60 Q 720 -40 1440 60 L1440 80 Z" fill={color} />
    </svg>
  );
}

/** Stitched seam: a dashed gold thread along the top of a fabric section. */
export function StitchEdge({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-6 top-5 h-0 border-t-2 border-dashed border-gold/60 ${className}`} />
  );
}
