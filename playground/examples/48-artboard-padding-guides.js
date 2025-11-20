// Artboard Padding Guides Demonstration
// Shows visual indicators for artboard padding and content areas
import { Artboard, Rectangle, Circle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Enable visual guides
});

// Title explaining what we're seeing
const title = new Text({
  content: "Artboard with Padding Guides",
  fontSize: 24,
  style: { fill: "#212529", fontWeight: "bold" }
});

title.position({
  relativeFrom: title.center,
  relativeTo: artboard.center,
  x: 0,
  y: -200
});

// Bounding box for title
const titleBox = new Rectangle({
  width: title.textWidth,
  height: title.textHeight,
  style: {
    fill: "none",
    stroke: "#ff0000",
    strokeWidth: 1,
    strokeDasharray: "3,3"
  }
});

titleBox.position({
  relativeFrom: titleBox.center,
  relativeTo: title.center,
  x: 0,
  y: 0
});

// Explanation text
const explanation = new Text({
  content: "The red overlay shows the PADDING area.\nThe blue dashed line shows the CONTENT AREA.\nAll elements have dashed borders to show their exact boundaries.",
  fontSize: 14,
  textAlign: "center",
  lineHeight: 1.6,
  style: { fill: "#6c757d" }
});

explanation.position({
  relativeFrom: explanation.center,
  relativeTo: artboard.center,
  x: 0,
  y: -150
});

// Bounding box for explanation
const explanationBox = new Rectangle({
  width: explanation.textWidth,
  height: explanation.textHeight,
  style: {
    fill: "none",
    stroke: "#ff0000",
    strokeWidth: 1,
    strokeDasharray: "3,3"
  }
});

explanationBox.position({
  relativeFrom: explanationBox.center,
  relativeTo: explanation.center,
  x: 0,
  y: 0
});

// Sample content positioned in the content area
const box1 = new Rectangle({
  width: 150,
  height: 100,
  style: {
    fill: "#4CAF50",
    stroke: "#388E3C",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

box1.position({
  relativeFrom: box1.center,
  relativeTo: artboard.center,
  x: -180,
  y: 0
});

const box2 = new Rectangle({
  width: 150,
  height: 100,
  style: {
    fill: "#2196F3",
    stroke: "#1976D2",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

box2.position({
  relativeFrom: box2.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

const box3 = new Rectangle({
  width: 150,
  height: 100,
  style: {
    fill: "#FF9800",
    stroke: "#F57C00",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

box3.position({
  relativeFrom: box3.center,
  relativeTo: artboard.center,
  x: 180,
  y: 0
});

// Circle in the content area
const circle = new Circle({
  radius: 40,
  style: {
    fill: "#E91E63",
    stroke: "#C2185B",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 120
});

// Labels
const label1 = new Text({
  content: "All content is\nautomatically\noffset by padding",
  fontSize: 11,
  textAlign: "center",
  lineHeight: 1.4,
  style: { fill: "#333" }
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: artboard.center,
  x: 0,
  y: 200
});

// Bounding box for label1
const label1Box = new Rectangle({
  width: label1.textWidth,
  height: label1.textHeight,
  style: {
    fill: "none",
    stroke: "#ff0000",
    strokeWidth: 1,
    strokeDasharray: "3,3"
  }
});

label1Box.position({
  relativeFrom: label1Box.center,
  relativeTo: label1.center,
  x: 0,
  y: 0
});

// Note about the padding
const note = new Text({
  content: 'Set showPaddingGuides: true in ArtboardConfig to see this visualization',
  fontSize: 10,
  style: { fill: "#999", fontStyle: "italic" }
});

note.position({
  relativeFrom: note.center,
  relativeTo: artboard.center,
  x: 0,
  y: 250
});

// Bounding box for note
const noteBox = new Rectangle({
  width: note.textWidth,
  height: note.textHeight,
  style: {
    fill: "none",
    stroke: "#ff0000",
    strokeWidth: 1,
    strokeDasharray: "3,3"
  }
});

noteBox.position({
  relativeFrom: noteBox.center,
  relativeTo: note.center,
  x: 0,
  y: 0
});

// Add all elements
artboard.addElement(titleBox);
artboard.addElement(title);
artboard.addElement(explanationBox);
artboard.addElement(explanation);
artboard.addElement(box1);
artboard.addElement(box2);
artboard.addElement(box3);
artboard.addElement(circle);
artboard.addElement(label1Box);
artboard.addElement(label1);
artboard.addElement(noteBox);
artboard.addElement(note);

artboard.render();

