import {
  Artboard,
  Line,
  Side,
  Angle,
  Text,
  Circle,
} from "w2l";

/**
 * Test the refactored Angle component with new interface.
 * 
 * Demonstrates:
 * 1. Angles at intersection with quadrant selection
 * 2. Angles at vertex between segments with internal/external modes
 * 3. Explicit angle specification
 */

const artboard = new Artboard({ width: 1400, height: 1000 });

// ========================================
// Section 1: Angles at Intersection (Quadrants)
// ========================================

const section1Y = 100;

// Title
const title1 = new Text({
  content: "1. Angles at Intersection (Quadrant Selection)",
  fontSize: 18,
});
title1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title1.topLeft,
  x: 50,
  y: section1Y - 40,
});
artboard.addElement(title1);

// Create two crossing lines
const line1 = new Line({
  start: { x: 150, y: section1Y + 50 },
  end: { x: 350, y: section1Y + 150 },
  style: { stroke: "#333", strokeWidth: "2" },
});

const line2 = new Line({
  start: { x: 150, y: section1Y + 150 },
  end: { x: 350, y: section1Y + 50 },
  style: { stroke: "#333", strokeWidth: "2" },
});

artboard.addElement(line1);
artboard.addElement(line2);

// Mark all 4 quadrants
const angleUR = new Angle({
  from: "intersection",
  lines: [line1, line2],
  quadrant: "upper-right",
  mode: "internal",
  label: "UR",
  radius: 35,
  style: { stroke: "#e74c3c", strokeWidth: "2" },
});

const angleUL = new Angle({
  from: "intersection",
  lines: [line1, line2],
  quadrant: "upper-left",
  mode: "internal",
  label: "UL",
  radius: 35,
  style: { stroke: "#3498db", strokeWidth: "2" },
});

const angleLL = new Angle({
  from: "intersection",
  lines: [line1, line2],
  quadrant: "lower-left",
  mode: "internal",
  label: "LL",
  radius: 35,
  style: { stroke: "#2ecc71", strokeWidth: "2" },
});

const angleLR = new Angle({
  from: "intersection",
  lines: [line1, line2],
  quadrant: "lower-right",
  mode: "internal",
  label: "LR",
  radius: 35,
  style: { stroke: "#f39c12", strokeWidth: "2" },
});

artboard.addElement(angleUR);
artboard.addElement(angleUL);
artboard.addElement(angleLL);
artboard.addElement(angleLR);

// ========================================
// Section 2: Internal vs External at Intersection
// ========================================

const section2Y = section1Y + 250;

// Title
const title2 = new Text({
  content: "2. Internal vs External at Intersection",
  fontSize: 18,
});
title2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title2.topLeft,
  x: 50,
  y: section2Y - 40,
});
artboard.addElement(title2);

// Two lines crossing at a 60° angle
// Line 3: horizontal line
const line3 = new Line({
  start: { x: 100, y: section2Y + 100 },
  end: { x: 400, y: section2Y + 100 },
  style: { stroke: "#333", strokeWidth: "2" },
});

// Line 4: diagonal line crossing through the horizontal line
const line4 = new Line({
  start: { x: 320, y: section2Y + 20 },
  end: { x: 180, y: section2Y + 180 },
  style: { stroke: "#333", strokeWidth: "2" },
});

artboard.addElement(line3);
artboard.addElement(line4);

// Internal angle (acute)
const angleInternal = new Angle({
  from: "intersection",
  lines: [line3, line4],
  quadrant: "upper-right",
  mode: "internal",
  label: "60°",
  radius: 45,
  style: { stroke: "#9b59b6", strokeWidth: "2" },
});

// External angle (reflex)
const angleExternal = new Angle({
  from: "intersection",
  lines: [line3, line4],
  quadrant: "upper-right",
  mode: "external",
  label: "300°",
  radius: 60,
  style: { stroke: "#e67e22", strokeWidth: "2", strokeDasharray: "5,5" },
});

artboard.addElement(angleInternal);
artboard.addElement(angleExternal);

// ========================================
// Section 3: Angles at Vertex (Segments)
// ========================================

const section3Y = 100;
const section3X = 500;

// Title
const title3 = new Text({
  content: "3. Angles at Vertex (Segments)",
  fontSize: 18,
});
title3.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title3.topLeft,
  x: section3X,
  y: section3Y - 40,
});
artboard.addElement(title3);

// Create two segments meeting at a vertex
const vertexA = { x: section3X + 150, y: section3Y + 100 };
const pointB = { x: section3X + 250, y: section3Y + 50 };
const pointC = { x: section3X + 280, y: section3Y + 150 };

const lineAB = new Line({
  start: vertexA,
  end: pointB,
  style: { stroke: "#333", strokeWidth: "2" },
});

const lineAC = new Line({
  start: vertexA,
  end: pointC,
  style: { stroke: "#333", strokeWidth: "2" },
});

// Create Side instances for angle calculations
const segmentAB = new Side({ start: vertexA, end: pointB });
const segmentAC = new Side({ start: vertexA, end: pointC });

artboard.addElement(lineAB);
artboard.addElement(lineAC);

// Mark vertex
artboard.addElement(
  new Circle({
    center: vertexA,
    radius: 4,
    style: { fill: "#e74c3c", stroke: "none" },
  })
);

// Internal angle
const angleVertexInternal = new Angle({
  from: "vertex",
  segments: [segmentAB, segmentAC],
  mode: "internal",
  label: "α",
  radius: 40,
  style: { stroke: "#e74c3c", strokeWidth: "2" },
});

// External angle
const angleVertexExternal = new Angle({
  from: "vertex",
  segments: [segmentAB, segmentAC],
  mode: "external",
  label: "β",
  radius: 55,
  style: { stroke: "#3498db", strokeWidth: "2", strokeDasharray: "5,5" },
});

artboard.addElement(angleVertexInternal);
artboard.addElement(angleVertexExternal);

// ========================================
// Section 4: Right Angle Detection
// ========================================

const section4Y = section3Y + 250;
const section4X = section3X;

// Title
const title4 = new Text({
  content: "4. Right Angle Markers",
  fontSize: 18,
});
title4.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title4.topLeft,
  x: section4X,
  y: section4Y - 40,
});
artboard.addElement(title4);

// Create perpendicular segments
const vertexD = { x: section4X + 150, y: section4Y + 100 };
const pointE = { x: section4X + 250, y: section4Y + 100 };
const pointF = { x: section4X + 150, y: section4Y + 0 };

const lineDE = new Line({
  start: vertexD,
  end: pointE,
  style: { stroke: "#333", strokeWidth: "2" },
});

const lineDF = new Line({
  start: vertexD,
  end: pointF,
  style: { stroke: "#333", strokeWidth: "2" },
});

// Create Side instances for angle calculations
const segmentDE = new Side({ start: vertexD, end: pointE });
const segmentDF = new Side({ start: vertexD, end: pointF });

artboard.addElement(lineDE);
artboard.addElement(lineDF);

// Square marker (default)
const rightAngleSquare = new Angle({
  from: "vertex",
  segments: [segmentDE, segmentDF],
  mode: "internal",
  rightAngleMarker: "square",
  radius: 30,
  style: { stroke: "#2ecc71", strokeWidth: "2" },
});

artboard.addElement(rightAngleSquare);

// Label for right angle
const label1 = new Text({
  content: "90° (square)",
  fontSize: 12,
});
label1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: label1.topLeft,
  x: section4X + 120,
  y: section4Y + 120,
});
artboard.addElement(label1);

// Dot marker
const vertexG = { x: section4X + 150, y: section4Y + 200 };
const pointH = { x: section4X + 250, y: section4Y + 200 };
const pointI = { x: section4X + 150, y: section4Y + 100 };

const lineGH = new Line({
  start: vertexG,
  end: pointH,
  style: { stroke: "#333", strokeWidth: "2" },
});

const lineGI = new Line({
  start: vertexG,
  end: pointI,
  style: { stroke: "#333", strokeWidth: "2" },
});

// Create Side instances for angle calculations
const segmentGH = new Side({ start: vertexG, end: pointH });
const segmentGI = new Side({ start: vertexG, end: pointI });

artboard.addElement(lineGH);
artboard.addElement(lineGI);

const rightAngleDot = new Angle({
  from: "vertex",
  segments: [segmentGH, segmentGI],
  mode: "internal",
  rightAngleMarker: "dot",
  radius: 30,
  style: { stroke: "#9b59b6", strokeWidth: "2" },
});

artboard.addElement(rightAngleDot);

// Label for dot marker
const label2 = new Text({
  content: "90° (dot)",
  fontSize: 12,
});
label2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: label2.topLeft,
  x: section4X + 120,
  y: section4Y + 220,
});
artboard.addElement(label2);

// ========================================
// Section 5: Explicit Angle Specification
// ========================================

const section5Y = 100;
const section5X = 950;

// Title
const title5 = new Text({
  content: "5. Explicit Angles",
  fontSize: 18,
});
title5.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title5.topLeft,
  x: section5X,
  y: section5Y - 40,
});
artboard.addElement(title5);

// Various explicit angles
const explicitAngles = [
  { start: 0, end: 45, label: "45°", y: 0, color: "#e74c3c" },
  { start: 0, end: 90, label: "90°", y: 100, color: "#3498db" },
  { start: 0, end: 135, label: "135°", y: 200, color: "#2ecc71" },
  { start: 0, end: 270, label: "270°", y: 300, color: "#f39c12" },
];

explicitAngles.forEach((spec, i) => {
  const centerX = section5X + 120;
  const centerY = section5Y + spec.y + 50;

  // Mark center
  artboard.addElement(
    new Circle({
      center: { x: centerX, y: centerY },
      radius: 3,
      style: { fill: spec.color, stroke: "none" },
    })
  );

  // Draw angle
  const angle = new Angle({
    vertex: { x: centerX, y: centerY },
    startAngle: spec.start,
    endAngle: spec.end,
    label: spec.label,
    radius: 40,
    style: { stroke: spec.color, strokeWidth: "2" },
  });

  artboard.addElement(angle);
});

// Full circle (360°)
const fullCircleVertex = { x: section5X + 120, y: section5Y + 480 };

artboard.addElement(
  new Circle({
    center: fullCircleVertex,
    radius: 3,
    style: { fill: "#9b59b6", stroke: "none" },
  })
);

const fullCircle = new Angle({
  vertex: fullCircleVertex,
  startAngle: 0,
  endAngle: 360,
  label: "360°",
  radius: 40,
  labelDistance: 0,
  style: { stroke: "#9b59b6", strokeWidth: "2" },
});

artboard.addElement(fullCircle);

// ========================================
// Summary
// ========================================

const summaryTitle = new Text({
  content: "Refactored Angle API:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});
summaryTitle.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryTitle.topLeft,
  x: 50,
  y: 750,
});
artboard.addElement(summaryTitle);

const summaryLine1 = new Text({
  content: "• Intersection: quadrant selection (upper-right, upper-left, lower-left, lower-right)",
  fontSize: 12,
});
summaryLine1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine1.topLeft,
  x: 70,
  y: 780,
});
artboard.addElement(summaryLine1);

const summaryLine2 = new Text({
  content: "• Vertex: automatic shared vertex detection with internal/external modes",
  fontSize: 12,
});
summaryLine2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine2.topLeft,
  x: 70,
  y: 800,
});
artboard.addElement(summaryLine2);

const summaryLine3 = new Text({
  content: "• Explicit: manual vertex and angle specification for full control",
  fontSize: 12,
});
summaryLine3.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine3.topLeft,
  x: 70,
  y: 820,
});
artboard.addElement(summaryLine3);

return artboard.render();

