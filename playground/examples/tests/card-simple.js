/**
 * Simple Card Example
 * 
 * Step-by-step demonstration of the Card component.
 */

import { Artboard, Card, TextArea, Container } from "w2l";

// Fixed-size artboard
const artboard = new Artboard({
  width: 600,
  height: 400,
});

// Use a container to position the card
const layout = new Container({
  width: 600,
  height: 400,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
});

// Simple card with header and footer
const card = new Card({
  width: 300,
  header: "My First Card",
  footer: "Click to learn more →",
});

// Add wrapping text content - use TextArea for proper wrapping!
const content = new TextArea({
  text: "This is a themed card component. It has automatic padding, borders, and styling. Text wraps properly within the card width.",
  width: 268, // Card width (300) minus padding (16*2)
  fontSize: 14,
  lineHeight: 1.5,
});

card.addContent(content);

// Add more wrapping text
const moreText = new TextArea({
  text: "Cards use Container internally, so content is laid out vertically with proper spacing.",
  width: 268,
  fontSize: 12,
  lineHeight: 1.5,
});

card.addContent(moreText);

// Add card to layout container (which centers it)
layout.addElement(card);

// Add layout to artboard
artboard.addElement(layout);

return artboard.render();

