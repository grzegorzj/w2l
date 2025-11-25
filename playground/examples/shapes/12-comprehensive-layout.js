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

// Add pure LaTeX to column 1
const latex1 = new NewLatex({
  content: "E = mc^2",
  fontSize: 32,
  displayMode: true,
  style: {
    fill: "#1976d2",
  },
});
column1.addElement(latex1);

const latex2 = new NewLatex({
  content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  fontSize: 28,
  displayMode: true,
  style: {
    fill: "#1976d2",
  },
});
column1.addElement(latex2);

const latex3 = new NewLatex({
  content: "e^{i\\pi} + 1 = 0",
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

// Add mixed text with inline LaTeX to column 2
const mixedText1 = new NewText({
  content: "Einstein's equation $E = mc^2$ is famous.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText1);

const mixedText2 = new NewText({
  content: "The theorem $a^2 + b^2 = c^2$ for right triangles.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText2);

const mixedText3 = new NewText({
  content: "Calculate $\\frac{df}{dx}$ for any function $f(x)$.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#7b1fa2",
  },
});
column2.addElement(mixedText3);

const mixedText4 = new NewText({
  content: "Complex: $a + bi$ where $i^2 = -1$.",
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

// Add pure text to column 3
const text1 = new NewText({
  content: "Pure text elements are simple and clean.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
column3.addElement(text1);

const text2 = new NewText({
  content: "They support multiple lines and different font sizes.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
column3.addElement(text2);

const text3 = new NewText({
  content: "Containers auto-size to fit their content.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
column3.addElement(text3);

const text4 = new NewText({
  content: "This creates flexible layouts.",
  fontSize: 18,
  fontFamily: "Georgia",
  style: {
    fill: "#388e3c",
  },
});
column3.addElement(text4);

const text5 = new NewText({
  content: "Perfect for documents and diagrams!",
  fontSize: 18,
  fontFamily: "Georgia",
  fontWeight: 600,
  style: {
    fill: "#388e3c",
  },
});
column3.addElement(text5);

// Render the artboard
return artboard.render();
