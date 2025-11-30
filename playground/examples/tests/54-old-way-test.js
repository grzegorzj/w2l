/**
 * Old Way Test: Using addElement() Only
 * 
 * This test uses ONLY the old .addElement() method (no parent config)
 * to verify that triangle labels and text highlights work correctly
 * without the new parent config feature.
 * 
 * This helps us determine if issues are related to the new feature
 * or if they were pre-existing bugs.
 */

import {
  Artboard,
  Container,
  Text,
  TextArea,
  Triangle,
  Rect,
  Circle,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f5f5f5",
  boxModel: { padding: 40 },
});

// ========================================
// DEBUG HELPER: Add colored dots at corners
// ========================================
function addDebugDots(element, label = "") {
  try {
    const corners = [
      { name: "topLeft", pos: element.topLeft, color: "#ff0000" }, // red
      { name: "topRight", pos: element.topRight, color: "#0000ff" }, // blue
      { name: "bottomLeft", pos: element.bottomLeft, color: "#00ff00" }, // green
      { name: "bottomRight", pos: element.bottomRight, color: "#ff00ff" }, // magenta
    ];

    console.log(`\n📍 Debug dots for ${label}:`);
    corners.forEach(({ name, pos, color }) => {
      if (!pos || pos.x === undefined || pos.y === undefined) {
        console.log(`  ${name}: UNDEFINED`);
        return;
      }
      
      console.log(`  ${name}: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
      
      const dot = new Circle({
        radius: 5,
        style: {
          fill: color,
          stroke: "#000000",
          strokeWidth: 1,
        },
      });

      dot.position({
        relativeFrom: dot.center,
        relativeTo: pos,
        x: 0,
        y: 0,
      });

      artboard.addElement(dot);
    });
    
    // Also add a center dot in yellow
    if (element.center && element.center.x !== undefined) {
      const centerDot = new Circle({
        radius: 4,
        style: {
          fill: "#ffff00",
          stroke: "#000000",
          strokeWidth: 1,
        },
      });
      
      centerDot.position({
        relativeFrom: centerDot.center,
        relativeTo: element.center,
        x: 0,
        y: 0,
      });
      
      console.log(`  center: (${element.center.x.toFixed(2)}, ${element.center.y.toFixed(2)})`);
      artboard.addElement(centerDot);
    } else {
      console.log(`  center: UNDEFINED`);
    }
  } catch (error) {
    console.error(`Error adding debug dots for ${label}:`, error.message);
  }
}

// For containers, also show contentBox corners
function addDebugDotsForContainer(container, label = "") {
  try {
    addDebugDots(container, `${label} borderBox`);
    
    if (!container.contentBox) {
      console.log(`\n📦 ContentBox dots for ${label}: NO CONTENTBOX`);
      return;
    }
    
    const contentCorners = [
      { name: "contentBox.topLeft", pos: container.contentBox.topLeft, color: "#ff8800" }, // orange
      { name: "contentBox.topRight", pos: container.contentBox.topRight, color: "#0088ff" }, // light blue
      { name: "contentBox.bottomLeft", pos: container.contentBox.bottomLeft, color: "#88ff00" }, // lime
      { name: "contentBox.bottomRight", pos: container.contentBox.bottomRight, color: "#ff0088" }, // pink
    ];

    console.log(`\n📦 ContentBox dots for ${label}:`);
    contentCorners.forEach(({ name, pos, color }) => {
      if (!pos || pos.x === undefined || pos.y === undefined) {
        console.log(`  ${name}: UNDEFINED`);
        return;
      }
      
      console.log(`  ${name}: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
      
      const dot = new Circle({
        radius: 6,
        style: {
          fill: color,
          stroke: "#ffffff",
          strokeWidth: 2,
        },
      });

      dot.position({
        relativeFrom: dot.center,
        relativeTo: pos,
        x: 0,
        y: 0,
      });

      artboard.addElement(dot);
    });
  } catch (error) {
    console.error(`Error adding debug dots for container ${label}:`, error.message);
  }
}

// ========================================
// TEST 1: Simple Two-Column Layout
// ========================================

const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer); // OLD WAY

// Left container
const leftContainer = new Container({
  width: 300,
  height: 400,
  direction: "vertical",
  spacing: 20,
  boxModel: { padding: 20 },
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 2,
  },
});

mainContainer.addElement(leftContainer); // OLD WAY

// DEBUG: Show left container corners
addDebugDotsForContainer(leftContainer, "leftContainer");

const leftTitle = new Text({
  content: "Left Container (Old Way)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1565c0" },
});

leftContainer.addElement(leftTitle); // OLD WAY

const leftText = new Text({
  content: "This uses .addElement()",
  fontSize: 14,
  style: { fill: "#424242" },
});

leftContainer.addElement(leftText); // OLD WAY

// Right container with triangle
const rightContainer = new Container({
  width: 400,
  height: 400,
  direction: "freeform",
  boxModel: { padding: 20 },
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

mainContainer.addElement(rightContainer); // OLD WAY

// DEBUG: Show right container corners BEFORE adding title
addDebugDotsForContainer(rightContainer, "rightContainer");

const rightTitle = new Text({
  content: "Right Container with Triangle",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#6a1b9a" },
});

console.log("\n🔍 BEFORE positioning rightTitle:");
try {
  console.log("  rightTitle.topLeft:", rightTitle.topLeft);
  console.log("  rightContainer.contentBox.topLeft:", rightContainer.contentBox.topLeft);
} catch (e) {
  console.error("  Error accessing positions:", e.message);
}

rightTitle.position({
  relativeFrom: rightTitle.topLeft,
  relativeTo: rightContainer.contentBox.topLeft,
  x: 0,
  y: 0,
});

console.log("\n🔍 AFTER positioning rightTitle:");
try {
  console.log("  rightTitle.topLeft:", rightTitle.topLeft);
} catch (e) {
  console.error("  Error accessing position:", e.message);
}

rightContainer.addElement(rightTitle); // OLD WAY

// DEBUG: Show title corners after positioning
addDebugDots(rightTitle, "rightTitle");

// Create triangle
const triangle = new Triangle({
  type: "right",
  a: 150,
  b: 120,
  orientation: "bottomLeft",
  style: {
    fill: "#ffeb3b",
    stroke: "#f57f17",
    strokeWidth: 3,
  },
});

triangle.position({
  relativeFrom: triangle.boundingBoxTopLeft,
  relativeTo: rightContainer.contentBox.topLeft,
  x: 50,
  y: 80,
});

rightContainer.addElement(triangle); // OLD WAY

// DEBUG: Show triangle corners
addDebugDots(triangle, "triangle");

// Add triangle labels (OLD WAY)
const sideLabels = triangle.createSideLabels(["$a$", "$b$", "$c$"], {
  offset: 20,
  fontSize: 20,
});

console.log("\n📐 Triangle absolute vertices:", triangle.absoluteVertices);
console.log("📝 Side labels created:");
sideLabels.forEach((label, i) => {
  const pos = label.topLeft;
  console.log(`  Label ${i}: topLeft = (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  artboard.addElement(label); // OLD WAY - add to artboard
  
  // DEBUG: Show label corners
  addDebugDots(label, `sideLabel[${i}]`);
});

// ========================================
// TEST 2: TextArea with Highlights
// ========================================

const textSection = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  boxModel: { padding: 20 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

textSection.position({
  relativeFrom: textSection.topLeft,
  relativeTo: mainContainer.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(textSection); // OLD WAY

const textTitle = new Text({
  content: "TextArea Highlights Test (Old Way)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#2e7d32" },
});

textSection.addElement(textTitle); // OLD WAY

const textArea = new TextArea({
  content:
    "The {highlight:quick}quick{/highlight} brown fox jumps over the {highlight:lazy}lazy{/highlight} dog. This is a {highlight:test}test{/highlight} of highlighting.",
  width: 600,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#ffffff",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

textSection.addElement(textArea); // OLD WAY

// Helper function to add highlight
function addHighlight(word, color) {
  const highlighted = textArea.getHighlightedWord(word);
  if (!highlighted) {
    console.error(`Word "${word}" not found!`);
    return;
  }

  console.log(`Highlighting "${word}":`, {
    bbox: highlighted.bbox,
    topLeft: highlighted.topLeft,
    center: highlighted.center,
  });

  const highlight = new Rect({
    width: highlighted.bbox.width,
    height: highlighted.bbox.height,
    style: {
      fill: color,
      opacity: 0.5,
    },
  });

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: highlighted.topLeft,
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight); // OLD WAY
}

// Add highlights (using OLD WAY throughout)
addHighlight("quick", "#fff3cd");
addHighlight("lazy", "#d1ecf1");
addHighlight("test", "#f8d7da");

// ========================================
// TEST 3: Simple Triangle in Main Artboard
// ========================================

const simpleSection = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  boxModel: { padding: 20 },
  style: {
    fill: "#fff3cd",
    stroke: "#ffc107",
    strokeWidth: 2,
  },
});

simpleSection.position({
  relativeFrom: simpleSection.topLeft,
  relativeTo: textSection.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(simpleSection); // OLD WAY

const simpleTitle = new Text({
  content: "Simple Triangle Test (No Nesting)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#f57c00" },
});

simpleSection.addElement(simpleTitle); // OLD WAY

// Create a simple container for the triangle
const simpleTriangleContainer = new Container({
  width: 300,
  height: 300,
  direction: "freeform",
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#ff9800",
    strokeWidth: 2,
  },
});

simpleSection.addElement(simpleTriangleContainer); // OLD WAY

// Simple triangle
const simpleTriangle = new Triangle({
  type: "equilateral",
  a: 150,
  style: {
    fill: "#4caf50",
    stroke: "#2e7d32",
    strokeWidth: 3,
  },
});

simpleTriangle.position({
  relativeFrom: simpleTriangle.center,
  relativeTo: simpleTriangleContainer.contentBox.center,
  x: 0,
  y: 0,
});

simpleTriangleContainer.addElement(simpleTriangle); // OLD WAY

// DEBUG: Show simple triangle corners
addDebugDots(simpleTriangle, "simpleTriangle");
addDebugDotsForContainer(simpleTriangleContainer, "simpleTriangleContainer");

// Add labels for simple triangle
const simpleLabels = simpleTriangle.createSideLabels(["$x$", "$y$", "$z$"], {
  offset: 25,
  fontSize: 18,
});

console.log("\n📐 Simple triangle absolute vertices:", simpleTriangle.absoluteVertices);
console.log("📝 Simple triangle labels:");
simpleLabels.forEach((label, i) => {
  const pos = label.topLeft;
  console.log(`  Label ${i}: topLeft = (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  artboard.addElement(label); // OLD WAY
  
  // DEBUG: Show label corners
  addDebugDots(label, `simpleLabel[${i}]`);
});

console.log("\n=== Old Way Test Complete ===");
console.log("All elements created using .addElement() only");
console.log("Check if triangle labels and text highlights work correctly");

return artboard.render();

