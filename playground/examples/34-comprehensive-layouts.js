// Example 34: Comprehensive Layout Demonstration
// This example demonstrates:
// 1. StackLayout with various elements
// 2. Text rendering in GridLayout
// 3. Using Layout instead of Container
// 4. Combining different layout types
import { Artboard, Layout, StackLayout, GridLayout, SpreadLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1000 },
  backgroundColor: "#2c3e50",
});

// ============================================================
// Section 1: StackLayout - Stacking elements on top of each other
// ============================================================

const stackSection = new Layout({
  width: 450,
  height: 320,
  padding: 20,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const sectionTitle1 = new Text({
  content: "1. StackLayout - Layered Composition",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

sectionTitle1.position({
  relativeFrom: sectionTitle1.topLeft,
  relativeTo: stackSection.topLeft,
  x: 20,
  y: 20,
});

// Create a stack with multiple layers
const stack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "center",
  verticalAlign: "center",
});

// Add stacked circles (background to foreground)
const stackCircles = [
  { radius: 70, color: "#e74c3c", opacity: 0.6 },
  { radius: 55, color: "#3498db", opacity: 0.7 },
  { radius: 40, color: "#2ecc71", opacity: 0.8 },
  { radius: 25, color: "#f39c12", opacity: 0.9 },
];

stackCircles.forEach((config) => {
  const circle = new Circle({
    radius: config.radius,
    style: {
      fill: config.color,
      opacity: config.opacity,
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  stack.addElement(circle);
});

stack.position({
  relativeFrom: stack.center,
  relativeTo: stackSection.center,
  x: 0,
  y: 20,
});

stackSection.addElement(sectionTitle1);
stackSection.addElement(stack);

stackSection.position({
  relativeFrom: stackSection.center,
  relativeTo: artboard.center,
  x: -530,
  y: -300,
});

// ============================================================
// Section 2: GridLayout with Text Elements
// ============================================================

const gridSection = new Layout({
  width: 450,
  height: 320,
  padding: 20,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const sectionTitle2 = new Text({
  content: "2. GridLayout with Text Rendering",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

sectionTitle2.position({
  relativeFrom: sectionTitle2.topLeft,
  relativeTo: gridSection.topLeft,
  x: 20,
  y: 20,
});

// Grid with text elements
const textGrid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 380,
  height: 200,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#2c3e50",
    stroke: "#3498db",
    strokeWidth: "1",
  },
});

const letters = ["A", "B", "C", "D", "E", "F"];
letters.forEach((letter) => {
  const text = new Text({
    content: letter,
    fontSize: 32,
    style: {
      fill: "#3498db",
      fontWeight: "bold",
    },
  });
  textGrid.addElement(text);
});

textGrid.position({
  relativeFrom: textGrid.topCenter,
  relativeTo: gridSection.topCenter,
  x: 0,
  y: 70,
});

gridSection.addElement(sectionTitle2);
gridSection.addElement(textGrid);

gridSection.position({
  relativeFrom: gridSection.center,
  relativeTo: artboard.center,
  x: 30,
  y: -300,
});

// ============================================================
// Section 3: Layout (instead of Container) - Invisible
// ============================================================

const invisibleSection = new Layout({
  width: 450,
  height: 320,
  padding: 20,
  // No style = invisible (like Container)
  // But we'll add a border for demonstration
  style: {
    stroke: "#ecf0f1",
    strokeWidth: "2",
    strokeDasharray: "5,5",
    fill: "none",
  },
});

const sectionTitle3 = new Text({
  content: "3. Layout as Invisible Container",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

sectionTitle3.position({
  relativeFrom: sectionTitle3.topLeft,
  relativeTo: invisibleSection.topLeft,
  x: 20,
  y: 20,
});

const description3 = new Text({
  content: "Layout with no fill acts like Container",
  fontSize: 14,
  style: { fill: "#95a5a6" },
});

description3.position({
  relativeFrom: description3.topLeft,
  relativeTo: invisibleSection.topLeft,
  x: 20,
  y: 50,
});

// Add some circles to show containment
const circle1 = new Circle({
  radius: 30,
  style: { fill: "#e74c3c" },
});

circle1.position({
  relativeFrom: circle1.center,
  relativeTo: invisibleSection.center,
  x: -80,
  y: 20,
});

const circle2 = new Circle({
  radius: 30,
  style: { fill: "#2ecc71" },
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: invisibleSection.center,
  x: 0,
  y: 20,
});

const circle3 = new Circle({
  radius: 30,
  style: { fill: "#3498db" },
});

circle3.position({
  relativeFrom: circle3.center,
  relativeTo: invisibleSection.center,
  x: 80,
  y: 20,
});

invisibleSection.addElement(sectionTitle3);
invisibleSection.addElement(description3);
invisibleSection.addElement(circle1);
invisibleSection.addElement(circle2);
invisibleSection.addElement(circle3);

invisibleSection.position({
  relativeFrom: invisibleSection.center,
  relativeTo: artboard.center,
  x: 570,
  y: -300,
});

// ============================================================
// Section 4: Combining Layouts - StackLayout in Columns
// ============================================================

const combinedSection = new Layout({
  width: 950,
  height: 320,
  padding: 20,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const sectionTitle4 = new Text({
  content: "4. Combined Layouts - Stacks in Horizontal Spread",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

sectionTitle4.position({
  relativeFrom: sectionTitle4.topLeft,
  relativeTo: combinedSection.topLeft,
  x: 20,
  y: 20,
});

// Horizontal spread of stacks
const spreadOfStacks = new SpreadLayout({
  direction: "horizontal",
  width: 880,
  height: 220,
  justify: "space-between",
  align: "center",
});

// Create 3 small stacks
for (let i = 0; i < 3; i++) {
  const miniStack = new StackLayout({
    width: 150,
    height: 150,
    horizontalAlign: "center",
    verticalAlign: "center",
    style: {
      fill: "#2c3e50",
      stroke: "#95a5a6",
      strokeWidth: "1",
    },
  });

  // Add shapes to each stack
  const shapes = [
    { type: "circle", size: 50, color: ["#e74c3c", "#3498db", "#2ecc71"][i] },
    { type: "circle", size: 35, color: ["#c0392b", "#2980b9", "#27ae60"][i] },
  ];

  shapes.forEach((shape) => {
    const circle = new Circle({
      radius: shape.size,
      style: {
        fill: shape.color,
        opacity: 0.7,
      },
    });
    miniStack.addElement(circle);
  });

  const label = new Text({
    content: `Stack ${i + 1}`,
    fontSize: 14,
    style: {
      fill: "#ecf0f1",
    },
  });

  miniStack.addElement(label);
  spreadOfStacks.addElement(miniStack);
}

spreadOfStacks.position({
  relativeFrom: spreadOfStacks.topCenter,
  relativeTo: combinedSection.topCenter,
  x: 0,
  y: 70,
});

combinedSection.addElement(sectionTitle4);
combinedSection.addElement(spreadOfStacks);

combinedSection.position({
  relativeFrom: combinedSection.center,
  relativeTo: artboard.center,
  x: -50,
  y: 300,
});

// ============================================================
// Section 5: Grid with Mixed Elements (Text + Shapes)
// ============================================================

const mixedSection = new Layout({
  width: 450,
  height: 280,
  padding: 20,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const sectionTitle5 = new Text({
  content: "5. Mixed Grid (Shapes + Text)",
  fontSize: 18,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

sectionTitle5.position({
  relativeFrom: sectionTitle5.topLeft,
  relativeTo: mixedSection.topLeft,
  x: 20,
  y: 20,
});

const mixedGrid = new GridLayout({
  columns: 4,
  rows: 2,
  width: 380,
  height: 180,
  gap: 8,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#2c3e50",
    stroke: "#95a5a6",
    strokeWidth: "1",
  },
});

// Alternate between circles and text
for (let i = 0; i < 8; i++) {
  if (i % 2 === 0) {
    const circle = new Circle({
      radius: 20,
      style: {
        fill: "#f39c12",
        stroke: "#d68910",
        strokeWidth: "2",
      },
    });
    mixedGrid.addElement(circle);
  } else {
    const text = new Text({
      content: String(Math.floor(i / 2) + 1),
      fontSize: 20,
      style: {
        fill: "#2ecc71",
        fontWeight: "bold",
      },
    });
    mixedGrid.addElement(text);
  }
}

mixedGrid.position({
  relativeFrom: mixedGrid.topCenter,
  relativeTo: mixedSection.topCenter,
  x: 0,
  y: 70,
});

mixedSection.addElement(sectionTitle5);
mixedSection.addElement(mixedGrid);

mixedSection.position({
  relativeFrom: mixedSection.center,
  relativeTo: artboard.center,
  x: 570,
  y: 300,
});

// ============================================================
// Add everything to artboard
// ============================================================

artboard.addElement(stackSection);
artboard.addElement(gridSection);
artboard.addElement(invisibleSection);
artboard.addElement(combinedSection);
artboard.addElement(mixedSection);

// Add main title
const mainTitle = new Text({
  content: "Comprehensive Layout System Demonstration",
  fontSize: 28,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 40,
});

artboard.addElement(mainTitle);

artboard.render();

