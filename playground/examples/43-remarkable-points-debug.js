import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  Rectangle,
} from "w2l";

/**
 * Example 43: Remarkable Points Position Debugging
 *
 * A minimal example to debug remarkable point coordinate retrieval.
 * Tests whether the bounding boxes align correctly with the auto-rendered remarkable points.
 */

const artboard = new Artboard({
  size: { width: 800, height: 700 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

// Title
const title = new Text({
  content: "Remarkable Points Position Debug",
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

// Description
const description = new Text({
  content: "Red dots = auto-rendered remarkable points | Colored boxes = manually positioned using getRemarkablePoint()",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
  maxWidth: 720,
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: title.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Simple function graph with remarkable points enabled
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    label: "f(x) = x² - 4",
    color: "#3498db",
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  range: [-5, 6],
  detectRemarkablePoints: true,
  showRemarkablePoints: true, // Auto-render red dots
  name: "DebugGraph",
});

graph.position({
  relativeFrom: graph.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(graph);

console.log("=== Debugging Remarkable Points ===");
console.log("Graph position:", graph.currentPosition);
console.log("Graph absolute position:", graph.getAbsolutePosition());

// Get all remarkable points
const roots = graph.getRemarkablePoints("root");
const yIntercept = graph.getRemarkablePoints("y-intercept");
const minima = graph.getRemarkablePoints("local-minimum");

console.log("Roots found:", roots.length);
console.log("Y-intercept found:", yIntercept.length);
console.log("Minima found:", minima.length);

// Draw bounding boxes around the first root (red)
if (roots.length > 0) {
  console.log("\n=== Root 0 ===");
  const rootPos = graph.getRemarkablePoint("root", 0);
  console.log("Root 0 position from getRemarkablePoint:", rootPos);
  
  if (rootPos) {
    // Large red box
    const bbox = new Rectangle({
      width: 30,
      height: 30,
      style: {
        fill: "rgba(231, 76, 60, 0.1)",
        stroke: "#e74c3c",
        strokeWidth: "2px",
      }
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    console.log("Root 0 bbox position after positioning:", bbox.currentPosition);
    
    artboard.addElement(bbox);
    
    // Add crosshair at the exact position
    const hLine = new Rectangle({
      width: 40,
      height: 1,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 1,
      height: 40,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root 0",
      fontSize: 10,
      style: { fill: "#e74c3c" }
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -25
    });
    
    artboard.addElement(label);
  }
}

// Draw bounding boxes around the second root (green)
if (roots.length > 1) {
  console.log("\n=== Root 1 ===");
  const rootPos = graph.getRemarkablePoint("root", 1);
  console.log("Root 1 position from getRemarkablePoint:", rootPos);
  
  if (rootPos) {
    const bbox = new Rectangle({
      width: 30,
      height: 30,
      style: {
        fill: "rgba(39, 174, 96, 0.1)",
        stroke: "#27ae60",
        strokeWidth: "2px",
      }
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    console.log("Root 1 bbox position after positioning:", bbox.currentPosition);
    
    artboard.addElement(bbox);
    
    // Add crosshair
    const hLine = new Rectangle({
      width: 40,
      height: 1,
      style: { fill: "#27ae60", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 1,
      height: 40,
      style: { fill: "#27ae60", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root 1",
      fontSize: 10,
      style: { fill: "#27ae60" }
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -25
    });
    
    artboard.addElement(label);
  }
}

// Draw bounding box around y-intercept (blue)
if (yIntercept.length > 0) {
  console.log("\n=== Y-Intercept ===");
  const pos = graph.getRemarkablePoint("y-intercept", 0);
  console.log("Y-intercept position from getRemarkablePoint:", pos);
  
  if (pos) {
    const bbox = new Rectangle({
      width: 30,
      height: 30,
      style: {
        fill: "rgba(52, 152, 219, 0.1)",
        stroke: "#3498db",
        strokeWidth: "2px",
      }
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    console.log("Y-intercept bbox position after positioning:", bbox.currentPosition);
    
    artboard.addElement(bbox);
    
    // Add crosshair
    const hLine = new Rectangle({
      width: 40,
      height: 1,
      style: { fill: "#3498db", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 1,
      height: 40,
      style: { fill: "#3498db", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Y-intercept",
      fontSize: 10,
      style: { fill: "#3498db" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 25
    });
    
    artboard.addElement(label);
  }
}

// Add note
const note = new Text({
  content: "If working correctly: crosshairs and boxes should be centered on the red dots",
  fontSize: 11,
  fontWeight: "bold",
  style: { fill: "#e74c3c" },
  maxWidth: 600,
});

note.position({
  relativeFrom: note.topLeft,
  relativeTo: graph.bottomLeft,
  x: 0,
  y: 20,
});

artboard.addElement(note);

artboard.render();

