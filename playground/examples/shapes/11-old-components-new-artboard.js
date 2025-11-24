/**
 * Old Components with New Artboard (Debugging Test)
 *
 * Tests whether the old API components (LatexText, MixedText) work correctly
 * when used with the new artboard system. This helps isolate whether rendering
 * issues are in the components themselves or the artboard/coordinate system.
 */

import { NewArtboard, LatexText, MixedText, NewRect } from "w2l";

// Create new artboard
const artboard = new NewArtboard({
  width: 900,
  height: 1200,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 0 },
});

let currentY = 50;

// ============================================================================
// SECTION 1: Pure LatexText (Old API) with New Artboard
// ============================================================================

const sectionTitle1 = new MixedText({
  content: "1. Old LatexText with New Artboard",
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
const latex1 = new LatexText({
  content: "E = \\cssId{mass-energy}{mc^2}",
  fontSize: "28px",
  displayMode: "inline",
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
    relativeTo: latex1.topLeft,
    x: `${elem1.bbox.x}px`,
    y: `${elem1.bbox.y}px`,
  });

  artboard.addElement(highlight1);
}

currentY += 50;

// Example 1b: Pythagorean theorem with class annotations
const latex2 = new LatexText({
  content: "\\class{variable}{x}^2 + \\class{variable}{y}^2 = \\class{variable}{z}^2",
  fontSize: "26px",
  displayMode: "inline",
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
    relativeTo: latex2.topLeft,
    x: `${v.bbox.x}px`,
    y: `${v.bbox.y}px`,
  });

  artboard.addElement(highlight);
});

currentY += 50;

// Example 1c: Quadratic formula with multiple ID annotations
const latex3 = new LatexText({
  content: "x = \\frac{-\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}}{\\cssId{denominator}{2a}}",
  fontSize: "36px",
  displayMode: "display",
});

latex3.position({
  relativeFrom: latex3.topLeft,
  relativeTo: artboard.topLeft,
  x: 50,
  y: currentY,
});

artboard.addElement(latex3);

const annotations = [
  { id: "coef-b", color: "#fff3cd" },
  { id: "discriminant", color: "#f8d7da" },
  { id: "denominator", color: "#d4edda" },
];

annotations.forEach(({ id, color }) => {
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
      relativeTo: latex3.topLeft,
      x: `${elem.bbox.x}px`,
      y: `${elem.bbox.y}px`,
    });

    artboard.addElement(highlight);
  }
});

currentY += 80;

// ============================================================================
// SECTION 2: MixedText (Old API) with New Artboard
// ============================================================================

const sectionTitle2 = new MixedText({
  content: "2. Old MixedText with New Artboard",
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
const text1 = new MixedText({
  content: "Einstein's equation $E = \\cssId{mass-energy-2}{mc^2}$ is famous.",
  fontSize: "24px",
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
    relativeTo: text1.topLeft,
    x: `${elem2.bbox.x}px`,
    y: `${elem2.bbox.y}px`,
  });

  artboard.addElement(highlight2);
}

currentY += 50;

// Example 2b: Mixed text with class annotations
const text2 = new MixedText({
  content: "Pythagorean theorem: $\\class{variable2}{x}^2 + \\class{variable2}{y}^2 = \\class{variable2}{z}^2$",
  fontSize: "22px",
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
    relativeTo: text2.topLeft,
    x: `${v.bbox.x}px`,
    y: `${v.bbox.y}px`,
  });

  artboard.addElement(highlight);
});

currentY += 50;

// Example 2c: Mixed text with multiple ID annotations
const text3 = new MixedText({
  content: "Quadratic formula: $x = \\frac{-\\cssId{coef-b-2}{b} \\pm \\sqrt{\\cssId{discriminant-2}{b^2-4ac}}}{\\cssId{denominator-2}{2a}}$",
  fontSize: "22px",
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
  { id: "coef-b-2", color: "#fff3cd" },
  { id: "discriminant-2", color: "#f8d7da" },
  { id: "denominator-2", color: "#d4edda" },
];

annotations2.forEach(({ id, color }) => {
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
      relativeTo: text3.topLeft,
      x: `${elem.bbox.x}px`,
      y: `${elem.bbox.y}px`,
    });

    artboard.addElement(highlight);
  }
});

// Render the artboard
artboard.render();

