# Flowchart Guide

## Overview

The w2l library provides a comprehensive flowchart system with:

- **Theme-based styling** - Swiss design inspired themes with customizable colors
- **Smart collision-free routing** - Automatic pathfinding using A* algorithm
- **Flexible node types** - Different tints for various node purposes
- **Intelligent label positioning** - Labels that don't overlap with nodes

## Components

### Theme

The theme system provides consistent styling across all flowchart components:

```typescript
import { SwissTheme, createTheme } from "w2l";

// Use the default Swiss theme
const artboard = new Artboard({
  theme: SwissTheme
});

// Or create a custom theme
const customTheme = createTheme(SwissTheme, {
  colors: {
    accent: "#FF6B6B"
  }
});
```

### FlowBox

Individual flowchart nodes with theme-based styling:

```typescript
const box = new FlowBox({
  width: 140,
  height: 60,
  text: "Process Step",
  tint: "accent",  // 'default', 'accent', 'muted', or custom color
  theme: SwissTheme,
  doubleBorder: true  // Swiss design double border
});

// Position the box
box.position({
  relativeFrom: box.anchors.center,
  relativeTo: { x: 400, y: 200 },
  x: 0,
  y: 0
});

// Access anchor points for connections
const anchors = box.anchors;
// Available: top, right, bottom, left, center, topLeft, topRight, bottomLeft, bottomRight
```

### FlowConnector

Manual connectors with multiple routing options:

```typescript
const connector = new FlowConnector({
  from: box1.anchors.bottom,
  to: box2.anchors.top,
  routing: "orthogonal",  // 'straight', 'orthogonal', or 'curved'
  label: "Yes",
  labelMinDistanceFromEnds: 30,  // Prevents overlap with nodes
  theme: SwissTheme
});
```

### Flowchart (Smart Routing with Auto-Layout)

**Recommended**: Use the Flowchart component for automatic collision-free routing and optional automatic layout:

#### Option 1: Manual Positioning

```typescript
const flowchart = new Flowchart({
  nodes: [
    {
      id: 'start',
      text: 'Start',
      position: { x: 400, y: 100 },  // Explicit position
      width: 140,
      height: 60,
      tint: 'accent'
    },
    {
      id: 'process',
      text: 'Process Data',
      position: { x: 400, y: 200 },  // Explicit position
      width: 160,
      height: 60
    },
    {
      id: 'decision',
      text: 'Valid?',
      position: { x: 400, y: 300 },
      tint: 'muted'
    },
    {
      id: 'error',
      text: 'Handle Error',
      position: { x: 600, y: 300 },
      tint: '#FFE6E6'
    },
    {
      id: 'end',
      text: 'End',
      position: { x: 400, y: 400 },
      tint: 'accent'
    }
  ],
  connections: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'decision' },
    { from: 'decision', to: 'end', label: 'Yes' },
    { from: 'decision', to: 'error', label: 'No', fromAnchor: 'right', toAnchor: 'left' },
    { from: 'error', to: 'process' }  // Automatic routing around obstacles!
  ],
  theme: SwissTheme,
  minSpacing: 35,      // Minimum distance for labels from nodes
  nodePadding: 25,     // Padding around obstacles for pathfinding
  gridSize: 10         // Pathfinding grid precision
});

artboard.addElement(flowchart);
```

#### Option 2: Automatic Layout (NEW!)

Simply omit the `position` property from nodes:

```typescript
const flowchart = new Flowchart({
  nodes: [
    {
      id: 'start',
      text: 'Start',
      // NO position specified - will be calculated automatically!
      width: 140,
      height: 60,
      tint: 'accent'
    },
    {
      id: 'process',
      text: 'Process Data',
      // NO position specified!
      width: 160,
      height: 60
    },
    {
      id: 'decision',
      text: 'Valid?',
      tint: 'muted'
    },
    {
      id: 'end',
      text: 'End',
      tint: 'accent'
    }
  ],
  connections: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'decision' },
    { from: 'decision', to: 'end', label: 'Yes' }
  ],
  
  // Layout configuration (optional, these are defaults)
  layoutDirection: 'vertical',    // 'vertical' or 'horizontal'
  nodeSpacing: 60,                // Space between nodes on same level
  levelSpacing: 100,              // Space between levels
  layoutMargin: 50,               // Margin around flowchart
  startPosition: { x: 0, y: 0 },  // Starting point for layout
  
  theme: SwissTheme
});
```

#### Option 3: Hybrid Mode

Mix manual and automatic positioning:

```typescript
nodes: [
  {
    id: 'start',
    text: 'Start',
    position: { x: 400, y: 100 },  // Manually positioned
    tint: 'accent'
  },
  {
    id: 'process',
    text: 'Process',
    // Auto-positioned based on connections
  },
  {
    id: 'end',
    text: 'End',
    position: { x: 600, y: 400 },  // Manually positioned
  }
]
```

## Automatic Layout

The Flowchart component can automatically position nodes using a hierarchical layout algorithm:

### How Auto-Layout Works

1. **Layer Assignment**: Nodes are organized into layers using BFS (Breadth-First Search) based on connections
2. **Root Detection**: Finds nodes with no incoming connections to use as starting points
3. **Hierarchical Positioning**: Places nodes level-by-level with configurable spacing
4. **Direction Support**: Supports both vertical (top-to-bottom) and horizontal (left-to-right) layouts

### Layout Configuration

```typescript
{
  layoutDirection: 'vertical',    // 'vertical' or 'horizontal'
  nodeSpacing: 60,                // Space between nodes on same level (px)
  levelSpacing: 100,              // Space between levels (px)
  layoutMargin: 50,               // Margin around entire layout (px)
  startPosition: { x: 0, y: 0 }  // Starting point for layout
}
```

### When to Use Auto-Layout

✅ **Use auto-layout when:**
- Building flowcharts programmatically
- Layout structure is more important than precise positioning
- You want consistent spacing automatically
- Rapid prototyping or generated diagrams

❌ **Use manual positioning when:**
- You need precise control over node placement
- Creating custom layouts (circular, grid, etc.)
- Fine-tuning visual appearance
- Complex non-hierarchical structures

## Collision-Free Routing

The Flowchart component uses an **A* pathfinding algorithm** to route connectors around obstacles:

### How It Works

1. **Obstacle Detection**: All nodes except the source and target are treated as obstacles
2. **Grid-based Search**: The algorithm uses a configurable grid (default 10px) for pathfinding
3. **Padding**: Obstacles are expanded with padding (default 25px) to ensure clearance
4. **A* Algorithm**: Finds the shortest orthogonal path using Manhattan distance heuristic
5. **Path Simplification**: Removes redundant waypoints to create clean right-angle paths

### Configuration

- **`gridSize`**: Smaller values = more precise paths but slower (default: 10)
- **`nodePadding`**: Space around obstacles to maintain clearance (default: 25)
- **`minSpacing`**: Minimum distance for label placement from nodes (default: 35)

## Best Practices

### Node Layout

1. **Leave space** between nodes for connectors (minimum 60-80px)
2. **Use anchor specification** for complex layouts:
   ```typescript
   { from: 'node1', to: 'node2', fromAnchor: 'right', toAnchor: 'left' }
   ```
3. **Group related nodes** visually by position

### Tinting Strategy

- **`accent`** (blue): Start, end, and important nodes
- **`default`** (white): Regular process steps
- **`muted`** (gray): Decision points and conditional nodes
- **Custom colors**: Error states, warnings, or custom categories
  ```typescript
  tint: '#FFE6E6'  // Light red for errors
  ```

### Label Placement

Labels are automatically positioned on the longest segment of a path with proper spacing:

```typescript
{
  from: 'decision',
  to: 'nextStep',
  label: 'Yes',
  labelMinDistanceFromEnds: 35  // Adjust if labels touch nodes
}
```

## Examples

### Simple Linear Flow (Auto-Layout)

```typescript
const flowchart = new Flowchart({
  nodes: [
    { id: 'start', text: 'Start', tint: 'accent' },
    { id: 'step1', text: 'Step 1' },
    { id: 'step2', text: 'Step 2' },
    { id: 'end', text: 'End', tint: 'accent' }
  ],
  connections: [
    { from: 'start', to: 'step1' },
    { from: 'step1', to: 'step2' },
    { from: 'step2', to: 'end' }
  ],
  layoutDirection: 'vertical',
  nodeSpacing: 60,
  levelSpacing: 100
});
```

### Horizontal Flow

```typescript
const flowchart = new Flowchart({
  nodes: [
    { id: 'init', text: 'Initialize', tint: 'accent' },
    { id: 'load', text: 'Load Config' },
    { id: 'connect', text: 'Connect DB' },
    { id: 'ready', text: 'Ready', tint: 'accent' }
  ],
  connections: [
    { from: 'init', to: 'load' },
    { from: 'load', to: 'connect' },
    { from: 'connect', to: 'ready' }
  ],
  layoutDirection: 'horizontal',  // Left-to-right!
  levelSpacing: 120
});
```

### Branching Flow with Feedback Loop

```typescript
const flowchart = new Flowchart({
  nodes: [
    { id: 'start', text: 'Start', position: { x: 400, y: 100 }, tint: 'accent' },
    { id: 'process', text: 'Process', position: { x: 400, y: 200 } },
    { id: 'check', text: 'Valid?', position: { x: 400, y: 300 }, tint: 'muted' },
    { id: 'retry', text: 'Fix', position: { x: 200, y: 300 }, tint: '#FFE6E6' },
    { id: 'success', text: 'Success', position: { x: 600, y: 300 }, tint: 'accent' }
  ],
  connections: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'check' },
    { from: 'check', to: 'success', label: 'Yes' },
    { from: 'check', to: 'retry', label: 'No' },
    { from: 'retry', to: 'process', label: 'Retry' }  // Routes around 'check'
  ]
});
```

## Advanced Features

### Custom Anchor Points

Specify exact anchor points for precise control:

```typescript
{
  from: 'box1',
  to: 'box2',
  fromAnchor: 'right',  // Exit from right side
  toAnchor: 'left'      // Enter from left side
}
```

Available anchors: `'top'`, `'right'`, `'bottom'`, `'left'`, `'auto'` (default)

### Theme Customization

Create themed variants for different diagram styles:

```typescript
const errorTheme = createTheme(SwissTheme, {
  colors: {
    accent: '#E74C3C',
    border: '#C0392B'
  },
  presets: {
    box: {
      strokeWidth: "2"
    }
  }
});
```

### Manual vs Automatic Routing

**Use FlowConnector** when:
- You need exact control over the path
- Simple point-to-point connections
- No obstacles between nodes

**Use Flowchart** when:
- Complex layouts with many interconnections
- Feedback loops or backward connections
- You want automatic collision avoidance

## Performance Considerations

The A* pathfinding algorithm is efficient but can be tuned:

- **Larger gridSize** (15-20): Faster but less precise paths
- **Smaller gridSize** (5-8): More precise but slower for complex diagrams
- **Optimal**: 10px gridSize for most use cases

For very large flowcharts (50+ nodes), consider:
1. Breaking into smaller sub-diagrams
2. Using manual FlowConnector for simple connections
3. Increasing gridSize to 15-20

## Troubleshooting

### Labels Touching Nodes

Increase `minSpacing` or `labelMinDistanceFromEnds`:

```typescript
new Flowchart({ minSpacing: 40, ... })
// or
new FlowConnector({ labelMinDistanceFromEnds: 40, ... })
```

### Connectors Too Close to Boxes

Increase `nodePadding`:

```typescript
new Flowchart({ nodePadding: 30, ... })
```

### Path Not Found

If pathfinding fails (very rare), it falls back to direct line. Possible causes:
- Nodes completely blocking all paths
- Very tight spacing with large padding

**Solution**: Adjust node positions or decrease `nodePadding`.

