/**
 * Tool implementations for the agent
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_PATH = path.join(__dirname, "generated");
const GUIDES_PATH = path.join(__dirname, "guides");

/**
 * Load generated documentation
 */
function loadDocs() {
  const elementsPath = path.join(GENERATED_PATH, "elements.json");
  const guidesPath = path.join(GENERATED_PATH, "guides.json");

  if (!fs.existsSync(elementsPath) || !fs.existsSync(guidesPath)) {
    throw new Error('Documentation not built. Run "npm run build" first.');
  }

  return {
    elements: JSON.parse(fs.readFileSync(elementsPath, "utf-8")),
    guides: JSON.parse(fs.readFileSync(guidesPath, "utf-8")),
  };
}

/**
 * Tool: Get guides
 * Returns the full content of requested guides
 */
export function getGuides(guideIds) {
  const docs = loadDocs();
  const results = [];

  for (const id of guideIds) {
    const guide = docs.guides.find((g) => g.id === id);
    if (!guide) {
      results.push({
        id,
        error: "Guide not found",
        available: docs.guides.map((g) => g.id),
      });
      continue;
    }

    // Load full guide content
    const guidePath = path.join(GUIDES_PATH, guide.filePath);
    const content = fs.readFileSync(guidePath, "utf-8");

    results.push({
      id,
      title: guide.title,
      content,
    });
  }

  return results;
}

/**
 * Tool: Get elements
 * Returns detailed API documentation for requested elements
 */
export function getElements(elementNames) {
  const docs = loadDocs();
  const results = [];

  for (const name of elementNames) {
    const element = docs.elements.find((el) => el.name === name);
    if (!element) {
      results.push({
        name,
        error: "Element not found",
        available: docs.elements.map((el) => el.name),
      });
      continue;
    }

    // Format element documentation
    results.push({
      name: element.name,
      category: element.category,
      description: element.description,
      config: element.configName,
      properties: element.properties.map((p) => ({
        name: p.name,
        type: p.type,
        required: !p.optional,
      })),
    });
  }

  return results;
}

/**
 * Get available guides summary for agent context
 */
export function getAvailableGuides() {
  const docs = loadDocs();
  return docs.guides.map((g) => ({
    id: g.id,
    title: g.title,
    overview: g.overview,
    whenToUse: g.whenToUse,
  }));
}

/**
 * Get available elements summary for agent context
 */
export function getAvailableElements() {
  const docs = loadDocs();
  return docs.elements.map((el) => ({
    name: el.name,
    category: el.category,
    description: el.description,
  }));
}

/**
 * Define tool schemas for Cerebras/OpenAI compatibility
 */
export const toolSchemas = [
  {
    type: "function",
    function: {
      name: "get_guides",
      description:
        "Retrieve detailed guides for specific topics. Use this to understand how to approach different types of SVG generation tasks.",
      parameters: {
        type: "object",
        properties: {
          guides: {
            type: "array",
            items: { type: "string" },
            description:
              'Array of guide IDs to retrieve (e.g., ["basic-shapes", "layouts"])',
          },
        },
        required: ["guides"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_elements",
      description:
        "Retrieve detailed API documentation for specific elements. Use this after reading guides to get exact configuration details for elements you plan to use.",
      parameters: {
        type: "object",
        properties: {
          elements: {
            type: "array",
            items: { type: "string" },
            description:
              'Array of element names to retrieve documentation for (e.g., ["Circle", "Rect", "Text"])',
          },
        },
        required: ["elements"],
      },
    },
  },
];

/**
 * Execute a tool call
 */
export function executeTool(toolName, args) {
  switch (toolName) {
    case "get_guides":
      return getGuides(args.guides || []);
    case "get_elements":
      return getElements(args.elements || []);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
