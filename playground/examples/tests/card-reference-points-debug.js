/**
 * Card Reference Points Debug
 * 
 * Shows circles at all content box reference points to verify padding and positioning.
 */

import { Artboard, Card, Circle, Text, Container } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
});

const layout = new Container({
  width: 800,
  height: 600,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
});

// Card with reference point circles
const card = new Card({
  width: 300,
  height: 400,
  header: "Reference Points",
  footer: "Footer text",
});

// Add some content
const contentText = new Text({
  content: "Content in the middle",
  fontSize: "14px",
});
card.addContent(contentText);

// Add card to layout FIRST so it gets positioned
layout.addElement(card);
artboard.addElement(layout);

// NOW we can access card's reference points
// Add reference point circles AFTER card is positioned

// Top center - RED
const topCenter = new Circle({
  radius: 5,
  style: {
    fill: "hsl(0, 100%, 50%)", // Red
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(topCenter);
topCenter.position({
  relativeFrom: topCenter.center,
  relativeTo: card.contentBox.topCenter,
});

// Bottom center - BLUE
const bottomCenter = new Circle({
  radius: 5,
  style: {
    fill: "hsl(220, 100%, 50%)", // Blue
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(bottomCenter);
bottomCenter.position({
  relativeFrom: bottomCenter.center,
  relativeTo: card.contentBox.bottomCenter,
});

// Center left - GREEN
const centerLeft = new Circle({
  radius: 5,
  style: {
    fill: "hsl(120, 100%, 40%)", // Green
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(centerLeft);
centerLeft.position({
  relativeFrom: centerLeft.center,
  relativeTo: card.contentBox.centerLeft,
});

// Center right - YELLOW
const centerRight = new Circle({
  radius: 5,
  style: {
    fill: "hsl(60, 100%, 50%)", // Yellow
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(centerRight);
centerRight.position({
  relativeFrom: centerRight.center,
  relativeTo: card.contentBox.centerRight,
});

// Top left - MAGENTA
const topLeft = new Circle({
  radius: 5,
  style: {
    fill: "hsl(300, 100%, 50%)", // Magenta
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(topLeft);
topLeft.position({
  relativeFrom: topLeft.center,
  relativeTo: card.contentBox.topLeft,
});

// Top right - CYAN
const topRight = new Circle({
  radius: 5,
  style: {
    fill: "hsl(180, 100%, 50%)", // Cyan
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(topRight);
topRight.position({
  relativeFrom: topRight.center,
  relativeTo: card.contentBox.topRight,
});

// Bottom left - ORANGE
const bottomLeft = new Circle({
  radius: 5,
  style: {
    fill: "hsl(30, 100%, 50%)", // Orange
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(bottomLeft);
bottomLeft.position({
  relativeFrom: bottomLeft.center,
  relativeTo: card.contentBox.bottomLeft,
});

// Bottom right - PURPLE
const bottomRight = new Circle({
  radius: 5,
  style: {
    fill: "hsl(270, 100%, 50%)", // Purple
    stroke: "white",
    strokeWidth: "2",
  },
});
artboard.addElement(bottomRight);
bottomRight.position({
  relativeFrom: bottomRight.center,
  relativeTo: card.contentBox.bottomRight,
});

// Center - WHITE (should be in the middle of content box)
const center = new Circle({
  radius: 5,
  style: {
    fill: "white",
    stroke: "black",
    strokeWidth: "2",
  },
});
artboard.addElement(center);
center.position({
  relativeFrom: center.center,
  relativeTo: card.contentBox.center,
});

return artboard.render();

