/**
 * Card Padding with Rectangle Debug
 * 
 * Uses rectangles to visualize actual padding vs content positioning.
 */

import { Artboard, Card, Rect, Text, Container } from "w2l";

const artboard = new Artboard({
  width: 1000,
  height: 600,
});

const layout = new Container({
  width: 1000,
  height: 600,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  spacing: 32,
  style: {
    fill: "none",
  },
});

// Card 1: Just a rectangle to show content box
const card1 = new Card({
  width: 250,
  height: 300,
  header: "Rectangle Fill",
});

// Rectangle that should fill the content box
// Card width: 250, padding: 16*2 = 32, so content width = 218
const contentRect1 = new Rect({
  width: 218,
  height: 200,
  style: {
    fill: "#F5F5F5",
    stroke: "#525252",
    strokeWidth: "1",
  },
});

card1.addContent(contentRect1);
layout.addElement(card1);

// Card 2: Rectangle with manual positioning to see padding
const card2 = new Card({
  width: 250,
  height: 300,
  header: "Manual Position",
  footer: "Footer at bottom",
});

// Add a rectangle
const contentRect2 = new Rect({
  width: 218,
  height: 100,
  style: {
    fill: "#E5E5E5",
    stroke: "#737373",
    strokeWidth: "1",
  },
});

card2.addContent(contentRect2);

// Position footer manually at bottom
const footer = card2.getFooter();
if (footer) {
  footer.position({
    relativeFrom: footer.bottomLeft,
    relativeTo: card2.contentBox.bottomLeft,
    y: 0,
  });
}

layout.addElement(card2);

// Card 3: Show padding measurements with small boxes
const card3 = new Card({
  width: 250,
  height: 300,
  header: "Padding Indicators",
});

// Top indicator (should be at top of content box)
const topBox = new Rect({
  width: 218,
  height: 4,
  style: {
    fill: "hsl(358, 85%, 52%)", // Swiss Red
    stroke: "none",
  },
});

card3.addContent(topBox);

// Bottom indicator (add as last element)
const bottomBox = new Rect({
  width: 218,
  height: 4,
  style: {
    fill: "hsl(358, 85%, 52%)",
    stroke: "none",
  },
});

// Add some spacer text to push bottom indicator down
const spacer = new Text({
  content: "Content",
  fontSize: "14px",
});
card3.addContent(spacer);
card3.addContent(bottomBox);

layout.addElement(card3);

artboard.addElement(layout);

return artboard.render();

