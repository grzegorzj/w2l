// Example 37: VStack and HStack - Vertical and Horizontal Stacking
// Demonstrates arranging elements one under another (VStack) or side by side (HStack)
import { Artboard, VStack, HStack, Text, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  backgroundColor: "#2c3e50",
});

// Example 1: VStack - Text paragraphs one under another
const textStack = new VStack({
  spacing: 15,
  horizontalAlign: "left",
});

const title = new Text({
  content: "Document Title",
  fontSize: 28,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

const subtitle = new Text({
  content: "A subtitle goes here",
  fontSize: 18,
  style: { fill: "#95a5a6" },
});

const paragraph1 = new Text({
  content: "First paragraph of text content.",
  fontSize: 14,
  style: { fill: "#ecf0f1" },
});

const paragraph2 = new Text({
  content: "Second paragraph with more information.",
  fontSize: 14,
  style: { fill: "#ecf0f1" },
});

textStack.addElement(title);
textStack.addElement(subtitle);
textStack.addElement(paragraph1);
textStack.addElement(paragraph2);

textStack.position({
  relativeFrom: textStack.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: 100,
});

const label1 = new Text({
  content: "VStack: Vertical Text Stack",
  fontSize: 16,
  style: { fill: "#3498db", fontWeight: "bold" },
});

label1.position({
  relativeFrom: label1.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: 70,
});

// Example 2: VStack - Cards/boxes stacked vertically
const cardStack = new VStack({
  spacing: 12,
  horizontalAlign: "center",
});

for (let i = 0; i < 4; i++) {
  const card = new Rectangle({
    width: 200,
    height: 60,
    cornerStyle: "rounded",
    cornerRadius: 8,
    style: {
      fill: ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"][i],
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  cardStack.addElement(card);
}

cardStack.position({
  relativeFrom: cardStack.center,
  relativeTo: artboard.center,
  x: -400,
  y: 50,
});

const label2 = new Text({
  content: "VStack: Stacked Cards",
  fontSize: 16,
  style: { fill: "#3498db", fontWeight: "bold" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: cardStack.topCenter,
  x: 0,
  y: -30,
});

// Example 3: HStack - Circles side by side
const circleStack = new HStack({
  spacing: 20,
  verticalAlign: "center",
});

for (let i = 0; i < 5; i++) {
  const circle = new Circle({
    radius: 25 + i * 5,
    style: {
      fill: "#9b59b6",
      stroke: "#8e44ad",
      strokeWidth: "2",
    },
  });
  circleStack.addElement(circle);
}

circleStack.position({
  relativeFrom: circleStack.center,
  relativeTo: artboard.center,
  x: 80,
  y: -50,
});

const label3 = new Text({
  content: "HStack: Horizontal Icons",
  fontSize: 16,
  style: { fill: "#3498db", fontWeight: "bold" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: circleStack.topCenter,
  x: 0,
  y: -50,
});

// Example 4: VStack containing HStacks (nested)
const nestedStack = new VStack({
  spacing: 20,
  horizontalAlign: "center",
});

// Create 3 rows, each is an HStack
for (let row = 0; row < 3; row++) {
  const rowStack = new HStack({
    spacing: 10,
    verticalAlign: "center",
  });

  for (let col = 0; col < 4; col++) {
    const box = new Rectangle({
      width: 40,
      height: 40,
      style: {
        fill: "#34495e",
        stroke: "#ecf0f1",
        strokeWidth: "1",
      },
    });
    rowStack.addElement(box);
  }

  nestedStack.addElement(rowStack);
}

nestedStack.position({
  relativeFrom: nestedStack.center,
  relativeTo: artboard.center,
  x: 80,
  y: 200,
});

const label4 = new Text({
  content: "Nested: VStack of HStacks (Grid Pattern)",
  fontSize: 16,
  style: { fill: "#3498db", fontWeight: "bold" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: nestedStack.topCenter,
  x: 0,
  y: -30,
});

// Example 5: VStack with mixed element sizes
const mixedStack = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const elements = [
  { type: "rect", width: 180, height: 50, color: "#e74c3c" },
  { type: "circle", radius: 30, color: "#3498db" },
  { type: "rect", width: 120, height: 60, color: "#2ecc71" },
  { type: "circle", radius: 25, color: "#f39c12" },
  { type: "rect", width: 160, height: 40, color: "#9b59b6" },
];

elements.forEach((elem) => {
  if (elem.type === "rect") {
    const rect = new Rectangle({
      width: elem.width,
      height: elem.height,
      cornerStyle: "rounded",
      cornerRadius: 8,
      style: {
        fill: elem.color,
        opacity: 0.8,
      },
    });
    mixedStack.addElement(rect);
  } else {
    const circle = new Circle({
      radius: elem.radius,
      style: {
        fill: elem.color,
        opacity: 0.8,
      },
    });
    mixedStack.addElement(circle);
  }
});

mixedStack.position({
  relativeFrom: mixedStack.center,
  relativeTo: artboard.center,
  x: -400,
  y: -250,
});

const label5 = new Text({
  content: "VStack: Mixed Element Sizes",
  fontSize: 16,
  style: { fill: "#3498db", fontWeight: "bold" },
});

label5.position({
  relativeFrom: label5.center,
  relativeTo: mixedStack.topCenter,
  x: 0,
  y: -30,
});

// Main title
const mainTitle = new Text({
  content: "VStack (Vertical) & HStack (Horizontal) Layouts",
  fontSize: 24,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 30,
});

// Add all to artboard
artboard.addElement(mainTitle);
artboard.addElement(label1);
artboard.addElement(textStack);
artboard.addElement(label2);
artboard.addElement(cardStack);
artboard.addElement(label3);
artboard.addElement(circleStack);
artboard.addElement(label4);
artboard.addElement(nestedStack);
artboard.addElement(label5);
artboard.addElement(mixedStack);

artboard.render();

