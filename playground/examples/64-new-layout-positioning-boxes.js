/**
 * Example: New Layout System - Positioning to Different Box Layers
 * 
 * Shows how to position elements relative to different box model layers.
 * Creates a central element with box model, then positions satellites
 * at each box layer's corners.
 */

import { NewArtboard, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 900,
  height: 700,
  backgroundColor: '#ecf0f1'
});

// Central element with full box model
const center = new NewRect({
  width: 200,
  height: 150,
  boxModel: {
    margin: 40,
    border: 8,
    padding: 25
  },
  style: { 
    fill: '#34495e',
    stroke: '#2c3e50',
    strokeWidth: 8
  }
});

// Position at artboard center
center.position({
  relativeFrom: center.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Satellites positioned at MARGIN BOX corners (red)
const marginTopLeft = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c', stroke: 'white', strokeWidth: 2 }
});
marginTopLeft.position({
  relativeFrom: marginTopLeft.center,
  relativeTo: center.marginBox.topLeft,  // Explicit margin box reference
  x: 0,
  y: 0
});

const marginBottomRight = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c', stroke: 'white', strokeWidth: 2 }
});
marginBottomRight.position({
  relativeFrom: marginBottomRight.center,
  relativeTo: center.marginBox.bottomRight,
  x: 0,
  y: 0
});

// Satellites positioned at BORDER BOX corners (orange)
const borderTopRight = new NewCircle({
  radius: 15,
  style: { fill: '#e67e22', stroke: 'white', strokeWidth: 2 }
});
borderTopRight.position({
  relativeFrom: borderTopRight.center,
  relativeTo: center.borderBox.topRight,  // Explicit border box reference
  x: 0,
  y: 0
});

const borderBottomLeft = new NewCircle({
  radius: 15,
  style: { fill: '#e67e22', stroke: 'white', strokeWidth: 2 }
});
borderBottomLeft.position({
  relativeFrom: borderBottomLeft.center,
  relativeTo: center.borderBox.bottomLeft,
  x: 0,
  y: 0
});

// Satellites positioned at PADDING BOX center edges (yellow)
const paddingCenterTop = new NewCircle({
  radius: 15,
  style: { fill: '#f39c12', stroke: 'white', strokeWidth: 2 }
});
paddingCenterTop.position({
  relativeFrom: paddingCenterTop.center,
  relativeTo: center.paddingBox.centerTop,  // Padding box center-top
  x: 0,
  y: 0
});

const paddingCenterBottom = new NewCircle({
  radius: 15,
  style: { fill: '#f39c12', stroke: 'white', strokeWidth: 2 }
});
paddingCenterBottom.position({
  relativeFrom: paddingCenterBottom.center,
  relativeTo: center.paddingBox.centerBottom,
  x: 0,
  y: 0
});

// Satellites positioned at CONTENT BOX center edges (green)
const contentCenterLeft = new NewCircle({
  radius: 15,
  style: { fill: '#2ecc71', stroke: 'white', strokeWidth: 2 }
});
contentCenterLeft.position({
  relativeFrom: contentCenterLeft.center,
  relativeTo: center.contentBox.centerLeft,  // Content box center-left
  x: 0,
  y: 0
});

const contentCenterRight = new NewCircle({
  radius: 15,
  style: { fill: '#2ecc71', stroke: 'white', strokeWidth: 2 }
});
contentCenterRight.position({
  relativeFrom: contentCenterRight.center,
  relativeTo: center.contentBox.centerRight,  // Content box center-right
  x: 0,
  y: 0
});

// Semantic center (purple) - same as content box center
const semanticCenter = new NewCircle({
  radius: 20,
  style: { fill: '#9b59b6', stroke: 'white', strokeWidth: 3 }
});
semanticCenter.position({
  relativeFrom: semanticCenter.center,
  relativeTo: center.center,  // Semantic (no explicit box = content box)
  x: 0,
  y: 0
});

// Visual guides showing box layers
const marginGuide = new NewRect({
  width: center.marginBox.topRight.x - center.marginBox.topLeft.x,
  height: center.marginBox.bottomLeft.y - center.marginBox.topLeft.y,
  style: { fill: 'rgba(231, 76, 60, 0.1)', stroke: '#e74c3c', strokeWidth: 1, strokeDasharray: '5,5' }
});
marginGuide.position({
  relativeFrom: marginGuide.borderBox.topLeft,
  relativeTo: center.marginBox.topLeft,
  x: 0,
  y: 0
});

const borderGuide = new NewRect({
  width: center.borderBox.topRight.x - center.borderBox.topLeft.x,
  height: center.borderBox.bottomLeft.y - center.borderBox.topLeft.y,
  style: { fill: 'rgba(230, 126, 34, 0.1)', stroke: '#e67e22', strokeWidth: 1, strokeDasharray: '5,5' }
});
borderGuide.position({
  relativeFrom: borderGuide.borderBox.topLeft,
  relativeTo: center.borderBox.topLeft,
  x: 0,
  y: 0
});

const paddingGuide = new NewRect({
  width: center.paddingBox.topRight.x - center.paddingBox.topLeft.x,
  height: center.paddingBox.bottomLeft.y - center.paddingBox.topLeft.y,
  style: { fill: 'rgba(243, 156, 18, 0.1)', stroke: '#f39c12', strokeWidth: 1, strokeDasharray: '5,5' }
});
paddingGuide.position({
  relativeFrom: paddingGuide.borderBox.topLeft,
  relativeTo: center.paddingBox.topLeft,
  x: 0,
  y: 0
});

const contentGuide = new NewRect({
  width: center.contentBox.topRight.x - center.contentBox.topLeft.x,
  height: center.contentBox.bottomLeft.y - center.contentBox.topLeft.y,
  style: { fill: 'rgba(46, 204, 113, 0.1)', stroke: '#2ecc71', strokeWidth: 1, strokeDasharray: '5,5' }
});
contentGuide.position({
  relativeFrom: contentGuide.borderBox.topLeft,
  relativeTo: center.contentBox.topLeft,
  x: 0,
  y: 0
});

// Add all elements - center first, then guides, then satellites on top
artboard.addElement(center);
artboard.addElement(marginGuide);
artboard.addElement(borderGuide);
artboard.addElement(paddingGuide);
artboard.addElement(contentGuide);
artboard.addElement(marginTopLeft);
artboard.addElement(marginBottomRight);
artboard.addElement(borderTopRight);
artboard.addElement(borderBottomLeft);
artboard.addElement(paddingCenterTop);
artboard.addElement(paddingCenterBottom);
artboard.addElement(contentCenterLeft);
artboard.addElement(contentCenterRight);
artboard.addElement(semanticCenter);

return artboard.render();

