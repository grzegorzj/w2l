// Example 23: Reactive Positioning - Lines that follow elements
import { Artboard, Rectangle, Circle, Line } from "../../dist/index.js";

export default function example23() {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
    backgroundColor: "#2c3e50"
  });

  // Create two boxes that we'll connect with lines
  const leftBox = new Rectangle({
    width: 100,
    height: 100,
    name: "left-box",
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: "3"
    }
  });

  leftBox.position({
    relativeFrom: leftBox.center,
    relativeTo: artboard.center,
    x: -200,
    y: -100
  });

  const rightBox = new Rectangle({
    width: 100,
    height: 100,
    name: "right-box",
    style: {
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: "3"
    }
  });

  rightBox.position({
    relativeFrom: rightBox.center,
    relativeTo: artboard.center,
    x: 200,
    y: -100
  });

  // REACTIVE LINE (default: absolute = false)
  // This line will automatically update when leftBox or rightBox move!
  const reactiveLine = new Line({
    start: leftBox.center,
    end: rightBox.center,
    name: "reactive-connector",
    style: {
      stroke: "#2ecc71",
      strokeWidth: "4"
    }
    // absolute: false is the default - maintains binding to source elements
  });

  // Create circles at the bottom
  const leftCircle = new Circle({
    radius: 50,
    name: "left-circle",
    style: {
      fill: "#9b59b6",
      stroke: "#8e44ad",
      strokeWidth: "3"
    }
  });

  leftCircle.position({
    relativeFrom: leftCircle.center,
    relativeTo: artboard.center,
    x: -200,
    y: 150
  });

  const rightCircle = new Circle({
    radius: 50,
    name: "right-circle",
    style: {
      fill: "#f39c12",
      stroke: "#d68910",
      strokeWidth: "3"
    }
  });

  rightCircle.position({
    relativeFrom: rightCircle.center,
    relativeTo: artboard.center,
    x: 200,
    y: 150
  });

  // ABSOLUTE LINE (absolute = true)
  // This line captures current positions and won't update when circles move
  const absoluteLine = new Line({
    start: leftCircle.center,
    end: rightCircle.center,
    name: "absolute-connector",
    absolute: true,  // Captures current values, no reactive binding
    style: {
      stroke: "#e67e22",
      strokeWidth: "4",
      strokeDasharray: "10,5"
    }
  });

  // Add all elements
  artboard.addElement(leftBox);
  artboard.addElement(rightBox);
  artboard.addElement(reactiveLine);
  artboard.addElement(leftCircle);
  artboard.addElement(rightCircle);
  artboard.addElement(absoluteLine);

  // NOW MOVE THE ELEMENTS!
  // The reactive line will follow leftBox and rightBox
  // The absolute line will stay fixed

  // Move left box down
  leftBox.position({
    relativeFrom: leftBox.center,
    relativeTo: leftBox.center,
    x: 0,
    y: 80
  });

  // Move right box up
  rightBox.position({
    relativeFrom: rightBox.center,
    relativeTo: rightBox.center,
    x: 0,
    y: -80
  });

  // Move left circle (absolute line won't follow)
  leftCircle.position({
    relativeFrom: leftCircle.center,
    relativeTo: leftCircle.center,
    x: -50,
    y: 0
  });

  // Rotate right circle (absolute line won't follow)
  rightCircle.position({
    relativeFrom: rightCircle.center,
    relativeTo: rightCircle.center,
    x: 50,
    y: 0
  });

  return artboard;
}

export const description = `
# Reactive Positioning

This example demonstrates the powerful **reactive positioning** system:

## Reactive Lines (default)
- The **green line** connects the two rectangles
- When rectangles move, the line **automatically updates**
- \`absolute: false\` (default) maintains binding to source elements

## Absolute Lines
- The **orange dashed line** connects the two circles
- When circles move, the line **stays fixed**
- \`absolute: true\` captures current positions

## Key Features
1. **Automatic Updates**: Lines follow their bound elements
2. **Performance**: Efficient update mechanism
3. **Flexibility**: Choose reactive or absolute per element
4. **No Manual Updates**: Just move elements, lines follow

## Try It
Uncomment the movement code to see lines behave differently:
- Reactive line follows the rectangles
- Absolute line stays in original position

## Use Cases
- **Diagrams**: Connect nodes that can be repositioned
- **Flowcharts**: Dynamic connections between steps
- **Mind Maps**: Flexible layouts with auto-updating connections
- **Network Graphs**: Nodes and edges that stay connected
`;

