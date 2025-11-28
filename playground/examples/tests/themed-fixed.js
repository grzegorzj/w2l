/**
 * Fixed Size Themed Example
 * 
 * Fixed-size artboard with a centered rectangle and text inside.
 */

import { Artboard, Rect, Text } from "w2l";

// Fixed-size artboard
const artboard = new Artboard({
  width: 400,
  height: 300,
});

// Simple rectangle - automatically themed with:
// - White fill
// - Subtle border (1px, hsl(0, 0%, 90%))
// - 12px padding
// - 2px border radius
const box = new Rect({
  width: 200,
  height: 100,
});

// Text inside the box - automatically themed!
const label = new Text({
  content: "Hello, Theme!",
});

// Add text to the box
box.addElement(label);

// Center the text inside the box
label.position({
  relativeFrom: label.center,
  relativeTo: box.center,
});

// Add box to artboard
artboard.addElement(box);

// Position box in center of artboard
box.position({
  relativeFrom: box.center,
  relativeTo: artboard.center,
});

return artboard.render();

