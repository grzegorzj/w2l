# Function Graph Guide

## Overview

This guide covers the FunctionGraph element for plotting mathematical functions with automatic detection of remarkable points (roots, extrema, inflection points, etc.). FunctionGraph is designed to handle K-12 mathematics and first-year university topics with ease.

## When to Use This Guide

- Plotting mathematical functions
- Creating graphs with axes and grids
- Showing roots, maxima, minima, and other remarkable points
- Comparing multiple functions on the same graph
- Shading regions between curves
- Creating calculus visualizations
- Illustrating function transformations

## Creating a Basic Graph

### Simple Function Plot

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x,
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

artboard.add(graph);
```

### With Custom Range

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x),
    color: "red"
  },
  width: 600,
  height: 400,
  domain: [-Math.PI * 2, Math.PI * 2],
  range: [-2, 2]  // Explicit y-axis range
});

artboard.add(graph);
```

## Function Configuration

### Single Function

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "#e74c3c",
    style: {
      stroke: "#e74c3c",
      strokeWidth: 2
    },
    showPoints: false  // Don't show sample points
  },
  width: 600,
  height: 400,
  domain: [-5, 5]
});
```

### Multiple Functions

```javascript
const graph = new FunctionGraph({
  functions: [
    {
      fn: (x) => x * x,
      color: "blue",
      style: { strokeWidth: 2 }
    },
    {
      fn: (x) => 2 * x,
      color: "red",
      style: { strokeWidth: 2 }
    },
    {
      fn: (x) => Math.sin(x) * 5,
      color: "green",
      style: { strokeWidth: 2, strokeDasharray: "5,3" }
    }
  ],
  width: 600,
  height: 400,
  domain: [-5, 5]
});

artboard.add(graph);
```

## Graph Configuration

### Grid and Axes

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x, color: "blue" },
  width: 600,
  height: 400,
  domain: [-5, 5],
  
  // Grid settings
  showGrid: true,
  gridSpacing: [1, 1],      // Grid every 1 unit in both directions
  gridStyle: {
    stroke: "#e0e0e0",
    strokeWidth: 0.5
  },
  
  // Axes settings
  showAxes: true,
  axisStyle: {
    stroke: "black",
    strokeWidth: 2
  },
  
  // Labels
  showLabels: true,
  minLabelDensity: 60       // Minimum pixels between labels
});
```

### Auto Grid Spacing

```javascript
// Let the system calculate optimal grid spacing
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x, color: "blue" },
  width: 600,
  height: 400,
  domain: [-10, 10],
  showGrid: true,
  // gridSpacing omitted - will auto-calculate for ~50-80px between labels
  minLabelDensity: 50
});
```

### Sampling

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x * 10),  // High-frequency function
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  samples: 500  // More samples for smoother curve (default: 200)
});
```

## Remarkable Points

### Auto-Detection

The system automatically detects:
- **Roots** - x-intercepts (where y = 0)
- **Y-intercepts** - where x = 0
- **Local maxima** - peak points
- **Local minima** - valley points
- **Inflection points** - where concavity changes
- **Vertical asymptotes** - where function approaches infinity
- **Discontinuities** - points where function is undefined
- **Critical points** - where derivative is 0 or undefined

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  detectRemarkablePoints: true,  // Enable detection (default)
  showRemarkablePoints: true     // Show on graph (default: false)
});

artboard.add(graph);
```

### Accessing Remarkable Points

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

artboard.add(graph);

// Get all remarkable points
const points = graph.getRemarkablePoints();

points.forEach(point => {
  console.log(`${point.type} at x=${point.x}, y=${point.y}`);
  console.log(`Description: ${point.description}`);
  console.log(`SVG position: (${point.svgPoint.x}, ${point.svgPoint.y})`);
});
```

### Filtering Remarkable Points

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x * x - 3 * x * x - x + 3,
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-3, 4]
});

artboard.add(graph);

// Get only roots
const roots = graph.getRemarkablePoints().filter(p => p.type === "root");

// Get only extrema
const extrema = graph.getRemarkablePoints().filter(p => 
  p.type === "local-maximum" || p.type === "local-minimum"
);

// Get only inflection points
const inflections = graph.getRemarkablePoints().filter(p => 
  p.type === "inflection-point"
);
```

### Manually Marking Remarkable Points

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "blue"
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  showRemarkablePoints: false  // Don't auto-show
});

artboard.add(graph);

// Get remarkable points
const points = graph.getRemarkablePoints();

// Manually mark each point with custom styling
points.forEach(point => {
  if (point.svgPoint) {
    const marker = new Circle({
      radius: 4,
      style: {
        fill: point.type === "root" ? "red" : 
              point.type === "local-minimum" ? "green" : 
              point.type === "local-maximum" ? "blue" : "orange"
      }
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: point.svgPoint,
      x: 0,
      y: 0
    });
    
    artboard.add(marker);
    
    // Add label
    const label = new Text({
      content: `(${point.x.toFixed(1)}, ${point.y?.toFixed(1) || 'undefined'})`,
      fontSize: 10
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: point.svgPoint,
      x: 0,
      y: -10
    });
    
    artboard.add(label);
  }
});
```

## Shaded Regions

### Area Under Curve

```javascript
const graph = new FunctionGraph({
  functions: [
    {
      fn: (x) => x * x,
      color: "blue"
    }
  ],
  width: 600,
  height: 400,
  domain: [-3, 3],
  shadedRegions: [
    {
      topFunction: 0,      // Index of function in functions array
      bottomFunction: undefined,  // Defaults to y=0 (x-axis)
      domain: [0, 2],      // Shade from x=0 to x=2
      style: {
        fill: "rgba(100, 150, 255, 0.3)"
      }
    }
  ]
});

artboard.add(graph);
```

### Area Between Curves

```javascript
const graph = new FunctionGraph({
  functions: [
    {
      fn: (x) => x * x,     // Function 0
      color: "blue"
    },
    {
      fn: (x) => 4 - x * x, // Function 1
      color: "red"
    }
  ],
  width: 600,
  height: 400,
  domain: [-3, 3],
  shadedRegions: [
    {
      topFunction: 1,       // 4 - x^2
      bottomFunction: 0,    // x^2
      domain: [-1.5, 1.5],  // Where top function is above bottom
      style: {
        fill: "rgba(255, 200, 100, 0.4)"
      }
    }
  ]
});

artboard.add(graph);
```

### Multiple Shaded Regions

```javascript
const graph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.sin(x),
      color: "blue"
    }
  ],
  width: 600,
  height: 400,
  domain: [0, 2 * Math.PI],
  shadedRegions: [
    // Positive regions
    {
      topFunction: 0,
      domain: [0, Math.PI],
      style: { fill: "rgba(100, 255, 100, 0.3)" }
    },
    // Negative regions
    {
      topFunction: undefined,  // x-axis
      bottomFunction: 0,       // sin(x) below axis
      domain: [Math.PI, 2 * Math.PI],
      style: { fill: "rgba(255, 100, 100, 0.3)" }
    }
  ]
});

artboard.add(graph);
```

## Accessing Graph Elements

### Get Axes Information

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x, color: "blue" },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

artboard.add(graph);

// Get axis information
const xAxis = graph.getXAxis();
const yAxis = graph.getYAxis();

console.log("X-axis:", xAxis);
// { direction: "horizontal", value: 0, start: {...}, end: {...}, ticks: [...] }

console.log("Y-axis:", yAxis);
// { direction: "vertical", value: 0, start: {...}, end: {...}, ticks: [...] }

// Access tick marks
xAxis.ticks.forEach(tick => {
  console.log(`Tick at x=${tick.value}, position (${tick.position.x}, ${tick.position.y})`);
});
```

## Common Functions

### Polynomial Functions

```javascript
// Linear
const linear = new FunctionGraph({
  functions: { fn: (x) => 2 * x + 1, color: "blue" },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Quadratic
const quadratic = new FunctionGraph({
  functions: { fn: (x) => x * x - 4, color: "red" },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Cubic
const cubic = new FunctionGraph({
  functions: { fn: (x) => x * x * x - 3 * x, color: "green" },
  width: 600,
  height: 400,
  domain: [-3, 3]
});
```

### Trigonometric Functions

```javascript
const trig = new FunctionGraph({
  functions: [
    { fn: (x) => Math.sin(x), color: "red" },
    { fn: (x) => Math.cos(x), color: "blue" },
    { fn: (x) => Math.tan(x), color: "green" }
  ],
  width: 600,
  height: 400,
  domain: [-Math.PI * 2, Math.PI * 2],
  range: [-3, 3]
});
```

### Exponential and Logarithmic

```javascript
const expLog = new FunctionGraph({
  functions: [
    { fn: (x) => Math.exp(x), color: "red" },
    { fn: (x) => Math.log(x), color: "blue" }
  ],
  width: 600,
  height: 400,
  domain: [-3, 3],
  range: [-3, 8]
});
```

### Rational Functions

```javascript
const rational = new FunctionGraph({
  functions: {
    fn: (x) => 1 / x,
    color: "purple"
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  range: [-5, 5]
});
```

### Piecewise Functions

```javascript
const piecewise = new FunctionGraph({
  functions: {
    fn: (x) => {
      if (x < 0) return x * x;
      else if (x < 2) return 2 * x;
      else return 4;
    },
    color: "orange"
  },
  width: 600,
  height: 400,
  domain: [-3, 5]
});
```

## Complete Examples

### Quadratic with Roots and Vertex

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "blue",
    style: { strokeWidth: 2 }
  },
  width: 600,
  height: 400,
  domain: [-5, 5],
  range: [-5, 10],
  title: "Quadratic Function",
  showGrid: true,
  gridSpacing: [1, 1]
});

artboard.add(graph);

// Get and mark remarkable points
const points = graph.getRemarkablePoints();

points.forEach(point => {
  if (point.svgPoint) {
    // Draw marker
    const marker = new Circle({
      radius: 5,
      style: {
        fill: point.type === "root" ? "red" : 
              point.type === "local-minimum" ? "green" : "orange",
        stroke: "black",
        strokeWidth: 1
      }
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: point.svgPoint,
      x: 0,
      y: 0
    });
    
    artboard.add(marker);
    
    // Add label
    const label = new Text({
      content: `${point.type}\n(${point.x.toFixed(1)}, ${point.y?.toFixed(1)})`,
      fontSize: 11,
      style: { fill: "black" }
    });
    
    label.position({
      relativeFrom: label.topCenter,
      relativeTo: point.svgPoint,
      x: 0,
      y: point.type === "local-minimum" ? 15 : -15
    });
    
    artboard.add(label);
  }
});
```

### Comparing Functions

```javascript
const graph = new FunctionGraph({
  functions: [
    {
      fn: (x) => x * x,
      color: "blue",
      style: { strokeWidth: 2 }
    },
    {
      fn: (x) => x * x * x,
      color: "red",
      style: { strokeWidth: 2 }
    },
    {
      fn: (x) => Math.pow(x, 4),
      color: "green",
      style: { strokeWidth: 2 }
    }
  ],
  width: 600,
  height: 400,
  domain: [-2, 2],
  range: [-2, 10],
  title: "Power Functions Comparison"
});

artboard.add(graph);

// Add legend
const container = new Container({
  direction: "vertical",
  spacing: 5
});

const functions = ["y = x²", "y = x³", "y = x⁴"];
const colors = ["blue", "red", "green"];

functions.forEach((text, i) => {
  const row = new Container({
    direction: "horizontal",
    spacing: 10
  });
  
  const colorBox = new Rect({
    width: 20,
    height: 12,
    style: { fill: colors[i] }
  });
  
  const label = new Text({
    content: text,
    fontSize: 12
  });
  
  row.add(colorBox);
  row.add(label);
  container.add(row);
});

container.position({
  relativeFrom: container.topLeft,
  relativeTo: graph.topRight,
  x: 20,
  y: 0
});

artboard.add(container);
```

### Integral Visualization

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => x * x,
    color: "blue",
    style: { strokeWidth: 2 }
  },
  width: 600,
  height: 400,
  domain: [-1, 3],
  shadedRegions: [
    {
      topFunction: 0,
      domain: [0, 2],
      style: { fill: "rgba(100, 150, 255, 0.3)" }
    }
  ]
});

artboard.add(graph);

// Add integral notation
const integralLabel = new Text({
  content: "$\\int_{0}^{2} x^2 dx = \\frac{8}{3}$",
  fontSize: 18
});

integralLabel.position({
  relativeFrom: integralLabel.topLeft,
  relativeTo: graph.topRight,
  x: 20,
  y: 20
});

artboard.add(integralLabel);
```

## Best Practices

1. **Choose appropriate domain** - Match domain to function behavior
2. **Set range when needed** - Auto-range is good, but manual range prevents clipping
3. **Use enough samples** - 200 is default, increase for high-frequency functions
4. **Auto grid spacing** - Let the system calculate optimal spacing
5. **Style functions distinctly** - Use different colors/dash patterns for multiple functions
6. **Label remarkable points** - Make important points clear with markers and text
7. **Use shaded regions** - Visualize areas between curves or under curves
8. **Handle discontinuities** - System detects them, but you may need to style appropriately

## Troubleshooting

**Function not showing?**
- Check domain includes function's interesting behavior
- Verify range includes function values
- Check for division by zero or undefined values

**Grid too dense/sparse?**
- Adjust `minLabelDensity`
- Set explicit `gridSpacing` if auto-calculation doesn't work

**Remarkable points not detected?**
- Increase `samples` for better detection
- Check domain includes the points
- Some points may be outside numerical precision

**Asymptotes not showing correctly?**
- System detects vertical asymptotes
- May need to adjust range to show behavior near asymptotes
- Use dashed styling to indicate asymptotic behavior

