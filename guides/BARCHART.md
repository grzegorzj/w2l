# BarChart Component

The `BarChart` component is a compound component for creating both vertical and horizontal bar charts with extensive customization and data point interaction capabilities.

## Features

- ✅ **Vertical and Horizontal Orientations** - Choose the best layout for your data
- ✅ **Position Retrieval** - Get absolute screen coordinates of any bar or data point
- ✅ **Remarkable Points Detection** - Automatically detect max, min, and average values
- ✅ **Custom Styling** - Style individual bars or use global styles
- ✅ **Interactive Annotations** - Add custom markers, labels, and highlights using position data
- ✅ **Grid and Axes** - Optional grid lines and axis labels
- ✅ **Value Labels** - Show/hide value labels on bars

## Basic Usage

### Vertical Bar Chart

```typescript
import { BarChart } from "w2l";

const chart = new BarChart({
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 38 },
  ],
  orientation: "vertical",
  width: 600,
  height: 350,
  barColor: "#2196f3",
  showGrid: true,
  showAxes: true,
});
```

### Horizontal Bar Chart

```typescript
const chart = new BarChart({
  data: [
    { label: "Product A", value: 125 },
    { label: "Product B", value: 89 },
  ],
  orientation: "horizontal",
  width: 700,
  height: 350,
  barColor: "#4caf50",
});
```

## Configuration Options

### BarChartConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `BarDataPoint[]` | *required* | Array of data points to display |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Orientation of the bars |
| `width` | `number` | *required* | Width of the chart in pixels |
| `height` | `number` | *required* | Height of the chart in pixels |
| `minValue` | `number` | `auto` | Minimum value for the value axis |
| `maxValue` | `number` | `auto` | Maximum value for the value axis |
| `barSpacing` | `number` | `0.2` | Spacing between bars as fraction of bar width |
| `chartPadding` | `object` | `{top: 20, right: 20, bottom: 40, left: 60}` | Padding around the chart area |
| `barStyle` | `Partial<Style>` | - | Default style for bars |
| `barColor` | `string` | `"#2196f3"` | Default color for bars |
| `showGrid` | `boolean` | `true` | Show/hide grid lines |
| `showAxes` | `boolean` | `true` | Show/hide axis lines |
| `showValueLabels` | `boolean` | `false` | Show/hide value labels on bars |
| `showCategoryLabels` | `boolean` | `true` | Show/hide category labels |
| `gridLineCount` | `number` | `5` | Number of grid lines on value axis |
| `detectRemarkablePoints` | `boolean` | `true` | Detect max/min/average points |
| `showRemarkablePoints` | `boolean` | `false` | Auto-render remarkable point markers |
| `remarkablePointStyle` | `Partial<Style>` | - | Style for remarkable point markers |

### BarDataPoint

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Label for this data point |
| `value` | `number` | Numeric value |
| `color` | `string` (optional) | Custom color for this specific bar |
| `style` | `Partial<Style>` (optional) | Custom style for this specific bar |

## Position Retrieval API

The BarChart component returns `Bar` objects that have position accessors just like other elements (`topLeft`, `center`, `bottomRight`, etc.).

### getBars()

Get all bars:

```typescript
const bars = chart.getBars();
// Returns: Bar[]
```

### getBar(index)

Get a specific bar:

```typescript
const bar = chart.getBar(2); // Get third bar
// Returns: Bar | undefined
```

## Bar Class

Each bar has standard position accessors like other elements:

```typescript
class Bar {
  // Data properties
  readonly index: number;
  readonly label: string;
  readonly value: number;
  
  // Bounds in chart-relative coordinates
  readonly bounds: { x: number, y: number, width: number, height: number };
  
  // Position accessors (return absolute artboard coordinates)
  readonly topLeft: Position;
  readonly topCenter: Position;
  readonly topRight: Position;
  readonly centerLeft: Position;
  readonly center: Position;
  readonly centerRight: Position;
  readonly bottomLeft: Position;
  readonly bottomCenter: Position;
  readonly bottomRight: Position;
  
  // Convenient aliases
  readonly top: Position;     // = topCenter
  readonly bottom: Position;  // = bottomCenter
  readonly left: Position;    // = centerLeft
  readonly right: Position;   // = centerRight
}
```

### Usage Example

```typescript
// Get a bar
const bar = chart.getBar(0);

// Use position accessors for annotations
const label = new Text({ content: "Peak!" });
label.position({
  relativeFrom: label.bottomCenter,
  relativeTo: bar.topCenter,  // Top of the bar
  boxReference: "artboard",
  y: -10,
});

// Position a badge at bar center
const badge = new Container({ /* ... */ });
badge.position({
  relativeFrom: badge.center,
  relativeTo: bar.center,
  boxReference: "artboard",
});
```

## Remarkable Points

The chart can automatically detect and optionally render remarkable points:

- **Maximum**: Highest value
- **Minimum**: Lowest value
- **Average**: Point closest to average

### Working with Remarkable Points

```typescript
// Create chart with remarkable point detection
const chart = new BarChart({
  data: [...],
  detectRemarkablePoints: true,
  showRemarkablePoints: true, // Auto-render markers
  remarkablePointStyle: {
    fill: "#ff5722",
    stroke: "#d84315",
    strokeWidth: "2",
  },
});

// Or access them programmatically
const remarkablePoints = chart.getRemarkablePoints();
remarkablePoints.forEach((point) => {
  if (point.type === "maximum") {
    const pos = chart.getRemarkablePointPosition(point);
    // Add custom annotation at pos
  }
});
```

## Advanced Examples

### Custom Colors Per Bar

```typescript
const chart = new BarChart({
  data: [
    { label: "Q1", value: 85, color: "#4caf50" }, // Green
    { label: "Q2", value: 67, color: "#ff9800" }, // Orange
    { label: "Q3", value: 45, color: "#f44336" }, // Red
  ],
  orientation: "vertical",
  width: 500,
  height: 350,
});
```

### Highlighting Specific Bars

```typescript
const chart = new BarChart({ /* ... */ });
const bars = chart.getBars();

// Highlight the bar with index 4
const targetBar = bars[4];

// Add a star marker at the top of the bar
const star = new Text({ content: "⭐", fontSize: 28 });
star.position({
  relativeFrom: star.center,
  relativeTo: targetBar.topCenter,
  boxReference: "artboard",
  y: -25,
});

// Add a circle at the bar center
const highlight = new Circle({ radius: 30, style: { stroke: "#ff6f00" } });
highlight.position({
  relativeFrom: highlight.center,
  relativeTo: targetBar.center,
  boxReference: "artboard",
});
```

### Adding Threshold Lines

```typescript
// After creating a horizontal chart, add a threshold line
const thresholdValue = 75;
const absPos = chart.getAbsolutePosition();

// Calculate threshold position based on chart dimensions
const thresholdX = absPos.x + paddingLeft + 
  (thresholdValue / maxValue) * plotWidth;

const line = new Rect({
  width: 2,
  height: plotHeight,
  style: { fill: "#1976d2" },
});

line.position({
  relativeFrom: line.topLeft,
  relativeTo: { x: thresholdX, y: absPos.y + paddingTop },
  boxReference: "artboard",
});
```

## Examples

See the following examples in `/playground/examples/tests/`:

- **35-barchart-vertical.js** - Vertical bar charts with annotations, highlighting, and custom styling
- **36-barchart-horizontal.js** - Horizontal bar charts ideal for comparing categories with long labels

## Design Principles

The BarChart component follows the same design principles as FunctionGraph:

1. **Position Retrieval**: Every data point's screen position can be retrieved for custom annotations
2. **Remarkable Points**: Automatically detect and expose mathematically significant points
3. **Stylable**: Comprehensive styling options at both chart and individual bar levels
4. **Layout Integration**: Works seamlessly with Container, Grid, and other layout components

## Related Components

- **FunctionGraph** - For plotting mathematical functions
- **Container** - For organizing charts in layouts
- **Grid** - For multi-chart comparisons
- **Text/Latex** - For adding labels and annotations

