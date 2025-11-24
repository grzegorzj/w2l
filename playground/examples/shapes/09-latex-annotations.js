/**
 * LaTeX Annotation-Based Querying (New Layout System)
 *
 * Demonstrates:
 * - Using \cssId{id}{content} to mark specific parts of formulas
 * - Using \class{classname}{content} to mark multiple similar parts
 * - Querying annotated elements by ID or class
 * - Highlighting annotated elements precisely
 * - Works with NewText (with embedded LaTeX) in the new layout system
 */

import { NewArtboard, NewText, NewRect, NewCircle, NewContainer } from "w2l";

// Add debug CSS to outline annotated elements
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Debug outlines for annotated LaTeX elements */
    #mass-energy,
    .variable,
    .concept,
    #coef-b,
    #discriminant,
    #denominator {
      outline: 2px solid red !important;
      outline-offset: 0px;
    }
    
    /* Show bounding box */
    #mass-energy::before,
    .variable::before,
    .concept::before,
    #coef-b::before,
    #discriminant::before,
    #denominator::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed blue;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
  console.log('[Debug] CSS styling added for annotated elements (red outline)');
}

// Create artboard with auto-sizing
const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Main container for all content (vertical layout)
const mainContainer = new NewContainer({
  width: 600,
  height: "auto",
  direction: "vertical",
  verticalAlignment: "top",
  horizontalAlignment: "left",
  spacing: 40,
  boxModel: { padding: 0 },
  style: {
    fill: "none",
  },
});

artboard.addElement(mainContainer);

// Helper function to create a section with text (with LaTeX) and highlights
function createSection(content, highlights) {
  const text = new NewText({
    content,
    fontSize: 24,
    fontFamily: "Georgia",
    style: {
      fill: "#2c3e50",
    },
  });

  mainContainer.addElement(text);

  // Add highlights
  highlights.forEach(({ id, className, color, stroke }) => {
    let element;
    if (id) {
      element = text.getElementById(id);
    } else if (className) {
      const elements = text.getElementsByClass(className);
      // For class-based, highlight all
      elements.forEach((el, idx) => {
        console.log(`[Example] Creating highlight for class "${className}" [${idx}]`);
        console.log(`  Element bbox: ${el.bbox.width.toFixed(2)} x ${el.bbox.height.toFixed(2)} at (${el.bbox.x.toFixed(2)}, ${el.bbox.y.toFixed(2)})`);
        console.log(`  Highlight size: ${el.bbox.width.toFixed(2)} x ${el.bbox.height.toFixed(2)} (no padding)`);
        console.log(`  Highlight position: (${el.topLeft.x.toFixed(2)}, ${el.topLeft.y.toFixed(2)})`);
        
        const highlight = new NewRect({
          width: el.bbox.width,
          height: el.bbox.height,
          style: {
            fill: color,
            stroke: stroke,
            strokeWidth: 2,
            opacity: 0.5,
          },
        });

        highlight.position({
          relativeFrom: highlight.topLeft,
          relativeTo: { x: el.topLeft.x, y: el.topLeft.y },
          x: 0,
          y: 0,
        });

        artboard.addElement(highlight);
      });
      return; // Skip single element handling
    }

    if (element) {
      console.log(`[Example] Creating highlight for ID "${id}"`);
      console.log(`  Element bbox: ${element.bbox.width.toFixed(2)} x ${element.bbox.height.toFixed(2)} at (${element.bbox.x.toFixed(2)}, ${element.bbox.y.toFixed(2)})`);
      console.log(`  Highlight size: ${element.bbox.width.toFixed(2)} x ${element.bbox.height.toFixed(2)} (no padding)`);
      console.log(`  Highlight position: (${element.topLeft.x.toFixed(2)}, ${element.topLeft.y.toFixed(2)})`);
      
      const highlight = new NewRect({
        width: element.bbox.width,
        height: element.bbox.height,
        style: {
          fill: color,
          stroke: stroke,
          strokeWidth: 2,
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
  });
}

// Example 1: Using \cssId to mark specific parts
createSection(
  "Einstein's equation $E = \\cssId{mass-energy}{mc^2}$ is famous.",
  [
    {
      id: "mass-energy",
      color: "#fff3cd",
      stroke: "#856404",
    },
  ]
);

// Example 2: Using \class to mark multiple similar elements
createSection(
  "Pythagorean theorem: $\\class{variable}{x}^2 + \\class{variable}{y}^2 = \\class{variable}{z}^2$",
  [
    {
      className: "variable",
      color: "#d1ecf1",
      stroke: "#0c5460",
    },
  ]
);

// Example 3: Complex formula with multiple annotations
createSection(
  "Quadratic formula: $x = \\frac{-\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}}{\\cssId{denominator}{2a}}$",
  [
    { id: "coef-b", color: "#fff3cd", stroke: "#856404" },
    { id: "discriminant", color: "#f8d7da", stroke: "#721c24" },
    { id: "denominator", color: "#d4edda", stroke: "#155724" },
  ]
);

// Example 4: Text with annotations and circle markers
const sentence = new NewText({
  content:
    "Key concepts: $\\class{concept}{energy}$, $\\class{concept}{mass}$, and $\\class{concept}{light}$.",
  fontSize: 20,
  fontFamily: "Georgia",
  style: {
    fill: "#2c3e50",
  },
});

mainContainer.addElement(sentence);

// Highlight all concepts with circles above them
const concepts = sentence.getElementsByClass("concept");
console.log(`Found ${concepts.length} concepts:`, concepts);

concepts.forEach((concept, index) => {
  // Add a small circle marker above each concept
  const marker = new NewCircle({
    radius: 5,
    style: {
      fill: "#28a745",
      stroke: "#155724",
      strokeWidth: 2,
    },
  });

  marker.position({
    relativeFrom: marker.center,
    relativeTo: { x: concept.topCenter.x, y: concept.topCenter.y - 15 },
    x: 0,
    y: 0,
  });

  artboard.addElement(marker);
});

// Render the artboard
artboard.render();

