/**
 * Example 24: Text Word Measurement
 *
 * Demonstrates the new lazy text measurement features:
 * - Accurate text dimensions from browser measurements
 * - Word-level bounding boxes
 * - Positioning elements relative to individual words
 */

import { Artboard, Text, Circle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#f8f9fa",
});

// Create text with multiple words
const text = new Text({
  content: "Hello World from W2L",
  fontSize: "48px",
  fontFamily: "Arial",
  fontWeight: "bold",
  name: "main-text",
  style: {
    fill: "#2c3e50",
  },
});

// Position text at center of artboard
text.position({
  relativeFrom: text.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "-100px",
});

artboard.addElement(text);

// Get all words
const words = text.getWords();
console.log("Words found:", words);

// Create circles at the center of each word
words.forEach((word, index) => {
  const wordCenter = text.getWordCenter(index);

  if (wordCenter) {
    const circle = new Circle({
      radius: 8,
      name: `circle-${index}`,
      style: {
        fill: "#e74c3c",
        stroke: "#c0392b",
        strokeWidth: "2px",
      },
    });

    circle.position({
      relativeFrom: circle.center,
      relativeTo: wordCenter,
      x: "0px",
      y: "0px",
    });

    artboard.addElement(circle);
  }
});

// Create info text showing dimensions
const infoText = new Text({
  content: `Text dimensions:\nWidth: ${Math.round(text.textWidth)}px\nHeight: ${Math.round(text.textHeight)}px\n\nRed circles mark word centers`,
  fontSize: "16px",
  fontFamily: "monospace",
  name: "info-text",
  style: {
    fill: "#555",
  },
});

infoText.position({
  relativeFrom: infoText.topLeft,
  relativeTo: artboard.topLeft,
  x: "20px",
  y: "20px",
});

artboard.addElement(infoText);

// Create boxes around each word to show their bounding boxes
words.forEach((word, index) => {
  const bbox = text.getWordBoundingBox(index);

  if (bbox) {
    // Create a rectangle to visualize the bounding box
    // We'll do this with an SVG rect manually since we want to show the exact bbox
    console.log(`Word "${word}" bbox:`, bbox);
  }
});

// Display the result
artboard.render();
