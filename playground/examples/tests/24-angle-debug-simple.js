/**
 * Test: Simple Angle Debug
 * 
 * Minimal example with two crossing lines and angle markers.
 * Adjust the line coordinates below to test different configurations.
 */

import { Artboard, Line, Angle, Text, Circle } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
  style: { fill: "#ffffff" },
  boxModel: { padding: 40 },
});

// ==========================================
// ADJUST THESE PARAMETERS TO TEST
// ==========================================
const line1Start = { x: 100, y: 300 };
const line1End = { x: 500, y: 300 };

const line2Start = { x: 300, y: 150 };
const line2End = { x: 300, y: 450 };
// ==========================================

// Title
const title = new Text({
  content: "Angle Debug - Two Crossing Lines",
  fontSize: 20,
  fontWeight: "bold",
});
title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(title);

// Create the two lines
const line1 = new Line({
  start: line1Start,
  end: line1End,
  style: { stroke: "#3498db", strokeWidth: "3" },
});

const line2 = new Line({
  start: line2Start,
  end: line2End,
  style: { stroke: "#e74c3c", strokeWidth: "3" },
});

artboard.addElement(line1);
artboard.addElement(line2);

// Find and mark the intersection point
const intersections = line1.getIntersections(line2, true);
if (intersections.length > 0) {
  const intersection = intersections[0];
  
  const marker = new Circle({
    radius: 5,
    style: { fill: "#000000", stroke: "none" },
  });
  artboard.addElement(marker);
  marker.position({
    relativeTo: intersection,
    relativeFrom: marker.center,
    x: 0,
    y: 0,
  });

  // Draw INWARD angle (smaller, < 180°)
  const angleInward = new Angle({
    between: [line1, line2],
    type: 'inward',
    radius: 50,
    label: "inward",
    labelFontSize: 14,
    style: { stroke: "#2ecc71", strokeWidth: "2" },
    debug: true, // Show start/end points
  });
  artboard.addElement(angleInward);

  // Draw OUTWARD angle (larger, > 180°)
  const angleOutward = new Angle({
    between: [line1, line2],
    type: 'outward',
    radius: 70,
    label: "outward",
    labelFontSize: 14,
    style: { stroke: "#9b59b6", strokeWidth: "2", strokeDasharray: "5,5" },
    debug: true, // Show start/end points
  });
  artboard.addElement(angleOutward);
}

// Legend
const legend = new Text({
  content: "🔵 Blue line  🔴 Red line  ⚫ Intersection  🟢 Inward (<180°)  🟣 Outward (>180°)  🔴 Arc start  🔵 Arc end",
  fontSize: 14,
});
legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 520,
});
artboard.addElement(legend);

// Info box showing coordinates
const info = new Text({
  content: `Line1: (${line1Start.x},${line1Start.y}) → (${line1End.x},${line1End.y})
Line2: (${line2Start.x},${line2Start.y}) → (${line2End.x},${line2End.y})`,
  fontSize: 12,
  fontFamily: "monospace",
  style: { fill: "#666" },
});
info.position({
  relativeFrom: info.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 550,
  y: 50,
});
artboard.addElement(info);

return artboard.render();
