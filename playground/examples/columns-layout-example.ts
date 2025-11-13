/**
 * Columns Layout Example
 *
 * Demonstrates the new ColumnsLayout functionality with:
 * - Container with padding
 * - ColumnsLayout with 3 columns
 * - Elements added to specific columns
 * - Layout positioning and transformations
 */

import {
  Artboard,
  Container,
  ColumnsLayout,
  Circle,
  Rectangle,
  Triangle,
} from "w2l";

// Create an artboard
const artboard = new Artboard({
  size: { width: "800px", height: "600px" },
  padding: "40px",
});

// Example 1: Container with columns layout
const container = new Container({
  size: { width: "600px", height: "400px" },
  padding: "20px",
});

// Center the container on the artboard
container.position({
  relativeTo: artboard.center,
  relativeFrom: container.center,
  x: 0,
  y: 0,
});

// Create a columns layout inside the container
const columns = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "560px", // Container width minus padding
  height: "360px",
  columnStyle: {
    fill: "#f0f0f0",
    stroke: "#cccccc",
    strokeWidth: 1,
  },
  verticalAlign: "center",
  horizontalAlign: "center",
});

// Position columns inside the container
columns.position({
  relativeTo: container.contentArea,
  relativeFrom: columns.topLeft,
  x: 0,
  y: 0,
});

container.addElement(columns);

// Add elements to each column
const circle1 = new Circle({
  radius: "40px",
  style: {
    fill: "#3498db",
    stroke: "#2c3e50",
    strokeWidth: 2,
  },
});

const rect1 = new Rectangle({
  width: "60px",
  height: "60px",
  cornerStyle: "rounded",
  cornerRadius: "10px",
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});

const triangle1 = new Triangle({
  type: "equilateral",
  a: 70,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});

// Add to columns
columns.columns[0].addElement(circle1);
columns.columns[1].addElement(rect1);
columns.columns[2].addElement(triangle1);

// Example 2: Demonstrating layout-bound vs absolute positioning
const circle2 = new Circle({
  radius: "30px",
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2,
  },
});

// Add circle2 to column 0 - it's layout-bound by default
columns.columns[0].addElement(circle2);

// Example 3: Breaking out with absolute positioning
const circle3 = new Circle({
  radius: "25px",
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 2,
  },
});

columns.columns[1].addElement(circle3);

// Explicitly position circle3 - it breaks out of the layout
circle3.position({
  relativeTo: artboard.topRight,
  relativeFrom: circle3.center,
  x: "-50px",
  y: "50px",
});

// Add container to artboard
artboard.addElement(container);

return artboard.render();
