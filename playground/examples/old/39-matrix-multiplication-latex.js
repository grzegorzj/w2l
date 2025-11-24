/**
 * Example 39: Matrix Multiplication with LaTeX
 *
 * Educational example demonstrating matrix multiplication using LaTeX notation.
 * Features a compact, website-like design with monospace fonts and cold colors.
 */

import { Artboard, LatexText, Text, Rectangle, VStack, HStack } from "w2l";

// Create compact artboard with small margins
const artboard = new Artboard({
  size: { width: 900, height: 700 },
  backgroundColor: "#0f1419",
  padding: "15px",
});

// Title with monospace style
const title = new Text({
  content: "Matrix Multiplication",
  fontSize: "20px",
  fontFamily: "monospace",
  fontWeight: "bold",
  style: {
    fill: "#61dafb",
  },
});

title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.topLeft,
  x: "20px",
  y: "20px",
});

artboard.addElement(title);

// Subtitle
const subtitle = new Text({
  content: "A mathematical primer",
  fontSize: "12px",
  fontFamily: "monospace",
  style: {
    fill: "#8b949e",
  },
});

subtitle.position({
  relativeFrom: subtitle.topLeft,
  relativeTo: title.bottomLeft,
  x: "0px",
  y: "5px",
});

artboard.addElement(subtitle);

// Section 1: Definition box
const defBox = new Rectangle({
  width: 860,
  height: 100,
  cornerStyle: "rounded",
  cornerRadius: 4,
  style: {
    fill: "#161b22",
    stroke: "#30363d",
    strokeWidth: "1px",
  },
});

defBox.position({
  relativeFrom: defBox.topLeft,
  relativeTo: artboard.topLeft,
  x: "20px",
  y: "80px",
});

artboard.addElement(defBox);

// Definition label
const defLabel = new Text({
  content: "Definition",
  fontSize: "11px",
  fontFamily: "monospace",
  fontWeight: "bold",
  style: {
    fill: "#58a6ff",
  },
});

defLabel.position({
  relativeFrom: defLabel.topLeft,
  relativeTo: defBox.topLeft,
  x: "15px",
  y: "12px",
});

artboard.addElement(defLabel);

// Matrix multiplication formula
const formula = new LatexText({
  content: "C = AB \\quad \\text{where} \\quad C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}",
  fontSize: "18px",
  displayMode: "inline",
  style: {
    fill: "#c9d1d9",
  },
});

formula.position({
  relativeFrom: formula.topLeft,
  relativeTo: defBox.topLeft,
  x: "15px",
  y: "45px",
});

artboard.addElement(formula);

// Section 2: Example computation
const exampleBox = new Rectangle({
  width: 860,
  height: 220,
  cornerStyle: "rounded",
  cornerRadius: 4,
  style: {
    fill: "#161b22",
    stroke: "#30363d",
    strokeWidth: "1px",
  },
});

exampleBox.position({
  relativeFrom: exampleBox.topLeft,
  relativeTo: defBox.bottomLeft,
  x: "0px",
  y: "20px",
});

artboard.addElement(exampleBox);

// Example label
const exLabel = new Text({
  content: "Example: 2×3 matrix × 3×2 matrix",
  fontSize: "11px",
  fontFamily: "monospace",
  fontWeight: "bold",
  style: {
    fill: "#58a6ff",
  },
});

exLabel.position({
  relativeFrom: exLabel.topLeft,
  relativeTo: exampleBox.topLeft,
  x: "15px",
  y: "12px",
});

artboard.addElement(exLabel);

// Matrix A
const matrixA = new LatexText({
  content: "A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}",
  fontSize: "16px",
  displayMode: "display",
  style: {
    fill: "#c9d1d9",
  },
});

matrixA.position({
  relativeFrom: matrixA.topLeft,
  relativeTo: exampleBox.topLeft,
  x: "15px",
  y: "50px",
});

artboard.addElement(matrixA);

// Matrix B
const matrixB = new LatexText({
  content: "B = \\begin{pmatrix} 7 & 8 \\\\ 9 & 10 \\\\ 11 & 12 \\end{pmatrix}",
  fontSize: "16px",
  displayMode: "display",
  style: {
    fill: "#c9d1d9",
  },
});

matrixB.position({
  relativeFrom: matrixB.topLeft,
  relativeTo: exampleBox.topLeft,
  x: "250px",
  y: "50px",
});

artboard.addElement(matrixB);

// Equals symbol
const equals = new Text({
  content: "=",
  fontSize: "28px",
  fontFamily: "monospace",
  style: {
    fill: "#8b949e",
  },
});

equals.position({
  relativeFrom: equals.center,
  relativeTo: exampleBox.topLeft,
  x: "485px",
  y: "95px",
});

artboard.addElement(equals);

// Result matrix C
const matrixC = new LatexText({
  content: "C = \\begin{pmatrix} 58 & 64 \\\\ 139 & 154 \\end{pmatrix}",
  fontSize: "16px",
  displayMode: "display",
  style: {
    fill: "#7ee787",
  },
});

matrixC.position({
  relativeFrom: matrixC.topLeft,
  relativeTo: exampleBox.topLeft,
  x: "550px",
  y: "50px",
});

artboard.addElement(matrixC);

// Dimensions info
const dimInfo = new Text({
  content: "2×3 · 3×2 → 2×2",
  fontSize: "10px",
  fontFamily: "monospace",
  style: {
    fill: "#58a6ff",
  },
});

dimInfo.position({
  relativeFrom: dimInfo.topLeft,
  relativeTo: exampleBox.topLeft,
  x: "15px",
  y: "195px",
});

artboard.addElement(dimInfo);

// Section 3: Step-by-step calculation
const calcBox = new Rectangle({
  width: 860,
  height: 240,
  cornerStyle: "rounded",
  cornerRadius: 4,
  style: {
    fill: "#161b22",
    stroke: "#30363d",
    strokeWidth: "1px",
  },
});

calcBox.position({
  relativeFrom: calcBox.topLeft,
  relativeTo: exampleBox.bottomLeft,
  x: "0px",
  y: "20px",
});

artboard.addElement(calcBox);

// Calculation label
const calcLabel = new Text({
  content: "Calculating C₁₁ (first element)",
  fontSize: "11px",
  fontFamily: "monospace",
  fontWeight: "bold",
  style: {
    fill: "#58a6ff",
  },
});

calcLabel.position({
  relativeFrom: calcLabel.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "12px",
});

artboard.addElement(calcLabel);

// Step 1
const step1 = new LatexText({
  content: "C_{11} = A_{11}B_{11} + A_{12}B_{21} + A_{13}B_{31}",
  fontSize: "15px",
  displayMode: "inline",
  style: {
    fill: "#c9d1d9",
  },
});

step1.position({
  relativeFrom: step1.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "50px",
});

artboard.addElement(step1);

// Step 2
const step2 = new LatexText({
  content: "C_{11} = (1)(7) + (2)(9) + (3)(11)",
  fontSize: "15px",
  displayMode: "inline",
  style: {
    fill: "#c9d1d9",
  },
});

step2.position({
  relativeFrom: step2.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "90px",
});

artboard.addElement(step2);

// Step 3
const step3 = new LatexText({
  content: "C_{11} = 7 + 18 + 33 = 58",
  fontSize: "15px",
  displayMode: "inline",
  style: {
    fill: "#7ee787",
  },
});

step3.position({
  relativeFrom: step3.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "130px",
});

artboard.addElement(step3);

// General note
const note = new Text({
  content: "→ Repeat for all i,j positions to compute full result matrix",
  fontSize: "10px",
  fontFamily: "monospace",
  style: {
    fill: "#8b949e",
  },
});

note.position({
  relativeFrom: note.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "175px",
});

artboard.addElement(note);

// Key requirement
const requirement = new Text({
  content: "Key: Number of columns in A must equal number of rows in B",
  fontSize: "10px",
  fontFamily: "monospace",
  style: {
    fill: "#f85149",
  },
});

requirement.position({
  relativeFrom: requirement.topLeft,
  relativeTo: calcBox.topLeft,
  x: "15px",
  y: "205px",
});

artboard.addElement(requirement);

// Render the artboard
artboard.render();
