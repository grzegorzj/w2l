/**
 * Example: Horizontal Stack (NewContainer with direction: 'horizontal')
 * 
 * Demonstrates the new NewContainer with horizontal direction.
 * Shows left alignment (start), center alignment, and right alignment (end).
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1200,
  height: 800,
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

// Top HStack - Top alignment
const topStack = new NewContainer({
  width: 1000,
  height: 150,
  direction: 'horizontal',
  spacing: 15,
  verticalAlignment: 'top',  // Align to top (cross-axis for horizontal stack)
  boxModel: { padding: 20, border: 2 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

topStack.position({
  relativeFrom: topStack.topLeft,
  relativeTo: { x: 100, y: 50 },
  x: 0,
  y: 0
});

// Add rectangles of varying heights
const topHeights = [80, 60, 100, 70, 90];
const topColors = ['#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c'];

topHeights.forEach((height, idx) => {
  const rect = new NewRect({
    width: 120,
    height: height,
    style: {
      fill: topColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  topStack.addElement(rect);
});

// Center HStack - Center alignment (vertical center)
const centerStack = new NewContainer({
  width: 1000,
  height: 150,
  direction: 'horizontal',
  spacing: 15,
  verticalAlignment: 'center',  // Align to vertical center (cross-axis for horizontal stack)
  boxModel: { padding: 20, border: 2 },
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 2
  }
});

centerStack.position({
  relativeFrom: centerStack.topLeft,
  relativeTo: { x: 100, y: 250 },
  x: 0,
  y: 0
});

// Add rectangles of varying heights
const centerHeights = [90, 50, 110, 60, 80];

centerHeights.forEach((height, idx) => {
  const rect = new NewRect({
    width: 120,
    height: height,
    style: {
      fill: topColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  centerStack.addElement(rect);
});

// Bottom HStack - Bottom alignment
const bottomStack = new NewContainer({
  width: 1000,
  height: 150,
  direction: 'horizontal',
  spacing: 15,
  verticalAlignment: 'bottom',  // Align to bottom (cross-axis for horizontal stack)
  boxModel: { padding: 20, border: 2 },
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

bottomStack.position({
  relativeFrom: bottomStack.topLeft,
  relativeTo: { x: 100, y: 450 },
  x: 0,
  y: 0
});

// Add rectangles of varying heights
const bottomHeights = [70, 100, 55, 95, 75];

bottomHeights.forEach((height, idx) => {
  const rect = new NewRect({
    width: 120,
    height: height,
    style: {
      fill: topColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  bottomStack.addElement(rect);
});

artboard.addElement(topStack);
artboard.addElement(centerStack);
artboard.addElement(bottomStack);

// Add debug markers for content boxes
const debugMarkers = [];

// Top stack - show top alignment line
debugMarkers.push(
  createDebugCircle(topStack.contentBox.topLeft, '#3498db', 5),
  createDebugCircle(topStack.contentBox.topRight, '#3498db', 5)
);

// Center stack - show center alignment line
debugMarkers.push(
  createDebugCircle(centerStack.contentBox.centerLeft, '#2ecc71', 5),
  createDebugCircle(centerStack.contentBox.centerRight, '#2ecc71', 5)
);

// Bottom stack - show bottom alignment line
debugMarkers.push(
  createDebugCircle(bottomStack.contentBox.bottomLeft, '#e74c3c', 5),
  createDebugCircle(bottomStack.contentBox.bottomRight, '#e74c3c', 5)
);

debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

