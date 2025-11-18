# New Features - Complex Shapes & Components

This document summarizes the new features added to the W2L library as part of the complex shapes and components initiative.

## Overview

We've added three major capabilities:
1. **Image Component** - For embedding raster graphics (PNG, JPG, etc.)
2. **Bezier Curve Component** - For creating smooth curved paths
3. **Components Module** - A new module for composite shapes (starting with Arrow)

## 1. Image Component

The `Image` component allows you to embed raster graphics into your SVG compositions.

### Features
- Support for any image URL (relative, absolute, or data URLs)
- Configurable dimensions
- SVG filters and effects support
- Accessibility with alt text
- `preserveAspectRatio` control

### Usage

```typescript
import { Image } from 'w2l';

// Basic image
const photo = new Image({
  src: "./photo.jpg",
  width: 300,
  height: 200
});

// With filters and effects
const styledImage = new Image({
  src: "https://example.com/image.png",
  width: 400,
  height: 300,
  style: {
    opacity: 0.8,
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
  }
});

// Position like any other element
photo.position({
  relativeFrom: photo.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});
```

### Reference Points
Like other shapes, images support all 9 standard reference points:
- `topLeft`, `topCenter`, `topRight`
- `leftCenter`, `center`, `rightCenter`
- `bottomLeft`, `bottomCenter`, `bottomRight`

## 2. Bezier Curve Component

The `BezierCurve` component provides smooth, curved paths using quadratic or cubic bezier curves.

### Features
- Quadratic bezier curves (1 control point)
- Cubic bezier curves (2 control points)
- Point sampling along the curve with `pointAt(t)`
- Arc length calculation
- Automatic bounding box calculation

### Usage

```typescript
import { BezierCurve } from 'w2l';

// Quadratic bezier curve (1 control point)
const quadCurve = new BezierCurve({
  start: { x: "100px", y: "100px" },
  end: { x: "300px", y: "100px" },
  controlPoint1: { x: "200px", y: "50px" },
  style: {
    stroke: "#3498db",
    strokeWidth: 3,
    fill: "none"
  }
});

// Cubic bezier curve (2 control points)
const cubicCurve = new BezierCurve({
  start: { x: "100px", y: "100px" },
  end: { x: "400px", y: "100px" },
  controlPoint1: { x: "200px", y: "50px" },
  controlPoint2: { x: "300px", y: "150px" },
  style: {
    stroke: "#e74c3c",
    strokeWidth: 2,
    fill: "none"
  }
});

// Connect elements with smooth curves
const connectionCurve = new BezierCurve({
  start: circle1.rightCenter,
  end: circle2.leftCenter,
  controlPoint1: { x: 200, y: 100 },
  controlPoint2: { x: 400, y: 300 },
  style: {
    stroke: "#2ecc71",
    strokeWidth: 2,
    fill: "none"
  }
});
```

### Methods

```typescript
// Get a point at parameter t (0 to 1)
const midpoint = curve.pointAt(0.5);  // Get the midpoint

// Calculate arc length
const length = curve.getLength();  // Returns approximate length in pixels

// Sample points along the curve
for (let i = 0; i <= 10; i++) {
  const t = i / 10;
  const point = curve.pointAt(t);
  // Use point for positioning or visualization
}
```

## 3. Components Module

A new `/lib/components` folder has been created for composite components - elements built from multiple geometric primitives.

### Arrow Component

The first component is `Arrow`, which combines a line with arrowheads for directional indicators.

#### Features
- Triangle or line-style arrowheads
- Single or double-ended arrows
- Configurable arrowhead size
- Full styling support
- Uses SVG markers for proper rendering

#### Usage

```typescript
import { Arrow } from 'w2l';

// Basic arrow
const arrow = new Arrow({
  start: { x: "100px", y: "100px" },
  end: { x: "300px", y: "100px" },
  style: {
    stroke: "#3498db",
    strokeWidth: 2
  }
});

// Double-ended arrow
const bidirectional = new Arrow({
  start: circle1.center,
  end: circle2.center,
  doubleEnded: true,
  headSize: 12,
  style: {
    stroke: "#e74c3c",
    strokeWidth: 3
  }
});

// Line-style arrowhead
const lineArrow = new Arrow({
  start: { x: "100px", y: "200px" },
  end: { x: "400px", y: "200px" },
  headStyle: "line",
  headSize: 15,
  style: {
    stroke: "#2ecc71",
    strokeWidth: 2
  }
});

// Dashed arrow
const dashedArrow = new Arrow({
  start: box1.rightCenter,
  end: box2.leftCenter,
  headStyle: "triangle",
  headSize: 10,
  style: {
    stroke: "#9b59b6",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});
```

#### Properties

```typescript
// Access arrow properties
arrow.start      // Starting point
arrow.end        // Ending point
arrow.center     // Center point (midpoint)
arrow.length     // Length in pixels
```

#### Head Styles

- `"triangle"` - Filled triangle arrowhead (default)
- `"line"` - V-shaped line arrowhead
- `"none"` - No arrowhead (just a line)

## Image Backgrounds on Complex Shapes

While the library doesn't directly support image fills on shapes (like triangles), you can achieve this using SVG patterns:

```typescript
// Define a pattern in SVG <defs>:
const pattern = `
  <pattern id="imgPattern" patternUnits="userSpaceOnUse" 
           width="100" height="100">
    <image href="image.jpg" width="100" height="100"/>
  </pattern>
`;

// Use it in a shape:
const triangle = new Triangle({
  type: "equilateral",
  a: 100,
  style: {
    fill: "url(#imgPattern)",
    stroke: "#2c3e50",
    strokeWidth: 2
  }
});
```

The example file `28-image-backgrounds.js` demonstrates this technique.

## Examples

Two new example files have been created in the playground:

1. **`28-image-backgrounds.js`** - Demonstrates:
   - Using the Image component
   - Bezier curves (quadratic and cubic)
   - Connecting elements with curves
   - Pattern fills for complex shapes

2. **`29-arrows-and-components.js`** - Demonstrates:
   - All arrow styles and configurations
   - Connecting elements in flowcharts
   - Circular node arrangements
   - Annotations and labels

## File Structure

```
lib/
├── geometry/
│   ├── Image.ts           # New: Image component
│   ├── BezierCurve.ts     # New: Bezier curve component
│   └── index.ts           # Updated: exports new components
├── components/            # New: Composite components module
│   ├── Arrow.ts           # New: Arrow component
│   └── index.ts           # New: Module exports
└── index.ts               # Updated: exports components module

playground/
└── examples/
    ├── 28-image-backgrounds.js         # New: Image & Bezier examples
    └── 29-arrows-and-components.js     # New: Arrow examples
```

## API Exports

All new components are exported from the main library:

```typescript
import { 
  Image, 
  BezierCurve, 
  Arrow 
} from 'w2l';

// Types
import type { 
  ImageConfig, 
  BezierCurveConfig, 
  ArrowConfig,
  ArrowHeadStyle 
} from 'w2l';
```

## Design Philosophy

### Components vs Shapes

- **Shapes** (`lib/geometry/`) - Single geometric primitives (circles, rectangles, etc.)
- **Components** (`lib/components/`) - Composite elements built from multiple primitives

Components extend `Element` rather than `Shape` since they're composed of multiple parts. They still support all standard positioning and transformation methods.

### Future Components

The components module is designed to be extended with more composite shapes:
- Callouts (rectangle + arrow)
- Charts and graphs
- Icons and symbols
- Decorative elements
- Custom connectors

## TypeScript Support

All new components have full TypeScript support with:
- Complete type definitions
- JSDoc documentation
- IntelliSense support
- Type-safe configurations

The build process automatically generates types for the playground as well.

## Next Steps

Potential future enhancements:
1. More arrow styles (curved arrows using bezier curves)
2. Callout/annotation components
3. Chart components (bar charts, pie charts, etc.)
4. Icon library
5. Pattern/texture library for image fills
6. Advanced path operations

## Migration Notes

All changes are backwards compatible. Existing code will continue to work without modifications.

The new components are opt-in - import them only when needed.

