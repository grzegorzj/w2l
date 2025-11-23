/**
 * Example: Columns Layout Utility
 * 
 * Demonstrates the Columns utility that creates a horizontal
 * layout with multiple columns and gutter spacing.
 */

import { NewArtboard, Columns, NewRect, NewCircle, NewContainer } from "w2l";

const artboard = new NewArtboard({
  width: 1000,
  height: 700,
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 30 },
});

// Create a 4-column layout
const columns = new Columns({
  count: 4,
  columnWidth: 200,
  height: 600,
  gutter: 30,
  alignment: "start",
  style: {
    fill: "#bdc3c7",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
  boxModel: { padding: 15 },
});

// Position the columns layout on the artboard
columns.container.position({
  relativeFrom: columns.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(columns.container);

// Column 1: Stack of rectangles
const col1Stack = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  alignment: "center",
});

for (let i = 0; i < 3; i++) {
  const rect = new NewRect({
    width: 150,
    height: 80,
    style: {
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: 2,
    },
  });
  col1Stack.addElement(rect);
}

columns.getColumn(0).addElement(col1Stack);

// Column 2: Circles
const col2Stack = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  alignment: "center",
});

for (let i = 0; i < 4; i++) {
  const circle = new NewCircle({
    radius: 35,
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: 2,
    },
  });
  col2Stack.addElement(circle);
}

columns.getColumn(1).addElement(col2Stack);

// Column 3: Mixed shapes
const rect1 = new NewRect({
  width: 160,
  height: 100,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});
rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: columns.getColumn(2).contentBox.topLeft,
  x: 10,
  y: 10,
});
columns.getColumn(2).addElement(rect1);

const circle1 = new NewCircle({
  radius: 40,
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2,
  },
});
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: columns.getColumn(2).contentBox.center,
  x: 0,
  y: 100,
});
columns.getColumn(2).addElement(circle1);

// Column 4: Spread layout
const col4Stack = new NewContainer({
  width: 170,
  height: 550,
  direction: "vertical",
  spacing: 10,
  spread: true,
  alignment: "center",
  boxModel: { padding: 10 },
  style: {
    fill: "#34495e",
    stroke: "#2c3e50",
    strokeWidth: 2,
  },
});

for (let i = 0; i < 3; i++) {
  const rect = new NewRect({
    width: 130,
    height: 60,
    style: {
      fill: "#f39c12",
      stroke: "#e67e22",
      strokeWidth: 2,
    },
  });
  col4Stack.addElement(rect);
}

columns.getColumn(3).addElement(col4Stack);

return artboard.render();

