/**
 * Example 27: LaTeX with Part Highlighting
 *
 * Demonstrates how to:
 * - Query bounding boxes of LaTeX formula parts
 * - Highlight specific parts of formulas
 * - Position elements relative to formula components
 */

import { Artboard, LatexText, Text, Rectangle, Circle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 900, height: 700 },
  backgroundColor: "#ffffff",
});

// Title
const title = new Text({
  content: "LaTeX Formula Part Highlighting",
  fontSize: "28px",
  fontFamily: "Arial",
  fontWeight: "bold",
  name: "title",
  style: {
    fill: "#2c3e50",
  },
});

title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: "0px",
  y: "30px",
});

artboard.addElement(title);

// Example 1: Quadratic formula with highlighting
const quadratic = new LatexText({
  content: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  fontSize: "48px",
  displayMode: "display",
  name: "quadratic-formula",
});

quadratic.position({
  relativeFrom: quadratic.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "-150px",
});

artboard.addElement(quadratic);

// Set z-index so formula appears on top of highlights
quadratic.zIndex = 10;

// Get available parts for highlighting
console.log("Available formula parts:", quadratic.getAvailableParts());

// Highlight formula parts
// Note: The actual part IDs depend on MathJax's internal structure
// We'll highlight based on measured positions
const parts = quadratic.getAvailableParts();

console.log(`Found ${parts.length} parts to highlight`);

// Add highlights for various parts (if they exist)
// MathJax typically generates many small parts, so we'll be selective
const partsToHighlight = parts.filter((partId, index) => {
  // Only highlight every 5th part to avoid clutter
  return index % 5 === 0;
}).slice(0, 5);

partsToHighlight.forEach((partId, index) => {
  const bbox = quadratic.getPartBoundingBox(partId);
  
  console.log(`Part ${partId}:`, bbox);
  
  if (bbox && bbox.width > 5 && bbox.height > 5) {
    // Only highlight parts that are big enough to see
    const colors = ["#fff3cd", "#d1ecf1", "#f8d7da", "#d4edda", "#cce5ff"];
    const highlight = new Rectangle({
      width: bbox.width + 6,
      height: bbox.height + 4,
      name: `highlight-${index}`,
      style: {
        fill: colors[index % colors.length],
        stroke: "none",
        opacity: 0.5,
      },
    });

    highlight.zIndex = 5;

    // Position relative to the formula element
    const quadPos = quadratic.topLeft;
    console.log(`Quadratic topLeft:`, quadPos);
    console.log(`Highlight positioning: x=${bbox.x - 3}px, y=${bbox.y - 2}px`);
    
    highlight.position({
      relativeFrom: highlight.topLeft,
      relativeTo: quadratic.topLeft,
      x: `${bbox.x - 3}px`,
      y: `${bbox.y - 2}px`,
    });

    console.log(`Added highlight ${index} for part ${partId}`);
    artboard.addElement(highlight);
  } else {
    console.log(`Skipped part ${partId} - too small or null`);
  }
});

// Example 2: Smaller formula with annotations
const pythagorean = new LatexText({
  content: "a^2 + b^2 = c^2",
  fontSize: "36px",
  displayMode: "inline",
  name: "pythagorean",
});

pythagorean.position({
  relativeFrom: pythagorean.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "100px",
});

artboard.addElement(pythagorean);
pythagorean.zIndex = 10;

// Get parts and add circles to mark them
const pythParts = pythagorean.getAvailableParts();
console.log(`Pythagorean has ${pythParts.length} parts`);

// Filter for bigger parts and add circles
const biggerParts = pythParts.filter((partId, index) => {
  const bbox = pythagorean.getPartBoundingBox(partId);
  return bbox && bbox.width > 8 && bbox.height > 8;
}).slice(0, 8);

console.log(`Marking ${biggerParts.length} visible parts`);

biggerParts.forEach((partId, index) => {
  const bbox = pythagorean.getPartBoundingBox(partId);
  
  console.log(`Pythagorean part ${partId}:`, { bbox });
  
  if (bbox) {
    const circle = new Circle({
      radius: 4,
      name: `marker-${index}`,
      style: {
        fill: "#e74c3c",
        stroke: "#c0392b",
        strokeWidth: "1px",
      },
    });

    // Calculate center from bbox (same as highlights - relative to formula)
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    
    console.log(`Circle center: x=${centerX}px, y=${centerY}px`);

    circle.position({
      relativeFrom: circle.center,
      relativeTo: pythagorean.topLeft,  // Position relative to formula
      x: `${centerX}px`,
      y: `${centerY}px`,
    });

    console.log(`Added circle ${index} for part ${partId}`);
    artboard.addElement(circle);
  } else {
    console.log(`No bbox found for part ${partId}`);
  }
});

// Add explanatory text
const explanation = new Text({
  content: "The quadratic formula shows colored highlights on selected formula parts.\nThe Pythagorean theorem shows red dots marking measurable formula components.\n(MathJax generates many small parts, so we filter for visibility)",
  fontSize: "14px",
  fontFamily: "sans-serif",
  lineHeight: 1.6,
  style: {
    fill: "#666",
  },
});

explanation.position({
  relativeFrom: explanation.topCenter,
  relativeTo: artboard.bottomCenter,
  x: "0px",
  y: "-80px",
});

artboard.addElement(explanation);

// Info box
const infoText = new Text({
  content: "Formula parts are automatically detected and can be queried for positioning.",
  fontSize: "12px",
  fontFamily: "monospace",
  style: {
    fill: "#555",
  },
});

infoText.position({
  relativeFrom: infoText.topLeft,
  relativeTo: artboard.topLeft,
  x: "20px",
  y: "620px",
});

artboard.addElement(infoText);

// Display the result
artboard.render();

