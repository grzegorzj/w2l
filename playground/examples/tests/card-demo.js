/**
 * Card Component Demo
 * 
 * Demonstrates the themed Card component with headers, content, and footers.
 */

import { Artboard, Card, Text, TextArea, Container, BarChart } from "w2l";

const artboard = new Artboard({
  width: 1000,
  height: 700,
});

// Main container
const mainContainer = new Container({
  width: 900,
  height: "auto",
  direction: "horizontal",
  spacing: 24,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
  boxModel: {
    padding: 32,
  },
});

// Card 1: Simple text card
const card1 = new Card({
  width: 280,
  header: "Welcome",
  footer: "Learn more →",
});

const welcomeText = new TextArea({
  text: "This is a themed card component with automatic styling. Content is positioned automatically and wraps properly!",
  width: 248, // Card width minus padding (280 - 32)
  fontSize: 14,
  lineHeight: 1.5,
});
card1.addContent(welcomeText);

mainContainer.addElement(card1);

// Card 2: Card with chart
const card2 = new Card({
  width: 300,
  header: "Monthly Stats",
});

const chart = new BarChart({
  width: 268,
  height: 200,
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 38 },
    { label: "Apr", value: 78 },
  ],
  orientation: "vertical",
  barSpacing: 0.4, // Narrow bars
  barColor: "#525252",
  showGrid: true,
  showAxes: true,
  showValueLabels: false,
  chartPadding: {
    top: 12,
    right: 12,
    bottom: 24,
    left: 32,
  },
  style: {
    fill: "none",
    stroke: "none",
  },
});

card2.addContent(chart);

mainContainer.addElement(card2);

// Card 3: Multi-content card
const card3 = new Card({
  width: 260,
  header: "Information",
  footer: "Updated today",
});

const title = new Text({
  content: "Multiple Elements",
  fontSize: "14px",
  style: {
    fontWeight: "500",
  },
});

const body = new TextArea({
  text: "Cards can contain any elements and they'll be laid out vertically with automatic spacing. Text wraps properly!",
  width: 228, // 260 - 32
  fontSize: 12,
  lineHeight: 1.5,
});

card3.addContent(title);
card3.addContent(body);

mainContainer.addElement(card3);

// Use a centering container for the main layout
const centerContainer = new Container({
  width: 1000,
  height: 700,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
});

centerContainer.addElement(mainContainer);
artboard.addElement(centerContainer);

return artboard.render();

