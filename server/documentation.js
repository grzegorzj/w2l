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
- **Artboard**: Main canvas. Use \`new Artboard()\`, then \`artboard.width()\`, \`artboard.height()\`, \`artboard.add(element)\`
- **Rectangle**: \`new Rectangle()\`, then \`width()\`, \`height()\`, \`fill()\`, \`stroke()\`, etc.
- **Circle**: \`new Circle()\`, then \`radius()\`, \`fill()\`, etc.
- **Triangle**: \`new Triangle()\`, then \`a()\`, \`b()\`, \`c()\` for sides, or use vertices
- **Text**: \`new Text()\`, then \`content()\`, \`fontSize()\`, \`fontFamily()\`, etc.
- **Container**: Layout container with \`new Container()\`, then use \`layout()\` with 'columns' and add children

## Common Patterns

### Basic Shape Creation
\`\`\`typescript
import { Artboard, Rectangle, Circle } from "w2l";

const artboard = new Artboard();
artboard.width(800).height(600);

const rect = new Rectangle();
rect.width(200).height(100).fill("blue");
artboard.add(rect);
\`\`\`

### Positioning (Relative)
\`\`\`typescript
// Position element relative to another
rect.x(100).y(100);  // Absolute positioning

// Or use containers for layout
const container = new Container();
container.layout("columns").columnCount(3).gap(10);
container.add(rect1, rect2, rect3);
\`\`\`

### Styling
All shapes support: \`fill()\`, \`stroke()\`, \`strokeWidth()\`, \`opacity()\`, \`rotate()\`, \`scale()\`

### Final pattern
\`\`\`typescript
artboard.render(); // renders the artboard and all its elements

There can be multiple artboards if needed, you will need to render each of them (they render into separate SVG)
\`\`\`

## Key Conventions
${docs.guides.conventions ? docs.guides.conventions.substring(0, 2000) + "..." : "Use standard coordinate system with origin at top-left"}
`;
}
