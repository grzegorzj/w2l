/**
 * Simple Shaded Regions Example
 * 
 * Demonstrates the shaded regions feature in FunctionGraph.
 * This example shows how to shade areas between curves.
 * 
 * You specify which functions bound the region (top and bottom) and optionally
 * the x-range (domain). The graph fills the area between these curves.
 */

import {
  Artboard,
  FunctionGraph,
  Text,
  Container,
  Circle,
  Rect,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Main vertical container for all content
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 30,
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// Title
const title = new Text({
  content: "Shaded Regions Between Curves",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

mainContainer.addElement(title);

// Description
const description = new Text({
  content: "Demonstrating area shading between function curves",
  fontSize: 14,
  style: { fill: "#7f8c8d" },
});

mainContainer.addElement(description);

const howto = new Text({
  content: "Specify topFunction and bottomFunction indices, optional domain, and style",
  fontSize: 12,
  style: { fill: "#95a5a6" },
  fontStyle: "italic",
});

mainContainer.addElement(howto);

// Example 1: Simple parabola and line intersection (in a horizontal container)
const example1Title = new Text({
  content: "Example 1: Parabola and Line (Inside Horizontal Container)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#34495e" },
});

mainContainer.addElement(example1Title);

// Create a horizontal container to test nested positioning
const example1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  boxModel: { padding: 20 },
  style: {
    fill: "#f5f5f5",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

mainContainer.addElement(example1Container);

// Add a side panel with info
const infoPanelLeft = new Container({
  width: 200,
  height: "auto",
  direction: "vertical",
  spacing: 10,
  boxModel: { padding: 15 },
  style: {
    fill: "#fff3e0",
    stroke: "#ff9800",
    strokeWidth: 1,
  },
});

example1Container.addElement(infoPanelLeft);

const infoTitle = new Text({
  content: "Test Setup",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#e65100" },
});

infoPanelLeft.addElement(infoTitle);

const infoText = new Text({
  content: "Graph is nested inside a horizontal container to test coordinate retrieval in complex layouts.",
  fontSize: 11,
  style: { fill: "#424242" },
  maxWidth: 180,
});

infoPanelLeft.addElement(infoText);

const graph1 = new FunctionGraph({
  functions: [
    {
      fn: (x) => -x * x + 4,  // Function 0: parabola
      color: "#e74c3c",
      strokeWidth: 3,
    },
    {
      fn: (x) => x - 2,  // Function 1: line
      color: "#3498db",
      strokeWidth: 3,
    },
  ],
  width: 600,
  height: 400,
  domain: [-4, 4],
  range: [-6, 5],
  showGrid: true,
  showAxes: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: true,  // Show auto-rendered remarkable points
  
  // NEW FEATURE: Shaded regions
  shadedRegions: [
    {
      topFunction: 0,  // Parabola is on top
      bottomFunction: 1,  // Line is on bottom
      domain: [-3, 2],  // Shade between intersection points
      style: {
        fill: "#ffd54f",
        fillOpacity: 0.3,
      },
    },
  ],
});

example1Container.addElement(graph1);

// Add visual markers for remarkable points on graph1
const roots1 = graph1.getRemarkablePoints("root");
console.log("Graph 1 - Roots found:", roots1.length);

// Mark the roots with crosshairs
roots1.forEach((root, idx) => {
  const pos = graph1.getRemarkablePoint("root", idx);
  if (pos) {
    console.log(`Root ${idx} at:`, pos, "math coords:", root.x, root.y);
    
    // Draw crosshair
    const hLine = new Rect({
      width: 40,
      height: 2,
      style: { fill: "#ff5722", stroke: "none" },
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
      height: 40,
      style: { fill: "#ff5722", stroke: "none" },
    });
    
    vLine.position({
      relativeFrom: vLine.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    artboard.addElement(vLine);
    
    // Add a circle marker
    const marker = new Circle({
      radius: 6,
      style: {
        fill: "none",
        stroke: "#ff5722",
        strokeWidth: 3,
      },
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    artboard.addElement(marker);
  }
});

// Example 2: Two sine waves (also in a container)
const example2Title = new Text({
  content: "Example 2: Two Sine Waves (Inside Container with Padding)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#34495e" },
});

mainContainer.addElement(example2Title);

// Wrap graph2 in a container with padding
const example2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 25 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

mainContainer.addElement(example2Container);

const graph2Note = new Text({
  content: "Nested in vertical container with 25px padding on all sides",
  fontSize: 11,
  fontStyle: "italic",
  style: { fill: "#2e7d32" },
});

example2Container.addElement(graph2Note);

const graph2 = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.sin(x),  // Function 0
      color: "#9b59b6",
      strokeWidth: 3,
    },
    {
      fn: (x) => Math.sin(x - Math.PI / 2),  // Function 1 (cosine)
      color: "#1abc9c",
      strokeWidth: 3,
    },
  ],
  width: 600,
  height: 400,
  domain: [0, 2 * Math.PI],
  range: [-1.5, 1.5],
  showGrid: true,
  showAxes: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  
  shadedRegions: [
    {
      topFunction: 0,  // sin(x) is on top in this region
      bottomFunction: 1,  // cos(x) is on bottom
      domain: [0, Math.PI * 3 / 4],  // First region
      style: {
        fill: "#e8daef",
        fillOpacity: 0.4,
      },
    },
    {
      topFunction: 1,  // cos(x) is on top in this region
      bottomFunction: 0,  // sin(x) is on bottom
      domain: [Math.PI * 3 / 4, Math.PI * 7 / 4],  // Second region
      style: {
        fill: "#d1f2eb",
        fillOpacity: 0.4,
      },
    },
  ],
});

example2Container.addElement(graph2);

// Mark the maxima and minima on graph2
const maxima2 = graph2.getRemarkablePoints("local-maximum");
const minima2 = graph2.getRemarkablePoints("local-minimum");

console.log("Graph 2 - Maxima found:", maxima2.length, "Minima found:", minima2.length);

maxima2.forEach((max, idx) => {
  const pos = graph2.getRemarkablePoint("local-maximum", idx);
  if (pos) {
    const marker = new Circle({
      radius: 8,
      style: {
        fill: "rgba(255, 87, 34, 0.3)",
        stroke: "#ff5722",
        strokeWidth: 2,
      },
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    artboard.addElement(marker);
  }
});

minima2.forEach((min, idx) => {
  const pos = graph2.getRemarkablePoint("local-minimum", idx);
  if (pos) {
    const marker = new Circle({
      radius: 8,
      style: {
        fill: "rgba(33, 150, 243, 0.3)",
        stroke: "#2196f3",
        strokeWidth: 2,
      },
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    artboard.addElement(marker);
  }
});

// Example 3: Parabola above and below x-axis
const example3Title = new Text({
  content: "Example 3: Area Under Curve",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#34495e" },
});

mainContainer.addElement(example3Title);

const graph3 = new FunctionGraph({
  functions: [
    {
      fn: (x) => x * x - 4,  // Function 0
      color: "#e67e22",
      strokeWidth: 3,
    },
  ],
  width: 600,
  height: 400,
  domain: [-3, 3],
  range: [-5, 6],
  showGrid: true,
  showAxes: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  
  // Shade the area between the curve and x-axis
  shadedRegions: [
    {
      topFunction: 0,  // The parabola
      // bottomFunction undefined = uses y=0 (x-axis)
      domain: [-2, 2],  // Between the roots
      style: {
        fill: "#f39c12",
        fillOpacity: 0.3,
      },
    },
  ],
});

mainContainer.addElement(graph3);

// Mark the minimum point on graph3
const minima3 = graph3.getRemarkablePoints("local-minimum");
console.log("Graph 3 - Minima found:", minima3.length);

if (minima3.length > 0) {
  const pos = graph3.getRemarkablePoint("local-minimum", 0);
  if (pos) {
    // Draw a bounding box
    const bbox = new Rect({
      width: 40,
      height: 40,
      style: {
        fill: "rgba(52, 152, 219, 0.2)",
        stroke: "#3498db",
        strokeWidth: 2,
      },
    });
    
    bbox.position({
      relativeFrom: bbox.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    artboard.addElement(bbox);
    
    // Add label
    const label = new Text({
      content: "Minimum",
      fontSize: 12,
      fontWeight: "bold",
      style: { fill: "#3498db" },
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: pos,
      x: 0,
      y: 25,
    });
    
    artboard.addElement(label);
  }
}

// Add a comprehensive note about the visualization
const debugNote = new Text({
  content: "✓ All colored markers show remarkable points retrieved via getRemarkablePoint() API",
  fontSize: 12,
  fontWeight: "bold",
  style: { fill: "#27ae60" },
});

mainContainer.addElement(debugNote);

const debugNote2 = new Text({
  content: "✓ Graphs are nested in containers with padding to test coordinate transformation",
  fontSize: 12,
  fontWeight: "bold",
  style: { fill: "#27ae60" },
});

mainContainer.addElement(debugNote2);

const debugNote3 = new Text({
  content: "If working correctly: Orange/blue markers should align perfectly with auto-rendered red dots",
  fontSize: 11,
  fontStyle: "italic",
  style: { fill: "#7f8c8d" },
});

mainContainer.addElement(debugNote3);

return artboard.render();

