// Example 44: HStack - Comprehensive Testing
// Tests all HStack features: spacing, alignment, auto-sizing, nesting
import { Artboard, HStack, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1000 },
  backgroundColor: "#ecf0f1",
  padding: "30px",
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

hstack1.position({
  relativeFrom: hstack1.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 50,
});

const label1 = new Text({
  content: "Top Align (varying sizes)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label1.position({
  relativeFrom: label1.bottomLeft,
  relativeTo: hstack1.topLeft,
  x: 0,
  y: -10,
});

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

hstack2.position({
  relativeFrom: hstack2.topLeft,
  relativeTo: hstack1.bottomLeft,
  x: 0,
  y: 50,
});

const label2 = new Text({
  content: "Center Align (default)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label2.position({
  relativeFrom: label2.bottomLeft,
  relativeTo: hstack2.topLeft,
  x: 0,
  y: -10,
});

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

hstack3.position({
  relativeFrom: hstack3.topLeft,
  relativeTo: hstack2.bottomLeft,
  x: 0,
  y: 50,
});

const label3 = new Text({
  content: "Bottom Align (varying heights)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label3.position({
  relativeFrom: label3.bottomLeft,
  relativeTo: hstack3.topLeft,
  x: 0,
  y: -10,
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

hstack4.addElement(
  new Text({
    content: "Label:",
    fontSize: 16,
    fontWeight: "bold",
    style: { fill: "#f39c12" },
  })
);
hstack4.addElement(new Circle({ radius: 25, style: { fill: "#f39c12" } }));
hstack4.addElement(
  new Rectangle({
    width: 60,
    height: 40,
    cornerRadius: 5,
    style: { fill: "#f39c12" },
  })
);
hstack4.addElement(
  new Text({
    content: "→",
    fontSize: 24,
    style: { fill: "#f39c12" },
  })
);

hstack4.position({
  relativeFrom: hstack4.topLeft,
  relativeTo: hstack3.bottomLeft,
  x: 0,
  y: 50,
});

const label4 = new Text({
  content: "Mixed Content (Text + Shapes)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label4.position({
  relativeFrom: label4.bottomLeft,
  relativeTo: hstack4.topLeft,
  x: 0,
  y: -10,
});

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

hstack5.position({
  relativeFrom: hstack5.topLeft,
  relativeTo: hstack4.bottomLeft,
  x: 0,
  y: 50,
});

const label5 = new Text({
  content: "No Spacing (packed tight)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label5.position({
  relativeFrom: label5.bottomLeft,
  relativeTo: hstack5.topLeft,
  x: 0,
  y: -10,
});

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

hstack6.position({
  relativeFrom: hstack6.topLeft,
  relativeTo: hstack5.bottomLeft,
  x: 0,
  y: 50,
});

const label6 = new Text({
  content: "Large Spacing (50px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label6.position({
  relativeFrom: label6.bottomLeft,
  relativeTo: hstack6.topLeft,
  x: 0,
  y: -10,
});

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

outerHStack.position({
  relativeFrom: outerHStack.topLeft,
  relativeTo: hstack6.bottomLeft,
  x: 0,
  y: 50,
});

const label7 = new Text({
  content: "Nested HStacks",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label7.position({
  relativeFrom: label7.bottomLeft,
  relativeTo: outerHStack.topLeft,
  x: 0,
  y: -10,
});

// Main title
const title = new Text({
  content: "HStack Comprehensive Test Suite",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.paddedArea.topCenter,
  x: 0,
  y: 0,
});

// Add all to artboard
artboard.addElement(title);
artboard.addElement(hstack1);
artboard.addElement(label1);
artboard.addElement(hstack2);
artboard.addElement(label2);
artboard.addElement(hstack3);
artboard.addElement(label3);
artboard.addElement(hstack4);
artboard.addElement(label4);
artboard.addElement(hstack5);
artboard.addElement(label5);
artboard.addElement(hstack6);
artboard.addElement(label6);
artboard.addElement(outerHStack);
artboard.addElement(label7);

artboard.render();

