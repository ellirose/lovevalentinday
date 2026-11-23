import type { Metadata } from "next";
import Link from "next/link";
import { channel, day14Plan, recipes, site } from "@/content/site";
import { Icon, Logo } from "@/components/Icons";
import { PrintButton } from "@/components/PrintButton";

// Printable recipe sheets: the downloadables for each day. One page per recipe, plus the day 14 plan.
// They are not linked from the public page; the sales platform will hand them to buyers.
const PLAN = "plan-14-de-febrero";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...recipes.map((r) => ({ slug: r.slug })), { slug: PLAN }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug === PLAN ? day14Plan.title : recipes.find((r) => r.slug === slug)?.title;
  return { title: `${title} · ${site.name}`, robots: { index: false, follow: false } };
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-surface-2 px-4 py-8 print:bg-white print:p-0">
      <div className="no-print mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="btn3d cream sm"><span className="chip"><Icon name="left" /></span>Volver al calendario</Link>
        <PrintButton />
      </div>
      <article className="recipe-sheet tex-paper mx-auto max-w-3xl rounded-[28px] bg-cream p-8 lift sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-rose/30 pb-5">
          <Logo />
          <p className="text-right text-sm font-bold uppercase tracking-[0.2em] text-rose-ink">{site.name}<br /><span className="text-muted">San Valentín 2027</span></p>
        </header>
        {children}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-rose/30 pt-5 text-sm text-muted">
          <span className="inline-flex items-center gap-2 font-bold text-rose-ink"><Icon name="youtube" className="size-5" />{channel.name}</span>
          <span>{channel.url.replace("https://www.", "")}</span>
        </footer>
      </article>
    </main>
  );
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug === PLAN) {
    return (
      <Sheet>
        <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-rose-ink">Día 14 · Domingo 14 de febrero</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-tight">{day14Plan.title}</h1>
        <p className="mt-3 text-lg text-muted">{day14Plan.intro}</p>
        <ol className="mt-8 space-y-5">
          {day14Plan.steps.map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-rose font-display text-xl font-bold text-white">{i + 1}</span>
              <p className="pt-1.5 text-lg leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center font-script text-4xl text-rose">¡Feliz San Valentín!</p>
      </Sheet>
    );
  }

  const r = recipes.find((x) => x.slug === slug)!;
  return (
    <Sheet>
      <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-rose-ink">Receta para descargar</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-tight">{r.title}</h1>
      <p className="mt-3 flex flex-wrap gap-2">
        {r.videos.map((v) => (
          <a key={v.id} href={`https://youtu.be/${v.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-sm font-bold text-rose-ink">
            <Icon name="youtube" className="size-4" />{v.title} · youtu.be/{v.id}
          </a>
        ))}
      </p>

      <section className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] print:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <h2 className="font-display text-2xl font-bold">Ingredientes</h2>
          {r.groups.map((g) => (
            <div key={g.name ?? "main"} className="mt-4 break-inside-avoid">
              {g.name && <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-rose-ink">{g.name}</h3>}
              <ul className="mt-2 space-y-1.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 leading-snug">
                    <Icon name="heartFill" className="mt-1 size-3.5 shrink-0 text-rose" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {r.notes && (
            <div className="mt-8 break-inside-avoid">
              <h2 className="font-display text-xl font-bold">Notas de Pedro</h2>
              <ul className="mt-2 space-y-2">
                {r.notes.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 leading-snug">
                    <Icon name="sparkle" className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          {r.steps && (
            <>
              <h2 className="font-display text-2xl font-bold">Procedimiento</h2>
              <ol className="mt-4 space-y-3">
                {r.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 break-inside-avoid">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-rose text-sm font-bold text-white">{i + 1}</span>
                    <p className="leading-relaxed">{s}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
          {r.bake && (
            <div className={`${r.steps ? "mt-6" : ""} rounded-[20px] bg-surface-2 p-5 break-inside-avoid`}>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Icon name="sparkle" className="size-6 text-gold-deep" />Horneado</h2>
              <ul className="mt-2 space-y-1.5">{r.bake.map((b) => <li key={b} className="leading-snug">{b}</li>)}</ul>
            </div>
          )}
          {!r.steps && (
            <p className="mt-6 rounded-[20px] border-2 border-dashed border-rose/30 p-5 leading-relaxed text-muted">
              Mira el paso a paso completo en el video de Pedro en YouTube.
            </p>
          )}
        </div>
      </section>
    </Sheet>
  );
}
