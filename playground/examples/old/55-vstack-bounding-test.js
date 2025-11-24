// Example 55: VStack Bounding Box Test
// Testing if VStack has the same bounding box issues as HStackFixed when nested in GridLayout

import { Artboard, VStack, GridLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 600 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// Create a VStack with mixed content (similar to example 54 but vertical)
const vstack = new VStack({
  spacing: 20,
  horizontalAlign: "center",
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

vstack.addElement(text1);
vstack.addElement(circle);
vstack.addElement(rect);
vstack.addElement(text2);

// Create a 1x1 GridLayout to hold the VStack (same as example 54)
const grid = new GridLayout({
  columns: 1,
  rows: 1,
  width: 920,
  height: 520,
  horizontalAlign: "center",
  verticalAlign: "center",
});

grid.addElement(vstack);

artboard.addElement(grid);

// Helper function to create debug box
function createDebugBox(element, label, color) {
  console.log(`\n=== ${label} ===`);
  console.log("currentPosition:", element.currentPosition);
  console.log("getAbsolutePosition():", element.getAbsolutePosition());
  console.log("topLeft:", element.topLeft);
  console.log("dimensions:", element.width, "×", element.height);

  const debugBox = new Rectangle({
    width: element.width,
    height: element.height,
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
    relativeTo: { x: element.topLeft.x, y: element.topLeft.y },
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

console.log("\n=== VStack Bounding Box Test ===");
console.log("Red=Text1, Green=Circle, Blue=Rectangle, Magenta=Text2");
console.log("\nIf boxes align correctly, VStack doesn't have the HStackFixed nesting issue!");

return artboard.render();

