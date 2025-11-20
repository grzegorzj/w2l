import {
  Artboard,
  FunctionGraph,
  Text,
  Rectangle,
  VStack,
} from "w2l";

/**
 * Example 45: Remarkable Points in Simple VStack
 *
 * Tests remarkable point positioning in a straightforward VStack layout
 * with multiple graphs stacked vertically.
 */

const artboard = new Artboard({
  size: { width: 900, height: 1400 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
});

// Title
const title = new Text({
  content: "Remarkable Points in VStack (Simple)",
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
  content: "Three graphs stacked vertically. Red dots = auto-rendered remarkable points | Crosshairs = manually positioned via getRemarkablePoint()",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
  maxWidth: 820,
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: title.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Create a VStack with three graphs
const vstack = new VStack({
  spacing: 30,
});

vstack.position({
  relativeFrom: vstack.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(vstack);

// ===== Graph 1: Parabola =====
const graph1Title = new Text({
  content: "Graph 1: Parabola",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

vstack.addElement(graph1Title);

const graph1 = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "#3498db",
  },
  width: 600,
  height: 300,
  domain: [-5, 5],
  range: [-5, 6],
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "Graph1",
});

vstack.addElement(graph1);

// ===== Graph 2: Sine Wave =====
const graph2Title = new Text({
  content: "Graph 2: Sine Wave",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

vstack.addElement(graph2Title);

const graph2 = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x * 2),
    color: "#e74c3c",
  },
  width: 600,
  height: 300,
  domain: [-Math.PI, Math.PI],
  range: [-1.5, 1.5],
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "Graph2",
});

vstack.addElement(graph2);

// ===== Graph 3: Cubic =====
const graph3Title = new Text({
  content: "Graph 3: Cubic Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

vstack.addElement(graph3Title);

const graph3 = new FunctionGraph({
  functions: {
    fn: (x) => x * x * x - 3 * x,
    color: "#9b59b6",
  },
  width: 600,
  height: 300,
  domain: [-3, 3],
  range: [-5, 5],
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  name: "Graph3",
});

vstack.addElement(graph3);

// ===== Debug logging =====
console.log("=== Layout Positions Debug ===");
console.log("VStack position:", vstack.currentPosition);
console.log("VStack absolute position:", vstack.getAbsolutePosition());
console.log("Graph1 position:", graph1.currentPosition);
console.log("Graph1 absolute position:", graph1.getAbsolutePosition());
console.log("Graph2 position:", graph2.currentPosition);
console.log("Graph2 absolute position:", graph2.getAbsolutePosition());
console.log("Graph3 position:", graph3.currentPosition);
console.log("Graph3 absolute position:", graph3.getAbsolutePosition());

// ===== Draw crosshairs on Graph 1 =====
console.log("\n=== Graph 1 Remarkable Points ===");
const g1Roots = graph1.getRemarkablePoints("root");
console.log("Graph1 roots:", g1Roots.length);

if (g1Roots.length > 0) {
  const rootPos = graph1.getRemarkablePoint("root", 0);
  console.log("Graph1 Root 0 position:", rootPos);
  
  if (rootPos) {
    // Crosshair
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#e74c3c", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root 0 (G1)",
      fontSize: 9,
      style: { fill: "#e74c3c" }
    });
    label.position({ relativeFrom: label.bottomCenter, relativeTo: rootPos, x: 0, y: -25 });
    artboard.addElement(label);
  }
}

if (g1Roots.length > 1) {
  const rootPos = graph1.getRemarkablePoint("root", 1);
  console.log("Graph1 Root 1 position:", rootPos);
  
  if (rootPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#27ae60", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#27ae60", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root 1 (G1)",
      fontSize: 9,
      style: { fill: "#27ae60" }
    });
    label.position({ relativeFrom: label.bottomCenter, relativeTo: rootPos, x: 0, y: -25 });
    artboard.addElement(label);
  }
}

// ===== Draw crosshairs on Graph 2 =====
console.log("\n=== Graph 2 Remarkable Points ===");
const g2Roots = graph2.getRemarkablePoints("root");
const g2Maxima = graph2.getRemarkablePoints("local-maximum");
console.log("Graph2 roots:", g2Roots.length);
console.log("Graph2 maxima:", g2Maxima.length);

if (g2Roots.length > 0) {
  const rootPos = graph2.getRemarkablePoint("root", 0);
  console.log("Graph2 Root 0 position:", rootPos);
  
  if (rootPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#f39c12", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#f39c12", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root (G2)",
      fontSize: 9,
      style: { fill: "#f39c12" }
    });
    label.position({ relativeFrom: label.bottomCenter, relativeTo: rootPos, x: 0, y: -25 });
    artboard.addElement(label);
  }
}

if (g2Maxima.length > 0) {
  const maxPos = graph2.getRemarkablePoint("local-maximum", 0);
  console.log("Graph2 Maximum 0 position:", maxPos);
  
  if (maxPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#8e44ad", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: maxPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#8e44ad", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: maxPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Max (G2)",
      fontSize: 9,
      style: { fill: "#8e44ad" }
    });
    label.position({ relativeFrom: label.topCenter, relativeTo: maxPos, x: 0, y: 25 });
    artboard.addElement(label);
  }
}

// ===== Draw crosshairs on Graph 3 =====
console.log("\n=== Graph 3 Remarkable Points ===");
const g3Roots = graph3.getRemarkablePoints("root");
const g3Minima = graph3.getRemarkablePoints("local-minimum");
const g3Maxima = graph3.getRemarkablePoints("local-maximum");
console.log("Graph3 roots:", g3Roots.length);
console.log("Graph3 minima:", g3Minima.length);
console.log("Graph3 maxima:", g3Maxima.length);

if (g3Roots.length > 0) {
  const rootPos = graph3.getRemarkablePoint("root", 0);
  console.log("Graph3 Root 0 position:", rootPos);
  
  if (rootPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#16a085", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#16a085", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: rootPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Root (G3)",
      fontSize: 9,
      style: { fill: "#16a085" }
    });
    label.position({ relativeFrom: label.bottomCenter, relativeTo: rootPos, x: 0, y: -25 });
    artboard.addElement(label);
  }
}

if (g3Minima.length > 0) {
  const minPos = graph3.getRemarkablePoint("local-minimum", 0);
  console.log("Graph3 Minimum 0 position:", minPos);
  
  if (minPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#c0392b", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: minPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#c0392b", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: minPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Min (G3)",
      fontSize: 9,
      style: { fill: "#c0392b" }
    });
    label.position({ relativeFrom: label.topCenter, relativeTo: minPos, x: 0, y: 25 });
    artboard.addElement(label);
  }
}

if (g3Maxima.length > 0) {
  const maxPos = graph3.getRemarkablePoint("local-maximum", 0);
  console.log("Graph3 Maximum 0 position:", maxPos);
  
  if (maxPos) {
    const hLine = new Rectangle({
      width: 40,
      height: 2,
      style: { fill: "#2980b9", stroke: "none" }
    });
    hLine.position({ relativeFrom: hLine.center, relativeTo: maxPos, x: 0, y: 0 });
    artboard.addElement(hLine);
    
    const vLine = new Rectangle({
      width: 2,
      height: 40,
      style: { fill: "#2980b9", stroke: "none" }
    });
    vLine.position({ relativeFrom: vLine.center, relativeTo: maxPos, x: 0, y: 0 });
    artboard.addElement(vLine);
    
    const label = new Text({
      content: "Max (G3)",
      fontSize: 9,
      style: { fill: "#2980b9" }
    });
    label.position({ relativeFrom: label.topCenter, relativeTo: maxPos, x: 0, y: 25 });
    artboard.addElement(label);
  }
}

// Add summary note
const summary = new Text({
  content: "All three graphs in a single VStack. Crosshairs should be centered on red dots. Check console for detailed positions.",
  fontSize: 11,
  fontWeight: "bold",
  style: { fill: "#e74c3c" },
  maxWidth: 820,
});

summary.position({
  relativeFrom: summary.topLeft,
  relativeTo: vstack.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(summary);

artboard.render();

