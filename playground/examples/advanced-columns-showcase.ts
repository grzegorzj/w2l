/**
 * Advanced Columns Layout Showcase
 *
 * This example demonstrates the full power of ColumnsLayout:
 * - Multiple column configurations
 * - Different alignment options
 * - Nested layouts with columns
 * - Real-world use case: a dashboard with cards
 */

import {
  Artboard,
  ColumnsLayout,
  Layout,
  Circle,
  Rectangle,
  Square,
  Triangle,
} from "w2l";

// Create a large artboard for our showcase
const artboard = new Artboard({
  size: { width: "1200px", height: "800px" },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// ===== Section 1: Basic 3-Column Layout (Top) =====
const section1 = new ColumnsLayout({
  count: 3,
  gutter: "30px",
  width: "1120px",
  height: "200px",
  verticalAlign: "center",
  horizontalAlign: "center",
  columnStyle: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

section1.position({
  relativeTo: artboard.contentArea,
  relativeFrom: section1.topLeft,
  x: 0,
  y: 0,
});

// Add cards to section 1 (like stats or metrics)
const card1Circle = new Circle({
  radius: "50px",
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 3,
  },
});

const card2Square = new Square({
  size: "100px",
  cornerStyle: "rounded",
  cornerRadius: "15px",
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 3,
  },
});

const card3Triangle = new Triangle({
  type: "equilateral",
  a: 100,
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 3,
  },
});

section1.columns[0].addElement(card1Circle);
section1.columns[1].addElement(card2Square);
section1.columns[2].addElement(card3Triangle);

// ===== Section 2: 4-Column Grid (Middle) =====
const section2 = new ColumnsLayout({
  count: 4,
  gutter: "20px",
  width: "1120px",
  height: "180px",
  verticalAlign: "center",
  horizontalAlign: "center",
  columnStyle: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 1,
  },
});

section2.position({
  relativeTo: section1.bottomCenter,
  relativeFrom: section2.topCenter,
  x: 0,
  y: "40px",
});

// Add small shapes to section 2 (like icon placeholders)
const colors = [
  { fill: "#ffebee", stroke: "#f44336" },
  { fill: "#fff3e0", stroke: "#ff9800" },
  { fill: "#e0f2f1", stroke: "#009688" },
  { fill: "#fce4ec", stroke: "#e91e63" },
];

for (let i = 0; i < 4; i++) {
  const shape = new Circle({
    radius: "35px",
    style: {
      ...colors[i],
      strokeWidth: 2,
    },
  });
  section2.columns[i].addElement(shape);
}

// ===== Section 3: 2-Column Layout with Larger Elements (Bottom) =====
const section3 = new ColumnsLayout({
  count: 2,
  gutter: "40px",
  width: "1120px",
  height: "280px",
  verticalAlign: "top",
  horizontalAlign: "center",
  columnStyle: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

section3.position({
  relativeTo: section2.bottomCenter,
  relativeFrom: section3.topCenter,
  x: 0,
  y: "40px",
});

// Left column: Nested layout with shapes
const leftContent = new Layout({
  width: "480px",
  height: "240px",
  padding: "20px",
  style: {
    fill: "#f5f5f5",
  },
});

const leftCircle = new Circle({
  radius: "60px",
  style: {
    fill: "#3f51b5",
    stroke: "#1a237e",
    strokeWidth: 3,
  },
});

leftCircle.position({
  relativeTo: leftContent.center,
  relativeFrom: leftCircle.center,
  x: 0,
  y: 0,
});

leftContent.addElement(leftCircle);
section3.columns[0].addElement(leftContent);

// Right column: Multiple small shapes
const rightShape1 = new Rectangle({
  width: "120px",
  height: "80px",
  cornerStyle: "rounded",
  cornerRadius: "12px",
  style: {
    fill: "#ff5722",
    stroke: "#bf360c",
    strokeWidth: 2,
  },
});

const rightShape2 = new Square({
  size: "80px",
  cornerStyle: "squircle",
  cornerRadius: "20px",
  style: {
    fill: "#00bcd4",
    stroke: "#006064",
    strokeWidth: 2,
  },
});

const rightShape3 = new Triangle({
  type: "isosceles",
  a: 100,
  b: 100,
  c: 80,
  style: {
    fill: "#ffc107",
    stroke: "#f57f17",
    strokeWidth: 2,
  },
});

// Position them in a vertical stack
rightShape1.position({
  relativeTo: section3.columns[1].topCenter,
  relativeFrom: rightShape1.topCenter,
  x: 0,
  y: "20px",
});

rightShape2.position({
  relativeTo: rightShape1.bottomCenter,
  relativeFrom: rightShape2.topCenter,
  x: 0,
  y: "20px",
});

rightShape3.position({
  relativeTo: rightShape2.bottomCenter,
  relativeFrom: rightShape3.topCenter,
  x: 0,
  y: "20px",
});

section3.columns[1].addElement(rightShape1);
section3.columns[1].addElement(rightShape2);
section3.columns[1].addElement(rightShape3);

// ===== Section 4: Single Column with Multiple Items (Sidebar-like) =====
const sidebar = new ColumnsLayout({
  count: 1,
  width: "200px",
  height: "720px",
  verticalAlign: "top",
  horizontalAlign: "center",
  columnStyle: {
    fill: "#37474f",
    stroke: "#263238",
    strokeWidth: 2,
  },
});

// Position sidebar on the right side
sidebar.position({
  relativeTo: artboard.topRight,
  relativeFrom: sidebar.topRight,
  x: "-40px",
  y: "40px",
});

// Add items to sidebar
const sidebarItems = [
  { radius: 25, fill: "#ff5252" },
  { radius: 25, fill: "#ff4081" },
  { radius: 25, fill: "#e040fb" },
  { radius: 25, fill: "#7c4dff" },
  { radius: 25, fill: "#536dfe" },
];

sidebarItems.forEach((item, index) => {
  const circle = new Circle({
    radius: `${item.radius}px`,
    style: {
      fill: item.fill,
      stroke: "#ffffff",
      strokeWidth: 2,
    },
  });

  circle.position({
    relativeTo: sidebar.columns[0].topCenter,
    relativeFrom: circle.center,
    x: 0,
    y: `${40 + index * 80}px`,
  });

  sidebar.columns[0].addElement(circle);
});

// Add all sections to artboard
artboard.addElement(section1);
artboard.addElement(section2);
artboard.addElement(section3);
artboard.addElement(sidebar);

// ===== Decorative elements (not in columns) =====
// Add a title indicator
const titleCircle = new Circle({
  radius: "15px",
  style: {
    fill: "#00e676",
    stroke: "#00c853",
    strokeWidth: 2,
  },
});

titleCircle.position({
  relativeTo: artboard.topLeft,
  relativeFrom: titleCircle.center,
  x: "60px",
  y: "60px",
});

artboard.addElement(titleCircle);

return artboard.render();

