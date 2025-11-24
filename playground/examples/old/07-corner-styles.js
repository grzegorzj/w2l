// Rectangle corner styles: sharp, rounded, squircle
import { Artboard, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1"
});

// Sharp corners
const sharpRect = new Rectangle({
  width: 180,
  height: 180,
  cornerStyle: "sharp",
  style: { 
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: "2"
  }
});

sharpRect.position({
  relativeFrom: sharpRect.center,
  relativeTo: artboard.center,
  x: -250,
  y: 0
});

// Rounded corners
const roundedRect = new Rectangle({
  width: 180,
  height: 180,
  cornerStyle: "rounded",
  cornerRadius: 30,
  style: { 
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "2"
  }
});

roundedRect.position({
  relativeFrom: roundedRect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Squircle corners
const squircleRect = new Rectangle({
  width: 180,
  height: 180,
  cornerStyle: "squircle",
  cornerRadius: 50,
  style: { 
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: "2"
  }
});

squircleRect.position({
  relativeFrom: squircleRect.center,
  relativeTo: artboard.center,
  x: 250,
  y: 0
});

artboard.addElement(sharpRect);
artboard.addElement(roundedRect);
artboard.addElement(squircleRect);

artboard.render();

