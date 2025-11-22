/**
 * Example: New Layout System - Positioning
 * 
 * Demonstrates relative positioning in the new layout system.
 * Shows how elements can be positioned relative to the artboard
 * and relative to each other.
 */

import { NewArtboard, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Create a central circle
const center = new NewCircle({
  radius: 50,
  style: { fill: '#34495e', stroke: '#2c3e50', strokeWidth: 2 }
});

center.position({
  relativeFrom: center.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Position circles around the center in a pattern
const topCircle = new NewCircle({
  radius: 30,
  style: { fill: '#e74c3c' }
});

topCircle.position({
  relativeFrom: topCircle.center,
  relativeTo: center.center,
  x: 0,
  y: -100
});

const rightCircle = new NewCircle({
  radius: 30,
  style: { fill: '#3498db' }
});

rightCircle.position({
  relativeFrom: rightCircle.center,
  relativeTo: center.center,
  x: 100,
  y: 0
});

const bottomCircle = new NewCircle({
  radius: 30,
  style: { fill: '#2ecc71' }
});

bottomCircle.position({
  relativeFrom: bottomCircle.center,
  relativeTo: center.center,
  x: 0,
  y: 100
});

const leftCircle = new NewCircle({
  radius: 30,
  style: { fill: '#f39c12' }
});

leftCircle.position({
  relativeFrom: leftCircle.center,
  relativeTo: center.center,
  x: -100,
  y: 0
});

// Add smaller circles positioned relative to the outer circles
const topSmall = new NewCircle({
  radius: 15,
  style: { fill: '#95a5a6' }
});

topSmall.position({
  relativeFrom: topSmall.center,
  relativeTo: topCircle.center,
  x: 0,
  y: -50
});

artboard.addElement(center);
artboard.addElement(topCircle);
artboard.addElement(rightCircle);
artboard.addElement(bottomCircle);
artboard.addElement(leftCircle);
artboard.addElement(topSmall);

return artboard.render();

