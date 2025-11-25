/**
 * Example: Box Model Showcase with Columns, Grids, and Containers
 *
 * Demonstrates:
 * - Box model (padding, border, margin) with visual debugging
 * - Columns layout with different alignments
 * - Grid layout with nested content
 * - Horizontal and vertical containers with various alignments
 * - Top-level horizontal organization
 */

import {
  NewArtboard,
  NewContainer,
  Columns,
  Grid,
  NewRect,
  NewCircle,
} from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#1a1a2e",
  boxModel: { padding: 40 },
});

// Helper to create debug circles at box corners
function createDebugCircle(position, color = "#fff", radius = 4) {
  const circle = new NewCircle({
    radius,
    style: { fill: color, stroke: "#000", strokeWidth: 1 },
  });
  circle.position({
    relativeFrom: circle.center,
    relativeTo: position,
    x: 0,
    y: 0,
  });
  return circle;
}

// ===== TOP-LEVEL HORIZONTAL CONTAINER =====
// This organizes the entire layout horizontally
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top", // Align children to top
  boxModel: {
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    border: { top: 3, right: 3, bottom: 3, left: 3 },
  },
  style: {
    fill: "#16213e",
    stroke: "#0f3460",
    strokeWidth: 3,
  },
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

// ===== LEFT SECTION: COLUMNS WITH DIFFERENT ALIGNMENTS =====
const leftSection = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center", // Center children horizontally
  boxModel: {
    padding: 20,
    border: 2,
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 2,
  },
});

mainContainer.addElement(leftSection);

// Columns with LEFT alignment
const leftAlignColumns = new Columns({
  count: 2,
  columnWidth: 160,
  height: 200,
  gutter: 15,
  horizontalAlignment: "left", // Left-align within columns
  verticalAlignment: "top",
  style: {
    fill: "#533483",
    stroke: "#8b5cf6",
    strokeWidth: 2,
  },
  columnStyle: {
    fill: "#6b21a8",
  },
  boxModel: { padding: 10, border: 2 },
  columnBoxModel: { padding: 8 },
});

leftSection.addElement(leftAlignColumns.container);

// Add content to left-aligned columns
for (let i = 0; i < 2; i++) {
  const sizes = [60, 80, 50];
  const vstack = new NewContainer({
    width: "auto",
    height: "auto",
    direction: "vertical",
    spacing: 8,
    horizontalAlignment: "left",
  });

  sizes.forEach((height) => {
    const rect = new NewRect({
      width: 100 - i * 20,
      height: height,
      style: {
        fill: "#ec4899",
        stroke: "#be185d",
        strokeWidth: 2,
      },
    });
    vstack.addElement(rect);
  });

  leftAlignColumns.getColumn(i).addElement(vstack);
}

// Columns with CENTER alignment
const centerAlignColumns = new Columns({
  count: 2,
  columnWidth: 160,
  height: 200,
  gutter: 15,
  horizontalAlignment: "center", // Center-align within columns
  verticalAlignment: "center",
  style: {
    fill: "#1e3a8a",
    stroke: "#3b82f6",
    strokeWidth: 2,
  },
  columnStyle: {
    fill: "#1e40af",
  },
  boxModel: { padding: 10, border: 2 },
  columnBoxModel: { padding: 8 },
});

leftSection.addElement(centerAlignColumns.container);

// Add circles to center-aligned columns
for (let i = 0; i < 2; i++) {
  const radii = [25, 35, 30];
  const vstack = new NewContainer({
    width: "auto",
    height: "auto",
    direction: "vertical",
    spacing: 10,
    horizontalAlignment: "center",
  });

  radii.forEach((radius) => {
    const circle = new NewCircle({
      radius: radius,
      style: {
        fill: "#06b6d4",
        stroke: "#0891b2",
        strokeWidth: 2,
      },
    });
    vstack.addElement(circle);
  });

  centerAlignColumns.getColumn(i).addElement(vstack);
}

// Columns with RIGHT alignment
const rightAlignColumns = new Columns({
  count: 2,
  columnWidth: 160,
  height: 200,
  gutter: 15,
  horizontalAlignment: "right", // Right-align within columns
  verticalAlignment: "bottom",
  style: {
    fill: "#065f46",
    stroke: "#10b981",
    strokeWidth: 2,
  },
  columnStyle: {
    fill: "#047857",
  },
  boxModel: { padding: 10, border: 2 },
  columnBoxModel: { padding: 8 },
});

leftSection.addElement(rightAlignColumns.container);

// Add mixed content to right-aligned columns
for (let i = 0; i < 2; i++) {
  const vstack = new NewContainer({
    width: "auto",
    height: "auto",
    direction: "vertical",
    spacing: 8,
    horizontalAlignment: "right",
  });

  const rect = new NewRect({
    width: 90 - i * 15,
    height: 60,
    style: {
      fill: "#34d399",
      stroke: "#059669",
      strokeWidth: 2,
    },
  });

  const circle = new NewCircle({
    radius: 30,
    style: {
      fill: "#6ee7b7",
      stroke: "#10b981",
      strokeWidth: 2,
    },
  });

  vstack.addElement(rect);
  vstack.addElement(circle);

  rightAlignColumns.getColumn(i).addElement(vstack);
}

// ===== MIDDLE SECTION: GRID WITH BOX MODEL =====
const middleSection = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 15,
  horizontalAlignment: "center",
  boxModel: {
    padding: { top: 25, right: 25, bottom: 25, left: 25 },
    border: { top: 3, right: 3, bottom: 3, left: 3 },
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 3,
  },
});

mainContainer.addElement(middleSection);

// Grid with heavy box model styling
const mainGrid = new Grid({
  rows: 3,
  columns: 3,
  cellWidth: 110,
  cellHeight: 110,
  gutter: 12,
  style: {
    fill: "#7c2d12",
    stroke: "#f97316",
    strokeWidth: 2,
  },
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
});

middleSection.addElement(mainGrid.container);

// Fill grid with different patterns showing box model
const colors = [
  "#ef4444",
  "#f59e0b",
  "#84cc16",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#3b82f6",
];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const idx = row * 3 + col;
    const cell = mainGrid.getCell(row, col);

    // Alternate between rect and circle
    if ((row + col) % 2 === 0) {
      const rect = new NewRect({
        width: 70,
        height: 70,
        style: {
          fill: colors[idx],
          stroke: "#fff",
          strokeWidth: 2,
        },
      });

      rect.position({
        relativeFrom: rect.center,
        relativeTo: cell.contentBox.center,
        x: 0,
        y: 0,
      });

      cell.addElement(rect);

      // Add debug circles at corners to show box model
      const debugMarkers = [
        createDebugCircle(cell.contentBox.topLeft, "#fff", 3),
        createDebugCircle(cell.contentBox.topRight, "#fff", 3),
        createDebugCircle(cell.contentBox.bottomLeft, "#fff", 3),
        createDebugCircle(cell.contentBox.bottomRight, "#fff", 3),
      ];

      debugMarkers.forEach((marker) => cell.addElement(marker));
    } else {
      const circle = new NewCircle({
        radius: 35,
        style: {
          fill: colors[idx],
          stroke: "#fff",
          strokeWidth: 2,
        },
      });

      circle.position({
        relativeFrom: circle.center,
        relativeTo: cell.contentBox.center,
        x: 0,
        y: 0,
      });

      cell.addElement(circle);
    }
  }
}

// Horizontal spread container below grid
const spreadContainer = new NewContainer({
  width: 400,
  height: 120,
  direction: "horizontal",
  spread: true,
  verticalAlignment: "center",
  boxModel: {
    padding: 15,
    border: 2,
  },
  style: {
    fill: "#422006",
    stroke: "#fbbf24",
    strokeWidth: 2,
  },
});

middleSection.addElement(spreadContainer);

// Add items to spread
for (let i = 0; i < 4; i++) {
  const rect = new NewRect({
    width: 60,
    height: 80,
    style: {
      fill: "#fbbf24",
      stroke: "#f59e0b",
      strokeWidth: 2,
    },
  });
  spreadContainer.addElement(rect);
}

// ===== RIGHT SECTION: NESTED CONTAINERS WITH ALIGNMENTS =====
const rightSection = new NewContainer({
  width: "auto", // Auto-size to content
  height: "auto", // Auto-size to content
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
  boxModel: {
    padding: 20,
    border: 2,
  },
  style: {
    fill: "#0f3460",
    stroke: "#e94560",
    strokeWidth: 2,
  },
});

mainContainer.addElement(rightSection);

// Top: Vertical container with left alignment
const topVertical = new NewContainer({
  width: 350,
  height: 180,
  direction: "vertical",
  spacing: 12,
  horizontalAlignment: "left", // Left align
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#1e293b",
    stroke: "#64748b",
    strokeWidth: 2,
  },
});

rightSection.addElement(topVertical);

// Add progressively wider rectangles
[100, 200, 300].forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 40,
    style: {
      fill: ["#dc2626", "#ea580c", "#ca8a04"][idx],
      stroke: "#fff",
      strokeWidth: 2,
    },
  });
  topVertical.addElement(rect);
});

// Middle: Horizontal container with bottom alignment
const middleHorizontal = new NewContainer({
  width: 350,
  height: 150,
  direction: "horizontal",
  spacing: 10,
  verticalAlignment: "bottom", // Bottom align
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#1e293b",
    stroke: "#64748b",
    strokeWidth: 2,
  },
});

rightSection.addElement(middleHorizontal);

// Add rectangles of different heights
[60, 90, 50, 80].forEach((height, idx) => {
  const rect = new NewRect({
    width: 70,
    height: height,
    style: {
      fill: ["#7c3aed", "#a855f7", "#c084fc", "#e9d5ff"][idx],
      stroke: "#fff",
      strokeWidth: 2,
    },
  });
  middleHorizontal.addElement(rect);
});

// Bottom: Small grid with box model visualization
const smallGrid = new Grid({
  rows: 2,
  columns: 4,
  cellWidth: 75,
  cellHeight: 75,
  gutter: 8,
  style: {
    fill: "#052e16",
    stroke: "#16a34a",
    strokeWidth: 2,
  },
  boxModel: {
    padding: 12,
    border: 2,
  },
});

rightSection.addElement(smallGrid.container);

// Fill small grid with circles
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const cell = smallGrid.getCell(row, col);

    const circle = new NewCircle({
      radius: 25,
      style: {
        fill: "#22c55e",
        stroke: "#15803d",
        strokeWidth: 2,
      },
    });

    circle.position({
      relativeFrom: circle.center,
      relativeTo: cell.contentBox.center,
      x: 0,
      y: 0,
    });

    cell.addElement(circle);
  }
}

// Vertical spread at bottom
const verticalSpread = new NewContainer({
  width: 120,
  height: 300,
  direction: "vertical",
  spread: true,
  horizontalAlignment: "center",
  boxModel: {
    padding: 12,
    border: 2,
  },
  style: {
    fill: "#581c87",
    stroke: "#a855f7",
    strokeWidth: 2,
  },
});

rightSection.addElement(verticalSpread);

// Add items to vertical spread
for (let i = 0; i < 3; i++) {
  const rect = new NewRect({
    width: 80,
    height: 50,
    style: {
      fill: "#c026d3",
      stroke: "#e879f9",
      strokeWidth: 2,
    },
  });
  verticalSpread.addElement(rect);
}

// ===== ADD DEBUG MARKERS FOR MAIN CONTAINER BOX MODEL =====
const mainDebugMarkers = [
  // Content box corners (white)
  createDebugCircle(mainContainer.contentBox.topLeft, "#fff", 6),
  createDebugCircle(mainContainer.contentBox.topRight, "#fff", 6),
  createDebugCircle(mainContainer.contentBox.bottomLeft, "#fff", 6),
  createDebugCircle(mainContainer.contentBox.bottomRight, "#fff", 6),
  // Border box corners (yellow)
  createDebugCircle(mainContainer.topLeft, "#fbbf24", 5),
  createDebugCircle(mainContainer.topRight, "#fbbf24", 5),
  createDebugCircle(mainContainer.bottomLeft, "#fbbf24", 5),
  createDebugCircle(mainContainer.bottomRight, "#fbbf24", 5),
];

// Add main container and debug markers to artboard
artboard.addElement(mainContainer);

mainDebugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();
