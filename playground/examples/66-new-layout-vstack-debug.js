/**
 * Example: New Layout System - VStack with Box Model Debug
 * 
 * Shows how VStack respects the box model:
 * - Children are positioned in the CONTENT AREA (inside padding)
 * - Spacing is applied between children
 * - Visual guides show the padding and content areas
 * 
 * STRATEGY: PROACTIVE
 * The VStack tells children where to position themselves.
 */

import { NewArtboard, NewVStack, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f8f9fa'
});

// Create a VStack with visible padding
const vstack = new NewVStack({
  width: 400,
  height: 450,
  spacing: 15,
  boxModel: {
    padding: 40  // 40px padding on all sides
  },
  style: {
    fill: '#ecf0f1',
    stroke: '#95a5a6',
    strokeWidth: 2
  }
});

// Position VStack at artboard center
vstack.position({
  relativeFrom: vstack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Debug rectangle showing padding box
const paddingBoxDebug = new NewRect({
  width: vstack.paddingBox.topRight.x - vstack.paddingBox.topLeft.x,
  height: vstack.paddingBox.bottomLeft.y - vstack.paddingBox.topLeft.y,
  style: {
    fill: 'rgba(243, 156, 18, 0.15)',
    stroke: '#f39c12',
    strokeWidth: 2,
    strokeDasharray: '5,5'
  }
});

paddingBoxDebug.position({
  relativeFrom: paddingBoxDebug.borderBox.topLeft,
  relativeTo: vstack.paddingBox.topLeft,
  x: 0,
  y: 0
});

// Debug rectangle showing content box (where children are positioned)
const contentBoxDebug = new NewRect({
  width: vstack.contentBox.topRight.x - vstack.contentBox.topLeft.x,
  height: vstack.contentBox.bottomLeft.y - vstack.contentBox.topLeft.y,
  style: {
    fill: 'rgba(46, 204, 113, 0.15)',
    stroke: '#2ecc71',
    strokeWidth: 2,
    strokeDasharray: '5,5'
  }
});

contentBoxDebug.position({
  relativeFrom: contentBoxDebug.borderBox.topLeft,
  relativeTo: vstack.contentBox.topLeft,
  x: 0,
  y: 0
});

// Add children to VStack
// They will be positioned in the CONTENT AREA
const rect1 = new NewRect({
  width: 320,  // Width fits in content area (400 - 40*2 = 320)
  height: 60,
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

const rect2 = new NewRect({
  width: 320,
  height: 70,
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

const rect3 = new NewRect({
  width: 320,
  height: 55,
  style: {
    fill: '#9b59b6',
    stroke: '#8e44ad',
    strokeWidth: 2
  }
});

// Proactive strategy: Children positioned as they're added
vstack.addElement(rect1);
vstack.addElement(rect2);
vstack.addElement(rect3);

// Add everything to artboard
artboard.addElement(paddingBoxDebug);
artboard.addElement(contentBoxDebug);
artboard.addElement(vstack);

return artboard.render();

