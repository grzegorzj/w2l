// Example 33: Stack Layout
// Demonstrates stacking elements on top of each other with various alignments
import { Artboard, StackLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  backgroundColor: "#2c3e50",
});

// Example 1: Centered stack with circles of decreasing size
const centerStack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add circles from large to small
const radii = [70, 55, 40, 25];
const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12"];
for (let i = 0; i < radii.length; i++) {
  const circle = new Circle({
    radius: radii[i],
    style: {
      fill: colors[i],
      opacity: 0.8,
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  centerStack.addElement(circle);
}

centerStack.position({
  relativeFrom: centerStack.center,
  relativeTo: artboard.center,
  x: -480,
  y: -280,
});

const label1 = new Text({
  content: "Center Aligned Stack",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: centerStack.topCenter,
  x: 0,
  y: -30,
});

// Example 2: Top-left aligned stack
const topLeftStack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "left",
  verticalAlign: "top",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 4; i++) {
  const size = 80 - i * 15;
  const rect = new Rectangle({
    width: size,
    height: size,
    cornerStyle: "rounded",
    cornerRadius: 10,
    style: {
      fill: colors[i],
      opacity: 0.8,
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  topLeftStack.addElement(rect);
}

topLeftStack.position({
  relativeFrom: topLeftStack.center,
  relativeTo: artboard.center,
  x: -160,
  y: -280,
});

const label2 = new Text({
  content: "Top-Left Aligned",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: topLeftStack.topCenter,
  x: 0,
  y: -30,
});

// Example 3: Bottom-right aligned stack
const bottomRightStack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "right",
  verticalAlign: "bottom",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 4; i++) {
  const size = 80 - i * 15;
  const rect = new Rectangle({
    width: size,
    height: size,
    style: {
      fill: colors[i],
      opacity: 0.8,
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  bottomRightStack.addElement(rect);
}

bottomRightStack.position({
  relativeFrom: bottomRightStack.center,
  relativeTo: artboard.center,
  x: 160,
  y: -280,
});

const label3 = new Text({
  content: "Bottom-Right Aligned",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: bottomRightStack.topCenter,
  x: 0,
  y: -30,
});

// Example 4: Card deck effect with layer offset
const deckStack = new StackLayout({
  width: 180,
  height: 250,
  horizontalAlign: "left",
  verticalAlign: "top",
  layerOffset: 8, // Each card offset by 8px
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 5; i++) {
  const card = new Rectangle({
    width: 140,
    height: 200,
    cornerStyle: "rounded",
    cornerRadius: 10,
    style: {
      fill: "#ecf0f1",
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  deckStack.addElement(card);
}

deckStack.position({
  relativeFrom: deckStack.center,
  relativeTo: artboard.center,
  x: 480,
  y: -260,
});

const label4 = new Text({
  content: "Card Deck (layerOffset: 8)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: deckStack.topCenter,
  x: 0,
  y: -30,
});

// Example 5: Stacked text and shapes (badge effect)
const badgeStack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const badgeCircle = new Circle({
  radius: 60,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "3",
  },
});

const badgeText = new Text({
  content: "SALE",
  fontSize: 24,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

badgeStack.addElement(badgeCircle);
badgeStack.addElement(badgeText);

badgeStack.position({
  relativeFrom: badgeStack.center,
  relativeTo: artboard.center,
  x: -400,
  y: 180,
});

const label5 = new Text({
  content: "Badge Effect (Circle + Text)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label5.position({
  relativeFrom: label5.center,
  relativeTo: badgeStack.topCenter,
  x: 0,
  y: -30,
});

// Example 6: Stacked rectangles with transparency
const transparentStack = new StackLayout({
  width: 200,
  height: 200,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const stackColors = ["#e74c3c", "#3498db", "#2ecc71"];
for (let i = 0; i < 3; i++) {
  const rect = new Rectangle({
    width: 120,
    height: 120,
    cornerStyle: "rounded",
    cornerRadius: 15,
    style: {
      fill: stackColors[i],
      opacity: 0.5,
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  transparentStack.addElement(rect);
  
  // Rotate each rectangle slightly
  rect.rotate({
    angle: i * 15,
    origin: rect.center,
  });
}

transparentStack.position({
  relativeFrom: transparentStack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 180,
});

const label6 = new Text({
  content: "Transparent Layers (Rotated)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label6.position({
  relativeFrom: label6.center,
  relativeTo: transparentStack.topCenter,
  x: 0,
  y: -30,
});

// Example 7: Multiple text layers
const textStack = new StackLayout({
  width: 250,
  height: 180,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const background = new Rectangle({
  width: 220,
  height: 150,
  cornerStyle: "rounded",
  cornerRadius: 20,
  style: {
    fill: "#9b59b6",
    opacity: 0.9,
  },
});

const titleText = new Text({
  content: "STACK",
  fontSize: 48,
  style: {
    fill: "#ecf0f1",
    fontWeight: "bold",
  },
});

const subtitleText = new Text({
  content: "Layout",
  fontSize: 20,
  style: {
    fill: "#ecf0f1",
  },
});

// Position subtitle below title manually (relative positioning)
subtitleText.position({
  relativeFrom: subtitleText.center,
  relativeTo: artboard.center,
  x: 400,
  y: 210,
});

textStack.addElement(background);
textStack.addElement(titleText);

textStack.position({
  relativeFrom: textStack.center,
  relativeTo: artboard.center,
  x: 400,
  y: 180,
});

const label7 = new Text({
  content: "Stacked Text & Background",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label7.position({
  relativeFrom: label7.center,
  relativeTo: textStack.topCenter,
  x: 0,
  y: -30,
});

// Add all to artboard
artboard.addElement(centerStack);
artboard.addElement(label1);
artboard.addElement(topLeftStack);
artboard.addElement(label2);
artboard.addElement(bottomRightStack);
artboard.addElement(label3);
artboard.addElement(deckStack);
artboard.addElement(label4);
artboard.addElement(badgeStack);
artboard.addElement(label5);
artboard.addElement(transparentStack);
artboard.addElement(label6);
artboard.addElement(textStack);
artboard.addElement(label7);
artboard.addElement(subtitleText);

artboard.render();

