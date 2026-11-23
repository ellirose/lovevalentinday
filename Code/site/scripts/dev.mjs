// "npm run dev": the Next.js dev server plus the asset watcher, so an image or icon saved into assets/
// (by Codex or by hand) is optimized and shows up in the browser without another step.
import { spawn } from "node:child_process";

const opts = { stdio: "inherit", shell: process.platform === "win32" };
const kids = [
  spawn("node", ["scripts/assets.mjs", "--watch"], opts),
  spawn("next", ["dev", ...process.argv.slice(2)], opts),
];
const stop = (code = 0) => {
  kids.forEach((k) => k.exitCode === null && k.kill());
  process.exit(code);
};
kids.forEach((k) => k.on("exit", (code) => stop(code ?? 0)));
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
