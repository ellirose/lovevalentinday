// "npm run sheets": a local server that also serves the printable recipe sheets (the paid downloadables),
// which the public build leaves out. Open a sheet and use "Descargar PDF" to save it.
import { spawn } from "node:child_process";

const port = process.argv[2] ?? "3200";
console.log(`sheets: http://localhost:${port}/receta/<slug>/ (slugs are in src/content/site.ts, plus plan-14-de-febrero)`);
const child = spawn("next", ["dev", "-p", port], { stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, SHEETS: "1" } });
child.on("exit", (code) => process.exit(code ?? 0));
