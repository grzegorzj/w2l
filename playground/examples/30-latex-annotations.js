/**
 * Example 30: LaTeX Annotation-Based Querying
 *
 * Demonstrates:
 * - Using \cssId{id}{content} to mark specific parts of formulas
 * - Using \class{classname}{content} to mark multiple similar parts
 * - Querying annotated elements by ID or class
 * - Highlighting annotated elements precisely
 * - Works with both LatexText and MixedText
 */

import { Artboard, LatexText, MixedText, Text, Rectangle, Circle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 1000, height: 900 },
  backgroundColor: "#f8f9fa",
});

// Title
const title = new Text({
  content: "LaTeX Annotation-Based Querying",
  fontSize: "32px",
  fontFamily: "Arial",
  fontWeight: "bold",
  name: "title",
  style: {
    fill: "#2c3e50",
  },
});

title.position({
  relativeFrom: title.top,
  relativeTo: artboard.top,
  x: "0px",
  y: "30px",
});

artboard.addElement(title);

// Example 1: Using \cssId to mark specific parts
const equation1 = new LatexText({
  content: "E = \\cssId{mass-energy}{mc^2}",
  fontSize: "36px",
  displayMode: "inline",
  name: "equation1",
});

equation1.position({
  relativeFrom: equation1.topLeft,
  relativeTo: artboard.topLeft,
  x: "100px",
  y: "120px",
});

artboard.addElement(equation1);
equation1.zIndex = 10;

// Query and highlight the annotated part
const massEnergy = equation1.getElementById('mass-energy');
console.log("Found mass-energy element:", massEnergy);

if (massEnergy) {
  const highlight1 = new Rectangle({
    width: massEnergy.bbox.width + 8,
    height: massEnergy.bbox.height + 4,
    name: "highlight1",
    style: {
      fill: "#fff3cd",
      stroke: "#856404",
      strokeWidth: "2px",
      opacity: 0.5,
    },
  });

  highlight1.zIndex = 5;
  highlight1.position({
    relativeFrom: highlight1.topLeft,
    relativeTo: equation1.topLeft,
    x: `${massEnergy.bbox.x - 4}px`,
    y: `${massEnergy.bbox.y - 2}px`,
  });

  artboard.addElement(highlight1);
}

// Add label
const label1 = new Text({
  content: "Using \\cssId{mass-energy}{mc^2} to mark specific parts",
  fontSize: "14px",
  fontFamily: "monospace",
  style: { fill: "#666" },
});

label1.position({
  relativeFrom: label1.topLeft,
  relativeTo: equation1.bottomLeft,
  x: "0px",
  y: "10px",
});

artboard.addElement(label1);

// Example 2: Using \class to mark multiple similar elements
const equation2 = new LatexText({
  content: "\\class{variable}{x}^2 + \\class{variable}{y}^2 = \\class{variable}{r}^2",
  fontSize: "32px",
  displayMode: "inline",
  name: "equation2",
});

equation2.position({
  relativeFrom: equation2.topLeft,
  relativeTo: artboard.topLeft,
  x: "100px",
  y: "250px",
});

artboard.addElement(equation2);
equation2.zIndex = 10;

// Query all variables and highlight them
const variables = equation2.getElementsByClass('variable');
console.log(`Found ${variables.length} variables:`, variables);

variables.forEach((variable, index) => {
  const highlight = new Rectangle({
    width: variable.bbox.width + 8,
    height: variable.bbox.height + 4,
    name: `highlight2-${index}`,
    style: {
      fill: "#d1ecf1",
      stroke: "#0c5460",
      strokeWidth: "2px",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;
  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: equation2.topLeft,
    x: `${variable.bbox.x - 4}px`,
    y: `${variable.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Add label
const label2 = new Text({
  content: "Using \\class{variable}{x} to mark all variables",
  fontSize: "14px",
  fontFamily: "monospace",
  style: { fill: "#666" },
});

label2.position({
  relativeFrom: label2.topLeft,
  relativeTo: equation2.bottomLeft,
  x: "0px",
  y: "10px",
});

artboard.addElement(label2);

// Example 3: Complex formula with multiple annotations
const equation3 = new LatexText({
  content: "\\cssId{result}{x} = \\frac{-\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}}{\\cssId{denominator}{2a}}",
  fontSize: "36px",
  displayMode: "display",
  name: "equation3",
});

equation3.position({
  relativeFrom: equation3.topLeft,
  relativeTo: artboard.topLeft,
  x: "100px",
  y: "380px",
});

artboard.addElement(equation3);
equation3.zIndex = 10;

// Highlight specific parts with different colors
const annotations = [
  { id: 'result', color: '#d4edda', stroke: '#155724', label: 'Result' },
  { id: 'coef-b', color: '#fff3cd', stroke: '#856404', label: 'Coefficient b' },
  { id: 'discriminant', color: '#f8d7da', stroke: '#721c24', label: 'Discriminant' },
  { id: 'denominator', color: '#d1ecf1', stroke: '#0c5460', label: 'Denominator' },
];

annotations.forEach((anno, index) => {
  const element = equation3.getElementById(anno.id);
  console.log(`Annotation ${anno.id}:`, element);
  
  if (element) {
    const highlight = new Rectangle({
      width: element.bbox.width + 8,
      height: element.bbox.height + 4,
      name: `highlight3-${anno.id}`,
      style: {
        fill: anno.color,
        stroke: anno.stroke,
        strokeWidth: "2px",
        opacity: 0.5,
      },
    });

    highlight.zIndex = 5;
    highlight.position({
      relativeFrom: highlight.topLeft,
      relativeTo: equation3.topLeft,
      x: `${element.bbox.x - 4}px`,
      y: `${element.bbox.y - 2}px`,
    });

    artboard.addElement(highlight);
  }
});

// Add label
const label3 = new Text({
  content: "Quadratic formula with multiple \\cssId annotations",
  fontSize: "14px",
  fontFamily: "monospace",
  style: { fill: "#666" },
});

label3.position({
  relativeFrom: label3.topLeft,
  relativeTo: equation3.bottomLeft,
  x: "0px",
  y: "20px",
});

artboard.addElement(label3);

// Example 4: MixedText with annotations
const sentence = new MixedText({
  content: "Einstein's equation $E = \\cssId{power}{mc^2}$ relates $\\class{concept}{energy}$ and $\\class{concept}{mass}$.",
  fontSize: "20px",
  fontFamily: "Georgia",
  name: "sentence",
  style: {
    fill: "#2c3e50",
  },
});

sentence.position({
  relativeFrom: sentence.topLeft,
  relativeTo: artboard.topLeft,
  x: "100px",
  y: "570px",
});

artboard.addElement(sentence);
sentence.zIndex = 10;

// Highlight the power
const power = sentence.getElementById('power');
console.log("Power element:", power);

if (power) {
  const highlight = new Rectangle({
    width: power.bbox.width + 8,
    height: power.bbox.height + 4,
    name: "highlight4-power",
    style: {
      fill: "#ffe4b5",
      stroke: "#ff8c00",
      strokeWidth: "2px",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;
  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence.topLeft,
    x: `${power.bbox.x - 4}px`,
    y: `${power.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
}

// Highlight all concepts
const concepts = sentence.getElementsByClass('concept');
console.log(`Found ${concepts.length} concepts:`, concepts);

concepts.forEach((concept, index) => {
  const circle = new Circle({
    radius: 6,
    name: `concept-marker-${index}`,
    style: {
      fill: "#28a745",
      stroke: "#155724",
      strokeWidth: "2px",
    },
  });

  // Position relative to sentence using concept's reference point, offset above
  circle.position({
    relativeFrom: circle.center,
    relativeTo: sentence.topLeft,
    x: concept.top.x,
    y: `${parseFloat(concept.top.y) - 12}px`,
  });

  artboard.addElement(circle);
});

// Add a marker at the top of the sentence to demonstrate simple positioning
const topMarker = new Circle({
  radius: 8,
  name: "top-marker",
  style: {
    fill: "#dc3545",
    stroke: "#721c24",
    strokeWidth: "2px",
  },
});

// Simple positioning: center of marker to top of sentence with no offset
topMarker.position({
  relativeFrom: topMarker.center,
  relativeTo: sentence.top,
  x: 0,
  y: 0,
});

artboard.addElement(topMarker);

// Add label
const label4 = new Text({
  content: "MixedText with \\cssId and \\class annotations",
  fontSize: "14px",
  fontFamily: "monospace",
  style: { fill: "#666" },
});

label4.position({
  relativeFrom: label4.topLeft,
  relativeTo: sentence.bottomLeft,
  x: "0px",
  y: "20px",
});

artboard.addElement(label4);

// Add legend
const legend = new Text({
  content: "LaTeX Annotation Commands:\n• \\cssId{id}{content} - Assign unique ID to mark specific parts\n• \\class{classname}{content} - Assign class to mark similar parts\n\nQuerying:\n• getElementById('id') - Get element by ID\n• getElementsByClass('classname') - Get all elements with class\n\nBoth return bbox with x, y, width, height for precise highlighting!",
  fontSize: "13px",
  fontFamily: "sans-serif",
  lineHeight: 1.7,
  style: {
    fill: "#666",
  },
});

legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.topLeft,
  x: "100px",
  y: "720px",
});

artboard.addElement(legend);

// Display the result
artboard.render();

