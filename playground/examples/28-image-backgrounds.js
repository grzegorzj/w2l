/**
 * Image Backgrounds Example - MINIMAL DEBUG VERSION
 */

import { Artboard, Text, Image, Rectangle, Circle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  backgroundColor: "#fff",
});

// Simple title
const title = new Text({
  content: "Image Test",
  style: {
    fontSize: "24px",
    fill: "#2c3e50",
  },
});

title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Simple image
const img = new Image({
  src: "https://www.kennethcachia.com/background-check/images/2.jpg",
  width: 150,
  height: 150,
});

img.position({
  relativeFrom: img.topLeft,
  relativeTo: { x: "100px", y: "100px" },
  x: 0,
  y: 0,
});

artboard.addElement(img);

// Rectangle with solid color background
const rect = new Rectangle({
  width: 200,
  height: 150,
  cornerRadius: 10,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});

rect.position({
  relativeFrom: rect.topLeft,
  relativeTo: { x: "300px", y: "100px" },
  x: 0,
  y: 0,
});

artboard.addElement(rect);

// Circles with image backgrounds - showing different sizing options
const circle1 = new Circle({
  radius: 60,
  backgroundImage:
    "https://www.kennethcachia.com/background-check/images/2.jpg",
  backgroundImageSize: "cover", // Default: fills shape, may crop
  style: {
    stroke: "#2c3e50",
    strokeWidth: 3,
  },
});

circle1.position({
  relativeFrom: circle1.center,
  relativeTo: { x: "150px", y: "350px" },
  x: 0,
  y: 0,
});

artboard.addElement(circle1);

const label1 = new Text({
  content: "cover (default)",
  style: {
    fontSize: "12px",
    fill: "#2c3e50",
  },
});

label1.position({
  relativeFrom: label1.topCenter,
  relativeTo: circle1.bottomCenter,
  x: 0,
  y: 10,
});

artboard.addElement(label1);

const circle2 = new Circle({
  radius: 60,
  backgroundImage:
    "https://www.kennethcachia.com/background-check/images/2.jpg",
  backgroundImageSize: "contain", // Shows entire image
  style: {
    stroke: "#2c3e50",
    strokeWidth: 3,
  },
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: { x: "350px", y: "350px" },
  x: 0,
  y: 0,
});

artboard.addElement(circle2);

const label2 = new Text({
  content: "contain",
  style: {
    fontSize: "12px",
    fill: "#2c3e50",
  },
});

label2.position({
  relativeFrom: label2.topCenter,
  relativeTo: circle2.bottomCenter,
  x: 0,
  y: 10,
});

artboard.addElement(label2);

const circle3 = new Circle({
  radius: 60,
  backgroundImage:
    "https://www.kennethcachia.com/background-check/images/2.jpg",
  backgroundImageSize: "fill", // Stretches to fill
  style: {
    stroke: "#2c3e50",
    strokeWidth: 3,
  },
});

circle3.position({
  relativeFrom: circle3.center,
  relativeTo: { x: "550px", y: "350px" },
  x: 0,
  y: 0,
});

artboard.addElement(circle3);

const label3 = new Text({
  content: "fill",
  style: {
    fontSize: "12px",
    fill: "#2c3e50",
  },
});

label3.position({
  relativeFrom: label3.topCenter,
  relativeTo: circle3.bottomCenter,
  x: 0,
  y: 10,
});

artboard.addElement(label3);

// Render
artboard.render();
