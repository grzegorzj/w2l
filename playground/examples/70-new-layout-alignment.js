/**
 * Example: VStack Alignment
 * 
 * Demonstrates horizontal alignment (left, center, right) in VStack.
 * Shows how elements of different sizes align within the container.
 */

import { NewArtboard, NewContainer, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 1200,
  height: 700,
  backgroundColor: '#ecf0f1'
});

// Helper to create a VStack with specific alignment
function createAlignedStack(alignment, xPos) {
  const stack = new NewContainer({
    width: 350,
    height: 600,
    direction: 'vertical',
    spacing: 15,
    alignment: alignment,
    boxModel: { padding: 20 },
    style: {
      fill: '#34495e',
      stroke: '#2c3e50',
      strokeWidth: 2
    }
  });

  stack.position({
    relativeFrom: stack.topLeft,
    relativeTo: { x: xPos, y: 50 },
    x: 0,
    y: 0
  });

  // Add rectangles of varying widths
  const widths = [280, 180, 310, 120, 240];
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];

  widths.forEach((width, idx) => {
    const rect = new NewRect({
      width: width,
      height: 70,
      style: {
        fill: colors[idx],
        stroke: '#2c3e50',
        strokeWidth: 2
      }
    });
    stack.addElement(rect);
  });

  return stack;
}

// Create three VStacks with different alignments
const leftStack = createAlignedStack('start', 25);
const centerStack = createAlignedStack('center', 425);
const rightStack = createAlignedStack('end', 825);

artboard.addElement(leftStack);
artboard.addElement(centerStack);
artboard.addElement(rightStack);

// Add labels
// (In a real scenario, we'd have a text element - for now we skip labels)

return artboard.render();

