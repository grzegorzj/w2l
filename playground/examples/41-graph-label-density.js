import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  Rectangle,
  VStack,
  HStack,
} from "w2l";

/**
 * Example 41: Graph Label Density and Coordinate Retrieval
 *
 * Demonstrates:
 * - Auto-calculated grid spacing based on pixel density
 * - Custom minLabelDensity configuration
 * - Label coordinate retrieval methods
 * - Positioning annotations relative to specific labels
 */

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

// Main title
const mainTitle = new Text({
  content: "Label Density & Coordinate Retrieval Demo",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

mainTitle.position({
  relativeFrom: mainTitle.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainTitle);

// Description
const description = new Text({
  content: "Comparing auto-calculated grid spacing vs manual, and demonstrating label coordinate retrieval",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
  maxWidth: 1200,
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: mainTitle.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Create a layout for side-by-side comparison
const hstack = new HStack({
  spacing: 40,
});

hstack.position({
  relativeFrom: hstack.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(hstack);

// Example 1: Default auto-calculated spacing (minLabelDensity=50)
const autoSpacingStack = new VStack({
  spacing: 15,
});

const autoTitle = new Text({
  content: "Auto-calculated spacing (default)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

autoSpacingStack.addElement(autoTitle);

const autoGraph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x) * Math.cos(x / 2),
    label: "f(x) = sin(x)·cos(x/2)",
    color: "#3498db",
  },
  width: 500,
  height: 350,
  domain: [-10, 10],
  range: [-1.5, 1.5],
  // minLabelDensity defaults to 50 pixels
  name: "AutoSpacingGraph",
});

autoSpacingStack.addElement(autoGraph);

const autoNote = new Text({
  content: "Grid spacing auto-calculated for ~50px between labels",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
  maxWidth: 500,
});

autoSpacingStack.addElement(autoNote);

hstack.addElement(autoSpacingStack);

// Example 2: High density labels (minLabelDensity=30)
const highDensityStack = new VStack({
  spacing: 15,
});

const highDensityTitle = new Text({
  content: "Higher label density (minLabelDensity=30)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

highDensityStack.addElement(highDensityTitle);

const highDensityGraph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x) * Math.cos(x / 2),
    label: "f(x) = sin(x)·cos(x/2)",
    color: "#e74c3c",
  },
  width: 500,
  height: 350,
  domain: [-10, 10],
  range: [-1.5, 1.5],
  minLabelDensity: 30, // More labels, closer together
  name: "HighDensityGraph",
});

highDensityStack.addElement(highDensityGraph);

const highDensityNote = new Text({
  content: "More labels with 30px minimum spacing",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
  maxWidth: 500,
});

highDensityStack.addElement(highDensityNote);

hstack.addElement(highDensityStack);

// Example 3: Demonstrate label coordinate retrieval
const coordDemoStack = new VStack({
  spacing: 15,
});

coordDemoStack.position({
  relativeFrom: coordDemoStack.topLeft,
  relativeTo: hstack.bottomLeft,
  x: 0,
  y: 50,
});

artboard.addElement(coordDemoStack);

const coordTitle = new Text({
  content: "Label Coordinate Retrieval & Annotation Positioning",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

coordDemoStack.addElement(coordTitle);

const coordNote = new Text({
  content: "Demonstrating getLabelPosition(), getAllLabelPositions(), and coordinateToPosition() methods",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
});

coordDemoStack.addElement(coordNote);

const demoGraph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    label: "f(x) = x² - 4",
    color: "#9b59b6",
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  range: [-5, 6],
  minLabelDensity: 60, // Slightly wider spacing for clarity
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "CoordinateDemoGraph",
});

coordDemoStack.addElement(demoGraph);

// Add annotations using label coordinate retrieval

// DEBUG: Draw bounding boxes around remarkable points
console.log("=== Remarkable Points Debug ===");

// Get all remarkable points of different types
const roots = demoGraph.getRemarkablePoints("root");
const yIntercept = demoGraph.getRemarkablePoints("y-intercept");
const minima = demoGraph.getRemarkablePoints("local-minimum");
const maxima = demoGraph.getRemarkablePoints("local-maximum");

console.log("Roots:", roots);
console.log("Y-intercept:", yIntercept);
console.log("Minima:", minima);
console.log("Maxima:", maxima);

// Draw bounding boxes around roots (red dashed)
roots.forEach((root, idx) => {
  const rootPos = demoGraph.getRemarkablePoint("root", idx);
  console.log(`[Example] Root ${idx} position from getRemarkablePoint:`, rootPos);
  if (rootPos) {
    const bbox = new Rectangle({
      width: 20,
      height: 20,
      style: {
        fill: "none",
        stroke: "#e74c3c",
        strokeWidth: "1px",
        strokeDasharray: "3,3"
      }
    });
    
    console.log(`[Example] Positioning bbox with center at:`, rootPos);
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    console.log(`[Example] Bbox final position:`, bbox.currentPosition);
    
    artboard.addElement(bbox);
    
    // Add label
    const label = new Text({
      content: `Root ${idx + 1}`,
      fontSize: 9,
      style: { fill: "#e74c3c" }
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -15
    });
    
    artboard.addElement(label);
  }
});

// Draw bounding boxes around y-intercept (green dashed)
yIntercept.forEach((pt, idx) => {
  const pos = demoGraph.getRemarkablePoint("y-intercept", idx);
  if (pos) {
    const bbox = new Rectangle({
      width: 20,
      height: 20,
      style: {
        fill: "none",
        stroke: "#27ae60",
        strokeWidth: "1px",
        strokeDasharray: "3,3"
      }
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(bbox);
    
    const label = new Text({
      content: "Y-intercept",
      fontSize: 9,
      style: { fill: "#27ae60" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 15
    });
    
    artboard.addElement(label);
  }
});

// Draw bounding boxes around minimum (blue dashed)
minima.forEach((pt, idx) => {
  const pos = demoGraph.getRemarkablePoint("local-minimum", idx);
  if (pos) {
    const bbox = new Rectangle({
      width: 20,
      height: 20,
      style: {
        fill: "none",
        stroke: "#3498db",
        strokeWidth: "1px",
        strokeDasharray: "3,3"
      }
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(bbox);
    
    const label = new Text({
      content: "Minimum",
      fontSize: 9,
      style: { fill: "#3498db" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 15
    });
    
    artboard.addElement(label);
  }
});

// 1. Mark the y=0 position (x-axis)
const y0Position = demoGraph.getLabelPosition('y', 0);
console.log("=== Y=0 Label Position ===");
console.log("y0Position:", y0Position);

if (y0Position) {
  const y0Marker = new Circle({
    radius: 5,
    style: { fill: "#e74c3c", stroke: "none" },
  });
  
  y0Marker.position({
    relativeFrom: y0Marker.center,
    relativeTo: y0Position,
    x: 0,
    y: 0,
  });
  
  artboard.addElement(y0Marker);
  
  const y0Label = new Text({
    content: "← y=0 label",
    fontSize: 11,
    style: { fill: "#e74c3c" },
  });
  
  y0Label.position({
    relativeFrom: y0Label.leftCenter,
    relativeTo: y0Position,
    x: 15,
    y: 0,
  });
  
  artboard.addElement(y0Label);
}

// 2. Mark x=2 position
const x2Position = demoGraph.getLabelPosition('x', 2);
if (x2Position) {
  const x2Marker = new Circle({
    radius: 5,
    style: { fill: "#27ae60", stroke: "none" },
  });
  
  x2Marker.position({
    relativeFrom: x2Marker.center,
    relativeTo: x2Position,
    x: 0,
    y: 0,
  });
  
  artboard.addElement(x2Marker);
  
  const x2Label = new Text({
    content: "x=2 label ↓",
    fontSize: 11,
    style: { fill: "#27ae60" },
  });
  
  x2Label.position({
    relativeFrom: x2Label.bottomCenter,
    relativeTo: x2Position,
    x: 0,
    y: -10,
  });
  
  artboard.addElement(x2Label);
}

// 3. Mark a specific mathematical coordinate
const mathPoint = demoGraph.coordinateToPosition(-3, 5);
const mathMarker = new Circle({
  radius: 6,
  style: { fill: "#f39c12", stroke: "#e67e22", strokeWidth: "2px" },
});

mathMarker.position({
  relativeFrom: mathMarker.center,
  relativeTo: mathPoint,
  x: 0,
  y: 0,
});

artboard.addElement(mathMarker);

const mathLabel = new Text({
  content: "Point (-3, 5) →",
  fontSize: 11,
  style: { fill: "#f39c12" },
});

mathLabel.position({
  relativeFrom: mathLabel.rightCenter,
  relativeTo: mathPoint,
  x: -10,
  y: 0,
});

artboard.addElement(mathLabel);

// 4. List all x-axis labels
const allXLabels = demoGraph.getAllLabelPositions('x');
const labelListText = `X-axis labels: ${allXLabels.map(l => l.label).join(', ')} (${allXLabels.length} total)`;

const labelList = new Text({
  content: labelListText,
  fontSize: 11,
  style: { fill: "#34495e" },
  maxWidth: 600,
});

coordDemoStack.addElement(labelList);

console.log("=== All X-axis labels ===");
console.log(allXLabels);

// Summary note
const summaryStack = new VStack({
  spacing: 10,
});

summaryStack.position({
  relativeFrom: summaryStack.topLeft,
  relativeTo: coordDemoStack.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(summaryStack);

const summaryTitle = new Text({
  content: "Summary of New Features:",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

summaryStack.addElement(summaryTitle);

const feature1 = new Text({
  content: "✓ Auto-calculated gridSpacing based on pixel density (default ~50px between labels)",
  fontSize: 12,
  style: { fill: "#27ae60" },
  maxWidth: 1200,
});

summaryStack.addElement(feature1);

const feature2 = new Text({
  content: "✓ Configurable minLabelDensity for custom spacing requirements",
  fontSize: 12,
  style: { fill: "#27ae60" },
  maxWidth: 1200,
});

summaryStack.addElement(feature2);

const feature3 = new Text({
  content: "✓ getLabelPosition(axis, value) - Get absolute coordinates of specific axis labels",
  fontSize: 12,
  style: { fill: "#27ae60" },
  maxWidth: 1200,
});

summaryStack.addElement(feature3);

const feature4 = new Text({
  content: "✓ getAllLabelPositions(axis) - Get all label information with absolute positions",
  fontSize: 12,
  style: { fill: "#27ae60" },
  maxWidth: 1200,
});

summaryStack.addElement(feature4);

const feature5 = new Text({
  content: "✓ coordinateToPosition(x, y) - Convert mathematical coordinates to absolute positions",
  fontSize: 12,
  style: { fill: "#27ae60" },
  maxWidth: 1200,
});

summaryStack.addElement(feature5);

artboard.render();

