import type { NextConfig } from "next";

// Static export: the site is plain files that any static host can serve.
// See docs/plan/DEVELOPMENT_PLAN.md §6.2.
// Recipe sheets (src/app/receta/[slug]/page.sheet.tsx) are the paid downloadables, so they are never part of
// the public build: only "npm run sheets" (SHEETS=1) turns them on, locally, to print them as PDF files.
const sheets = process.env.SHEETS === "1";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: sheets ? ["sheet.tsx", "tsx", "ts"] : ["tsx", "ts"],
  ...(sheets ? { distDir: ".next-sheets" } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
