# San Valentín 2027 site

Public site for the calendar: the landing page, the 14-heart calendar preview, how it works, what's included, the offer, questions and the footer. Next.js 16 with Tailwind CSS 4, exported as static files.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm start        # serves out/ locally
```

The cover backgrounds in `public/img` are produced by `docs/design/export_images.py` into `Code/assets/img`. `predev` and `prebuild` refresh `public/img` from there when that folder exists; otherwise the committed copies are used.

## Deploy on Vercel

- Import the repository and set **Root Directory** to `Code/site`.
- Framework preset: Next.js. The build command (`npm run build`) and Node.js 20.9 or later are the defaults.
- The site is a static export (`output: "export"`), so no server functions are needed.

This Next.js version differs from older releases; read `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).

## Where things are

| Path | Contents |
|---|---|
| `src/content/site.ts` | All copy and settings: launch date, price, links, questions |
| `src/components/Hero.tsx` | Full-screen landing; layout rules are the `.hero-*` classes in `globals.css` |
| `src/components/Calendar.tsx` | 3D heart ring, day dates and the day window |
| `src/components/Sections.tsx` | How it works, what's included, about, offer, questions |
| `src/components/HeroSparkles.tsx`, `SugarHeart.tsx`, `CursorHearts.tsx` | Canvas effects |
| `src/components/SoundProvider.tsx` | Music and chime |
| `src/app/globals.css` | Colour tokens (light and dark), textures, card shapes, motion |

## Design decisions

- **Theme.** Light is the default because Pedro approved the current colours. The dark theme uses the same hues and is a visitor choice saved in the browser; it does not follow the system setting.
- **Landing.** The text and button are placed in image coordinates on each of the three background crops, inside the glowing heart. On small screens the button reads "Abrir" and the year joins the kicker so nothing overlaps.
- **Calendar.** Hearts unlock by date in Puerto Rico time. Before launch, Day 1 opens as a preview with sample content. On the public site this is display only; real access control belongs to the platform chosen in plan phase 2.
- **Ring clicks.** Pointer clicks are resolved by the ring from each heart's on-screen box, because Chrome's hit-testing inside 3D transforms is unreliable. Keyboard activation uses each heart's button.
- **Not included.** No language switch (the content is Spanish only), no testimonials and no countdown offer until Pedro provides real ones.

## Before launch

Each item is marked `TODO` in `src/content/site.ts`:

- Brand name on the cover, and whether to show it (Q7)
- Release time zone (Q9)
- Checkout and buyer-area links (Q2, Q3)
- Price and offer (B03)
- Answers to the questions, confirmed by Pedro (Q10, Q11)
- Pedro's own "about" text and photo
- Real day titles, videos and recipes in place of the preview sample

## Media

| File | Source | Licence |
|---|---|---|
| `public/img/cover-*` | Generated for this project from the approved cover (`docs/design/source/generation.json`) | Project asset |
| `public/media/baking-cookies-720p.webm` and poster | [Baking cookies.ogv](https://commons.wikimedia.org/wiki/File:Baking_cookies.ogv), Robert Cole, via Wikimedia Commons (720p transcode) | CC0 |
| Textures | Drawn in SVG in `globals.css` | Original |

The video is a stand-in until Pedro's own class videos are available.
