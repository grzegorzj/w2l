// Example 43: VStack - Comprehensive Testing
// Tests all VStack features: spacing, alignment, auto-sizing, nesting
import { Artboard, VStack, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1000 },
  backgroundColor: "#ecf0f1",
  padding: "30px",
});

// Test 1: Left alignment with spacing
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

vstack1.position({
  relativeFrom: vstack1.topLeft,
  relativeTo: artboard.paddedArea.topLeft,
  x: 0,
  y: 50,
});

const label1 = new Text({
  content: "Left Align (spacing: 15px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label1.position({
  relativeFrom: label1.bottomLeft,
  relativeTo: vstack1.topLeft,
  x: 0,
  y: -10,
});

// Test 2: Center alignment (default)
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

vstack2.position({
  relativeFrom: vstack2.topLeft,
  relativeTo: vstack1.topRight,
  x: 100,
  y: 0,
});

const label2 = new Text({
  content: "Center Align (varying widths)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label2.position({
  relativeFrom: label2.bottomLeft,
  relativeTo: vstack2.topLeft,
  x: 0,
  y: -10,
});

// Test 3: Right alignment
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

vstack3.position({
  relativeFrom: vstack3.topLeft,
  relativeTo: vstack2.topRight,
  x: 100,
  y: 0,
});

const label3 = new Text({
  content: "Right Align (spacing: 10px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label3.position({
  relativeFrom: label3.bottomLeft,
  relativeTo: vstack3.topLeft,
  x: 0,
  y: -10,
});

// Test 4: Mixed content types
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
    fontSize: 18,
    fontWeight: "bold",
    style: { fill: "#f39c12" },
  })
);
vstack4.addElement(new Circle({ radius: 30, style: { fill: "#f39c12" } }));
vstack4.addElement(
  new Text({
    content: "Description text here",
    fontSize: 12,
    style: { fill: "#f39c12" },
  })
);
vstack4.addElement(
  new Rectangle({
    width: 80,
    height: 30,
    cornerRadius: 5,
    style: { fill: "#f39c12" },
  })
);

vstack4.position({
  relativeFrom: vstack4.topLeft,
  relativeTo: vstack3.topRight,
  x: 100,
  y: 0,
});

const label4 = new Text({
  content: "Mixed Content Types",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label4.position({
  relativeFrom: label4.bottomLeft,
  relativeTo: vstack4.topLeft,
  x: 0,
  y: -10,
});

// Test 5: No spacing
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

vstack5.position({
  relativeFrom: vstack5.topLeft,
  relativeTo: vstack4.topRight,
  x: 100,
  y: 0,
});

const label5 = new Text({
  content: "No Spacing (stacked tight)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label5.position({
  relativeFrom: label5.bottomLeft,
  relativeTo: vstack5.topLeft,
  x: 0,
  y: -10,
});

// Test 6: Nested VStacks
const outerStack = new VStack({
  spacing: 20,
  horizontalAlign: "center",
  style: {
    fill: "#ecf0f1",
    stroke: "#34495e",
    strokeWidth: "3px",
  },
});

outerStack.addElement(
  new Text({
    content: "Outer Stack",
    fontSize: 16,
    fontWeight: "bold",
    style: { fill: "#34495e" },
  })
);

const innerStack1 = new VStack({
  spacing: 8,
  horizontalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#e74c3c",
    strokeWidth: "2px",
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
    strokeWidth: "2px",
  },
});
innerStack2.addElement(new Rectangle({ width: 40, height: 25, style: { fill: "#3498db" } }));
innerStack2.addElement(new Rectangle({ width: 50, height: 25, style: { fill: "#3498db" } }));

outerStack.addElement(innerStack1);
outerStack.addElement(innerStack2);

outerStack.position({
  relativeFrom: outerStack.topLeft,
  relativeTo: vstack1.bottomLeft,
  x: 0,
  y: 60,
});

const label6 = new Text({
  content: "Nested VStacks",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label6.position({
  relativeFrom: label6.bottomLeft,
  relativeTo: outerStack.topLeft,
  x: 0,
  y: -10,
});

// Test 7: Large spacing
const vstack7 = new VStack({
  spacing: 40,
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

vstack7.position({
  relativeFrom: vstack7.topLeft,
  relativeTo: outerStack.topRight,
  x: 100,
  y: 0,
});

const label7 = new Text({
  content: "Large Spacing (40px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
label7.position({
  relativeFrom: label7.bottomLeft,
  relativeTo: vstack7.topLeft,
  x: 0,
  y: -10,
});

// Main title
const title = new Text({
  content: "VStack Comprehensive Test Suite",
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
artboard.addElement(vstack1);
artboard.addElement(label1);
artboard.addElement(vstack2);
artboard.addElement(label2);
artboard.addElement(vstack3);
artboard.addElement(label3);
artboard.addElement(vstack4);
artboard.addElement(label4);
artboard.addElement(vstack5);
artboard.addElement(label5);
artboard.addElement(outerStack);
artboard.addElement(label6);
artboard.addElement(vstack7);
artboard.addElement(label7);

artboard.render();

