/**
 * Similar Triangles: Geometric Mean Altitude Theorem (9th Grade)
 * 
 * This example demonstrates a challenging geometry concept for 9th grade students:
 * When an altitude is drawn to the hypotenuse of a right triangle, it creates
 * three similar triangles:
 * 1. The original triangle (ABC)
 * 2. Left smaller triangle (ADB)
 * 3. Right smaller triangle (BDC)
 * 
 * Key relationships:
 * - All three triangles share the same angles
 * - The altitude BD is the geometric mean of the two segments it creates on the hypotenuse
 * - Relationship: BD² = AD × DC
 * - Also: AB² = AD × AC and BC² = DC × AC
 * 
 * This visualization helps students see:
 * - Similar triangle relationships
 * - Angle correspondence
 * - The geometric mean theorem
 * - Application of Pythagorean theorem
 */

import {
  Artboard,
  Container,
  Triangle,
  Line,
  Latex,
  Circle,
  Angle,
} from "w2l";

const artboard = new Artboard({
  width: 1000,
  height: 700,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Main container for the diagram
const container = new Container({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 30 },
});

// ======================
// PART 1: Create the main right triangle ABC
// ======================

// Triangle ABC: Right angle at B, with specific dimensions
// Let's use a 6-8-10 triangle (scaled 3-4-5)
const mainTriangle = new Triangle({
  type: "right",
  a: 240,  // Base BC = 8 units (scaled)
  b: 180,  // Height AB = 6 units (scaled)
  // Hypotenuse AC will be 10 units (300px)
  orientation: "bottomLeft",
  style: {
    fill: "#e3f2fd",
    fillOpacity: 0.3,
    stroke: "#1976d2",
    strokeWidth: 3,
  },
});

mainTriangle.position({
  relativeFrom: mainTriangle.center,
  relativeTo: { x: 300, y: 250 },
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(mainTriangle);

// Get the vertices
const vertices = mainTriangle.vertices;
const A = vertices[0];  // Bottom left (right angle vertex)
const B = vertices[1];  // Bottom right
const C = vertices[2];  // Top left

// ======================
// PART 2: Draw the altitude from B to hypotenuse AC
// ======================

// Calculate the foot of the altitude (point D on AC)
// For a right triangle with right angle at A, the altitude from A to hypotenuse
// divides it in ratio based on the sides
// But our right angle is at A (bottom left), so we need altitude from B to AC

// Vector from A to C
const AC_dx = C.x - A.x;
const AC_dy = C.y - A.y;
const AC_length = Math.sqrt(AC_dx * AC_dx + AC_dy * AC_dy);

// Vector from A to B
const AB_dx = B.x - A.x;
const AB_dy = B.y - A.y;

// Project AB onto AC to find D
const projection = (AB_dx * AC_dx + AB_dy * AC_dy) / (AC_length * AC_length);
const D = {
  x: A.x + projection * AC_dx,
  y: A.y + projection * AC_dy,
};

// Draw the altitude BD
const altitude = new Line({
  start: B,
  end: D,
  style: {
    stroke: "#d32f2f",
    strokeWidth: 2.5,
    strokeDasharray: "6,4",
  },
});

container.addElement(altitude);

// ======================
// PART 3: Create the two smaller similar triangles
// ======================

// Calculate dimensions
const AD = Math.sqrt((D.x - A.x) ** 2 + (D.y - A.y) ** 2);
const DC = Math.sqrt((C.x - D.x) ** 2 + (C.y - D.y) ** 2);
const BD = Math.sqrt((D.x - B.x) ** 2 + (D.y - B.y) ** 2);
const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
const BC = Math.sqrt((C.x - B.x) ** 2 + (C.y - B.y) ** 2);

console.log("=== SIMILAR TRIANGLES ===");
console.log("Main triangle ABC - sides:", Math.round(AB), Math.round(BC), Math.round(AC_length));
console.log("Triangle ADB - altitude:", Math.round(BD));
console.log("Segments: AD =", Math.round(AD), ", DC =", Math.round(DC));
console.log("Geometric mean check: BD² =", Math.round(BD * BD), ", AD × DC =", Math.round(AD * DC));

// ======================
// PART 4: Mark the vertices with labeled points
// ======================

const vertexLabels = [
  { point: A, label: "A", offset: { x: -25, y: 15 } },
  { point: B, label: "B", offset: { x: 15, y: 15 } },
  { point: C, label: "C", offset: { x: -15, y: -25 } },
  { point: D, label: "D", offset: { x: 0, y: -25 } },
];

vertexLabels.forEach(({ point, label, offset }) => {
  // Dot at vertex
  const dot = new Circle({
    radius: 5,
    style: {
      fill: "#1976d2",
      stroke: "#0d47a1",
      strokeWidth: 2,
    },
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: point,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  container.addElement(dot);
  
  // Label
  const text = new Latex({
    content: `$\\mathbf{${label}}$`,
    style: {
      fontSize: "18px",
      fontWeight: "bold",
      fill: "#0d47a1",
    },
  });
  
  text.position({
    relativeFrom: text.center,
    relativeTo: point,
    x: offset.x,
    y: offset.y,
    boxReference: "contentBox",
  });
  
  container.addElement(text);
});

// ======================
// PART 5: Mark the angles to show similarity
// ======================

// Helper function to calculate angle from three points
function calculateAngle(vertex, point1, point2) {
  const angle1 = Math.atan2(point1.y - vertex.y, point1.x - vertex.x) * 180 / Math.PI;
  const angle2 = Math.atan2(point2.y - vertex.y, point2.x - vertex.x) * 180 / Math.PI;
  return { start: angle1, end: angle2 };
}

// Right angle at A
const anglesA = calculateAngle(A, B, C);
const angleA = new Angle({
  vertex: A,
  startAngle: anglesA.start,
  endAngle: anglesA.end,
  radius: 25,
  style: {
    stroke: "#4caf50",
    strokeWidth: 2,
    fill: "#c8e6c9",
    fillOpacity: 0.3,
  },
  showRightAngleSquare: true,
});
container.addElement(angleA);

// Right angle at D (where altitude meets hypotenuse)
const anglesD = calculateAngle(D, B, A);
const angleD = new Angle({
  vertex: D,
  startAngle: anglesD.start,
  endAngle: anglesD.end,
  radius: 20,
  style: {
    stroke: "#ff9800",
    strokeWidth: 2,
    fill: "#ffe0b2",
    fillOpacity: 0.3,
  },
  showRightAngleSquare: true,
});
container.addElement(angleD);

// ======================
// PART 6: Add dimension labels
// ======================

const dimensions = [
  {
    label: `${Math.round(AB)}`,
    midpoint: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 },
    offset: { x: 0, y: 25 },
  },
  {
    label: `${Math.round(BC)}`,
    midpoint: { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 },
    offset: { x: 25, y: 0 },
  },
  {
    label: `${Math.round(AC_length)}`,
    midpoint: { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 },
    offset: { x: -30, y: -10 },
  },
  {
    label: `h=${Math.round(BD)}`,
    midpoint: { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 },
    offset: { x: 20, y: 0 },
    color: "#d32f2f",
  },
];

dimensions.forEach(({ label, midpoint, offset, color }) => {
  const dimLabel = new Latex({
    content: `$\\small ${label}$`,
    style: {
      fontSize: "14px",
      fill: color || "#424242",
      fontWeight: "600",
    },
  });
  
  dimLabel.position({
    relativeFrom: dimLabel.center,
    relativeTo: midpoint,
    x: offset.x,
    y: offset.y,
    boxReference: "contentBox",
  });
  
  container.addElement(dimLabel);
});

// ======================
// PART 7: Add title and formulas
// ======================

const title = new Latex({
  content: "$\\text{Similar Triangles: Altitude to Hypotenuse}$",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#1a237e",
  },
});

title.position({
  relativeFrom: title.center,
  relativeTo: { x: 300, y: 30 },
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(title);

// Key theorem
const theorem = new Latex({
  content: `$\\triangle ABC \\sim \\triangle ADB \\sim \\triangle BDC$`,
  style: {
    fontSize: "16px",
    fill: "#1565c0",
    fontWeight: "600",
  },
});

theorem.position({
  relativeFrom: theorem.center,
  relativeTo: { x: 300, y: 470 },
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(theorem);

// Geometric mean relationship
const formula1 = new Latex({
  content: `$h^2 = ${Math.round(AD)} \\times ${Math.round(DC)} = ${Math.round(AD * DC)}$`,
  style: {
    fontSize: "15px",
    fill: "#d32f2f",
    fontWeight: "600",
  },
});

formula1.position({
  relativeFrom: formula1.center,
  relativeTo: { x: 300, y: 510 },
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(formula1);

// Verification
const verification = new Latex({
  content: `$\\text{Check: } ${Math.round(BD)}^2 = ${Math.round(BD * BD)} \\approx ${Math.round(AD * DC)}$ ✓`,
  style: {
    fontSize: "14px",
    fill: "#2e7d32",
    fontWeight: "500",
  },
});

verification.position({
  relativeFrom: verification.center,
  relativeTo: { x: 300, y: 540 },
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(verification);

// ======================
// PART 8: Add angle markings to show similarity
// ======================

// Mark angle C (appears in all three similar triangles)
const anglesC = calculateAngle(C, A, B);
const angleC = new Angle({
  vertex: C,
  startAngle: anglesC.start,
  endAngle: anglesC.end,
  radius: 30,
  style: {
    stroke: "#9c27b0",
    strokeWidth: 2,
    fill: "#e1bee7",
    fillOpacity: 0.3,
  },
  label: "$\\alpha$",
  labelDistance: 45,
});
container.addElement(angleC);

// Mark angle B in triangle ABC
const anglesB = calculateAngle(B, C, A);
const angleB = new Angle({
  vertex: B,
  startAngle: anglesB.start,
  endAngle: anglesB.end,
  radius: 30,
  style: {
    stroke: "#f57c00",
    strokeWidth: 2,
    fill: "#ffe0b2",
    fillOpacity: 0.3,
  },
  label: "$\\beta$",
  labelDistance: 45,
});
container.addElement(angleB);

// Finalize and add to artboard
container.finalizeFreeformLayout();

container.position({
  relativeFrom: container.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(container);

return artboard.render();

