/**
 * Basic flowchart example demonstrating FlowBox and FlowConnector components.
 * 
 * This example shows:
 * - Creating themed flowchart boxes
 * - Using tints for different box types
 * - Connecting boxes with straight connectors
 * - Adding labels to connectors
 * - Using anchor points
 */

import { 
  Artboard, 
  FlowBox, 
  FlowConnector,
  SwissTheme 
} from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
  theme: SwissTheme,
});

// Create start box (accent tint)
const startBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Start",
  tint: "accent",
  theme: SwissTheme,
});

// Position at top center
startBox.position({
  relativeFrom: startBox.anchors.center,
  relativeTo: { x: 400, y: 80 },
  x: 0,
  y: 0,
});

// Create process box 1
const processBox1 = new FlowBox({
  width: 160,
  height: 60,
  text: "Initialize System",
  theme: SwissTheme,
});

processBox1.position({
  relativeFrom: processBox1.anchors.center,
  relativeTo: { x: 400, y: 180 },
  x: 0,
  y: 0,
});

// Create decision box
const decisionBox = new FlowBox({
  width: 180,
  height: 60,
  text: "Data Valid?",
  tint: "muted",
  theme: SwissTheme,
});

decisionBox.position({
  relativeFrom: decisionBox.anchors.center,
  relativeTo: { x: 400, y: 280 },
  x: 0,
  y: 0,
});

// Create process box 2 (success path)
const processBox2 = new FlowBox({
  width: 160,
  height: 60,
  text: "Process Data",
  theme: SwissTheme,
});

processBox2.position({
  relativeFrom: processBox2.anchors.center,
  relativeTo: { x: 400, y: 380 },
  x: 0,
  y: 0,
});

// Create error box (different path)
const errorBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Show Error",
  tint: "#FFE6E6", // Custom light red tint
  theme: SwissTheme,
});

errorBox.position({
  relativeFrom: errorBox.anchors.center,
  relativeTo: { x: 600, y: 380 },
  x: 0,
  y: 0,
});

// Create end box
const endBox = new FlowBox({
  width: 140,
  height: 60,
  text: "End",
  tint: "accent",
  theme: SwissTheme,
});

endBox.position({
  relativeFrom: endBox.anchors.center,
  relativeTo: { x: 400, y: 480 },
  x: 0,
  y: 0,
});

// Create connectors
const connector1 = new FlowConnector({
  from: startBox.anchors.bottom,
  to: processBox1.anchors.top,
  theme: SwissTheme,
});

const connector2 = new FlowConnector({
  from: processBox1.anchors.bottom,
  to: decisionBox.anchors.top,
  theme: SwissTheme,
});

const connector3 = new FlowConnector({
  from: decisionBox.anchors.bottom,
  to: processBox2.anchors.top,
  label: "Yes",
  theme: SwissTheme,
});

const connector4 = new FlowConnector({
  from: decisionBox.anchors.right,
  to: errorBox.anchors.left,
  label: "No",
  theme: SwissTheme,
});

const connector5 = new FlowConnector({
  from: processBox2.anchors.bottom,
  to: endBox.anchors.top,
  theme: SwissTheme,
});

const connector6 = new FlowConnector({
  from: errorBox.anchors.bottom,
  to: endBox.anchors.right,
  theme: SwissTheme,
});

// Add elements to artboard
artboard.addElement(connector1);
artboard.addElement(connector2);
artboard.addElement(connector3);
artboard.addElement(connector4);
artboard.addElement(connector5);
artboard.addElement(connector6);

artboard.addElement(startBox);
artboard.addElement(processBox1);
artboard.addElement(decisionBox);
artboard.addElement(processBox2);
artboard.addElement(errorBox);
artboard.addElement(endBox);

return artboard.render();

