/**
 * Demonstration of using altitude and diagonal positioning accessors
 * Shows how to position elements using the center, foot, and other properties
 */

import {
  Artboard,
  Quadrilateral,
  Rect,
  Circle,
  Text,
} from "w2l";

const artboard = new Artboard({
  width: 1400,
  height: 800,
  title: "Quadrilateral Positioning with Altitudes & Diagonals",
});

// Example 1: Rectangle with markers at diagonal intersection and centers
const rect = new Rect({
  width: 200,
  height: 140,
  style: {
    fill: "none",
    stroke: "blue",
    strokeWidth: 2,
  },
});

rect.position({
  relativeTo: { x: 200, y: 200 },
  relativeFrom: rect.center,
  x: 0,
  y: 0,
});

artboard.add(rect);

// Draw diagonals
const rectDiagonals = rect.getDiagonals();
rectDiagonals.forEach((diag) => artboard.add(diag.line));

// Place circles at diagonal endpoints
[rectDiagonals[0].start, rectDiagonals[0].end, rectDiagonals[1].start, rectDiagonals[1].end].forEach((pos, i) => {
  const marker = new Circle({
    radius: 5,
    style: { fill: "blue" },
  });
  marker.position({
    relativeTo: pos,
    relativeFrom: marker.center,
    x: 0,
    y: 0,
  });
  artboard.add(marker);
});

// Place a marker at the diagonal intersection (should be the rectangle center)
const centerMarker = new Circle({
  radius: 7,
  style: { fill: "red" },
});
centerMarker.position({
  relativeTo: rectDiagonals[0].center,
  relativeFrom: centerMarker.center,
  x: 0,
  y: 0,
});
artboard.add(centerMarker);

const centerLabel = new Text({
  content: "Diagonals meet at center",
  fontSize: 12,
  style: { fill: "red" },
});
centerLabel.position({
  relativeTo: rectDiagonals[0].center,
  relativeFrom: centerLabel.center,
  x: 0,
  y: 20,
});
artboard.add(centerLabel);

// Add title
const rectTitle = new Text({
  content: "Rectangle: Diagonal Centers & Endpoints",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
rectTitle.position({
  relativeTo: rect.center,
  relativeFrom: rectTitle.center,
  x: 0,
  y: -100,
});
artboard.add(rectTitle);

// Example 2: Parallelogram with altitude feet marked
const para = new Quadrilateral({
  type: "parallelogram",
  a: 180,
  b: 90,
  angle: 65,
  style: {
    fill: "none",
    stroke: "green",
    strokeWidth: 2,
  },
});

para.position({
  relativeTo: { x: 600, y: 200 },
  relativeFrom: para.center,
  x: 0,
  y: 0,
});

artboard.add(para);

// Draw some altitudes
const paraAltitudes = para.getAltitudes();

// Draw altitude from vertex 0
artboard.add(paraAltitudes[0].line);

// Mark the foot of the altitude
const footMarker = new Circle({
  radius: 5,
  style: { fill: "orange" },
});
footMarker.position({
  relativeTo: paraAltitudes[0].foot,
  relativeFrom: footMarker.center,
  x: 0,
  y: 0,
});
artboard.add(footMarker);

// Mark the origin (vertex)
const originMarker = new Circle({
  radius: 5,
  style: { fill: "green" },
});
originMarker.position({
  relativeTo: paraAltitudes[0].origin,
  relativeFrom: originMarker.center,
  x: 0,
  y: 0,
});
artboard.add(originMarker);

// Label the altitude
const altitudeLabel = new Text({
  content: `h = ${paraAltitudes[0].height.toFixed(1)}px`,
  fontSize: 12,
  style: { fill: "orange", fontWeight: "bold" },
});
altitudeLabel.position({
  relativeTo: {
    x: (paraAltitudes[0].origin.x + paraAltitudes[0].foot.x) / 2,
    y: (paraAltitudes[0].origin.y + paraAltitudes[0].foot.y) / 2,
  },
  relativeFrom: altitudeLabel.center,
  x: -20,
  y: 0,
});
artboard.add(altitudeLabel);

// Add title
const paraTitle = new Text({
  content: "Parallelogram: Altitude with Foot & Origin Markers",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
paraTitle.position({
  relativeTo: para.center,
  relativeFrom: paraTitle.center,
  x: 0,
  y: -80,
});
artboard.add(paraTitle);

// Example 3: Rhombus with perpendicular diagonals marked
const rhombus = new Quadrilateral({
  type: "rhombus",
  a: 120,
  angle: 65,
  style: {
    fill: "none",
    stroke: "purple",
    strokeWidth: 2,
  },
});

rhombus.position({
  relativeTo: { x: 1050, y: 200 },
  relativeFrom: rhombus.center,
  x: 0,
  y: 0,
});

artboard.add(rhombus);

// Draw diagonals
const rhombusDiags = rhombus.getDiagonals();
rhombusDiags.forEach((diag) => artboard.add(diag.line));

// Mark the center where diagonals intersect (should be perpendicular)
const rhombusCenterMarker = new Circle({
  radius: 6,
  style: { fill: "purple" },
});
rhombusCenterMarker.position({
  relativeTo: rhombusDiags[0].center,
  relativeFrom: rhombusCenterMarker.center,
  x: 0,
  y: 0,
});
artboard.add(rhombusCenterMarker);

// Display the angles of the diagonals to verify perpendicularity
const diag1Angle = rhombusDiags[0].angle;
const diag2Angle = rhombusDiags[1].angle;
const angleDiff = Math.abs(diag1Angle - diag2Angle);
const isPerpendicular = Math.abs(angleDiff - 90) < 1 || Math.abs(angleDiff - 270) < 1;

const perpendicularLabel = new Text({
  content: `Diagonals: ${isPerpendicular ? "⊥ Perpendicular!" : "Not perpendicular"}`,
  fontSize: 12,
  style: { fill: "purple", fontWeight: "bold" },
});
perpendicularLabel.position({
  relativeTo: rhombusDiags[0].center,
  relativeFrom: perpendicularLabel.center,
  x: 0,
  y: 25,
});
artboard.add(perpendicularLabel);

// Add title
const rhombusTitle = new Text({
  content: "Rhombus: Perpendicular Diagonals",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
rhombusTitle.position({
  relativeTo: rhombus.center,
  relativeFrom: rhombusTitle.center,
  x: 0,
  y: -90,
});
artboard.add(rhombusTitle);

// Example 4: Trapezoid with all altitudes marked
const trapezoid = new Quadrilateral({
  type: "trapezoid",
  a: 200, // bottom base
  b: 120, // top base
  angle: 100, // height
  style: {
    fill: "none",
    stroke: "teal",
    strokeWidth: 2,
  },
});

trapezoid.position({
  relativeTo: { x: 350, y: 550 },
  relativeFrom: trapezoid.center,
  x: 0,
  y: 0,
});

artboard.add(trapezoid);

// Draw altitudes and mark their feet
const trapAltitudes = trapezoid.getAltitudes();

// Draw the altitudes (trapezoids now return only 2 altitudes - from top base to bottom base)
trapAltitudes.forEach((alt) => {
  artboard.add(alt.line);
  
  // Mark the foot
  const foot = new Circle({
    radius: 4,
    style: { fill: "orange" },
  });
  foot.position({
    relativeTo: alt.foot,
    relativeFrom: foot.center,
    x: 0,
    y: 0,
  });
  artboard.add(foot);
  
  // Mark the origin
  const origin = new Circle({
    radius: 4,
    style: { fill: "teal" },
  });
  origin.position({
    relativeTo: alt.origin,
    relativeFrom: origin.center,
    x: 0,
    y: 0,
  });
  artboard.add(origin);
});

// Add height label (use first altitude)
const heightLabel = new Text({
  content: `Height: ${trapAltitudes[0].height.toFixed(1)}px`,
  fontSize: 13,
  style: { fill: "teal", fontWeight: "bold" },
});
heightLabel.position({
  relativeTo: {
    x: (trapAltitudes[0].origin.x + trapAltitudes[0].foot.x) / 2,
    y: (trapAltitudes[0].origin.y + trapAltitudes[0].foot.y) / 2,
  },
  relativeFrom: heightLabel.center,
  x: -40,
  y: 0,
});
artboard.add(heightLabel);

// Add title
const trapTitle = new Text({
  content: "Trapezoid: Altitudes from Top Vertices",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
trapTitle.position({
  relativeTo: trapezoid.center,
  relativeFrom: trapTitle.center,
  x: 0,
  y: -90,
});
artboard.add(trapTitle);

// Example 5: Custom positioning using diagonal centers
const square = new Rect({
  width: 150,
  height: 150,
  style: {
    fill: "none",
    stroke: "darkblue",
    strokeWidth: 2,
  },
});

square.position({
  relativeTo: { x: 950, y: 550 },
  relativeFrom: square.center,
  x: 0,
  y: 0,
});

artboard.add(square);

// Draw diagonals
const squareDiags = square.getDiagonals();
squareDiags.forEach((diag) => artboard.add(diag.line));

// Place text at each diagonal center (should overlap at square center)
const diag1Label = new Text({
  content: "D1",
  fontSize: 12,
  style: { fill: "darkblue", fontWeight: "bold" },
});
diag1Label.position({
  relativeTo: squareDiags[0].center,
  relativeFrom: diag1Label.center,
  x: -15,
  y: 0,
});
artboard.add(diag1Label);

const diag2Label = new Text({
  content: "D2",
  fontSize: 12,
  style: { fill: "darkblue", fontWeight: "bold" },
});
diag2Label.position({
  relativeTo: squareDiags[1].center,
  relativeFrom: diag2Label.center,
  x: 15,
  y: 0,
});
artboard.add(diag2Label);

// Verify they're at the same position
const centerText = new Text({
  content: `Both at: (${squareDiags[0].center.x.toFixed(0)}, ${squareDiags[0].center.y.toFixed(0)})`,
  fontSize: 11,
  style: { fill: "darkblue" },
});
centerText.position({
  relativeTo: squareDiags[0].center,
  relativeFrom: centerText.center,
  x: 0,
  y: 20,
});
artboard.add(centerText);

// Add title
const squareTitle = new Text({
  content: "Square: Diagonal Centers Coincide",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
squareTitle.position({
  relativeTo: square.center,
  relativeFrom: squareTitle.center,
  x: 0,
  y: -100,
});
artboard.add(squareTitle);

// Add main title
const mainTitle = new Text({
  content: "Positioning with Altitude & Diagonal Accessors",
  fontSize: 24,
  style: { fontWeight: "bold" },
});
mainTitle.position({
  relativeTo: { x: 700, y: 40 },
  relativeFrom: mainTitle.center,
  x: 0,
  y: 0,
});
artboard.add(mainTitle);

const subtitle = new Text({
  content: "All altitude and diagonal properties expose correct positions through center, foot, origin accessors",
  fontSize: 14,
  style: { fill: "#666" },
});
subtitle.position({
  relativeTo: { x: 700, y: 70 },
  relativeFrom: subtitle.center,
  x: 0,
  y: 0,
});
artboard.add(subtitle);

return artboard.render();

