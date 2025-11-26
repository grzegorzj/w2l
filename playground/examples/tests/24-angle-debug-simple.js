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
const line1Start = { x: 120, y: 350 };
const line1End = { x: 500, y: 390 };

const line2Start = { x: 310, y: 150 };
const line2End = { x: 350, y: 420 };
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

  // Top-right angle: (+,+)
  const anglePP = new Angle({
    between: [line1, line2],
    ray1: "+",
    ray2: "+",
    radius: 50,
    label: "(+,+)",
    labelFontSize: 14,
    style: { stroke: "#e74c3c", strokeWidth: "2" },
    debug: true,
  });
  artboard.addElement(anglePP);
}

// Legend
const legend = new Text({
  content:
    "Ray Selection: (+,+)=top-right  (-,+)=top-left  (-,-)=bottom-left  (+,-)=bottom-right",
  fontSize: 13,
});
legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 520,
});
artboard.addElement(legend);

const debugLegend = new Text({
  content: "Debug: 🔴 Arc start  🔵 Arc end  🟢 Bisector",
  fontSize: 12,
  style: { fill: "#666" },
});
debugLegend.position({
  relativeFrom: debugLegend.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 540,
});
artboard.addElement(debugLegend);

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
