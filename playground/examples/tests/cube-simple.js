import { Artboard, Cube } from "w2l";

// Create a simple cube test
const artboard = new Artboard({
  width: 400,
  height: 400,
  style: {
    padding: 20,
    background: "#ffffff",
  },
});

const cube = new Cube({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  size: 4, // Make it bigger to match the orthographic view size
  edgeWidth: 2,
  // Using default isometric angles (arctan(1/√2) for X, 45° for Y)
});

artboard.addElement(cube);

return artboard.render();

