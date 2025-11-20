import {
  Artboard,
  FunctionGraph,
  Text,
  Rectangle,
  VStack,
  HStack,
} from "w2l";

/**
 * Example 44: Remarkable Points in Various Layouts
 *
 * Tests remarkable point positioning in VStack, HStack, and nested layouts.
 */

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

// Title
const title = new Text({
  content: "Remarkable Points in VStack & HStack",
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
  content: "Testing remarkable point coordinate retrieval in different layout contexts. Red dots = auto-rendered | Crosshairs = manually positioned via getRemarkablePoint()",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
  maxWidth: 1320,
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: title.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Create an HStack with two columns
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

// ===== COLUMN 1: VStack with graph =====
const column1 = new VStack({
  spacing: 15,
});

const col1Title = new Text({
  content: "Column 1: VStack",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

column1.addElement(col1Title);

const graph1 = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "#3498db",
  },
  width: 400,
  height: 300,
  domain: [-5, 5],
  range: [-5, 6],
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "Graph1",
});

column1.addElement(graph1);

const col1Note = new Text({
  content: "Graph in VStack",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

column1.addElement(col1Note);

hstack.addElement(column1);

// ===== COLUMN 2: VStack with graph =====
const column2 = new VStack({
  spacing: 15,
});

const col2Title = new Text({
  content: "Column 2: VStack",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

column2.addElement(col2Title);

const graph2 = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x * 2),
    color: "#e74c3c",
  },
  width: 400,
  height: 300,
  domain: [-Math.PI, Math.PI],
  range: [-1.5, 1.5],
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "Graph2",
});

column2.addElement(graph2);

const col2Note = new Text({
  content: "Graph in VStack (2nd column)",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

column2.addElement(col2Note);

hstack.addElement(column2);

// ===== Debug logging =====
console.log("=== Layout Positions Debug ===");
console.log("HStack position:", hstack.currentPosition);
console.log("HStack absolute position:", hstack.getAbsolutePosition());
console.log("Column 1 (VStack) position:", column1.currentPosition);
console.log("Column 1 absolute position:", column1.getAbsolutePosition());
console.log("Column 2 (VStack) position:", column2.currentPosition);
console.log("Column 2 absolute position:", column2.getAbsolutePosition());
console.log("Graph1 position:", graph1.currentPosition);
console.log("Graph1 absolute position:", graph1.getAbsolutePosition());
console.log("Graph2 position:", graph2.currentPosition);
console.log("Graph2 absolute position:", graph2.getAbsolutePosition());

// ===== Draw crosshairs on Graph 1 remarkable points =====
console.log("\n=== Graph 1 Remarkable Points ===");
const g1Roots = graph1.getRemarkablePoints("root");
const g1YIntercept = graph1.getRemarkablePoints("y-intercept");
const g1Minima = graph1.getRemarkablePoints("local-minimum");

console.log("Graph1 roots:", g1Roots.length);
console.log("Graph1 y-intercepts:", g1YIntercept.length);
console.log("Graph1 minima:", g1Minima.length);

// Draw crosshair on first root of Graph 1
if (g1Roots.length > 0) {
  const rootPos = graph1.getRemarkablePoint("root", 0);
  console.log("Graph1 Root 0 position:", rootPos);
  
  if (rootPos) {
    // Horizontal line
    const hLine = new Rectangle({
      width: 30,
      height: 2,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    // Vertical line
    const vLine = new Rectangle({
      width: 2,
      height: 30,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    // Label
    const label = new Text({
      content: "Root (G1)",
      fontSize: 9,
      style: { fill: "#e74c3c" }
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -20
    });
    
    artboard.addElement(label);
  }
}

// Draw crosshair on y-intercept of Graph 1
if (g1YIntercept.length > 0) {
  const pos = graph1.getRemarkablePoint("y-intercept", 0);
  console.log("Graph1 Y-intercept position:", pos);
  
  if (pos) {
    const hLine = new Rectangle({
      width: 30,
      height: 2,
      style: { fill: "#27ae60", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 30,
      style: { fill: "#27ae60", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Y-int (G1)",
      fontSize: 9,
      style: { fill: "#27ae60" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 20
    });
    
    artboard.addElement(label);
  }
}

// ===== Draw crosshairs on Graph 2 remarkable points =====
console.log("\n=== Graph 2 Remarkable Points ===");
const g2Roots = graph2.getRemarkablePoints("root");
const g2YIntercept = graph2.getRemarkablePoints("y-intercept");
const g2Maxima = graph2.getRemarkablePoints("local-maximum");

console.log("Graph2 roots:", g2Roots.length);
console.log("Graph2 y-intercepts:", g2YIntercept.length);
console.log("Graph2 maxima:", g2Maxima.length);

// Draw crosshair on first root of Graph 2
if (g2Roots.length > 0) {
  const rootPos = graph2.getRemarkablePoint("root", 0);
  console.log("Graph2 Root 0 position:", rootPos);
  
  if (rootPos) {
    const hLine = new Rectangle({
      width: 30,
      height: 2,
      style: { fill: "#9b59b6", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 30,
      style: { fill: "#9b59b6", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root (G2)",
      fontSize: 9,
      style: { fill: "#9b59b6" }
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -20
    });
    
    artboard.addElement(label);
  }
}

// Draw crosshair on first maximum of Graph 2
if (g2Maxima.length > 0) {
  const pos = graph2.getRemarkablePoint("local-maximum", 0);
  console.log("Graph2 Maximum 0 position:", pos);
  
  if (pos) {
    const hLine = new Rectangle({
      width: 30,
      height: 2,
      style: { fill: "#f39c12", stroke: "none" }
    });
    
    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 30,
      style: { fill: "#f39c12", stroke: "none" }
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0
    });
    
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Max (G2)",
      fontSize: 9,
      style: { fill: "#f39c12" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 20
    });
    
    artboard.addElement(label);
  }
}

// Add summary note
const summary = new Text({
  content: "If working correctly: crosshairs should be centered on red dots in both graphs. Check console for position details.",
  fontSize: 11,
  fontWeight: "bold",
  style: { fill: "#e74c3c" },
  maxWidth: 1320,
});

summary.position({
  relativeFrom: summary.topLeft,
  relativeTo: hstack.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(summary);

artboard.render();

