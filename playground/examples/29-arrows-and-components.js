/**
 * Arrows and Components Example
 *
 * Demonstrates the new Arrow component and how to use composite components
 * to create complex visuals from simpler primitives.
 */

import {
  Artboard,
  Arrow,
  Circle,
  Rectangle,
  Text,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 1200, height: 900 },
  padding: "40px",
  style: {
    fill: "#f8f9fa",
  },
});

// Title
const title = new Text({
  content: "Arrow Components Demo",
  style: {
    fontSize: "36px",
    fontWeight: "bold",
    fill: "#2c3e50",
    fontFamily: "Arial, sans-serif",
  },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 20,
});
artboard.addElement(title);

// --- BASIC ARROWS ---
const section1Title = new Text({
  content: "1. Basic Arrow Styles",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section1Title.position({
  relativeFrom: section1Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 100,
});
artboard.addElement(section1Title);

// Triangle head arrow
const arrow1 = new Arrow({
  start: { x: "50px", y: "170px" },
  end: { x: "250px", y: "170px" },
  headStyle: "triangle",
  headSize: 12,
  style: {
    stroke: "#3498db",
    strokeWidth: 3,
    fill: "#3498db",
  },
});
artboard.addElement(arrow1);

const label1 = new Text({
  content: "Triangle head",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
label1.position({
  relativeFrom: label1.leftCenter,
  relativeTo: arrow1.end,
  x: 20,
  y: 0,
});
artboard.addElement(label1);

// Line head arrow
const arrow2 = new Arrow({
  start: { x: "50px", y: "220px" },
  end: { x: "250px", y: "220px" },
  headStyle: "line",
  headSize: 15,
  style: {
    stroke: "#e74c3c",
    strokeWidth: 3,
  },
});
artboard.addElement(arrow2);

const label2 = new Text({
  content: "Line head",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
label2.position({
  relativeFrom: label2.leftCenter,
  relativeTo: arrow2.end,
  x: 20,
  y: 0,
});
artboard.addElement(label2);

// Double-ended arrow
const arrow3 = new Arrow({
  start: { x: "50px", y: "270px" },
  end: { x: "250px", y: "270px" },
  headStyle: "triangle",
  headSize: 10,
  doubleEnded: true,
  style: {
    stroke: "#2ecc71",
    strokeWidth: 3,
    fill: "#2ecc71",
  },
});
artboard.addElement(arrow3);

const label3 = new Text({
  content: "Double-ended",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
label3.position({
  relativeFrom: label3.leftCenter,
  relativeTo: arrow3.end,
  x: 20,
  y: 0,
});
artboard.addElement(label3);

// Dashed arrow
const arrow4 = new Arrow({
  start: { x: "50px", y: "320px" },
  end: { x: "250px", y: "320px" },
  headStyle: "triangle",
  headSize: 12,
  style: {
    stroke: "#9b59b6",
    strokeWidth: 2,
    fill: "#9b59b6",
    strokeDasharray: "8,4",
  },
});
artboard.addElement(arrow4);

const label4 = new Text({
  content: "Dashed style",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
label4.position({
  relativeFrom: label4.leftCenter,
  relativeTo: arrow4.end,
  x: 20,
  y: 0,
});
artboard.addElement(label4);

// --- CONNECTING ELEMENTS ---
const section2Title = new Text({
  content: "2. Connecting Elements",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section2Title.position({
  relativeFrom: section2Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 400,
});
artboard.addElement(section2Title);

// Create some shapes to connect
const box1 = new Rectangle({
  width: 100,
  height: 60,
  cornerRadius: 5,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});
box1.position({
  relativeFrom: box1.center,
  relativeTo: { x: "100px", y: "500px" },
  x: 0,
  y: 0,
});
artboard.addElement(box1);

const box1Text = new Text({
  content: "Start",
  style: {
    fontSize: "16px",
    fill: "#ffffff",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
});
box1Text.position({
  relativeFrom: box1Text.center,
  relativeTo: box1.center,
  x: 0,
  y: 0,
});
artboard.addElement(box1Text);

const box2 = new Rectangle({
  width: 100,
  height: 60,
  cornerRadius: 5,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});
box2.position({
  relativeFrom: box2.center,
  relativeTo: { x: "300px", y: "500px" },
  x: 0,
  y: 0,
});
artboard.addElement(box2);

const box2Text = new Text({
  content: "Process",
  style: {
    fontSize: "16px",
    fill: "#ffffff",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
});
box2Text.position({
  relativeFrom: box2Text.center,
  relativeTo: box2.center,
  x: 0,
  y: 0,
});
artboard.addElement(box2Text);

const box3 = new Rectangle({
  width: 100,
  height: 60,
  cornerRadius: 5,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});
box3.position({
  relativeFrom: box3.center,
  relativeTo: { x: "500px", y: "500px" },
  x: 0,
  y: 0,
});
artboard.addElement(box3);

const box3Text = new Text({
  content: "End",
  style: {
    fontSize: "16px",
    fill: "#ffffff",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
});
box3Text.position({
  relativeFrom: box3Text.center,
  relativeTo: box3.center,
  x: 0,
  y: 0,
});
artboard.addElement(box3Text);

// Connect the boxes with arrows
const connector1 = new Arrow({
  start: box1.rightCenter,
  end: box2.leftCenter,
  headStyle: "triangle",
  headSize: 10,
  style: {
    stroke: "#34495e",
    strokeWidth: 2,
    fill: "#34495e",
  },
});
artboard.addElement(connector1);

const connector2 = new Arrow({
  start: box2.rightCenter,
  end: box3.leftCenter,
  headStyle: "triangle",
  headSize: 10,
  style: {
    stroke: "#34495e",
    strokeWidth: 2,
    fill: "#34495e",
  },
});
artboard.addElement(connector2);

// --- CIRCULAR CONNECTIONS ---
const section3Title = new Text({
  content: "3. Circular Arrangements",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section3Title.position({
  relativeFrom: section3Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 600,
});
artboard.addElement(section3Title);

// Create a circular arrangement of nodes
const centerX = 850;
const centerY = 750;
const radius = 120;
const numNodes = 5;
const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"];

const nodes = [];
for (let i = 0; i < numNodes; i++) {
  const angle = (i / numNodes) * 2 * Math.PI - Math.PI / 2; // Start from top
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  const node = new Circle({
    radius: 25,
    style: {
      fill: colors[i],
      stroke: "#2c3e50",
      strokeWidth: 2,
    },
  });
  node.position({
    relativeFrom: node.center,
    relativeTo: { x: `${x}px`, y: `${y}px` },
    x: 0,
    y: 0,
  });
  artboard.addElement(node);
  nodes.push(node);

  // Add label
  const nodeLabel = new Text({
    content: `${i + 1}`,
    style: {
      fontSize: "18px",
      fill: "#ffffff",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
    },
  });
  nodeLabel.position({
    relativeFrom: nodeLabel.center,
    relativeTo: node.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(nodeLabel);
}

// Connect nodes in a cycle
for (let i = 0; i < numNodes; i++) {
  const nextIndex = (i + 1) % numNodes;
  const arrow = new Arrow({
    start: nodes[i].center,
    end: nodes[nextIndex].center,
    headStyle: "triangle",
    headSize: 8,
    style: {
      stroke: "#7f8c8d",
      strokeWidth: 2,
      fill: "#7f8c8d",
    },
  });
  artboard.addElement(arrow);
}

// Center label
const centerLabel = new Text({
  content: "Cycle",
  style: {
    fontSize: "16px",
    fill: "#34495e",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
});
centerLabel.position({
  relativeFrom: centerLabel.center,
  relativeTo: { x: `${centerX}px`, y: `${centerY}px` },
  x: 0,
  y: 0,
});
artboard.addElement(centerLabel);

// --- ANNOTATIONS ---
const section4Title = new Text({
  content: "4. Annotations & Labels",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section4Title.position({
  relativeFrom: section4Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 600,
  y: 100,
});
artboard.addElement(section4Title);

// Create something to annotate
const mainCircle = new Circle({
  radius: 60,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});
mainCircle.position({
  relativeFrom: mainCircle.center,
  relativeTo: { x: "750px", y: "250px" },
  x: 0,
  y: 0,
});
artboard.addElement(mainCircle);

// Annotation 1
const annotation1 = new Text({
  content: "Important\nFeature",
  style: {
    fontSize: "12px",
    fill: "#e74c3c",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
annotation1.position({
  relativeFrom: annotation1.center,
  relativeTo: { x: "900px", y: "180px" },
  x: 0,
  y: 0,
});
artboard.addElement(annotation1);

const annotationArrow1 = new Arrow({
  start: annotation1.bottomCenter,
  end: mainCircle.pointAt(45),
  headStyle: "triangle",
  headSize: 8,
  style: {
    stroke: "#e74c3c",
    strokeWidth: 2,
    fill: "#e74c3c",
  },
});
artboard.addElement(annotationArrow1);

// Annotation 2
const annotation2 = new Text({
  content: "Key\nElement",
  style: {
    fontSize: "12px",
    fill: "#2ecc71",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
annotation2.position({
  relativeFrom: annotation2.center,
  relativeTo: { x: "900px", y: "320px" },
  x: 0,
  y: 0,
});
artboard.addElement(annotation2);

const annotationArrow2 = new Arrow({
  start: annotation2.topCenter,
  end: mainCircle.pointAt(135),
  headStyle: "line",
  headSize: 10,
  style: {
    stroke: "#2ecc71",
    strokeWidth: 2,
  },
});
artboard.addElement(annotationArrow2);

// Info box
const infoBox = new Rectangle({
  width: 350,
  height: 80,
  cornerRadius: 8,
  style: {
    fill: "#ecf0f1",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
});
infoBox.position({
  relativeFrom: infoBox.topLeft,
  relativeTo: { x: "680px", y: "380px" },
  x: 0,
  y: 0,
});
artboard.addElement(infoBox);

const infoText = new Text({
  content: "💡 Arrows can connect any two points,\nmaking them perfect for flowcharts,\ndiagrams, and annotations.",
  style: {
    fontSize: "13px",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
  maxWidth: 330,
});
infoText.position({
  relativeFrom: infoText.topLeft,
  relativeTo: infoBox.topLeft,
  x: 10,
  y: 10,
});
artboard.addElement(infoText);

artboard.render();

