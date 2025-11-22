/**
 * Example: New Layout System - Box Model Debug
 * 
 * Demonstrates the box model with debug rectangles showing
 * the padding zone and content zone.
 * 
 * This example should show that .center always refers to the
 * center of the content box, not affected by padding.
 */

import { NewArtboard, NewCircle, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5',
  boxModel: {
    padding: 40
  }
});

// Debug rectangle for padding box (should show the full artboard minus margin)
const paddingBoxDebug = new NewRect({
  width: artboard.paddingBox.topRight.x - artboard.paddingBox.topLeft.x,
  height: artboard.paddingBox.bottomLeft.y - artboard.paddingBox.topLeft.y,
  style: { 
    fill: 'rgba(255, 200, 200, 0.2)', 
    stroke: '#ff6b6b', 
    strokeWidth: 2,
    strokeDasharray: '5,5'
  }
});

// Position at padding box top-left
paddingBoxDebug.position({
  relativeFrom: paddingBoxDebug.borderBox.topLeft,
  relativeTo: artboard.paddingBox.topLeft,
  x: 0,
  y: 0
});

// Debug rectangle for content box (should be inset by padding)
const contentBoxDebug = new NewRect({
  width: artboard.contentBox.topRight.x - artboard.contentBox.topLeft.x,
  height: artboard.contentBox.bottomLeft.y - artboard.contentBox.topLeft.y,
  style: { 
    fill: 'rgba(100, 200, 255, 0.2)', 
    stroke: '#4dabf7', 
    strokeWidth: 2,
    strokeDasharray: '5,5'
  }
});

// Position at content box top-left
contentBoxDebug.position({
  relativeFrom: contentBoxDebug.borderBox.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0
});

// Create a circle at the center
// .center should ALWAYS be the center of the content box
const centerCircle = new NewCircle({
  radius: 50,
  style: { fill: '#3498db', stroke: '#2c3e50', strokeWidth: 3 }
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: artboard.center,  // This should be the content box center
  x: 0,
  y: 0
});

// Create circles at content box corners to verify they're in the right place
const topLeftCircle = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c' }
});

topLeftCircle.position({
  relativeFrom: topLeftCircle.center,
  relativeTo: artboard.topLeft,  // Should be content box top-left
  x: 0,
  y: 0
});

const topRightCircle = new NewCircle({
  radius: 15,
  style: { fill: '#2ecc71' }
});

topRightCircle.position({
  relativeFrom: topRightCircle.center,
  relativeTo: artboard.topRight,  // Should be content box top-right
  x: 0,
  y: 0
});

// Add elements
artboard.addElement(paddingBoxDebug);
artboard.addElement(contentBoxDebug);
artboard.addElement(centerCircle);
artboard.addElement(topLeftCircle);
artboard.addElement(topRightCircle);

return artboard.render();

