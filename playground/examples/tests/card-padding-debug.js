/**
 * Card Padding Debug
 * 
 * Debug example to verify padding is applied evenly.
 */

import { Artboard, Card, Text, Container } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
});

// Center container
const layout = new Container({
  width: 800,
  height: 600,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  spacing: 24,
  style: {
    fill: "none",
  },
});

// Card with just header
const card1 = new Card({
  width: 200,
  height: 150,
  header: "Header Only",
});

layout.addElement(card1);

// Card with header and footer
const card2 = new Card({
  width: 200,
  height: 150,
  header: "With Footer",
  footer: "Footer text",
});

layout.addElement(card2);

// Card with header and content
const card3 = new Card({
  width: 200,
  height: 150,
  header: "With Content",
});

const text = new Text({
  content: "Some content",
  fontSize: "14px",
});

card3.addContent(text);

layout.addElement(card3);

artboard.addElement(layout);

return artboard.render();

