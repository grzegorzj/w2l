/**
 * Example: Containers and Margins
 *
 * This example demonstrates the new layout features:
 * - Container: Invisible bounded element for layout
 * - Margin: Spacing around elements
 * - Padding: Internal spacing within containers
 * - Margin-aware positioning
 */

import {
  Artboard,
  Container,
  Circle,
  Rectangle,
  Square,
} from "w2l";

// Create an artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// ===== Example 1: Container with Padding =====

// Create a container with padding
const container1 = new Container({
  size: { width: 300, height: 200 },
  padding: "20px",
});

// Position the container in the upper left area
container1.position({
  relativeTo: artboard.topLeft,
  relativeFrom: container1.topLeft,
  x: "50px",
  y: "50px",
});

// Add shapes inside the container to show padding effect
const circle1 = new Circle({
  radius: 30,
  fill: "#3498db",
});

// Position at the top-left of container's content area (respects padding)
circle1.position({
  relativeTo: container1.contentArea,
  relativeFrom: circle1.center,
  x: "30px", // Circle radius
  y: "30px", // Circle radius
});

artboard.addElement(circle1);

// Add a visual border to show container bounds (for demonstration)
const containerBorder1 = new Rectangle({
  width: 300,
  height: 200,
  fill: "none",
  stroke: "#95a5a6",
  strokeWidth: 2,
  cornerStyle: "rounded",
  cornerRadius: 8,
});

containerBorder1.position({
  relativeTo: container1.topLeft,
  relativeFrom: containerBorder1.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(containerBorder1);

// ===== Example 2: Margin Demonstration =====

// Create three squares with margins
const square1 = new Square({
  size: 60,
  fill: "#e74c3c",
  cornerStyle: "rounded",
  cornerRadius: 8,
});
square1.margin = "10px";

const square2 = new Square({
  size: 60,
  fill: "#f39c12",
  cornerStyle: "rounded",
  cornerRadius: 8,
});
square2.margin = "10px";

const square3 = new Square({
  size: 60,
  fill: "#2ecc71",
  cornerStyle: "rounded",
  cornerRadius: 8,
});
square3.margin = "10px";

// Position squares horizontally WITHOUT margin respect
square1.position({
  relativeTo: artboard.center,
  relativeFrom: square1.center,
  x: "-150px",
  y: "-100px",
});

// Position square2 next to square1 - WITHOUT respecting margin
square2.position({
  relativeTo: square1.topRight,
  relativeFrom: square2.topLeft,
  x: 0, // No gap
  y: 0,
  respectMargin: false,
});

// Position square3 next to square2 - WITH respecting margin
square3.position({
  relativeTo: square2.topRight,
  relativeFrom: square3.topLeft,
  x: 0,
  y: 0,
  respectMargin: true, // Margins create gap
});

artboard.addElement(square1);
artboard.addElement(square2);
artboard.addElement(square3);

// ===== Example 3: Nested Container Layout =====

// Create a larger container
const container2 = new Container({
  size: { width: 350, height: 250 },
  padding: "25px",
});

container2.position({
  relativeTo: artboard.center,
  relativeFrom: container2.center,
  x: "100px",
  y: "100px",
});

// Container border for visualization
const containerBorder2 = new Rectangle({
  width: 350,
  height: 250,
  fill: "rgba(52, 152, 219, 0.1)",
  stroke: "#3498db",
  strokeWidth: 2,
  cornerStyle: "rounded",
  cornerRadius: 12,
});

containerBorder2.position({
  relativeTo: container2.topLeft,
  relativeFrom: containerBorder2.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(containerBorder2);

// Add circles inside with margins
const contentCircle1 = new Circle({
  radius: 25,
  fill: "#9b59b6",
});
contentCircle1.margin = "15px";

const contentCircle2 = new Circle({
  radius: 25,
  fill: "#e91e63",
});
contentCircle2.margin = "15px";

const contentCircle3 = new Circle({
  radius: 25,
  fill: "#00bcd4",
});
contentCircle3.margin = "15px";

// Position circles in a row inside the container
contentCircle1.position({
  relativeTo: container2.contentArea,
  relativeFrom: contentCircle1.center,
  x: "40px",
  y: "40px",
});

contentCircle2.position({
  relativeTo: contentCircle1.center,
  relativeFrom: contentCircle2.center,
  x: "90px",
  y: 0,
  respectMargin: true,
});

contentCircle3.position({
  relativeTo: contentCircle2.center,
  relativeFrom: contentCircle3.center,
  x: "90px",
  y: 0,
  respectMargin: true,
});

artboard.addElement(contentCircle1);
artboard.addElement(contentCircle2);
artboard.addElement(contentCircle3);

// Add a rectangle in the lower part of the container
const innerRect = new Rectangle({
  width: 280,
  height: 80,
  fill: "#34495e",
  cornerStyle: "rounded",
  cornerRadius: 8,
});

innerRect.position({
  relativeTo: container2.contentArea,
  relativeFrom: innerRect.topLeft,
  x: "10px",
  y: "130px",
});

artboard.addElement(innerRect);

// ===== Example 4: Margin Spacing Demo =====

// Create squares with different margins to show the effect
const smallMarginSquare = new Square({
  size: 50,
  fill: "#16a085",
  cornerStyle: "rounded",
  cornerRadius: 6,
});
smallMarginSquare.margin = "5px";

const mediumMarginSquare = new Square({
  size: 50,
  fill: "#27ae60",
  cornerStyle: "rounded",
  cornerRadius: 6,
});
mediumMarginSquare.margin = "15px";

const largeMarginSquare = new Square({
  size: 50,
  fill: "#2ecc71",
  cornerStyle: "rounded",
  cornerRadius: 6,
});
largeMarginSquare.margin = "25px";

// Position them vertically with margin respect
smallMarginSquare.position({
  relativeTo: artboard.center,
  relativeFrom: smallMarginSquare.center,
  x: "-300px",
  y: "50px",
});

mediumMarginSquare.position({
  relativeTo: smallMarginSquare.bottomLeft,
  relativeFrom: mediumMarginSquare.topLeft,
  x: 0,
  y: 0,
  respectMargin: true,
});

largeMarginSquare.position({
  relativeTo: mediumMarginSquare.bottomLeft,
  relativeFrom: largeMarginSquare.topLeft,
  x: 0,
  y: 0,
  respectMargin: true,
});

artboard.addElement(smallMarginSquare);
artboard.addElement(mediumMarginSquare);
artboard.addElement(largeMarginSquare);

// Render happens automatically - no need to export
artboard.render();

