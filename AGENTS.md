# Working rules for coding agents

These rules apply to every agent working in this repository. `Code/site/AGENTS.md` adds notes about the Next.js version.

## Layout

| Path | What it is |
|---|---|
| `Code/site/` | The public site: Next.js 16, Tailwind CSS 4, static export (`output: "export"`). Deployed on Vercel with Root Directory `Code/site` |
| `Code/site/assets/` | Masters for images and icons (see "Assets" below) |
| `docs/` | Project material. The folders listed in `.gitignore` are private: read them when needed, never commit them, and never copy the client's contact details anywhere |

## Git

- Commit or push only when the user asks.
- One short line per commit, with a prefix: `feat:`, `fix:`, `refactor:`, `docs:` or `chore:`.
- Author `ellirose <piterpasta55@gmail.com>`, already set in the local git config.
- No AI tool names, signatures or co-author trailers in commit messages, code or files.

## Code

- All styles live in `Code/site/src/app/globals.css`. CSS modules break with the Tailwind Turbopack loader. Custom classes go inside `@layer components` so utilities such as `hidden` can override them.
- Colours come from the tokens (`--c-*`, used as `bg-rose`, `text-ink` and so on), which are defined for light and dark. Light is the default whatever the system setting. Gold is bright (`#ffc21a`), and sections stay light: no dark wine backgrounds.
- Page copy is Spanish. Copy and settings live in `Code/site/src/content/site.ts`.
- Before handing work back, run `npm run lint` and `npm run build` in `Code/site`.

## Assets (images and icons)

Masters go into `Code/site/assets/`. The pipeline (`npm run assets`, which also runs inside `npm run dev` and `npm run build`) optimizes images into `public/assets/`. It also writes `src/content/assets.generated.ts`, which holds the image list and the cleaned icon markup. Never write into `public/assets/` and never edit the generated file by hand.

**Images**

- Save as `Code/site/assets/images/<name>.png`, with the name in lowercase-with-dashes. Use PNG with a transparent background for cut-outs.
- Next to it, write `<name>.json` containing `{"alt": "<short Spanish description>"}`. Use `"alt": ""` for pure decoration.
- Optional fields in that file: `"widths": [640, 1280]` and `"maxKB": 350`.
- Style: the bright, festive Valentine baking look of the approved cover. Soft magenta and rose bokeh, glowing honey gold, cream highlights. Palette: rose `#e91e63`, light rose `#ff4f8b`, gold `#ffc21a` and `#ffe27a`, cream `#fffaf2`. Light and vibrant, never dark or dull.
- No text, letters, numbers, logos or watermarks unless exact text is requested. No real brands or copyrighted characters. Nothing from the reference seller (Osirés).

**Icons**

- Save as `Code/site/assets/icons/<name>.svg`, written as vector markup.
- Match `src/components/Icons.tsx`:
  - `viewBox="0 0 48 48"` and `fill="none"`;
  - lines in `currentColor`, `stroke-width` 2.8, round caps and joins;
  - a soft body fill in `currentColor` with `fill-opacity` .16;
  - at most one small gold (`#ffc21a`) accent.
- No text, no `width` or `height` attributes, no scripts. Keep it under 2 KB.

**Using them**

```tsx
import { AssetIcon, AssetImage } from "@/components/Assets";

<AssetImage name="cookie-heart" sizes="(min-width: 1024px) 30vw, 80vw" />
<AssetIcon name="rolling-pin" className="size-8 text-rose" />   // lines take the text colour, the gold accent stays gold
<AssetIcon name="rolling-pin" title="Rodillo" />                // with a spoken label; without one it is decorative
```

**Generating with Codex from the terminal** (Codex is found automatically in the VS Code extension):

```bash
cd Code/site
npm run codex -- image cookie-heart "heart-shaped sugar cookie with pink icing" --transparent
npm run codex -- icon rolling-pin "a rolling pin with a small heart"
```

The cover backgrounds are the exception. Their masters are in `docs/design/source/`, and `docs/design/export_images.py` exports them.
