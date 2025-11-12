# W2L Architecture

## Overview

W2L (Write to Layout) is a TypeScript library designed to enable Large Language Models (LLMs) to create structured visual compositions without dealing with low-level SVG geometry. This document describes the architectural decisions and project structure.

**See also**: [CONVENTIONS.md](./CONVENTIONS.md) for mathematical conventions, coordinate systems, and polygon winding order standards.

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
├── lib/                    # Library source code
│   ├── core/              # Core entities
│   │   ├── Artboard.ts    # Main canvas class
│   │   ├── Shape.ts       # Base shape class
│   │   └── index.ts       # Module exports
│   ├── geometry/          # Geometric shapes
│   │   ├── Triangle.ts    # Triangle implementation
│   │   └── index.ts       # Module exports
│   └── index.ts           # Main entry point
├── dist/                  # Compiled JavaScript (ES modules)
├── docs/                  # Generated TypeDoc documentation
├── example/               # Example usage
└── config files
```

## Module Architecture

### Core Module (`lib/core/`)

**Purpose**: Provides fundamental building blocks for all visual compositions.

**Components**:

- **Artboard**: The canvas where all elements are placed

  - Manages coordinate system
  - Provides sizing (fixed or auto)
  - Exposes reference points (e.g., center) for positioning

- **Shape**: Abstract base class for all visual elements
  - Implements positioning system
  - Provides rotation and translation
  - Enforces consistent API across all shapes

**Key Interfaces**:

- `Point`: 2D coordinate representation
- `Size`: Dimension specification
- `PositionReference`: Relative positioning configuration
- `RotateConfig`: Rotation specification
- `TranslateConfig`: Translation/movement specification

### Geometry Module (`lib/geometry/`)

**Purpose**: Provides geometric shape primitives that can be positioned and composed.

**Components**:

- **Triangle**: Comprehensive triangle implementation
  - Supports multiple types (right, equilateral, isosceles, scalene)
  - Automatic calculation of sides with geometric properties
  - Provides outward normals for adjacent positioning

**Design Pattern**:
Each shape:

1. Extends the `Shape` base class
2. Implements required abstract methods (`center`, `render`)
3. Provides shape-specific properties (e.g., `Triangle.sides`)
4. Uses comprehensive TSDoc documentation

## Type System

### ES Modules

The library uses ES modules (`type: "module"` in package.json) with explicit `.js` extensions in imports. This ensures:

- Native Node.js compatibility
- Proper browser module support
- Clear module boundaries

### TypeScript Configuration

```json
{
  "target": "ES2020", // Modern JavaScript features
  "module": "ESNext", // Latest module system
  "moduleResolution": "bundler", // Flexible resolution
  "strict": true // Maximum type safety
}
```

## API Design Patterns

### Relative Positioning

Instead of absolute coordinates, elements are positioned relative to other elements:

```typescript
shape.position({
  relativeFrom: shape.center, // Point on this shape
  relativeTo: artboard.center, // Target point
  x: 0, // X offset
  y: 0, // Y offset
});
```

This approach:

- Is more intuitive for spatial reasoning
- Allows layouts to adapt to content changes
- Reduces the need for manual coordinate calculations

### Geometric Intelligence

Shapes automatically calculate and expose geometric properties:

```typescript
const triangle = new Triangle({ type: "right", a: 3, b: 4 });

// Automatically provides:
triangle.center; // Geometric centroid
triangle.sides; // Array of sides with properties
triangle.sides[0].center; // Center of each side
triangle.sides[0].outwardNormal; // Normal vector for positioning
```

### Transformation Pipeline

Shapes support a fluent transformation API:

```typescript
shape
  .position({ ... })   // Set initial position
  .rotate({ ... })     // Apply rotation
  .translate({ ... }); // Apply translation
```

## Documentation Generation

### TSDoc to HTML

The project uses TypeDoc to generate professional documentation from inline comments:

```bash
npm run build:docs
```

This creates:

- Searchable HTML documentation
- API reference with examples
- Type hierarchies
- Cross-referenced links

### Documentation Structure

Each documented element includes:

- **Description**: What it does
- **Remarks**: Additional context and behavior notes
- **Examples**: Code samples showing usage
- **Parameters**: Detailed parameter documentation
- **Returns**: Return value documentation

## Build System

### Compilation

TypeScript compiles to JavaScript with:

- Declaration files (`.d.ts`) for type information
- Source maps for debugging
- ES module output

### Distribution

The library is distributed as:

- ES modules in `dist/`
- TypeScript declaration files for type checking
- Source maps for debugging

### Local Development

The example project uses the library via `file:..` dependency, allowing:

- Real-time testing during development
- Verification of the public API
- Example code that serves as documentation

## Extensibility

### Adding New Shapes

To add a new shape:

1. Create a new file in `lib/geometry/` (e.g., `Square.ts`)
2. Extend the `Shape` base class
3. Implement required methods (`center`, `render`)
4. Add comprehensive TSDoc documentation
5. Export from `lib/geometry/index.ts`
6. Re-export from `lib/index.ts`

### Adding New Modules

Future modules might include:

- **text/**: Text elements with typography
- **containers/**: Layout containers (flex, grid)
- **paths/**: Bezier curves and custom paths
- **icons/**: Pre-built icon shapes

## Testing Strategy

The example project serves as:

- Integration test
- API demonstration
- Documentation by example

Future testing could include:

- Unit tests for geometric calculations
- Visual regression tests for rendering
- API contract tests

## Performance Considerations

### Lazy Calculation

Geometric properties are calculated on-demand where possible:

- Centers are computed when accessed
- Sides are generated when needed
- Transformations are accumulated and applied at render time

### Memory Efficiency

The library prioritizes simplicity over optimization:

- Small object graphs
- No heavy dependencies
- Minimal runtime overhead

## Future Architecture Considerations

### Rendering Backends

Currently, shapes implement their own SVG rendering. Future versions might:

- Abstract rendering to a backend interface
- Support multiple output formats (SVG, Canvas, WebGL)
- Provide render optimization

### Layout Engine

Future versions might include:

- Constraint-based layout
- Automatic spacing and alignment
- Grid and flexbox-like containers

### Interactivity

Potential additions:

- Event handling
- Animation support
- State management

## Conclusion

This architecture prioritizes:

- **LLM Usability**: Easy for AI to understand and use
- **Type Safety**: Full TypeScript support
- **Self-Documentation**: Comprehensive inline documentation
- **Extensibility**: Easy to add new shapes and features
- **Simplicity**: Minimal configuration and setup
