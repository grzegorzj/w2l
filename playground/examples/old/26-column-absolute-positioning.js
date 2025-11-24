// Example 26: Column Absolute Positioning Test
// Demonstrates that moving one element in a column doesn't affect others
import { Artboard, ColumnsLayout, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 900, height: 600 },
  backgroundColor: "#ecf0f1",
});

// Create 3-column layout
const columns = new ColumnsLayout({
  count: 3,
  gutter: 20,
  width: 800,
  height: 500,
  columnStyle: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
  verticalAlign: "top",
  horizontalAlign: "center",
});

columns.position({
  relativeFrom: columns.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

// Add multiple elements to each column
// Column 1 - Red circles
const circle1 = new Circle({
  radius: 30,
  name: "circle-1-top",
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2" },
});

const circle2 = new Circle({
  radius: 25,
  name: "circle-1-middle",
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2" },
});

const circle3 = new Circle({
  radius: 20,
  name: "circle-1-bottom",
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2" },
});

columns.columns[0].addElement(circle1);
columns.columns[0].addElement(circle2);
columns.columns[0].addElement(circle3);

// Column 2 - Blue rectangles
const rect1 = new Rectangle({
  width: 80,
  height: 60,
  name: "rect-2-top",
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2" },
});

const rect2 = new Rectangle({
  width: 70,
  height: 50,
  name: "rect-2-middle",
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2" },
});

const rect3 = new Rectangle({
  width: 60,
  height: 40,
  name: "rect-2-bottom",
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2" },
});

columns.columns[1].addElement(rect1);
columns.columns[1].addElement(rect2);
columns.columns[1].addElement(rect3);

// Column 3 - Green circles
const circle4 = new Circle({
  radius: 35,
  name: "circle-3-top",
  style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: "2" },
});

const circle5 = new Circle({
  radius: 30,
  name: "circle-3-middle",
  style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: "2" },
});

const circle6 = new Circle({
  radius: 25,
  name: "circle-3-bottom",
  style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: "2" },
});

columns.columns[2].addElement(circle4);
columns.columns[2].addElement(circle5);
columns.columns[2].addElement(circle6);

// Add to artboard
artboard.addElement(columns);

// NOW: Move one element absolutely - the middle circle in column 1
// This should NOT affect the other circles in that column
circle2.position({
  relativeFrom: circle2.center,
  relativeTo: circle2.center, // Relative to itself
  x: 50, // Move 50px to the right
  y: 0,
});

// And move the middle rectangle in column 2
rect2.position({
  relativeFrom: rect2.center,
  relativeTo: rect2.center,
  x: -40, // Move 40px to the left
  y: 20, // And 20px down
});

// Expected result:
// - circle2 should be moved 50px to the right
// - circle1 and circle3 should remain in their original positions
// - rect2 should be moved left and down
// - rect1 and rect3 should remain in their original positions
// - All elements in column 3 should remain untouched

artboard.render();

