// Example 44: HStack - Comprehensive Testing
// Tests all HStack features: spacing, alignment, auto-sizing, nesting
import { Artboard, HStack, VStack, GridLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1000 },
  autoAdjust: true,
  backgroundColor: "#ecf0f1",
  padding: "40px",
});

// Test 1: Top alignment
const hstack1 = new HStack({
  spacing: 15,
  verticalAlign: "top",
  style: {
    fill: "transparent",
    stroke: "#e74c3c",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

hstack1.addElement(new Circle({ radius: 25, style: { fill: "#e74c3c" } }));
hstack1.addElement(new Circle({ radius: 35, style: { fill: "#e74c3c" } }));
hstack1.addElement(new Circle({ radius: 20, style: { fill: "#e74c3c" } }));
hstack1.addElement(new Circle({ radius: 30, style: { fill: "#e74c3c" } }));


// Test 2: Center alignment (default)
const hstack2 = new HStack({
  spacing: 20,
  verticalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#3498db",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

hstack2.addElement(new Rectangle({ width: 40, height: 60, style: { fill: "#3498db" } }));
hstack2.addElement(new Rectangle({ width: 50, height: 40, style: { fill: "#3498db" } }));
hstack2.addElement(new Rectangle({ width: 45, height: 70, style: { fill: "#3498db" } }));
hstack2.addElement(new Rectangle({ width: 40, height: 50, style: { fill: "#3498db" } }));


// Test 3: Bottom alignment
const hstack3 = new HStack({
  spacing: 12,
  verticalAlign: "bottom",
  style: {
    fill: "transparent",
    stroke: "#2ecc71",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

const heights = [30, 50, 35, 60, 40];
heights.forEach((height) => {
  hstack3.addElement(
    new Rectangle({
      width: 40,
      height: height,
      cornerRadius: 5,
      style: { fill: "#2ecc71" },
    })
  );
});


// Test 4: Mixed content types
const hstack4 = new HStack({
  spacing: 18,
  verticalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#f39c12",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

const text1 = new Text({
  content: "Label:",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#f39c12" },
});
hstack4.addElement(text1);

hstack4.addElement(new Circle({ radius: 25, style: { fill: "#f39c12" } }));

hstack4.addElement(
  new Rectangle({
    width: 60,
    height: 40,
    cornerRadius: 5,
    style: { fill: "#f39c12" },
  })
);

const arrowText = new Text({
  content: "→",
  fontSize: 24,
  style: { fill: "#f39c12" },
});
hstack4.addElement(arrowText);


// Test 5: No spacing (tight pack)
const hstack5 = new HStack({
  spacing: 0,
  verticalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#9b59b6",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

for (let i = 0; i < 6; i++) {
  hstack5.addElement(
    new Rectangle({
      width: 50,
      height: 60,
      style: { fill: "#9b59b6" },
    })
  );
}


// Test 6: Large spacing
const hstack6 = new HStack({
  spacing: 50,
  verticalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#1abc9c",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

hstack6.addElement(new Circle({ radius: 30, style: { fill: "#1abc9c" } }));
hstack6.addElement(new Circle({ radius: 30, style: { fill: "#1abc9c" } }));
hstack6.addElement(new Circle({ radius: 30, style: { fill: "#1abc9c" } }));


// Test 7: Nested HStacks
const outerHStack = new HStack({
  spacing: 25,
  verticalAlign: "center",
  style: {
    fill: "#ecf0f1",
    stroke: "#34495e",
    strokeWidth: "3px",
  },
});

const innerHStack1 = new HStack({
  spacing: 10,
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#e74c3c",
    strokeWidth: "2px",
  },
});
innerHStack1.addElement(new Circle({ radius: 20, style: { fill: "#e74c3c" } }));
innerHStack1.addElement(new Circle({ radius: 20, style: { fill: "#e74c3c" } }));

const innerHStack2 = new HStack({
  spacing: 10,
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#3498db",
    strokeWidth: "2px",
  },
});
innerHStack2.addElement(new Rectangle({ width: 40, height: 40, style: { fill: "#3498db" } }));
innerHStack2.addElement(new Rectangle({ width: 40, height: 40, style: { fill: "#3498db" } }));

outerHStack.addElement(innerHStack1);
outerHStack.addElement(
  new Text({
    content: "+",
    fontSize: 24,
    fontWeight: "bold",
    style: { fill: "#34495e" },
  })
);
outerHStack.addElement(innerHStack2);


// Wrap each example in a card for grid layout
const cards = [];

// Card 1
const card1 = new VStack({ spacing: 10, horizontalAlign: "center" });
card1.addElement(new Text({ content: "Top Align", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card1.addElement(hstack1);
cards.push(card1);

// Card 2
const card2 = new VStack({ spacing: 10, horizontalAlign: "center" });
card2.addElement(new Text({ content: "Center Align", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card2.addElement(hstack2);
cards.push(card2);

// Card 3
const card3 = new VStack({ spacing: 10, horizontalAlign: "center" });
card3.addElement(new Text({ content: "Bottom Align", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card3.addElement(hstack3);
cards.push(card3);

// Card 4
const card4 = new VStack({ spacing: 10, horizontalAlign: "center" });
card4.addElement(new Text({ content: "Mixed Content", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card4.addElement(hstack4);
cards.push(card4);

// Card 5
const card5 = new VStack({ spacing: 10, horizontalAlign: "center" });
card5.addElement(new Text({ content: "No Spacing", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card5.addElement(hstack5);
cards.push(card5);

// Card 6
const card6 = new VStack({ spacing: 10, horizontalAlign: "center" });
card6.addElement(new Text({ content: "Large Spacing", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card6.addElement(hstack6);
cards.push(card6);

// Card 7
const card7 = new VStack({ spacing: 10, horizontalAlign: "center" });
card7.addElement(new Text({ content: "Nested HStacks", fontSize: 14, fontWeight: "bold", style: { fill: "#2c3e50" } }));
card7.addElement(outerHStack);
cards.push(card7);

// Create grid to organize all examples
const grid = new GridLayout({
  columns: 2,
  rows: 4,
  width: 1200,
  height: 1000,
  gap: 40,
  horizontalAlign: "center",
  verticalAlign: "top",
});

cards.forEach(card => grid.addElement(card));

grid.position({
  relativeFrom: grid.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 50,
});

// Main title
const title = new Text({
  content: "HStack Comprehensive Test Suite",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 0,
});

// Add to artboard
artboard.addElement(title);
artboard.addElement(grid);

// Add debug rectangles AFTER grid is positioned (so HStacks have arranged their children)
// Force arrangement by accessing the grid
grid.render(); // This will trigger arrangement

// Now get the bounding boxes with updated positions
const text1Bbox = text1.getBoundingBox();
const debugRect1 = new Rectangle({
  width: text1Bbox.width,
  height: text1Bbox.height,
  style: {
    fill: "none",
    stroke: "blue",
    strokeWidth: "2px",
    strokeDasharray: "4,4",
  },
});
debugRect1.zIndex = 100;
debugRect1.position({
  relativeFrom: debugRect1.topLeft,
  relativeTo: { x: `${text1Bbox.topLeft.x}px`, y: `${text1Bbox.topLeft.y}px` },
  x: 0,
  y: 0,
});

const arrowTextBbox = arrowText.getBoundingBox();
const debugRect2 = new Rectangle({
  width: arrowTextBbox.width,
  height: arrowTextBbox.height,
  style: {
    fill: "none",
    stroke: "red",
    strokeWidth: "2px",
    strokeDasharray: "4,4",
  },
});
debugRect2.zIndex = 100;
debugRect2.position({
  relativeFrom: debugRect2.topLeft,
  relativeTo: { x: `${arrowTextBbox.topLeft.x}px`, y: `${arrowTextBbox.topLeft.y}px` },
  x: 0,
  y: 0,
});

artboard.addElement(debugRect1);
artboard.addElement(debugRect2);

artboard.render();

