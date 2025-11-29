/**
 * Card Box Comparison Debug
 * 
 * Shows both border box and content box reference points to visualize padding.
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

// Card with reference points
const card = new Card({
  width: 300,
  height: 400,
  header: "Padding: 16px all sides",
});

// Add text to show expected padding
const info = new Text({
  content: "Red = border box corners\nBlue = content box corners\n\nDistance between them\nshould be 16px (padding)",
  fontSize: "12px",
});
card.addContent(info);

// Add card to layout FIRST so it gets positioned
layout.addElement(card);
artboard.addElement(layout);

// NOW we can access card's box reference points
// BORDER BOX corners - RED (outer edges of card)
const borderTL = new Circle({
  radius: 4,
  style: { fill: "hsl(0, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(borderTL);
borderTL.position({
  relativeFrom: borderTL.center,
  relativeTo: card.borderBox.topLeft,
});

const borderTR = new Circle({
  radius: 4,
  style: { fill: "hsl(0, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(borderTR);
borderTR.position({
  relativeFrom: borderTR.center,
  relativeTo: card.borderBox.topRight,
});

const borderBL = new Circle({
  radius: 4,
  style: { fill: "hsl(0, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(borderBL);
borderBL.position({
  relativeFrom: borderBL.center,
  relativeTo: card.borderBox.bottomLeft,
});

const borderBR = new Circle({
  radius: 4,
  style: { fill: "hsl(0, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(borderBR);
borderBR.position({
  relativeFrom: borderBR.center,
  relativeTo: card.borderBox.bottomRight,
});

// CONTENT BOX corners - BLUE (inner area after padding)
const contentTL = new Circle({
  radius: 4,
  style: { fill: "hsl(220, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(contentTL);
contentTL.position({
  relativeFrom: contentTL.center,
  relativeTo: card.contentBox.topLeft,
});

const contentTR = new Circle({
  radius: 4,
  style: { fill: "hsl(220, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(contentTR);
contentTR.position({
  relativeFrom: contentTR.center,
  relativeTo: card.contentBox.topRight,
});

const contentBL = new Circle({
  radius: 4,
  style: { fill: "hsl(220, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(contentBL);
contentBL.position({
  relativeFrom: contentBL.center,
  relativeTo: card.contentBox.bottomLeft,
});

const contentBR = new Circle({
  radius: 4,
  style: { fill: "hsl(220, 100%, 50%)", stroke: "white", strokeWidth: "1" },
});
artboard.addElement(contentBR);
contentBR.position({
  relativeFrom: contentBR.center,
  relativeTo: card.contentBox.bottomRight,
});

return artboard.render();

