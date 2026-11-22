import type { NextConfig } from "next";

// Static export: the site is plain files that any static host can serve.
// See docs/plan/DEVELOPMENT_PLAN.md §6.2.
const nextConfig: NextConfig = {
  output: "export",
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
