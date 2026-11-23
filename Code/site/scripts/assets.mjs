// Asset pipeline: turns the masters in assets/ (made by Codex or by hand) into web files the site uses.
//
//   assets/images/<name>.png|jpg|jpeg|webp  ->  public/assets/<name>-<width>.avif|webp|jpg (png when transparent)
//   assets/images/<name>.json (optional)    ->  { "alt": "...", "widths": [640, 1280], "maxKB": 350 }
//   assets/icons/<name>.svg                 ->  cleaned markup, placed inline in the page by <AssetIcon>
//   everything                              ->  src/content/assets.generated.ts (typed list for the components)
//
// Usage: node scripts/assets.mjs           build once (only changed files are re-encoded)
//        node scripts/assets.mjs --watch   build, then rebuild whenever assets/ changes
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, watch, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = { images: join(root, "assets", "images"), icons: join(root, "assets", "icons") };
const OUT = join(root, "public", "assets");
const STATE = join(OUT, "manifest.json");
const TS = join(root, "src", "content", "assets.generated.ts");
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const DEFAULT_WIDTHS = [640, 1280, 1920];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  sharp = null;
}

const log = (msg) => console.log(`assets: ${msg}`);
const hash = (...parts) => createHash("sha1").update(parts.join("\0")).digest("hex").slice(0, 16);
const list = (dir, test) => (existsSync(dir) ? readdirSync(dir).filter(test).sort() : []);
const readJson = (file, fallback) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};

/** Encode at falling quality until the file fits the size budget. */
async function encode(pipeline, format, maxBytes) {
  for (let q = 86; q >= 30; q -= 6) {
    const options = { avif: { quality: q - 20, effort: 5 }, webp: { quality: q, effort: 6 }, jpeg: { quality: q, mozjpeg: true }, png: { quality: q, compressionLevel: 9, palette: true } }[format];
    const buf = await pipeline.clone().toFormat(format, options).toBuffer();
    if (buf.length <= maxBytes || q - 6 < 30) return buf;
  }
}

/**
 * Keep only drawing markup, because icons are placed inline in the page: no scripts, styles, event handlers,
 * external references or fixed sizes. The icon fills its box and inherits the text colour (currentColor).
 */
function cleanSvg(svg) {
  let s = svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|metadata|title|desc|foreignObject|iframe|image|use)\b[\s\S]*?(<\/\1>|\/>)/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(xlink:)?href\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/url\((?!#)[^)]*\)/gi, "none")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>$/i.test(s)) throw new Error("not an SVG document");
  s = s.replace(/^<svg\b([^>]*)>/i, (_, attrs) => {
    let a = attrs.replace(/\s(width|height|class|id|role|aria-[a-z]+|focusable)\s*=\s*("[^"]*"|'[^']*')/gi, "");
    if (!/viewBox/i.test(a)) a += ' viewBox="0 0 48 48"';
    if (!/xmlns=/i.test(a)) a += ' xmlns="http://www.w3.org/2000/svg"';
    return `<svg${a} width="100%" height="100%" aria-hidden="true" focusable="false">`;
  });
  return s;
}

async function build() {
  mkdirSync(OUT, { recursive: true });
  rmSync(join(OUT, "icons"), { recursive: true, force: true }); // icons are inline now; drop the old folder
  const prev = readJson(STATE, { images: {}, icons: {} });
  const next = { images: {}, icons: {} };
  const problems = [];

  // Images
  for (const file of list(SRC.images, (f) => RASTER.has(extname(f).toLowerCase()))) {
    const name = file.slice(0, -extname(file).length);
    if (!NAME.test(name)) {
      problems.push(`images/${file}: name must be lowercase-with-dashes`);
      continue;
    }
    const src = join(SRC.images, file);
    const optFile = join(SRC.images, `${name}.json`);
    const opts = readJson(optFile, {});
    const key = hash(readFileSync(src).toString("base64"), JSON.stringify(opts), "v2"); // bump the version to re-encode everything after changing encoder settings
    const old = prev.images[name];
    if (old?.key === key && old.files.every((f) => existsSync(join(OUT, f)))) {
      next.images[name] = old;
      continue;
    }
    if (!sharp) {
      if (old) next.images[name] = old;
      problems.push(`images/${file}: sharp is not installed, kept the previous output`);
      continue;
    }
    const img = sharp(src, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    const alpha = meta.hasAlpha && (await img.clone().stats()).isOpaque === false;
    const fallback = alpha ? "png" : "jpeg";
    const fallbackExt = alpha ? "png" : "jpg";
    const widths = [...new Set((opts.widths ?? DEFAULT_WIDTHS).map((w) => Math.min(w, width)))].sort((a, b) => a - b);
    const maxBytes = (opts.maxKB ?? 350) * 1024;
    const files = [];
    const bytes = { avif: 0, webp: 0, [fallbackExt]: 0 };
    for (const w of widths) {
      const resized = img.clone().resize({ width: w, withoutEnlargement: true });
      for (const [format, ext] of [["avif", "avif"], ["webp", "webp"], [fallback, fallbackExt]]) {
        const out = `${name}-${w}.${ext}`;
        const buf = await encode(resized, format, maxBytes);
        writeFileSync(join(OUT, out), buf);
        bytes[ext] += buf.length;
        files.push(out);
      }
    }
    // A modern format is only offered when it is actually smaller (flat graphics can be larger in AVIF).
    const formats = ["avif", "webp"].filter((f) => bytes[f] < bytes[fallbackExt]);
    next.images[name] = { key, width, height, alpha, alt: opts.alt ?? "", widths, ext: fallbackExt, formats, files };
    log(`image ${name}: ${widths.join(", ")} px${alpha ? ", transparent" : ""}`);
  }

  // Icons
  for (const file of list(SRC.icons, (f) => extname(f).toLowerCase() === ".svg")) {
    const name = file.slice(0, -4);
    if (!NAME.test(name)) {
      problems.push(`icons/${file}: name must be lowercase-with-dashes`);
      continue;
    }
    try {
      const svg = cleanSvg(readFileSync(join(SRC.icons, file), "utf8"));
      if (svg.length > 6000) problems.push(`icons/${file}: ${svg.length} bytes, keep icons small`);
      if (prev.icons[name]?.svg !== svg) log(`icon ${name}`);
      next.icons[name] = { svg };
    } catch (e) {
      problems.push(`icons/${file}: ${e.message}`);
    }
  }

  // Remove outputs whose master was deleted
  for (const [name, entry] of Object.entries(prev.images)) {
    if (next.images[name]) continue;
    entry.files.forEach((f) => rmSync(join(OUT, f), { force: true }));
    log(`removed image ${name}`);
  }
  for (const name of Object.keys(prev.icons ?? {})) if (!next.icons[name]) log(`removed icon ${name}`);

  writeFileSync(STATE, `${JSON.stringify(next, null, 2)}\n`);
  writeTs(next);
  problems.forEach((p) => console.warn(`assets: warning: ${p}`));
  log(`${Object.keys(next.images).length} images, ${Object.keys(next.icons).length} icons`);
}

function writeTs({ images, icons }) {
  const set = (name, ext, widths) => widths.map((w) => `/assets/${name}-${w}.${ext} ${w}w`).join(", ");
  const rows = Object.entries(images).map(([name, e]) => {
    const big = e.widths.at(-1);
    return `  ${JSON.stringify(name)}: {
    width: ${e.width},
    height: ${e.height},
    alt: ${JSON.stringify(e.alt)},
    transparent: ${e.alpha},
    src: ${JSON.stringify(`/assets/${name}-${big}.${e.ext}`)},
    avif: ${JSON.stringify(e.formats?.includes("avif") ? set(name, "avif", e.widths) : "")},
    webp: ${JSON.stringify(e.formats?.includes("webp") ? set(name, "webp", e.widths) : "")},
    fallback: ${JSON.stringify(set(name, e.ext, e.widths))},
  },`;
  });
  const ts = `// Generated by scripts/assets.mjs from assets/. Do not edit: change the masters and run "npm run assets".
export const images = {${rows.length ? `\n${rows.join("\n")}\n` : ""}} as const;

/** Cleaned SVG markup (no scripts, styles or external references), placed inline by <AssetIcon>. */
export const icons = {${Object.keys(icons).length ? `\n${Object.entries(icons).map(([n, e]) => `  ${JSON.stringify(n)}: ${JSON.stringify(e.svg)},`).join("\n")}\n` : ""}} as const;

export type ImageName = keyof typeof images;
export type AssetIconName = keyof typeof icons;
`;
  if (!existsSync(TS) || readFileSync(TS, "utf8") !== ts) writeFileSync(TS, ts);
}

let running = Promise.resolve();
const queue = () => (running = running.then(build).catch((e) => console.error(`assets: ${e.message}`)));

mkdirSync(SRC.images, { recursive: true });
mkdirSync(SRC.icons, { recursive: true });
await queue();

if (process.argv.includes("--watch")) {
  let timer;
  for (const dir of Object.values(SRC)) {
    watch(dir, (_, file) => {
      if (!file || file.startsWith(".")) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        log(`change in ${relative(root, join(dir, file))}`);
        queue();
      }, 400);
    });
  }
  log("watching assets/ for new images and icons");
}
