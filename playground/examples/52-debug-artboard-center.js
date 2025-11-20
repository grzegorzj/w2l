// Debug Artboard Center
// Verify that artboard.center returns the correct coordinates (400, 300)

import { Artboard, Rectangle, Text, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true
});

// ============================================================================
// STEP 1: Log and verify artboard.center
// ============================================================================

console.log("=== ARTBOARD DEBUG ===");
console.log("Artboard dimensions:", artboard.width, "×", artboard.height);
console.log("Padding:", artboard.paddingBox);
console.log("");

// Extract numeric values
const centerX = parseFloat(String(artboard.center.x));
const centerY = parseFloat(String(artboard.center.y));

console.log("CONTENT BOX (default reference points):");
console.log("  artboard.center:", artboard.center, "→", centerX, centerY);
console.log("  artboard.topLeft:", artboard.topLeft);
console.log("  Content area: (60,60) to (740,540)");
console.log("");

console.log("BORDER BOX (absolute artboard coordinates):");
console.log("  artboard.getBorderBox().center:", artboard.getBorderBox().center);
console.log("  artboard.getBorderBox().topLeft:", artboard.getBorderBox().topLeft);
console.log("  Border area: (0,0) to (800,600)");
console.log("");

console.log("CENTER CHECK:");
console.log("  Expected: (400, 300)");
console.log("  Actual:", centerX, centerY);
console.log("  Match?", centerX === 400 && centerY === 300 ? "✅ YES" : "❌ NO");
console.log("  Difference:", centerX - 400, centerY - 300);
console.log("");

console.log("BOX MODEL:");
console.log("  🔵 BLUE circles = Content Box reference points");
console.log("  🟠 ORANGE circles = Border Box reference points");
console.log("  They should be 60px apart (padding amount)");

// ============================================================================
// STEP 2: Create a marker and position it at artboard.center
// ============================================================================

const centerMarker = new Circle({
  radius: 10,
  style: {
    fill: "#ff0000",
    stroke: "#000000",
    strokeWidth: 3
  }
});

// Position using the positioning API
centerMarker.position({
  relativeFrom: centerMarker.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// ============================================================================
// STEP 3: Create info display
// ============================================================================

const infoText = new Text({
  content: `artboard.center: (${centerX}, ${centerY})
Expected: (400, 300)
Difference: (${centerX - 400}, ${centerY - 300})
Padding: 60px

✅ RED circle at artboard.center (CONTENT BOX center)
✅ GREEN crosshairs at true center (400, 300)
Both should overlap!`,
  fontSize: 13,
  lineHeight: 1.6,
  textAlign: "left",
  style: { fill: "#212529", fontWeight: "bold" }
});

// Position in content area (using default artboard.topLeft = content box)
infoText.position({
  relativeFrom: infoText.topLeft,
  relativeTo: artboard.topLeft,
  x: 20,
  y: 20
});

// ============================================================================
// STEP 4: Add crosshair lines for visual reference
// ============================================================================

// Vertical line at x=400 (absolute artboard coordinates)
const verticalLine = new Rectangle({
  width: 2,
  height: 600,
  style: {
    fill: "#00ff00",
    opacity: 0.5
  }
});

// Use borderBox for absolute (0,0) coordinates
verticalLine.position({
  relativeFrom: verticalLine.topLeft,
  relativeTo: artboard.getBorderBox().topLeft,
  x: 400,
  y: 0
});

// Horizontal line at y=300 (absolute artboard coordinates)
const horizontalLine = new Rectangle({
  width: 800,
  height: 2,
  style: {
    fill: "#00ff00",
    opacity: 0.5
  }
});

// Use borderBox for absolute (0,0) coordinates
horizontalLine.position({
  relativeFrom: horizontalLine.topLeft,
  relativeTo: artboard.getBorderBox().topLeft,
  x: 0,
  y: 300
});

// Label for crosshairs
const crosshairLabel = new Text({
  content: "Green crosshairs = true center (400, 300) • Positioned using borderBox",
  fontSize: 11,
  style: { fill: "#00ff00", fontWeight: "bold" }
});

// Use borderBox to position at absolute coordinates
crosshairLabel.position({
  relativeFrom: crosshairLabel.topLeft,
  relativeTo: artboard.getBorderBox().topLeft,
  x: 20,
  y: 560
});

// ============================================================================
// STEP 5: Add markers at all reference points
// ============================================================================

// Content Box reference points (BLUE) - using getContentBox()
const contentBox = artboard.getContentBox();
const contentBoxPoints = [
  { name: "topLeft", point: contentBox.topLeft },
  { name: "topCenter", point: contentBox.topCenter },
  { name: "topRight", point: contentBox.topRight },
  { name: "leftCenter", point: contentBox.leftCenter },
  { name: "center", point: contentBox.center },
  { name: "rightCenter", point: contentBox.rightCenter },
  { name: "bottomLeft", point: contentBox.bottomLeft },
  { name: "bottomCenter", point: contentBox.bottomCenter },
  { name: "bottomRight", point: contentBox.bottomRight },
];

contentBoxPoints.forEach(({ name, point }) => {
  const marker = new Circle({
    radius: 5,
    style: {
      fill: "#0066ff",
      stroke: "#003399",
      strokeWidth: 2
    }
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: point,
    x: 0,
    y: 0
  });
  
  artboard.addElement(marker);
});

// Border Box reference points (ORANGE)
const borderBox = artboard.getBorderBox();
const borderBoxPoints = [
  { name: "topLeft", point: borderBox.topLeft },
  { name: "topCenter", point: borderBox.topCenter },
  { name: "topRight", point: borderBox.topRight },
  { name: "leftCenter", point: borderBox.leftCenter },
  { name: "center", point: borderBox.center },
  { name: "rightCenter", point: borderBox.rightCenter },
  { name: "bottomLeft", point: borderBox.bottomLeft },
  { name: "bottomCenter", point: borderBox.bottomCenter },
  { name: "bottomRight", point: borderBox.bottomRight },
];

borderBoxPoints.forEach(({ name, point }) => {
  const marker = new Circle({
    radius: 4,
    style: {
      fill: "#ff9500",
      stroke: "#cc7700",
      strokeWidth: 2
    }
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: point,
    x: 0,
    y: 0
  });
  
  artboard.addElement(marker);
});

// Legend for the markers
const legend = new Text({
  content: `🔵 Blue (larger) = Content Box points (default artboard.topLeft, etc.)
🟠 Orange (smaller) = Border Box points (artboard.getBorderBox())`,
  fontSize: 11,
  lineHeight: 1.5,
  textAlign: "left",
  style: { fill: "#212529" }
});

legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.getBorderBox().topLeft,
  x: 20,
  y: 580
});

// ============================================================================
// Add all elements and render
// ============================================================================

artboard.addElement(verticalLine);
artboard.addElement(horizontalLine);
artboard.addElement(centerMarker);
artboard.addElement(infoText);
artboard.addElement(crosshairLabel);
artboard.addElement(legend);

artboard.render();

