/**
 * Shapes Example: Debug Alignment with Circles
 * 
 * Tests alignment with 2 columns and 2 identical circles per column
 */

import { Artboard, Circle, Columns } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f5f5f5",
  boxModel: { padding: 40 },
});

// Create 2 columns with identical circles
const columns = new Columns({
  count: 2,
  columnWidth: 250,
  height: 500,
  gutter: 30,
  verticalAlignment: "bottom", // BOTTOM alignment (should push circles to bottom)
  horizontalAlignment: "left", // LEFT alignment (should align circles to left)
  columnSpacing: 20,
  
  // Main container style (outer wrapper)
  style: {
    fill: "#ecf0f1",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
  boxModel: { padding: 20 },
  
  // Individual column styles (debugging outlines)
  columnStyle: {
    fill: "#e8f8f5",  // Light green tint
    stroke: "#1abc9c", // Green outline
    strokeWidth: 2,
    strokeDasharray: "5,5", // Dashed line
  },
  columnBoxModel: { padding: 10 },
});

columns.container.position({
  relativeFrom: columns.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(columns.container);

// Column 1: Two identical circles
const circle1 = new Circle({
  radius: 60,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});

const circle2 = new Circle({
  radius: 60,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});

columns.getColumn(0).addElement(circle1);
columns.getColumn(0).addElement(circle2);

// Column 2: Two identical circles
const circle3 = new Circle({
  radius: 60,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3,
  },
});

const circle4 = new Circle({
  radius: 60,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 3,
  },
});

columns.getColumn(1).addElement(circle3);
columns.getColumn(1).addElement(circle4);

// Add debug markers for column content boxes
function createDebugCircle(position, color, radius) {
  const circle = new Circle({
    radius: radius,
    style: {
      fill: color,
      stroke: "white",
      strokeWidth: 1,
    },
  });
  circle.position({
    relativeFrom: circle.center,
    relativeTo: position,
    x: 0,
    y: 0,
  });
  return circle;
}

// Mark the four corners of each column's content box
const col0 = columns.getColumn(0);
const col1 = columns.getColumn(1);

// Column 0 content box corners (pink)
artboard.addElement(createDebugCircle(col0.contentBox.topLeft, "#ff1493", 5));
artboard.addElement(createDebugCircle(col0.contentBox.topRight, "#ff1493", 5));
artboard.addElement(createDebugCircle(col0.contentBox.bottomLeft, "#ff1493", 5));
artboard.addElement(createDebugCircle(col0.contentBox.bottomRight, "#ff1493", 5));

// Column 1 content box corners (cyan)
artboard.addElement(createDebugCircle(col1.contentBox.topLeft, "#00ffff", 5));
artboard.addElement(createDebugCircle(col1.contentBox.topRight, "#00ffff", 5));
artboard.addElement(createDebugCircle(col1.contentBox.bottomLeft, "#00ffff", 5));
artboard.addElement(createDebugCircle(col1.contentBox.bottomRight, "#00ffff", 5));

console.log("=== DEBUG INFO ===");
console.log("Column 0 content height:", col0.contentHeight);
console.log("Column 0 content width:", col0.contentWidth);
console.log("Circle 1 position:", circle1.getAbsolutePosition());
console.log("Circle 2 position:", circle2.getAbsolutePosition());
console.log("Column 0 content box bottom:", col0.contentBox.bottomLeft.y);
console.log("Circle 2 bottom (center.y + radius):", circle2.center.y + 60);

return artboard.render();

