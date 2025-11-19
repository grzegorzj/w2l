// Example 35: Text Grid Debug - Visualize Grid Cells
// Shows grid cells as rectangles to debug Text positioning
import { Artboard, GridLayout, Text, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 1200, height: 800 },
  backgroundColor: "#2c3e50",
});

// Test 1: Simple 3x2 grid with text - show grid cells
const grid1 = new GridLayout({
  columns: 3,
  rows: 2,
  width: 450,
  height: 300,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add text elements
const labels = ["A", "B", "C", "D", "E", "F"];
for (let i = 0; i < 6; i++) {
  const text = new Text({
    content: labels[i],
    fontSize: 32,
    style: { fill: "#e74c3c", fontWeight: "bold" },
  });
  grid1.addElement(text);
}

grid1.position({
  relativeFrom: grid1.center,
  relativeTo: artboard.center,
  x: -280,
  y: -180,
});

const title1 = new Text({
  content: "Text in Grid (Fixed)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title1.position({
  relativeFrom: title1.center,
  relativeTo: grid1.topCenter,
  x: 0,
  y: -30,
});

// Test 2: Grid with circles for comparison
const grid2 = new GridLayout({
  columns: 3,
  rows: 2,
  width: 450,
  height: 300,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 6; i++) {
  const circle = new Circle({
    radius: 30,
    style: {
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: "2",
    },
  });
  grid2.addElement(circle);
}

grid2.position({
  relativeFrom: grid2.center,
  relativeTo: artboard.center,
  x: 280,
  y: -180,
});

const title2 = new Text({
  content: "Circles in Grid (Reference)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title2.position({
  relativeFrom: title2.center,
  relativeTo: grid2.topCenter,
  x: 0,
  y: -30,
});

// Test 3: Mixed grid with debug visualization
const grid3 = new GridLayout({
  columns: 4,
  rows: 2,
  width: 560,
  height: 240,
  gap: 8,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Alternate between text and circles
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0) {
    const text = new Text({
      content: String.fromCharCode(65 + i / 2), // A, B, C, D
      fontSize: 28,
      style: {
        fill: "#2ecc71",
        fontWeight: "bold",
      },
    });
    grid3.addElement(text);
  } else {
    const circle = new Circle({
      radius: 25,
      style: {
        fill: "#f39c12",
        stroke: "#d68910",
        strokeWidth: "2",
      },
    });
    grid3.addElement(circle);
  }
}

grid3.position({
  relativeFrom: grid3.center,
  relativeTo: artboard.center,
  x: 0,
  y: 180,
});

const title3 = new Text({
  content: "Mixed: Text & Circles (Should Align)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title3.position({
  relativeFrom: title3.center,
  relativeTo: grid3.topCenter,
  x: 0,
  y: -30,
});

// Add description
const description = new Text({
  content: "Text should now be centered in grid cells, just like circles",
  fontSize: 16,
  style: { fill: "#95a5a6" },
});

description.position({
  relativeFrom: description.center,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: -30,
});

// Add all to artboard
artboard.addElement(grid1);
artboard.addElement(title1);
artboard.addElement(grid2);
artboard.addElement(title2);
artboard.addElement(grid3);
artboard.addElement(title3);
artboard.addElement(description);

// Main title
const mainTitle = new Text({
  content: "Grid Text Positioning - Fixed",
  fontSize: 24,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 30,
});

artboard.addElement(mainTitle);

artboard.render();

