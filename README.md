# W2L - Write to Layout

An imperative library for LLM-driven structured image generation.

## Overview

W2L is a TypeScript library designed to make it easy for Large Language Models (LLMs) to create structured visual compositions such as infographics, diagrams, graphs, and posters. Instead of struggling with low-level SVG geometry, LLMs can express visual intent using intuitive, high-level commands.

## 🚀 Quick Start - AI-Powered Playground

The fastest way to experience W2L is with the AI-powered playground:

```bash
./start-playground.sh
```

This starts:

- **Agent Server** (port 3100) - Cerebras-powered code generation with tool calling
- **Playground UI** (port 3000) - Interactive editor with chat interface

Then open `http://localhost:3000` and chat with the AI assistant to generate visualizations!

**Requirements:**

- Cerebras API key: `echo 'CEREBRAS_API_KEY=your-key' > .env`

## Philosophy

When asked to "Create a visual representation of the Pythagorean Theorem," an LLM shouldn't try to write SVG directly (which often fails due to geometric complexity). Instead, it should:

1. Express _what_ should appear on screen
2. Express _where_ things should be positioned
3. Let the library handle the mathematics

## Project Structure

```
w2l/
├── lib/                    # Library source code
│   ├── core/              # Core entities (Artboard, Shape base class)
│   │   ├── Artboard.ts    # Main canvas for visual composition
│   │   ├── Shape.ts       # Base class for all shapes
│   │   └── index.ts       # Core module exports
│   ├── geometry/          # Geometric shapes (Triangle, Square, etc.)
│   │   ├── Triangle.ts    # Triangle implementation
│   │   └── index.ts       # Geometry module exports
│   └── index.ts           # Main library entry point
├── playground/            # Interactive development environment
│   ├── examples/         # Example files for testing
│   ├── src/             # Playground source code
│   └── index.html       # Playground HTML
├── example/               # Example usage
├── docs/                  # Generated documentation (from TypeDoc)
├── dist/                  # Compiled JavaScript output
└── DEV_GUIDE.md          # Development workflow guide
```

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Building the Library

Compile the TypeScript library:

```bash
npm run build
```

Generate documentation from inline TSDoc comments:

```bash
npm run build:docs
```

The documentation will be generated in the `docs/` directory and can be opened in a browser.

### Running the Example

The example demonstrates how external projects can use the library:

```bash
cd example
npm install
npm start
```

## Documentation

### Comprehensive Guides

For detailed documentation, see:

- [Architecture](./guides/ARCHITECTURE.md) - System architecture and design decisions
- [Conventions](./guides/CONVENTIONS.md) - Mathematical conventions, coordinate systems, and standards
- [Positioning System](./guides/POSITIONING.md) - Complete guide to positioning and layouts
- [Intelligent Alignment](./guides/INTELLIGENT-ALIGNMENT.md) - How intelligent alignment works

### API Documentation

All code documentation is written inline within the TypeScript source files using TSDoc comments. This ensures:

- Documentation stays in sync with code
- LLMs can read both implementation and documentation together
- No separate markdown files to maintain
- Professional API documentation is generated automatically via TypeDoc in the `/docs` directory

## Key Concepts

### Artboard

The canvas where all visual elements are placed. Defines the coordinate system and boundaries.

```typescript
const artboard = new Artboard({
  size: { width: "800px", height: "600px" },
  padding: "20px",
});
```

### Shapes

Visual elements that can be positioned, rotated, and transformed. All shapes inherit from the base `Shape` class.

```typescript
const triangle = new Triangle({
  type: "right",
  a: "300px",
  b: "400px",
});
```

### Relative Positioning

Elements are positioned relative to other elements or reference points:

```typescript
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px",
});
```

### Reactive Positioning

Lines automatically maintain connections to elements, even when those elements move:

```typescript
// Create a line between two rectangles
const connector = new Line({
  start: rect1.center,
  end: rect2.center
});

// Move rect1 - the line automatically follows! ✨
rect1.position({ ... });
```

Perfect for creating dynamic diagrams, flowcharts, and network graphs. See [Positioning Guide](./guides/POSITIONING.md#reactive-positioning) for details.

### Units Support

All dimensions support CSS-style units or plain numbers (treated as pixels):

```typescript
// Using pixel units (recommended)
size: { width: "800px", height: "600px" }

// Using rem units
size: { width: "50rem", height: "37.5rem" }

// Using plain numbers (treated as pixels)
size: { width: 800, height: 600 }
```

## Development

### Interactive Playground

W2L includes an interactive playground for testing and development.

**For AI-powered development** (recommended):

```bash
./start-all.sh
```

This starts the complete stack with AI assistant:

- Agent Server (Cerebras + tool calling)
- Playground Server (conversation management)
- Playground UI with chat interface at `http://localhost:3000`

**For manual development** (library dev only):

```bash
npm run dev:all
```

This starts development watchers:

- Library compilation with hot reload
- Documentation generation
- Interactive playground at `http://localhost:5173`

The playground features:

- **AI Chat Assistant** - Natural language code generation (with agent server)
- **Monaco Editor** - VS Code's editor with TypeScript support
- **Live SVG Rendering** - Real-time preview with zoom and pan
- **File Loading** - Load `.ts` and `.js` files
- **Example Library** - Pre-built examples in `playground/examples/`
- **Conversation History** - Persistent chat and code sessions

For more detailed development information, see [DEV_GUIDE.md](./DEV_GUIDE.md) and [AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md).

### Watch Mode (Individual Components)

You can also run watchers individually:

```bash
# Watch library only
npm run dev

# Watch documentation only
npm run dev:docs

# Run playground only
npm run dev:playground
```

### Type Checking

TypeScript provides full type safety and IntelliSense support:

```typescript
// TypeScript will catch errors and provide autocomplete
const artboard = new Artboard({
  size: { width: 800, height: 600 }, // ✓ Type-safe
  // padding: 123 // ✗ Type error: must be string
});
```

## Architecture

### Core Module (`lib/core/`)

Contains fundamental entities:

- **Artboard**: Main canvas with coordinate system
- **Shape**: Abstract base class providing positioning, rotation, and translation
- **Type definitions**: Point, Size, PositionReference, etc.

### Geometry Module (`lib/geometry/`)

Contains geometric primitives:

- **Triangle**: Triangular shapes with various configurations
- More shapes to be added: Square, Circle, Rectangle, Polygon, etc.

### Future Modules

Planned modules include:

- **Text**: Text elements with layout and typography
- **Containers**: Layout containers (rows, columns, grids)
- **Icons**: Pre-built icon shapes
- **Paths**: Bezier curves and custom paths

## Design Principles

1. **LLM-First API**: Methods and parameters are named intuitively for natural language understanding
2. **Self-Documenting**: Comprehensive inline documentation using TSDoc
3. **Type-Safe**: Full TypeScript support with detailed type definitions
4. **Minimal Configuration**: Sensible defaults with optional customization
5. **Geometric Intelligence**: Automatic calculation of centers, normals, and other geometric properties

## Testing

W2L uses snapshot testing to ensure visual consistency across builds. Tests are located in `playground/examples/tests/` and automatically run after each build.

```bash
# Run tests interactively
npm test

# Run tests in watch mode
npm run test:watch

# Run tests non-interactively (for CI)
npm run test:ci

# Manage snapshots
node tests/manage-snapshots.js status
node tests/manage-snapshots.js reset
```

For detailed information about the testing system, see [SNAPSHOT-TESTING.md](SNAPSHOT-TESTING.md).

## License

MIT
