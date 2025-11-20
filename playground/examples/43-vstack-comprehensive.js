// Example 43: VStack - Comprehensive Testing
// Tests all VStack features: spacing, alignment, auto-sizing, nesting
import { Artboard, VStack, GridLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1000 },
  autoAdjust: true,
  backgroundColor: "#ecf0f1",
  padding: "40px",
});

// Test 1: Left alignment with spacing
// Test 1: Left alignment with spacing
const card1 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label1 = new Text({
  content: "Left Align",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card1.addElement(label1);

const vstack1 = new VStack({
  spacing: 15,
  horizontalAlign: "left",
  style: {
    fill: "transparent",
    stroke: "#e74c3c",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

vstack1.addElement(new Circle({ radius: 25, style: { fill: "#e74c3c" } }));
vstack1.addElement(new Circle({ radius: 30, style: { fill: "#e74c3c" } }));
vstack1.addElement(new Circle({ radius: 20, style: { fill: "#e74c3c" } }));
vstack1.addElement(new Circle({ radius: 35, style: { fill: "#e74c3c" } }));

card1.addElement(vstack1);

// Test 2: Center alignment (default)
const card2 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label2 = new Text({
  content: "Center Align",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card2.addElement(label2);

const vstack2 = new VStack({
  spacing: 20,
  horizontalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#3498db",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

vstack2.addElement(new Rectangle({ width: 60, height: 40, style: { fill: "#3498db" } }));
vstack2.addElement(new Rectangle({ width: 80, height: 30, style: { fill: "#3498db" } }));
vstack2.addElement(new Rectangle({ width: 50, height: 35, style: { fill: "#3498db" } }));
vstack2.addElement(new Rectangle({ width: 90, height: 45, style: { fill: "#3498db" } }));

card2.addElement(vstack2);

// Test 3: Right alignment
const card3 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label3 = new Text({
  content: "Right Align",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card3.addElement(label3);

const vstack3 = new VStack({
  spacing: 10,
  horizontalAlign: "right",
  style: {
    fill: "transparent",
    stroke: "#2ecc71",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

const sizes = [40, 60, 45, 70, 35];
sizes.forEach((size) => {
  vstack3.addElement(
    new Rectangle({
      width: size,
      height: 25,
      cornerRadius: 5,
      style: { fill: "#2ecc71" },
    })
  );
});

card3.addElement(vstack3);

// Test 4: Mixed content types
const card4 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label4 = new Text({
  content: "Mixed Content",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card4.addElement(label4);

const vstack4 = new VStack({
  spacing: 12,
  horizontalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#f39c12",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

vstack4.addElement(
  new Text({
    content: "Title",
    fontSize: 16,
    fontWeight: "bold",
    style: { fill: "#f39c12" },
  })
);
vstack4.addElement(new Circle({ radius: 25, style: { fill: "#f39c12" } }));
vstack4.addElement(
  new Text({
    content: "Description",
    fontSize: 11,
    style: { fill: "#f39c12" },
  })
);
vstack4.addElement(
  new Rectangle({
    width: 70,
    height: 25,
    cornerRadius: 5,
    style: { fill: "#f39c12" },
  })
);

card4.addElement(vstack4);

// Test 5: No spacing
const card5 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label5 = new Text({
  content: "No Spacing",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card5.addElement(label5);

const vstack5 = new VStack({
  spacing: 0,
  horizontalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#9b59b6",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

for (let i = 0; i < 5; i++) {
  vstack5.addElement(
    new Rectangle({
      width: 70,
      height: 30,
      style: { fill: "#9b59b6" },
    })
  );
}

card5.addElement(vstack5);

// Test 6: Nested VStacks
const card6 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label6 = new Text({
  content: "Nested VStacks",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card6.addElement(label6);

const outerStack = new VStack({
  spacing: 15,
  horizontalAlign: "center",
  style: {
    fill: "#ecf0f1",
    stroke: "#34495e",
    strokeWidth: "2px",
    padding: "10px",
  },
});

const innerStack1 = new VStack({
  spacing: 8,
  horizontalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#e74c3c",
    strokeWidth: "1px",
  },
});
innerStack1.addElement(new Circle({ radius: 15, style: { fill: "#e74c3c" } }));
innerStack1.addElement(new Circle({ radius: 18, style: { fill: "#e74c3c" } }));

const innerStack2 = new VStack({
  spacing: 8,
  horizontalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#3498db",
    strokeWidth: "1px",
  },
});
innerStack2.addElement(new Rectangle({ width: 40, height: 20, style: { fill: "#3498db" } }));
innerStack2.addElement(new Rectangle({ width: 50, height: 20, style: { fill: "#3498db" } }));

outerStack.addElement(innerStack1);
outerStack.addElement(innerStack2);

card6.addElement(outerStack);

// Test 7: Large spacing
const card7 = new VStack({
  spacing: 10,
  horizontalAlign: "center",
});

const label7 = new Text({
  content: "Large Spacing",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
card7.addElement(label7);

const vstack7 = new VStack({
  spacing: 35,
  horizontalAlign: "center",
  style: {
    fill: "transparent",
    stroke: "#1abc9c",
    strokeWidth: "2px",
    strokeDasharray: "5,3",
  },
});

vstack7.addElement(new Circle({ radius: 20, style: { fill: "#1abc9c" } }));
vstack7.addElement(new Circle({ radius: 20, style: { fill: "#1abc9c" } }));
vstack7.addElement(new Circle({ radius: 20, style: { fill: "#1abc9c" } }));

card7.addElement(vstack7);

// Create grid to organize all examples
const grid = new GridLayout({
  columns: 4,
  rows: 2,
  width: 1000,
  height: 700,
  gap: 30,
  horizontalAlign: "center",
  verticalAlign: "top",
});

grid.addElement(card1);
grid.addElement(card2);
grid.addElement(card3);
grid.addElement(card4);
grid.addElement(card5);
grid.addElement(card6);
grid.addElement(card7);

grid.position({
  relativeFrom: grid.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 50,
});

// Main title
const title = new Text({
  content: "VStack Comprehensive Test Suite",
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

artboard.render();

