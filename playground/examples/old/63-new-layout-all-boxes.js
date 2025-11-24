/**
 * Example: New Layout System - All Box Model Layers
 * 
 * Demonstrates positioning with all four box model layers:
 * - Margin Box (outermost, red)
 * - Border Box (total size, orange)
 * - Padding Box (inside border, yellow)
 * - Content Box (innermost, green)
 * 
 * Each layer is visualized with a debug rectangle.
 */

import { NewArtboard, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f8f9fa'
});

// Create a rectangle with full box model
const element = new NewRect({
  width: 300,    // Border box width
  height: 200,   // Border box height
  boxModel: {
    margin: 30,
    border: 10,
    padding: 20
  },
  style: { 
    fill: '#3498db',
    stroke: '#2c3e50',
    strokeWidth: 10  // This represents the border visually
  }
});

// Position the element at the center of the artboard
// Using content box (semantic default)
element.position({
  relativeFrom: element.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Debug Rectangle 1: Margin Box (outermost - red)
const marginBoxDebug = new NewRect({
  width: element.marginBox.topRight.x - element.marginBox.topLeft.x,
  height: element.marginBox.bottomLeft.y - element.marginBox.topLeft.y,
  style: { 
    fill: 'none',
    stroke: '#e74c3c',
    strokeWidth: 2,
    strokeDasharray: '10,5'
  }
});

marginBoxDebug.position({
  relativeFrom: marginBoxDebug.borderBox.topLeft,
  relativeTo: element.marginBox.topLeft,
  x: 0,
  y: 0
});

// Debug Rectangle 2: Border Box (total size - orange)
const borderBoxDebug = new NewRect({
  width: element.borderBox.topRight.x - element.borderBox.topLeft.x,
  height: element.borderBox.bottomLeft.y - element.borderBox.topLeft.y,
  style: { 
    fill: 'none',
    stroke: '#e67e22',
    strokeWidth: 2,
    strokeDasharray: '8,4'
  }
});

borderBoxDebug.position({
  relativeFrom: borderBoxDebug.borderBox.topLeft,
  relativeTo: element.borderBox.topLeft,
  x: 0,
  y: 0
});

// Debug Rectangle 3: Padding Box (inside border - yellow)
const paddingBoxDebug = new NewRect({
  width: element.paddingBox.topRight.x - element.paddingBox.topLeft.x,
  height: element.paddingBox.bottomLeft.y - element.paddingBox.topLeft.y,
  style: { 
    fill: 'none',
    stroke: '#f39c12',
    strokeWidth: 2,
    strokeDasharray: '6,3'
  }
});

paddingBoxDebug.position({
  relativeFrom: paddingBoxDebug.borderBox.topLeft,
  relativeTo: element.paddingBox.topLeft,
  x: 0,
  y: 0
});

// Debug Rectangle 4: Content Box (innermost - green)
const contentBoxDebug = new NewRect({
  width: element.contentBox.topRight.x - element.contentBox.topLeft.x,
  height: element.contentBox.bottomLeft.y - element.contentBox.topLeft.y,
  style: { 
    fill: 'none',
    stroke: '#2ecc71',
    strokeWidth: 2,
    strokeDasharray: '4,2'
  }
});

contentBoxDebug.position({
  relativeFrom: contentBoxDebug.borderBox.topLeft,
  relativeTo: element.contentBox.topLeft,
  x: 0,
  y: 0
});

// Add circles at corners to show each box's reference points
// Margin box corners (red)
const marginTL = new NewCircle({
  radius: 8,
  style: { fill: '#e74c3c' }
});
marginTL.position({
  relativeFrom: marginTL.center,
  relativeTo: element.marginBox.topLeft,
  x: 0,
  y: 0
});

const marginBR = new NewCircle({
  radius: 8,
  style: { fill: '#e74c3c' }
});
marginBR.position({
  relativeFrom: marginBR.center,
  relativeTo: element.marginBox.bottomRight,
  x: 0,
  y: 0
});

// Border box corners (orange)
const borderTL = new NewCircle({
  radius: 7,
  style: { fill: '#e67e22' }
});
borderTL.position({
  relativeFrom: borderTL.center,
  relativeTo: element.borderBox.topLeft,
  x: 0,
  y: 0
});

const borderBR = new NewCircle({
  radius: 7,
  style: { fill: '#e67e22' }
});
borderBR.position({
  relativeFrom: borderBR.center,
  relativeTo: element.borderBox.bottomRight,
  x: 0,
  y: 0
});

// Padding box corners (yellow)
const paddingTL = new NewCircle({
  radius: 6,
  style: { fill: '#f39c12' }
});
paddingTL.position({
  relativeFrom: paddingTL.center,
  relativeTo: element.paddingBox.topLeft,
  x: 0,
  y: 0
});

const paddingBR = new NewCircle({
  radius: 6,
  style: { fill: '#f39c12' }
});
paddingBR.position({
  relativeFrom: paddingBR.center,
  relativeTo: element.paddingBox.bottomRight,
  x: 0,
  y: 0
});

// Content box corners (green)
const contentTL = new NewCircle({
  radius: 5,
  style: { fill: '#2ecc71' }
});
contentTL.position({
  relativeFrom: contentTL.center,
  relativeTo: element.contentBox.topLeft,
  x: 0,
  y: 0
});

const contentBR = new NewCircle({
  radius: 5,
  style: { fill: '#2ecc71' }
});
contentBR.position({
  relativeFrom: contentBR.center,
  relativeTo: element.contentBox.bottomRight,
  x: 0,
  y: 0
});

// Center marker (content box center - the semantic .center)
const centerMarker = new NewCircle({
  radius: 10,
  style: { 
    fill: '#9b59b6',
    stroke: 'white',
    strokeWidth: 2
  }
});
centerMarker.position({
  relativeFrom: centerMarker.center,
  relativeTo: element.center,  // Semantic center = content box center
  x: 0,
  y: 0
});

// Add all elements to artboard
// Add element first, then debug boxes and markers on top
artboard.addElement(element);
artboard.addElement(marginBoxDebug);
artboard.addElement(borderBoxDebug);
artboard.addElement(paddingBoxDebug);
artboard.addElement(contentBoxDebug);

// Add corner markers on top
artboard.addElement(marginTL);
artboard.addElement(marginBR);
artboard.addElement(borderTL);
artboard.addElement(borderBR);
artboard.addElement(paddingTL);
artboard.addElement(paddingBR);
artboard.addElement(contentTL);
artboard.addElement(contentBR);
artboard.addElement(centerMarker);

return artboard.render();

