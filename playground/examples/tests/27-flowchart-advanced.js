/**
 * Advanced flowchart example with orthogonal routing and waypoints.
 * 
 * This example demonstrates:
 * - Orthogonal (Manhattan) routing for clean right-angle connections
 * - Using waypoints to guide connector paths
 * - Complex flowchart with multiple branches
 * - Custom theme usage
 * - Double-ended connectors
 */

import { 
  Artboard, 
  FlowBox, 
  FlowConnector,
  SwissTheme 
} from "w2l";

const artboard = new Artboard({
  width: 900,
  height: 700,
  theme: SwissTheme,
});

// Create boxes for a software deployment process
const startBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Start Deploy",
  tint: "accent",
  theme: SwissTheme,
});

startBox.position({
  relativeFrom: startBox.anchors.center,
  relativeTo: { x: 450, y: 60 },
  x: 0,
  y: 0,
});

const buildBox = new FlowBox({
  width: 160,
  height: 60,
  text: "Build Application",
  theme: SwissTheme,
});

buildBox.position({
  relativeFrom: buildBox.anchors.center,
  relativeTo: { x: 450, y: 150 },
  x: 0,
  y: 0,
});

const testBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Run Tests",
  theme: SwissTheme,
});

testBox.position({
  relativeFrom: testBox.anchors.center,
  relativeTo: { x: 450, y: 240 },
  x: 0,
  y: 0,
});

const testsPassBox = new FlowBox({
  width: 160,
  height: 60,
  text: "Tests Passed?",
  tint: "muted",
  theme: SwissTheme,
});

testsPassBox.position({
  relativeFrom: testsPassBox.anchors.center,
  relativeTo: { x: 450, y: 330 },
  x: 0,
  y: 0,
});

const fixBugsBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Fix Bugs",
  tint: "#FFE6E6",
  theme: SwissTheme,
});

fixBugsBox.position({
  relativeFrom: fixBugsBox.anchors.center,
  relativeTo: { x: 250, y: 330 },
  x: 0,
  y: 0,
});

const deployBox = new FlowBox({
  width: 180,
  height: 60,
  text: "Deploy to Staging",
  theme: SwissTheme,
});

deployBox.position({
  relativeFrom: deployBox.anchors.center,
  relativeTo: { x: 450, y: 420 },
  x: 0,
  y: 0,
});

const reviewBox = new FlowBox({
  width: 160,
  height: 60,
  text: "Manual Review",
  tint: "muted",
  theme: SwissTheme,
});

reviewBox.position({
  relativeFrom: reviewBox.anchors.center,
  relativeTo: { x: 450, y: 510 },
  x: 0,
  y: 0,
});

const productionBox = new FlowBox({
  width: 180,
  height: 60,
  text: "Deploy to Production",
  tint: "accent",
  theme: SwissTheme,
});

productionBox.position({
  relativeFrom: productionBox.anchors.center,
  relativeTo: { x: 650, y: 510 },
  x: 0,
  y: 0,
});

const rollbackBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Rollback",
  tint: "#FFE6E6",
  theme: SwissTheme,
});

rollbackBox.position({
  relativeFrom: rollbackBox.anchors.center,
  relativeTo: { x: 250, y: 510 },
  x: 0,
  y: 0,
});

const endBox = new FlowBox({
  width: 140,
  height: 60,
  text: "Complete",
  tint: "accent",
  theme: SwissTheme,
});

endBox.position({
  relativeFrom: endBox.anchors.center,
  relativeTo: { x: 650, y: 600 },
  x: 0,
  y: 0,
});

// Create connectors with orthogonal routing
const conn1 = new FlowConnector({
  from: startBox.anchors.bottom,
  to: buildBox.anchors.top,
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn2 = new FlowConnector({
  from: buildBox.anchors.bottom,
  to: testBox.anchors.top,
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn3 = new FlowConnector({
  from: testBox.anchors.bottom,
  to: testsPassBox.anchors.top,
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn4 = new FlowConnector({
  from: testsPassBox.anchors.left,
  to: fixBugsBox.anchors.right,
  label: "No",
  routing: "orthogonal",
  theme: SwissTheme,
});

// Feedback loop from fix bugs back to build
const conn5 = new FlowConnector({
  from: fixBugsBox.anchors.top,
  to: buildBox.anchors.left,
  waypoints: [
    { x: 250, y: 150 },
  ],
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn6 = new FlowConnector({
  from: testsPassBox.anchors.bottom,
  to: deployBox.anchors.top,
  label: "Yes",
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn7 = new FlowConnector({
  from: deployBox.anchors.bottom,
  to: reviewBox.anchors.top,
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn8 = new FlowConnector({
  from: reviewBox.anchors.right,
  to: productionBox.anchors.left,
  label: "Approve",
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn9 = new FlowConnector({
  from: reviewBox.anchors.left,
  to: rollbackBox.anchors.right,
  label: "Reject",
  routing: "orthogonal",
  theme: SwissTheme,
});

const conn10 = new FlowConnector({
  from: productionBox.anchors.bottom,
  to: endBox.anchors.top,
  routing: "orthogonal",
  theme: SwissTheme,
});

// Rollback to start (loop back)
const conn11 = new FlowConnector({
  from: rollbackBox.anchors.top,
  to: buildBox.anchors.left,
  waypoints: [
    { x: 250, y: 150 },
  ],
  routing: "orthogonal",
  theme: SwissTheme,
});

// Add all connectors first (so they appear behind boxes)
artboard.addElement(conn1);
artboard.addElement(conn2);
artboard.addElement(conn3);
artboard.addElement(conn4);
artboard.addElement(conn5);
artboard.addElement(conn6);
artboard.addElement(conn7);
artboard.addElement(conn8);
artboard.addElement(conn9);
artboard.addElement(conn10);
artboard.addElement(conn11);

// Add all boxes
artboard.addElement(startBox);
artboard.addElement(buildBox);
artboard.addElement(testBox);
artboard.addElement(testsPassBox);
artboard.addElement(fixBugsBox);
artboard.addElement(deployBox);
artboard.addElement(reviewBox);
artboard.addElement(productionBox);
artboard.addElement(rollbackBox);
artboard.addElement(endBox);

return artboard.render();

