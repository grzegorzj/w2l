/**
 * Auto-Size Test Example
 *
 * Tests complete auto-sizing chain:
 * - Auto-sized artboard
 * - Auto-sized main container (horizontal)
 * - Auto-sized column containers (vertical)
 * - Various shapes inside
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from "w2l";

// Auto-sized artboard with padding
const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#1a1a2e",
  boxModel: { padding: 40 },
});

// Auto-sized main container (horizontal layout)
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top", // Align children to top
  boxModel: {
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    border: { top: 3, right: 3, bottom: 3, left: 3 },
  },
  style: {
    fill: "#16213e",
    stroke: "#0f3460",
    strokeWidth: 3,
  },
});

artboard.addElement(mainContainer);

const column1 = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center", // Center children horizontally
  boxModel: {
    padding: 20,
    border: 2,
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column1);

const column2 = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center", // Center children horizontally
  boxModel: {
    padding: 20,
    border: 2,
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column2);

const column3 = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center", // Center children horizontally
  boxModel: {
    padding: 20,
    border: 2,
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column3);
return artboard.render();
