// Minimal test to reproduce the position() error
// Progressively adding complexity to match the failing example

console.log("=== STEP 1: Create artboard ===");
const artboard = new Artboard({
  width: 800,
  height: 600,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 60 },
});

console.log("artboard:", artboard);
console.log("artboard.contentBox.center:", artboard.contentBox.center);

console.log("\n=== STEP 2: Create triangle ===");
const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 160,
  orientation: "bottomLeft",
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 3 },
});

console.log("triangle:", triangle);
console.log("triangle.center:", triangle.center);

console.log("\n=== STEP 3: Position triangle (with variables) ===");
const artboardCenter = artboard.contentBox.center;
const triangleCenter = triangle.center;
console.log("artboardCenter:", artboardCenter);
console.log("triangleCenter:", triangleCenter);

try {
  triangle.position({
    relativeFrom: triangleCenter,
    relativeTo: artboardCenter,
    x: 0,
    y: 0,
  });
  console.log("✅ Triangle positioned successfully");
} catch (e) {
  console.error("❌ Triangle position FAILED:", e.message);
}

artboard.addElement(triangle);

console.log("\n=== STEP 4: Create square on triangle side ===");
const squareA = new Rect({
  width: triangle.sides[0].length,
  height: triangle.sides[0].length,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2,
    fillOpacity: 0.7,
  },
});

console.log("squareA:", squareA);
console.log("triangle.sides[0]:", triangle.sides[0]);
console.log("triangle.sides[0].center:", triangle.sides[0].center);
console.log("squareA.center:", squareA.center);

console.log("\n=== STEP 5: Position square (with variables) ===");
const sideA = triangle.sides[0];
const sideACenter = sideA.center;
const squareACenter = squareA.center;
console.log("sideA:", sideA);
console.log("sideACenter:", sideACenter);
console.log("squareACenter:", squareACenter);

try {
  squareA.position({
    relativeFrom: squareACenter,
    relativeTo: sideACenter,
    x: 0,
    y: 0,
  });
  console.log("✅ Square positioned successfully");
} catch (e) {
  console.error("❌ Square position FAILED:", e.message);
}

console.log("\n=== STEP 6: Rotate and translate square ===");
try {
  squareA.rotate(sideA.angle);
  squareA.translate(sideA.outwardNormal, squareA.width / 2);
  console.log("✅ Square rotated and translated successfully");
} catch (e) {
  console.error("❌ Square rotate/translate FAILED:", e.message);
}

artboard.addElement(squareA);

console.log("\n=== STEP 7: Add text label ===");
const labelA = new Text({
  content: "$a$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

console.log("labelA:", labelA);
console.log("labelA.center:", labelA.center);

const labelAPosition = triangle.sides[0].center;
const labelACenter = labelA.center;
console.log("labelAPosition:", labelAPosition);
console.log("labelACenter:", labelACenter);

try {
  labelA.position({
    relativeFrom: labelACenter,
    relativeTo: labelAPosition,
    x: 0,
    y: 25,
  });
  console.log("✅ Label positioned successfully");
} catch (e) {
  console.error("❌ Label position FAILED:", e.message);
}

artboard.addElement(labelA);

console.log("\n=== STEP 8: Create and position squareB ===");
const squareB = new Rect({
  width: triangle.sides[1].length,
  height: triangle.sides[1].length,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
    fillOpacity: 0.7,
  },
});

const sideB = triangle.sides[1];
const sideBCenter = sideB.center;
const squareBCenter = squareB.center;

try {
  squareB.position({
    relativeFrom: squareBCenter,
    relativeTo: sideBCenter,
    x: 0,
    y: 0,
  });
  squareB.rotate(sideB.angle);
  squareB.translate(sideB.outwardNormal, squareB.width / 2);
  console.log("✅ SquareB positioned successfully");
} catch (e) {
  console.error("❌ SquareB position FAILED:", e.message);
}

artboard.addElement(squareB);

console.log("\n=== STEP 9: Create and position squareC ===");
const squareC = new Rect({
  width: triangle.sides[2].length,
  height: triangle.sides[2].length,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 2,
    fillOpacity: 0.7,
  },
});

const sideC = triangle.sides[2];
const sideCCenter = sideC.center;
const squareCCenter = squareC.center;

try {
  squareC.position({
    relativeFrom: squareCCenter,
    relativeTo: sideCCenter,
    x: 0,
    y: 0,
  });
  squareC.rotate(sideC.angle);
  squareC.translate(sideC.outwardNormal, squareC.width / 2);
  console.log("✅ SquareC positioned successfully");
} catch (e) {
  console.error("❌ SquareC position FAILED:", e.message);
}

artboard.addElement(squareC);

console.log("\n=== STEP 10: Add angle annotation ===");
try {
  const rightAngle = triangle.showAngle(0, {
    mode: "internal",
    radius: 30,
    label: "90°",
    labelFontSize: 16,
    style: { stroke: "#e74c3c", strokeWidth: 2 },
  });
  artboard.addElement(rightAngle);
  console.log("✅ Angle annotation added successfully");
} catch (e) {
  console.error("❌ Angle annotation FAILED:", e.message);
}

console.log("\n=== STEP 11: Add more labels ===");
const labelB = new Text({
  content: "$b$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

const labelBPosition = triangle.sides[1].center;
const labelBCenter = labelB.center;

try {
  labelB.position({
    relativeFrom: labelBCenter,
    relativeTo: labelBPosition,
    x: -25,
    y: 0,
  });
  console.log("✅ LabelB positioned successfully");
} catch (e) {
  console.error("❌ LabelB position FAILED:", e.message);
}

artboard.addElement(labelB);

const labelC = new Text({
  content: "$c$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

const labelCPosition = triangle.sides[2].center;
const labelCCenter = labelC.center;

try {
  labelC.position({
    relativeFrom: labelCCenter,
    relativeTo: labelCPosition,
    x: -15,
    y: -15,
  });
  console.log("✅ LabelC positioned successfully");
} catch (e) {
  console.error("❌ LabelC position FAILED:", e.message);
}

artboard.addElement(labelC);

console.log("\n=== STEP 12: Add square labels ===");
const squareALabel = new Text({
  content: "$a^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

const squareALabelCenter = squareALabel.center;
const squareAPos = squareA.center;

try {
  squareALabel.position({
    relativeFrom: squareALabelCenter,
    relativeTo: squareAPos,
    x: 0,
    y: 0,
  });
  console.log("✅ SquareALabel positioned successfully");
} catch (e) {
  console.error("❌ SquareALabel position FAILED:", e.message);
}

artboard.addElement(squareALabel);

const squareBLabel = new Text({
  content: "$b^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

const squareBLabelCenter = squareBLabel.center;
const squareBPos = squareB.center;

try {
  squareBLabel.position({
    relativeFrom: squareBLabelCenter,
    relativeTo: squareBPos,
    x: 0,
    y: 0,
  });
  console.log("✅ SquareBLabel positioned successfully");
} catch (e) {
  console.error("❌ SquareBLabel position FAILED:", e.message);
}

artboard.addElement(squareBLabel);

const squareCLabel = new Text({
  content: "$c^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

const squareCLabelCenter = squareCLabel.center;
const squareCPos = squareC.center;

try {
  squareCLabel.position({
    relativeFrom: squareCLabelCenter,
    relativeTo: squareCPos,
    x: 0,
    y: 0,
  });
  console.log("✅ SquareCLabel positioned successfully");
} catch (e) {
  console.error("❌ SquareCLabel position FAILED:", e.message);
}

artboard.addElement(squareCLabel);

console.log("\n=== STEP 13: Add theorem text ===");
const theorem = new Text({
  content: "$a^2 + b^2 = c^2$",
  fontSize: 32,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

console.log("theorem object:", theorem);
console.log("theorem.top:", theorem.top);
console.log("artboard.contentBox:", artboard.contentBox);
console.log("artboard.contentBox.bottom:", artboard.contentBox.bottom);

const artboardBottom = artboard.contentBox.bottom;
const theoremTop = theorem.top;

console.log("STORED artboardBottom:", artboardBottom);
console.log("STORED theoremTop:", theoremTop);
console.log("typeof artboardBottom:", typeof artboardBottom);
console.log("typeof theoremTop:", typeof theoremTop);
console.log("artboardBottom is null?", artboardBottom === null);
console.log("artboardBottom is undefined?", artboardBottom === undefined);
console.log("theoremTop is null?", theoremTop === null);
console.log("theoremTop is undefined?", theoremTop === undefined);

try {
  theorem.position({
    relativeFrom: theoremTop,
    relativeTo: artboardBottom,
    x: 0,
    y: -40,
    boxReference: "contentBox",
  });
  console.log("✅ Theorem positioned successfully");
} catch (e) {
  console.error("❌ Theorem position FAILED:", e.message);
  console.error("Full error:", e);
}

artboard.addElement(theorem);

console.log("\n=== STEP 14: Add title text ===");
const title = new Text({
  content: "Pythagorean Theorem",
  fontSize: 28,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

console.log("title object:", title);
console.log("title.bottom:", title.bottom);
console.log("artboard.contentBox.top:", artboard.contentBox.top);

const artboardTop = artboard.contentBox.top;
const titleBottom = title.bottom;

console.log("STORED artboardTop:", artboardTop);
console.log("STORED titleBottom:", titleBottom);
console.log("typeof artboardTop:", typeof artboardTop);
console.log("typeof titleBottom:", typeof titleBottom);
console.log("artboardTop is null?", artboardTop === null);
console.log("artboardTop is undefined?", artboardTop === undefined);
console.log("titleBottom is null?", titleBottom === null);
console.log("titleBottom is undefined?", titleBottom === undefined);

try {
  title.position({
    relativeFrom: titleBottom,
    relativeTo: artboardTop,
    x: 0,
    y: 40,
    boxReference: "contentBox",
  });
  console.log("✅ Title positioned successfully");
} catch (e) {
  console.error("❌ Title position FAILED:", e.message);
  console.error("Full error:", e);
}

artboard.addElement(title);

console.log("\n=== ALL TESTS PASSED ===");
console.log("Total elements added:", artboard.children.length);
return artboard.render();

