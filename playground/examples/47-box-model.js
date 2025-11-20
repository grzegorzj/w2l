// CSS Box Model Demonstration (Safe Version)
// This example shows how padding, borders, margins, and content areas work
import { Artboard, Rectangle, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 800 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Show visual guides for artboard padding
});

// Example 1: Visual representation of box model layers
const boxModelDemo = new Rectangle({
  width: 300,
  height: 200,
  margin: "50px",
  padding: "30px",
  name: "box-model-demo",
  style: {
    fill: "#fff3cd",  // Content area color
    stroke: "#856404",
    strokeWidth: 3
  }
});

boxModelDemo.position({
  relativeFrom: boxModelDemo.center,
  relativeTo: artboard.center,
  x: -250,
  y: -100
});

// Visualize the margin box (outermost)
const marginBoxData = boxModelDemo.getMarginBox();
const marginBoxViz = new Rectangle({
  width: marginBoxData.width,
  height: marginBoxData.height,
  name: "margin-box-viz",
  style: {
    fill: "none",
    stroke: "#dc3545",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

marginBoxViz.position({
  relativeFrom: marginBoxViz.topLeft,
  relativeTo: marginBoxData.topLeft,
  x: 0,
  y: 0
});

// Visualize the border box (default positioning)
const borderBoxData = boxModelDemo.getBorderBox();
const borderBoxViz = new Rectangle({
  width: borderBoxData.width,
  height: borderBoxData.height,
  name: "border-box-viz",
  style: {
    fill: "none",
    stroke: "#007bff",
    strokeWidth: 2,
    strokeDasharray: "8,4"
  }
});

borderBoxViz.position({
  relativeFrom: borderBoxViz.topLeft,
  relativeTo: borderBoxData.topLeft,
  x: 0,
  y: 0
});

// Visualize the content box (innermost, inside padding)
const contentBoxData = boxModelDemo.getContentBox();
const contentBoxViz = new Rectangle({
  width: contentBoxData.width,
  height: contentBoxData.height,
  name: "content-box-viz",
  style: {
    fill: "rgba(40, 167, 69, 0.1)",
    stroke: "#28a745",
    strokeWidth: 2
  }
});

contentBoxViz.position({
  relativeFrom: contentBoxViz.topLeft,
  relativeTo: contentBoxData.topLeft,
  x: 0,
  y: 0
});

// Example 2: Practical use - circles at content box corners
const container = new Rectangle({
  width: 300,
  height: 250,
  padding: "25px",
  margin: "20px",
  name: "container",
  style: {
    fill: "#e3f2fd",
    stroke: "#1976d2",
    strokeWidth: 2
  }
});

container.position({
  relativeFrom: container.center,
  relativeTo: artboard.center,
  x: 250,
  y: -100
});

// Position circles at content box corners
const containerContentBox = container.getContentBox();

const circle1 = new Circle({
  radius: 8,
  style: { fill: "#f44336" }
});
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: containerContentBox.topLeft,
  x: 0,
  y: 0
});

const circle2 = new Circle({
  radius: 8,
  style: { fill: "#9c27b0" }
});
circle2.position({
  relativeFrom: circle2.center,
  relativeTo: containerContentBox.topRight,
  x: 0,
  y: 0
});

const circle3 = new Circle({
  radius: 8,
  style: { fill: "#4caf50" }
});
circle3.position({
  relativeFrom: circle3.center,
  relativeTo: containerContentBox.bottomLeft,
  x: 0,
  y: 0
});

const circle4 = new Circle({
  radius: 8,
  style: { fill: "#ff9800" }
});
circle4.position({
  relativeFrom: circle4.center,
  relativeTo: containerContentBox.bottomRight,
  x: 0,
  y: 0
});

// Example 3: Nested boxes showing the model
const nestedContainer = new Rectangle({
  width: 400,
  height: 150,
  padding: "20px",
  margin: "15px",
  name: "nested-container",
  style: {
    fill: "#f1f8e9",
    stroke: "#689f38",
    strokeWidth: 2
  }
});

nestedContainer.position({
  relativeFrom: nestedContainer.center,
  relativeTo: artboard.center,
  x: 0,
  y: 220
});

// Inner box positioned using contentBox
const nestedContentBox = nestedContainer.getContentBox();
const innerBox = new Rectangle({
  width: 150,
  height: 80,
  padding: "10px",
  style: {
    fill: "#fff9c4",
    stroke: "#f57c00",
    strokeWidth: 2
  }
});

innerBox.position({
  relativeFrom: innerBox.topLeft,
  relativeTo: nestedContentBox.topLeft,
  x: 10,
  y: 10
});

// Small circle in the inner box's content area
const innerBoxContentBox = innerBox.getContentBox();
const innerCircle = new Circle({
  radius: 20,
  style: {
    fill: "#e65100"
  }
});

innerCircle.position({
  relativeFrom: innerCircle.center,
  relativeTo: innerBoxContentBox.center,
  x: 0,
  y: 0
});

// Legend with circles
const legendY = 340;
const legends = [
  { color: "#dc3545", x: -350 },
  { color: "#007bff", x: -150 },
  { color: "#28a745", x: 50 },
];

legends.forEach(({ color, x }) => {
  const legendCircle = new Circle({
    radius: 6,
    style: { fill: color }
  });
  
  legendCircle.position({
    relativeFrom: legendCircle.center,
    relativeTo: artboard.center,
    x: x,
    y: legendY
  });
  
  artboard.addElement(legendCircle);
});

// Add all elements to artboard
artboard.addElement(boxModelDemo);
artboard.addElement(marginBoxViz);
artboard.addElement(borderBoxViz);
artboard.addElement(contentBoxViz);

artboard.addElement(container);
artboard.addElement(circle1);
artboard.addElement(circle2);
artboard.addElement(circle3);
artboard.addElement(circle4);

artboard.addElement(nestedContainer);
artboard.addElement(innerBox);
artboard.addElement(innerCircle);

artboard.render();

