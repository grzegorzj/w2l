# W2L - Write to Layout

An imperative library for LLM-driven structured image generation.

## Overview

W2L is a TypeScript library designed to make it easy for Large Language Models (LLMs) to create structured visual compositions such as infographics, diagrams, graphs, and posters. Instead of struggling with low-level SVG geometry, LLMs can express visual intent using intuitive, high-level commands.

## Philosophy

When asked to "Create a visual representation of the Pythagorean Theorem," an LLM shouldn't try to write SVG directly (which often fails due to geometric complexity). Instead, it should:
1. Express *what* should appear on screen
2. Express *where* things should be positioned
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
├── example/               # Example usage
├── docs/                  # Generated documentation (from TypeDoc)
└── dist/                  # Compiled JavaScript output
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

All documentation is written inline within the TypeScript source files using TSDoc comments. This ensures:
- Documentation stays in sync with code
- LLMs can read both implementation and documentation together
- No separate markdown files to maintain
- Professional documentation is generated automatically via TypeDoc

## Key Concepts

### Artboard

The canvas where all visual elements are placed. Defines the coordinate system and boundaries.

```typescript
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "20px"
});
```

### Shapes

Visual elements that can be positioned, rotated, and transformed. All shapes inherit from the base `Shape` class.

```typescript
const triangle = new Triangle({
  type: "right",
  a: 300,
  b: 400
});
```

### Relative Positioning

Elements are positioned relative to other elements or reference points:

```typescript
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});
```

## Development

### Watch Mode

For continuous compilation during development:

```bash
npm run dev
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

## License

MIT

