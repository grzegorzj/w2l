/**
 * Example: Artboard Auto-Sizing
 * 
 * Tests artboard with auto width and height.
 * The artboard should grow to fit all positioned children.
 */

import { NewArtboard, NewRect, NewCircle } from 'w2l';

// Artboard with auto-sizing
const artboard = new NewArtboard({
  width: 'auto',
  height: 'auto',
  backgroundColor: '#ecf0f1',
  boxModel: { padding: 20 }
});

// Add some positioned elements
const rect1 = new NewRect({
  width: 200,
  height: 150,
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: { x: 50, y: 50 },
  x: 0,
  y: 0
});

const rect2 = new NewRect({
  width: 180,
  height: 120,
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

rect2.position({
  relativeFrom: rect2.topLeft,
  relativeTo: { x: 300, y: 100 },
  x: 0,
  y: 0
});

const circle = new NewCircle({
  radius: 60,
  style: {
    fill: '#2ecc71',
    stroke: '#27ae60',
    strokeWidth: 2
  }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: { x: 400, y: 300 },
  x: 0,
  y: 0
});

// Add all elements
artboard.addElement(rect1);
artboard.addElement(rect2);
artboard.addElement(circle);

// The artboard should now have auto-sized to contain all elements
// Expected size: from (0, 0) to (460, 360) + padding
// Width: 460 + 20*2 = 500
// Height: 360 + 20*2 = 400

return artboard.render();

