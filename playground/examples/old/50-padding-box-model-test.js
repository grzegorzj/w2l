// Padding Box Model Test
// Demonstrates that padding ADDS to element dimensions (CSS content-box behavior)
// Organized entirely with layouts - no absolute positioning needed!

import { Artboard, Rectangle, Circle, Text, GridLayout, VStack, HStack } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// ============================================================================
// Top-level VStack organizes everything vertically
// ============================================================================

const mainLayout = new VStack({
  spacing: 30,
  horizontalAlign: "center",
  autoWidth: true,
  autoHeight: true,
});

// ============================================================================
// Header Section
// ============================================================================

const headerSection = new VStack({
  spacing: 10,
  horizontalAlign: "center",
  autoWidth: true,
  autoHeight: true,
});

const title = new Text({
  content: "Padding Box Model Test",
  fontSize: 28,
  style: { fill: "#212529", fontWeight: "bold" },
});

const subtitle = new Text({
  content: "Padding adds to dimensions (CSS content-box behavior)",
  fontSize: 14,
  style: { fill: "#6c757d" },
});

headerSection.addElement(title);
headerSection.addElement(subtitle);

// ============================================================================
// Three Columns - Each testing a different layout
// ============================================================================

const columnsRow = new HStack({
  spacing: 40,
  verticalAlign: "top",
  autoWidth: true,
  autoHeight: true,
});

// ----------------------------------------------------------------------------
// COLUMN 1: GridLayout Test
// ----------------------------------------------------------------------------

const column1 = new VStack({
  spacing: 15,
  horizontalAlign: "center",
  autoWidth: true,
  autoHeight: true,
});

// Header
const header1 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2,
  },
});

header1.addElement(
  new Text({
    content: "GridLayout",
    fontSize: 18,
    style: { fill: "#1971c2", fontWeight: "bold" },
  })
);

header1.addElement(
  new Text({
    content: "width: 280, height: 220\npadding: 20px",
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: "center",
    style: { fill: "#1864ab" },
  })
);

// Test Grid
const testGrid = new GridLayout({
  width: 280,
  height: 220,
  padding: "20px",
  columns: 2,
  rows: 2,
  columnGap: "15px",
  rowGap: "15px",
  style: {
    fill: "#d0ebff",
    stroke: "#339af0",
    strokeWidth: 2,
  },
});

["#4dabf7", "#339af0", "#228be6", "#1c7ed6"].forEach((color) => {
  testGrid.addElement(
    new Rectangle({
      width: 50,
      height: 50,
      style: { fill: color, stroke: "#1971c2", strokeWidth: 1 },
    })
  );
});

// Result
const result1 = new Text({
  content: `Total: ${testGrid.width.toFixed(0)}×${testGrid.height.toFixed(0)}`,
  fontSize: 12,
  style: {
    fill: testGrid.width === 320 && testGrid.height === 260 ? "#2f9e44" : "#e03131",
    fontWeight: "bold",
  },
});

column1.addElement(header1);
column1.addElement(testGrid);
column1.addElement(result1);

// ----------------------------------------------------------------------------
// COLUMN 2: VStack Test
// ----------------------------------------------------------------------------

const column2 = new VStack({
  spacing: 15,
  horizontalAlign: "center",
  autoWidth: true,
  autoHeight: true,
});

// Header
const header2 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#d3f9d8",
    stroke: "#2f9e44",
    strokeWidth: 2,
  },
});

header2.addElement(
  new Text({
    content: "VStack",
    fontSize: 18,
    style: { fill: "#2f9e44", fontWeight: "bold" },
  })
);

header2.addElement(
  new Text({
    content: "Auto-sized content\npadding: 20px",
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: "center",
    style: { fill: "#2b8a3e" },
  })
);

// Test VStack
const testVStack = new VStack({
  spacing: 12,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "left",
  style: {
    fill: "#b2f2bb",
    stroke: "#51cf66",
    strokeWidth: 2,
  },
});

["Item Alpha", "Item Beta", "Item Gamma"].forEach((text, i) => {
  const row = new HStack({
    spacing: 10,
    autoWidth: true,
    autoHeight: true,
    verticalAlign: "center",
  });

  row.addElement(
    new Circle({
      radius: 6,
      style: { fill: ["#37b24d", "#2f9e44", "#2b8a3e"][i] },
    })
  );

  row.addElement(
    new Text({
      content: text,
      fontSize: 13,
      style: { fill: "#2b8a3e" },
    })
  );

  testVStack.addElement(row);
});

// Result
const result2 = new Text({
  content: `Total: ${testVStack.width.toFixed(0)}×${testVStack.height.toFixed(0)}`,
  fontSize: 12,
  style: { fill: "#2f9e44", fontWeight: "bold" },
});

column2.addElement(header2);
column2.addElement(testVStack);
column2.addElement(result2);

// ----------------------------------------------------------------------------
// COLUMN 3: HStack Test
// ----------------------------------------------------------------------------

const column3 = new VStack({
  spacing: 15,
  horizontalAlign: "center",
  autoWidth: true,
  autoHeight: true,
});

// Header
const header3 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#fff3bf",
    stroke: "#f59f00",
    strokeWidth: 2,
  },
});

header3.addElement(
  new Text({
    content: "HStack",
    fontSize: 18,
    style: { fill: "#f59f00", fontWeight: "bold" },
  })
);

header3.addElement(
  new Text({
    content: "Auto-sized content\npadding: 20px",
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: "center",
    style: { fill: "#e67700" },
  })
);

// Test HStack
const testHStack = new HStack({
  spacing: 15,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  verticalAlign: "center",
  style: {
    fill: "#ffe8cc",
    stroke: "#fd7e14",
    strokeWidth: 2,
  },
});

[45, 45, 45].forEach((size, i) => {
  const colors = ["#ff922b", "#fd7e14", "#f59f00"];
  if (i === 1) {
    testHStack.addElement(
      new Rectangle({
        width: size,
        height: size,
        style: { fill: colors[i], stroke: "#e67700", strokeWidth: 2 },
      })
    );
  } else {
    testHStack.addElement(
      new Circle({
        radius: size / 2,
        style: { fill: colors[i], stroke: "#e67700", strokeWidth: 2 },
      })
    );
  }
});

// Result
const result3 = new Text({
  content: `Total: ${testHStack.width.toFixed(0)}×${testHStack.height.toFixed(0)}`,
  fontSize: 12,
  style: { fill: "#f59f00", fontWeight: "bold" },
});

column3.addElement(header3);
column3.addElement(testHStack);
column3.addElement(result3);

// Add all columns
columnsRow.addElement(column1);
columnsRow.addElement(column2);
columnsRow.addElement(column3);

// ============================================================================
// Legend Section at Bottom
// ============================================================================

const legend = new VStack({
  spacing: 10,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "left",
  style: {
    fill: "#ffffff",
    stroke: "#adb5bd",
    strokeWidth: 1,
  },
});

legend.addElement(
  new Text({
    content: "Box Model Rules:",
    fontSize: 14,
    style: { fill: "#212529", fontWeight: "bold" },
  })
);

legend.addElement(
  new Text({
    content: "✓ width/height = content area size",
    fontSize: 12,
    style: { fill: "#495057" },
  })
);

legend.addElement(
  new Text({
    content: "✓ padding is added to total size",
    fontSize: 12,
    style: { fill: "#495057" },
  })
);

legend.addElement(
  new Text({
    content: "✓ children positioned within padded area",
    fontSize: 12,
    style: { fill: "#495057" },
  })
);

// ============================================================================
// Assemble Main Layout
// ============================================================================

mainLayout.addElement(headerSection);
mainLayout.addElement(columnsRow);
mainLayout.addElement(legend);

// Position the entire layout once, centered on artboard
mainLayout.position({
  relativeFrom: mainLayout.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

// ============================================================================
// Add to Artboard and Render
// ============================================================================

artboard.addElement(mainLayout);
artboard.render();
