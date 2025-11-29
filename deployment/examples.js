/**
 * Example W2L code snippets for testing the renderer API
 */

export const examples = {
  // Simple circle
  simpleCircle: `
    import { Artboard, Circle } from "w2l";
    
    const artboard = new Artboard({
      width: 400,
      height: 400,
      backgroundColor: "#f5f5f5",
      boxModel: { padding: 20 }
    });
    
    const circle = new Circle({
      radius: 100,
      style: {
        fill: "#3498db",
        stroke: "#2980b9",
        strokeWidth: 3
      }
    });
    
    circle.position({
      relativeFrom: circle.center,
      relativeTo: artboard.contentBox.center,
      x: 0,
      y: 0
    });
    
    artboard.addElement(circle);
    return artboard.render();
  `,

  // Multiple shapes
  multipleShapes: `
    import { Artboard, Circle, Square, Triangle } from "w2l";
    
    const artboard = new Artboard({
      width: 600,
      height: 400,
      backgroundColor: "#ecf0f1",
      boxModel: { padding: 30 }
    });
    
    const circle = new Circle({
      radius: 60,
      style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: 2 }
    });
    
    const square = new Square({
      side: 120,
      style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 2 }
    });
    
    const triangle = new Triangle({
      type: "equilateral",
      a: 120,
      style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: 2 }
    });
    
    circle.position({
      relativeFrom: circle.center,
      relativeTo: artboard.contentBox.topLeft,
      x: 100,
      y: 100
    });
    
    square.position({
      relativeFrom: square.center,
      relativeTo: artboard.contentBox.center,
      x: 0,
      y: 0
    });
    
    triangle.position({
      relativeFrom: triangle.center,
      relativeTo: artboard.contentBox.bottomRight,
      x: -100,
      y: -80
    });
    
    artboard.addElement(circle);
    artboard.addElement(square);
    artboard.addElement(triangle);
    
    return artboard.render();
  `,

  // Text and shapes
  textAndShapes: `
    import { Artboard, Circle, Text } from "w2l";
    
    const artboard = new Artboard({
      width: 500,
      height: 300,
      backgroundColor: "#ffffff",
      boxModel: { padding: 40 }
    });
    
    const circle = new Circle({
      radius: 80,
      style: {
        fill: "#9b59b6",
        stroke: "#8e44ad",
        strokeWidth: 3
      }
    });
    
    circle.position({
      relativeFrom: circle.center,
      relativeTo: artboard.contentBox.center,
      x: 0,
      y: -20
    });
    
    const title = new Text({
      content: "Hello W2L!",
      fontSize: 32,
      fontWeight: "bold",
      style: { fill: "#2c3e50" }
    });
    
    title.position({
      relativeFrom: title.center,
      relativeTo: artboard.contentBox.center,
      x: 0,
      y: 80
    });
    
    artboard.addElement(circle);
    artboard.addElement(title);
    
    return artboard.render();
  `,

  // Bar chart
  barChart: `
    import { Artboard, BarChart } from "w2l";
    
    const artboard = new Artboard({
      width: 600,
      height: 400,
      backgroundColor: "#f8f9fa",
      boxModel: { padding: 40 }
    });
    
    const chart = new BarChart({
      data: [
        { label: "Jan", value: 65 },
        { label: "Feb", value: 78 },
        { label: "Mar", value: 90 },
        { label: "Apr", value: 81 },
        { label: "May", value: 95 }
      ],
      width: 520,
      height: 320,
      style: {
        fill: "#3498db",
        stroke: "#2980b9",
        strokeWidth: 2
      }
    });
    
    chart.position({
      relativeFrom: chart.topLeft,
      relativeTo: artboard.contentBox.topLeft,
      x: 0,
      y: 0
    });
    
    artboard.addElement(chart);
    
    return artboard.render();
  `,

  // Layout with containers
  layoutContainers: `
    import { Artboard, Container, Circle, Text } from "w2l";
    
    const artboard = new Artboard({
      width: 700,
      height: 300,
      backgroundColor: "#ecf0f1",
      boxModel: { padding: 30 }
    });
    
    const container = new Container({
      direction: "horizontal",
      width: 640,
      height: 240,
      horizontalAlignment: "space-between",
      verticalAlignment: "center",
      style: {
        fill: "#ffffff",
        stroke: "#bdc3c7",
        strokeWidth: 2
      },
      boxModel: { padding: 30 }
    });
    
    container.position({
      relativeFrom: container.center,
      relativeTo: artboard.contentBox.center,
      x: 0,
      y: 0
    });
    
    const colors = ["#e74c3c", "#3498db", "#2ecc71"];
    const labels = ["Red", "Blue", "Green"];
    
    for (let i = 0; i < 3; i++) {
      const circle = new Circle({
        radius: 50,
        style: { fill: colors[i], stroke: "#2c3e50", strokeWidth: 2 }
      });
      
      const text = new Text({
        content: labels[i],
        fontSize: 18,
        style: { fill: "#2c3e50" }
      });
      
      text.position({
        relativeFrom: text.center,
        relativeTo: circle.center,
        x: 0,
        y: 0
      });
      
      container.addElement(circle);
      container.addElement(text);
    }
    
    artboard.addElement(container);
    
    return artboard.render();
  `
};

// For use in test scripts
export function getExample(name) {
  return examples[name] || examples.simpleCircle;
}

export function listExamples() {
  return Object.keys(examples);
}

