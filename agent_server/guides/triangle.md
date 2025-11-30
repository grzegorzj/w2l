# Triangle Guide

## Overview

This guide covers the Triangle element for creating geometric diagrams with triangles. The Triangle class provides powerful features for marking angles, labeling sides and vertices, and working with triangle geometry.

## When to Use This Guide

- Creating geometry problems and diagrams
- Illustrating triangle properties (right, equilateral, isosceles)
- Marking angles with various notation styles
- Labeling sides and vertices with mathematical notation
- Working with triangle normals for positioning related elements
- Drawing altitudes, medians, or other triangle constructions

## Triangle Types

### Right Triangle

A triangle with one 90° angle.

```javascript
const rightTriangle = new Triangle({
  type: "right",
  a: 100,        // First leg
  b: 80,         // Second leg (optional, defaults to a for isosceles)
  orientation: "bottomLeft",
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});
```

**Orientations:**
- `"bottomLeft"`: Right angle at bottom-left
- `"bottomRight"`: Right angle at bottom-right
- `"topLeft"`: Right angle at top-left
- `"topRight"`: Right angle at top-right

### Equilateral Triangle

All sides equal, all angles 60°.

```javascript
const equilateral = new Triangle({
  type: "equilateral",
  a: 100,        // Side length
  style: { fill: "lightgreen", stroke: "darkgreen", strokeWidth: 2 }
});
```

### Isosceles Triangle

Two sides equal.

```javascript
const isosceles = new Triangle({
  type: "isosceles",
  a: 100,        // Base
  b: 120,        // Equal sides length
  style: { fill: "lightyellow", stroke: "orange", strokeWidth: 2 }
});
```

## Marking Angles

### Single Angle Marker

Mark a specific angle at a vertex (0, 1, or 2).

```javascript
// Mark the right angle with a square marker
const angle = triangle.showAngle(0, {
  mode: 'internal',
  label: "90°",
  rightAngleMarker: "square",
  radius: 15,
  style: { stroke: "red", strokeWidth: 1.5 }
});

artboard.add(angle);
```

**Options:**
- `mode`: `'internal'` (inside triangle) or `'external'` (outside triangle)
- `label`: Text label for the angle (can include LaTeX like `"$\\alpha$"`)
- `radius`: Size of the angle arc in pixels
- `rightAngleMarker`: `"square"`, `"dot"`, or `"arc"` for 90° angles
- `style`: SVG styling for the angle marker

### Mark All Angles

```javascript
const angles = triangle.showAngles({
  mode: 'internal',
  labels: ["$\\alpha$", "$\\beta$", "$\\gamma$"],
  radius: 20,
  style: { stroke: "blue", strokeWidth: 1.5 }
});

angles.forEach(angle => artboard.add(angle));
```

## Labeling

### Side Labels

Label the three sides with mathematical notation.

```javascript
// Default labels: a, b, c
const sideLabels = triangle.createSideLabels();
sideLabels.forEach(label => artboard.add(label));

// Custom labels
const customLabels = triangle.createSideLabels(
  ["$a$", "$b$", "$c$"],
  { offset: 15, fontSize: 14 }
);
customLabels.forEach(label => artboard.add(label));
```

**Configuration:**
- `offset`: Distance from the side (default: 10px)
- `fontSize`: Size of the label text
- `side`: Position relative to the side (`'outward'`, `'inward'`, `'left'`, `'right'`)

### Vertex Labels

Label the three vertices.

```javascript
// Default labels: A, B, C
const vertexLabels = triangle.createVertexLabels();
vertexLabels.forEach(label => artboard.add(label));

// Custom labels
const customVertexLabels = triangle.createVertexLabels(
  ["$A$", "$B$", "$C$"],
  20,  // offset distance
  16   // fontSize
);
customVertexLabels.forEach(label => artboard.add(label));
```

## Working with Sides

### Get Side Information

Each side provides geometric information useful for constructions.

```javascript
const sides = triangle.getSides();

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

Get Line elements for each side (useful for styling or extending).

```javascript
const [line0, line1, line2] = triangle.getSideLines();

// You can style individual sides
line0.style = { stroke: "red", strokeWidth: 2 };
artboard.add(line0);
```

### Using Normals for Positioning

Use inward/outward normals to position elements relative to sides.

```javascript
const sides = triangle.getSides();
const side0 = sides[0];

// Create a label positioned outward from the side
const label = new Text({ content: "Base", fontSize: 14 });

// Position using the outward normal
const offset = 20; // Distance from the side
label.position({
  relativeFrom: label.center,
  relativeTo: side0.center,
  x: side0.outwardNormal.x * offset,
  y: side0.outwardNormal.y * offset
});

artboard.add(label);
```

## Advanced Constructions

### Drawing an Altitude

An altitude is a perpendicular line from a vertex to the opposite side.

```javascript
const verts = triangle.getVertices();
const sides = triangle.getSides();

// Altitude from vertex 0 to side 1 (opposite side)
const vertex0 = verts[0];
const side1 = sides[1];

// Calculate foot of altitude (perpendicular projection)
const dx = side1.end.x - side1.start.x;
const dy = side1.end.y - side1.start.y;
const t = ((vertex0.x - side1.start.x) * dx + (vertex0.y - side1.start.y) * dy) / (dx * dx + dy * dy);
const footX = side1.start.x + t * dx;
const footY = side1.start.y + t * dy;

// Create the altitude line
const altitude = new Line({
  start: { x: 0, y: 0 },
  end: { x: footX - vertex0.x, y: footY - vertex0.y },
  style: { stroke: "blue", strokeWidth: 1, strokeDasharray: "4,4" }
});

altitude.position({
  relativeFrom: altitude.start,
  relativeTo: vertex0,
  x: 0,
  y: 0
});

artboard.add(altitude);
```

### Drawing a Median

A median connects a vertex to the midpoint of the opposite side.

```javascript
const verts = triangle.getVertices();
const sides = triangle.getSides();

// Median from vertex 0 to midpoint of side 1
const vertex0 = verts[0];
const midpoint = sides[1].center;

const median = new Line({
  start: { x: 0, y: 0 },
  end: { x: midpoint.x - vertex0.x, y: midpoint.y - vertex0.y },
  style: { stroke: "green", strokeWidth: 1.5, strokeDasharray: "3,3" }
});

median.position({
  relativeFrom: median.start,
  relativeTo: vertex0,
  x: 0,
  y: 0
});

artboard.add(median);
```

### Drawing the Circumcircle

```javascript
const verts = triangle.getVertices();

// Calculate circumcenter (intersection of perpendicular bisectors)
// This is a simplified calculation - for production use proper geometric formulas
const [A, B, C] = verts;

const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
const ux = ((A.x * A.x + A.y * A.y) * (B.y - C.y) + (B.x * B.x + B.y * B.y) * (C.y - A.y) + (C.x * C.x + C.y * C.y) * (A.y - B.y)) / D;
const uy = ((A.x * A.x + A.y * A.y) * (C.x - B.x) + (B.x * B.x + B.y * B.y) * (A.x - C.x) + (C.x * C.x + C.y * C.y) * (B.x - A.x)) / D;

const circumcenter = { x: ux, y: uy };
const radius = Math.sqrt((A.x - ux) ** 2 + (A.y - uy) ** 2);

const circumcircle = new Circle({
  radius: radius,
  style: { fill: "none", stroke: "purple", strokeWidth: 1, strokeDasharray: "5,5" }
});

circumcircle.position({
  relativeFrom: circumcircle.center,
  relativeTo: circumcenter,
  x: 0,
  y: 0
});

artboard.add(circumcircle);
```

## Complete Example: Labeled Right Triangle

```javascript
// Create a right triangle
const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 80,
  orientation: "bottomLeft",
  style: { fill: "rgba(100, 150, 255, 0.2)", stroke: "navy", strokeWidth: 2 }
});

artboard.add(triangle);

// Mark the right angle with a square
const rightAngle = triangle.showAngle(0, {
  mode: 'internal',
  rightAngleMarker: "square",
  radius: 15
});
artboard.add(rightAngle);

// Mark the other angles
const otherAngles = [
  triangle.showAngle(1, { mode: 'internal', label: "$\\alpha$", radius: 20 }),
  triangle.showAngle(2, { mode: 'internal', label: "$\\beta$", radius: 20 })
];
otherAngles.forEach(angle => artboard.add(angle));

// Label the sides
const sideLabels = triangle.createSideLabels(["$a$", "$b$", "$c$"]);
sideLabels.forEach(label => artboard.add(label));

// Label the vertices
const vertexLabels = triangle.createVertexLabels(["$A$", "$B$", "$C$"]);
vertexLabels.forEach(label => artboard.add(label));
```

## Best Practices

1. **Use appropriate triangle type** - Choose the most specific type for your needs
2. **Orient correctly** - Use orientation parameter for right triangles to control right angle position
3. **Label consistently** - Use mathematical conventions (lowercase for sides, uppercase for vertices)
4. **Use LaTeX** - Wrap math symbols in `$...$` for proper formatting
5. **Check angle indices** - Vertices are numbered 0, 1, 2 counter-clockwise
6. **Use normals** - Leverage inward/outward normals for proper label placement
7. **Style angle markers** - Adjust radius and style to match your diagram scale
8. **Right angle markers** - Use "square" for 90° angles as per convention

## Common Patterns

### Equal Sides Markers

```javascript
// Mark equal sides with tick marks
const sides = triangle.getSides();
const [line0, line1] = triangle.getSideLines();

// Add single tick marks to equal sides
// (This would require custom SVG markers - implement as needed)
```

### Height Annotation

```javascript
// For a right triangle, annotate the height
const verts = triangle.getVertices();
const sides = triangle.getSides();

const heightLabel = new Text({
  content: "$h = 80$",
  fontSize: 14
});

heightLabel.position({
  relativeFrom: heightLabel.centerRight,
  relativeTo: sides[0].center,
  x: -10,
  y: 0
});

artboard.add(heightLabel);
```

## Troubleshooting

**Angle markers not showing?**
- Check vertex index (0, 1, or 2)
- Ensure radius is appropriate for triangle size
- Verify angle is being added to artboard

**Labels overlapping?**
- Adjust offset distance in label configuration
- Use smaller fontSize
- Position labels manually if needed

**Triangle orientation wrong?**
- For right triangles, try different orientation values
- Check that vertices are ordered correctly

