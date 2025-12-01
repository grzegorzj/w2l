/**
 * Timeline Component Test
 * Demonstrates timeline features: events, periods, stacking, and collapsed intervals
 */

import { Artboard, Timeline, Card, Container, Text } from "w2l";

const artboard = new Artboard({
  width: 1000,
  height: "auto",
  boxModel: { padding: 40 },
});

// Container for examples
const mainContainer = new Container({
  width: 920,
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

// Example 1: Simple timeline with events and periods
const card1 = new Card({
  width: 920,
  height: "auto",
  boxModel: { padding: 20 },
});

const title1 = new Text({
  content: "20th Century Timeline",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const timeline1 = new Timeline({
  width: 880,
  timeRange: {
    start: new Date(1900, 0, 1),
    end: new Date(2000, 0, 1),
  },
  events: [
    { 
      time: new Date(1945, 4, 8), 
      label: "End of WWII", 
      color: "#ef4444",
      description: "Victory in Europe Day marked the formal acceptance of Nazi Germany's unconditional surrender."
    },
    { 
      time: new Date(1969, 6, 20), 
      label: "Moon Landing", 
      color: "#3b82f6",
      description: "Apollo 11 mission successfully landed the first humans on the Moon."
    },
    { 
      time: new Date(1989, 10, 9), 
      label: "Berlin Wall Falls", 
      color: "#10b981",
      description: "The fall of the Berlin Wall marked the end of the Cold War era."
    },
  ],
  periods: [
    {
      start: new Date(1914, 6, 28),
      end: new Date(1918, 10, 11),
      label: "WWI",
      color: "#f59e0b",
      track: 0,
    },
    {
      start: new Date(1939, 8, 1),
      end: new Date(1945, 4, 8),
      label: "WWII",
      color: "#ef4444",
      track: 0,
    },
    {
      start: new Date(1947, 0, 1),
      end: new Date(1991, 11, 26),
      label: "Cold War",
      color: "#8b5cf6",
      track: 1,
    },
  ],
  yearMarkers: 10,
});

const card1Content = new Container({
  width: 880,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card1Content.add(title1);
card1Content.add(timeline1.container);

card1.add(card1Content);
mainContainer.add(card1);

// Example 2: Timeline with collapsed intervals
const card2 = new Card({
  width: 920,
  height: "auto",
  boxModel: { padding: 20 },
});

const title2 = new Text({
  content: "Ancient to Modern (with collapsed gaps)",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const timeline2 = new Timeline({
  width: 880,
  timeRange: {
    start: new Date(-500, 0, 1), // 500 BCE
    end: new Date(2000, 0, 1),
  },
  events: [
    { time: new Date(-500, 0, 1), label: "Ancient Era", color: "#a855f7" },
    { time: new Date(1450, 0, 1), label: "Renaissance", color: "#06b6d4" },
    { time: new Date(1800, 0, 1), label: "Industrial Age", color: "#f59e0b" },
    { time: new Date(2000, 0, 1), label: "Digital Age", color: "#3b82f6" },
  ],
  periods: [
    {
      start: new Date(-500, 0, 1),
      end: new Date(500, 0, 1),
      label: "Classical Period",
      color: "#a855f7",
      track: 0,
    },
    {
      start: new Date(1400, 0, 1),
      end: new Date(1600, 0, 1),
      label: "Renaissance",
      color: "#06b6d4",
      track: 0,
    },
    {
      start: new Date(1760, 0, 1),
      end: new Date(1840, 0, 1),
      label: "Industrial Revolution",
      color: "#f59e0b",
      track: 1,
    },
  ],
  breaks: [
    { start: new Date(500, 0, 1), end: new Date(1400, 0, 1), width: 50 },
    { start: new Date(1600, 0, 1), end: new Date(1760, 0, 1), width: 40 },
  ],
  yearMarkers: 200,
});

const card2Content = new Container({
  width: 880,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card2Content.add(title2);
card2Content.add(timeline2.container);

card2.add(card2Content);
mainContainer.add(card2);

// Example 3: Multiple stacked periods
const card3 = new Card({
  width: 920,
  height: "auto",
  boxModel: { padding: 20 },
});

const title3 = new Text({
  content: "Project Timeline with Multiple Tracks",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const timeline3 = new Timeline({
  width: 880,
  timeRange: {
    start: new Date(2024, 0, 1),
    end: new Date(2024, 11, 31),
  },
  events: [
    { time: new Date(2024, 2, 15), label: "Launch", color: "#10b981" },
    { time: new Date(2024, 5, 1), label: "Milestone", color: "#3b82f6" },
    { time: new Date(2024, 9, 1), label: "Release", color: "#ef4444" },
  ],
  periods: [
    {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 2, 31),
      label: "Planning",
      color: "#8b5cf6",
      track: 0,
    },
    {
      start: new Date(2024, 3, 1),
      end: new Date(2024, 7, 31),
      label: "Development",
      color: "#3b82f6",
      track: 0,
    },
    {
      start: new Date(2024, 8, 1),
      end: new Date(2024, 11, 31),
      label: "Testing",
      color: "#10b981",
      track: 0,
    },
    {
      start: new Date(2024, 1, 1),
      end: new Date(2024, 5, 30),
      label: "Design Phase",
      color: "#ec4899",
      track: 1,
    },
    {
      start: new Date(2024, 6, 1),
      end: new Date(2024, 10, 30),
      label: "Marketing Campaign",
      color: "#f59e0b",
      track: 2,
    },
  ],
  yearMarkers: false, // Don't show year markers for single-year view
});

const card3Content = new Container({
  width: 880,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card3Content.add(title3);
card3Content.add(timeline3.container);

card3.add(card3Content);
mainContainer.add(card3);

return artboard.render();

