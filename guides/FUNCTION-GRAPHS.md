# Function Graphs - Label Density and Coordinate Retrieval

## Overview

The `FunctionGraph` component provides comprehensive mathematical function plotting capabilities. Recent improvements include automatic grid spacing calculation based on pixel density and convenient methods for retrieving label coordinates.

## Automatic Grid Spacing

### Default Behavior

By default, `FunctionGraph` automatically calculates optimal grid spacing to ensure labels are readable and not cramped. The algorithm:

1. Calculates the number of labels that can fit given the minimum label density (default: 50 pixels between labels)
2. Selects "nice" numbers (1, 2, 2.5, 5, 10, 20, 50, etc.) for grid spacing
3. Adjusts based on the magnitude of the domain/range values

### Example

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x),
    label: "sin(x)",
    color: "#3498db"
  },
  width: 600,
  height: 400,
  domain: [-10, 10],
  // gridSpacing is auto-calculated
  // Result: approximately 2 or 5 unit spacing depending on pixel density
});
```

### Configuring Label Density

You can customize the minimum pixel spacing between labels using `minLabelDensity`:

```javascript
// More labels (closer together)
const denseGraph = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-10, 10],
  minLabelDensity: 30  // Labels at least 30px apart
});

// Fewer labels (more spread out)
const sparseGraph = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-10, 10],
  minLabelDensity: 80  // Labels at least 80px apart
});
```

### Manual Override

You can still manually specify `gridSpacing` to override automatic calculation:

```javascript
const manualGraph = new FunctionGraph({
  functions: { fn: (x) => Math.sin(x) },
  width: 600,
  height: 400,
  domain: [-2 * Math.PI, 2 * Math.PI],
  gridSpacing: [Math.PI / 2, 0.5]  // Manual spacing: π/2 on x-axis, 0.5 on y-axis
});
```

## Label Coordinate Retrieval

### Get Specific Label Position

The FunctionGraph provides both **relative** and **absolute** coordinate methods.

#### Relative Coordinates

Relative coordinates are relative to the graph's top-left corner:

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x - 4 },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Get position relative to graph
const x2Pos = graph.getLabelPosition('x', 2);
if (x2Pos) {
  // Must position relative to graph.topLeft
  annotation.position({
    relativeFrom: annotation.center,
    relativeTo: graph.topLeft,
    x: x2Pos.x,
    y: x2Pos.y
  });
}
```

#### Absolute Coordinates (Recommended)

Absolute coordinates are in artboard space and work regardless of graph layout:

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x - 4 },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Get absolute position - works even if graph is in a VStack/HStack
const x2Pos = graph.getLabelPositionAbsolute('x', 2);
if (x2Pos) {
  console.log(`x=2 label is at absolute position (${x2Pos.x}, ${x2Pos.y})`);
  
  // Position directly relative to the point
  const annotation = new Text({ content: "Important point" });
  annotation.position({
    relativeFrom: annotation.bottomCenter,
    relativeTo: x2Pos,
    x: 0,
    y: -10
  });
}

// Get position of the y=0 label (x-axis)
const y0Pos = graph.getLabelPositionAbsolute('y', 0);
```

### Get All Label Positions

Retrieve information about all labels on an axis:

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => Math.sin(x) },
  width: 600,
  height: 400,
  domain: [-10, 10]
});

// Get all x-axis labels (absolute coordinates - recommended)
const xLabels = graph.getAllLabelPositionsAbsolute('x');
xLabels.forEach(label => {
  console.log(`Label "${label.label}" at value ${label.value}`);
  console.log(`  Absolute position: (${label.position.x}, ${label.position.y})`);
});

// Or get relative coordinates
const xLabelsRel = graph.getAllLabelPositions('x');
```

### Convert Mathematical Coordinates to Positions

Convert any mathematical coordinate to SVG position for custom annotations:

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Get absolute position of mathematical point (-3, 9) - recommended
const pos = graph.coordinateToPositionAbsolute(-3, 9);

// Add a marker at this position
const marker = new Circle({
  radius: 5,
  style: { fill: "#e74c3c" }
});

marker.position({
  relativeFrom: marker.center,
  relativeTo: pos,
  x: 0,
  y: 0
});

// Or use relative coordinates if you prefer
const posRel = graph.coordinateToPosition(-3, 9);
marker.position({
  relativeFrom: marker.center,
  relativeTo: graph.topLeft,
  x: posRel.x,
  y: posRel.y
});
```

## Practical Examples

### Example 1: Annotating Specific X Values

```javascript
const graph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(x),
    label: "sin(x)",
    color: "#3498db"
  },
  width: 800,
  height: 400,
  domain: [-2 * Math.PI, 2 * Math.PI]
});

// Mark important x values (multiples of π)
const importantX = [0, Math.PI, -Math.PI];

importantX.forEach(x => {
  // Find the closest label
  const pos = graph.getLabelPosition('x', x);
  if (pos) {
    const marker = new Circle({
      radius: 4,
      style: { fill: "#e74c3c" }
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: graph.topLeft,
      x: pos.x,
      y: pos.y
    });
    
    artboard.addElement(marker);
  }
});
```

### Example 2: Adding Custom Grid Annotations

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-5, 5],
  range: [-5, 30]
});

// Get all y-axis labels
const yLabels = graph.getAllLabelPositions('y');

// Add horizontal line annotations at specific y values
yLabels.filter(l => l.value > 0 && l.value % 10 === 0).forEach(label => {
  const line = new Line({
    start: { x: 0, y: label.position.y },
    end: { x: 600, y: label.position.y },
    style: { stroke: "#e74c3c", strokeWidth: "1px", strokeDasharray: "5,5" }
  });
  
  // Position relative to graph
  line.position({
    relativeTo: graph.topLeft,
    x: 0,
    y: 0
  });
  
  artboard.addElement(line);
});
```

### Example 3: Highlighting Regions

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => Math.sin(x) },
  width: 800,
  height: 400,
  domain: [-2 * Math.PI, 2 * Math.PI],
  range: [-2, 2]
});

// Highlight region where x > π
const piPos = graph.coordinateToPosition(Math.PI, 0);
const endPos = graph.coordinateToPosition(2 * Math.PI, 0);

const highlight = new Rectangle({
  width: endPos.x - piPos.x,
  height: 400,
  style: { fill: "#3498db", opacity: 0.1 }
});

highlight.position({
  relativeFrom: highlight.topLeft,
  relativeTo: graph.topLeft,
  x: piPos.x,
  y: 0
});

artboard.addElement(highlight);
```

## API Reference

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gridSpacing` | `[number, number]` | auto-calculated | Grid spacing in x and y directions |
| `minLabelDensity` | `number` | `50` | Minimum pixels between labels (for auto-calculation) |

### Methods

#### `getLabelPosition(axis: 'x' | 'y', value: number): Point | undefined`

Get the relative SVG position of a specific axis label by its value.

**Parameters:**
- `axis`: Which axis to search ('x' or 'y')
- `value`: The numeric value to find on the axis

**Returns:** The SVG position relative to graph's top-left corner, or `undefined` if not found

#### `getLabelPositionAbsolute(axis: 'x' | 'y', value: number): Point | undefined`

Get the absolute SVG position of a specific axis label by its value.

**Parameters:**
- `axis`: Which axis to search ('x' or 'y')
- `value`: The numeric value to find on the axis

**Returns:** The absolute SVG position on the artboard, or `undefined` if not found

**Note:** Use this method when the graph is inside layouts (VStack, HStack, etc.) for accurate positioning.

#### `getAllLabelPositions(axis: 'x' | 'y'): Array<{value: number, position: Point, label: string}>`

Get all label positions for an axis (relative to graph).

**Parameters:**
- `axis`: Which axis to get labels from ('x' or 'y')

**Returns:** Array of label information with relative positions

#### `getAllLabelPositionsAbsolute(axis: 'x' | 'y'): Array<{value: number, position: Point, label: string}>`

Get all label positions for an axis (absolute coordinates).

**Parameters:**
- `axis`: Which axis to get labels from ('x' or 'y')

**Returns:** Array of label information with absolute positions

#### `coordinateToPosition(x: number, y: number): Point`

Convert a mathematical coordinate to SVG coordinate (relative to graph).

**Parameters:**
- `x`: Mathematical x coordinate
- `y`: Mathematical y coordinate

**Returns:** SVG position relative to the graph's top-left corner

#### `coordinateToPositionAbsolute(x: number, y: number): Point`

Convert a mathematical coordinate to absolute SVG coordinate.

**Parameters:**
- `x`: Mathematical x coordinate
- `y`: Mathematical y coordinate

**Returns:** Absolute SVG position on the artboard

## Design Rationale

### Why Auto-Calculate Grid Spacing?

1. **Readability**: Different domain sizes and graph dimensions require different label spacing. A domain of [-10, 10] on a 300px graph needs different spacing than the same domain on a 1000px graph.

2. **Nice Numbers**: The algorithm selects round, human-friendly numbers (1, 2, 5, 10, etc.) rather than arbitrary values, making graphs easier to read.

3. **Flexibility**: Users can still override with manual `gridSpacing` when needed for special cases (e.g., marking multiples of π for trigonometric functions).

### Why Provide Label Coordinate Methods?

1. **Annotation Positioning**: Users often need to place annotations, markers, or labels at specific mathematical coordinates or axis labels.

2. **Interactive Features**: For interactive applications, knowing label positions enables features like hover tooltips or click interactions.

3. **Custom Visualizations**: Advanced users can build custom visualizations on top of the graph by accessing the coordinate system.

## See Also

- [Function Graphs Guide](./FUNCTION-GRAPHS.md)
- [Positioning System](./POSITIONING-SYSTEM.md)
- [LaTeX Support](./LATEX-SUPPORT.md)

