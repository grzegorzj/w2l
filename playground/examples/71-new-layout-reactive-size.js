/**
 * Example: VStack with Reactive Sizing + Debug
 * 
 * Demonstrates auto-sizing (reactive dimensions) in VStack.
 * - Left: Fixed width and height
 * - Center: Auto height (grows to fit children)
 * - Right: Auto width and height (grows to fit children in both dimensions)
 * 
 * Debug circles show border box corners of each rectangle.
 */

import { NewArtboard, NewVStack, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1200,
  height: 700,
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

// Track all rectangles for debug markers
const allRects = [];

// Fixed size VStack
const fixedStack = new NewVStack({
  width: 300,
  height: 400,
  spacing: 10,
  alignment: 'center',
  boxModel: { padding: 15 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 3
  }
});

fixedStack.position({
  relativeFrom: fixedStack.topLeft,
  relativeTo: { x: 50, y: 50 },
  x: 0,
  y: 0
});

// Add some items
[120, 80, 100].forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 60,
    style: {
      fill: '#ecf0f1',
      stroke: '#bdc3c7',
      strokeWidth: 2
    }
  });
  fixedStack.addElement(rect);
  allRects.push(rect);
});

// Auto-height VStack
const autoHeightStack = new NewVStack({
  width: 300,
  height: 'auto',
  spacing: 10,
  alignment: 'center',
  boxModel: { padding: 15 },
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 3
  }
});

autoHeightStack.position({
  relativeFrom: autoHeightStack.topLeft,
  relativeTo: { x: 425, y: 50 },
  x: 0,
  y: 0
});

// Add items that determine the height
[120, 80, 100, 90, 110].forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 60,
    style: {
      fill: '#ecf0f1',
      stroke: '#bdc3c7',
      strokeWidth: 2
    }
  });
  autoHeightStack.addElement(rect);
  allRects.push(rect);
});

// Auto width and height VStack
const autoStack = new NewVStack({
  width: 'auto',
  height: 'auto',
  spacing: 10,
  alignment: 'left',
  boxModel: { padding: 15 },
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 3
  }
});

autoStack.position({
  relativeFrom: autoStack.topLeft,
  relativeTo: { x: 800, y: 50 },
  x: 0,
  y: 0
});

// Add items of varying sizes
[180, 220, 140, 200].forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 60,
    style: {
      fill: '#ecf0f1',
      stroke: '#bdc3c7',
      strokeWidth: 2
    }
  });
  autoStack.addElement(rect);
  allRects.push(rect);
});

artboard.addElement(fixedStack);
artboard.addElement(autoHeightStack);
artboard.addElement(autoStack);

// Add debug circles to all rectangles
const debugMarkers = [];
allRects.forEach((rect) => {
  // Add circles at the four corners of each rectangle's border box
  const tl = createDebugCircle(rect.topLeft, '#e74c3c');
  const tr = createDebugCircle(rect.topRight, '#e74c3c');
  const bl = createDebugCircle(rect.bottomLeft, '#2ecc71');
  const br = createDebugCircle(rect.bottomRight, '#2ecc71');
  
  debugMarkers.push(tl, tr, bl, br);
});

// Add debug markers with high z-index
debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

