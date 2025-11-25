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

artboard.addElement(mainContainer);

return artboard.render();
