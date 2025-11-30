# Line Guide

## Overview

This guide covers the Line element for creating straight line segments between two points. Lines are fundamental for geometric diagrams, connecting elements, and creating constructions.

## When to Use This Guide

- Connecting two points
- Drawing geometric constructions (altitudes, medians, etc.)
- Creating axes and grids
- Showing relationships between elements
- Labeling line segments
- Drawing rays or line segments

## Creating a Line

### Basic Line

```javascript
const line = new Line({
  start: { x: 0, y: 0 },     // Starting point (relative)
  end: { x: 100, y: 50 },    // Ending point (relative offset from start)
  style: { stroke: "black", strokeWidth: 2 }
});

artboard.add(line);
```

**Important:** The `end` point is a relative offset from the `start` point, not an absolute position.

### Line Styles

```javascript
// Solid line
const solid = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { stroke: "black", strokeWidth: 2 }
});

// Dashed line
const dashed = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { 
    stroke: "blue", 
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

// Dotted line
const dotted = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { 
    stroke: "red", 
    strokeWidth: 2,
    strokeDasharray: "2,3"
  }
});

// Thick line
const thick = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { stroke: "green", strokeWidth: 5 }
});

// Colored line
const colored = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { 
    stroke: "rgba(255, 100, 100, 0.8)", 
    strokeWidth: 3 
  }
});
```

## Positioning Lines

### Absolute Positioning

Position the line's start point at specific coordinates.

```javascript
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 50 }
});

// Position start point at (50, 50) on artboard
line.position({
  relativeFrom: line.start,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50
});

artboard.add(line);
```

### Connecting Two Elements

Draw a line between two shapes.

```javascript
const circle1 = new Circle({ radius: 20, style: { fill: "blue" } });
const circle2 = new Circle({ radius: 20, style: { fill: "red" } });

// Position circles
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: artboard.contentBox.center,
  x: -60,
  y: 0
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: artboard.contentBox.center,
  x: 60,
  y: 0
});

artboard.add(circle1);
artboard.add(circle2);

// Draw line connecting their centers
const line = new Line({
  start: { x: 0, y: 0 },
  end: { 
    x: circle2.center.x - circle1.center.x, 
    y: circle2.center.y - circle1.center.y 
  },
  style: { stroke: "black", strokeWidth: 2 }
});

line.position({
  relativeFrom: line.start,
  relativeTo: circle1.center,
  x: 0,
  y: 0
});

artboard.add(line);
```

### Line from Point to Point

```javascript
// Define two points
const pointA = { x: 100, y: 100 };
const pointB = { x: 250, y: 180 };

// Create line between them
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: pointB.x - pointA.x, y: pointB.y - pointA.y },
  style: { stroke: "navy", strokeWidth: 2 }
});

line.position({
  relativeFrom: line.start,
  relativeTo: pointA,
  x: 0,
  y: 0
});

artboard.add(line);
```

## Line Properties

### Get Line Endpoints

```javascript
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 50 }
});

// After positioning, get absolute coordinates
const startPoint = line.start;
const endPoint = line.end;

console.log(startPoint);  // Absolute position of start
console.log(endPoint);    // Absolute position of end
```

### Get Line Center

```javascript
const lineCenter = line.center;
console.log(lineCenter);  // Midpoint of the line
```

### Get Line Length

```javascript
const length = line.length;
console.log(length);  // Length in pixels
```

### Get Line Angle

```javascript
const angle = line.angle;
console.log(angle);  // Angle in degrees (0° = horizontal right)
```

### Get Line Direction

```javascript
const direction = line.direction;
console.log(direction);  // Unit vector in line's direction
```

### Get Line Normal

```javascript
const normal = line.normal;
console.log(normal);  // Unit vector perpendicular to line
```

## Labeling Lines

### Create Line Label

```javascript
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 120, y: 0 },
  style: { stroke: "navy", strokeWidth: 2 }
});

artboard.add(line);

// Create label at line center
const label = line.createLabel("$d$", {
  offset: 15,           // Distance from line (default: 10)
  fontSize: 14,         // Font size (default: 16)
  side: 'above'         // Position: 'left', 'right', 'above', 'below'
});

artboard.add(label);
```

**Label Positioning Options:**
- `side: 'left'` - Left of the line (relative to start → end direction)
- `side: 'right'` - Right of the line (relative to start → end direction)
- `side: 'above'` - Above the line (perpendicular up)
- `side: 'below'` - Below the line (perpendicular down)

### Multiple Labels

```javascript
// Label showing length
const lengthLabel = line.createLabel(`${line.length.toFixed(0)} px`, {
  offset: 12,
  side: 'above'
});

artboard.add(lengthLabel);

// Label showing name
const nameLabel = line.createLabel("$AB$", {
  offset: 12,
  side: 'below'
});

artboard.add(nameLabel);
```

## Advanced Patterns

### Perpendicular Lines

```javascript
// Horizontal line
const line1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: 100, y: 0 },
  style: { stroke: "blue", strokeWidth: 2 }
});

artboard.add(line1);

// Perpendicular line at center
const perpendicular = new Line({
  start: { x: 0, y: -40 },
  end: { x: 0, y: 40 },
  style: { stroke: "red", strokeWidth: 2 }
});

perpendicular.position({
  relativeFrom: { x: 0, y: 0 },
  relativeTo: line1.center,
  x: 0,
  y: 0
});

artboard.add(perpendicular);

// Mark right angle with a small square
const squareSize = 10;
const rightAngleMarker = new Rect({
  width: squareSize,
  height: squareSize,
  style: { fill: "none", stroke: "black", strokeWidth: 1 }
});

rightAngleMarker.position({
  relativeFrom: rightAngleMarker.center,
  relativeTo: line1.center,
  x: squareSize / 2,
  y: -squareSize / 2
});

artboard.add(rightAngleMarker);
```

### Line with Endpoints Marked

```javascript
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 120, y: 60 },
  style: { stroke: "navy", strokeWidth: 2 }
});

artboard.add(line);

// Mark endpoints with circles
const startDot = new Circle({
  radius: 4,
  style: { fill: "red" }
});

startDot.position({
  relativeFrom: startDot.center,
  relativeTo: line.start,
  x: 0,
  y: 0
});

artboard.add(startDot);

const endDot = new Circle({
  radius: 4,
  style: { fill: "blue" }
});

endDot.position({
  relativeFrom: endDot.center,
  relativeTo: line.end,
  x: 0,
  y: 0
});

artboard.add(endDot);

// Label endpoints
const startLabel = new Text({ content: "$A$", fontSize: 14 });
startLabel.position({
  relativeFrom: startLabel.center,
  relativeTo: line.start,
  x: -15,
  y: 0
});
artboard.add(startLabel);

const endLabel = new Text({ content: "$B$", fontSize: 14 });
endLabel.position({
  relativeFrom: endLabel.center,
  relativeTo: line.end,
  x: 15,
  y: 0
});
artboard.add(endLabel);
```

### Parallel Lines

```javascript
// First line
const line1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: 120, y: 0 },
  style: { stroke: "blue", strokeWidth: 2 }
});

line1.position({
  relativeFrom: line1.start,
  relativeTo: artboard.contentBox.center,
  x: -60,
  y: -20
});

artboard.add(line1);

// Parallel line (same direction, different position)
const line2 = new Line({
  start: { x: 0, y: 0 },
  end: { x: 120, y: 0 },
  style: { stroke: "red", strokeWidth: 2 }
});

line2.position({
  relativeFrom: line2.start,
  relativeTo: artboard.contentBox.center,
  x: -60,
  y: 20
});

artboard.add(line2);
```

### Line Segment with Midpoint

```javascript
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 140, y: 80 },
  style: { stroke: "navy", strokeWidth: 2 }
});

artboard.add(line);

// Mark midpoint
const midpoint = new Circle({
  radius: 4,
  style: { fill: "red" }
});

midpoint.position({
  relativeFrom: midpoint.center,
  relativeTo: line.center,
  x: 0,
  y: 0
});

artboard.add(midpoint);

const midpointLabel = new Text({ content: "$M$", fontSize: 14 });
midpointLabel.position({
  relativeFrom: midpointLabel.center,
  relativeTo: line.center,
  x: 0,
  y: -15
});
artboard.add(midpointLabel);
```

### Ray (Line with Arrowhead)

```javascript
// Create line
const ray = new Line({
  start: { x: 0, y: 0 },
  end: { x: 120, y: 0 },
  style: { 
    stroke: "blue", 
    strokeWidth: 2,
    markerEnd: "url(#arrow)"
  }
});

// Note: Arrow markers require SVG marker definitions
// For simple arrows, draw a small triangle at the end point

const arrowSize = 8;
const angle = ray.angle * Math.PI / 180;

const arrowTip = ray.end;
const arrowBase1 = {
  x: arrowTip.x - arrowSize * Math.cos(angle - Math.PI / 6),
  y: arrowTip.y - arrowSize * Math.sin(angle - Math.PI / 6)
};
const arrowBase2 = {
  x: arrowTip.x - arrowSize * Math.cos(angle + Math.PI / 6),
  y: arrowTip.y - arrowSize * Math.sin(angle + Math.PI / 6)
};

// Draw arrow as a small triangle
// (This would require a custom path or polygon element)
```

## Complete Example: Labeled Line Segment

```javascript
// Create the line segment
const line = new Line({
  start: { x: 0, y: 0 },
  end: { x: 150, y: 0 },
  style: { stroke: "navy", strokeWidth: 2 }
});

line.position({
  relativeFrom: line.start,
  relativeTo: artboard.contentBox.center,
  x: -75,
  y: 0
});

artboard.add(line);

// Mark endpoints
const pointA = new Circle({ radius: 4, style: { fill: "red" } });
pointA.position({
  relativeFrom: pointA.center,
  relativeTo: line.start,
  x: 0,
  y: 0
});
artboard.add(pointA);

const pointB = new Circle({ radius: 4, style: { fill: "red" } });
pointB.position({
  relativeFrom: pointB.center,
  relativeTo: line.end,
  x: 0,
  y: 0
});
artboard.add(pointB);

// Label endpoints
const labelA = new Text({ content: "$A$", fontSize: 16 });
labelA.position({
  relativeFrom: labelA.center,
  relativeTo: line.start,
  x: 0,
  y: -20
});
artboard.add(labelA);

const labelB = new Text({ content: "$B$", fontSize: 16 });
labelB.position({
  relativeFrom: labelB.center,
  relativeTo: line.end,
  x: 0,
  y: -20
});
artboard.add(labelB);

// Label the line segment
const segmentLabel = line.createLabel("$d = 150$", {
  offset: 10,
  side: 'below',
  fontSize: 14
});
artboard.add(segmentLabel);

// Mark midpoint
const midpoint = new Circle({ radius: 3, style: { fill: "blue" } });
midpoint.position({
  relativeFrom: midpoint.center,
  relativeTo: line.center,
  x: 0,
  y: 0
});
artboard.add(midpoint);

const midLabel = new Text({ content: "$M$", fontSize: 14 });
midLabel.position({
  relativeFrom: midLabel.center,
  relativeTo: line.center,
  x: 0,
  y: 15
});
artboard.add(midLabel);
```

## Best Practices

1. **Use relative offsets** - End point is relative to start point
2. **Position from start** - Position lines using their start point
3. **Label with createLabel()** - Use built-in labeling for consistency
4. **Mark endpoints** - Use small circles to mark important points
5. **Use appropriate styles** - Dashed for auxiliary lines, solid for main lines
6. **Calculate properly** - When connecting points, subtract coordinates
7. **Consider line direction** - For labels, 'left'/'right' are relative to direction
8. **Use normals** - For perpendicular constructions, use line.normal

## Common Calculations

### Line Length

```javascript
const dx = end.x - start.x;
const dy = end.y - start.y;
const length = Math.sqrt(dx * dx + dy * dy);
```

### Line Angle

```javascript
const angle = Math.atan2(dy, dx) * 180 / Math.PI;
```

### Point on Line

```javascript
// Point at parameter t (0 = start, 1 = end, 0.5 = midpoint)
const t = 0.5;
const point = {
  x: start.x + t * (end.x - start.x),
  y: start.y + t * (end.y - start.y)
};
```

### Perpendicular Direction

```javascript
// Rotate direction 90 degrees
const perpendicular = {
  x: -direction.y,
  y: direction.x
};
```

## Troubleshooting

**Line not showing?**
- Check that strokeWidth > 0
- Verify stroke color is not "none"
- Ensure line is added to artboard
- Check positioning

**Line in wrong place?**
- Remember end is relative offset from start
- Check relativeFrom/relativeTo in position()
- Verify absolute positions of referenced elements

**Label not positioned correctly?**
- Try different side values ('left', 'right', 'above', 'below')
- Adjust offset distance
- Check line direction

**Lines not connecting properly?**
- Calculate relative offset correctly (endPos - startPos)
- Ensure referenced positions are absolute

