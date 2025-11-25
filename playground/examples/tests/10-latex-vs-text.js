/**
 * LaTeX vs Text Comparison (New Layout System)
 *
 * Demonstrates:
 * - Pure Latex rendering with highlighting
 * - Text with embedded LaTeX and highlighting
 * - Comparing measurement accuracy between both approaches
 * - Using \cssId and \class for annotations in both components
 * 
 * This version uses ABSOLUTE POSITIONING to rule out any layout/container issues.
 */

import { Artboard, Latex, Text, Rect } from "w2l";

// Create artboard with FIXED SIZE (no auto-sizing, no containers)
const artboard = new Artboard({
  width: 900,
  height: 1200,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 0 },
});

// Helper to position elements absolutely
let currentY = 50;

// ============================================================================
// SECTION 1: Pure Latex with Highlighting
// ============================================================================

const sectionTitle1 = new Text({
  content: "1. Pure Latex (No text mixing)",
  fontSize: 20,
  fontFamily: "Arial",
  fontWeight: "bold",
  style: {
    fill: "#2c3e50",
  },
});

sectionTitle1.position({
  relativeFrom: sectionTitle1.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(sectionTitle1);
currentY += 40;

// Example 1a: Simple formula with ID annotation
const latex1 = new Latex({
  content: "E = \\cssId{mass-energy}{mc^2}",
  fontSize: 28,
  style: {
    fill: "#2c3e50",
  },
});

latex1.position({
  relativeFrom: latex1.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(latex1);

const elem1 = latex1.getElementById("mass-energy");
if (elem1) {
  const highlight1 = new Rect({
    width: elem1.bbox.width,
    height: elem1.bbox.height,
    style: {
      fill: "#fff3cd",
      opacity: 0.5,
    },
  });

  highlight1.position({
    relativeFrom: highlight1.topLeft,
    relativeTo: { x: elem1.topLeft.x, y: elem1.topLeft.y },
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight1);
}

currentY += 50;

// Example 1b: Pythagorean theorem with class annotations
const latex2 = new Latex({
  content: "\\class{variable}{x}^2 + \\class{variable}{y}^2 = \\class{variable}{z}^2",
  fontSize: 26,
  style: {
    fill: "#2c3e50",
  },
});

latex2.position({
  relativeFrom: latex2.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(latex2);

const vars2 = latex2.getElementsByClass("variable");

vars2.forEach((v, idx) => {
  const highlight = new Rect({
    width: v.bbox.width,
    height: v.bbox.height,
    style: {
      fill: "#d1ecf1",
      opacity: 0.5,
    },
  });

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: { x: v.topLeft.x, y: v.topLeft.y },
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight);
});

currentY += 50;

// Example 1c: Quadratic formula with multiple ID annotations
const latex3 = new Latex({
  content: "x = \\frac{-\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}}{\\cssId{denominator}{2a}}",
  fontSize: 36,
  displayMode: true, // Display mode for larger, centered formula
  style: {
    fill: "#2c3e50",
  },
});

latex3.position({
  relativeFrom: latex3.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(latex3);

const annotations = [
  { id: "coef-b", color: "#fff3cd", stroke: "#856404" },
  { id: "discriminant", color: "#f8d7da", stroke: "#721c24" },
  { id: "denominator", color: "#d4edda", stroke: "#155724" },
];

annotations.forEach(({ id, color, stroke }) => {
  const elem = latex3.getElementById(id);
  if (elem) {
    const highlight = new Rect({
      width: elem.bbox.width,
      height: elem.bbox.height,
      style: {
        fill: color,
        opacity: 0.5,
      },
    });

    highlight.position({
      relativeFrom: highlight.topLeft,
      relativeTo: { x: elem.topLeft.x, y: elem.topLeft.y },
      x: 0,
      y: 0,
    });

    artboard.addElement(highlight);
  }
});

currentY += 80;

// ============================================================================
// SECTION 2: Text with embedded LaTeX and Highlighting
// ============================================================================

const sectionTitle2 = new Text({
  content: "2. Text with embedded LaTeX (Text mixing)",
  fontSize: 20,
  fontFamily: "Arial",
  fontWeight: "bold",
  style: {
    fill: "#2c3e50",
  },
});

sectionTitle2.position({
  relativeFrom: sectionTitle2.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(sectionTitle2);
currentY += 40;

// Example 2a: Mixed text with ID annotation
const text1 = new Text({
  content: "Einstein's equation $E = \\cssId{mass-energy-2}{mc^2}$ is famous.",
  fontSize: 24,
  fontFamily: "Georgia",
  style: {
    fill: "#2c3e50",
  },
});

text1.position({
  relativeFrom: text1.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(text1);

// Debug: Draw rectangle around entire text element (RED)
const textDebugRect1 = new Rect({
  width: text1.textWidth,
  height: text1.textHeight,
  style: {
    fill: "none",
    stroke: "red",
    strokeWidth: 1,
    opacity: 0.7,
  },
});
textDebugRect1.position({
  relativeFrom: textDebugRect1.topLeft,
  relativeTo: text1.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(textDebugRect1);

// Debug: Draw rectangles around entire LaTeX segments (BLUE dashed)
const latexSegments1 = text1.getLatexSegmentBBoxes();
console.log("\n=== TEXT 1: Einstein's equation ===");
console.log("Text position:", text1.topLeft);
console.log("LaTeX segments:", latexSegments1);

latexSegments1.forEach((segment) => {
  const latexDebugRect = new Rect({
    width: segment.width,
    height: segment.height,
    style: {
      fill: "none",
      stroke: "blue",
      strokeWidth: 1,
      strokeDasharray: "3,3",
      opacity: 0.7,
    },
  });
  latexDebugRect.position({
    relativeFrom: latexDebugRect.topLeft,
    relativeTo: artboard.topLeft,
    x: segment.x,
    y: segment.y,
  });
  artboard.addElement(latexDebugRect);
});

const elem2 = text1.getElementById("mass-energy-2");
if (elem2) {
  console.log("\nAnnotated element 'mass-energy-2':");
  console.log("  bbox:", elem2.bbox);
  console.log("  topLeft:", elem2.topLeft);
  console.log("  Relative to text:", { x: elem2.topLeft.x - text1.topLeft.x, y: elem2.topLeft.y - text1.topLeft.y });
  
  const highlight2 = new Rect({
    width: elem2.bbox.width,
    height: elem2.bbox.height,
    style: {
      fill: "#fff3cd",
      opacity: 0.5,
    },
  });

  highlight2.position({
    relativeFrom: highlight2.topLeft,
    relativeTo: { x: elem2.topLeft.x, y: elem2.topLeft.y },
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight2);
}

currentY += 50;

// Example 2b: Mixed text with class annotations
const text2 = new Text({
  content: "Pythagorean theorem: $\\class{variable2}{x}^2 + \\class{variable2}{y}^2 = \\class{variable2}{z}^2$",
  fontSize: 22,
  fontFamily: "Georgia",
  style: {
    fill: "#2c3e50",
  },
});

text2.position({
  relativeFrom: text2.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(text2);

// Debug: Draw rectangle around entire text element (RED)
const textDebugRect2 = new Rect({
  width: text2.textWidth,
  height: text2.textHeight,
  style: {
    fill: "none",
    stroke: "red",
    strokeWidth: 1,
    opacity: 0.7,
  },
});
textDebugRect2.position({
  relativeFrom: textDebugRect2.topLeft,
  relativeTo: text2.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(textDebugRect2);

// Debug: Draw rectangles around entire LaTeX segments (BLUE dashed)
const latexSegments2 = text2.getLatexSegmentBBoxes();
console.log("\n=== TEXT 2: Pythagorean theorem ===");
console.log("Text position:", text2.topLeft);
console.log("LaTeX segments:", latexSegments2);

latexSegments2.forEach((segment) => {
  const latexDebugRect = new Rect({
    width: segment.width,
    height: segment.height,
    style: {
      fill: "none",
      stroke: "blue",
      strokeWidth: 1,
      strokeDasharray: "3,3",
      opacity: 0.7,
    },
  });
  latexDebugRect.position({
    relativeFrom: latexDebugRect.topLeft,
    relativeTo: artboard.topLeft,
    x: segment.x,
    y: segment.y,
  });
  artboard.addElement(latexDebugRect);
});

const vars3 = text2.getElementsByClass("variable2");

console.log("\nAnnotated elements with class 'variable2':");
vars3.forEach((v, idx) => {
  console.log(`  [${idx}]:`, {
    bbox: v.bbox,
    topLeft: v.topLeft,
    relativeToText: { x: v.topLeft.x - text2.topLeft.x, y: v.topLeft.y - text2.topLeft.y }
  });
  
  const highlight = new Rect({
    width: v.bbox.width,
    height: v.bbox.height,
    style: {
      fill: "#d1ecf1",
      opacity: 0.5,
    },
  });

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: { x: v.topLeft.x, y: v.topLeft.y },
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight);
});

currentY += 50;

// Example 2c: Mixed text with multiple ID annotations (inline LaTeX within text)
const text3 = new Text({
  content: "Quadratic formula: $x = \\frac{-\\cssId{coef-b-2}{b} \\pm \\sqrt{\\cssId{discriminant-2}{b^2-4ac}}}{\\cssId{denominator-2}{2a}}$",
  fontSize: 22,
  fontFamily: "Georgia",
  style: {
    fill: "#2c3e50",
  },
});

text3.position({
  relativeFrom: text3.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(text3);

const annotations2 = [
  { id: "coef-b-2", color: "#fff3cd", stroke: "#856404" },
  { id: "discriminant-2", color: "#f8d7da", stroke: "#721c24" },
  { id: "denominator-2", color: "#d4edda", stroke: "#155724" },
];

annotations2.forEach(({ id, color, stroke }) => {
  const elem = text3.getElementById(id);
  if (elem) {
    const highlight = new Rect({
      width: elem.bbox.width,
      height: elem.bbox.height,
      style: {
        fill: color,
        opacity: 0.5,
      },
    });

    highlight.position({
      relativeFrom: highlight.topLeft,
      relativeTo: { x: elem.topLeft.x, y: elem.topLeft.y },
      x: 0,
      y: 0,
    });

    artboard.addElement(highlight);
  }
});

// Render the artboard
return artboard.render();

