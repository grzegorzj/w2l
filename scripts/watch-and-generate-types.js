#!/usr/bin/env node

/**
 * Watches the dist/ directory and regenerates playground types on changes.
 * This allows the playground to get instant type updates during development.
 */

import { watch } from "fs";
import { exec } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");

let timeout;
let isGenerating = false;

function generateTypes() {
  if (isGenerating) return;

  isGenerating = true;
  console.log("\n🔄 Regenerating playground types...");

  exec(
    "node scripts/generate-playground-types.js",
    { cwd: projectRoot },
    (error, stdout, stderr) => {
      isGenerating = false;

      if (error) {
        console.error("❌ Error generating types:", error.message);
        return;
      }

      if (stderr) {
        console.error(stderr);
      }

      if (stdout) {
        console.log(stdout.trim());
      }
    }
  );
}

console.log("👀 Watching dist/ for changes...");

// Watch the dist directory for changes
watch(distDir, { recursive: true }, (eventType, filename) => {
  // Only regenerate for .d.ts files
  if (filename && filename.endsWith(".d.ts")) {
    // Debounce rapid file changes
    clearTimeout(timeout);
    timeout = setTimeout(generateTypes, 100);
  }
});

// Generate types on initial start
generateTypes();
