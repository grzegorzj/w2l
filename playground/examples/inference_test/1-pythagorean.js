// Create artboard
const artboard = new Artboard({
  width: 800,
  height: 600,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 60 },
});

// Create a right triangle with sides 3-4-5 (classic Pythagorean triple)
const triangle = new Triangle({
  type: "right",
  a: 120, // base
  b: 160, // height
  orientation: "bottomLeft",
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 3 },
});

// Center triangle in artboard
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
});

artboard.addElement(triangle);

// Create squares on each side of the triangle
// Square on side a (base)
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

// Position square on side a (base)
squareA.position({
  relativeFrom: squareA.center,
  relativeTo: triangle.sides[0].center,
  x: 0,
  y: 0,
});
squareA.rotate(triangle.sides[0].angle);
squareA.translate(triangle.sides[0].outwardNormal, squareA.width / 2);

// Square on side b (height)
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

// Position square on side b (height)
squareB.position({
  relativeFrom: squareB.center,
  relativeTo: triangle.sides[1].center,
  x: 0,
  y: 0,
});
squareB.rotate(triangle.sides[1].angle);
squareB.translate(triangle.sides[1].outwardNormal, squareB.width / 2);

// Square on side c (hypotenuse)
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

// Position square on side c (hypotenuse)
squareC.position({
  relativeFrom: squareC.center,
  relativeTo: triangle.sides[2].center,
  x: 0,
  y: 0,
});
squareC.rotate(triangle.sides[2].angle);
squareC.translate(triangle.sides[2].outwardNormal, squareC.width / 2);

// Add all squares to artboard
artboard.addElement(squareA);
artboard.addElement(squareB);
artboard.addElement(squareC);

// Add angle annotation for the right angle
const rightAngle = triangle.showAngle(0, {
  mode: "internal",
  radius: 30,
  label: "90°",
  labelFontSize: 16,
  style: { stroke: "#e74c3c", strokeWidth: 2 },
});

artboard.addElement(rightAngle);

// Add labels for the sides
const labelA = new Text({
  content: "$a$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

labelA.position({
  relativeFrom: labelA.center,
  relativeTo: triangle.sides[0].center,
  x: 0,
  y: 25,
});

const labelB = new Text({
  content: "$b$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

labelB.position({
  relativeFrom: labelB.center,
  relativeTo: triangle.sides[1].center,
  x: -25,
  y: 0,
});

const labelC = new Text({
  content: "$c$",
  fontSize: 20,
  style: { fill: "#d35400" },
});

labelC.position({
  relativeFrom: labelC.center,
  relativeTo: triangle.sides[2].center,
  x: -15,
  y: -15,
});

artboard.addElement(labelA);
artboard.addElement(labelB);
artboard.addElement(labelC);

// Add labels for the squares
const squareALabel = new Text({
  content: "$a^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

squareALabel.position({
  relativeFrom: squareALabel.center,
  relativeTo: squareA.center,
  x: 0,
  y: 0,
});

const squareBLabel = new Text({
  content: "$b^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

squareBLabel.position({
  relativeFrom: squareBLabel.center,
  relativeTo: squareB.center,
  x: 0,
  y: 0,
});

const squareCLabel = new Text({
  content: "$c^2$",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#fff" },
});

squareCLabel.position({
  relativeFrom: squareCLabel.center,
  relativeTo: squareC.center,
  x: 0,
  y: 0,
});

artboard.addElement(squareALabel);
artboard.addElement(squareBLabel);
artboard.addElement(squareCLabel);

// Add theorem equation
const theorem = new Text({
  content: "$a^2 + b^2 = c^2$",
  fontSize: 32,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

theorem.position({
  relativeFrom: theorem.top,
  relativeTo: artboard.contentBox.bottom,
  x: 0,
  y: -40,
  boxReference: "contentBox",
});

artboard.addElement(theorem);

// Add title
const title = new Text({
  content: "Pythagorean Theorem",
  fontSize: 28,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

title.position({
  relativeFrom: title.bottom,
  relativeTo: artboard.contentBox.top,
  x: 0,
  y: 40,
  boxReference: "contentBox",
});

artboard.addElement(title);

artboard.render();
