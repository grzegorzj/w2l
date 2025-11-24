// Example 54: Bounding Box Test - ALL Elements
// Testing if bounding boxes align correctly for ALL element types

import { Artboard, HStackFixed, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 600 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// Create an HStackFixed with mixed content (NO debug mode to keep it clean)
const hstack = new HStackFixed({
  spacing: 20,
  verticalAlign: "center",
  autoWidth: true,
  autoHeight: true,
  padding: "20px",
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2,
  },
});

// Add text element
const text1 = new Text({
  content: "Label:",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#1971c2" },
});

// Add circle
const circle = new Circle({
  radius: 25,
  style: { fill: "#1864ab" },
});

// Add rectangle
const rect = new Rectangle({
  width: 60,
  height: 40,
  cornerRadius: 5,
  style: { fill: "#1e40af" },
});

// Add another text element
const text2 = new Text({
  content: "Arrow",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#1971c2" },
});

hstack.addElement(text1);
hstack.addElement(circle);
hstack.addElement(rect);
hstack.addElement(text2);

// Position HStack in center of artboard
hstack.position({
  relativeFrom: hstack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

artboard.addElement(hstack);

// Note: hstack.position() already triggered layout and child positioning
// Children should now have correct absolute positions!

// Helper function to create debug box
function createDebugBox(element, label, color) {
  const bbox = element.getBoundingBox ? element.getBoundingBox() : element.boundingBox;
  
  console.log(`\n=== ${label} ===`);
  console.log("currentPosition:", element.currentPosition);
  console.log("getAbsolutePosition():", element.getAbsolutePosition());
  console.log("bbox.topLeft:", bbox.topLeft);
  console.log("bbox dimensions:", bbox.width, "×", bbox.height);
  console.log("element.width × element.height:", element.width, "×", element.height);
  
  const debugBox = new Rectangle({
    width: bbox.width,
    height: bbox.height,
    style: {
      fill: "none",
      stroke: color,
      strokeWidth: "2px",
      strokeDasharray: "4,4",
    },
  });
  debugBox.zIndex = 100;
  debugBox.position({
    relativeFrom: debugBox.topLeft,
    relativeTo: { x: bbox.topLeft.x, y: bbox.topLeft.y },
    x: 0,
    y: 0,
  });
  
  return debugBox;
}

// Create debug boxes for ALL elements
const debugBox1 = createDebugBox(text1, "TEXT1 (Label:)", "#ff0000");
const debugBox2 = createDebugBox(circle, "CIRCLE", "#00ff00");
const debugBox3 = createDebugBox(rect, "RECTANGLE", "#0000ff");
const debugBox4 = createDebugBox(text2, "TEXT2 (Arrow)", "#ff00ff");

artboard.addElement(debugBox1);
artboard.addElement(debugBox2);
artboard.addElement(debugBox3);
artboard.addElement(debugBox4);

// Add title
const title = new Text({
  content: "Bounding Box Test - Red=Text1, Green=Circle, Blue=Rectangle, Magenta=Text2",
  fontSize: 14,
  style: { fill: "#2c3e50" },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.paddedArea.topCenter,
  x: 0,
  y: 0,
});
artboard.addElement(title);

console.log("\n=== HSTACK ===");
console.log("HStack position:", hstack.getAbsolutePosition());
console.log("HStack dimensions:", hstack.width, "×", hstack.height);

return artboard.render();

