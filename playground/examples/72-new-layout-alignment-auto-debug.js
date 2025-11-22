/**
 * Example: VStack Right Alignment with Auto-Sizing + Debug
 * 
 * Tests a "sneaky" case: right alignment with auto width/height.
 * Debug circles visualize the box model to catch any alignment bugs.
 */

import { NewArtboard, NewVStack, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 1000,
  height: 700,
  backgroundColor: '#ecf0f1'
});

// VStack with auto-sizing and right alignment
const autoRightStack = new NewVStack({
  width: 'auto',
  height: 'auto',
  spacing: 15,
  alignment: 'right',
  boxModel: { padding: 25, border: 3 },
  style: {
    fill: '#34495e',
    stroke: '#e74c3c',
    strokeWidth: 3
  }
});

// Position it in the middle-ish of the artboard
autoRightStack.position({
  relativeFrom: autoRightStack.topLeft,
  relativeTo: { x: 300, y: 100 },
  x: 0,
  y: 0
});

// Add rectangles of varying widths
const widths = [180, 120, 240, 160, 200];
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
const childRects = [];

widths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 60,
    style: {
      fill: colors[idx],
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });
  autoRightStack.addElement(rect);
  childRects.push(rect);
});

artboard.addElement(autoRightStack);

// ===== DEBUG MARKERS =====
// Helper to create debug circles
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

// Border box corners (RED)
const borderTL = createDebugCircle(autoRightStack.borderBox.topLeft, '#e74c3c', 6);
const borderTR = createDebugCircle(autoRightStack.borderBox.topRight, '#e74c3c', 6);
const borderBL = createDebugCircle(autoRightStack.borderBox.bottomLeft, '#e74c3c', 6);
const borderBR = createDebugCircle(autoRightStack.borderBox.bottomRight, '#e74c3c', 6);

// Content box corners (GREEN)
const contentTL = createDebugCircle(autoRightStack.contentBox.topLeft, '#2ecc71', 6);
const contentTR = createDebugCircle(autoRightStack.contentBox.topRight, '#2ecc71', 6);
const contentBL = createDebugCircle(autoRightStack.contentBox.bottomLeft, '#2ecc71', 6);
const contentBR = createDebugCircle(autoRightStack.contentBox.bottomRight, '#2ecc71', 6);

// Content box center line (BLUE) - where "center" alignment would place things
const contentCenterTop = createDebugCircle(autoRightStack.contentBox.centerTop, '#3498db', 7);
const contentCenterBottom = createDebugCircle(autoRightStack.contentBox.centerBottom, '#3498db', 7);

// Content box left and right edges at center height (YELLOW) - alignment reference points
const contentLeftCenter = createDebugCircle(autoRightStack.contentBox.centerLeft, '#f39c12', 7);
const contentRightCenter = createDebugCircle(autoRightStack.contentBox.centerRight, '#f39c12', 7);

// Add all debug markers with high z-index
const debugMarkers = [
  borderTL, borderTR, borderBL, borderBR,
  contentTL, contentTR, contentBL, contentBR,
  contentCenterTop, contentCenterBottom,
  contentLeftCenter, contentRightCenter
];

// Add debug circles to child rectangles (border box corners)
childRects.forEach((rect) => {
  // Top corners in red/orange, bottom corners in cyan/blue
  const tl = createDebugCircle(rect.topLeft, '#ff6b6b', 4);
  const tr = createDebugCircle(rect.topRight, '#ffa500', 4);
  const bl = createDebugCircle(rect.bottomLeft, '#4ecdc4', 4);
  const br = createDebugCircle(rect.bottomRight, '#45b7d1', 4);
  
  debugMarkers.push(tl, tr, bl, br);
});

debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

