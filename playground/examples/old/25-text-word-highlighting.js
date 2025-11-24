/**
 * Example 25: Text Word Highlighting
 *
 * Demonstrates highlighting specific words by drawing rectangles behind them
 * using accurate bounding box measurements.
 */

import { Artboard, Text, Rectangle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ffffff",
});

// Create text
const text = new Text({
  content: "The quick brown fox jumps over the lazy dog",
  fontSize: "36px",
  fontFamily: "Georgia",
  name: "sentence",
  style: {
    fill: "#2c3e50",
  },
});

// Set z-index so text appears on top of highlights
text.zIndex = 10;

text.position({
  relativeFrom: text.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px",
});

artboard.addElement(text);

// Define which words to highlight (by index)
const wordsToHighlight = [
  { index: 2, color: "#fff3cd", label: "brown" }, // "brown"
  { index: 3, color: "#d1ecf1", label: "fox" }, // "fox"
  { index: 7, color: "#f8d7da", label: "lazy" }, // "lazy"
];

// Add highlight rectangles behind the words
wordsToHighlight.forEach(({ index, color, label }) => {
  const bbox = text.getWordBoundingBox(index);

  if (bbox) {
    const highlight = new Rectangle({
      width: bbox.width + 8, // Add padding
      height: bbox.height + 4,
      name: `highlight-${label}`,
      style: {
        fill: color,
        stroke: "none",
        opacity: 0.7,
      },
    });

    // Set z-index lower than text so highlight renders behind
    highlight.zIndex = 5;

    // Position the highlight rectangle at the word's position
    highlight.position({
      relativeFrom: highlight.topLeft,
      relativeTo: { x: `${bbox.x - 4}px`, y: `${bbox.y - 2}px` },
      x: "0px",
      y: "0px",
    });

    artboard.addElement(highlight);
  }
});

// Create legend
const legendText = new Text({
  content: "Highlighted words:\n• brown (yellow)\n• fox (blue)\n• lazy (red)",
  fontSize: "14px",
  fontFamily: "sans-serif",
  name: "legend",
  style: {
    fill: "#666",
  },
});

legendText.position({
  relativeFrom: legendText.topLeft,
  relativeTo: artboard.bottomLeft,
  x: "20px",
  y: "-100px",
});

artboard.addElement(legendText);

// Display the result
artboard.render();
