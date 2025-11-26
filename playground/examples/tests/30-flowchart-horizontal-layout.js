/**
 * Flowchart with Horizontal Auto-Layout
 *
 * This example demonstrates:
 * - Horizontal layout direction (left-to-right flow)
 * - Automatic spacing with custom margins
 * - Mix of manual and automatic positioning (hybrid mode)
 */

import { Artboard, Flowchart, SwissTheme } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  theme: SwissTheme,
  boxModel: { padding: 50 },
});

// Create flowchart with horizontal layout
const flowchart = new Flowchart({
  nodes: [
    {
      id: "init",
      text: "Initialize",
      width: 120,
      height: 60,
      tint: "accent",
    },
    {
      id: "config",
      text: "Load Config",
      width: 130,
      height: 60,
    },
    {
      id: "connect",
      text: "Connect DB",
      width: 130,
      height: 60,
    },
    {
      id: "ready",
      text: "Ready",
      width: 100,
      height: 60,
      tint: "accent",
    },
    {
      id: "error-handler",
      text: "Error Handler",
      width: 140,
      height: 60,
      tint: "#FFE6E6",
    },
  ],
  connections: [
    { from: "init", to: "config" },
    { from: "config", to: "connect" },
    { from: "connect", to: "ready" },
    { from: "config", to: "error-handler", label: "Error" },
    { from: "connect", to: "error-handler", label: "Error" },
  ],
  theme: SwissTheme,

  // Horizontal layout configuration
  layoutDirection: "horizontal", // Left-to-right flow
  nodeSpacing: 70, // Vertical spacing between nodes on same level
  levelSpacing: 120, // Horizontal spacing between levels
  layoutMargin: 100, // Margin around the flowchart
  startPosition: { x: 50, y: 50 },

  // Routing configuration
  minSpacing: 35,
  nodePadding: 25,
  gridSize: 10,
});

artboard.addElement(flowchart);

return artboard.render();
