/**
 * Example: New Layout System - Basic
 * 
 * Demonstrates the basic hierarchy of the new layout system:
 * - NewElement (base class with position)
 * - NewRectangle (rectangular properties)
 * - NewArtboard (canvas with styling)
 * - NewCircle (simple shape for positioning)
 */

import { NewArtboard, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5'
});

// Center circle
const centerCircle = new NewCircle({
  radius: 40,
  style: { fill: '#3498db' }
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Left circle
const leftCircle = new NewCircle({
  radius: 30,
  style: { fill: '#e74c3c' }
});

leftCircle.position({
  relativeFrom: leftCircle.center,
  relativeTo: centerCircle.center,
  x: -100,
  y: 0
});

// Right circle
const rightCircle = new NewCircle({
  radius: 30,
  style: { fill: '#2ecc71' }
});

rightCircle.position({
  relativeFrom: rightCircle.center,
  relativeTo: centerCircle.center,
  x: 100,
  y: 0
});

// Top circle
const topCircle = new NewCircle({
  radius: 25,
  style: { fill: '#f39c12' }
});

topCircle.position({
  relativeFrom: topCircle.center,
  relativeTo: centerCircle.center,
  x: 0,
  y: -80
});

artboard.addElement(centerCircle);
artboard.addElement(leftCircle);
artboard.addElement(rightCircle);
artboard.addElement(topCircle);

return artboard.render();

