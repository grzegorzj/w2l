/**
 * Example: New Layout System - Children
 * 
 * Demonstrates how elements can contain children.
 * Children are positioned relative to their parent by default.
 */

import { NewArtboard, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Parent circle at center
const parentCircle = new NewCircle({
  radius: 80,
  style: { fill: '#34495e', stroke: '#2c3e50', strokeWidth: 2 }
});

parentCircle.position({
  relativeFrom: parentCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add child circles to the parent
// These will be positioned relative to parent by default
const child1 = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c' }
});

// Position relative to parent center
child1.position({
  relativeFrom: child1.center,
  relativeTo: parentCircle.center,
  x: -50,
  y: 0
});

const child2 = new NewCircle({
  radius: 15,
  style: { fill: '#3498db' }
});

child2.position({
  relativeFrom: child2.center,
  relativeTo: parentCircle.center,
  x: 50,
  y: 0
});

const child3 = new NewCircle({
  radius: 15,
  style: { fill: '#2ecc71' }
});

child3.position({
  relativeFrom: child3.center,
  relativeTo: parentCircle.center,
  x: 0,
  y: -50
});

// Add children to parent
parentCircle.addElement(child1);
parentCircle.addElement(child2);
parentCircle.addElement(child3);

// Add parent to artboard
artboard.addElement(parentCircle);

return artboard.render();

