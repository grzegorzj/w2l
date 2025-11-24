/**
 * Example: Artboard Auto-Sizing with Deep Nesting
 * 
 * Tests that artboard auto-sizing captures ALL positioned elements
 * in the tree, not just direct children.
 * 
 * Structure:
 * - Artboard (auto width/height)
 *   - Container A (positioned at 100, 100)
 *     - Container B (nested inside A)
 *       - Rectangle positioned far away (500, 400)
 * 
 * The artboard should grow to include the deeply nested rectangle.
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from 'w2l';

// Artboard with auto-sizing
const artboard = new NewArtboard({
  width: 'auto',
  height: 'auto',
  backgroundColor: '#ecf0f1',
  boxModel: { padding: 20 }
});

// Outer container
const outerContainer = new NewContainer({
  width: 300,
  height: 250,
  direction: 'none',  // Manual positioning
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

outerContainer.position({
  relativeFrom: outerContainer.topLeft,
  relativeTo: { x: 100, y: 100 },
  x: 0,
  y: 0
});

// Middle container (inside outer)
const middleContainer = new NewContainer({
  width: 250,
  height: 200,
  direction: 'none',  // Manual positioning
  boxModel: { padding: 10, border: 2 },
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 2
  }
});

middleContainer.position({
  relativeFrom: middleContainer.topLeft,
  relativeTo: outerContainer.contentBox.topLeft,
  x: 20,
  y: 20
});

// Deep rectangle (inside middle container) - positioned far away
const deepRect = new NewRect({
  width: 150,
  height: 100,
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

// Position this rectangle far to the right and down
// This should force the artboard to grow significantly
deepRect.position({
  relativeFrom: deepRect.topLeft,
  relativeTo: middleContainer.contentBox.topLeft,
  x: 350,
  y: 250
});

// Another deep element - a circle even further out
const deepCircle = new NewCircle({
  radius: 40,
  style: {
    fill: '#f39c12',
    stroke: '#e67e22',
    strokeWidth: 2
  }
});

deepCircle.position({
  relativeFrom: deepCircle.center,
  relativeTo: middleContainer.contentBox.topLeft,
  x: 550,
  y: 400
});

// Build hierarchy
middleContainer.addElement(deepRect);
middleContainer.addElement(deepCircle);
outerContainer.addElement(middleContainer);
artboard.addElement(outerContainer);

// Debug markers to show the extent
const debugMarkers = [];

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

// Mark the outer container
debugMarkers.push(
  createDebugCircle(outerContainer.borderBox.topLeft, '#2980b9', 6),
  createDebugCircle(outerContainer.borderBox.topRight, '#2980b9', 6),
  createDebugCircle(outerContainer.borderBox.bottomLeft, '#2980b9', 6),
  createDebugCircle(outerContainer.borderBox.bottomRight, '#2980b9', 6)
);

// Mark the middle container
debugMarkers.push(
  createDebugCircle(middleContainer.borderBox.topLeft, '#27ae60', 5),
  createDebugCircle(middleContainer.borderBox.topRight, '#27ae60', 5),
  createDebugCircle(middleContainer.borderBox.bottomLeft, '#27ae60', 5),
  createDebugCircle(middleContainer.borderBox.bottomRight, '#27ae60', 5)
);

// Mark the deep rectangle - this determines the artboard size!
debugMarkers.push(
  createDebugCircle(deepRect.topLeft, '#e74c3c', 5),
  createDebugCircle(deepRect.topRight, '#e74c3c', 5),
  createDebugCircle(deepRect.bottomLeft, '#e74c3c', 5),
  createDebugCircle(deepRect.bottomRight, '#e74c3c', 5)
);

// Mark the deep circle - the furthest element
debugMarkers.push(
  createDebugCircle(deepCircle.center, '#f39c12', 7)
);

// Mark artboard content box corners (should encompass everything)
debugMarkers.push(
  createDebugCircle(artboard.contentBox.topLeft, '#95a5a6', 8),
  createDebugCircle(artboard.contentBox.topRight, '#95a5a6', 8),
  createDebugCircle(artboard.contentBox.bottomLeft, '#95a5a6', 8),
  createDebugCircle(artboard.contentBox.bottomRight, '#95a5a6', 8)
);

// Add all debug markers with high z-index
debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();

