/**
 * Example: New Layout System - Z-Index
 * 
 * Demonstrates z-index control for layering elements.
 * Higher z-index values render on top.
 */

import { NewArtboard, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5'
});

// Create overlapping rectangles
const rect1 = new NewRect({
  width: 200,
  height: 150,
  style: { fill: '#e74c3c', stroke: '#c0392b', strokeWidth: 3 }
});
rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: artboard.center,
  x: -100,
  y: -75
});
rect1.zIndex = 1;  // Bottom layer

const rect2 = new NewRect({
  width: 200,
  height: 150,
  style: { fill: '#3498db', stroke: '#2980b9', strokeWidth: 3 }
});
rect2.position({
  relativeFrom: rect2.topLeft,
  relativeTo: artboard.center,
  x: -50,
  y: -25
});
rect2.zIndex = 2;  // Middle layer

const rect3 = new NewRect({
  width: 200,
  height: 150,
  style: { fill: '#2ecc71', stroke: '#27ae60', strokeWidth: 3 }
});
rect3.position({
  relativeFrom: rect3.topLeft,
  relativeTo: artboard.center,
  x: 0,
  y: 25
});
rect3.zIndex = 3;  // Top layer

// Circle with high z-index - always on top
const topCircle = new NewCircle({
  radius: 40,
  style: { fill: '#f39c12', stroke: '#d68910', strokeWidth: 3 }
});
topCircle.position({
  relativeFrom: topCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});
topCircle.zIndex = 100;  // Highest - renders on top of everything

// Add elements in random order - z-index controls rendering
artboard.addElement(rect2);
artboard.addElement(topCircle);
artboard.addElement(rect1);
artboard.addElement(rect3);

return artboard.render();

