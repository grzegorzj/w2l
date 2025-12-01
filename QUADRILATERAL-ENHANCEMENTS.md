# Quadrilateral & Rectangle Enhancements

## Overview

Enhanced `Quadrilateral`, `Rect`, and `Square` classes with Triangle-like methods for drawing altitudes, diagonals, and marking angles. All geometric properties expose their positions correctly through standard accessors (center, foot, origin, etc.).

## New Features

### 1. Diagonals

Both `Quadrilateral` and `Rect` now support diagonal operations:

#### Get Diagonal Information

```typescript
const quad = new Quadrilateral({ type: "rectangle", a: 100, b: 80 });
const diagonals = quad.getDiagonals();

// Each diagonal exposes:
diagonals[0].start      // Starting vertex
diagonals[0].end        // Ending vertex
diagonals[0].length     // Length in pixels
diagonals[0].center     // Center point (intersection for rectangles)
diagonals[0].angle      // Angle in degrees
diagonals[0].line       // Ready-to-use Line object
```

#### Draw Diagonals

```typescript
// Simple method - draws both diagonals
const diagonalLines = quad.drawDiagonals({
  stroke: "blue",
  strokeWidth: "2",
  strokeDasharray: "5,3"
});

diagonalLines.forEach(line => artboard.add(line));
```

### 2. Altitudes

Quadrilaterals support altitude operations (perpendiculars from vertices to opposite sides):

#### Get Altitude Information

```typescript
const altitudes = quad.getAltitudes();

// Each altitude exposes:
altitudes[0].origin     // Starting point (vertex)
altitudes[0].foot       // Foot of altitude (on opposite side)
altitudes[0].height     // Length of altitude
altitudes[0].line       // Ready-to-use Line object
```

#### Draw Altitudes

```typescript
// Draw all altitudes
const altitudeLines = quad.drawAltitudes({
  stroke: "red",
  strokeWidth: "1",
  strokeDasharray: "3,3"
});

altitudeLines.forEach(line => artboard.add(line));
```

#### Position Elements Using Altitude Properties

```typescript
// Label the altitude
const label = new Text({ content: `h = ${altitudes[0].height.toFixed(1)}`, fontSize: 12 });
label.position({
  relativeTo: {
    x: (altitudes[0].origin.x + altitudes[0].foot.x) / 2,
    y: (altitudes[0].origin.y + altitudes[0].foot.y) / 2
  },
  relativeFrom: label.center,
  x: -20,
  y: 0
});
artboard.add(label);

// Mark the foot with a circle
const footMarker = new Circle({ radius: 4, style: { fill: "orange" } });
footMarker.position({
  relativeTo: altitudes[0].foot,
  relativeFrom: footMarker.center,
  x: 0,
  y: 0
});
artboard.add(footMarker);
```

### 3. Rectangle-Specific Methods

The `Rect` class (and `Square` which inherits from it) has additional convenience methods:

#### Show Angles

```typescript
const rect = new Rect({ width: 100, height: 80 });

// Show angle at a specific corner
const angle = rect.showAngle("topLeft", { 
  rightAngleMarker: "square",
  label: "90°",
  radius: 15
});
artboard.add(angle);

// Show all angles at once
const angles = rect.showAngles({ 
  rightAngleMarker: "square",
  radius: 15
});
angles.forEach(angle => artboard.add(angle));
```

#### Create Corner Labels

```typescript
// Default labels: A, B, C, D
const labels = rect.createCornerLabels(["$A$", "$B$", "$C$", "$D$"], 25, 14);
labels.forEach(label => artboard.add(label));
```

#### Create Side Labels

```typescript
// Default labels based on position
const labels = rect.createSideLabels(["$a$", "$b$", "$a$", "$b$"], 20, 14);
labels.forEach(label => artboard.add(label));
```

## Complete Examples

### Rectangle with Diagonals and Right Angles

```typescript
const rect = new Rect({
  width: 150,
  height: 100,
  style: { fill: "lightblue", stroke: "blue", strokeWidth: "2" }
});
artboard.add(rect);

// Draw diagonals
const diagonals = rect.drawDiagonals({ stroke: "blue", strokeDasharray: "5,3" });
diagonals.forEach(line => artboard.add(line));

// Show right angle markers
const angles = rect.showAngles({ rightAngleMarker: "square", radius: 15 });
angles.forEach(angle => artboard.add(angle));

// Label corners
const labels = rect.createCornerLabels(["$A$", "$B$", "$C$", "$D$"], 25, 14);
labels.forEach(label => artboard.add(label));
```

### Parallelogram with Altitudes

```typescript
const para = new Quadrilateral({
  type: "parallelogram",
  a: 140,
  b: 70,
  angle: 65,
  style: { fill: "lightyellow", stroke: "orange", strokeWidth: "2" }
});
artboard.add(para);

// Draw altitudes
const altitudes = para.drawAltitudes({ stroke: "red", strokeDasharray: "3,3" });
altitudes.forEach(line => artboard.add(line));

// Draw diagonals
const diagonals = para.drawDiagonals({ stroke: "orange", strokeDasharray: "5,3" });
diagonals.forEach(line => artboard.add(line));

// Show angles
const angles = para.showAngles({ mode: "internal", radius: 20 });
angles.forEach(angle => artboard.add(angle));
```

### Positioning with Diagonal Centers

```typescript
const square = new Rect({ width: 150, height: 150 });
artboard.add(square);

// Get diagonals
const diagonals = square.getDiagonals();

// Place a marker at the diagonal intersection (center)
const marker = new Circle({ radius: 7, style: { fill: "red" } });
marker.position({
  relativeTo: diagonals[0].center,
  relativeFrom: marker.center,
  x: 0,
  y: 0
});
artboard.add(marker);

// Both diagonal centers coincide at the square's center
console.log(diagonals[0].center); // Same as diagonals[1].center
```

## New Types Exported

- `QuadrilateralDiagonal` - Diagonal information for quadrilaterals
- `QuadrilateralAltitude` - Altitude information for quadrilaterals
- `RectDiagonal` - Diagonal information for rectangles

## Inheritance

`Square` extends `Rect`, so all `Rect` methods are available on `Square`:

```typescript
const square = new Square({ size: 120 });

// All these work on Square too!
const diagonals = square.getDiagonals();
const angles = square.showAngles({ rightAngleMarker: "square" });
const labels = square.createCornerLabels();
```

## Test Files

Two new test files demonstrate the new features:

1. `playground/examples/tests/test-quadrilateral-methods.js` - Shows all shape types with their altitudes and diagonals
2. `playground/examples/tests/test-quadrilateral-positioning.js` - Demonstrates positioning elements using altitude and diagonal accessors

## Updated Documentation

The agent server guide has been updated with examples of the new methods:
- `/agent_server/guides/quadrilateral.json` - Added "Diagonals and Altitudes" section with comprehensive examples

## Changes to Triangle

Fixed the `strokeWidth` type in Triangle's altitude code to use string format for consistency with TypeScript's CSS types.

## Breaking Changes

None. All changes are additive - existing code will continue to work.

## Implementation Notes

- All altitude and diagonal Line objects are created with proper positioning relative to their parent shape
- Default styles use dashed lines to distinguish geometric constructions from the shapes themselves
- All position accessors (center, foot, origin) return absolute coordinates ready for use with the positioning system
- The implementation follows the same patterns as Triangle's altitude system for consistency

