// Bridge to the Codex CLI: asks Codex for an image or icon, saves it straight into assets/ and runs the
// asset pipeline, so the result is ready to use in the site with no copying.
//
//   npm run codex -- image <name> "<what to draw>" [--transparent] [--size 1536x1024] [--alt "texto"] [--ref file]...
//   npm run codex -- icon  <name> "<what to draw>"
//
// Codex is found through CODEX_BIN, then PATH, then the OpenAI extension for VS Code.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function usage(msg) {
  if (msg) console.error(`codex: ${msg}\n`);
  console.error(`Usage:
  npm run codex -- image <name> "<what to draw>" [--transparent] [--size 1536x1024] [--alt "texto"] [--ref file]...
  npm run codex -- icon  <name> "<what to draw>"

<name> is lowercase-with-dashes. Images land in assets/images/<name>.png, icons in assets/icons/<name>.svg.`);
  process.exit(1);
}

function findCodex() {
  if (process.env.CODEX_BIN && existsSync(process.env.CODEX_BIN)) return process.env.CODEX_BIN;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["codex"], { encoding: "utf8" });
  const onPath = which.status === 0 && which.stdout.split(/\r?\n/).find((l) => l.trim() && !/\.(cmd|ps1)$/i.test(l.trim()));
  if (onPath) return onPath.trim();
  const exe = process.platform === "win32" ? "codex.exe" : "codex";
  for (const base of [".vscode", ".vscode-insiders", ".cursor"].map((d) => join(homedir(), d, "extensions"))) {
    if (!existsSync(base)) continue;
    const exts = readdirSync(base).filter((d) => /^openai\.(chatgpt|codex)-/.test(d)).sort().reverse();
    for (const ext of exts) {
      const bin = join(base, ext, "bin");
      if (!existsSync(bin)) continue;
      for (const platform of readdirSync(bin)) if (existsSync(join(bin, platform, exe))) return join(bin, platform, exe);
    }
  }
  return null;
}

/** Newest image Codex saved in its own folder since `since`: the fallback when it did not copy the file. */
function newestGenerated(since) {
  const dir = join(process.env.CODEX_HOME ?? join(homedir(), ".codex"), "generated_images");
  if (!existsSync(dir)) return null;
  let best = null;
  for (const session of readdirSync(dir)) {
    const sdir = join(dir, session);
    if (!statSync(sdir).isDirectory()) continue;
    for (const f of readdirSync(sdir)) {
      if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
      const t = statSync(join(sdir, f)).mtimeMs;
      if (t >= since && (!best || t > best.t)) best = { path: join(sdir, f), t };
    }
  }
  return best?.path ?? null;
}

const STYLE = `Style: the warm, bright, festive Valentine baking look of the approved site cover: soft magenta and rose bokeh, glowing bright honey gold, cream highlights, soft studio light, polished and detailed. Palette: rose #e91e63, light rose #ff4f8b, bright gold #ffc21a and #ffe27a, cream #fffaf2; deep wine #5c0a2b only in small shadows. Keep it light and vibrant, never dark or dull.
Hard rules: no text, letters, numbers, logos, watermarks or signatures unless the request names exact text; no real brands; no copyrighted characters.`;

function imagePrompt(name, desc, o) {
  return `Create one image asset for the "Calendario de San Valentín 2027" website (a Spanish-language baking calendar) in this folder.
Asset name: ${name}
Request: ${desc}
${STYLE}
Size: ${o.size ? `${o.size} pixels` : "choose the aspect ratio that suits the request"}.
${o.transparent ? "Background: the subject is isolated on a fully transparent background (PNG with alpha), clean edges, no backdrop or shadow box." : ""}
${o.refs.length ? "Use the attached reference image(s) as described in the request." : ""}
Steps:
1. Generate the image with your built-in image generation tool.
2. Save the final image as PNG at assets/images/${name}.png (overwrite if it exists).
3. Write assets/images/${name}.json containing {"alt": ${o.alt ? JSON.stringify(o.alt) : '"<short Spanish description for screen readers>"'}}.
4. Do not change any other file. Do not run npm or git.
Finish with one line: the saved path.`;
}

function iconPrompt(name, desc) {
  return `Write one SVG icon for the website in this folder.
Name: ${name}
Request: ${desc}
Save it at assets/icons/${name}.svg. Write vector markup by hand; do not generate a raster image.
Match the existing icon set in src/components/Icons.tsx: viewBox="0 0 48 48", fill="none", lines in currentColor with stroke-width 2.8 and round caps and joins, a soft body fill in currentColor with fill-opacity .16, and at most one small accent in bright gold #ffc21a. Bold, simple, readable at 24 px. No text, no width or height attributes, no scripts, no external references, under 2 KB.
Do not change any other file. Do not run npm or git.
Finish with one line: the saved path.`;
}

// ---- arguments
const [kind, name, desc, ...rest] = process.argv.slice(2);
if (!["image", "icon"].includes(kind)) usage(kind ? `unknown kind "${kind}"` : "");
if (!name || !NAME.test(name)) usage("give a name in lowercase-with-dashes");
if (!desc) usage("describe what to draw");
const o = { transparent: false, size: "", alt: "", refs: [] };
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (a === "--transparent") o.transparent = true;
  else if (a === "--size") o.size = rest[++i] ?? "";
  else if (a === "--alt") o.alt = rest[++i] ?? "";
  else if (a === "--ref") o.refs.push(resolve(rest[++i] ?? ""));
  else usage(`unknown option ${a}`);
}
if (o.size && !/^\d{3,4}x\d{3,4}$/.test(o.size)) usage("--size looks like 1536x1024");
for (const r of o.refs) if (!existsSync(r)) usage(`reference not found: ${r}`);

const codex = findCodex();
if (!codex) usage("Codex CLI not found. Install it, or set CODEX_BIN to the codex executable.");

const target = kind === "image" ? join(root, "assets", "images", `${name}.png`) : join(root, "assets", "icons", `${name}.svg`);
const prompt = kind === "image" ? imagePrompt(name, desc, o) : iconPrompt(name, desc);
const args = ["exec", "-C", root, "-s", "workspace-write", "--color", "never", ...o.refs.flatMap((r) => ["-i", r]), "-"];
const started = Date.now() - 2000;

console.log(`codex: asking Codex for ${kind} "${name}"…`);
const child = spawn(codex, args, { cwd: root, stdio: ["pipe", "inherit", "inherit"] });
child.stdin.end(prompt);
const code = await new Promise((done) => child.on("exit", done));

const fresh = existsSync(target) && statSync(target).mtimeMs >= started;
if (!fresh && kind === "image") {
  const found = newestGenerated(started);
  if (found) {
    const sharp = (await import("sharp")).default;
    await sharp(found).png().toFile(target);
    if (!existsSync(join(root, "assets", "images", `${name}.json`))) writeFileSync(join(root, "assets", "images", `${name}.json`), `${JSON.stringify({ alt: o.alt })}\n`);
    console.log(`codex: copied ${found} to assets/images/${name}.png`);
  }
}
if (!existsSync(target) || statSync(target).mtimeMs < started) {
  console.error(`codex: no new file at ${target} (Codex exit code ${code}).`);
  process.exit(1);
}

const build = spawnSync(process.execPath, [join(root, "scripts", "assets.mjs")], { cwd: root, stdio: "inherit" });
if (build.status !== 0) process.exit(build.status ?? 1);

console.log(
  kind === "image"
    ? `\nReady. Use it with:  <AssetImage name="${name}" sizes="(min-width: 1024px) 40vw, 90vw" />`
    : `\nReady. Use it with:  <AssetIcon name="${name}" className="size-8 text-rose" />`,
);
