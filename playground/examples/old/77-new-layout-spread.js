/**
 * Example: Container Spread Layout
 * 
 * Demonstrates the spread feature that evenly distributes children
 * across available space (proactive positioning).
 * 
 * Shows:
 * - Vertical spread (left): 5 children evenly distributed by height
 * - Horizontal spread (top-right): 5 children evenly distributed by width
 * - Nested spread (bottom-right): vertical spread containing 2 horizontal spreads
 * 
 * Debug circles verify correct positions after spreading:
 * - First child in each section shows all 4 corners
 * - Other children show 2 corners (relevant to spread direction)
 * - Container content boxes show all 4 corners
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1200,
  height: 900,
  backgroundColor: '#ecf0f1'
});

// Helper to create debug circles
function createDebugCircle(position, color, radius = 4) {
  const circle = new NewCircle({
    radius,
    style: { fill: color, stroke: 'white', strokeWidth: 1 }
  });
  circle.position({
    relativeFrom: circle.center,
    relativeTo: position,
    x: 0,
    y: 0
  });
  return circle;
}

const allDebugMarkers = [];

// ===== VERTICAL SPREAD =====
const verticalSpread = new NewContainer({
  width: 300,
  height: 700,
  direction: 'vertical',
  spread: true,  // Evenly distribute vertically
  horizontalAlignment: 'center',  // Center-align children horizontally
  boxModel: { padding: 20, border: 3 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 3
  }
});

verticalSpread.position({
  relativeFrom: verticalSpread.topLeft,
  relativeTo: { x: 50, y: 100 },
  x: 0,
  y: 0
});

// Add children of varying sizes
const vChildren = [];
[60, 80, 50, 70, 90].forEach((height, idx) => {
  const rect = new NewRect({
    width: 250,
    height: height,
    style: {
      fill: '#ecf0f1',
      stroke: '#bdc3c7',
      strokeWidth: 2
    }
  });
  verticalSpread.addElement(rect);
  vChildren.push(rect);
});

artboard.addElement(verticalSpread);

// Debug: Mark all four corners of first child, two corners for others
vChildren.forEach((child, idx) => {
  if (idx === 0) {
    // First child: all four corners
    allDebugMarkers.push(
      createDebugCircle(child.topLeft, '#e74c3c', 3),
      createDebugCircle(child.topRight, '#e74c3c', 3),
      createDebugCircle(child.bottomLeft, '#c0392b', 3),
      createDebugCircle(child.bottomRight, '#c0392b', 3)
    );
  } else {
    // Other children: just top corners
    allDebugMarkers.push(
      createDebugCircle(child.topLeft, '#e74c3c', 3),
      createDebugCircle(child.topRight, '#e74c3c', 3)
    );
  }
});

// Debug: All four corners of vertical spread content box
allDebugMarkers.push(
  createDebugCircle(verticalSpread.contentBox.topLeft, '#2980b9', 6),
  createDebugCircle(verticalSpread.contentBox.topRight, '#2980b9', 6),
  createDebugCircle(verticalSpread.contentBox.bottomLeft, '#2980b9', 6),
  createDebugCircle(verticalSpread.contentBox.bottomRight, '#2980b9', 6)
);

// ===== HORIZONTAL SPREAD =====
const horizontalSpread = new NewContainer({
  width: 700,
  height: 150,
  direction: 'horizontal',
  spread: true,  // Evenly distribute horizontally
  verticalAlignment: 'center',  // Center-align children vertically
  boxModel: { padding: 20, border: 3 },
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 3
  }
});

horizontalSpread.position({
  relativeFrom: horizontalSpread.topLeft,
  relativeTo: { x: 450, y: 100 },
  x: 0,
  y: 0
});

// Add children of varying widths
const hChildren = [];
[80, 100, 60, 90, 70].forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 100,
    style: {
      fill: '#ecf0f1',
      stroke: '#bdc3c7',
      strokeWidth: 2
    }
  });
  horizontalSpread.addElement(rect);
  hChildren.push(rect);
});

artboard.addElement(horizontalSpread);

// Debug: Mark all four corners of first child, two corners for others
hChildren.forEach((child, idx) => {
  if (idx === 0) {
    // First child: all four corners
    allDebugMarkers.push(
      createDebugCircle(child.topLeft, '#f39c12', 3),
      createDebugCircle(child.topRight, '#e67e22', 3),
      createDebugCircle(child.bottomLeft, '#f39c12', 3),
      createDebugCircle(child.bottomRight, '#e67e22', 3)
    );
  } else {
    // Other children: just left corners
    allDebugMarkers.push(
      createDebugCircle(child.topLeft, '#f39c12', 3),
      createDebugCircle(child.bottomLeft, '#f39c12', 3)
    );
  }
});

// Debug: All four corners of horizontal spread content box
allDebugMarkers.push(
  createDebugCircle(horizontalSpread.contentBox.topLeft, '#27ae60', 6),
  createDebugCircle(horizontalSpread.contentBox.topRight, '#27ae60', 6),
  createDebugCircle(horizontalSpread.contentBox.bottomLeft, '#27ae60', 6),
  createDebugCircle(horizontalSpread.contentBox.bottomRight, '#27ae60', 6)
);

// ===== NESTED SPREAD =====
// Outer: Vertical spread
const outerSpread = new NewContainer({
  width: 700,
  height: 550,
  direction: 'vertical',
  spread: true,
  horizontalAlignment: 'center',  // Center-align children horizontally
  boxModel: { padding: 25, border: 3 },
  style: {
    fill: '#9b59b6',
    stroke: '#8e44ad',
    strokeWidth: 3
  }
});

outerSpread.position({
  relativeFrom: outerSpread.topLeft,
  relativeTo: { x: 450, y: 300 },
  x: 0,
  y: 0
});

// Inner: Horizontal spread containers
const innerSpread1 = new NewContainer({
  width: 600,
  height: 100,
  direction: 'horizontal',
  spread: true,
  verticalAlignment: 'center',  // Center-align children vertically
  boxModel: { padding: 10, border: 2 },
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

const innerSpread2 = new NewContainer({
  width: 600,
  height: 100,
  direction: 'horizontal',
  spread: true,
  verticalAlignment: 'center',  // Center-align children vertically
  boxModel: { padding: 10, border: 2 },
  style: {
    fill: '#e67e22',
    stroke: '#d35400',
    strokeWidth: 2
  }
});

// Add items to inner spreads
[60, 80, 50, 70].forEach((width) => {
  innerSpread1.addElement(new NewRect({
    width,
    height: 70,
    style: { fill: '#ecf0f1', stroke: '#bdc3c7', strokeWidth: 2 }
  }));
  
  innerSpread2.addElement(new NewRect({
    width,
    height: 70,
    style: { fill: '#ecf0f1', stroke: '#bdc3c7', strokeWidth: 2 }
  }));
});

outerSpread.addElement(innerSpread1);
outerSpread.addElement(innerSpread2);

artboard.addElement(outerSpread);

// Debug: Nested spread boxes - all four corners
allDebugMarkers.push(
  // Outer spread content box - all corners
  createDebugCircle(outerSpread.contentBox.topLeft, '#8e44ad', 6),
  createDebugCircle(outerSpread.contentBox.topRight, '#8e44ad', 6),
  createDebugCircle(outerSpread.contentBox.bottomLeft, '#8e44ad', 6),
  createDebugCircle(outerSpread.contentBox.bottomRight, '#8e44ad', 6),
  
  // First inner spread - all four corners
  createDebugCircle(innerSpread1.borderBox.topLeft, '#c0392b', 5),
  createDebugCircle(innerSpread1.borderBox.topRight, '#c0392b', 5),
  createDebugCircle(innerSpread1.borderBox.bottomLeft, '#c0392b', 5),
  createDebugCircle(innerSpread1.borderBox.bottomRight, '#c0392b', 5),
  
  // Second inner spread - just two corners
  createDebugCircle(innerSpread2.borderBox.topLeft, '#d35400', 5),
  createDebugCircle(innerSpread2.borderBox.topRight, '#d35400', 5)
);

// Add all debug markers with high z-index
allDebugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

