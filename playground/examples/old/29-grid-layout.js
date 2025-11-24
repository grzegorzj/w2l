// Example 29: Grid Layout
// Demonstrates arranging elements in a grid with various configurations
import { Artboard, GridLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  backgroundColor: "#2c3e50",
});

// Example 1: 3x3 Grid with gaps
const grid1 = new GridLayout({
  columns: 3,
  rows: 3,
  width: 350,
  height: 350,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add 9 circles with varying sizes
for (let i = 0; i < 9; i++) {
  const radius = 30 + (i % 3) * 5;
  const circle = new Circle({
    radius,
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: "2",
    },
  });
  grid1.addElement(circle);
}

grid1.position({
  relativeFrom: grid1.center,
  relativeTo: artboard.center,
  x: -480,
  y: -200,
});

const label1 = new Text({
  content: "3x3 Grid - Center Aligned",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: grid1.topCenter,
  x: 0,
  y: -30,
});

// Example 2: 4x2 Grid with rectangles
const grid2 = new GridLayout({
  columns: 4,
  rows: 2,
  width: 450,
  height: 220,
  columnGap: 15,
  rowGap: 20,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 8; i++) {
  const rect = new Rectangle({
    width: 60,
    height: 60,
    cornerStyle: "rounded",
    cornerRadius: 10,
    style: {
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: "2",
    },
  });
  grid2.addElement(rect);
}

grid2.position({
  relativeFrom: grid2.center,
  relativeTo: artboard.center,
  x: 20,
  y: -200,
});

const label2 = new Text({
  content: "4x2 Grid - Custom Gaps",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: grid2.topCenter,
  x: 0,
  y: -30,
});

// Example 3: Auto-calculated rows (5 columns, auto rows)
const grid3 = new GridLayout({
  columns: 5,
  // rows auto-calculated based on element count
  width: 600,
  height: 280,
  gap: 12,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add 13 elements - will create 5x3 grid
for (let i = 0; i < 13; i++) {
  const circle = new Circle({
    radius: 25,
    style: {
      fill: "#2ecc71",
      stroke: "#27ae60",
      strokeWidth: "2",
    },
  });
  grid3.addElement(circle);
}

grid3.position({
  relativeFrom: grid3.center,
  relativeTo: artboard.center,
  x: -200,
  y: 200,
});

const label3 = new Text({
  content: "5 Columns - Auto Rows (13 items)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: grid3.topCenter,
  x: 0,
  y: -30,
});

// Example 4: Square grid (auto-calculated)
const grid4 = new GridLayout({
  // Both columns and rows auto-calculated to be square-ish
  width: 320,
  height: 320,
  gap: 8,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add 16 elements - will create 4x4 grid
for (let i = 0; i < 16; i++) {
  const rect = new Rectangle({
    width: 50,
    height: 50,
    style: {
      fill: "#f39c12",
      stroke: "#d68910",
      strokeWidth: "2",
    },
  });
  grid4.addElement(rect);
}

grid4.position({
  relativeFrom: grid4.center,
  relativeTo: artboard.center,
  x: 480,
  y: 200,
});

const label4 = new Text({
  content: "Auto Grid (16 items → 4x4)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: grid4.topCenter,
  x: 0,
  y: -30,
});

// Add all to artboard
artboard.addElement(grid1);
artboard.addElement(label1);
artboard.addElement(grid2);
artboard.addElement(label2);
artboard.addElement(grid3);
artboard.addElement(label3);
artboard.addElement(grid4);
artboard.addElement(label4);

artboard.render();

