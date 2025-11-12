import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      // Allow serving files from parent directory (for dist/ access)
      allow: [".."],
    },
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      // Point w2l to the source lib directory (source of truth)
      w2l: resolve(__dirname, "../lib/index.ts"),
    },
  },
});
