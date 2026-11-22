"use client";

import { useEffect, useRef, useState } from "react";
import { faqs, included, profile, site } from "@/content/site";
import { ArchEdge, RibbonEdge, StitchEdge, TornEdge } from "./Edges";
import { GiftCard } from "./GiftCard";
import { Icon, LogoMark } from "./Icons";
import { downloadReminders, LikeButton, ShareRow, useShare, useToast } from "./Social";
import { SprinkleHeart } from "./SprinkleHeart";
import { Eyebrow, Reveal, Tilt } from "./ui";
import { VideoPlayer } from "./VideoPlayer";

const H2 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Reveal as="h2" delay={0.08} className={`mt-4 font-display text-[clamp(2.4rem,5.2vw,4.4rem)] font-bold leading-[1.03] ${className}`}>
    {children}
  </Reveal>
);

/** Washi tape strip, used to "stick" paper objects to the page. */
const Tape = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`absolute z-10 h-7 w-24 bg-gold-hi/80 shadow-sm [clip-path:polygon(3%_0,97%_4%,100%_100%,0_96%)] ${className}`} />
);

/** Reactions under each object: like, ask, share and save the dates. */
function ReactionDock({ caption, tags }: { caption: string; tags: string }) {
  const share = useShare();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  return (
    <div className="mt-6">
      <div className="flex items-center gap-1 rounded-full bg-surface p-1.5 lift">
        <LikeButton />
        <a href="#preguntas" aria-label="Preguntar" className="grid size-12 place-items-center rounded-full text-ink transition hover:bg-surface-2"><Icon name="comment" className="size-7" /></a>
        <button type="button" onClick={() => share(caption)} aria-label="Compartir" className="grid size-12 place-items-center rounded-full text-ink transition hover:bg-surface-2"><Icon name="share" className="size-7" /></button>
        <button
          type="button"
          aria-pressed={saved}
          aria-label="Guardar las fechas en mi calendario"
          onClick={() => {
            setSaved(true);
            downloadReminders();
            toast("Fechas guardadas en tu calendario");
          }}
          className={`ml-auto grid size-12 place-items-center rounded-full transition hover:bg-surface-2 ${saved ? "text-gold-deep" : "text-ink"}`}
        >
          <Icon name={saved ? "bookmarkFill" : "bookmark"} className="size-7" />
        </button>
      </div>
      <p className="mt-4 px-2 text-lg leading-relaxed text-ink/85">
        {caption} <span className="font-bold text-rose-ink">{tags}</span>
      </p>
    </div>
  );
}

/* Object 1: a story screen with the class video. */
function StoryScreen() {
  return (
    <div className="relative mx-auto aspect-[9/14] w-full max-w-[340px] overflow-hidden rounded-[38px] border-[7px] border-surface bg-surface lift">
      <div className="absolute inset-0"><VideoPlayer src="/media/baking-cookies-720p.webm" poster="/media/baking-cookies-poster.webp" label="Galletas horneándose" autoLoop className="size-full" /></div>
      <div className="absolute inset-x-3 top-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
            {i === 0 && <span className="block h-full origin-left bg-goldfoil" style={{ animation: "progress 6s linear infinite" }} />}
          </span>
        ))}
      </div>
      <div className="absolute inset-x-3 top-7 flex items-center gap-2.5">
        <span className="story size-10"><span className="grid size-full place-items-center bg-surface"><LogoMark className="size-7" /></span></span>
        <p className="text-sm font-bold leading-tight text-white [text-shadow:0_1px_6px_rgb(0_0_0/.6)]">Clase del día<br /><span className="font-medium text-white/80">1 feb</span></p>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
        <p className="flex items-center gap-3 font-display text-2xl font-bold text-white">
          <span className="grid size-11 place-items-center rounded-full bg-goldfoil text-wine shadow-[0_3px_0_#d98400]"><Icon name="video" className="size-6" /></span>
          Clase en video
        </p>
      </div>
    </div>
  );
}

/* Object 2: a scalloped recipe card held with tape. */
function RecipeCard() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] rotate-[-2.5deg] pt-4">
      <Tape className="-top-0 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
      <article className="doily px-7 pb-16 pt-7 text-ink drop">
        <div className="flex items-start justify-between">
          <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-rose-ink"><Icon name="recipe" className="size-7" />Receta en PDF</p>
          <svg viewBox="0 0 48 48" className="size-12 text-rose" aria-hidden>
            <path d="M24 41C11 32 5 25 5 17.5 5 11.6 9.6 7 15.2 7c3.7 0 7 2 8.8 5 1.8-3 5.1-5 8.8-5C38.4 7 43 11.6 43 17.5 43 25 37 32 24 41Z" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 4" />
          </svg>
        </div>
        <p className="mt-1 font-script text-6xl leading-none text-rose">Día 1</p>
        <p className="mt-1 font-display text-xl font-bold">Receta del día</p>
        <div aria-hidden className="mt-4 space-y-3 border-t-2 border-dashed border-line pt-4">
          {[92, 70, 84, 58, 76].map((w) => (
            <span key={w} className="flex items-center gap-3"><Icon name="heartFill" className="size-3.5 text-rose" /><span className="h-2.5 rounded-full bg-line" style={{ width: `${w}%` }} /></span>
          ))}
        </div>
        <span className="absolute -bottom-3 right-0 grid size-16 rotate-12 sm:-right-3 place-items-center rounded-full bg-goldfoil text-wine shadow-[0_4px_0_#d98400]"><Icon name="download" className="size-8" /></span>
      </article>
    </div>
  );
}

/* Object 3: a love letter that slides out of its envelope, with the sprinkle heart. */
function LoveLetter() {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setOpen(true);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <button
      type="button"
      ref={ref}
      onClick={() => setOpen((o) => !o)}
      aria-pressed={open}
      aria-label={open ? "Guardar la carta" : "Abrir la carta"}
      className={`envelope mx-auto block aspect-[4/5] w-full max-w-[340px] ${open ? "is-open" : ""}`}
    >
      <span className="env-back" />
      <span className="env-letter overflow-hidden">
        <span className="absolute inset-x-0 top-3 text-center font-script text-3xl leading-none text-rose">Con amor</span>
        <SprinkleHeart className="absolute inset-x-0 top-9 h-[62%] w-full" />
      </span>
      <span className="env-pocket" />
      <span className="env-flap" />
      <span className="env-seal grid size-16 place-items-center rounded-full bg-goldfoil text-rose shadow-[0_4px_0_#d98400,0_10px_20px_rgb(0_0_0/0.3)]">
        <Icon name="heartFill" className="size-8" />
      </span>
    </button>
  );
}

export function Feed() {
  const items = [
    { el: <StoryScreen />, caption: "Cada corazón trae una clase en video, paso a paso, para verla cuando quieras y descargarla.", tags: "#ClaseEnVideo" },
    { el: <RecipeCard />, caption: "Y su receta en PDF: ingredientes y pasos listos para imprimir o guardar.", tags: "#RecetaDelDía" },
    { el: <LoveLetter />, caption: "14 días, 14 clases, 14 recetas. Un corazón nuevo cada mañana de febrero.", tags: "#14Días" },
  ];
  return (
    <section id="incluye" className="tex-linen relative bg-blush py-28 sm:py-32">
      <RibbonEdge color="var(--c-blush)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Reveal><Eyebrow>Qué incluye</Eyebrow></Reveal>
            <H2>Lo que guarda <span className="font-script font-normal text-rose">cada corazón</span></H2>
          </div>
          <Reveal delay={0.16} as="p" className="max-w-sm text-lg text-muted">Dale ❤ a lo que más te guste, compártelo o guarda las fechas en tu calendario.</Reveal>
        </div>
        <div className="mt-16 grid items-end gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {items.map((it, i) => (
            <Reveal key={it.tags} variant="flip" delay={0.12 * i} className="flex flex-col">
              <div className="flex flex-1 items-end">{it.el}</div>
              <ReactionDock caption={it.caption} tags={it.tags} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Gift ───────── */
export function Gift() {
  return (
    <section id="regala" className="tex-paper relative bg-bg py-24 sm:py-28">
      <TornEdge color="var(--c-bg)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-3xl">
          <Reveal><Eyebrow>Regala amor</Eyebrow></Reveal>
          <H2>Envía una <span className="font-script font-normal text-rose">postal de amor</span></H2>
          <Reveal delay={0.16} as="p" className="mt-5 text-lg text-muted">
            Escribe su nombre, elige un mensaje y compártela por WhatsApp o en tus historias. Tiene el tamaño perfecto para el teléfono.
          </Reveal>
        </div>
        <div className="mt-12"><GiftCard /></div>
      </div>
    </section>
  );
}

/* ───────── Community: Pedro's pass + hashtag sticker + polaroids ───────── */
export function Community() {
  const share = useShare();
  const toast = useToast();
  const frames = ["/media/frame-1.webp", "/media/frame-2.webp", "/media/frame-3.webp"];
  return (
    <section id="comunidad" className="relative bg-surface-2 py-24 sm:py-28">
      <ArchEdge color="var(--c-surface-2)" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center">
          <Reveal><Eyebrow className="justify-center">Comunidad</Eyebrow></Reveal>
          <H2>Horneamos <span className="font-script font-normal text-rose">juntos</span></H2>
        </div>
        <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          {/* Membership pass on a ribbon */}
          <Reveal variant="left" className="relative pt-24">
            <svg aria-hidden viewBox="0 0 120 110" className="absolute left-1/2 top-0 h-28 w-32 -translate-x-1/2">
              <path d="M20 0 L52 100 M100 0 L68 100" stroke="var(--c-rose)" strokeWidth="14" strokeLinecap="round" />
              <path d="M20 0 L52 100 M100 0 L68 100" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 6" />
              <rect x="44" y="92" width="32" height="18" rx="5" fill="var(--c-gold)" stroke="#d98400" strokeWidth="2" />
            </svg>
            <Tilt max={7}>
              <article className="pass overflow-hidden lift" style={{ rotate: "-2deg" }}>
                <span className="pass-slot" />
                <div className="bg-goldfoil px-6 pb-4 pt-12 text-center">
                  <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-wine">Pase de repostería</p>
                  <p className="font-display text-sm font-bold text-wine/70">Edición San Valentín 2027</p>
                </div>
                <div className="px-6 pb-7 text-center">
                  <span className="story mx-auto -mt-2 mt-5 size-28">
                    <span className="grid size-full place-items-center bg-rose pt-2 font-script text-6xl text-white">P</span>
                  </span>
                  <h3 className="mt-3 font-display text-3xl font-bold">{profile.name}</h3>
                  <p className="font-semibold text-rose-ink">{profile.line}</p>
                  <dl className="mt-5 grid grid-cols-3 rounded-[20px] border-2 border-dashed border-gold/70 p-3">
                    {[["14", "clases"], ["14", "recetas"], ["14", "días"]].map(([n, l]) => (
                      <div key={l}>
                        <dt className="sr-only">{l}</dt>
                        <dd className="font-display text-3xl font-extrabold text-rose">{n}</dd>
                        <dd className="text-sm font-semibold text-muted">{l}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 text-base leading-relaxed text-muted">{profile.bio}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {site.youtubeUrl && (
                      <a href={site.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn3d">
                        <span className="chip"><Icon name="youtube" /></span>Ver su canal
                      </a>
                    )}
                    <button type="button" onClick={() => share()} className="btn3d cream">
                      <span className="chip"><Icon name="share" /></span>Compartir
                    </button>
                  </div>
                </div>
              </article>
            </Tilt>
          </Reveal>

          <div className="lg:pt-10">
            {/* Hashtag sticker */}
            <Reveal className="sticker tex-satin bg-rose p-7 text-white lift sm:p-10" style={{ rotate: "1.2deg" }}>
              <p className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-white"><span className="grid size-8 place-items-center rounded-full bg-goldfoil text-wine"><Icon name="hash" className="size-5" /></span>Tu hashtag</p>
              <p className="mt-3 font-display text-[clamp(2rem,4.6vw,3.6rem)] font-extrabold leading-tight text-white [text-shadow:0_3px_0_var(--c-rose-ink)]">
                {/* Line breaks only between the words of the hashtag, never inside one. */}
                {site.hashtag.split(/(?<=[a-z])(?=[A-Z0-9])/).map((w, i) => (i ? [<wbr key={i} />, w] : w))}
              </p>
              <p className="mt-3 max-w-xl text-lg text-white/95">Cuando prepares tus recetas, toma una foto y compártela con el hashtag para encontrar a quienes hornean contigo.</p>
              <div className="mt-7 flex flex-wrap gap-3 pr-16">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(site.hashtag);
                      toast("Hashtag copiado");
                    } catch {
                      toast("No se pudo copiar");
                    }
                  }}
                  className="btn3d gold"
                >
                  <span className="chip"><Icon name="hash" /></span>Copiar hashtag
                </button>
                <ShareRow />
              </div>
            </Reveal>

            {/* Polaroids */}
            <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {frames.map((f, i) => (
                <Reveal as="li" key={f} variant="zoom" delay={0.08 * i} className="relative">
                  <Tape className="-top-3 left-1/2 -translate-x-1/2" />
                  <figure className="rounded-[8px] bg-white p-2.5 pb-3 shadow-[0_18px_30px_-14px_rgb(var(--shadow-rgb)/0.5)] transition duration-500 hover:rotate-0 hover:scale-105" style={{ rotate: `${[-4, 3, -2][i]}deg` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
                    <img src={f} alt="Galletas horneándose" loading="lazy" className="aspect-square w-full rounded-[4px] object-cover" />
                    <figcaption className="mt-2 text-center font-script text-2xl leading-none text-rose">Inspiración</figcaption>
                  </figure>
                </Reveal>
              ))}
              <Reveal as="li" variant="zoom" delay={0.24} className="relative">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-6" />
                <div className="grid aspect-[0.86] place-items-center rounded-[8px] border-[3px] border-dashed border-rose/50 bg-surface p-3 text-center text-rose-ink" style={{ rotate: "4deg" }}>
                  <div>
                    <Icon name="camera" className="mx-auto size-12" />
                    <p className="mt-2 font-bold leading-tight">Tu foto aquí</p>
                  </div>
                </div>
              </Reveal>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Offer: gift tag + spiral notebook ───────── */
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
        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal variant="left">
            <Tilt max={6}>
              <div className="drop">
                <div className="tex-satin relative bg-rose py-10 pl-[84px] pr-5 text-white [clip-path:polygon(0_50%,64px_0,100%_0,100%_100%,64px_100%)] sm:pl-28 sm:pr-10">
                  <span aria-hidden className="absolute left-9 top-1/2 size-8 -translate-y-1/2 rounded-full border-[5px] border-gold bg-bg" />
                  <span aria-hidden className="absolute inset-3 left-[72px] rounded-[22px] border-2 border-dashed border-white/60" />
                  <div className="relative [transform:translateZ(36px)]">
                    <p className="inline-block rounded-full bg-goldfoil px-3 py-1 text-xs font-extrabold uppercase tracking-[0.22em] text-wine shadow-[0_2px_0_#d98400]">Precio de lanzamiento</p>
                    {price ? (
                      <p className="mt-4 font-display text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none text-white [text-shadow:0_4px_0_var(--c-rose-ink)]">
                        ${price.amount}
                        {price.regular && <s className="ml-4 align-middle font-sans text-2xl font-semibold text-white/70 [text-shadow:none]">${price.regular}</s>}
                      </p>
                    ) : (
                      <p className="mt-4 font-display text-[clamp(3rem,6.4vw,4.6rem)] font-extrabold leading-none text-white [text-shadow:0_4px_0_var(--c-rose-ink)]">Muy pronto</p>
                    )}
                    <p className="mt-4 text-lg text-white/95">Pago único. Un corazón nuevo cada día del 1 al 14 de febrero.</p>
                    <div className="mt-8 flex flex-wrap gap-4">
                      {site.checkoutUrl ? (
                        <a href={site.checkoutUrl} className="btn3d gold lg"><span className="chip"><Icon name="heartFill" className="text-rose" /></span>Quiero mi calendario</a>
                      ) : (
                        <span className="btn3d gold lg" aria-disabled="true"><span className="chip"><Icon name="calendar" /></span>Próximamente</span>
                      )}
                      <a href="#regala" className="btn3d cream lg"><span className="chip"><Icon name="gift" /></span>Regálalo</a>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </Reveal>
          <Reveal variant="right">
            <div className="notebook px-6 pb-6 lift sm:px-8" style={{ rotate: "1.5deg" }}>
              <span aria-hidden className="notebook-margin" />
              <p className="relative pl-12 font-script text-4xl leading-[60px] text-rose">Todo lo que incluye</p>
              <ul className="relative">
                {included.map((t) => (
                  <li key={t} className="flex min-h-[60px] items-center gap-4">
                    <Icon name="check" className="size-9 shrink-0" />
                    <span className="pl-3 text-xl font-semibold leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ as a chat thread with quick replies ───────── */
export function Faq() {
  const [thread, setThread] = useState<{ q: string; a: string }[]>([]);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const asked = new Set(thread.map((t) => t.q));


  useEffect(() => {
    const b = box.current;
    if (b && thread.length) b.scrollTo({ top: b.scrollHeight, behavior: "smooth" });
  }, [thread, typing]);

  const ask = (q: string, a: string) => {
    if (typing) return;
    setThread((t) => [...t, { q, a: "" }]);
    setTyping(true);
    window.setTimeout(() => {
      setThread((t) => t.map((x, i) => (i === t.length - 1 ? { q, a } : x)));
      setTyping(false);
    }, 900);
  };

  // The first question answers itself when the chat scrolls into view, so it never looks empty.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      io.disconnect();
      window.setTimeout(() => ask(faqs[0].q, faqs[0].a), 500);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return (
    <section id="preguntas" className="tex-linen relative bg-surface-2 py-24 sm:py-28">
      <StitchEdge />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <Reveal><Eyebrow>Preguntas</Eyebrow></Reveal>
          <H2>¿Tienes <span className="font-script font-normal text-rose">dudas?</span></H2>
          <Reveal delay={0.16} as="p" className="mt-5 max-w-sm text-lg text-muted">Toca una pregunta y te respondemos al momento, como en un chat.</Reveal>
        </div>
        {/* Phone with a chat */}
        <Reveal variant="flip" className="mx-auto w-full min-w-0 max-w-[460px] rounded-[48px] bg-surface p-3 ring-1 ring-line lift">
          <div className="overflow-hidden rounded-[38px] bg-surface ring-1 ring-line">
            <div className="flex items-center gap-3 border-b border-line px-5 pb-4 pt-6">
              <span className="story size-12"><span className="grid size-full place-items-center bg-surface"><LogoMark className="size-8" /></span></span>
              <div className="leading-tight">
                <p className="font-bold">Calendario de San Valentín</p>
                <p className="flex items-center gap-1.5 text-sm text-muted"><span className="size-2 rounded-full bg-[#2ecc71]" />Respuestas al instante</p>
              </div>
            </div>
            <div ref={box} className="tex-paper h-[360px] space-y-3 overflow-y-auto bg-surface-2/60 p-5" aria-live="polite">
              <p className="bubble-in lift">¡Hola! 💗 ¿Qué te gustaría saber sobre el calendario?</p>
              {thread.map((t, i) => (
                <div key={i} className="space-y-3">
                  <p className="bubble-out" style={{ animation: "pop-in .35s var(--ease-soft)" }}>{t.q}</p>
                  {t.a && <p className="bubble-in lift" style={{ animation: "pop-in .35s var(--ease-soft)" }}>{t.a}</p>}
                </div>
              ))}
              {typing && (
                <p className="bubble-in typing w-fit text-muted" aria-label="Escribiendo">
                  <span /> <span /> <span />
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5 border-t border-line p-4">
              {faqs.map((f) => (
                <button
                  key={f.q}
                  type="button"
                  disabled={asked.has(f.q)}
                  onClick={() => ask(f.q, f.a)}
                  className="rounded-full text-left leading-snug border-2 border-rose/30 bg-surface px-4 py-2 text-base font-bold text-rose-ink transition hover:border-rose hover:bg-rose hover:text-white disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-rose-ink"
                >
                  {f.q}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
