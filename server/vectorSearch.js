import OpenAI from "openai";
import { LocalIndex } from "vectra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INDEX_PATH = join(__dirname, ".vector-index");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize vector index
let index = null;

/**
 * Initialize the vector index
 * @returns {Promise<LocalIndex>}
 */
async function initializeIndex() {
  if (index) return index;

  try {
    index = new LocalIndex(INDEX_PATH);

    // Check if index exists, if not it will be created on first add
    if (!existsSync(INDEX_PATH)) {
      console.log("Vector index not found. Run 'npm run index' to create it.");
    } else {
      // Begin index operations
      if (!await index.isIndexCreated()) {
        await index.createIndex();
      }
      console.log("✅ Vector index loaded successfully");
    }

    return index;
  } catch (error) {
    console.error("Error initializing vector index:", error);
    // Create new index if loading fails
    index = new LocalIndex(INDEX_PATH);
    await index.createIndex();
    return index;
  }
}

/**
 * Generate embeddings using OpenAI
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large", // Latest and highest quality
      input: text,
      dimensions: 1536, // Can be reduced for performance (256, 512, 1024, 1536)
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Search the vector database
 * @param {string} query - Search query
 * @param {number} topK - Number of results to return (default: 10 for better context)
 * @returns {Promise<Array>} Search results
 */
export async function searchDocumentation(query, topK = 10) {
  try {
    const idx = await initializeIndex();

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search the index
    const results = await idx.queryItems(queryEmbedding, topK);

    if (!results || results.length === 0) {
      return [];
    }

    // Format results with metadata
    return results.map((result) => ({
      content: result.item.metadata.text,
      source: result.item.metadata.source,
      type: result.item.metadata.type,
      score: result.score,
    }));
  } catch (error) {
    console.error("Error searching documentation:", error);
    return [];
  }
}

/**
 * Tool definition for OpenAI Chat Completions API
 */
export const searchDocumentationTool = {
  type: "function",
  function: {
    name: "search_documentation",
    description:
      "Search the w2l library documentation, source code, and examples using semantic search. Use this when you need to look up specific API details, understand how a feature works, or find usage examples.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "The search query. Be specific about what you're looking for, e.g. 'How to create a triangle' or 'Container layout API' or 'positioning elements example'",
        },
      topK: {
        type: "number",
        description: "Number of results to return (default: 10, max: 10 for ~20KB output)",
        default: 10,
      },
      },
      required: ["query"],
    },
  },
};

/**
 * Tool definition for OpenAI Responses API (flatter structure)
 */
export const searchDocumentationToolResponses = {
  type: "function",
  name: "search_documentation",
  description:
    "Search the w2l library documentation, source code, and examples using semantic search. Use this when you need to look up specific API details, understand how a feature works, or find usage examples.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          "The search query. Be specific about what you're looking for, e.g. 'How to create a triangle' or 'Container layout API' or 'positioning elements example'",
      },
      topK: {
        type: "number",
        description: "Number of results to return (default: 10, max: 10 for ~20KB output)",
        default: 10,
      },
    },
    required: ["query"],
  },
};

/**
 * Handle tool call from OpenAI
 * @param {Object} toolCall - The tool call from OpenAI
 * @returns {Promise<string>} Formatted results
 */
export async function handleSearchTool(toolCall) {
  const args = JSON.parse(toolCall.function.arguments);
  console.log("🔍 Tool called with arguments:", args);
  
  const { query, topK = 10 } = args;
  const limitedTopK = Math.min(topK, 10);
  
  console.log(`🔍 Searching with topK=${limitedTopK} (requested: ${topK})`);

  // Limit to max 10 results to keep total output ~20KB
  let results = await searchDocumentation(query, limitedTopK);
  
  // ENFORCE the limit even if vectra returns more
  if (results.length > 10) {
    console.log(`⚠️ Got ${results.length} results, truncating to 10`);
    results = results.slice(0, 10);
  }

  console.log(`📊 Search returned ${results.length} results, sizes:`, 
    results.map(r => r.content.length));

  if (results.length === 0) {
    return "No relevant documentation found. Try a different search query.";
  }

  // Format results for the LLM with reasonable size limits
  const MAX_CHUNK_SIZE = 2000; // 2KB per chunk for good context
  const formatted = results
    .map((result, idx) => {
      // Truncate content if too long
      let content = result.content;
      const originalLength = content.length;
      if (content.length > MAX_CHUNK_SIZE) {
        content = content.substring(0, MAX_CHUNK_SIZE) + "\n... (truncated)";
      }
      
      console.log(`  Result ${idx + 1}: ${originalLength} -> ${content.length} chars`);
      
      return `
## Result ${idx + 1}: ${result.source}
Type: ${result.type} | Score: ${result.score.toFixed(2)}

${content}
---`;
    })
    .join("\n");

  const finalResult = `Found ${results.length} relevant documentation entries:\n${formatted}`;
  console.log(`📤 Final search result length: ${finalResult.length} chars`);
  
  return finalResult;
}

// Initialize index on module load
initializeIndex().catch(console.error);

