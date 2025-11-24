/**
 * Example: New Layout System - Box Model
 * 
 * Demonstrates the box model with margin, border, padding, and content areas.
 * Shows how positioning works with different box references.
 */

import { NewArtboard, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5',
  boxModel: {
    padding: 40
  }
});

// Create a circle at the center
// With box model, positioning uses the content box by default
const centerCircle = new NewCircle({
  radius: 50,
  style: { fill: '#3498db', stroke: '#2c3e50', strokeWidth: 3 }
});

// Position in content area of artboard (respects padding)
centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Create circles at the corners of the content area
const topLeftCircle = new NewCircle({
  radius: 20,
  style: { fill: '#e74c3c' }
});

topLeftCircle.position({
  relativeFrom: topLeftCircle.center,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 0
});

const topRightCircle = new NewCircle({
  radius: 20,
  style: { fill: '#2ecc71' }
});

topRightCircle.position({
  relativeFrom: topRightCircle.center,
  relativeTo: artboard.topRight,
  x: 0,
  y: 0
});

const bottomLeftCircle = new NewCircle({
  radius: 20,
  style: { fill: '#f39c12' }
});

bottomLeftCircle.position({
  relativeFrom: bottomLeftCircle.center,
  relativeTo: artboard.bottomLeft,
  x: 0,
  y: 0
});

const bottomRightCircle = new NewCircle({
  radius: 20,
  style: { fill: '#9b59b6' }
});

bottomRightCircle.position({
  relativeFrom: bottomRightCircle.center,
  relativeTo: artboard.bottomRight,
  x: 0,
  y: 0
});

artboard.addElement(centerCircle);
artboard.addElement(topLeftCircle);
artboard.addElement(topRightCircle);
artboard.addElement(bottomLeftCircle);
artboard.addElement(bottomRightCircle);

return artboard.render();

