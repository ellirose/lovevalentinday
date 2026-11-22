// Refreshes public/img from Code/assets/img when that folder exists (local work).
// The copies in public/img are committed, so builds that only see this folder (e.g. Vercel) still work.
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "..", "..", "assets", "img");
const target = join(here, "..", "public", "img");

if (!existsSync(source)) {
  console.log("sync-assets: Code/assets/img not found, using committed public/img");
  process.exit(0);
}
mkdirSync(target, { recursive: true });
const files = readdirSync(source).filter((f) => /^cover-.*\.(avif|webp|jpg)$/.test(f));
for (const file of files) cpSync(join(source, file), join(target, file));
console.log(`sync-assets: copied ${files.length} cover images to public/img`);
