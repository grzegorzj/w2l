# Positioning Enhancements Summary

This document summarizes the positioning and geometric property enhancements added to the W2L library.

## Overview

The library has been extended with comprehensive point exposure and geometric constructs, making it easier to create complex geometric visualizations and diagrams.

## New Features

### 1. Line Primitive

**File**: `lib/geometry/Line.ts`

A new `Line` class that connects two points in space.

**Properties**:
- `start`: Starting point of the line
- `end`: Ending point of the line
- `center`: Midpoint of the line
- `length`: Euclidean distance between points
- `angle`: Angle of the line in degrees
- `direction`: Normalized direction vector
- `perpendicular`: Perpendicular (normal) vector to the line

**Usage Example**:
```typescript
const line = new Line({
  start: circle1.center,
  end: circle2.center,
  style: {
    stroke: "#3498db",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});
```

### 2. Rectangle Diagonals

**File**: `lib/geometry/Rectangle.ts`

Added diagonal properties to Rectangle with full geometric information.

**New Properties**:
- `diagonal`: Primary diagonal (top-left to bottom-right)
- `antiDiagonal`: Secondary diagonal (top-right to bottom-left)

Each diagonal returns:
- `start`: Starting point
- `end`: Ending point
- `center`: Center point (same as rectangle center)
- `length`: Diagonal length
- `outwardNormal`: Perpendicular vector pointing away from center
- `inwardNormal`: Perpendicular vector pointing toward center

**Usage Example**:
```typescript
const rect = new Rectangle({ width: 200, height: 100 });

// Draw the diagonal
const diagLine = new Line({
  start: rect.diagonal.start,
  end: rect.diagonal.end,
  style: { stroke: "#e74c3c", strokeWidth: 2 }
});

// Position element along diagonal normal
element.translate({
  along: rect.diagonal.outwardNormal,
  distance: 50
});
```

### 3. Triangle Altitudes

**File**: `lib/geometry/Triangle.ts`

Added `altitudes` property to Triangle that returns all three altitudes.

**Property**:
- `altitudes`: Array of three altitude objects, one from each vertex

Each altitude object contains:
- `vertex`: The vertex point where the altitude originates
- `foot`: The foot point where the altitude meets the opposite side
- `length`: Length of the altitude
- `side`: The opposite side that the altitude is perpendicular to

**Terminology Note**: "Altitude" is the correct geometric term for the perpendicular line segment from a vertex to the opposite side, more precise than "height" which can refer to vertical dimension.

**Usage Example**:
```typescript
const triangle = new Triangle({ type: "right", a: 300, b: 400 });

triangle.altitudes.forEach((altitude) => {
  const altitudeLine = new Line({
    start: altitude.vertex,
    end: altitude.foot,
    style: {
      stroke: "#3498db",
      strokeWidth: 2,
      strokeDasharray: "5,5"
    }
  });
  artboard.addElement(altitudeLine);
});
```

### 4. Square Diagonal Length

**File**: `lib/geometry/Square.ts`

Updated Square to avoid property conflict with Rectangle.

**Changed Property**:
- `diagonal` → `diagonalLength`: Returns the numeric length of the diagonal (side × √2)
- Inherits `diagonal` and `antiDiagonal` objects from Rectangle for full geometric information

## Existing Point Exposure

All shapes already expose comprehensive point systems:

### Rectangle Points
- **Corners**: `topLeft`, `topRight`, `bottomLeft`, `bottomRight`
- **Edge Centers**: `topCenter`, `bottomCenter`, `leftCenter`, `rightCenter`
- **Center**: `center`
- **Sides**: Array of 4 side objects with `start`, `end`, `center`, `outwardNormal`, `inwardNormal`

### Circle Points
- **Cardinal Points**: `top`, `bottom`, `left`, `right`
- **9-Point System**: `topLeft`, `topCenter`, `topRight`, `leftCenter`, `center`, `rightCenter`, `bottomLeft`, `bottomCenter`, `bottomRight`
- **Parametric Point**: `pointAt(degrees)` for any angle

### Triangle Points
- **Vertices**: `getVertices()` returns array of 3 vertex points
- **Center**: `center` (centroid)
- **Sides**: Array of 3 side objects with geometric properties

## Transform Behavior

All exposed points are **transform-aware**:
- Points update automatically when shapes are rotated, translated, or positioned
- The `transformPoint()` method in Rectangle handles rotation correctly
- All getters recalculate based on current position and transforms

## Playground Examples

Five new examples demonstrate the new features:

1. **14-rectangle-corners.js**: Visualizes all 9 reference points of a rectangle
2. **15-rectangle-diagonals.js**: Shows both diagonals with normal vectors
3. **16-triangle-altitudes.js**: Draws all three altitudes of a triangle
4. **17-connecting-points.js**: Demonstrates Line primitive connecting various shape points
5. **18-geometric-constructions.js**: Comprehensive example combining all features

Each example includes a comment with a prompt that could generate it.

## API Changes

### Exports Updated

**Files**: `lib/geometry/index.ts`, `lib/index.ts`

Added exports:
- `Line` class
- `LineConfig` type

### Breaking Changes

- Square: `diagonal` property renamed to `diagonalLength`
  - Migration: Change `square.diagonal` to `square.diagonalLength`
  - For full diagonal object, use `square.diagonal` (inherited from Rectangle)

## Use Cases

These enhancements enable:

1. **Geometric Diagrams**: Draw constructions like Pythagorean theorem visualizations
2. **Technical Illustrations**: Connect related points across shapes
3. **Educational Content**: Show altitudes, perpendiculars, and other geometric concepts
4. **Graph Layouts**: Connect nodes with lines
5. **Architectural Diagrams**: Show measurements and relationships

## Technical Implementation

### Point System Architecture

Points are exposed as getters that:
1. Calculate positions based on current transform state
2. Apply rotation transformations when applicable
3. Return `Point` objects with x/y as strings with "px" units

### Transform Updates

The system ensures points stay synchronized with transforms:
- Rectangle uses `transformPoint()` helper for rotation-aware point calculation
- Triangle and Circle recalculate positions based on `currentPosition`
- All calculations happen on-demand (no caching)

## Future Enhancements

Potential additions based on this foundation:

1. **Medians**: Triangle medians (lines from vertex to opposite side midpoint)
2. **Bisectors**: Angle bisectors and perpendicular bisectors
3. **Incircle/Circumcircle**: Triangle inscribed and circumscribed circles
4. **Midpoints**: General midpoint helpers for any two points
5. **Bezier Curves**: Curved lines connecting points
6. **Arcs**: Circular arc segments
7. **Polygon Points**: Vertex and edge center access for regular polygons

## Documentation

All new features include:
- Comprehensive TSDoc comments
- Usage examples in documentation
- Type safety throughout
- Playground examples demonstrating usage

## Testing

Build verification:
```bash
npm run build
```

All TypeScript compilation passes without errors.
Playground type generation successful.

