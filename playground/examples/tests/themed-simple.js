/**
 * Simple Themed Example
 * 
 * Auto-sizing artboard with a rectangle and text.
 */

import { Artboard, Rect, Text } from "w2l";

// Auto-sizing artboard (will fit the rectangle)
const artboard = new Artboard({
  width: "auto",
  height: "auto",
});

// Simple rectangle - automatically themed!
const box = new Rect({
  width: 200,
  height: 100,
});

// Text - automatically themed!
const label = new Text({
  content: "Themed Box",
});

// Add text to box
box.addElement(label);

// Center text in box
label.position({
  relativeFrom: label.center,
  relativeTo: box.center,
});

// Add box to artboard
artboard.addElement(box);

return artboard.render();

