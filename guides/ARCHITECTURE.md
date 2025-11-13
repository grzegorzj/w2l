---
title: Architecture
category: Documentation
---

# W2L Architecture

## Overview

W2L (Write to Layout) is a TypeScript library designed to enable Large Language Models (LLMs) to create structured visual compositions without dealing with low-level SVG geometry. This document describes the architectural decisions and project structure.

## Core Philosophy

### LLM-First Design

The library is specifically designed for LLM consumption. Key principles:

1. **Intuitive Naming**: Methods and parameters use natural language that LLMs can understand
2. **Self-Documenting**: Comprehensive inline TSDoc comments that LLMs can read alongside code
3. **Geometric Intelligence**: The library handles mathematical complexity, exposing only high-level concepts
4. **Relative Positioning**: Spatial relationships are expressed declaratively, not with absolute coordinates

### Documentation Strategy

All documentation lives within the TypeScript source files using TSDoc comments. This approach:

- Ensures documentation stays synchronized with code
- Allows LLMs to read implementation and documentation together
- Eliminates the need for separate markdown documentation files
- Enables automatic generation of professional HTML documentation via TypeDoc

## Project Structure

```
w2l/
├── lib/                    # Source code
│   ├── core/              # Core primitives (Artboard, Shape, Element)
│   ├── geometry/          # Geometric shapes (Triangle, Rectangle, Circle)
│   └── layout/            # Layout system (Container, ColumnsLayout)
├── guides/                # Long-form documentation
├── playground/            # Interactive development environment
├── dist/                  # Compiled JavaScript output
└── docs/                  # Generated API documentation
```

## Module Organization

### Core Module (`lib/core/`)

The foundation of the library, containing:

- **`Artboard`**: The canvas where all elements are placed
- **`Element`**: Abstract base class for all visual and layout elements
- **`Bounded`**: Elements with CSS-like box model (padding, margin)
- **`Shape`**: Visual elements that render to SVG
- **`Style`**: Type-safe CSS-in-JS styling system

Key architectural decisions:
- Separation of concerns between positioning and rendering
- Composition over inheritance where possible
- Type safety throughout the API

### Geometry Module (`lib/geometry/`)

Contains specific shape implementations:

- **`Rectangle`**: Rectangular shapes with corner styles
- **`Square`**: Convenience wrapper for equal-sided rectangles
- **`Circle`**: Circular shapes with radius-based sizing
- **`Triangle`**: Triangular shapes (right, equilateral, isosceles)
- **`Side`**: Line segments connecting two points

Each shape:
- Inherits from `Shape` (via `Bounded`)
- Implements its own SVG rendering logic
- Provides shape-specific properties and methods
- Supports full styling capabilities

### Layout Module (`lib/layout/`)

Advanced positioning and organization:

- **`Container`**: Invisible grouping element with padding
- **`Layout`**: Visible container with styling
- **`ColumnsLayout`**: Automatic multi-column layout system
- **`Column`**: Individual column within a `ColumnsLayout`
- **`ChildrenManager`**: Shared child management logic (composition)

Key features:
- Hierarchical transformation (parent moves → children move)
- Layout-bound vs. absolute positioning modes
- Intelligent alignment system
- Automatic column width calculation

## Design Patterns

### Composition over Inheritance

Example: `ChildrenManager` is used via composition rather than inheritance:

```typescript
class Container extends Bounded {
  private childrenManager: ChildrenManager;
  
  constructor(config: ContainerConfig) {
    super(config);
    this.childrenManager = new ChildrenManager();
  }
  
  addElement(element: Element): void {
    this.childrenManager.addChild(element);
  }
}
```

This avoids code duplication between `Container` and `Layout` classes.

### Builder Pattern (Implicit)

Configuration objects act as builders:

```typescript
const layout = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "900px",
  height: "500px",
  padding: "40px",
  horizontalAlign: "center"
});
```

### Factory Pattern (Shapes)

Shape constructors act as factories with type-specific configurations:

```typescript
const triangle = new Triangle({ type: "right", a: "300px", b: "400px" });
```

## Type System

### Units and Measurements

All measurements support string units:
- Pixels: `"100px"` (default)
- Percentages: `"50%"` (relative to parent)

Internal representation:
- Stored as numbers (parsed from strings)
- Converted back to strings for SVG output

### Point System

```typescript
interface Point {
  x: string; // e.g., "100px"
  y: string; // e.g., "200px"
}
```

Points are the foundation of positioning throughout the library.

### Style System

Leverages CSS type definitions from `csstype` package:

```typescript
interface Style {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  opacity?: number;
  // ... all CSS properties
}
```

Provides autocomplete and type safety for styling.

## Coordinate System

- Origin (0,0) at top-left
- X increases rightward
- Y increases downward
- Standard SVG coordinate system

Reference points (for all elements):
- `topLeft`, `topCenter`, `topRight`
- `centerLeft`, `center`, `centerRight`
- `bottomLeft`, `bottomCenter`, `bottomRight`

## Positioning Architecture

### Three Positioning Methods

1. **`position(x, y)`**: Absolute positioning
2. **`translate(dx, dy)`**: Relative movement
3. **`rotate(angle, pivot?)`**: Rotation transformation

### Positioning Hierarchy

Elements can be in two modes:

1. **Layout-Bound** (default when added to a layout)
   - Position relative to parent
   - Moves with parent transformations
   
2. **Absolute** (after calling `position()`)
   - Independent of parent
   - Breaks out of layout control

This is managed by `ChildrenManager` which tracks which children are in each mode.

## Intelligent Alignment

Elements implement `getAlignmentPoint()` method:

```typescript
getAlignmentPoint(
  horizontalAlign: "left" | "center" | "right",
  verticalAlign: "top" | "center" | "bottom"
): Point
```

**Base implementation** (`Element`): Returns center point

**Bounded implementation**: Returns appropriate edge/corner:
- Left align → left edge center
- Right align → right edge center
- Top align → top edge center
- Bottom align → bottom edge center
- Center align → geometric center

This creates intuitive alignment behavior in layouts without manual offset calculations.

## Rendering Pipeline

1. **Construction**: Element created with configuration
2. **Positioning**: Element positioned using `position()` or within layout
3. **Styling**: Styles applied (fill, stroke, etc.)
4. **Rendering**: `render()` method generates SVG string
5. **Composition**: Artboard collects all element SVG and wraps in `<svg>` tag

Each element is responsible for its own SVG generation via the `render()` method.

## Playground Architecture

Interactive development environment built with Vite:

- **Monaco Editor**: Full TypeScript support with autocomplete
- **Live Preview**: Real-time SVG rendering
- **Hot Reload**: Automatic updates on code changes
- **Example System**: Pre-built examples for learning

Key files:
- `playground/src/main.ts`: Main application logic
- `playground/examples/`: Example gallery
- `playground/public/w2l.d.ts`: Generated type definitions

## Testing Strategy

Currently:
- Manual testing via playground
- Visual regression testing (manual)

Future:
- Unit tests for geometric calculations
- Integration tests for layouts
- Snapshot tests for SVG output

## Build System

- **TypeScript Compiler**: Compiles to JavaScript
- **TypeDoc**: Generates API documentation
- **Vite**: Builds playground application
- **Concurrently**: Runs multiple dev servers

Development workflow:
```bash
npm run dev:all  # Runs lib, docs, and playground simultaneously
```

## Dependencies

**Runtime**:
- `csstype`: TypeScript definitions for CSS properties

**Development**:
- `typescript`: Language compiler
- `typedoc`: Documentation generator
- `concurrently`: Multi-process runner

Minimal dependency footprint keeps the library lightweight and maintainable.

## Future Architecture Considerations

### Planned Features
- Text elements with typography support
- Grid layout system
- Animation primitives
- Path/curve support
- Image embedding

### Potential Refactorings
- Plugin system for custom shapes
- Theme system for consistent styling
- Export formats beyond SVG (PNG, PDF)
- Server-side rendering optimization

## Architectural Principles

1. **Simplicity**: Prefer simple solutions over clever ones
2. **Type Safety**: Leverage TypeScript's type system fully
3. **Composability**: Elements should work together naturally
4. **LLM-Friendly**: Design for code generation by AI
5. **Performance**: Keep rendering fast and efficient
6. **Extensibility**: Easy to add new shapes and layouts

## See Also

- [Conventions](./CONVENTIONS.md) - Mathematical and coding conventions
- [Positioning System](./POSITIONING.md) - How positioning works
- [Intelligent Alignment](./INTELLIGENT-ALIGNMENT.md) - Alignment system details
