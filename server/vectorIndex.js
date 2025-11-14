import OpenAI from "openai";
import { LocalIndex } from "vectra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INDEX_PATH = join(__dirname, ".vector-index");
const ROOT_DIR = join(__dirname, "..");
const HASH_FILE = join(__dirname, ".index-hashes.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Track which files have been indexed
let fileHashes = {};

// Load existing hashes
if (existsSync(HASH_FILE)) {
  try {
    fileHashes = JSON.parse(readFileSync(HASH_FILE, "utf-8"));
  } catch (e) {
    fileHashes = {};
  }
}

/**
 * Generate hash of file content
 */
function hashFile(content) {
  return createHash("md5").update(content).digest("hex");
}

/**
 * Check if file needs reindexing
 */
function needsReindex(filePath, content) {
  const hash = hashFile(content);
  const oldHash = fileHashes[filePath];
  return !oldHash || oldHash !== hash;
}

/**
 * Update file hash
 */
function updateHash(filePath, content) {
  fileHashes[filePath] = hashFile(content);
}

/**
 * Save hashes to disk
 */
function saveHashes() {
  mkdirSync(dirname(HASH_FILE), { recursive: true });
  writeFileSync(HASH_FILE, JSON.stringify(fileHashes, null, 2));
}

/**
 * Generate embeddings using OpenAI
 */
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    dimensions: 1536,
  });
  return response.data[0].embedding;
}

/**
 * Chunk text into smaller pieces for better search
 * Optimized for LLM context consumption
 */
function chunkText(text, maxChunkSize = 2000, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start += maxChunkSize - overlap;
  }

  return chunks;
}

/**
 * Get all files recursively
 */
function getFilesRecursively(dir, fileList = [], extensions = []) {
  const files = readdirSync(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, .git, etc.
      if (
        !file.startsWith(".") &&
        file !== "node_modules" &&
        file !== "dist" &&
        file !== "docs"
      ) {
        getFilesRecursively(filePath, fileList, extensions);
      }
    } else {
      const ext = file.split(".").pop();
      if (extensions.length === 0 || extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Index a single file
 */
async function indexFile(index, filePath, type) {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Check if file needs reindexing
    if (!needsReindex(filePath, content)) {
      console.log(`⏭️  Skipping ${filePath} (unchanged)`);
      return 0;
    }

    const relativePath = filePath.replace(ROOT_DIR, "").replace(/^\//, "");

    // Chunk the content (using default smaller sizes)
    const chunks = chunkText(content);
    let indexed = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Skip very small chunks
      if (chunk.trim().length < 50) continue;

      // Add context about what this is
      const contextualChunk = `File: ${relativePath}\nType: ${type}\n\n${chunk}`;

      // Generate embedding
      const embedding = await generateEmbedding(contextualChunk);

      // Add to index with unique ID
      const itemId = `${relativePath}#chunk${i}`;
      await index.upsertItem({
        id: itemId,
        vector: embedding,
        metadata: {
          text: chunk,
          source: relativePath,
          type: type,
          chunkIndex: i,
          totalChunks: chunks.length,
        },
      });

      indexed++;
    }

    updateHash(filePath, content);
    console.log(`✅ Indexed ${relativePath} (${indexed} chunks)`);
    return indexed;
  } catch (error) {
    console.error(`Error indexing ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Main indexing function
 */
async function buildIndex() {
  console.log("🔍 Starting vector index build...\n");

  const index = new LocalIndex(INDEX_PATH);

  // Create index if it doesn't exist
  if (!await index.isIndexCreated()) {
    await index.createIndex();
    console.log("📦 Created new vector index\n");
  } else {
    console.log("📦 Using existing vector index\n");
  }

  let totalIndexed = 0;

  // 1. Index guides
  console.log("📚 Indexing guides...");
  const guidesDir = join(ROOT_DIR, "guides");
  const guideFiles = getFilesRecursively(guidesDir, [], ["md"]);
  for (const file of guideFiles) {
    totalIndexed += await indexFile(index, file, "guide");
  }

  // 2. Index examples
  console.log("\n📝 Indexing examples...");
  const examplesDir = join(ROOT_DIR, "playground/examples");
  const exampleFiles = getFilesRecursively(examplesDir, [], ["js", "ts"]);
  for (const file of exampleFiles) {
    totalIndexed += await indexFile(index, file, "example");
  }

  // 3. Index source code
  console.log("\n💻 Indexing source code...");
  const libDir = join(ROOT_DIR, "lib");
  const sourceFiles = getFilesRecursively(libDir, [], ["ts"]);
  for (const file of sourceFiles) {
    totalIndexed += await indexFile(index, file, "source");
  }

  // 4. Index main README
  console.log("\n📄 Indexing README...");
  const readmePath = join(ROOT_DIR, "README.md");
  totalIndexed += await indexFile(index, readmePath, "readme");

  // Save hashes
  saveHashes();

  console.log(`\n✨ Indexing complete! Indexed ${totalIndexed} chunks total.`);
  console.log(`📊 Vector index saved to: ${INDEX_PATH}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildIndex()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { buildIndex };

