/**
 * LaTeX vs Text Comparison (New Layout System)
 *
 * Demonstrates:
 * - Pure NewLatex rendering with highlighting
 * - NewText with embedded LaTeX and highlighting
 * - Comparing measurement accuracy between both approaches
 * - Using \cssId and \class for annotations in both components
 * 
 * This version uses ABSOLUTE POSITIONING to rule out any layout/container issues.
 */

import { NewArtboard, NewLatex, NewText, NewRect } from "w2l";

// Create artboard with FIXED SIZE (no auto-sizing, no containers)
const artboard = new NewArtboard({
  width: 900,
  height: 1200,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 0 },
});

// Helper to position elements absolutely
let currentY = 50;

// ============================================================================
// SECTION 1: Pure NewLatex with Highlighting
// ============================================================================

const sectionTitle1 = new NewText({
  content: "1. Pure NewLatex (No text mixing)",
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
const latex1 = new NewLatex({
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
  const highlight1 = new NewRect({
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
const latex2 = new NewLatex({
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
  const highlight = new NewRect({
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
const latex3 = new NewLatex({
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
    const highlight = new NewRect({
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
// SECTION 2: NewText with embedded LaTeX and Highlighting
// ============================================================================

const sectionTitle2 = new NewText({
  content: "2. NewText with embedded LaTeX (Text mixing)",
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
const text1 = new NewText({
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

const elem2 = text1.getElementById("mass-energy-2");
if (elem2) {
  const highlight2 = new NewRect({
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
const text2 = new NewText({
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

const vars3 = text2.getElementsByClass("variable2");

vars3.forEach((v, idx) => {
  const highlight = new NewRect({
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
const text3 = new NewText({
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
    const highlight = new NewRect({
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
artboard.render();

