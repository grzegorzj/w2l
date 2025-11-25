/**
 * Example 17: Remarkable Points in Various Layouts (New System)
 *
 * Tests remarkable point positioning in horizontal and vertical Container layouts.
 */

import {
  Artboard,
  FunctionGraph,
  Text,
  Rect,
  Container,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Title
const title = new Text({
  content: "Remarkable Points in Horizontal & Vertical Containers",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Description
const description = new Text({
  content:
    "Testing remarkable point coordinate retrieval in different layout contexts. Red dots = auto-rendered | Crosshairs = manually positioned via getRemarkablePoint()",
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

// Create a horizontal stack with two columns
const hstack = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 40,
  style: {
    fill: "transparent",
    stroke: "#95a5a6",
    strokeWidth: 1,
    strokeDasharray: "3,3",
  },
  boxModel: { padding: 20 },
});

hstack.position({
  relativeFrom: hstack.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(hstack);

// ===== COLUMN 1: Vertical Container with graph =====
const column1 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  style: {
    fill: "rgba(52, 152, 219, 0.05)",
    stroke: "#3498db",
    strokeWidth: 1,
    strokeDasharray: "3,3",
  },
  boxModel: { padding: 15 },
});

const col1Title = new Text({
  content: "Column 1: Vertical Container",
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
  debug: true,
});

column1.addElement(graph1);

const col1Note = new Text({
  content: "Graph in Vertical Container",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

column1.addElement(col1Note);

hstack.addElement(column1);

// ===== COLUMN 2: Vertical Container with graph =====
const column2 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  style: {
    fill: "rgba(231, 76, 60, 0.05)",
    stroke: "#e74c3c",
    strokeWidth: 1,
    strokeDasharray: "3,3",
  },
  boxModel: { padding: 15 },
});

const col2Title = new Text({
  content: "Column 2: Vertical Container",
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
  debug: true,
});

column2.addElement(graph2);

const col2Note = new Text({
  content: "Graph in Vertical Container (2nd column)",
  fontSize: 11,
  style: { fill: "#7f8c8d" },
});

column2.addElement(col2Note);

hstack.addElement(column2);

// ===== Debug logging =====
console.log("=== Layout Positions Debug (New System) ===");
console.log("HStack position:", hstack.getAbsolutePosition());
console.log("Column 1 position:", column1.getAbsolutePosition());
console.log("Column 2 position:", column2.getAbsolutePosition());
console.log("Graph1 position:", graph1.getAbsolutePosition());
console.log("Graph2 position:", graph2.getAbsolutePosition());

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
    const hLine = new Rect({
      width: 30,
      height: 2,
      style: { fill: "#e74c3c", stroke: "none" },
    });

    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0,
    });

    artboard.addElement(hLine);

    // Vertical line
    const vLine = new Rect({
      width: 2,
      height: 30,
      style: { fill: "#e74c3c", stroke: "none" },
    });

    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0,
    });

    artboard.addElement(vLine);

    // Label
    const label = new Text({
      content: "Root (G1)",
      fontSize: 9,
      style: { fill: "#e74c3c" },
    });

    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -20,
    });

    artboard.addElement(label);
  }
}

// Draw crosshair on y-intercept of Graph 1
if (g1YIntercept.length > 0) {
  const pos = graph1.getRemarkablePoint("y-intercept", 0);
  console.log("Graph1 Y-intercept position:", pos);

  if (pos) {
    const hLine = new Rect({
      width: 30,
      height: 2,
      style: { fill: "#27ae60", stroke: "none" },
    });

    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });

    artboard.addElement(hLine);

    const vLine = new Rect({
      width: 2,
      height: 30,
      style: { fill: "#27ae60", stroke: "none" },
    });

    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });

    artboard.addElement(vLine);

    const label = new Text({
      content: "Y-int (G1)",
      fontSize: 9,
      style: { fill: "#27ae60" },
    });

    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 20,
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
    const hLine = new Rect({
      width: 30,
      height: 2,
      style: { fill: "#9b59b6", stroke: "none" },
    });

    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0,
    });

    artboard.addElement(hLine);

    const vLine = new Rect({
      width: 2,
      height: 30,
      style: { fill: "#9b59b6", stroke: "none" },
    });

    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: rootPos,
      x: 0,
      y: 0,
    });

    artboard.addElement(vLine);

    const label = new Text({
      content: "Root (G2)",
      fontSize: 9,
      style: { fill: "#9b59b6" },
    });

    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: rootPos,
      x: 0,
      y: -20,
    });

    artboard.addElement(label);
  }
}

// Draw crosshair on first maximum of Graph 2
if (g2Maxima.length > 0) {
  const pos = graph2.getRemarkablePoint("local-maximum", 0);
  console.log("Graph2 Maximum 0 position:", pos);

  if (pos) {
    const hLine = new Rect({
      width: 30,
      height: 2,
      style: { fill: "#f39c12", stroke: "none" },
    });

    hLine.position({
      relativeFrom: hLine.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });

    artboard.addElement(hLine);

    const vLine = new Rect({
      width: 2,
      height: 30,
      style: { fill: "#f39c12", stroke: "none" },
    });

    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });

    artboard.addElement(vLine);

    const label = new Text({
      content: "Max (G2)",
      fontSize: 9,
      style: { fill: "#f39c12" },
    });

    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 20,
    });

    artboard.addElement(label);
  }
}

// Add summary note
const summary = new Text({
  content:
    "If working correctly: crosshairs should be centered on red dots in both graphs. Check console for position details.",
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

return artboard.render();

