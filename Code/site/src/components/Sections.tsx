"use client";

import { useState } from "react";
import { about, faqs, features, included, site, steps } from "@/content/site";
import { ArchEdge, RibbonEdge, StitchEdge, TornEdge } from "./Edges";
import { Icon, IconName } from "./Icons";
import { SugarHeart } from "./SugarHeart";
import { Eyebrow, Reveal, Tilt } from "./ui";
import { VideoPlayer } from "./VideoPlayer";

const H2 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Reveal as="h2" delay={0.08} className={`mt-4 font-display text-[clamp(2.4rem,5.2vw,4.4rem)] font-bold leading-[1.03] ${className}`}>
    {children}
  </Reveal>
);

/* ───────── How it works: ticket → heart → recipe card ───────── */
export function HowItWorks() {
  const shapes = [
    // ticket stub
    (c: React.ReactNode) => <div className="shape-ticket h-full rounded-[30px] bg-surface p-8 pl-10">{c}</div>,
    // heart-topped card
    (c: React.ReactNode) => (
      <div className="relative h-full rounded-[30px] bg-rose p-8 pt-24 text-on-rose dark:bg-wine-2 dark:text-ink">
        <svg aria-hidden viewBox="0 0 100 60" className="absolute -top-10 left-1/2 w-40 -translate-x-1/2 text-rose dark:text-wine-2"><path d="M50 60C20 42 6 30 6 18 6 9 13 2 22 2c12 0 22 10 28 18C56 12 66 2 78 2c9 0 16 7 16 16 0 12-14 24-44 42Z" fill="currentColor" /></svg>
        {c}
      </div>
    ),
    // folded recipe card
    (c: React.ReactNode) => (
      <div className="shape-fold relative h-full bg-cream p-8">
        <span aria-hidden className="absolute right-0 top-0 size-14 bg-gold-soft [clip-path:polygon(0_0,0_100%,100%_100%)]" />
        {c}
      </div>
    ),
  ];
  return (
    <section id="como-funciona" className="tex-paper relative bg-bg py-24 sm:py-28">
      <TornEdge color="var(--c-bg)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal><Eyebrow>Cómo funciona</Eyebrow></Reveal>
            <H2>Tres pasos, <span className="font-script font-normal text-rose">catorce</span> dulces momentos</H2>
          </div>
          <Reveal delay={0.16} as="p" className="max-w-md text-lg text-muted">Sin complicaciones: compras una vez y cada día de febrero te espera algo nuevo.</Reveal>
        </div>
        <ol className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} variant="flip" delay={0.12 * i} className={`${i === 1 ? "md:mt-12" : ""} ${i === 2 ? "md:mt-24" : ""}`}>
              <Tilt className="h-full drop">
                {shapes[i](
                  <div className="[transform:translateZ(40px)]">
                    <div className="flex items-start justify-between">
                      <span className={`grid size-20 place-items-center rounded-[26px] ${i === 1 ? "bg-white/15 text-white dark:text-ink" : "bg-surface-2 text-rose"}`}>
                        <Icon name={s.icon as IconName} className="size-12" />
                      </span>
                      <span className={`font-display text-7xl font-extrabold leading-none ${i === 1 ? "text-white/30" : "text-line"}`}>{i + 1}</span>
                    </div>
                    <h3 className="mt-8 font-display text-[1.9rem] font-bold leading-tight">{s.title}</h3>
                    <p className={`mt-3 text-lg ${i === 1 ? "text-white/90 dark:text-muted" : "text-muted"}`}>{s.text}</p>
                  </div>,
                )}
              </Tilt>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Inside each heart: video screen + recipe + sprinkle heart ───────── */
export function Inside() {
  return (
    <section id="incluye" className="tex-satin relative bg-wine py-28 text-[#fff1f5] sm:py-32">
      <RibbonEdge color="var(--c-wine)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <Reveal><Eyebrow className="!text-gold">Qué incluye</Eyebrow></Reveal>
          <H2 className="text-white">Lo que guarda <span className="font-script font-normal text-gold">cada corazón</span></H2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          {/* Video screen card */}
          <Reveal variant="left" className="lg:col-span-7">
            <Tilt max={5} className="h-full">
              <article className="shape-screen relative flex h-full flex-col overflow-hidden bg-[#2a0614] p-3 lift">
                <span aria-hidden className="absolute left-1/2 top-3 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
                <VideoPlayer src="/media/baking-cookies-720p.webm" poster="/media/baking-cookies-poster.webp" label="Galletas horneándose" autoLoop className="min-h-[260px] flex-1 rounded-[28px]" />
                <div className="flex flex-wrap items-center gap-5 p-5 pt-6 [transform:translateZ(30px)]">
                  <span className="grid size-16 place-items-center rounded-[22px] bg-gold text-wine"><Icon name="video" className="size-10" /></span>
                  <div className="flex-1">
                    <h3 className="font-display text-3xl font-bold text-white">Clase en video</h3>
                    <p className="mt-1 text-lg text-[#f3c9d6]">Paso a paso, para verla cuando quieras y descargarla.</p>
                  </div>
                </div>
              </article>
            </Tilt>
          </Reveal>

          <div className="grid gap-8 lg:col-span-5">
            {/* Recipe card */}
            <Reveal variant="right" delay={0.1}>
              <Tilt max={7}>
                <article className="shape-fold relative bg-cream p-7 text-ink lift">
                  <span aria-hidden className="absolute right-0 top-0 size-14 bg-gold-soft [clip-path:polygon(0_0,0_100%,100%_100%)]" />
                  <div className="flex items-center gap-5 [transform:translateZ(30px)]">
                    <span className="grid size-16 shrink-0 place-items-center rounded-[22px] bg-rose text-on-rose"><Icon name="recipe" className="size-10" /></span>
                    <div>
                      <h3 className="font-display text-3xl font-bold">Receta en PDF</h3>
                      <p className="mt-1 text-lg text-muted">Ingredientes y pasos, lista para imprimir o guardar.</p>
                    </div>
                  </div>
                  <div aria-hidden className="mt-6 space-y-2.5 border-t border-dashed border-line pt-5">
                    {[92, 76, 84, 58].map((w) => (
                      <span key={w} className="flex items-center gap-3">
                        <span className="size-2 rounded-full bg-rose" />
                        <span className="h-2 rounded-full bg-line" style={{ width: `${w}%` }} />
                      </span>
                    ))}
                  </div>
                </article>
              </Tilt>
            </Reveal>

            {/* Sprinkle heart medallion */}
            <Reveal variant="zoom" delay={0.2}>
              <article className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#2a0614] lift">
                <SugarHeart className="block aspect-[5/4] w-full" />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6">
                  <p className="font-display text-[2.6rem] font-extrabold leading-none text-white">
                    14 <span className="block text-lg font-semibold tracking-[0.2em] text-gold">CLASES</span>
                  </p>
                  <p className="text-right font-display text-[2.6rem] font-extrabold leading-none text-white">
                    14 <span className="block text-lg font-semibold tracking-[0.2em] text-gold">RECETAS</span>
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {features.map((f, i) => (
            <Reveal as="li" key={f.text} delay={0.08 * i} className="flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.06] p-2.5 pr-6 backdrop-blur">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-cream text-rose"><Icon name={f.icon as IconName} className="size-8" /></span>
              <span className="text-lg font-semibold">{f.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── About: arch portrait on plaster ───────── */
export function About() {
  return (
    <section className="tex-plaster relative bg-surface-2 py-24 sm:py-28">
      <ArchEdge color="var(--c-surface-2)" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-[minmax(0,380px)_1fr]">
        <Reveal variant="zoom" className="mx-auto w-full max-w-[340px]">
          <div className="shape-arch relative aspect-[4/5] overflow-hidden bg-rose p-3 lift">
            <div className="shape-arch tex-linen grid size-full place-items-center bg-wine-2">
              <span className="font-script text-[9rem] leading-none text-gold-soft dark:text-gold">P</span>
            </div>
            <span aria-hidden className="absolute inset-3 rounded-[inherit] border-2 border-dashed border-gold/60" />
          </div>
        </Reveal>
        <div>
          <Reveal><Eyebrow>Desde Puerto Rico</Eyebrow></Reveal>
          <H2>{about.title}</H2>
          <Reveal delay={0.16} as="p" className="mt-6 max-w-2xl text-[clamp(1.15rem,1.6vw,1.35rem)] leading-relaxed text-muted">
            {about.text}
          </Reveal>
          <Reveal delay={0.24} className="mt-8 inline-flex items-center gap-4 rounded-full bg-surface p-2 pr-6 lift">
            <span className="grid size-14 place-items-center rounded-full bg-rose text-on-rose"><Icon name="heart" className="size-8" /></span>
            <span className="font-display text-xl font-bold">Recetas para hacer en casa</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── Offer: a gift tag on a ribbon ───────── */
export function Offer() {
  const price = site.price;
  return (
    <section id="precio" className="tex-paper relative bg-bg py-24 sm:py-28">
      <TornEdge color="var(--c-bg)" seed={23} />
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <Reveal><Eyebrow className="justify-center">Edición San Valentín 2027</Eyebrow></Reveal>
          <H2>Regálate <span className="font-script font-normal text-rose">14 días</span> de recetas</H2>
        </div>
        <div className="relative mt-16 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* string */}
          <svg aria-hidden viewBox="0 0 600 200" className="absolute -left-10 top-6 hidden w-[55%] lg:block">
            <path d="M0 40 C 160 10 260 140 540 96" stroke="var(--c-gold)" strokeWidth="3" fill="none" strokeDasharray="2 6" strokeLinecap="round" />
          </svg>
          <Reveal variant="left">
            <Tilt max={6}>
              <div className="drop">
                <div className="shape-tag relative bg-surface py-10 pl-24 pr-10 sm:pl-28">
                  <span aria-hidden className="absolute left-9 top-1/2 size-7 -translate-y-1/2 rounded-full border-4 border-gold bg-bg" />
                  <span aria-hidden className="stitch absolute inset-3 left-16 rounded-[22px]" />
                  <div className="relative [transform:translateZ(36px)]">
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-rose-ink">Precio de lanzamiento</p>
                    {price ? (
                      <p className="mt-3 font-display text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none text-rose">
                        ${price.amount}
                        {price.regular && <s className="ml-4 align-middle font-sans text-2xl font-semibold text-muted">${price.regular}</s>}
                      </p>
                    ) : (
                      <p className="mt-3 font-display text-[clamp(2.8rem,6vw,4.2rem)] font-extrabold leading-none text-rose">Muy pronto</p>
                    )}
                    <p className="mt-4 text-lg text-muted">Pago único. Un corazón nuevo cada día del 1 al 14 de febrero.</p>
                    {site.checkoutUrl ? (
                      <a href={site.checkoutUrl} className="btn-shine mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-rose px-8 text-lg font-bold text-on-rose transition hover:-translate-y-0.5">
                        <Icon name="gift" className="size-7" /> Quiero mi calendario
                      </a>
                    ) : (
                      <span className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full border-2 border-dashed border-rose px-7 text-lg font-bold text-rose-ink">
                        <Icon name="calendar" className="size-7" /> Próximamente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Tilt>
          </Reveal>
          <ul className="space-y-4">
            {included.map((t, i) => (
              <Reveal as="li" key={t} variant="right" delay={0.08 * i} className="flex items-center gap-5 rounded-[26px] border border-line bg-surface/80 p-4 pr-6 lift">
                <Icon name="check" className="size-12 shrink-0 text-rose" />
                <span className="text-xl font-semibold">{t}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ: stitched fabric accordion ───────── */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="preguntas" className="tex-linen relative bg-surface-2 py-24 sm:py-28">
      <StitchEdge />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal><Eyebrow>Preguntas</Eyebrow></Reveal>
          <H2>¿Tienes <span className="font-script font-normal text-rose">dudas?</span></H2>
          <Reveal delay={0.16} as="p" className="mt-5 max-w-sm text-lg text-muted">Aquí están las respuestas más comunes sobre tu calendario.</Reveal>
        </div>
        <ul className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={f.q} delay={0.06 * i}>
                <div className={`rounded-[30px] border bg-surface transition-colors duration-500 ${isOpen ? "border-rose/40 lift" : "border-line"}`}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center gap-5 p-5 text-left sm:p-6"
                    >
                      <span className="flex-1 font-display text-[1.45rem] font-bold leading-snug">{f.q}</span>
                      <span className={`grid size-12 shrink-0 place-items-center rounded-full transition duration-500 ease-[var(--ease-spring)] ${isOpen ? "rotate-[135deg] bg-rose text-on-rose" : "bg-surface-2 text-rose"}`}>
                        <Icon name="plus" className="size-6" />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-soft)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 text-lg text-muted sm:px-6">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
