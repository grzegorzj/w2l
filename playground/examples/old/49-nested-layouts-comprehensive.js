// Comprehensive Nested Layouts Example
// Demonstrates GridLayout, HStack, VStack all working together with auto-sizing
// Shows off the new phase system preventing circular dependencies!

import { Artboard, Rectangle, Circle, Text, GridLayout, HStack, VStack, ColumnsLayout } from "w2l";

const artboard = new Artboard({
  size: { width: 1200, height: 900 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Show the padding area
});

// Create a main grid layout with 2 columns
// Note: width/height specify CONTENT area, padding is added to total size
const mainGrid = new GridLayout({
  width: 1000,     // Content area width
  height: 600,     // Content area height
  columns: 2,
  columnGap: "30px",
  rowGap: "30px",
  padding: "20px", // Adds 40px to total size (20px × 2)
  style: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 2
  }
  // Total size will be 1040 × 640
});

mainGrid.position({
  relativeFrom: mainGrid.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// ============================================================================
// Cell 1: VStack with auto-sizing and text elements
// ============================================================================

const cell1VStack = new VStack({
  spacing: 15,
  horizontalAlign: "left",
  padding: "20px",
  autoHeight: true,  // ✅ Auto-sizes based on children!
  autoWidth: true,   // ✅ No circular dependencies!
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2
  }
});

// Add text elements (will be measured in Phase 1)
const title1 = new Text({
  content: "Auto-Sizing VStack",
  fontSize: 18,
  style: { fill: "#1971c2", fontWeight: "bold" }
});

const desc1 = new Text({
  content: "This VStack automatically\nsizes to fit its content!",
  fontSize: 14,
  lineHeight: 1.5,
  style: { fill: "#495057" }
});

const stat1 = new Text({
  content: "✓ Phase System Working",
  fontSize: 12,
  style: { fill: "#2f9e44" }
});

cell1VStack.addElement(title1);
cell1VStack.addElement(desc1);
cell1VStack.addElement(stat1);

// Add color indicators
const colorBar1 = new Rectangle({
  width: 150,
  height: 8,
  style: { fill: "#1971c2" }
});
cell1VStack.addElement(colorBar1);

// ============================================================================
// Cell 2: HStack with mixed elements
// ============================================================================

// Using ColumnsLayout instead of HStack to test positioning
const cell2HStack = new ColumnsLayout({
  count: 3,
  width: 200,  // Approximate: 50 (circle) + 20 (spacing) + 80 (text) + 20 (spacing) + 50 (circle)
  height: 100,
  spacing: 20,
  padding: "20px",
  style: {
    fill: "#fff3bf",
    stroke: "#f59f00",
    strokeWidth: 2
  },
  columnStyle: {
    fill: "transparent",
    stroke: "none"
  }
});

// Add circles and text to columns
const circle1 = new Circle({
  radius: 25,
  style: { fill: "#f59f00", stroke: "#f08c00", strokeWidth: 2 }
});

const hstackText = new Text({
  content: "Columns\nwith\ncircles",
  fontSize: 14,
  textAlign: "center",
  lineHeight: 1.3,
  style: { fill: "#495057" }
});

const circle2 = new Circle({
  radius: 25,
  style: { fill: "#fab005", stroke: "#f59f00", strokeWidth: 2 }
});

// Add to columns - ColumnsLayout automatically centers elements in each column
cell2HStack.columns[0].addElement(circle1);
cell2HStack.columns[1].addElement(hstackText);
cell2HStack.columns[2].addElement(circle2);

// ============================================================================
// Cell 3: Nested layouts (VStack containing HStacks)
// ============================================================================

const cell3Container = new VStack({
  spacing: 15,
  padding: "20px",
  autoHeight: true,
  autoWidth: true,
  style: {
    fill: "#d3f9d8",
    stroke: "#2f9e44",
    strokeWidth: 2
  }
});

// Title for nested section
const nestedTitle = new Text({
  content: "Nested Layouts",
  fontSize: 16,
  style: { fill: "#2f9e44", fontWeight: "bold" }
});
cell3Container.addElement(nestedTitle);

// First nested HStack
const nestedHStack1 = new ColumnsLayout({
  count: 2,
  width: 100,  // Approximate: 30 (icon) + 10 (spacing) + 60 (text)
  height: 40,
  spacing: 10,
  padding: "10px",
  style: {
    fill: "#fff",
    stroke: "#51cf66",
    strokeWidth: 1
  },
  columnStyle: {
    fill: "transparent",
    stroke: "none"
  }
});

const icon1 = new Circle({
  radius: 15,
  style: { fill: "#51cf66" }
});

const label1 = new Text({
  content: "Row 1",
  fontSize: 12,
  style: { fill: "#2f9e44" }
});

nestedHStack1.columns[0].addElement(icon1);
nestedHStack1.columns[1].addElement(label1);
cell3Container.addElement(nestedHStack1);

// Second nested HStack (using ColumnsLayout)
const nestedHStack2 = new ColumnsLayout({
  count: 2,
  width: 100,  // Approximate: 30 (icon) + 10 (spacing) + 60 (text)
  height: 40,
  spacing: 10,
  padding: "10px",
  style: {
    fill: "#fff",
    stroke: "#51cf66",
    strokeWidth: 1
  },
  columnStyle: {
    fill: "transparent",
    stroke: "none"
  }
});

const icon2 = new Circle({
  radius: 15,
  style: { fill: "#40c057" }
});

const label2 = new Text({
  content: "Row 2",
  fontSize: 12,
  style: { fill: "#2f9e44" }
});

nestedHStack2.columns[0].addElement(icon2);
nestedHStack2.columns[1].addElement(label2);
cell3Container.addElement(nestedHStack2);

// ============================================================================
// Cell 4: Complex nested structure (Grid in VStack)
// ============================================================================

const cell4Container = new VStack({
  spacing: 15,
  padding: "20px",
  autoHeight: true,
  autoWidth: true,
  style: {
    fill: "#ffe3e3",
    stroke: "#e03131",
    strokeWidth: 2
  }
});

const complexTitle = new Text({
  content: "Grid Inside VStack",
  fontSize: 16,
  style: { fill: "#e03131", fontWeight: "bold" }
});
cell4Container.addElement(complexTitle);

// Small grid inside the VStack
const miniGrid = new GridLayout({
  cellWidth: 35,
  cellHeight: 35,
  columns: 3,
  rows: 2,
  columnGap: "8px",
  rowGap: "8px",
  padding: "10px",
  style: {
    fill: "#fff",
    stroke: "#f783ac",
    strokeWidth: 1
  }
});

// Add small colored squares to mini grid
const colors = ["#ff6b6b", "#ff8787", "#ffa8a8", "#fa5252", "#f03e3e", "#e03131"];
colors.forEach(color => {
  const square = new Rectangle({
    // Grid will size these based on cellWidth/cellHeight
    width: 35,
    height: 35,
    style: { fill: color, stroke: "#c92a2a", strokeWidth: 1 }
  });
  miniGrid.addElement(square);
});

cell4Container.addElement(miniGrid);

// Status text
const statusText = new Text({
  content: "✓ All layouts sized",
  fontSize: 11,
  style: { fill: "#c92a2a" }
});
cell4Container.addElement(statusText);

// ============================================================================
// Add all cells to main grid
// ============================================================================

mainGrid.addElement(cell1VStack);
mainGrid.addElement(cell2HStack);
mainGrid.addElement(cell3Container);
mainGrid.addElement(cell4Container);

// ============================================================================
// Add title and description above the grid
// ============================================================================

const mainTitle = new Text({
  content: "Nested Layouts Showcase",
  fontSize: 28,
  style: { fill: "#212529", fontWeight: "bold" }
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: mainGrid.getBorderBox().topCenter,
  x: 0,
  y: -60
});

const mainDesc = new Text({
  content: "GridLayout containing VStacks, HStacks, and nested layouts • All auto-sizing without circular dependencies",
  fontSize: 13,
  style: { fill: "#6c757d" }
});

mainDesc.position({
  relativeFrom: mainDesc.center,
  relativeTo: mainGrid.getBorderBox().topCenter,
  x: 0,
  y: -35
});

// ============================================================================
// Add legend at bottom
// ============================================================================

const legendContainer = new HStack({
  spacing: 30,
  verticalAlign: "center",
  autoWidth: true,
  autoHeight: true,
  padding: "15px",
  style: {
    fill: "#f8f9fa",
    stroke: "#adb5bd",
    strokeWidth: 1
  }
});

const legendItems = [
  { color: "#1971c2", label: "VStack" },
  { color: "#f59f00", label: "HStack" },
  { color: "#2f9e44", label: "Nested" },
  { color: "#e03131", label: "Grid" }
];

legendItems.forEach(({ color, label }) => {
  const legendItem = new HStack({
    spacing: 8,
    verticalAlign: "center",
    autoWidth: true,
    autoHeight: true
  });
  
  const legendCircle = new Circle({
    radius: 6,
    style: { fill: color }
  });
  
  const legendText = new Text({
    content: label,
    fontSize: 11,
    style: { fill: "#495057" }
  });
  
  legendItem.addElement(legendCircle);
  legendItem.addElement(legendText);
  legendContainer.addElement(legendItem);
});

legendContainer.position({
  relativeFrom: legendContainer.center,
  relativeTo: mainGrid.getBorderBox().bottomCenter,
  x: 0,
  y: 50
});

// ============================================================================
// Add phase indicator
// ============================================================================

const phaseIndicator = new Text({
  content: "🎯 Phase System: Measure → Layout → Render",
  fontSize: 10,
  style: { fill: "#868e96", fontStyle: "italic" }
});

phaseIndicator.position({
  relativeFrom: phaseIndicator.center,
  relativeTo: artboard.center,
  x: 0,
  y: 420
});

// ============================================================================
// Add all elements to artboard
// ============================================================================

artboard.addElement(mainGrid);
artboard.addElement(mainTitle);
artboard.addElement(mainDesc);
artboard.addElement(legendContainer);
artboard.addElement(phaseIndicator);

// Render everything!
// Phase 1: All text elements are measured
// Phase 2: All layouts calculate their sizes (bottom-up)
// Phase 3: Everything is positioned and rendered
artboard.render();

