---
title: Documentation Guide
category: Documentation
---

# W2L Documentation

Welcome to the W2L (Write to Layout) documentation!

These guides provide comprehensive information about W2L's architecture, conventions, and features.

## Available Guides

### [Architecture](./ARCHITECTURE.md)
System architecture, design decisions, and project structure. Read this to understand how W2L is built and why.

### [Conventions](./CONVENTIONS.md)
Mathematical conventions, coordinate systems, and coding standards. Essential for understanding how W2L interprets geometry and positioning.

### [Positioning System](./POSITIONING.md)
Complete guide to positioning, layouts, and child transformations. Learn how to position elements, use containers, work with column-based layouts, and create reactive connections between elements.

### [Advanced Layouts](./ADVANCED-LAYOUTS.md)
In-depth guide to SpreadLayout and GridLayout. Learn how to distribute elements with flexible spacing, create grids, and understand layout immutability principles.

### [Intelligent Alignment](./INTELLIGENT-ALIGNMENT.md)
How W2L's intelligent alignment system works. Understand how elements automatically choose appropriate alignment points for natural, intuitive layouts.

### [LaTeX Support](./LATEX-SUPPORT.md)
Complete guide to rendering LaTeX mathematical notation. Learn how to create standalone formulas, embed math in text, and query coordinates of formula parts for highlighting and positioning.

## Quick Start

If you're new to W2L, we recommend reading in this order:

1. [Main README](../README.md) - Project overview and setup
2. [Conventions](./CONVENTIONS.md) - Understand the basics
3. [Positioning System](./POSITIONING.md) - Learn positioning and layouts
4. [Advanced Layouts](./ADVANCED-LAYOUTS.md) - Master spread and grid layouts
5. [Intelligent Alignment](./INTELLIGENT-ALIGNMENT.md) - Master advanced alignment
6. [Architecture](./ARCHITECTURE.md) - Dive deeper into the system

## Finding What You Need

| I want to... | Read this |
|--------------|-----------|
| Understand design decisions | [Architecture](./ARCHITECTURE.md) |
| Learn coordinate systems | [Conventions](./CONVENTIONS.md) |
| Position elements and create layouts | [Positioning System](./POSITIONING.md) |
| Create spread or grid layouts | [Advanced Layouts](./ADVANCED-LAYOUTS.md) |
| Create lines that follow elements | [Reactive Positioning](./POSITIONING.md#reactive-positioning) |
| Align elements intelligently | [Intelligent Alignment](./INTELLIGENT-ALIGNMENT.md) |
| Render LaTeX and mathematical notation | [LaTeX Support](./LATEX-SUPPORT.md) |
| See working examples | [Playground Examples](../playground/examples/) |
| Look up API details | [API Documentation](../docs/index.html) (generated) |

## Examples

All working examples are in the playground:

```bash
cd playground
npm install
npm run dev
```

Key examples:
- `pythagorean-theorem.ts` - Classic geometry demonstration
- `columns-layout-example.ts` - Basic column layouts
- `intelligent-alignment-demo.ts` - Alignment showcase
- `columns-alignment-demo.ts` - Comprehensive alignment options
- `layout-transformation-test.ts` - Transformation and positioning
- `23-reactive-positioning.js` - Reactive line connections between elements
- `24-text-word-measurement.js` - Text measurement capabilities
- `25-text-word-highlighting.js` - Highlighting text words
- `26-column-absolute-positioning.js` - Testing column layout immutability
- `27-spread-layout-horizontal.js` - Horizontal spread layouts
- `28-spread-layout-vertical.js` - Vertical spread layouts
- `29-grid-layout.js` - Grid layout examples
- `30-layout-absolute-positioning.js` - Layout immutability demonstration

## Documentation Structure

```
guides/
├── README.md                      (This file)
├── ARCHITECTURE.md                (System design)
├── CONVENTIONS.md                 (Standards & conventions)
├── POSITIONING.md                 (Positioning & layouts)
├── ADVANCED-LAYOUTS.md            (Spread & Grid layouts)
├── INTELLIGENT-ALIGNMENT.md       (Alignment system)
└── LATEX-SUPPORT.md              (LaTeX mathematical notation)
```

The auto-generated API documentation lives in `docs/` and is built from inline TSDoc comments in the source code.

## Contributing

When adding documentation:

1. **Code documentation**: Add inline TSDoc comments (generates API docs automatically)
2. **Guides**: Add/update markdown files in this directory
3. **Examples**: Add working examples in `playground/examples/`

Keep documentation:
- **Clear**: Write for both humans and LLMs
- **Practical**: Include code examples
- **Current**: Update when code changes
- **Comprehensive**: Cover edge cases

## External Links

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [SVG Specification](https://www.w3.org/TR/SVG2/)
- [TypeDoc](https://typedoc.org/) - Used for API docs generation

---

For questions or issues, please visit the [GitHub repository](https://github.com/yourusername/w2l).

