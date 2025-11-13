import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      // Point w2l to the compiled dist directory for runtime execution
      w2l: resolve(__dirname, "../dist/index.js"),
    },
  },
});
