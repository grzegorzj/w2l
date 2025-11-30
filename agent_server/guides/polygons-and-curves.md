# Polygons and Curves Guide

## Overview

This guide covers RegularPolygon for creating polygons with any number of sides, BezierCurve for smooth curved paths, and other specialized shape elements like Rect (Rectangle), Square, and Image.

## When to Use This Guide

- Creating regular polygons (pentagon, hexagon, octagon, etc.)
- Drawing smooth curved paths with Bezier curves
- Creating rectangles and squares
- Positioning images in diagrams
- Working with polygon geometry (apothem, side length, vertices)
- Creating decorative or technical curves

## Regular Polygon

Create any regular polygon by specifying the number of sides.

### Basic Regular Polygons

```javascript
// Pentagon (5 sides)
const pentagon = new RegularPolygon({
  sides: 5,
  radius: 50,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

// Hexagon (6 sides)
const hexagon = new RegularPolygon({
  sides: 6,
  radius: 50,
  style: { fill: "lightgreen", stroke: "darkgreen", strokeWidth: 2 }
});

// Octagon (8 sides)
const octagon = new RegularPolygon({
  sides: 8,
  radius: 50,
  style: { fill: "lightyellow", stroke: "orange", strokeWidth: 2 }
});
```

### With Rotation

```javascript
// Pentagon with flat bottom
const flatPentagon = new RegularPolygon({
  sides: 5,
  radius: 50,
  rotation: -90,  // Rotate to have flat bottom
  style: { fill: "lightcoral", stroke: "darkred", strokeWidth: 2 }
});

// Hexagon pointing up
const pointyHex = new RegularPolygon({
  sides: 6,
  radius: 50,
  rotation: 30,   // Rotate 30 degrees
  style: { fill: "lavender", stroke: "purple", strokeWidth: 2 }
});
```

### Accessing Polygon Properties

```javascript
const hexagon = new RegularPolygon({
  sides: 6,
  radius: 60
});

// Get center
console.log(hexagon.center);

// Get vertices (absolute positions)
const vertices = hexagon.absoluteVertices;
vertices.forEach((vertex, i) => {
  console.log(`Vertex ${i}: (${vertex.x}, ${vertex.y})`);
});

// Get geometric properties
console.log(hexagon.sideLength);     // Length of each side
console.log(hexagon.apothem);        // Distance from center to side midpoint
console.log(hexagon.boundingWidth);  // Width of bounding box
console.log(hexagon.boundingHeight); // Height of bounding box
```

### Labeling Vertices

```javascript
const pentagon = new RegularPolygon({
  sides: 5,
  radius: 60,
  rotation: -90,
  style: { fill: "rgba(100, 150, 255, 0.2)", stroke: "navy", strokeWidth: 2 }
});

artboard.add(pentagon);

// Label each vertex
const vertices = pentagon.absoluteVertices;
const labels = ["A", "B", "C", "D", "E"];

vertices.forEach((vertex, i) => {
  // Draw vertex marker
  const dot = new Circle({
    radius: 4,
    style: { fill: "red" }
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: vertex,
    x: 0,
    y: 0
  });
  
  artboard.add(dot);
  
  // Calculate outward direction from center
  const centerPos = pentagon.center;
  const dx = vertex.x - centerPos.x;
  const dy = vertex.y - centerPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * 20;
  const offsetY = (dy / dist) * 20;
  
  // Add label
  const label = new Text({
    content: labels[i],
    fontSize: 14
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: vertex,
    x: offsetX,
    y: offsetY
  });
  
  artboard.add(label);
});
```

### Polygon with Side Labels

```javascript
const hexagon = new RegularPolygon({
  sides: 6,
  radius: 60,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(hexagon);

const vertices = hexagon.absoluteVertices;

// Label each side
for (let i = 0; i < vertices.length; i++) {
  const v1 = vertices[i];
  const v2 = vertices[(i + 1) % vertices.length];
  
  // Calculate side midpoint
  const midX = (v1.x + v2.x) / 2;
  const midY = (v1.y + v2.y) / 2;
  
  // Calculate outward normal
  const centerPos = hexagon.center;
  const dx = midX - centerPos.x;
  const dy = midY - centerPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * 15;
  const offsetY = (dy / dist) * 15;
  
  const label = new Text({
    content: `${hexagon.sideLength.toFixed(1)}`,
    fontSize: 12
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: { x: midX, y: midY },
    x: offsetX,
    y: offsetY
  });
  
  artboard.add(label);
}
```

### Showing Apothem

```javascript
const hexagon = new RegularPolygon({
  sides: 6,
  radius: 60,
  rotation: 30,
  style: { fill: "rgba(100, 200, 100, 0.2)", stroke: "darkgreen", strokeWidth: 2 }
});

artboard.add(hexagon);

// Draw apothem line from center to side midpoint
const vertices = hexagon.absoluteVertices;
const v1 = vertices[0];
const v2 = vertices[1];
const sideMidX = (v1.x + v2.x) / 2;
const sideMidY = (v1.y + v2.y) / 2;

const apothemLine = new Line({
  start: { x: 0, y: 0 },
  end: { x: sideMidX - hexagon.center.x, y: sideMidY - hexagon.center.y },
  style: { stroke: "red", strokeWidth: 2, strokeDasharray: "4,4" }
});

apothemLine.position({
  relativeFrom: apothemLine.start,
  relativeTo: hexagon.center,
  x: 0,
  y: 0
});

artboard.add(apothemLine);

// Label apothem
const apothemLabel = new Text({
  content: `$a = ${hexagon.apothem.toFixed(1)}$`,
  fontSize: 14
});

apothemLabel.position({
  relativeFrom: apothemLabel.center,
  relativeTo: { x: (hexagon.center.x + sideMidX) / 2, y: (hexagon.center.y + sideMidY) / 2 },
  x: 10,
  y: 0
});

artboard.add(apothemLabel);
```

## Bezier Curves

Create smooth curved paths using quadratic or cubic Bezier curves.

### Quadratic Bezier Curve

Uses one control point.

```javascript
const curve = new BezierCurve({
  start: { x: 100, y: 100 },
  end: { x: 300, y: 100 },
  controlPoint1: { x: 200, y: 50 },
  style: {
    stroke: "#3498db",
    strokeWidth: 3,
    fill: "none"
  }
});

artboard.add(curve);
```

### Cubic Bezier Curve

Uses two control points for more complex curves.

```javascript
const curve = new BezierCurve({
  start: { x: 100, y: 100 },
  end: { x: 400, y: 100 },
  controlPoint1: { x: 200, y: 50 },
  controlPoint2: { x: 300, y: 150 },
  style: {
    stroke: "#e74c3c",
    strokeWidth: 3,
    fill: "none"
  }
});

artboard.add(curve);
```

### S-Curve

Create an S-shaped curve.

```javascript
const sCurve = new BezierCurve({
  start: { x: 100, y: 200 },
  end: { x: 300, y: 200 },
  controlPoint1: { x: 150, y: 100 },
  controlPoint2: { x: 250, y: 300 },
  style: {
    stroke: "#9b59b6",
    strokeWidth: 3,
    fill: "none"
  }
});

artboard.add(sCurve);
```

### Showing Control Points

```javascript
const curve = new BezierCurve({
  start: { x: 100, y: 200 },
  end: { x: 400, y: 200 },
  controlPoint1: { x: 200, y: 100 },
  controlPoint2: { x: 300, y: 300 },
  style: {
    stroke: "blue",
    strokeWidth: 3,
    fill: "none"
  }
});

artboard.add(curve);

// Get curve properties
const start = curve.start;
const end = curve.end;
const cp1 = curve.controlPoint1;
const cp2 = curve.controlPoint2;

// Draw control point lines (construction lines)
const line1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: cp1.x - start.x, y: cp1.y - start.y },
  style: { stroke: "gray", strokeWidth: 1, strokeDasharray: "3,3" }
});

line1.position({
  relativeFrom: line1.start,
  relativeTo: start,
  x: 0,
  y: 0
});

artboard.add(line1);

const line2 = new Line({
  start: { x: 0, y: 0 },
  end: { x: end.x - cp2.x, y: end.y - cp2.y },
  style: { stroke: "gray", strokeWidth: 1, strokeDasharray: "3,3" }
});

line2.position({
  relativeFrom: line2.start,
  relativeTo: cp2,
  x: 0,
  y: 0
});

artboard.add(line2);

// Mark control points
const cpMarker1 = new Circle({ radius: 5, style: { fill: "red" } });
cpMarker1.position({
  relativeFrom: cpMarker1.center,
  relativeTo: cp1,
  x: 0,
  y: 0
});
artboard.add(cpMarker1);

const cpMarker2 = new Circle({ radius: 5, style: { fill: "red" } });
cpMarker2.position({
  relativeFrom: cpMarker2.center,
  relativeTo: cp2,
  x: 0,
  y: 0
});
artboard.add(cpMarker2);

// Mark endpoints
const startMarker = new Circle({ radius: 5, style: { fill: "blue" } });
startMarker.position({
  relativeFrom: startMarker.center,
  relativeTo: start,
  x: 0,
  y: 0
});
artboard.add(startMarker);

const endMarker = new Circle({ radius: 5, style: { fill: "blue" } });
endMarker.position({
  relativeFrom: endMarker.center,
  relativeTo: end,
  x: 0,
  y: 0
});
artboard.add(endMarker);
```

## Rectangle and Square

### Basic Rectangle

```javascript
const rect = new Rect({
  width: 120,
  height: 80,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(rect);
```

### Rectangle with Box Model

```javascript
const rect = new Rect({
  width: 120,
  height: 80,
  boxModel: {
    padding: 10,
    margin: 5,
    border: 2
  },
  style: { fill: "lightgreen", stroke: "darkgreen" }
});

artboard.add(rect);
```

### Square

```javascript
const square = new Square({
  size: 100,
  style: { fill: "lightyellow", stroke: "orange", strokeWidth: 2 }
});

artboard.add(square);
```

### Rectangle Anchor Points

```javascript
const rect = new Rect({
  width: 120,
  height: 80,
  style: { fill: "lightcoral", stroke: "darkred", strokeWidth: 2 }
});

artboard.add(rect);

// Access anchor points
const anchors = [
  { point: rect.topLeft, label: "TL" },
  { point: rect.topCenter, label: "TC" },
  { point: rect.topRight, label: "TR" },
  { point: rect.centerLeft, label: "CL" },
  { point: rect.center, label: "C" },
  { point: rect.centerRight, label: "CR" },
  { point: rect.bottomLeft, label: "BL" },
  { point: rect.bottomCenter, label: "BC" },
  { point: rect.bottomRight, label: "BR" }
];

anchors.forEach(({ point, label }) => {
  const dot = new Circle({ radius: 3, style: { fill: "red" } });
  dot.position({
    relativeFrom: dot.center,
    relativeTo: point,
    x: 0,
    y: 0
  });
  artboard.add(dot);
  
  const text = new Text({ content: label, fontSize: 10 });
  text.position({
    relativeFrom: text.center,
    relativeTo: point,
    x: 0,
    y: -15
  });
  artboard.add(text);
});
```

## Image

Embed images in diagrams.

### Basic Image

```javascript
const img = new Image({
  href: "path/to/image.png",
  width: 200,
  height: 150
});

artboard.add(img);
```

### Positioned Image

```javascript
const img = new Image({
  href: "diagram.svg",
  width: 300,
  height: 200
});

img.position({
  relativeFrom: img.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50
});

artboard.add(img);
```

### Image with Border

```javascript
const img = new Image({
  href: "photo.jpg",
  width: 250,
  height: 200,
  style: {
    stroke: "black",
    strokeWidth: 3
  }
});

artboard.add(img);
```

## Complete Examples

### Labeled Hexagon with Measurements

```javascript
const hexagon = new RegularPolygon({
  sides: 6,
  radius: 70,
  rotation: 30,
  style: { fill: "rgba(100, 150, 255, 0.2)", stroke: "navy", strokeWidth: 2 }
});

hexagon.position({
  relativeFrom: hexagon.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});

artboard.add(hexagon);

// Label vertices
const vertices = hexagon.absoluteVertices;
const vertexLabels = ["A", "B", "C", "D", "E", "F"];

vertices.forEach((vertex, i) => {
  const centerPos = hexagon.center;
  const dx = vertex.x - centerPos.x;
  const dy = vertex.y - centerPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * 25;
  const offsetY = (dy / dist) * 25;
  
  const label = new Text({
    content: vertexLabels[i],
    fontSize: 16,
    style: { fill: "navy" }
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: vertex,
    x: offsetX,
    y: offsetY
  });
  
  artboard.add(label);
});

// Draw and label radius
const radiusLine = new Line({
  start: { x: 0, y: 0 },
  end: { x: vertices[0].x - hexagon.center.x, y: vertices[0].y - hexagon.center.y },
  style: { stroke: "red", strokeWidth: 2, strokeDasharray: "4,4" }
});

radiusLine.position({
  relativeFrom: radiusLine.start,
  relativeTo: hexagon.center,
  x: 0,
  y: 0
});

artboard.add(radiusLine);

const radiusLabel = new Text({
  content: "$r = 70$",
  fontSize: 14
});

radiusLabel.position({
  relativeFrom: radiusLabel.center,
  relativeTo: hexagon.center,
  x: 40,
  y: -10
});

artboard.add(radiusLabel);

// Add side length label
const sideLengthLabel = new Text({
  content: `Side length: ${hexagon.sideLength.toFixed(1)}`,
  fontSize: 12
});

sideLengthLabel.position({
  relativeFrom: sideLengthLabel.topCenter,
  relativeTo: hexagon.center,
  x: 0,
  y: 100
});

artboard.add(sideLengthLabel);
```

### Bezier Curve Animation Path

```javascript
// Create a smooth path using multiple Bezier curves
const path1 = new BezierCurve({
  start: { x: 100, y: 200 },
  end: { x: 200, y: 150 },
  controlPoint1: { x: 130, y: 180 },
  controlPoint2: { x: 170, y: 160 },
  style: { stroke: "blue", strokeWidth: 3, fill: "none" }
});

const path2 = new BezierCurve({
  start: { x: 200, y: 150 },
  end: { x: 300, y: 180 },
  controlPoint1: { x: 230, y: 140 },
  controlPoint2: { x: 270, y: 160 },
  style: { stroke: "blue", strokeWidth: 3, fill: "none" }
});

const path3 = new BezierCurve({
  start: { x: 300, y: 180 },
  end: { x: 400, y: 200 },
  controlPoint1: { x: 330, y: 200 },
  controlPoint2: { x: 370, y: 210 },
  style: { stroke: "blue", strokeWidth: 3, fill: "none" }
});

artboard.add(path1);
artboard.add(path2);
artboard.add(path3);

// Mark the path endpoints
const marker = new Circle({
  radius: 6,
  style: { fill: "red" }
});

marker.position({
  relativeFrom: marker.center,
  relativeTo: { x: 100, y: 200 },
  x: 0,
  y: 0
});

artboard.add(marker);
```

## Best Practices

1. **Regular Polygons**
   - Use rotation to orient polygons appropriately
   - Access vertices for labeling and measurements
   - Calculate outward directions for label placement
   - Use apothem and side length for geometric problems

2. **Bezier Curves**
   - Use quadratic for simple curves (one control point)
   - Use cubic for complex S-curves (two control points)
   - Show control points for educational diagrams
   - Keep fill as "none" for curve paths

3. **Rectangles**
   - Use box model for padding/margin/border
   - Access anchor points for positioning
   - Use Rect for flexible rectangles, Square for equal sides

4. **Images**
   - Provide width and height explicitly
   - Use relative or absolute paths
   - Position using appropriate anchor points

## Common Calculations

### Polygon Interior Angle

```javascript
const sides = 6;
const interiorAngle = ((sides - 2) * 180) / sides;
console.log(`Interior angle: ${interiorAngle}°`);
```

### Polygon Area

```javascript
const hexagon = new RegularPolygon({ sides: 6, radius: 50 });
const area = (hexagon.sides * hexagon.sideLength * hexagon.apothem) / 2;
console.log(`Area: ${area}`);
```

### Bezier Point at Parameter t

```javascript
// Quadratic Bezier at parameter t (0 to 1)
function quadraticBezier(start, cp, end, t) {
  const x = (1-t)*(1-t)*start.x + 2*(1-t)*t*cp.x + t*t*end.x;
  const y = (1-t)*(1-t)*start.y + 2*(1-t)*t*cp.y + t*t*end.y;
  return { x, y };
}

// Cubic Bezier at parameter t
function cubicBezier(start, cp1, cp2, end, t) {
  const x = (1-t)*(1-t)*(1-t)*start.x + 3*(1-t)*(1-t)*t*cp1.x + 3*(1-t)*t*t*cp2.x + t*t*t*end.x;
  const y = (1-t)*(1-t)*(1-t)*start.y + 3*(1-t)*(1-t)*t*cp1.y + 3*(1-t)*t*t*cp2.y + t*t*t*end.y;
  return { x, y };
}
```

## Troubleshooting

**Polygon orientation wrong?**
- Adjust rotation parameter
- Check that rotation is in degrees (not radians)

**Bezier curve not smooth?**
- Adjust control point positions
- Use cubic Bezier for more complex curves
- Ensure fill is "none" for path curves

**Labels overlapping?**
- Calculate outward direction from center
- Increase offset distance
- Adjust font size

**Rectangle not showing?**
- Check width and height are positive
- Verify positioning
- Ensure stroke or fill is set

