/**
 * Comprehensive Layout Example
 * 
 * Demonstrates:
 * - Container-based layout (3 columns)
 * - Auto-sizing containers
 */

import {
  NewArtboard,
  NewContainer,
  NewRect,
  NewText,
  NewLatex,
} from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Create a main horizontal container for the 3 columns
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top",     // Align columns to top (default, shown for clarity)
  horizontalAlignment: "left",  // Align content to left (default, shown for clarity)
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

// Position the main container explicitly (required for auto-sizing)
mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// ========================================
// COLUMN 1
// ========================================

const column1 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "left",  // Align items to left (default)
  verticalAlignment: "top",     // Stack items from top (default)
  boxModel: { padding: 20 },
  style: {
    fill: "#e3f2fd",
    stroke: "#90caf9",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column1);

// Add pure LaTeX directly to column 1
const latex1 = new NewLatex({
  content: "\\cssId{energy}{E} = \\cssId{mass}{m}\\cssId{speed}{c}^2",
  fontSize: 32,
  displayMode: true,
  style: {
    fill: "#1976d2",
  },
});
column1.addElement(latex1);

const latex2 = new NewLatex({
  content: "\\frac{-\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}}{\\cssId{denominator}{2a}}",
  fontSize: 28,
  displayMode: true,
  style: {
    fill: "#1976d2",
  },
});
column1.addElement(latex2);

const latex3 = new NewLatex({
  content: "\\class{euler-const}{e}^{\\class{euler-const}{i\\pi}} + \\class{euler-const}{1} = \\class{euler-const}{0}",
  fontSize: 30,
  displayMode: true,
  style: {
    fill: "#1976d2",
  },
});
column1.addElement(latex3);

// ========================================
// COLUMN 2
// ========================================

const column2 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "left",  // Align items to left (default)
  verticalAlignment: "top",     // Stack items from top (default)
  boxModel: { padding: 20 },
  style: {
    fill: "#f3e5f5",
    stroke: "#ce93d8",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column2);

// Add mixed text with inline LaTeX directly to column 2
const mixedText1 = new NewText({
  content: "Einstein's equation $\\cssId{mass-energy}{E = mc^2}$ is famous.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText1);

const mixedText2 = new NewText({
  content: "The theorem $\\class{pyth-var}{a}^2 + \\class{pyth-var}{b}^2 = \\class{pyth-var}{c}^2$ for right triangles.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText2);

const mixedText3 = new NewText({
  content: "Calculate $\\cssId{derivative}{\\frac{df}{dx}}$ for any function $\\cssId{func}{f(x)}$.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText3);

const mixedText4 = new NewText({
  content: "Complex: $\\class{complex-part}{a} + \\class{complex-part}{b}\\class{complex-part}{i}$ where $i^2 = -1$.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText4);

// ========================================
// COLUMN 3
// ========================================

const column3 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "left",  // Align items to left (default)
  verticalAlignment: "top",     // Stack items from top (default)
  boxModel: { padding: 20 },
  style: {
    fill: "#e8f5e9",
    stroke: "#a5d6a7",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column3);

// Add pure text to column 3 - wrapped in container to test padding
const textContainer3 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 12,
});

const text1 = new NewText({
  content: "Pure text elements are simple and clean.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
textContainer3.addElement(text1);

const text2 = new NewText({
  content: "They support multiple lines and different font sizes.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
textContainer3.addElement(text2);

const text3 = new NewText({
  content: "Containers auto-size to fit their content.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
textContainer3.addElement(text3);

const text4 = new NewText({
  content: "This creates flexible layouts.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
textContainer3.addElement(text4);

const text5 = new NewText({
  content: "Perfect for documents and diagrams!",
  fontSize: 18,
  fontFamily: "Georgia",
  fontWeight: 600,
  style: {
    fill: "#388e3c",
  },
});
textContainer3.addElement(text5);

column3.addElement(textContainer3);

// ========================================
// ADD HIGHLIGHTS FOR ANNOTATED ELEMENTS
// ========================================

// Helper function to add a highlight
function addHighlight(element, color) {
  const highlight = new NewRect({
    width: element.bbox.width,
    height: element.bbox.height,
    style: {
      fill: color,
      opacity: 0.5,
    },
  });
  
  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: { x: element.topLeft.x, y: element.topLeft.y },
    x: 0,
    y: 0,
  });
  
  artboard.addElement(highlight);
}

// Highlights for Column 1 (Pure LaTeX)
const energy = latex1.getElementById("energy");
if (energy) addHighlight(energy, "#f8d7da");

const mass = latex1.getElementById("mass");
if (mass) addHighlight(mass, "#d4edda");

const speed = latex1.getElementById("speed");
if (speed) addHighlight(speed, "#d1ecf1");

const coefB = latex2.getElementById("coef-b");
if (coefB) addHighlight(coefB, "#fff3cd");

const disc = latex2.getElementById("discriminant");
if (disc) addHighlight(disc, "#d4edda");

const denom = latex2.getElementById("denominator");
if (denom) addHighlight(denom, "#d1ecf1");

const eulerConsts = latex3.getElementsByClass("euler-const");
const eulerColors = ["#e7d4f7", "#c3e7ff", "#ffe7c3", "#c3ffd4"];
eulerConsts.forEach((elem, idx) => {
  addHighlight(elem, eulerColors[idx % eulerColors.length]);
});

// Highlights for Column 2 (Mixed Text)
const massEnergy = mixedText1.getElementById("mass-energy");
if (massEnergy) addHighlight(massEnergy, "#fff3cd");

const pythVars = mixedText2.getElementsByClass("pyth-var");
pythVars.forEach((v) => addHighlight(v, "#d4edda"));

const derivative = mixedText3.getElementById("derivative");
if (derivative) addHighlight(derivative, "#d1ecf1");

const func = mixedText3.getElementById("func");
if (func) addHighlight(func, "#f8d7da");

const complexParts = mixedText4.getElementsByClass("complex-part");
const complexColors = ["#e7d4f7", "#ffe7c3", "#c3ffd4"];
complexParts.forEach((part, idx) => {
  addHighlight(part, complexColors[idx % complexColors.length]);
});

// Render the artboard
return artboard.render();
