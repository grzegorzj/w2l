/**
 * Test: Line Intersections
 * 
 * Demonstrates the line intersection functionality for both Line and Side objects.
 * Shows intersection points marked with small circles.
 */

import { Artboard, Line, Circle, Text } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
  style: { fill: "#ffffff" },
  boxModel: { padding: 40 },
});

// Example 1: Two intersecting lines
{
  const title = new Text({
    content: "Line Intersections",
    fontSize: 18,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 20,
    y: 0,
  });
  artboard.addElement(title);

  // Create two intersecting lines
  const line1 = new Line({
    start: { x: 40, y: 80 },
    end: { x: 200, y: 180 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 40, y: 180 },
    end: { x: 200, y: 80 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  // Find and mark intersection
  const intersections = line1.getIntersections(line2);
  if (intersections.length > 0) {
    const intersection = intersections[0];
    const marker = new Circle({
      radius: 5,
      style: { fill: "#2ecc71", stroke: "none" },
    });
    artboard.addElement(marker);
    marker.position({
      relativeTo: intersection,
      relativeFrom: marker.center,
      x: 0,
      y: 0,
    });

    const label = new Text({
      content: `(${intersection.x.toFixed(0)}, ${intersection.y.toFixed(0)})`,
      fontSize: 12,
    });
    artboard.addElement(label);
    label.position({
      relativeTo: { x: intersection.x, y: intersection.y - 15 },
      relativeFrom: label.center,
      x: 0,
      y: 0,
    });
  }
}

// Example 2: Parallel lines (no intersection)
{
  const title = new Text({
    content: "Parallel Lines",
    fontSize: 18,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 280,
    y: 0,
  });
  artboard.addElement(title);

  const line1 = new Line({
    start: { x: 300, y: 90 },
    end: { x: 460, y: 110 },
    style: { stroke: "#3498db", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 300, y: 150 },
    end: { x: 460, y: 170 },
    style: { stroke: "#e74c3c", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  const intersections = line1.getIntersections(line2);
  const result = new Text({
    content: intersections.length > 0 ? "Intersection found" : "No intersection (parallel)",
    fontSize: 12,
  });
  result.position({
    relativeTo: { x: 380, y: 130 },
    relativeFrom: result.center,
  });
  artboard.addElement(result);
}

// Example 3: Segment intersection (within bounds)
{
  const title = new Text({
    content: "Segment Intersection",
    fontSize: 18,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 560,
    y: 0,
  });
  artboard.addElement(title);

  // Two line segments that intersect
  const line1 = new Line({
    start: { x: 550, y: 60 },
    end: { x: 690, y: 200 },
    style: { stroke: "#9b59b6", strokeWidth: "2" },
  });

  const line2 = new Line({
    start: { x: 600, y: 60 },
    end: { x: 600, y: 200 },
    style: { stroke: "#f39c12", strokeWidth: "2" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  // Find intersection with infinite=false (default)
  const intersections = line1.getIntersections(line2, false);
  if (intersections.length > 0) {
    const intersection = intersections[0];
    const marker = new Circle({
      radius: 5,
      style: { fill: "#2ecc71", stroke: "none" },
    });
    artboard.addElement(marker);
    marker.position({
      relativeTo: intersection,
      relativeFrom: marker.center,
      x: 0,
      y: 0,
    });

    const label = new Text({
      content: "✓ Within bounds",
      fontSize: 12,
    });
    artboard.addElement(label);
    label.position({
      relativeTo: { x: 620, y: 50 },
      relativeFrom: label.center,
      x: 0,
      y: 0,
    });
  }
}

// Example 4: Lines extending beyond segments
{
  const title = new Text({
    content: "Extended Lines (Infinite)",
    fontSize: 18,
    fontWeight: "bold",
  });
  title.position({
    relativeFrom: title.topLeft,
    relativeTo: artboard.contentBox.topLeft,
    x: 20,
    y: 280,
  });
  artboard.addElement(title);

  // Two short segments that don't intersect...
  const line1 = new Line({
    start: { x: 50, y: 350 },
    end: { x: 100, y: 400 },
    style: { stroke: "#3498db", strokeWidth: "3" },
  });

  const line2 = new Line({
    start: { x: 150, y: 350 },
    end: { x: 100, y: 400 },
    style: { stroke: "#e74c3c", strokeWidth: "3" },
  });

  artboard.addElement(line1);
  artboard.addElement(line2);

  // ...but would intersect if extended infinitely
  const intersections = line1.getIntersections(line2, true); // infinite=true
  if (intersections.length > 0) {
    const intersection = intersections[0];
    // Draw dashed extensions
    const ext1 = new Line({
      start: { x: line1.end.x, y: line1.end.y },
      end: { x: intersection.x, y: intersection.y },
      style: { stroke: "#3498db", strokeWidth: "1", strokeDasharray: "5,5", opacity: 0.5 },
    });
    
    const ext2 = new Line({
      start: { x: line2.end.x, y: line2.end.y },
      end: { x: intersection.x, y: intersection.y },
      style: { stroke: "#e74c3c", strokeWidth: "1", strokeDasharray: "5,5", opacity: 0.5 },
    });

    artboard.addElement(ext1);
    artboard.addElement(ext2);

    const marker = new Circle({
      radius: 5,
      style: { fill: "#2ecc71", stroke: "none" },
    });
    artboard.addElement(marker);
    marker.position({
      relativeTo: intersection,
      relativeFrom: marker.center,
      x: 0,
      y: 0,
    });
  }
}

return artboard.render();
