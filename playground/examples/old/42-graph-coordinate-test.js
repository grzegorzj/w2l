import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  Rectangle,
  VStack,
} from "w2l";

/**
 * Example 42: Graph Coordinate System Test
 *
 * Simple test to verify coordinate retrieval is working correctly.
 */

const artboard = new Artboard({
  size: { width: 1000, height: 800 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

// Title
const title = new Text({
  content: "Graph Coordinate System Test - Check Browser Console",
  fontSize: 20,
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

// Create a simple graph
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x,
    color: "#3498db",
  },
  width: 400,
  height: 400,
  domain: [-5, 5],
  range: [-5, 5],
  name: "TestGraph",
});

graph.position({
  relativeFrom: graph.topLeft,
  relativeTo: title.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(graph);

// Draw reference markers at graph corners (should be at actual corners)
const topLeftMarker = new Circle({
  radius: 5,
  style: { fill: "#e74c3c", stroke: "none" },
});

topLeftMarker.position({
  relativeFrom: topLeftMarker.center,
  relativeTo: graph.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(topLeftMarker);

const topRightMarker = new Circle({
  radius: 5,
  style: { fill: "#27ae60", stroke: "none" },
});

topRightMarker.position({
  relativeFrom: topRightMarker.center,
  relativeTo: graph.topLeft,
  x: 400,  // Should be at right edge
  y: 0,
});

artboard.addElement(topRightMarker);

const bottomLeftMarker = new Circle({
  radius: 5,
  style: { fill: "#9b59b6", stroke: "none" },
});

bottomLeftMarker.position({
  relativeFrom: bottomLeftMarker.center,
  relativeTo: graph.topLeft,
  x: 0,
  y: 400,  // Should be at bottom edge
});

artboard.addElement(bottomLeftMarker);

const bottomRightMarker = new Circle({
  radius: 5,
  style: { fill: "#f39c12", stroke: "none" },
});

bottomRightMarker.position({
  relativeFrom: bottomRightMarker.center,
  relativeTo: graph.topLeft,
  x: 400,
  y: 400,
});

artboard.addElement(bottomRightMarker);

// Test coordinateToPosition - mark the center (0, 0) in math space
console.log("=== COORDINATE TEST ===");
console.log("Graph dimensions: 400x400");
console.log("Domain: [-5, 5], Range: [-5, 5]");
console.log("Center (0,0) should be at (200, 200) in graph space");

const centerMathPos = graph.coordinateToPosition(0, 0);
console.log("coordinateToPosition(0, 0):", centerMathPos);

const centerMarker = new Circle({
  radius: 8,
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2px" },
});

centerMarker.position({
  relativeFrom: centerMarker.center,
  relativeTo: graph.topLeft,
  x: centerMathPos.x,
  y: centerMathPos.y,
});

artboard.addElement(centerMarker);

const centerLabel = new Text({
  content: "(0,0) math",
  fontSize: 12,
  style: { fill: "#e74c3c" },
});

centerLabel.position({
  relativeFrom: centerLabel.leftCenter,
  relativeTo: graph.topLeft,
  x: centerMathPos.x + 12,
  y: centerMathPos.y,
});

artboard.addElement(centerLabel);

// Test label positions
console.log("=== LABEL POSITION TEST ===");
const x0Pos = graph.getLabelPosition('x', 0);
console.log("getLabelPosition('x', 0):", x0Pos);

if (x0Pos) {
  const xLabelMarker = new Circle({
    radius: 6,
    style: { fill: "#3498db", stroke: "none" },
  });
  
  xLabelMarker.position({
    relativeFrom: xLabelMarker.center,
    relativeTo: graph.topLeft,
    x: x0Pos.x,
    y: x0Pos.y,
  });
  
  artboard.addElement(xLabelMarker);
}

const y0Pos = graph.getLabelPosition('y', 0);
console.log("getLabelPosition('y', 0):", y0Pos);

if (y0Pos) {
  const yLabelMarker = new Circle({
    radius: 6,
    style: { fill: "#2ecc71", stroke: "none" },
  });
  
  yLabelMarker.position({
    relativeFrom: yLabelMarker.center,
    relativeTo: graph.topLeft,
    x: y0Pos.x,
    y: y0Pos.y,
  });
  
  artboard.addElement(yLabelMarker);
}

// Get all label positions for reference
console.log("=== ALL LABELS ===");
const allXLabels = graph.getAllLabelPositions('x');
console.log("X-axis labels:", allXLabels);

const allYLabels = graph.getAllLabelPositions('y');
console.log("Y-axis labels:", allYLabels);

// Add info text
const infoStack = new VStack({
  spacing: 8,
});

infoStack.position({
  relativeFrom: infoStack.topLeft,
  relativeTo: graph.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(infoStack);

const info1 = new Text({
  content: "Red (corners): Manual positioning at (0,0), (400,0), (0,400), (400,400)",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

infoStack.addElement(info1);

const info2 = new Text({
  content: "Large red circle: coordinateToPosition(0, 0) - should be at graph center",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

infoStack.addElement(info2);

const info3 = new Text({
  content: "Blue circle: getLabelPosition('x', 0) - should be on x-axis at x=0",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

infoStack.addElement(info3);

const info4 = new Text({
  content: "Green circle: getLabelPosition('y', 0) - should be on y-axis at y=0",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

infoStack.addElement(info4);

const info5 = new Text({
  content: "Check browser console for coordinate values",
  fontSize: 11,
  fontWeight: "bold",
  style: { fill: "#e74c3c" },
});

infoStack.addElement(info5);

artboard.render();

