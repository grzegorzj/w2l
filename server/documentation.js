import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the guides directory
const GUIDES_DIR = join(__dirname, "../guides");
const ROOT_DIR = join(__dirname, "..");

/**
 * Load all documentation guides
 * @returns {Object} Documentation object with all guides
 */
export function loadDocumentation() {
  try {
    const docs = {
      readme: readFileSync(join(ROOT_DIR, "README.md"), "utf-8"),
      guides: {
        overview: readFileSync(join(GUIDES_DIR, "README.md"), "utf-8"),
        architecture: readFileSync(
          join(GUIDES_DIR, "ARCHITECTURE.md"),
          "utf-8"
        ),
        conventions: readFileSync(join(GUIDES_DIR, "CONVENTIONS.md"), "utf-8"),
        positioning: readFileSync(join(GUIDES_DIR, "POSITIONING.md"), "utf-8"),
        intelligentAlignment: readFileSync(
          join(GUIDES_DIR, "INTELLIGENT-ALIGNMENT.md"),
          "utf-8"
        ),
      },
    };

    return docs;
  } catch (error) {
    console.error("Error loading documentation:", error);
    return {
      readme: "",
      guides: {},
    };
  }
}

/**
 * Get API examples from the playground
 * @returns {string} Concatenated examples
 */
export function getApiExamples() {
  const examplesDir = join(ROOT_DIR, "playground/examples");

  try {
    // Load a few key examples to show usage patterns
    const examples = [
      "01-basic-shapes.js",
      "03-positioning.js",
      "08-containers.js",
    ]
      .map((filename) => {
        try {
          const content = readFileSync(join(examplesDir, filename), "utf-8");
          return `// Example: ${filename}\n${content}`;
        } catch (e) {
          return "";
        }
      })
      .filter(Boolean);

    return examples.join("\n\n---\n\n");
  } catch (error) {
    console.error("Error loading examples:", error);
    return "";
  }
}

/**
 * Build the complete documentation context for the LLM
 * @returns {string} Formatted documentation string
 */
export function buildDocumentationContext() {
  const docs = loadDocumentation();
  const examples = getApiExamples();

  return `
# W2L Library Documentation

## Project Overview
${docs.readme}

## Key Guides

### Conventions (Coordinate Systems & Standards)
${docs.guides.conventions || "Not available"}

### Positioning System
${docs.guides.positioning || "Not available"}

### Intelligent Alignment
${docs.guides.intelligentAlignment || "Not available"}

## API Examples

${examples || "No examples available"}

## Important Notes
- All positions use a standard Cartesian coordinate system
- Elements can be positioned absolutely or relative to other elements
- The library handles all geometric calculations automatically
- Use TypeScript/JavaScript with ESM imports from "../lib"
- Do not export artboards, simply run artboard.render() to get the SVG string.
`;
}

/**
 * Build a condensed version for token efficiency
 * @returns {string} Condensed documentation
 */
export function buildCondensedContext() {
  const docs = loadDocumentation();

  return `
# W2L Library Quick Reference

## Some available Classes
- **Artboard**: Main canvas. Use \`new Artboard({ size: { width, height } })\`, then \`artboard.addElement(element)\`
- **Rectangle**: \`new Rectangle({ width, height, style: { fill, stroke, ... } })\`
- **Circle**: \`new Circle({ radius, style: { fill, ... } })\`
- **Triangle**: \`new Triangle({ a, b, c })\` for sides, or use vertices
- **Text**: \`new Text({ content, style: { fontSize, fontFamily, fill, ... } })\`
- **Container**: Invisible layout container. Use \`new Container({ size: { width, height }, padding })\`, then \`addElement(child)\`
- **GridLayout**: Auto-arranges children in grid. Use \`new GridLayout({ columns, rows, width, height, gap })\`
- **ColumnsLayout**: Creates column-based layout. Use \`new ColumnsLayout({ count, gutter, width, height })\`

## Common Patterns

### Basic Shape Creation
\`\`\`typescript
import { Artboard, Rectangle, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 }
});

const rect = new Rectangle({
  width: 200,
  height: 100,
  style: { fill: "blue" }
});

artboard.addElement(rect);
\`\`\`

### Positioning (Relative)
\`\`\`typescript
// Position element relative to another
element.position({
  relativeFrom: element.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Or use layouts for automatic arrangement
const grid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 600,
  height: 400,
  gap: 10
});
grid.addElement(rect1);
grid.addElement(rect2);
grid.addElement(rect3);
\`\`\`

### Styling
All shapes support styling via \`style\` property: \`{ fill, stroke, strokeWidth, opacity }\` and transforms via \`rotate()\`, \`translate()\` methods

### Final pattern
\`\`\`typescript
artboard.render(); // renders the artboard and all its elements

There can be multiple artboards if needed, you will need to render each of them (they render into separate SVG)
\`\`\`

## Key Conventions
${docs.guides.conventions ? docs.guides.conventions.substring(0, 2000) + "..." : "Use standard coordinate system with origin at top-left"}
`;
}
