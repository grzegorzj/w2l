// Example 45: Artboard Auto-Sizing - Comprehensive Testing
// Tests auto-sizing with various padding configurations
import { Artboard, Circle, Rectangle, Text, VStack, HStack } from "w2l";

// Test 1: Auto-sizing with uniform padding
const artboard1 = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

const title1 = new Text({
  content: "Uniform Padding (40px all sides)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title1.position({
  relativeFrom: title1.topLeft,
  relativeTo: artboard1.paddedArea.topLeft,
  x: 0,
  y: 0,
});

const circle1 = new Circle({
  radius: 50,
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2px" },
});
circle1.position({
  relativeFrom: circle1.topCenter,
  relativeTo: title1.bottomCenter,
  x: 0,
  y: 20,
});

const rect1 = new Rectangle({
  width: 120,
  height: 80,
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2px" },
});
rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: circle1.bottomLeft,
  x: -60,
  y: 20,
});

const footer1 = new Text({
  content: "Padding should be visible on all 4 sides",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
});
footer1.position({
  relativeFrom: footer1.topCenter,
  relativeTo: rect1.bottomCenter,
  x: 0,
  y: 20,
});

artboard1.addElement(title1);
artboard1.addElement(circle1);
artboard1.addElement(rect1);
artboard1.addElement(footer1);

// Render to file
const fs = require("fs");
fs.writeFileSync(
  "artboard1-uniform-padding.svg",
  artboard1.render()
);

console.log("✓ Test 1: Uniform padding (40px)");
console.log(`  Final size: ${artboard1.width}×${artboard1.height}`);
console.log(`  Expected: content + 80px width, content + 80px height\n`);

// Test 2: Auto-sizing with asymmetric padding
const artboard2 = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "20px 60px 30px 40px", // top right bottom left
  backgroundColor: "#ffffff",
});

const title2 = new Text({
  content: "Asymmetric Padding (T:20 R:60 B:30 L:40)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title2.position({
  relativeFrom: title2.topLeft,
  relativeTo: artboard2.paddedArea.topLeft,
  x: 0,
  y: 0,
});

const stack2 = new HStack({
  spacing: 15,
  verticalAlign: "center",
});
stack2.addElement(new Circle({ radius: 30, style: { fill: "#2ecc71" } }));
stack2.addElement(new Circle({ radius: 25, style: { fill: "#f39c12" } }));
stack2.addElement(new Circle({ radius: 35, style: { fill: "#9b59b6" } }));

stack2.position({
  relativeFrom: stack2.topLeft,
  relativeTo: title2.bottomLeft,
  x: 0,
  y: 20,
});

const footer2 = new Text({
  content: "Different padding on each side",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
});
footer2.position({
  relativeFrom: footer2.topLeft,
  relativeTo: stack2.bottomLeft,
  x: 0,
  y: 20,
});

artboard2.addElement(title2);
artboard2.addElement(stack2);
artboard2.addElement(footer2);

fs.writeFileSync(
  "artboard2-asymmetric-padding.svg",
  artboard2.render()
);

console.log("✓ Test 2: Asymmetric padding");
console.log(`  Final size: ${artboard2.width}×${artboard2.height}`);
console.log(`  Expected: content + 100px width (40+60), content + 50px height (20+30)\n`);

// Test 3: Auto-sizing with zero padding
const artboard3 = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "0px",
  backgroundColor: "#ffffff",
});

const title3 = new Text({
  content: "No Padding (0px)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title3.position({
  relativeFrom: title3.topLeft,
  relativeTo: artboard3.paddedArea.topLeft,
  x: 0,
  y: 0,
});

const rect3 = new Rectangle({
  width: 200,
  height: 100,
  style: { fill: "#1abc9c", stroke: "#16a085", strokeWidth: "2px" },
});
rect3.position({
  relativeFrom: rect3.topLeft,
  relativeTo: title3.bottomLeft,
  x: 0,
  y: 10,
});

artboard3.addElement(title3);
artboard3.addElement(rect3);

fs.writeFileSync(
  "artboard3-no-padding.svg",
  artboard3.render()
);

console.log("✓ Test 3: No padding");
console.log(`  Final size: ${artboard3.width}×${artboard3.height}`);
console.log(`  Expected: exactly content size\n`);

// Test 4: Auto-sizing with large padding
const artboard4 = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "80px",
  backgroundColor: "#ffffff",
});

const smallCircle = new Circle({
  radius: 20,
  style: { fill: "#e74c3c" },
});
smallCircle.position({
  relativeFrom: smallCircle.center,
  relativeTo: artboard4.paddedArea.topLeft,
  x: 0,
  y: 0,
});

artboard4.addElement(smallCircle);

fs.writeFileSync(
  "artboard4-large-padding.svg",
  artboard4.render()
);

console.log("✓ Test 4: Large padding (80px) with small content");
console.log(`  Final size: ${artboard4.width}×${artboard4.height}`);
console.log(`  Expected: small content + 160px width, small content + 160px height\n`);

// Test 5: Auto-sizing with nested layouts
const artboard5 = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "50px",
  backgroundColor: "#ffffff",
});

const vstack5 = new VStack({
  spacing: 20,
  horizontalAlign: "center",
});

vstack5.addElement(
  new Text({
    content: "Card with Padding",
    fontSize: 18,
    fontWeight: "bold",
    style: { fill: "#2c3e50" },
  })
);

const hstack5 = new HStack({
  spacing: 15,
  verticalAlign: "center",
});
hstack5.addElement(new Circle({ radius: 25, style: { fill: "#3498db" } }));
hstack5.addElement(
  new Text({
    content: "Content",
    fontSize: 14,
    style: { fill: "#34495e" },
  })
);
hstack5.addElement(new Circle({ radius: 25, style: { fill: "#2ecc71" } }));

vstack5.addElement(hstack5);

vstack5.addElement(
  new Text({
    content: "Footer text goes here",
    fontSize: 12,
    style: { fill: "#7f8c8d" },
  })
);

vstack5.position({
  relativeFrom: vstack5.topLeft,
  relativeTo: artboard5.topLeft,
  x: 0,
  y: 0,
});

artboard5.addElement(vstack5);

fs.writeFileSync(
  "artboard5-nested-layouts.svg",
  artboard5.render()
);

console.log("✓ Test 5: Nested layouts with padding");
console.log(`  Final size: ${artboard5.width}×${artboard5.height}`);
console.log(`  Expected: VStack size + 100px width, VStack size + 100px height\n`);

console.log("All tests completed! Check the generated SVG files.");
console.log("\nKey points:");
console.log("- Padding should be applied on ALL 4 sides");
console.log("- Content should never touch the artboard edges when padding > 0");
console.log("- Asymmetric padding should work correctly");

