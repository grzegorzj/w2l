/**
 * Example: Nested VStacks - Center Alignment + Auto-Sizing
 * 
 * Tests an interesting case:
 * - Outer VStack: Fixed size with center alignment
 * - Inner VStack: Auto-sizing (width + height)
 * - Rectangles: Various sizes inside the inner VStack
 * 
 * Debug circles show border box corners to verify positioning.
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1000,
  height: 800,
  backgroundColor: '#ecf0f1'
});

// Outer VStack - Fixed size with center alignment
const outerVStack = new NewContainer({
  width: 600,
  direction: 'vertical',
  height: 700,
  spacing: 20,
  horizontalAlignment: 'center',  // Center-align children horizontally
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

// Add a fixed-size rectangle at the top
const topRect = new NewRect({
  width: 400,
  height: 80,
  style: {
    fill: '#9b59b6',
    stroke: '#8e44ad',
    strokeWidth: 2
  }
});

// Inner VStack - Auto-sizing (reactive)
const innerVStack = new NewContainer({
  width: 'auto',
  direction: 'vertical',
  height: 'auto',
  spacing: 12,
  horizontalAlignment: 'left',  // Left-align children horizontally
  boxModel: { padding: 20, border: 2 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

// Add rectangles of varying sizes to the inner VStack
const innerWidths = [150, 220, 180, 200, 160];
const innerColors = ['#e74c3c', '#f39c12', '#2ecc71', '#e67e22', '#1abc9c'];
const innerRects = [];

innerWidths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 50,
    style: {
      fill: innerColors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  innerVStack.addElement(rect);
  innerRects.push(rect);
});

// Add another fixed rectangle at the bottom
const bottomRect = new NewRect({
  width: 450,
  height: 80,
  style: {
    fill: '#16a085',
    stroke: '#138d75',
    strokeWidth: 2
  }
});

// Build hierarchy
outerVStack.addElement(topRect);
outerVStack.addElement(innerVStack);
outerVStack.addElement(bottomRect);

artboard.addElement(outerVStack);

// ===== DEBUG MARKERS =====
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

const debugMarkers = [];

// Outer VStack content box corners (YELLOW)
debugMarkers.push(
  createDebugCircle(outerVStack.contentBox.topLeft, '#f39c12', 6),
  createDebugCircle(outerVStack.contentBox.topRight, '#f39c12', 6),
  createDebugCircle(outerVStack.contentBox.bottomLeft, '#f39c12', 6),
  createDebugCircle(outerVStack.contentBox.bottomRight, '#f39c12', 6)
);

// Outer VStack content center line (ORANGE - where things should align)
debugMarkers.push(
  createDebugCircle(outerVStack.contentBox.centerTop, '#e67e22', 7),
  createDebugCircle(outerVStack.contentBox.centerBottom, '#e67e22', 7)
);

// Inner VStack border box corners (BLUE)
debugMarkers.push(
  createDebugCircle(innerVStack.borderBox.topLeft, '#3498db', 5),
  createDebugCircle(innerVStack.borderBox.topRight, '#3498db', 5),
  createDebugCircle(innerVStack.borderBox.bottomLeft, '#3498db', 5),
  createDebugCircle(innerVStack.borderBox.bottomRight, '#3498db', 5)
);

// Top and bottom fixed rectangles (PURPLE & TEAL)
debugMarkers.push(
  createDebugCircle(topRect.topLeft, '#9b59b6', 4),
  createDebugCircle(topRect.topRight, '#9b59b6', 4),
  createDebugCircle(bottomRect.bottomLeft, '#16a085', 4),
  createDebugCircle(bottomRect.bottomRight, '#16a085', 4)
);

// Inner rectangles corners (RED/GREEN)
innerRects.forEach((rect) => {
  debugMarkers.push(
    createDebugCircle(rect.topLeft, '#e74c3c', 3),
    createDebugCircle(rect.topRight, '#2ecc71', 3)
  );
});

// Add all debug markers with high z-index
debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

