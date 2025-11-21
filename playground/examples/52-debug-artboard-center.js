// Box Model Visualization
// Shows content box vs border box reference points for artboard and nested layouts

import { Artboard, Rectangle, Text, Circle, ColumnsLayout } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true
});

// ============================================================================
// STEP 1: Helper function to add reference point markers
// ============================================================================

function addReferenceMarkers(element, contentBoxColor, borderBoxColor) {
  // Content Box reference points
  const contentBox = element.getContentBox();
  const contentBoxPoints = [
    contentBox.topLeft, contentBox.topCenter, contentBox.topRight,
    contentBox.leftCenter, contentBox.center, contentBox.rightCenter,
    contentBox.bottomLeft, contentBox.bottomCenter, contentBox.bottomRight,
  ];

  contentBoxPoints.forEach(point => {
    const marker = new Circle({
      radius: 4,
      style: {
        fill: contentBoxColor,
        stroke: "#000",
        strokeWidth: 1
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

  // Border Box reference points
  const borderBox = element.getBorderBox();
  const borderBoxPoints = [
    borderBox.topLeft, borderBox.topCenter, borderBox.topRight,
    borderBox.leftCenter, borderBox.center, borderBox.rightCenter,
    borderBox.bottomLeft, borderBox.bottomCenter, borderBox.bottomRight,
  ];

  borderBoxPoints.forEach(point => {
    const marker = new Circle({
      radius: 3,
      style: {
        fill: borderBoxColor,
        stroke: "#000",
        strokeWidth: 1
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
}

// ============================================================================
// STEP 2: Create 3-column layout inside artboard
// ============================================================================

// ColumnsLayout automatically creates columns, so we just configure it
const columnsLayout = new ColumnsLayout({
  count: 3,
  width: 580,  // Total width (3 * 180 + 2 * 20 spacing)
  height: 400,
  spacing: 20,
  columnStyle: {
    fill: "transparent",
    stroke: "#666",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  }
});

// Access the auto-created columns
const columns = columnsLayout.columns;

// Customize each column's background color and padding
columns[0].config.style = {
  ...columns[0].config.style,
  fill: "#e7f5ff"
};
columns[0].padding = "15px";

columns[1].config.style = {
  ...columns[1].config.style,
  fill: "#d3f9d8"
};
columns[1].padding = "20px";

columns[2].config.style = {
  ...columns[2].config.style,
  fill: "#fff3bf"
};
columns[2].padding = "25px";

// CRITICAL: Force layout to happen BEFORE positioning
// This ensures dimensions are correct when position() calculates offsets
const layoutWidth = columnsLayout.width;   // Triggers layout
const layoutHeight = columnsLayout.height; // Ensures complete layout

console.log("BEFORE POSITION (after forced layout):");
console.log("  columnsLayout dimensions:", layoutWidth, "×", layoutHeight);
console.log("  columnsLayout.center:", columnsLayout.center);
console.log("  artboard.center:", artboard.center);

// Position the columns layout in the center of the artboard's content area
columnsLayout.position({
  relativeFrom: columnsLayout.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

console.log("AFTER POSITION:");
console.log("  columnsLayout.currentPosition:", columnsLayout.currentPosition);
console.log("  columnsLayout.center:", columnsLayout.center);
console.log("  columnsLayout.topLeft:", columnsLayout.topLeft);

// Check children positions
console.log("\nCHILDREN POSITIONS:");
columns.forEach((col, i) => {
  console.log(`  Column ${i + 1}:`);
  console.log(`    currentPosition:`, col.currentPosition);
  console.log(`    topLeft:`, col.topLeft);
});

// ============================================================================
// STEP 3: Add a LARGE marker at columnsLayout.center to debug
// ============================================================================

const columnsLayoutCenterMarker = new Circle({
  radius: 10,
  style: {
    fill: "#ff00ff",  // Bright magenta
    stroke: "#000",
    strokeWidth: 3
  }
});

columnsLayoutCenterMarker.position({
  relativeFrom: columnsLayoutCenterMarker.center,
  relativeTo: columnsLayout.center,
  x: 0,
  y: 0
});

artboard.addElement(columnsLayoutCenterMarker);

// ============================================================================
// STEP 4: Add markers for all elements
// ============================================================================

// Add markers for artboard
addReferenceMarkers(artboard, "#0066ff", "#ff9500");

// Add markers for each column
addReferenceMarkers(columns[0], "#74c0fc", "#ffa94d"); // Blue column
addReferenceMarkers(columns[1], "#8ce99a", "#63e6be"); // Green column
addReferenceMarkers(columns[2], "#ffd43b", "#fab005"); // Yellow column

// Add LARGE markers at each column's topLeft for debugging
columns.forEach((col, i) => {
  const topLeftMarker = new Circle({
    radius: 8,
    style: {
      fill: i === 0 ? "#ff0000" : i === 1 ? "#00ff00" : "#0000ff",
      stroke: "#000",
      strokeWidth: 2
    }
  });
  
  topLeftMarker.position({
    relativeFrom: topLeftMarker.center,
    relativeTo: col.topLeft,
    x: 0,
    y: 0
  });
  
  artboard.addElement(topLeftMarker);
});

// ============================================================================
// Add all elements
// ============================================================================

artboard.addElement(columnsLayout);

// ============================================================================
// STEP 4: Debug logging (before render)
// ============================================================================

console.log("=== BOX MODEL VISUALIZATION ===");
console.log("");
console.log("ARTBOARD:");
console.log("  Dimensions:", artboard.width, "×", artboard.height);
console.log("  Padding:", artboard.paddingBox);
console.log("  Content Box center:", artboard.center);
console.log("  Border Box center:", artboard.getBorderBox().center);
console.log("");

console.log("COLUMNS LAYOUT:");
console.log("  ColumnsLayout dimensions:", columnsLayout.width, "×", columnsLayout.height);
console.log("  ColumnsLayout center:", columnsLayout.center);
console.log("  ColumnsLayout currentPosition:", columnsLayout.currentPosition);
console.log("");

columns.forEach((col, i) => {
  console.log(`  Column ${i + 1}:`, col.width, "×", col.height);
  console.log(`    Padding:`, col.paddingBox);
  console.log(`    Content Box center:`, col.center);
  console.log(`    Border Box center:`, col.getBorderBox().center);
  console.log(`    currentPosition:`, col.currentPosition);
});
console.log("");

console.log("VISUAL GUIDE:");
console.log("  ARTBOARD:");
console.log("    🔵 Dark Blue (large) = Content Box points");
console.log("    🟠 Orange (medium) = Border Box points");
console.log("");
console.log("  COLUMNS:");
console.log("    Light colored circles = Content Box points");
console.log("    Darker colored circles = Border Box points");
console.log("");
console.log("  Each element shows padding offset between boxes!");

// ============================================================================
// Render and return
// ============================================================================

artboard.render();

