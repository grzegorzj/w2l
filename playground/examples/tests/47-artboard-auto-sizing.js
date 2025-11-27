import {
  Artboard,
  Circle,
  Rect,
  Text,
  Triangle,
} from "w2l";

/**
 * Demonstrates Artboard's new default auto-sizing behavior.
 * 
 * The Artboard now defaults to 'auto' width and height,
 * automatically sizing to fit its children.
 * 
 * In the playground, artboards display with a white background.
 */

// Create an artboard without specifying width/height - it will auto-size
const artboard = new Artboard();

// Add some elements
const title = new Text({
  content: "Auto-Sized Artboard",
  fontSize: 24,
  style: { fontWeight: "bold" },
});
title.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title.topLeft,
  x: 50,
  y: 50,
});

const subtitle = new Text({
  content: "Width and height automatically fit the content",
  fontSize: 14,
});
subtitle.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: subtitle.topLeft,
  x: 50,
  y: 85,
});

// Add some shapes
const circle = new Circle({
  center: { x: 150, y: 180 },
  radius: 40,
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: "2" },
});

const rect = new Rect({
  width: 80,
  height: 80,
  style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: "2" },
});
rect.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: rect.topLeft,
  x: 250,
  y: 140,
});

const triangle = new Triangle({
  type: "equilateral",
  a: 80,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: "2" },
});
triangle.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: triangle.boundingBoxTopLeft,
  x: 400,
  y: 140,
});

// Add a note at the bottom
const note = new Text({
  content: "The artboard automatically calculates its size based on all child elements.",
  fontSize: 12,
  style: { fill: "#666" },
});
note.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: note.topLeft,
  x: 50,
  y: 260,
});

artboard.addElement(title);
artboard.addElement(subtitle);
artboard.addElement(circle);
artboard.addElement(rect);
artboard.addElement(triangle);
artboard.addElement(note);

return artboard.render();

