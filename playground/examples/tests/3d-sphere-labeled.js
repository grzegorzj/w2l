import {
  Artboard,
  Sphere,
  Text,
  Circle,
  Line,
} from "w2l";

/**
 * Detailed Sphere Example with Auto-Labeling
 * 
 * Demonstrates:
 * - Creating a sphere
 * - Getting key points (poles, equator)
 * - Projecting 3D points to 2D for labeling
 * - Adding text labels at projected positions
 */

const artboard = new Artboard({
  width: 800,
  height: 800,
  style: { fill: "#ffffff" },
});

// Create a sphere with default wireframe + isometric view
const sphere = new Sphere({
  width: 500,
  height: 500,
  radius: 2,
  segments: 32,
  edgeWidth: 1.5,
});

sphere.position({
  relativeFrom: sphere.center,
  relativeTo: { x: 400, y: 400 },
  x: 0,
  y: 0,
});

artboard.addElement(sphere);

// Get key points on the sphere
const keyPoints = sphere.getKeyPoints();

// Project key points to 2D
const northPole2D = sphere.projectPoint3DTo2D(keyPoints.northPole);
const southPole2D = sphere.projectPoint3DTo2D(keyPoints.southPole);
const equatorPoints2D = sphere.projectPoints3DTo2D(keyPoints.equator);

// Label the north pole
const northLabel = new Text({
  content: "$N$ (North Pole)",
  fontSize: 16,
  style: { fill: "#d32f2f", fontWeight: "bold" },
});

northLabel.position({
  relativeFrom: northLabel.center,
  relativeTo: northPole2D,
  x: 0,
  y: -25,
});

artboard.addElement(northLabel);

// Add a small circle marker at north pole
const northMarker = new Circle({
  radius: 5,
  style: { fill: "#d32f2f", stroke: "white", strokeWidth: 2 },
});

northMarker.position({
  relativeFrom: northMarker.center,
  relativeTo: northPole2D,
  x: 0,
  y: 0,
});

artboard.addElement(northMarker);

// Label the south pole
const southLabel = new Text({
  content: "$S$ (South Pole)",
  fontSize: 16,
  style: { fill: "#1976d2", fontWeight: "bold" },
});

southLabel.position({
  relativeFrom: southLabel.center,
  relativeTo: southPole2D,
  x: 0,
  y: 25,
});

artboard.addElement(southLabel);

// Add a small circle marker at south pole
const southMarker = new Circle({
  radius: 5,
  style: { fill: "#1976d2", stroke: "white", strokeWidth: 2 },
});

southMarker.position({
  relativeFrom: southMarker.center,
  relativeTo: southPole2D,
  x: 0,
  y: 0,
});

artboard.addElement(southMarker);

// Label some equator points
const equatorLabels = ["$E_1$", "$E_2$", "$E_3$", "$E_4$"];
equatorPoints2D.slice(0, 4).forEach((point, i) => {
  const label = new Text({
    content: equatorLabels[i],
    fontSize: 14,
    style: { fill: "#388e3c" },
  });
  
  // Position label slightly outward from the point
  const dx = point.x - 400;
  const dy = point.y - 400;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * 20;
  const offsetY = (dy / dist) * 20;
  
  label.position({
    relativeFrom: label.center,
    relativeTo: point,
    x: offsetX,
    y: offsetY,
  });
  
  artboard.addElement(label);
  
  // Add marker
  const marker = new Circle({
    radius: 4,
    style: { fill: "#388e3c", stroke: "white", strokeWidth: 1.5 },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: point,
    x: 0,
    y: 0,
  });
  
  artboard.addElement(marker);
});

// Add custom latitude/longitude points
const customPoint1 = sphere.getPointAtLatLon(30, 45); // 30° N, 45° E
const customPoint1_2D = sphere.projectPoint3DTo2D(customPoint1);

const customLabel1 = new Text({
  content: "$(30°N, 45°E)$",
  fontSize: 12,
  style: { fill: "#f57c00" },
});

customLabel1.position({
  relativeFrom: customLabel1.center,
  relativeTo: customPoint1_2D,
  x: 30,
  y: -15,
});

artboard.addElement(customLabel1);

const customMarker1 = new Circle({
  radius: 4,
  style: { fill: "#f57c00", stroke: "white", strokeWidth: 1.5 },
});

customMarker1.position({
  relativeFrom: customMarker1.center,
  relativeTo: customPoint1_2D,
  x: 0,
  y: 0,
});

artboard.addElement(customMarker1);

// Add a line connecting north and south poles (axis)
const axisLine = new Line({
  start: northPole2D,
  end: southPole2D,
  style: {
    stroke: "#757575",
    strokeWidth: 2,
    strokeDasharray: "5,5",
    opacity: 0.5,
  },
});

artboard.addElement(axisLine);

// Add title
const title = new Text({
  content: "Sphere with 3D Point Projection",
  fontSize: 24,
  fontWeight: "bold",
});

title.position({
  relativeFrom: title.center,
  relativeTo: { x: 400, y: 50 },
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Add subtitle
const subtitle = new Text({
  content: "3D coordinates automatically projected to 2D SVG space for precise labeling",
  fontSize: 14,
  style: { fill: "#666" },
});

subtitle.position({
  relativeFrom: subtitle.center,
  relativeTo: { x: 400, y: 750 },
  x: 0,
  y: 0,
});

artboard.addElement(subtitle);

// Render
return artboard.render();

