import {
  Artboard,
  Circle,
  Text,
  Rectangle,
} from "w2l";

/**
 * Example 41: Auto-Sizing Artboard Test
 * 
 * Minimal example to test auto-sizing functionality
 */

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  autoAdjust: true,
  padding: "20px",
  backgroundColor: "#f0f0f0",
});

// Add a simple title at the top
const title = new Text({
  content: "Auto-Sizing Test",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Add a circle below the title
const circle = new Circle({
  radius: 50,
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2px" },
});

circle.position({
  relativeFrom: circle.topCenter,
  relativeTo: title.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(circle);

// Add a rectangle to the right of the circle
const rect = new Rectangle({
  width: 100,
  height: 80,
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2px" },
});

rect.position({
  relativeFrom: rect.leftCenter,
  relativeTo: circle.rightCenter,
  x: 40,
  y: 0,
});

artboard.addElement(rect);

// Add footer text at the bottom
const footer = new Text({
  content: "Artboard should size to fit all elements",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
});

footer.position({
  relativeFrom: footer.topCenter,
  relativeTo: circle.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(footer);

// Debug: Check what's happening
console.log("=== Auto-Sizing Debug ===");
console.log("Config size:", artboard.size);
console.log("Artboard width:", artboard.width);
console.log("Artboard height:", artboard.height);
console.log("Artboard center:", artboard.center);
console.log("Number of elements:", artboard.elements?.length || "N/A");

// Check each element's bounding box
console.log("\nElement positions:");
console.log("Title bbox:", title.getBoundingBox());
console.log("Circle bbox:", circle.getBoundingBox());
console.log("Rect bbox:", rect.getBoundingBox());
console.log("Footer bbox:", footer.getBoundingBox());

artboard.render();

