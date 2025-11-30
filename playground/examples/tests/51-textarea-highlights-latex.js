/**
 * TextArea Example: Highlighting and LaTeX Support
 *
 * Demonstrates:
 * - Word/phrase highlighting using {highlight:id}text{/highlight}
 * - Inline LaTeX using $...$
 * - Combining highlights with LaTeX
 * - Using getHighlightedWord() to access word positions
 * - Creating visual highlights with Rect elements
 */

import { Artboard, TextArea, Container, Text, Rect, Circle } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Main container
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 40,
  boxModel: { padding: 20 },
  style: {
    fill: "#f8f9fa",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// Helper function to add highlights
function addHighlight(element, color, opacity = 0.4) {
  if (!element) return;
  

  const highlight = new Rect({
    width: element.bbox.width,
    height: element.bbox.height,
    style: {
      fill: color,
      opacity: opacity,
    },
  });

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: element.topLeft,
    x: 0,
    y: 0,
  });
  
  // No need to add - Rect auto-adds to artboard

  // DEBUG: Add circles at corners to visualize the bbox
  const debugCircles = [
    { pos: element.topLeft, color: "red" },
    { pos: element.topRight, color: "blue" },
    { pos: element.bottomLeft, color: "green" },
    { pos: element.bottomRight, color: "yellow" },
  ];

  debugCircles.forEach(({ pos, color: debugColor }) => {
    const circle = new Circle({
      radius: 3,
      style: {
        fill: debugColor,
        stroke: "black",
        strokeWidth: 1,
      },
    });

    circle.position({
      relativeFrom: circle.center,
      relativeTo: pos,
      x: 0,
      y: 0,
    });
    
    // No need to add - Circle auto-adds to artboard
  });
}

// ========================================
// EXAMPLE 1: Basic Word Highlighting
// ========================================

const example1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label1 = new Text({
  content: "Example 1: Word Highlighting",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea1 = new TextArea({
  content:
    "The {highlight:quick}quick{/highlight} brown fox jumps over the {highlight:lazy}lazy{/highlight} dog. This is a {highlight:classic}classic{/highlight} sentence.",
  width: 400,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#ffffff",
    stroke: "#3498db",
    strokeWidth: 2,
  },
});

example1Container.addElement(label1);
example1Container.addElement(textArea1);
mainContainer.addElement(example1Container);

// Add highlights
addHighlight(textArea1.getHighlightedWord("quick"), "#fff3cd", 0.6);
addHighlight(textArea1.getHighlightedWord("lazy"), "#d1ecf1", 0.6);
addHighlight(textArea1.getHighlightedWord("classic"), "#f8d7da", 0.6);

// ========================================
// EXAMPLE 2: LaTeX in TextArea
// ========================================

const example2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label2 = new Text({
  content: "Example 2: LaTeX Highlighting Test",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea2 = new TextArea({
  content:
    "Einstein's equation {highlight:emc}$E = mc^2${/highlight} relates energy and mass. The theorem {highlight:pythag}$a^2 + b^2 = c^2${/highlight} is fundamental.",
  width: 400,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

example2Container.addElement(label2);
example2Container.addElement(textArea2);
mainContainer.addElement(example2Container);

// Highlight the entire LaTeX expressions
addHighlight(textArea2.getHighlightedWord("emc"), "#fff3cd", 0.6);
addHighlight(textArea2.getHighlightedWord("pythag"), "#d1ecf1", 0.6);

// ========================================
// EXAMPLE 3: Combined LaTeX and Highlights
// ========================================

const example3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label3 = new Text({
  content: "Example 3: LaTeX + Highlighting",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea3 = new TextArea({
  content:
    "The {highlight:quadratic}quadratic formula{/highlight} is given by $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$. It's a {highlight:powerful}powerful{/highlight} tool for solving equations.",
  width: 450,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#fff3cd",
    stroke: "#ffc107",
    strokeWidth: 2,
  },
});

example3Container.addElement(label3);
example3Container.addElement(textArea3);
mainContainer.addElement(example3Container);

// Add highlights
addHighlight(textArea3.getHighlightedWord("quadratic"), "#d1ecf1", 0.6);
addHighlight(textArea3.getHighlightedWord("powerful"), "#f8d7da", 0.6);

// ========================================
// EXAMPLE 4: Long Text with Multiple Highlights
// ========================================

const example4Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label4 = new Text({
  content: "Example 4: Complex Content",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea4 = new TextArea({
  content:
    "In mathematics, {highlight:calculus}calculus{/highlight} is the study of continuous change. The derivative $\\frac{dy}{dx}$ represents the rate of change, while the integral $\\int f(x) dx$ represents accumulation. These {highlight:concepts}concepts{/highlight} are {highlight:fundamental}fundamental{/highlight} to modern science and engineering.",
  width: 500,
  fontSize: 15,
  lineHeight: 1.5,
  textColor: "#1a1a1a",
  boxModel: { padding: 18 },
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

example4Container.addElement(label4);
example4Container.addElement(textArea4);
mainContainer.addElement(example4Container);

// Add highlights with different colors
addHighlight(textArea4.getHighlightedWord("calculus"), "#ffcdd2", 0.6);
addHighlight(textArea4.getHighlightedWord("concepts"), "#c5e1a5", 0.6);
addHighlight(textArea4.getHighlightedWord("fundamental"), "#b3e5fc", 0.6);

// ========================================
// EXAMPLE 5: Narrow Width with Wrapping
// ========================================

const row5 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top",
});

const example5Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label5 = new Text({
  content: "Example 5: Narrow (wraps more)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea5 = new TextArea({
  content:
    "The {highlight:area}area{/highlight} of a circle is $A = \\pi r^2$ where $r$ is the {highlight:radius}radius{/highlight}. This simple formula has many applications.",
  width: 220,
  fontSize: 14,
  lineHeight: 1.4,
  textColor: "#0d47a1",
  boxModel: { padding: 12 },
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 2,
  },
});

example5Container.addElement(label5);
example5Container.addElement(textArea5);
row5.addElement(example5Container);

// ========================================
// EXAMPLE 6: No Background
// ========================================

const example6Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label6 = new Text({
  content: "Example 6: No Background",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea6 = new TextArea({
  content:
    "The {highlight:limit}limit{/highlight} of $f(x)$ as $x$ approaches infinity is an {highlight:important}important{/highlight} concept.",
  width: 300,
  fontSize: 14,
  textColor: "#2c3e50",
});

example6Container.addElement(label6);
example6Container.addElement(textArea6);
row5.addElement(example6Container);

// Add row5 to mainContainer FIRST, so it gets positioned
mainContainer.addElement(row5);

// NOW add highlights (after row5 is positioned in the hierarchy)
addHighlight(textArea5.getHighlightedWord("area"), "#ffe082", 0.6);
addHighlight(textArea5.getHighlightedWord("radius"), "#ce93d8", 0.6);
addHighlight(textArea6.getHighlightedWord("limit"), "#ffecb3", 0.7);
addHighlight(textArea6.getHighlightedWord("important"), "#f8bbd0", 0.7);

// ========================================
// EXAMPLE 7: Debug Mode
// ========================================

const example7Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label7 = new Text({
  content: "Example 7: Debug Mode (shows boxes)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea7 = new TextArea({
  content:
    "Debug mode shows the {highlight:border}border box{/highlight} and {highlight:content}content box{/highlight} with $x = 5$.",
  width: 350,
  fontSize: 15,
  textColor: "#c62828",
  boxModel: { padding: 15 },
  style: {
    fill: "#ffebee",
    stroke: "#f44336",
    strokeWidth: 2,
  },
  debug: true,
});

example7Container.addElement(label7);
example7Container.addElement(textArea7);
mainContainer.addElement(example7Container);

// Add highlights
addHighlight(textArea7.getHighlightedWord("border"), "#c5cae9", 0.5);
addHighlight(textArea7.getHighlightedWord("content"), "#fff9c4", 0.5);

// Log debug info
console.log("=== TextArea Highlighting Debug Info ===");
console.log("Example 1 highlighted words:", textArea1.getHighlightedWordIds());
console.log(
  "Example 3 'quadratic' position:",
  textArea3.getHighlightedWord("quadratic")
);
console.log("Example 4 highlighted words:", textArea4.getHighlightedWordIds());

return artboard.render();
