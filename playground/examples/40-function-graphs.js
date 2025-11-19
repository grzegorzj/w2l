import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  Line,
} from "w2l";

/**
 * Example 40: Function Graphs
 *
 * Demonstrates the FunctionGraph component with various mathematical functions,
 * remarkable points detection, and comprehensive graphing features.
 */

const artboard = new Artboard({
    size: { width: 1400, height: 900 },
    padding: "40px",
    style: { fill: "#ffffff" },
  });

  // Example 1: Simple Quadratic Function
  const quadratic = new FunctionGraph({
    functions: {
      fn: (x) => x * x - 4,
      label: "f(x) = x² - 4",
      color: "#e74c3c",
    },
    width: 400,
    height: 300,
    domain: [-5, 5],
    title: "Quadratic Function",
    name: "QuadraticGraph",
  });

  quadratic.position({
    relativeFrom: quadratic.topLeft,
    relativeTo: artboard.topLeft,
    x: 0,
    y: 0,
  });

  artboard.addElement(quadratic);

  // Add labels for remarkable points on quadratic
  const quadRoots = quadratic.getRemarkablePoints("root");
  quadRoots.forEach((root, i) => {
    if (root.svgPoint) {
      const label = new Text({
        content: `Root: x=${root.x.toFixed(2)}`,
        fontSize: 12,
        style: { fill: "#c0392b" },
      });
      label.position({
        relativeFrom: label.bottomCenter,
        relativeTo: quadratic.topLeft,
        x: root.svgPoint.x,
        y: root.svgPoint.y - 10,
      });
      artboard.addElement(label);
    }
  });

  // Example 2: Multiple Trigonometric Functions
  const trig = new FunctionGraph({
    functions: [
      {
        fn: (x) => Math.sin(x),
        label: "sin(x)",
        color: "#3498db",
      },
      {
        fn: (x) => Math.cos(x),
        label: "cos(x)",
        color: "#2ecc71",
      },
      {
        fn: (x) => Math.sin(x) * Math.cos(x),
        label: "sin(x)·cos(x)",
        color: "#9b59b6",
      },
    ],
    width: 500,
    height: 300,
    domain: [-2 * Math.PI, 2 * Math.PI],
    range: [-1.5, 1.5],
    gridSpacing: [Math.PI / 2, 0.5],
    title: "Trigonometric Functions",
    name: "TrigGraph",
  });

  trig.position({
    relativeFrom: trig.topLeft,
    relativeTo: quadratic.topRight,
    x: 40,
    y: 0,
  });

  artboard.addElement(trig);

  // Example 3: Polynomial with Multiple Roots
  const cubic = new FunctionGraph({
    functions: {
      fn: (x) => (x + 3) * (x - 1) * (x - 4) / 4,
      label: "f(x) = (x+3)(x-1)(x-4)/4",
      color: "#e67e22",
    },
    width: 400,
    height: 300,
    domain: [-5, 6],
    title: "Cubic Polynomial",
    name: "CubicGraph",
  });

  cubic.position({
    relativeFrom: cubic.topLeft,
    relativeTo: quadratic.bottomLeft,
    x: 0,
    y: 40,
  });

  artboard.addElement(cubic);

  // Highlight extrema on cubic
  const extrema = cubic.getRemarkablePoints("local-maximum").concat(
    cubic.getRemarkablePoints("local-minimum")
  );
  
  extrema.forEach((point) => {
    if (point.svgPoint) {
      const marker = new Circle({
        radius: 5,
        style: { fill: "#f39c12", stroke: "#e67e22", strokeWidth: "2px" },
      });
      marker.position({
        relativeFrom: marker.center,
        relativeTo: cubic.topLeft,
        x: point.svgPoint.x,
        y: point.svgPoint.y,
      });
      artboard.addElement(marker);

      const label = new Text({
        content: point.type === "local-maximum" ? "Max" : "Min",
        fontSize: 10,
        style: { fill: "#e67e22" },
      });
      label.position({
        relativeFrom: label.topCenter,
        relativeTo: cubic.topLeft,
        x: point.svgPoint.x,
        y: point.svgPoint.y + 12,
      });
      artboard.addElement(label);
    }
  });

  // Example 4: Exponential and Logarithmic Functions
  const expLog = new FunctionGraph({
    functions: [
      {
        fn: (x) => Math.exp(x / 2),
        label: "e^(x/2)",
        color: "#1abc9c",
      },
      {
        fn: (x) => Math.log(x),
        label: "ln(x)",
        color: "#34495e",
      },
    ],
    width: 400,
    height: 300,
    domain: [0.1, 5],
    range: [-2, 6],
    title: "Exponential & Logarithmic",
    name: "ExpLogGraph",
  });

  expLog.position({
    relativeFrom: expLog.topLeft,
    relativeTo: cubic.topRight,
    x: 40,
    y: 0,
  });

  artboard.addElement(expLog);

  // Example 5: Rational Function with Asymptote
  const rational = new FunctionGraph({
    functions: {
      fn: (x) => 1 / (x - 2),
      label: "f(x) = 1/(x-2)",
      color: "#e84393",
    },
    width: 400,
    height: 300,
    domain: [-3, 7],
    range: [-5, 5],
    title: "Rational Function",
    name: "RationalGraph",
  });

  rational.position({
    relativeFrom: rational.topLeft,
    relativeTo: expLog.topRight,
    x: 40,
    y: 0,
  });

  artboard.addElement(rational);

  // Mark asymptote
  const asymptotes = rational.getRemarkablePoints("vertical-asymptote");
  asymptotes.forEach((asym) => {
    const asymLabel = new Text({
      content: `Asymptote: x=${asym.x.toFixed(1)}`,
      fontSize: 12,
      style: { fill: "#d63031" },
    });
    asymLabel.position({
      relativeFrom: asymLabel.topLeft,
      relativeTo: rational.topRight,
      x: -150,
      y: 30,
    });
    artboard.addElement(asymLabel);
  });

  // Example 6: Piecewise Function
  const piecewise = new FunctionGraph({
    functions: {
      fn: (x) => {
        if (x < -1) return x + 2;
        if (x < 1) return x * x;
        return 2 - x;
      },
      label: "Piecewise Function",
      color: "#6c5ce7",
    },
    width: 400,
    height: 300,
    domain: [-4, 4],
    title: "Piecewise Function",
    name: "PiecewiseGraph",
  });

  piecewise.position({
    relativeFrom: piecewise.topLeft,
    relativeTo: cubic.bottomLeft,
    x: 0,
    y: 40,
  });

  artboard.addElement(piecewise);

  // Example 7: Absolute Value and Transformations
  const absValue = new FunctionGraph({
    functions: [
      {
        fn: (x) => Math.abs(x),
        label: "|x|",
        color: "#00b894",
      },
      {
        fn: (x) => -Math.abs(x - 2) + 3,
        label: "-|x-2|+3",
        color: "#ff7675",
      },
    ],
    width: 400,
    height: 300,
    domain: [-5, 7],
    title: "Absolute Value Functions",
    name: "AbsValueGraph",
  });

  absValue.position({
    relativeFrom: absValue.topLeft,
    relativeTo: piecewise.topRight,
    x: 40,
    y: 0,
  });

  artboard.addElement(absValue);

  // Example 8: Higher-Order Polynomial
  const quintic = new FunctionGraph({
    functions: {
      fn: (x) => 0.01 * x ** 5 - 0.1 * x ** 3 + x,
      label: "f(x) = 0.01x⁵ - 0.1x³ + x",
      color: "#fd79a8",
    },
    width: 400,
    height: 300,
    domain: [-5, 5],
    title: "Quintic Polynomial",
    name: "QuinticGraph",
  });

  quintic.position({
    relativeFrom: quintic.topLeft,
    relativeTo: absValue.topRight,
    x: 40,
    y: 0,
  });

  artboard.addElement(quintic);

  // Highlight inflection points
  const inflectionPoints = quintic.getRemarkablePoints("inflection-point");
  inflectionPoints.forEach((point, i) => {
    if (point.svgPoint) {
      const marker = new Circle({
        radius: 4,
        style: { fill: "#fd79a8", stroke: "#ff7675", strokeWidth: "2px" },
      });
      marker.position({
        relativeFrom: marker.center,
        relativeTo: quintic.topLeft,
        x: point.svgPoint.x,
        y: point.svgPoint.y,
      });
      artboard.addElement(marker);
    }
  });

  // Add title
  const title = new Text({
    content: "Function Graph Examples - K-12 & University Mathematics",
    fontSize: 24,
    fontWeight: "bold",
    style: { fill: "#2c3e50" },
  });

  title.position({
    relativeFrom: title.bottomCenter,
    relativeTo: artboard.topCenter,
    x: 0,
    y: 15,
  });

  artboard.addElement(title);

  // Add description
  const description = new Text({
    content:
      "Demonstrating function plotting with automatic remarkable point detection (roots, extrema, inflection points, asymptotes)",
    fontSize: 12,
    style: { fill: "#7f8c8d" },
    maxWidth: 1300,
    align: "center",
  });

  description.position({
    relativeFrom: description.topCenter,
    relativeTo: title.bottomCenter,
    x: 0,
    y: 5,
  });

  artboard.addElement(description);

artboard.render();

