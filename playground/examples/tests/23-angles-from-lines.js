/**
 * Test: Angles from Lines - Ray-Based Selection
 * 
 * Demonstrates creating angle annotations from Line and Side objects using ray selection.
 * A ray is one direction along a line: "+" (forward) or "-" (backward/opposite).
 */

import { Artboard, Line, Triangle, Angle, Text } from "w2l";

const artboard = new Artboard({
  width: 1100,
  height: 650,
  style: { fill: "#ffffff" },
  boxModel: { padding: 40 },
});

// Main title
const mainTitle = new Text({
  content: "Angles from Lines - Ray-Based Selection (+,+ or +,- etc.)",
  fontSize: 20,
  fontWeight: "bold",
});
mainTitle.position({
  relativeFrom: mainTitle.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(mainTitle);

// Example 1: Angle at vertex using (+,+) rays
{
  const title = new Text({
    content: "Vertex Angle (+,+)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 50,
    y: 50,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 50, y: 130 },
    end: { x: 200, y: 130 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 50, y: 130 },
    end: { x: 180, y: 80 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const angle = new Angle({
    between: [line1, line2],
    ray1: "+",
    ray2: "+",
    label: "$\\alpha$",
    radius: 50,
    style: { stroke: "#2ecc71", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

// Example 2: Reflex angle using (-,-) rays
{
  const title = new Text({
    content: "Reflex Angle (-,-)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 300,
    y: 50,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 300, y: 130 },
    end: { x: 450, y: 130 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 300, y: 130 },
    end: { x: 430, y: 80 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const angle = new Angle({
    between: [line1, line2],
    ray1: "-",
    ray2: "-",
    label: "$\\beta$",
    radius: 50,
    style: { stroke: "#9b59b6", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

// Example 3: Right angle with (+,-)
{
  const title = new Text({
    content: "Crossing Lines (+,-)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 580,
    y: 50,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 580, y: 130 },
    end: { x: 680, y: 130 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 630, y: 80 },
    end: { x: 630, y: 180 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const angle = new Angle({
    between: [line1, line2],
    ray1: "+",
    ray2: "-",
    radius: 20,
    style: { stroke: "#000000", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

// Example 4: Right angle with dot marker
{
  const title = new Text({
    content: "Right Angle (Dot)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 800,
    y: 50,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 800, y: 130 },
    end: { x: 900, y: 130 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 850, y: 80 },
    end: { x: 850, y: 180 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const angle = new Angle({
    between: [line1, line2],
    ray1: "+",
    ray2: "-",
    label: "90°",
    radius: 35,
    rightAngleMarker: 'dot',
    style: { stroke: "#f39c12", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

// Example 5: Triangle with angles using figure API (still supported)
{
  const title = new Text({
    content: "Triangle Internal Angles (using figure API)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 50,
    y: 260,
  });
  artboard.addElement(title);

  // Create a triangle
  const triangle = new Triangle({
    type: "right",
    a: 180,
    b: 140,
    style: { stroke: "#95a5a6", strokeWidth: "2", fill: "none" },
  });
  
  triangle.position({
    relativeFrom: triangle.boundingBoxTopLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 80,
    y: 330,
  });
  
  artboard.addElement(triangle);

  // Create angle annotations using the figure-based API (no need to add lines!)
  const angle0 = new Angle({
    figure: triangle,
    vertexIndex: 0,
    type: 'inward',
    label: "$\\alpha$",
    radius: 30,
    style: { stroke: "#e74c3c", strokeWidth: "1" },
  });

  const angle1 = new Angle({
    figure: triangle,
    vertexIndex: 1,
    type: 'inward',
    label: "$\\beta$",
    radius: 30,
    style: { stroke: "#3498db", strokeWidth: "1" },
  });

  const angle2 = new Angle({
    figure: triangle,
    vertexIndex: 2,
    type: 'inward',
    radius: 25,
    style: { stroke: "#2ecc71", strokeWidth: "1" },
    rightAngleMarker: 'square',
  });

  artboard.addElement(angle0);
  artboard.addElement(angle1);
  artboard.addElement(angle2);
}

// Example 6: 45° angle
{
  const title = new Text({
    content: "45° Angle (+,+)",
    fontSize: 16,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 550,
    y: 320,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 550, y: 420 },
    end: { x: 700, y: 420 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 550, y: 420 },
    end: { x: 656, y: 314 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const angle = new Angle({
    between: [line1, line2],
    ray1: "+",
    ray2: "+",
    label: "45°",
    radius: 60,
    style: { stroke: "#9b59b6", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

return artboard.render();
