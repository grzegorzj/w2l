/**
 * Card Styling Test
 * Simple example to refine card appearance and padding
 */

import {
  Artboard,
  Card,
  Container,
  Text,
  TextArea,
} from "w2l";

const artboard = new Artboard({
  width: 800,
  height: "auto",
  boxModel: { padding: 40 },
});

// Main container for cards
const mainContainer = new Container({
  width: 600,
  height: "auto",
  direction: "vertical",
  spacing: 20,
});

mainContainer.position({
  relativeTo: artboard.contentBox.center,
  relativeFrom: mainContainer.center,
  x: 0,
  y: 0,
});

artboard.add(mainContainer);

// Card 1
const card1 = new Card({
  width: 600,
  height: "auto",
  boxModel: { padding: 20 },
});

const card1Title = new Text({
  content: "First Card Title",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const card1Text = new TextArea({
  content: "This is some descriptive text in the first card. It should have even padding on all sides.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
});

const card1Content = new Container({
  width: 560,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card1Content.add(card1Title);
card1Content.add(card1Text);

card1.add(card1Content);
mainContainer.add(card1);

// Card 2
const card2 = new Card({
  width: 600,
  height: "auto",
  boxModel: { padding: 20 },
});

const card2Title = new Text({
  content: "Second Card Title",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const card2Text1 = new TextArea({
  content: "This card has multiple text blocks to test spacing and padding consistency.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
});

const card2Text2 = new TextArea({
  content: "The padding should be visually consistent on all sides - top, bottom, left, and right.",
  width: 560,
  fontSize: 14,
  lineHeight: 1.6,
});

const card2Content = new Container({
  width: 560,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card2Content.add(card2Title);
card2Content.add(card2Text1);
card2Content.add(card2Text2);

card2.add(card2Content);
mainContainer.add(card2);

return artboard.render();

