// Example 36: Grid Debug - Visualize Cell Boundaries
// Demonstrates the debugShowCells feature to see grid cell boundaries
import { Artboard, GridLayout, Text, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 1200, height: 900 },
  backgroundColor: "#2c3e50",
});

// Grid 1: Text with debug cells ON
const grid1 = new GridLayout({
  columns: 3,
  rows: 2,
  width: 480,
  height: 320,
  gap: 12,
  horizontalAlign: "center",
  verticalAlign: "center",
  debugShowCells: true,  // Show cell boundaries
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const labels = ["A", "B", "C", "D", "E", "F"];
for (let i = 0; i < 6; i++) {
  const text = new Text({
    content: labels[i],
    fontSize: 36,
    style: { fill: "#e74c3c", fontWeight: "bold" },
  });
  grid1.addElement(text);
}

grid1.position({
  relativeFrom: grid1.center,
  relativeTo: artboard.center,
  x: -300,
  y: -220,
});

const title1 = new Text({
  content: "Text with Debug Cells (ON)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title1.position({
  relativeFrom: title1.center,
  relativeTo: grid1.topCenter,
  x: 0,
  y: -35,
});

const note1 = new Text({
  content: "Red dashed lines = cell boundaries",
  fontSize: 14,
  style: { fill: "#95a5a6" },
});

note1.position({
  relativeFrom: note1.center,
  relativeTo: grid1.bottomCenter,
  x: 0,
  y: 30,
});

// Grid 2: Circles with debug cells ON
const grid2 = new GridLayout({
  columns: 3,
  rows: 2,
  width: 480,
  height: 320,
  gap: 12,
  horizontalAlign: "center",
  verticalAlign: "center",
  debugShowCells: true,  // Show cell boundaries
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 6; i++) {
  const circle = new Circle({
    radius: 35,
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
  x: 300,
  y: -220,
});

const title2 = new Text({
  content: "Circles with Debug Cells (ON)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title2.position({
  relativeFrom: title2.center,
  relativeTo: grid2.topCenter,
  x: 0,
  y: -35,
});

// Grid 3: Mixed without debug (normal appearance)
const grid3 = new GridLayout({
  columns: 4,
  rows: 2,
  width: 640,
  height: 280,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  debugShowCells: false,  // Debug OFF for comparison
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
      content: String(i + 1),
      fontSize: 32,
      style: {
        fill: "#2ecc71",
        fontWeight: "bold",
      },
    });
    grid3.addElement(text);
  } else {
    const circle = new Circle({
      radius: 28,
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
  y: 220,
});

const title3 = new Text({
  content: "Mixed Grid - Debug OFF (Normal Appearance)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

title3.position({
  relativeFrom: title3.center,
  relativeTo: grid3.topCenter,
  x: 0,
  y: -35,
});

// Main title and instructions
const mainTitle = new Text({
  content: "Grid Cell Debugging Feature",
  fontSize: 26,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 35,
});

const instructions = new Text({
  content: "Use debugShowCells: true to visualize grid cell boundaries (red dashed lines)",
  fontSize: 15,
  style: { fill: "#95a5a6" },
});

instructions.position({
  relativeFrom: instructions.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 65,
});

// Add all to artboard
artboard.addElement(grid1);
artboard.addElement(title1);
artboard.addElement(note1);
artboard.addElement(grid2);
artboard.addElement(title2);
artboard.addElement(grid3);
artboard.addElement(title3);
artboard.addElement(mainTitle);
artboard.addElement(instructions);

artboard.render();

