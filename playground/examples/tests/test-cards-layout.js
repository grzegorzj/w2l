/**
 * Card Layout Example
 * Testing cards with various content types in a vertical container
 */

import {
  Artboard,
  Card,
  Container,
  TextArea,
  Latex,
  Triangle,
  Text,
} from "w2l";

const artboard = new Artboard({
  width: 800,
  height: "auto",
  boxModel: { padding: 40 },
});

// Main container for cards - spread vertically
const mainContainer = new Container({
  width: 600,
  height: "auto",
  direction: "vertical",
  spacing: 30,
  boxModel: { padding: 0 },
});

mainContainer.position({
  relativeTo: artboard.contentBox.center,
  relativeFrom: mainContainer.center,
  x: 0,
  y: 0,
});

artboard.add(mainContainer);

// Card 1: TextArea with LaTeX
const card1 = new Card({
  width: 600,
  height: "auto",
  boxModel: { padding: 20 },
});

const card1Title = new Text({
  content: "Pythagorean Theorem",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const card1Text = new TextArea({
  content: "In a right triangle, the square of the hypotenuse is equal to the sum of squares of the other two sides.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
});

const card1Formula = new Latex({
  content: "$$a^2 + b^2 = c^2$$",
  fontSize: 20,
});

const card1Content = new Container({
  width: 560,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card1Content.add(card1Title);
card1Content.add(card1Text);
card1Content.add(card1Formula);

card1.add(card1Content);
mainContainer.add(card1);

// Card 2: Centered Triangle
const card2 = new Card({
  width: 600,
  height: "auto",
  boxModel: { padding: 30 },
});

// Create card2 content in a container for better layout
const card2Content = new Container({
  width: 540,
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
});

const card2Title = new Text({
  content: "Right Triangle",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

card2Content.add(card2Title);

const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 80,
  style: {
    fill: "rgba(59, 130, 246, 0.1)",
    stroke: "#3b82f6",
    strokeWidth: 2,
  },
});

card2Content.add(triangle);

card2.add(card2Content);

mainContainer.add(card2);

// IMPORTANT: Create angles and labels AFTER adding to container
// This ensures the triangle is positioned first, then angles read correct coordinates
const angles = triangle.showAngles({
  mode: "internal",
  rightAngleMarker: "square",
});
angles.forEach((angle) => artboard.add(angle));

// Label the sides
const sideLabels = triangle.createSideLabels(["$a$", "$b$", "$c$"]);
sideLabels.forEach((label) => artboard.add(label));

// Card 3: Some other text content
const card3 = new Card({
  width: 600,
  height: "auto",
  boxModel: { padding: 20 },
});

const card3Title = new Text({
  content: "Geometric Properties",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const card3Text1 = new TextArea({
  content: "Triangles are fundamental shapes in geometry. They are the simplest polygon with three vertices and three sides.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
});

const card3Text2 = new TextArea({
  content: "The sum of all internal angles in any triangle always equals 180°. This property is universal across all triangle types.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
  style: { color: "#555" },
});

const card3Content = new Container({
  width: 560,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card3Content.add(card3Title);
card3Content.add(card3Text1);
card3Content.add(card3Text2);

card3.add(card3Content);
mainContainer.add(card3);

return artboard.render();

