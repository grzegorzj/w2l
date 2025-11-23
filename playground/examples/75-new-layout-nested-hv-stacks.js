/**
 * Example: Nested Horizontal + Vertical Stacks
 * 
 * Demonstrates nesting of horizontal and vertical stacks.
 * Structure:
 * - Outer VStack (vertical)
 *   - Header rect
 *   - HStack (horizontal) with multiple items
 *   - VStack (vertical) nested
 *   - Footer rect
 */

import { NewArtboard, NewStack, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1000,
  height: 900,
  backgroundColor: '#ecf0f1'
});

// Helper to create debug circles
function createDebugCircle(position, color, radius = 3) {
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

// Outer VStack - Main container
const outerVStack = new NewStack({
  width: 800,
  height: 'auto',  // Auto-height
  direction: 'vertical',
  spacing: 20,
  alignment: 'center',
  boxModel: { padding: 30, border: 3 },
  style: {
    fill: '#34495e',
    stroke: '#2c3e50',
    strokeWidth: 3
  }
});

outerVStack.position({
  relativeFrom: outerVStack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Header rect
const header = new NewRect({
  width: 700,
  height: 80,
  style: {
    fill: '#9b59b6',
    stroke: '#8e44ad',
    strokeWidth: 2
  }
});

// Inner HStack - Horizontal layout
const innerHStack = new NewStack({
  width: 'auto',  // Auto-width
  height: 120,
  direction: 'horizontal',
  spacing: 15,
  alignment: 'center',  // Center vertically
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

// Add items to HStack
const hStackWidths = [100, 120, 90, 110];
const hStackColors = ['#e74c3c', '#f39c12', '#2ecc71', '#1abc9c'];

hStackWidths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 70,
    style: {
      fill: hStackColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  innerHStack.addElement(rect);
});

// Inner VStack - Vertical layout
const innerVStack = new NewStack({
  width: 500,
  height: 'auto',  // Auto-height
  direction: 'vertical',
  spacing: 12,
  alignment: 'start',  // Align left
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 2
  }
});

// Add items to VStack
const vStackWidths = [400, 300, 450, 350];
const vStackColors = ['#e67e22', '#f39c12', '#d35400', '#e74c3c'];

vStackWidths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 50,
    style: {
      fill: vStackColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  innerVStack.addElement(rect);
});

// Footer rect
const footer = new NewRect({
  width: 700,
  height: 60,
  style: {
    fill: '#16a085',
    stroke: '#138d75',
    strokeWidth: 2
  }
});

// Build hierarchy
outerVStack.addElement(header);
outerVStack.addElement(innerHStack);
outerVStack.addElement(innerVStack);
outerVStack.addElement(footer);

artboard.addElement(outerVStack);

// Debug markers
const debugMarkers = [];

// Outer VStack center line (where things align)
debugMarkers.push(
  createDebugCircle(outerVStack.contentBox.centerTop, '#f39c12', 6),
  createDebugCircle(outerVStack.contentBox.centerBottom, '#f39c12', 6)
);

// Inner HStack border box
debugMarkers.push(
  createDebugCircle(innerHStack.borderBox.topLeft, '#3498db', 4),
  createDebugCircle(innerHStack.borderBox.topRight, '#3498db', 4),
  createDebugCircle(innerHStack.borderBox.bottomLeft, '#3498db', 4),
  createDebugCircle(innerHStack.borderBox.bottomRight, '#3498db', 4)
);

// Inner VStack border box
debugMarkers.push(
  createDebugCircle(innerVStack.borderBox.topLeft, '#2ecc71', 4),
  createDebugCircle(innerVStack.borderBox.topRight, '#2ecc71', 4),
  createDebugCircle(innerVStack.borderBox.bottomLeft, '#2ecc71', 4),
  createDebugCircle(innerVStack.borderBox.bottomRight, '#2ecc71', 4)
);

// Header and footer corners
debugMarkers.push(
  createDebugCircle(header.topLeft, '#9b59b6', 3),
  createDebugCircle(header.topRight, '#9b59b6', 3),
  createDebugCircle(footer.bottomLeft, '#16a085', 3),
  createDebugCircle(footer.bottomRight, '#16a085', 3)
);

debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

