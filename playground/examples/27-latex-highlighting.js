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

// Highlight discriminant parts
// Note: The actual part IDs depend on KaTeX's internal structure
// We'll highlight based on measured positions
const parts = quadratic.getAvailableParts();

// Add highlights for various parts (if they exist)
if (parts.length > 0) {
  parts.slice(0, Math.min(3, parts.length)).forEach((partId, index) => {
    const bbox = quadratic.getPartBoundingBox(partId);
    
    if (bbox) {
      const colors = ["#fff3cd", "#d1ecf1", "#f8d7da"];
      const highlight = new Rectangle({
        width: bbox.width + 6,
        height: bbox.height + 4,
        name: `highlight-${index}`,
        style: {
          fill: colors[index % colors.length],
          stroke: "none",
          opacity: 0.6,
        },
      });

      highlight.zIndex = 5;

      highlight.position({
        relativeFrom: highlight.topLeft,
        relativeTo: { x: `${bbox.x - 3}px`, y: `${bbox.y - 2}px` },
        x: "0px",
        y: "0px",
      });

      artboard.addElement(highlight);
    }
  });
}

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
console.log("Pythagorean parts:", pythParts);

pythParts.slice(0, Math.min(5, pythParts.length)).forEach((partId, index) => {
  const center = pythagorean.getPartCenter(partId);
  
  if (center) {
    const circle = new Circle({
      radius: 3,
      name: `marker-${index}`,
      style: {
        fill: "#e74c3c",
        stroke: "none",
      },
    });

    circle.position({
      relativeFrom: circle.center,
      relativeTo: center,
      x: "0px",
      y: "0px",
    });

    artboard.addElement(circle);
  }
});

// Add explanatory text
const explanation = new Text({
  content: "The quadratic formula shows highlighted parts based on KaTeX's internal structure.\nThe Pythagorean theorem shows red dots marking measurable formula components.",
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

