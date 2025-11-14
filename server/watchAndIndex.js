import { watch } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { buildIndex } from "./vectorIndex.js";
import { debounce } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");

const WATCH_PATHS = [
  join(ROOT_DIR, "guides"),
  join(ROOT_DIR, "playground/examples"),
  join(ROOT_DIR, "lib"),
  join(ROOT_DIR, "README.md"),
];

let isIndexing = false;

// Debounced reindex function
const reindexDebounced = debounce(async () => {
  if (isIndexing) {
    console.log("⏳ Indexing already in progress, skipping...");
    return;
  }

  try {
    isIndexing = true;
    console.log("\n🔄 Files changed, reindexing...");
    await buildIndex();
    console.log("✅ Reindexing complete\n");
  } catch (error) {
    console.error("❌ Error during reindexing:", error);
  } finally {
    isIndexing = false;
  }
}, 2000); // Wait 2 seconds after last change

console.log("👀 Watching for documentation changes...\n");

WATCH_PATHS.forEach((path) => {
  console.log(`  - ${path}`);
  
  try {
    watch(path, { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith(".md") || filename.endsWith(".ts") || filename.endsWith(".js"))) {
        console.log(`📝 Changed: ${filename}`);
        reindexDebounced();
      }
    });
  } catch (error) {
    console.error(`Warning: Could not watch ${path}:`, error.message);
  }
});

console.log("\n✨ Watcher started. Press Ctrl+C to stop.\n");

// Initial index
console.log("🔍 Building initial index...\n");
buildIndex().catch(console.error);

// Keep process alive
process.stdin.resume();

