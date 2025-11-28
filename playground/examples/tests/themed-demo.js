/**
 * Themed Component Demo
 * 
 * This example demonstrates the new theme system with Swiss design principles:
 * - Dimmed, professional color palette
 * - Delicate highlighting with subtle borders
 * - Small paddings and border radiuses
 * - Clean, modern aesthetics
 */

import {
  Artboard,
  Rect,
  Text,
  Container,
} from "w2l";

// Create artboard - automatically uses theme
const artboard = new Artboard({
  width: 800,
  height: 600,
});

// Main container
const mainContainer = new Container({
  width: 700,
  height: 500,
  direction: "vertical",
  spacing: 24, // Clean spacing
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
});

// Title - automatically themed
const title = new Text({
  content: "Swiss Design Theme System",
  fontSize: "1.875rem", // 3xl
  style: {
    fontWeight: "700",
  },
});
mainContainer.addElement(title);

// Row container for boxes
const boxRow = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 16, // Clean spacing
  style: {
    fill: "none",
  },
});

// Standard box - automatically themed!
const standardBox = new Rect({
  width: 150,
  height: 100,
});
const standardLabel = new Text({
  content: "Standard Box",
  fontSize: "0.875rem", // sm
});
standardBox.addElement(standardLabel);
standardLabel.position({
  relativeFrom: standardLabel.center,
  relativeTo: standardBox.center,
});
boxRow.addElement(standardBox);

// Highlighted box - just override what you need
const highlightBox = new Rect({
  width: 150,
  height: 100,
  style: {
    fill: "#FAFAFA",
    stroke: "#737373",
  },
});
const highlightLabel = new Text({
  content: "Highlighted",
  fontSize: "0.875rem",
});
highlightBox.addElement(highlightLabel);
highlightLabel.position({
  relativeFrom: highlightLabel.center,
  relativeTo: highlightBox.center,
});
boxRow.addElement(highlightBox);

// Accent box - override with your colors
const accentBox = new Rect({
  width: 150,
  height: 100,
  style: {
    fill: "#FAFAFA",
    stroke: "hsl(358, 85%, 52%)", // Swiss Red
    strokeWidth: "2",
  },
});
const accentLabel = new Text({
  content: "Accent",
  fontSize: "0.875rem",
  style: {
    fill: "hsl(358, 85%, 52%)",
  },
});
accentBox.addElement(accentLabel);
accentLabel.position({
  relativeFrom: accentLabel.center,
  relativeTo: accentBox.center,
});
boxRow.addElement(accentBox);

mainContainer.addElement(boxRow);

// Color palette display
const paletteContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 8,
  style: {
    fill: "none",
  },
});

const neutralColors = ["#FAFAFA", "#F5F5F5", "#E5E5E5", "#A3A3A3", "#737373", "#525252", "#262626"];
neutralColors.forEach((color) => {
  const colorBox = new Rect({
    width: 60,
    height: 60,
    style: {
      fill: color,
      stroke: "hsl(0, 0%, 90%)",
    },
  });
  paletteContainer.addElement(colorBox);
});

mainContainer.addElement(paletteContainer);

// Typography samples - automatically themed!
const typographyContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 8,
  style: {
    fill: "none",
  },
});

const textSizes = [
  { label: "Extra Small", size: "0.75rem" },
  { label: "Small", size: "0.875rem" },
  { label: "Base", size: "1rem" },
  { label: "Large", size: "1.25rem" },
  { label: "2X Large", size: "1.5rem" },
];

textSizes.forEach(({ label, size }) => {
  const text = new Text({
    content: `${label} Text`,
    fontSize: size,
  });
  typographyContainer.addElement(text);
});

mainContainer.addElement(typographyContainer);

// Position main container in center of artboard
artboard.addElement(mainContainer);
mainContainer.position({
  relativeFrom: mainContainer.center,
  relativeTo: artboard.center,
});

return artboard.render();
