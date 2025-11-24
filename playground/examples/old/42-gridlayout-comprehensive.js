// Example 42: GridLayout - Comprehensive Testing
// Tests all GridLayout features and edge cases
import { Artboard, GridLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1200 },
  backgroundColor: "#ecf0f1",
  padding: "30px",
});

// Test 1: Alignment variations (left-top, center-center, right-bottom)
const grid1 = new GridLayout({
  columns: 3,
  rows: 3,
  width: 380,
  height: 320,
  gap: 10,
  horizontalAlign: "left",
  verticalAlign: "top",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

for (let i = 0; i < 9; i++) {
  const circle = new Circle({
    radius: 20,
    style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2px" },
  });
  grid1.addElement(circle);
}

grid1.position({
  relativeFrom: grid1.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 0,
});

const label1 = new Text({
  content: "Left-Top Alignment",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label1.position({
  relativeFrom: label1.bottomLeft,
  relativeTo: grid1.topLeft,
  x: 0,
  y: -5,
});

// Test 2: Center alignment with varying sizes
const grid2 = new GridLayout({
  columns: 3,
  rows: 3,
  width: 380,
  height: 320,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

for (let i = 0; i < 9; i++) {
  const size = 15 + (i % 3) * 10;
  const rect = new Rectangle({
    width: size * 2,
    height: size * 1.5,
    style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2px" },
  });
  grid2.addElement(rect);
}

grid2.position({
  relativeFrom: grid2.topLeft,
  relativeTo: grid1.topRight,
  x: 30,
  y: 0,
});

const label2 = new Text({
  content: "Center-Center (varying sizes)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label2.position({
  relativeFrom: label2.bottomLeft,
  relativeTo: grid2.topLeft,
  x: 0,
  y: -5,
});

// Test 3: Right-Bottom alignment
const grid3 = new GridLayout({
  columns: 3,
  rows: 3,
  width: 380,
  height: 320,
  gap: 10,
  horizontalAlign: "right",
  verticalAlign: "bottom",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

for (let i = 0; i < 9; i++) {
  const circle = new Circle({
    radius: 25,
    style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: "2px" },
  });
  grid3.addElement(circle);
}

grid3.position({
  relativeFrom: grid3.topLeft,
  relativeTo: grid2.topRight,
  x: 30,
  y: 0,
});

const label3 = new Text({
  content: "Right-Bottom Alignment",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label3.position({
  relativeFrom: label3.bottomLeft,
  relativeTo: grid3.topLeft,
  x: 0,
  y: -5,
});

// Test 4: Custom gaps (column vs row)
const grid4 = new GridLayout({
  columns: 4,
  rows: 2,
  width: 475,
  height: 165,
  columnGap: 25,
  rowGap: 5,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

for (let i = 0; i < 8; i++) {
  const rect = new Rectangle({
    width: 60,
    height: 40,
    cornerRadius: 8,
    style: { fill: "#f39c12", stroke: "#d68910", strokeWidth: "2px" },
  });
  grid4.addElement(rect);
}

grid4.position({
  relativeFrom: grid4.topLeft,
  relativeTo: grid1.bottomLeft,
  x: 0,
  y: 40,
});

const label4 = new Text({
  content: "Custom Gaps (col:25px, row:5px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label4.position({
  relativeFrom: label4.bottomLeft,
  relativeTo: grid4.topLeft,
  x: 0,
  y: -5,
});

// Test 5: Mixed alignment (left-center)
const grid5 = new GridLayout({
  columns: 4,
  rows: 2,
  width: 430,
  height: 170,
  gap: 10,
  horizontalAlign: "left",
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

for (let i = 0; i < 8; i++) {
  const text = new Text({
    content: `${i + 1}`,
    fontSize: 24,
    fontWeight: "bold",
    style: { fill: "#9b59b6" },
  });
  grid5.addElement(text);
}

grid5.position({
  relativeFrom: grid5.topLeft,
  relativeTo: grid4.bottomLeft,
  x: 0,
  y: 40,
});

const label5 = new Text({
  content: "Left-Center (Text elements)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label5.position({
  relativeFrom: label5.bottomLeft,
  relativeTo: grid5.topLeft,
  x: 0,
  y: -5,
});

// Test 6: Auto-calculated grid (only columns specified)
const grid6 = new GridLayout({
  columns: 5,
  width: 332,
  height: 252,
  gap: 8,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
  debugShowCells: true,
});

// Add 17 elements - will create 5x4 grid
for (let i = 0; i < 17; i++) {
  const circle = new Circle({
    radius: 18,
    style: { fill: "#1abc9c", stroke: "#16a085", strokeWidth: "2px" },
  });
  grid6.addElement(circle);
}

grid6.position({
  relativeFrom: grid6.topLeft,
  relativeTo: grid5.bottomLeft,
  x: 0,
  y: 40,
});

const label6 = new Text({
  content: "Auto rows (5 cols, 17 items → 5x4)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label6.position({
  relativeFrom: label6.bottomLeft,
  relativeTo: grid6.topLeft,
  x: 0,
  y: -5,
});

// Main title
const title = new Text({
  content: "GridLayout Comprehensive Test Suite",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.paddedArea.topCenter,
  x: 0,
  y: 0,
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
artboard.addElement(grid5);
artboard.addElement(label5);
artboard.addElement(grid6);
artboard.addElement(label6);
artboard.addElement(title);

artboard.render();

