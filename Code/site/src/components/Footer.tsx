import { nav, site } from "@/content/site";
import { FrostingEdge } from "./Edges";
import { Logo } from "./Icons";
import { ShareRow } from "./Social";

const credits = [
  { what: "Video y fotos «Baking cookies»", who: "Robert Cole", license: "CC0", href: "https://commons.wikimedia.org/wiki/File:Baking_cookies.ogv" },
];

export function Footer() {
  return (
    <footer className="tex-satin relative bg-wine pb-10 pt-24 text-[#fbe7ee]">
      <FrostingEdge color="var(--c-wine)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" onDark />
          <p className="mt-6 font-script text-[clamp(2.2rem,5vw,3.4rem)] leading-tight text-goldfoil">{site.subtitle}</p>
          <p className="mt-2 font-display text-2xl font-bold text-white">{site.hashtag}</p>
          <ShareRow tone="glass" className="mt-7 justify-center" />
        </div>

        <nav aria-label="Pie de página" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-3">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="rounded-full px-5 py-2.5 text-lg font-semibold transition hover:bg-white/10 hover:text-white">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-[#e6b8c8] md:flex-row">
          <p>© 2026 {site.channelName ?? "Calendario de San Valentín"} · Hecho con cariño</p>
          <details className="group text-center md:text-right">
            <summary className="cursor-pointer list-none rounded-full px-4 py-2 font-semibold transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
              Créditos de imágenes y video <span className="inline-block transition group-open:rotate-180">⌄</span>
            </summary>
            <ul className="mt-2 space-y-1">
              {credits.map((c) => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="underline decoration-gold/70 underline-offset-4 hover:text-white">{c.what}</a> · {c.who} · {c.license}
                </li>
              ))}
              <li>Ilustraciones de portada creadas para este proyecto</li>
            </ul>
          </details>
        </div>
      </div>
    </footer>
  );
}
