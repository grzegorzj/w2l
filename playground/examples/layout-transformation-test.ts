/**
 * Layout Transformation Test
 *
 * Tests that children move and transform with their parent layout.
 * This example demonstrates:
 * - Layout with children
 * - Moving the layout (children should move too)
 * - Rotating the layout (children should rotate too)
 */

import { Artboard, Layout, Circle, Rectangle } from "w2l";

// Create an artboard
const artboard = new Artboard({
  size: { width: "800px", height: "600px" },
  padding: "40px",
});

// Create a visible layout
const layout = new Layout({
  width: "400px",
  height: "300px",
  padding: "20px",
  cornerStyle: "rounded",
  cornerRadius: "10px",
  style: {
    fill: "#ecf0f1",
    stroke: "#34495e",
    strokeWidth: "2px",
  },
});

// Position layout slightly off-center to start
layout.position({
  relativeTo: artboard.center,
  relativeFrom: layout.center,
  x: "-100px",
  y: "-50px",
});

// Add some elements to the layout
const circle1 = new Circle({
  radius: "40px",
  style: {
    fill: "#3498db",
    stroke: "#2c3e50",
    strokeWidth: "2px",
  },
});

const circle2 = new Circle({
  radius: "30px",
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "2px",
  },
});

const rect1 = new Rectangle({
  width: "80px",
  height: "60px",
  cornerStyle: "rounded",
  cornerRadius: "8px",
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});

// Position elements within the layout
circle1.position({
  relativeTo: layout.contentArea,
  relativeFrom: circle1.center,
  x: "60px",
  y: "60px",
});

circle2.position({
  relativeTo: layout.contentArea,
  relativeFrom: circle2.center,
  x: "150px",
  y: "60px",
});

rect1.position({
  relativeTo: layout.contentArea,
  relativeFrom: rect1.center,
  x: "200px",
  y: "150px",
});

// Add elements to layout AFTER positioning them
// This makes them layout-bound - they'll move with the layout
layout.addElement(circle1);
layout.addElement(circle2);
layout.addElement(rect1);

// Now move the layout - all children should move too!
layout.translate({
  along: { x: "1px", y: "0px" },
  distance: "100px",
});

// Add a marker circle at the original center position to show the layout moved
const marker = new Circle({
  radius: "5px",
  style: {
    fill: "#e67e22",
    stroke: "none",
  },
});

marker.position({
  relativeTo: artboard.center,
  relativeFrom: marker.center,
  x: "-100px",
  y: "-50px",
});

artboard.addElement(marker);
artboard.addElement(layout);

return artboard.render();
