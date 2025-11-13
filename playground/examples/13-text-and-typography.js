// Text and typography demonstration
import { Artboard, Text, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 900, height: 800 },
  backgroundColor: "#f8f9fa"
});

// Main Title
const mainTitle = new Text({
  content: "Text & Typography",
  fontSize: 42,
  fontWeight: "bold",
  textAlign: "center",
  style: { 
    fill: "#2c3e50",
    stroke: "#34495e",
    strokeWidth: "0.5px"
  }
});

mainTitle.position({
  relativeFrom: mainTitle.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 30
});

// Basic text with different alignments
const leftText = new Text({
  content: "Left aligned text",
  fontSize: 18,
  textAlign: "left",
  style: { fill: "#3498db" }
});

leftText.position({
  relativeFrom: leftText.topLeft,
  relativeTo: artboard.center,
  x: -300,
  y: -200
});

const centerText = new Text({
  content: "Center aligned text",
  fontSize: 18,
  textAlign: "center",
  style: { fill: "#2ecc71" }
});

centerText.position({
  relativeFrom: centerText.topCenter,
  relativeTo: artboard.center,
  x: 0,
  y: -200
});

const rightText = new Text({
  content: "Right aligned text",
  fontSize: 18,
  textAlign: "right",
  style: { fill: "#e74c3c" }
});

rightText.position({
  relativeFrom: rightText.topRight,
  relativeTo: artboard.center,
  x: 300,
  y: -200
});

// Word wrapped paragraph
const paragraph = new Text({
  content: "This is a longer paragraph that demonstrates word wrapping. The text will automatically wrap when it reaches the maximum width specified in the configuration.",
  maxWidth: 350,
  fontSize: 16,
  lineHeight: 1.6,
  textAlign: "left",
  style: { fill: "#34495e" }
});

// Background for paragraph
const paragraphBg = new Rectangle({
  width: 370,
  height: paragraph.textHeight + 20,
  cornerStyle: "rounded",
  cornerRadius: 8,
  style: {
    fill: "#ecf0f1",
    stroke: "#bdc3c7",
    strokeWidth: 1
  }
});

paragraphBg.position({
  relativeFrom: paragraphBg.topLeft,
  relativeTo: artboard.center,
  x: -185,
  y: -100
});

paragraph.position({
  relativeFrom: paragraph.topLeft,
  relativeTo: paragraphBg.topLeft,
  x: 10,
  y: 10
});

// Multi-line explicit text
const multiLineText = new Text({
  content: "Line 1: First line\nLine 2: Second line\nLine 3: Third line",
  fontSize: 16,
  lineHeight: 1.5,
  textAlign: "center",
  style: { fill: "#9b59b6" }
});

multiLineText.position({
  relativeFrom: multiLineText.topCenter,
  relativeTo: artboard.center,
  x: 0,
  y: 80
});

// Different font styles
const boldText = new Text({
  content: "Bold Text",
  fontSize: 20,
  fontWeight: "bold",
  style: { fill: "#e67e22" }
});

boldText.position({
  relativeFrom: boldText.topLeft,
  relativeTo: artboard.center,
  x: -200,
  y: 200
});

const normalText = new Text({
  content: "Normal Text",
  fontSize: 20,
  fontWeight: "normal",
  style: { fill: "#16a085" }
});

normalText.position({
  relativeFrom: normalText.topLeft,
  relativeTo: artboard.center,
  x: 0,
  y: 200
});

const lightText = new Text({
  content: "Light Text (300)",
  fontSize: 20,
  fontWeight: "300",
  style: { fill: "#95a5a6" }
});

lightText.position({
  relativeFrom: lightText.topLeft,
  relativeTo: artboard.center,
  x: 200,
  y: 200
});

// Large quote with styling
const quote = new Text({
  content: '"Design is not just what it looks like.\nDesign is how it works."',
  fontSize: 24,
  fontWeight: "300",
  textAlign: "center",
  lineHeight: 1.4,
  letterSpacing: 1,
  style: { 
    fill: "#7f8c8d",
    fontStyle: "italic"
  }
});

quote.position({
  relativeFrom: quote.topCenter,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: -100
});

// Add all elements
artboard.addElement(paragraphBg);
artboard.addElement(mainTitle);
artboard.addElement(leftText);
artboard.addElement(centerText);
artboard.addElement(rightText);
artboard.addElement(paragraph);
artboard.addElement(multiLineText);
artboard.addElement(boldText);
artboard.addElement(normalText);
artboard.addElement(lightText);
artboard.addElement(quote);

artboard.render();

