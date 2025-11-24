// ColumnsLayout with multiple columns
import { Artboard, ColumnsLayout, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1"
});

// Create 3-column layout
const columns = new ColumnsLayout({
  count: 3,
  gutter: 20,
  width: 700,
  height: 400,
  columnStyle: { 
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "1"
  },
  verticalAlign: "center",
  horizontalAlign: "center"
});

columns.position({
  relativeFrom: columns.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add elements to first column
const circle1 = new Circle({
  radius: 40,
  style: { fill: "#e74c3c" }
});

columns.columns[0].addElement(circle1);

const circle2 = new Circle({
  radius: 30,
  style: { fill: "#c0392b" }
});

columns.columns[0].addElement(circle2);

// Add elements to second column
const rect = new Rectangle({
  width: 80,
  height: 120,
  cornerStyle: "rounded",
  cornerRadius: 10,
  style: { fill: "#3498db" }
});

columns.columns[1].addElement(rect);

// Add elements to third column
const circle3 = new Circle({
  radius: 50,
  style: { fill: "#2ecc71" }
});

columns.columns[2].addElement(circle3);

artboard.addElement(columns);

artboard.render();

