// Styling demonstration - strokes, opacity, colors
import { Artboard, Circle, Rectangle, Square } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50"
});

// Filled circle
const filled = new Circle({
  radius: 60,
  style: { fill: "#e74c3c", stroke: "none" }
});

filled.position({
  relativeFrom: filled.center,
  relativeTo: artboard.center,
  x: -250,
  y: 0
});

// Stroked circle
const stroked = new Circle({
  radius: 60,
  style: { 
    fill: "none", 
    stroke: "#3498db", 
    strokeWidth: "4" 
  }
});

stroked.position({
  relativeFrom: stroked.center,
  relativeTo: artboard.center,
  x: -80,
  y: 0
});

// Semi-transparent
const transparent = new Square({
  size: 120,
  style: { 
    fill: "#2ecc71", 
    fillOpacity: "0.5" 
  }
});

transparent.position({
  relativeFrom: transparent.center,
  relativeTo: artboard.center,
  x: 80,
  y: 0
});

// Filled with stroke
const both = new Rectangle({
  width: 100,
  height: 120,
  style: { 
    fill: "#f39c12", 
    stroke: "#d68910", 
    strokeWidth: "3" 
  }
});

both.position({
  relativeFrom: both.center,
  relativeTo: artboard.center,
  x: 250,
  y: 0
});

artboard.addElement(filled);
artboard.addElement(stroked);
artboard.addElement(transparent);
artboard.addElement(both);

artboard.render();

