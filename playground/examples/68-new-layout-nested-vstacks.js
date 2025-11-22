/**
 * Example: New Layout System - Nested VStacks
 * 
 * Simple demonstration of one VStack containing another VStack.
 * Shows relative positioning through one level of nesting.
 */

import { NewArtboard, NewVStack, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Outer VStack
const outerVStack = new NewVStack({
  width: 600,
  height: 500,
  spacing: 20,
  boxModel: { padding: 30 },
  style: {
    fill: '#bdc3c7',
    stroke: '#95a5a6',
    strokeWidth: 3
  }
});

outerVStack.position({
  relativeFrom: outerVStack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Top rectangle in outer VStack
const topRect = new NewRect({
  width: 540,  // Fits in outer content (600 - 30*2)
  height: 80,
  style: {
    fill: '#34495e',
    stroke: '#2c3e50',
    strokeWidth: 2
  }
});

// Inner VStack (nested)
const innerVStack = new NewVStack({
  width: 540,
  height: 200,
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

// Items inside the inner VStack
const item1 = new NewRect({
  width: 500,  // Fits in inner content (540 - 20*2)
  height: 50,
  style: {
    fill: '#5dade2',
    stroke: '#3498db',
    strokeWidth: 2
  }
});

const item2 = new NewRect({
  width: 500,
  height: 50,
  style: {
    fill: '#5dade2',
    stroke: '#3498db',
    strokeWidth: 2
  }
});

// Build hierarchy
innerVStack.addElement(item1);
innerVStack.addElement(item2);

outerVStack.addElement(topRect);
outerVStack.addElement(innerVStack);

artboard.addElement(outerVStack);

return artboard.render();

