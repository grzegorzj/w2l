# Quadrilateral Guide

## Overview

This guide covers the Quadrilateral element for creating four-sided geometric shapes. Quadrilateral supports multiple types including rectangles, squares, parallelograms, trapezoids, rhombi, kites, and custom shapes, with features for marking angles and labeling.

## When to Use This Guide

- Creating geometry diagrams with four-sided shapes
- Illustrating properties of rectangles, squares, parallelograms, etc.
- Marking angles in quadrilaterals
- Labeling sides and vertices
- Creating custom quadrilateral shapes
- Working with quadrilateral geometry (diagonals, normals, etc.)

## Quadrilateral Types

### Rectangle

A quadrilateral with four right angles.

```javascript
const rectangle = new Quadrilateral({
  type: "rectangle",
  a: 120,        // Width
  b: 80,         // Height
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});
```

### Square

A rectangle with all sides equal.

```javascript
const square = new Quadrilateral({
  type: "square",
  a: 100,        // Side length
  style: { fill: "lightgreen", stroke: "darkgreen", strokeWidth: 2 }
});
```

### Parallelogram

A quadrilateral with opposite sides parallel.

```javascript
const parallelogram = new Quadrilateral({
  type: "parallelogram",
  a: 120,        // Base length
  b: 80,         // Side length
  angle: 60,     // Angle in degrees (default: 60)
  style: { fill: "lightyellow", stroke: "orange", strokeWidth: 2 }
});
```

### Trapezoid

A quadrilateral with one pair of parallel sides.

```javascript
const trapezoid = new Quadrilateral({
  type: "trapezoid",
  a: 120,        // Bottom base
  b: 80,         // Top base (optional, defaults to a/2)
  style: { fill: "lightcoral", stroke: "darkred", strokeWidth: 2 }
});
```

### Rhombus

A parallelogram with all sides equal.

```javascript
const rhombus = new Quadrilateral({
  type: "rhombus",
  a: 100,        // Side length
  angle: 60,     // Angle in degrees (default: 60)
  style: { fill: "lavender", stroke: "purple", strokeWidth: 2 }
});
```

### Kite

A quadrilateral with two pairs of adjacent equal sides.

```javascript
const kite = new Quadrilateral({
  type: "kite",
  a: 100,        // Length of first pair of sides
  b: 80,         // Length of second pair of sides (optional)
  style: { fill: "lightpink", stroke: "deeppink", strokeWidth: 2 }
});
```

### Custom Quadrilateral

Define any quadrilateral by specifying four vertices.

```javascript
const custom = new Quadrilateral({
  type: "custom",
  vertices: [
    { x: -50, y: 40 },   // Bottom-left
    { x: 60, y: 30 },    // Bottom-right
    { x: 50, y: -40 },   // Top-right
    { x: -40, y: -30 }   // Top-left
  ],
  style: { fill: "lightgray", stroke: "black", strokeWidth: 2 }
});
```

**Note:** Vertices should be provided in counter-clockwise order.

## Marking Angles

### Single Angle Marker

Mark a specific angle at a vertex (0, 1, 2, or 3).

```javascript
// Mark a right angle with a square marker
const angle = quad.showAngle(0, {
  mode: 'internal',
  label: "90°",
  rightAngleMarker: "square",
  radius: 15,
  style: { stroke: "red", strokeWidth: 1.5 }
});

artboard.add(angle);
```

**Options:**
- `mode`: `'internal'` (inside quadrilateral) or `'external'` (outside)
- `label`: Text label for the angle (supports LaTeX like `"$\\alpha$"`)
- `radius`: Size of the angle arc in pixels
- `rightAngleMarker`: `"square"`, `"dot"`, or `"arc"` for 90° angles
- `style`: SVG styling for the angle marker

### Mark All Angles

```javascript
const angles = quad.showAngles({
  mode: 'internal',
  labels: ["$\\alpha$", "$\\beta$", "$\\gamma$", "$\\delta$"],
  radius: 20,
  style: { stroke: "blue", strokeWidth: 1.5 }
});

angles.forEach(angle => artboard.add(angle));
```

## Labeling

### Side Labels

Label the four sides.

```javascript
// Default labels: a, b, c, d
const sideLabels = quad.createSideLabels();
sideLabels.forEach(label => artboard.add(label));

// Custom labels
const customLabels = quad.createSideLabels(
  ["$a$", "$b$", "$c$", "$d$"],
  { offset: 15, fontSize: 14 }
);
customLabels.forEach(label => artboard.add(label));
```

**Configuration:**
- `offset`: Distance from the side (default: 10px)
- `fontSize`: Size of the label text
- `side`: Position relative to the side

### Vertex Labels

Label the four vertices.

```javascript
// Default labels: A, B, C, D
const vertexLabels = quad.createVertexLabels();
vertexLabels.forEach(label => artboard.add(label));

// Custom labels
const customVertexLabels = quad.createVertexLabels(
  ["$A$", "$B$", "$C$", "$D$"],
  20,  // offset distance
  16   // fontSize
);
customVertexLabels.forEach(label => artboard.add(label));
```

## Working with Sides

### Get Side Information

```javascript
const sides = quad.getSides();

// Access side 0 (between vertex 0 and 1)
const side0 = sides[0];

console.log(side0.length);         // Length in pixels
console.log(side0.center);         // Center point of the side
console.log(side0.start);          // Starting vertex
console.log(side0.end);            // Ending vertex
console.log(side0.angle);          // Angle in degrees
console.log(side0.outwardNormal);  // Outward-facing unit normal
console.log(side0.inwardNormal);   // Inward-facing unit normal
console.log(side0.direction);      // Direction unit vector
```

### Get Side Lines

```javascript
const [line0, line1, line2, line3] = quad.getSideLines();

// Style individual sides differently
line0.style = { stroke: "red", strokeWidth: 3 };
line1.style = { stroke: "blue", strokeWidth: 3 };

[line0, line1, line2, line3].forEach(line => artboard.add(line));
```

## Advanced Constructions

### Drawing Diagonals

```javascript
const verts = quad.getVertices();

// Diagonal from vertex 0 to vertex 2
const diagonal1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: verts[2].x - verts[0].x, y: verts[2].y - verts[0].y },
  style: { stroke: "red", strokeWidth: 1.5, strokeDasharray: "4,4" }
});

diagonal1.position({
  relativeFrom: diagonal1.start,
  relativeTo: verts[0],
  x: 0,
  y: 0
});

artboard.add(diagonal1);

// Diagonal from vertex 1 to vertex 3
const diagonal2 = new Line({
  start: { x: 0, y: 0 },
  end: { x: verts[3].x - verts[1].x, y: verts[3].y - verts[1].y },
  style: { stroke: "blue", strokeWidth: 1.5, strokeDasharray: "4,4" }
});

diagonal2.position({
  relativeFrom: diagonal2.start,
  relativeTo: verts[1],
  x: 0,
  y: 0
});

artboard.add(diagonal2);
```

### Marking Parallel Sides

```javascript
// For a parallelogram, mark parallel sides with arrows
const sides = quad.getSides();
const [line0, line1, line2, line3] = quad.getSideLines();

// Visually indicate parallel sides (e.g., sides 0 and 2)
line0.style = { stroke: "red", strokeWidth: 2 };
line2.style = { stroke: "red", strokeWidth: 2 };

// Sides 1 and 3
line1.style = { stroke: "blue", strokeWidth: 2 };
line3.style = { stroke: "blue", strokeWidth: 2 };

[line0, line1, line2, line3].forEach(line => artboard.add(line));
```

### Marking Equal Sides

```javascript
// For a rhombus or kite, indicate equal sides
// Add tick marks or use same color for equal sides
```

### Height of Parallelogram

```javascript
// Draw height (perpendicular from one side to opposite side)
const verts = quad.getVertices();
const sides = quad.getSides();

// Height from vertex 3 perpendicular to side 0
const base = sides[0];
const vertex = verts[3];

// Calculate perpendicular foot
const dx = base.end.x - base.start.x;
const dy = base.end.y - base.start.y;
const t = ((vertex.x - base.start.x) * dx + (vertex.y - base.start.y) * dy) / (dx * dx + dy * dy);
const footX = base.start.x + t * dx;
const footY = base.start.y + t * dy;

const height = new Line({
  start: { x: 0, y: 0 },
  end: { x: footX - vertex.x, y: footY - vertex.y },
  style: { stroke: "green", strokeWidth: 1.5, strokeDasharray: "3,3" }
});

height.position({
  relativeFrom: height.start,
  relativeTo: vertex,
  x: 0,
  y: 0
});

artboard.add(height);

// Mark the right angle at the foot
const heightLabel = new Text({ content: "$h$", fontSize: 14 });
heightLabel.position({
  relativeFrom: heightLabel.center,
  relativeTo: { x: (vertex.x + footX) / 2, y: (vertex.y + footY) / 2 },
  x: -15,
  y: 0
});
artboard.add(heightLabel);
```

## Complete Example: Labeled Rectangle

```javascript
// Create a rectangle
const rect = new Quadrilateral({
  type: "rectangle",
  a: 140,
  b: 90,
  style: { fill: "rgba(100, 150, 255, 0.2)", stroke: "navy", strokeWidth: 2 }
});

artboard.add(rect);

// Mark all right angles
const angles = rect.showAngles({
  mode: 'internal',
  rightAngleMarker: "square",
  radius: 12
});
angles.forEach(angle => artboard.add(angle));

// Label the sides
const sideLabels = rect.createSideLabels(["$a$", "$b$", "$a$", "$b$"]);
sideLabels.forEach(label => artboard.add(label));

// Label the vertices
const vertexLabels = rect.createVertexLabels(["$A$", "$B$", "$C$", "$D$"]);
vertexLabels.forEach(label => artboard.add(label));

// Draw diagonals
const verts = rect.getVertices();
const diagonal1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: verts[2].x - verts[0].x, y: verts[2].y - verts[0].y },
  style: { stroke: "red", strokeWidth: 1, strokeDasharray: "4,4" }
});
diagonal1.position({
  relativeFrom: diagonal1.start,
  relativeTo: verts[0],
  x: 0,
  y: 0
});
artboard.add(diagonal1);
```

## Complete Example: Parallelogram with Height

```javascript
// Create a parallelogram
const para = new Quadrilateral({
  type: "parallelogram",
  a: 120,
  b: 70,
  angle: 65,
  style: { fill: "rgba(255, 200, 100, 0.2)", stroke: "orange", strokeWidth: 2 }
});

artboard.add(para);

// Mark angles
const angles = para.showAngles({
  mode: 'internal',
  labels: ["$\\alpha$", "$\\beta$", "$\\alpha$", "$\\beta$"],
  radius: 20
});
angles.forEach(angle => artboard.add(angle));

// Label sides showing parallel sides have equal length
const sideLabels = para.createSideLabels(["$a$", "$b$", "$a$", "$b$"]);
sideLabels.forEach(label => artboard.add(label));

// Draw and label height
const verts = para.getVertices();
const sides = para.getSides();
const base = sides[0];
const topVertex = verts[3];

// Calculate perpendicular foot
const dx = base.end.x - base.start.x;
const dy = base.end.y - base.start.y;
const t = ((topVertex.x - base.start.x) * dx + (topVertex.y - base.start.y) * dy) / (dx * dx + dy * dy);
const footX = base.start.x + t * dx;
const footY = base.start.y + t * dy;

const height = new Line({
  start: { x: 0, y: 0 },
  end: { x: footX - topVertex.x, y: footY - topVertex.y },
  style: { stroke: "green", strokeWidth: 1.5, strokeDasharray: "3,3" }
});

height.position({
  relativeFrom: height.start,
  relativeTo: topVertex,
  x: 0,
  y: 0
});

artboard.add(height);
```

## Best Practices

1. **Choose the right type** - Use the most specific type for clarity
2. **Label consistently** - Follow mathematical conventions
3. **Use LaTeX** - Wrap math symbols in `$...$` for proper formatting
4. **Mark equal sides** - Use same labels for equal sides
5. **Mark parallel sides** - Use colors or arrows to show parallelism
6. **Angle order** - Vertices are numbered 0-3 counter-clockwise
7. **Right angle markers** - Use "square" for 90° angles
8. **Custom vertices** - Ensure counter-clockwise ordering

## Common Patterns

### Rectangle with Dimensions

```javascript
const rect = new Quadrilateral({
  type: "rectangle",
  a: 120,
  b: 80,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(rect);

const sides = rect.getSides();

// Add dimension labels
const widthLabel = new Text({ content: "120", fontSize: 14 });
widthLabel.position({
  relativeFrom: widthLabel.center,
  relativeTo: sides[0].center,
  x: 0,
  y: 25
});
artboard.add(widthLabel);

const heightLabel = new Text({ content: "80", fontSize: 14 });
heightLabel.position({
  relativeFrom: heightLabel.center,
  relativeTo: sides[1].center,
  x: 30,
  y: 0
});
artboard.add(heightLabel);
```

### Trapezoid Area Diagram

```javascript
const trapezoid = new Quadrilateral({
  type: "trapezoid",
  a: 120,
  b: 70,
  style: { fill: "rgba(255, 200, 100, 0.3)", stroke: "orange", strokeWidth: 2 }
});

artboard.add(trapezoid);

// Label parallel sides as bases
const sideLabels = trapezoid.createSideLabels(["$b_2$", "", "$b_1$", ""]);
sideLabels.forEach(label => artboard.add(label));

// Add height line (similar to parallelogram height example)
```

## Troubleshooting

**Angles not in right position?**
- Verify vertex indices (0-3)
- Check if quadrilateral is convex
- Adjust radius for better visibility

**Custom quadrilateral looks wrong?**
- Ensure vertices are in counter-clockwise order
- Check vertex coordinates are relative to center

**Labels overlapping?**
- Increase offset distance
- Adjust fontSize
- Position labels manually if needed

