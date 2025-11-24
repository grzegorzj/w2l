/**
 * Example: New Layout System - Nested VStacks with Debug Markers
 * 
 * Simple demonstration of one VStack containing another VStack.
 * Shows relative positioning through one level of nesting.
 * 
 * Debug circles verify that position helpers return correct absolute coordinates:
 * - Red: Border box corners
 * - Green: Content box corners  
 * - Blue: Centers
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Outer VStack
const outerVStack = new NewContainer({
  width: 600,
  height: 500,
  direction: 'vertical',
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
const innerVStack = new NewContainer({
  width: 540,
  height: 200,
  direction: 'vertical',
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

// ===== DEBUG MARKERS =====
// These circles verify that our position helpers return correct absolute coordinates

// Helper to create a debug circle at a specific position
function createDebugCircle(position, color, radius = 5) {
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

// Border box corners of inner VStack (RED)
const innerBorderTL = createDebugCircle(innerVStack.borderBox.topLeft, '#e74c3c');
const innerBorderTR = createDebugCircle(innerVStack.borderBox.topRight, '#e74c3c');
const innerBorderBL = createDebugCircle(innerVStack.borderBox.bottomLeft, '#e74c3c');
const innerBorderBR = createDebugCircle(innerVStack.borderBox.bottomRight, '#e74c3c');

// Content box corners of inner VStack (GREEN)
const innerContentTL = createDebugCircle(innerVStack.contentBox.topLeft, '#2ecc71');
const innerContentTR = createDebugCircle(innerVStack.contentBox.topRight, '#2ecc71');
const innerContentBL = createDebugCircle(innerVStack.contentBox.bottomLeft, '#2ecc71');
const innerContentBR = createDebugCircle(innerVStack.contentBox.bottomRight, '#2ecc71');

// Centers (BLUE)
const innerVStackCenter = createDebugCircle(innerVStack.center, '#3498db', 7);
const topRectCenter = createDebugCircle(topRect.center, '#9b59b6', 7);

// Outer VStack content box corners (YELLOW)
const outerContentTL = createDebugCircle(outerVStack.contentBox.topLeft, '#f39c12');
const outerContentTR = createDebugCircle(outerVStack.contentBox.topRight, '#f39c12');

// Add all debug markers with high z-index so they render on top
[innerBorderTL, innerBorderTR, innerBorderBL, innerBorderBR,
 innerContentTL, innerContentTR, innerContentBL, innerContentBR,
 innerVStackCenter, topRectCenter,
 outerContentTL, outerContentTR].forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

