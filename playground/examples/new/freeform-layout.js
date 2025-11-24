/**
 * Freeform Layout Mode - Minimal Example
 * 
 * Tests the new "freeform" direction mode for NewContainer.
 * 
 * Freeform mode (CSS-like behavior):
 * - Children position themselves relative to content box at (0,0)
 * - Container sizes from (0,0) to maximum child extent
 * - Like CSS: parent has position:relative, children have position:absolute
 * - No auto-positioning, no bounds normalization
 * 
 * Example: Child at (100, 50) with size 60x80
 *   → Container content area: 160x130 (from origin to 160,130)
 */

import { NewArtboard, NewContainer, NewRect } from "w2l";

// Create artboard
const artboard = new NewArtboard({
  width: 600,
  height: 400,
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 20 },
});

// Create a freeform container (auto-sizes to children)
const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  style: {
    fill: "#3498db",
    fillOpacity: 0.3,
    stroke: "#2980b9",
    strokeWidth: 2,
  },
  boxModel: { padding: 20 },
});

// Position container in artboard
container.position({
  relativeFrom: container.borderBox.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50,
  boxReference: "contentBox",
});

// Create a rectangle
const rect = new NewRect({
  width: 100,
  height: 80,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});

// Position rectangle manually relative to container's content box
// Using center as reference point, so actual top-left will be at:
// x: 75 - 50 (half width) = 25
// y: 60 - 40 (half height) = 20
rect.position({
  relativeFrom: rect.center,
  relativeTo: container.contentBox.topLeft,
  x: 75,
  y: 60,
  boxReference: "contentBox",
});

// Add to container - container grows CSS-like from (0,0) to max child extent
// Rectangle spans from (25, 20) to (125, 100)
// Container content size will be: 125 x 100
// Container border box size will be: 165 x 140 (content + 40px padding)
container.addElement(rect);

// Add to artboard
artboard.addElement(container);

// Render
artboard.render();

