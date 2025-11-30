# Circle Guide

## Overview

This guide covers the Circle element for creating circular shapes and working with circular geometry. Circles are one of the fundamental shapes in geometric diagrams.

## When to Use This Guide

- Creating circular shapes and diagrams
- Drawing pie charts or circular graphs
- Illustrating circle properties (radius, diameter, circumference)
- Creating concentric circles
- Positioning elements relative to circle perimeter
- Working with circular layouts

## Creating a Circle

### Basic Circle

```javascript
const circle = new Circle({
  radius: 50,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(circle);
```

### Styling Options

```javascript
// Filled circle
const filled = new Circle({
  radius: 40,
  style: { fill: "coral" }
});

// Outlined circle
const outlined = new Circle({
  radius: 40,
  style: { fill: "none", stroke: "blue", strokeWidth: 3 }
});

// Dashed circle
const dashed = new Circle({
  radius: 40,
  style: { 
    fill: "none", 
    stroke: "green", 
    strokeWidth: 2,
    strokeDasharray: "5,3"
  }
});

// Semi-transparent
const transparent = new Circle({
  radius: 40,
  style: { fill: "rgba(255, 100, 100, 0.5)" }
});
```

## Positioning

### Center Point

The circle's center is its primary reference point.

```javascript
const circle = new Circle({ radius: 50 });

// Position circle center at specific coordinates
circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});
```

### Cardinal Points

Circles have four cardinal points: top, right, bottom, left.

```javascript
const circle = new Circle({ radius: 50 });

// Get the cardinal points (after positioning)
const corners = circle.getCorners();
// corners[0]: top point
// corners[1]: right point
// corners[2]: bottom point
// corners[3]: left point

// Position text at the top of the circle
const label = new Text({ content: "N", fontSize: 14 });
label.position({
  relativeFrom: label.center,
  relativeTo: corners[0],
  x: 0,
  y: -10
});
artboard.add(label);
```

## Circle Properties

### Radius and Diameter

```javascript
const circle = new Circle({ radius: 50 });

// Access radius
console.log(circle.radius); // 50

// Show radius line
const radiusLine = new Line({
  start: { x: 0, y: 0 },
  end: { x: circle.radius, y: 0 },
  style: { stroke: "red", strokeWidth: 2 }
});

radiusLine.position({
  relativeFrom: radiusLine.start,
  relativeTo: circle.center,
  x: 0,
  y: 0
});

artboard.add(radiusLine);

// Label radius
const radiusLabel = new Text({ content: "$r$", fontSize: 14 });
radiusLabel.position({
  relativeFrom: radiusLabel.center,
  relativeTo: circle.center,
  x: circle.radius / 2,
  y: -10
});
artboard.add(radiusLabel);

// Show diameter
const diameterLine = new Line({
  start: { x: -circle.radius, y: 0 },
  end: { x: circle.radius, y: 0 },
  style: { stroke: "blue", strokeWidth: 2, strokeDasharray: "4,4" }
});

diameterLine.position({
  relativeFrom: { x: 0, y: 0 },
  relativeTo: circle.center,
  x: 0,
  y: 0
});

artboard.add(diameterLine);
```

## Advanced Patterns

### Concentric Circles

```javascript
const center = artboard.contentBox.center;

const radii = [30, 50, 70, 90];
radii.forEach((radius, index) => {
  const circle = new Circle({
    radius: radius,
    style: {
      fill: "none",
      stroke: `hsl(${index * 30}, 70%, 50%)`,
      strokeWidth: 2
    }
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: center,
    x: 0,
    y: 0
  });
  
  artboard.add(circle);
});
```

### Circle with Sector

```javascript
// Main circle
const circle = new Circle({
  radius: 60,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(circle);

// Draw a sector (pie slice) using lines and arc
// This requires calculating points on the circle perimeter

const centerPos = circle.center;
const radius = circle.radius;
const angle1 = 0;      // Start angle in degrees
const angle2 = 60;     // End angle in degrees

// Convert to radians
const rad1 = angle1 * Math.PI / 180;
const rad2 = angle2 * Math.PI / 180;

// Calculate points on perimeter
const point1 = {
  x: centerPos.x + radius * Math.cos(rad1),
  y: centerPos.y + radius * Math.sin(rad1)
};

const point2 = {
  x: centerPos.x + radius * Math.cos(rad2),
  y: centerPos.y + radius * Math.sin(rad2)
};

// Draw lines from center to perimeter
const line1 = new Line({
  start: { x: 0, y: 0 },
  end: { x: point1.x - centerPos.x, y: point1.y - centerPos.y },
  style: { stroke: "red", strokeWidth: 2 }
});

line1.position({
  relativeFrom: line1.start,
  relativeTo: centerPos,
  x: 0,
  y: 0
});

artboard.add(line1);

const line2 = new Line({
  start: { x: 0, y: 0 },
  end: { x: point2.x - centerPos.x, y: point2.y - centerPos.y },
  style: { stroke: "red", strokeWidth: 2 }
});

line2.position({
  relativeFrom: line2.start,
  relativeTo: centerPos,
  x: 0,
  y: 0
});

artboard.add(line2);
```

### Points on Circle Perimeter

```javascript
const circle = new Circle({ radius: 60 });
const centerPos = circle.center;

// Place 8 points evenly around the circle
const numPoints = 8;
for (let i = 0; i < numPoints; i++) {
  const angle = (i * 360 / numPoints) * Math.PI / 180;
  const x = centerPos.x + circle.radius * Math.cos(angle);
  const y = centerPos.y + circle.radius * Math.sin(angle);
  
  const point = new Circle({
    radius: 4,
    style: { fill: "red" }
  });
  
  point.position({
    relativeFrom: point.center,
    relativeTo: { x, y },
    x: 0,
    y: 0
  });
  
  artboard.add(point);
}
```

### Circle with Chord

```javascript
const circle = new Circle({
  radius: 60,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(circle);

const centerPos = circle.center;
const radius = circle.radius;

// Two points on the circle
const angle1 = 30 * Math.PI / 180;
const angle2 = 150 * Math.PI / 180;

const point1 = {
  x: centerPos.x + radius * Math.cos(angle1),
  y: centerPos.y + radius * Math.sin(angle1)
};

const point2 = {
  x: centerPos.x + radius * Math.cos(angle2),
  y: centerPos.y + radius * Math.sin(angle2)
};

// Draw chord (line connecting two points on circle)
const chord = new Line({
  start: { x: 0, y: 0 },
  end: { x: point2.x - point1.x, y: point2.y - point1.y },
  style: { stroke: "red", strokeWidth: 2 }
});

chord.position({
  relativeFrom: chord.start,
  relativeTo: point1,
  x: 0,
  y: 0
});

artboard.add(chord);

// Label the chord
const chordLabel = new Text({ content: "$c$", fontSize: 14 });
chordLabel.position({
  relativeFrom: chordLabel.center,
  relativeTo: chord.center,
  x: 0,
  y: -15
});
artboard.add(chordLabel);
```

### Circle with Tangent Line

```javascript
const circle = new Circle({
  radius: 50,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(circle);

const centerPos = circle.center;
const radius = circle.radius;

// Point of tangency at 45 degrees
const angle = 45 * Math.PI / 180;
const tangentPoint = {
  x: centerPos.x + radius * Math.cos(angle),
  y: centerPos.y + radius * Math.sin(angle)
};

// Tangent line is perpendicular to radius at this point
// Direction perpendicular to radius
const tangentAngle = angle + Math.PI / 2;
const tangentLength = 80;

const tangentLine = new Line({
  start: { x: -tangentLength / 2, y: 0 },
  end: { x: tangentLength / 2, y: 0 },
  style: { stroke: "green", strokeWidth: 2 }
});

// Position and rotate the tangent line
tangentLine.position({
  relativeFrom: tangentLine.center,
  relativeTo: tangentPoint,
  x: 0,
  y: 0
});

tangentLine.rotate(angle * 180 / Math.PI + 90);

artboard.add(tangentLine);

// Draw radius to tangent point
const radiusLine = new Line({
  start: { x: 0, y: 0 },
  end: { x: tangentPoint.x - centerPos.x, y: tangentPoint.y - centerPos.y },
  style: { stroke: "red", strokeWidth: 1.5, strokeDasharray: "3,3" }
});

radiusLine.position({
  relativeFrom: radiusLine.start,
  relativeTo: centerPos,
  x: 0,
  y: 0
});

artboard.add(radiusLine);
```

## Complete Example: Labeled Circle

```javascript
// Create main circle
const circle = new Circle({
  radius: 70,
  style: { fill: "rgba(100, 150, 255, 0.2)", stroke: "navy", strokeWidth: 2 }
});

artboard.add(circle);

const centerPos = circle.center;
const radius = circle.radius;

// Draw and label radius
const radiusLine = new Line({
  start: { x: 0, y: 0 },
  end: { x: radius, y: 0 },
  style: { stroke: "red", strokeWidth: 2 }
});

radiusLine.position({
  relativeFrom: radiusLine.start,
  relativeTo: centerPos,
  x: 0,
  y: 0
});

artboard.add(radiusLine);

const radiusLabel = new Text({ content: "$r = 70$", fontSize: 14 });
radiusLabel.position({
  relativeFrom: radiusLabel.center,
  relativeTo: centerPos,
  x: radius / 2,
  y: -12
});
artboard.add(radiusLabel);

// Draw and label diameter
const diameterLine = new Line({
  start: { x: -radius, y: 0 },
  end: { x: radius, y: 0 },
  style: { stroke: "blue", strokeWidth: 1.5, strokeDasharray: "4,4" }
});

diameterLine.position({
  relativeFrom: diameterLine.start,
  relativeTo: { x: centerPos.x - radius, y: centerPos.y },
  x: 0,
  y: 0
});

artboard.add(diameterLine);

const diameterLabel = new Text({ content: "$d = 140$", fontSize: 14 });
diameterLabel.position({
  relativeFrom: diameterLabel.center,
  relativeTo: centerPos,
  x: 0,
  y: 25
});
artboard.add(diameterLabel);

// Mark center point
const centerDot = new Circle({
  radius: 3,
  style: { fill: "black" }
});

centerDot.position({
  relativeFrom: centerDot.center,
  relativeTo: centerPos,
  x: 0,
  y: 0
});

artboard.add(centerDot);

const centerLabel = new Text({ content: "$O$", fontSize: 14 });
centerLabel.position({
  relativeFrom: centerLabel.center,
  relativeTo: centerPos,
  x: -15,
  y: -15
});
artboard.add(centerLabel);
```

## Best Practices

1. **Use center for positioning** - The center is the natural reference point
2. **Calculate perimeter points** - Use trigonometry for points on circumference
3. **Mark center** - Use a small dot to indicate the center point
4. **Label radius** - Show radius with a line from center to perimeter
5. **Use angles in radians** - JavaScript trig functions use radians (convert from degrees)
6. **Concentric circles** - Share the same center point
7. **Cardinal points** - Use getCorners() for top, right, bottom, left positions

## Common Formulas

### Converting Degrees to Radians

```javascript
const degrees = 45;
const radians = degrees * Math.PI / 180;
```

### Point on Circle at Angle

```javascript
const angle = 30; // degrees
const rad = angle * Math.PI / 180;
const x = centerX + radius * Math.cos(rad);
const y = centerY + radius * Math.sin(rad);
```

### Circle Circumference

```javascript
const circumference = 2 * Math.PI * radius;
```

### Circle Area

```javascript
const area = Math.PI * radius * radius;
```

## Troubleshooting

**Circle not showing?**
- Check radius is positive
- Ensure circle is added to artboard
- Verify positioning

**Points not on perimeter?**
- Ensure angle calculations are correct
- Convert degrees to radians
- Check center position is absolute

**Overlapping circles?**
- Verify different center positions
- Check z-order (render order)

