/**
 * Example: New Layout System - VStack (Vertical Stack)
 * 
 * Demonstrates the VStack layout with proactive positioning strategy.
 * The parent (VStack) tells children where to position themselves.
 * 
 * Features:
 * - Vertical stacking of rectangles
 * - Spacing between elements
 * - Respects box model (children positioned in content area)
 */

import { NewArtboard, NewContainer, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f0f0f0'
});

// Create a vertical container with padding
const vstack = new NewContainer({
  width: 400,
  height: 500,
  direction: 'vertical',
  spacing: 20,  // Space between children
  boxModel: {
    padding: 30  // Padding around content
  },
  style: {
    fill: '#ecf0f1',
    stroke: '#95a5a6',
    strokeWidth: 2
  }
});

// Position the VStack at the artboard center
vstack.position({
  relativeFrom: vstack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add rectangles to the VStack
// They will be automatically positioned vertically with spacing
const rect1 = new NewRect({
  width: 340,  // Width fits within content area (400 - 30*2)
  height: 60,
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

const rect2 = new NewRect({
  width: 340,
  height: 80,
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

const rect3 = new NewRect({
  width: 340,
  height: 50,
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 2
  }
});

const rect4 = new NewRect({
  width: 340,
  height: 70,
  style: {
    fill: '#f39c12',
    stroke: '#d68910',
    strokeWidth: 2
  }
});

// Add children to VStack
// Proactive strategy: They're positioned as soon as they're added
vstack.addElement(rect1);
vstack.addElement(rect2);
vstack.addElement(rect3);
vstack.addElement(rect4);

// Add VStack to artboard
artboard.addElement(vstack);

return artboard.render();

