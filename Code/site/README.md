# San Valentín 2027 site

Public site for the calendar, built around sharing: the landing page, the 14 days as stories, what's included as a feed, a love-postcard maker, the community, the offer, questions as a chat and the footer. Next.js 16 with Tailwind CSS 4, exported as static files.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm start        # serves out/ locally
```

The cover backgrounds in `public/img` are produced by `docs/design/export_images.py` into `Code/assets/img`. `predev` and `prebuild` refresh `public/img` from there when that folder exists; otherwise the committed copies are used.

## Images and icons from Codex

Masters live in `assets/`. Save images as `assets/images/<name>.png`, with an optional `<name>.json` holding `{"alt": "…"}`, and icons as `assets/icons/<name>.svg`. `npm run dev` watches that folder: each new or changed file is optimized right away (AVIF, WebP and PNG or JPG at several widths, at most 350 KB each) and appears in the running site. `npm run assets` does the same once, and `npm run build` runs it first.

Codex can also be asked from the terminal. It finds the Codex CLI on `PATH` or in the OpenAI extension for VS Code, saves the result into `assets/` and runs the pipeline:

```bash
npm run codex -- image cookie-heart "heart-shaped sugar cookie with pink icing" --transparent
npm run codex -- icon rolling-pin "a rolling pin with a small heart"
```

Use the results through `src/components/Assets.tsx`: `<AssetImage name="cookie-heart" sizes="40vw" />` and `<AssetIcon name="rolling-pin" className="size-8 text-rose" />`. The names are typed, so a missing asset is a build error. File names, style and icon format are specified in the root `AGENTS.md`, which Codex reads automatically.

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
| `src/components/Intro.tsx` | Intro under the landing, with the 3D calendar book |
| `src/components/Stories.tsx`, `HeartRing.tsx`, `days.ts` | Day stories and story viewer; the demo's 3D ring of hearts on desktop; shared unlock dates |
| `src/components/Route.tsx` | "Tu ruta del amor": the 14 days along a ribbon |
| `src/components/Inside.tsx` | "¿Qué encontrarás dentro?" index cards and the "Mucho más que videos" band |
| `src/components/Sections.tsx` | Feed, gift, about, community with reviews, offer with countdown, chat questions and closing |
| `src/components/GiftCard.tsx` | Love postcard drawn on canvas, download and share |
| `src/components/Social.tsx` | Sharing, toasts, reminders (.ics), likes |
| `src/components/HeroSparkles.tsx`, `SprinkleHeart.tsx`, `CursorHearts.tsx` | Canvas effects |
| `src/components/SoundProvider.tsx` | Music and chime |
| `src/app/globals.css` | Colour tokens (light and dark), textures, card shapes, motion |

## Design decisions

- **Theme.** Light is the default because Pedro approved the current colours. The dark theme uses the same hues and is a visitor choice saved in the browser; it does not follow the system setting.
- **Landing.** The text and button are placed in image coordinates on each of the three background crops, inside the glowing heart. On small screens the button reads "Abrir" and the year joins the kicker so nothing overlaps.
- **Social.** Days are heart-shaped stories; content is shown as feed objects with like, share and save; visitors can make a love postcard and share it; the hashtag and Pedro's pass make up the community. Likes count only the visitor's own tap; no numbers are invented.
- **Cards.** Each card is an object for sending love: story screen, scalloped recipe card, envelope, postcard, membership pass, sticker, polaroids, notebook and gift tag.
- **Calendar.** Everyone's calendar opens on 1 February, whenever they bought it, and each day opens at 8:00 a.m. (Puerto Rico time until Pedro confirms). Before launch, Day 1 opens as a preview with one of Pedro's real recipes. On the public site this is display only; real access control belongs to the sales platform.
- **Not included.** No language switch (the content is Spanish only). Reviews show only when Pedro provides real ones.

## Pedro's content

- **Videos** stay on his YouTube channel, Sabores y Secretos PR, and are watched from there. `YouTube.tsx` shows the video's thumbnail and loads YouTube's privacy-enhanced player only on play.
- **Recipes** come from the descriptions of his videos, as he asked; he will also send each one as a document. They are `recipes` in `src/content/site.ts`.
- **Day 14** has no video: it is the plan in `day14Plan`.
- **Order of the days**: Pedro will send it. Until then days 1 to 13 show as "Receta del día", revealed on their date.

## Downloadables (recipe sheets)

The printable sheets are the paid downloadables, so the public build never includes them: `page.sheet.tsx` is only a page in sheets mode.

```bash
npm run sheets   # http://localhost:3200/receta/<slug>/ and /receta/plan-14-de-febrero/
```

Each sheet has a "Descargar PDF" button and prints on one letter page. Keep the PDFs in `docs/downloads/`, which stays out of git; buyers get them through the sales platform.

## 3D icons

The glossy icons in `assets/images/icon-*.png` and the brand mark `logo-mark.png` are used through `<Icon3D name="…" />`, `<LogoMark />` and `<Eyebrow icon="…">`, for feature spots and headings. The line icons in `Icons.tsx` stay for small controls such as like, sound and arrows.

## Before launch

Each item is marked `TODO` in `src/content/site.ts`:

- Brand on the cover, and whether to show it (Q7). The channel name is known: Sabores y Secretos PR
- Time zone for the 8:00 a.m. opening (Q9)
- Where the calendar is hosted and sold: checkout and buyer-area links (Q2, Q3)
- Price and offer (B03)
- Order of the recipes for days 1 to 13, and the remaining recipes (drinks and seasonal food)
- Pedro's recipe documents, to check against the sheets
- Promotional video showing a little of the content
- Answers to the questions, confirmed by Pedro (Q10, Q11)
- Pedro's own "about" text and photo
- Community hashtag

## Media

| File | Source | Licence |
|---|---|---|
| `public/img/cover-*` | Generated for this project from the approved cover (`docs/design/source/generation.json`) | Project asset |
| Recipe videos and thumbnails | Pedro's channel, [Sabores y Secretos PR](https://www.youtube.com/@saboresysecretospr4504), embedded from YouTube | Pedro's own |
| `assets/images/*`, `assets/icons/*` | Made for this project with Codex | Project asset |
| Textures | Drawn in SVG in `globals.css` | Original |
