/**
 * Legend Component Test
 * Demonstrates the Legend component with different configurations
 */

import {
  Artboard,
  Legend,
  Card,
  Container,
  Text,
  Rect,
} from "w2l";

const artboard = new Artboard({
  width: 800,
  height: "auto",
  boxModel: { padding: 40 },
});

// Container for examples
const mainContainer = new Container({
  width: 720,
  height: "auto",
  direction: "vertical",
  spacing: 30,
});

mainContainer.position({
  relativeTo: artboard.contentBox.center,
  relativeFrom: mainContainer.center,
  x: 0,
  y: 0,
});

artboard.add(mainContainer);

// Example 1: Vertical legend with circles
const card1 = new Card({
  width: 720,
  height: "auto",
  boxModel: { padding: 20 },
});

const title1 = new Text({
  content: "Vertical Legend with Circles",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const legend1 = new Legend({
  items: [
    { color: "#3b82f6", label: "Series A" },
    { color: "#ef4444", label: "Series B" },
    { color: "#10b981", label: "Series C" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
});

const card1Content = new Container({
  width: 680,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card1Content.add(title1);
card1Content.add(legend1.container);

card1.add(card1Content);
mainContainer.add(card1);

// Example 2: Horizontal legend with squares
const card2 = new Card({
  width: 720,
  height: "auto",
  boxModel: { padding: 20 },
});

const title2 = new Text({
  content: "Horizontal Legend with Squares",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const legend2 = new Legend({
  items: [
    { color: "#8b5cf6", label: "Category 1" },
    { color: "#ec4899", label: "Category 2" },
    { color: "#f59e0b", label: "Category 3" },
    { color: "#06b6d4", label: "Category 4" },
  ],
  direction: "horizontal",
  indicatorShape: "square",
  spacing: 20,
});

const card2Content = new Container({
  width: 680,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card2Content.add(title2);
card2Content.add(legend2.container);

card2.add(card2Content);
mainContainer.add(card2);

// Example 3: Legend with color swatches
const card3 = new Card({
  width: 720,
  height: "auto",
  boxModel: { padding: 20 },
});

const title3 = new Text({
  content: "Legend with Larger Indicators",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const legend3 = new Legend({
  items: [
    { color: "#dc2626", label: "Critical" },
    { color: "#f97316", label: "Warning" },
    { color: "#eab308", label: "Caution" },
    { color: "#22c55e", label: "Success" },
  ],
  direction: "vertical",
  indicatorShape: "square",
  indicatorSize: 8,
  itemSpacing: 12,
  fontSize: 15,
});

const card3Content = new Container({
  width: 680,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card3Content.add(title3);
card3Content.add(legend3.container);

card3.add(card3Content);
mainContainer.add(card3);

// Example 4: Compact legend (smaller)
const card4 = new Card({
  width: 720,
  height: "auto",
  boxModel: { padding: 20 },
});

const title4 = new Text({
  content: "Compact Legend",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const legend4 = new Legend({
  items: [
    { color: "#0ea5e9", label: "Data Point A" },
    { color: "#8b5cf6", label: "Data Point B" },
    { color: "#d946ef", label: "Data Point C" },
    { color: "#f43f5e", label: "Data Point D" },
  ],
  direction: "horizontal",
  indicatorShape: "circle",
  indicatorSize: 5,
  itemSpacing: 6,
  spacing: 16,
  fontSize: 12,
});

const card4Content = new Container({
  width: 680,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card4Content.add(title4);
card4Content.add(legend4.container);

card4.add(card4Content);
mainContainer.add(card4);

return artboard.render();

