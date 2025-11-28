# Automatic Theming System

## Overview

The W2L library now includes an **automatic theming system** that applies professional Swiss design styling to all components by default. **No imports, no extra code, no ThemedBox** - just beautiful components out of the box.

## Design Philosophy

**Theme = Less Code**

Components are automatically themed with:
- Dimmed, professional color palette (no flashy colors)
- Delicate borders and subtle highlights
- Small paddings (12px) and border radiuses (2px)
- Clean typography with proper hierarchy
- Narrow bars for charts (60% width)
- Screen-optimized design

## Usage

### Before (Manual Styling)

```javascript
import { Rect, Text, defaultTheme } from "w2l";

// Had to manually apply theme
const box = new Rect({
  width: 200,
  height: 100,
  style: {
    ...defaultTheme.presets.container,
    fill: "#FFFFFF",
    stroke: "hsl(0, 0%, 90%)",
    strokeWidth: "1",
  },
  boxModel: {
    padding: 12,
  },
});

const text = new Text({
  content: "Hello",
  style: {
    ...defaultTheme.presets.text,
    fontSize: "1rem",
  },
});
```

### After (Automatic Theming) ✨

```javascript
import { Rect, Text } from "w2l";

// Automatically beautiful!
const box = new Rect({
  width: 200,
  height: 100,
});

const text = new Text({
  content: "Hello",
});
```

## What Gets Themed Automatically

### 1. Rect Component

```javascript
const box = new Rect({
  width: 200,
  height: 100,
});
// Auto-applied:
// - White background
// - Subtle border (1px, hsl(0, 0%, 90%))
// - 12px padding
// - 2px border radius
// - Professional appearance
```

### 2. Text Component

```javascript
const text = new Text({
  content: "My text",
});
// Auto-applied:
// - Clean Inter font family
// - Neutral gray color (#262626)
// - Proper sizing and weights
```

### 3. Charts

```javascript
const chart = new BarChart({
  width: 400,
  height: 300,
  data: [...],
  barSpacing: 0.4, // Narrow bars automatically styled
});
// Charts use dimmed colors and refined styling
```

## Customization

You can still override any theme defaults:

```javascript
// Override specific properties
const customBox = new Rect({
  width: 200,
  height: 100,
  style: {
    fill: "#FAFAFA",
    stroke: "hsl(358, 85%, 52%)", // Swiss Red
    strokeWidth: "2",
  },
});

// Override text styling
const customText = new Text({
  content: "Important",
  fontSize: "1.5rem",
  style: {
    fill: "hsl(358, 85%, 52%)",
    fontWeight: "700",
  },
});
```

## Components with Automatic Theming

| Component | Auto-Themed | Details |
|-----------|-------------|---------|
| `Rect` | ✅ | Container preset, padding, border radius |
| `Text` | ✅ | Typography preset, proper fonts |
| `Artboard` | ✅ | Background color from theme |
| `BarChart` | ✅ | Narrow bars, dimmed colors |
| `LineChart` | ✅ | Clean lines, subtle grids |
| `Container` | ⚠️ | Minimal (no padding by default) |

## Real Examples

### Simple Box with Text

```javascript
import { Artboard, Rect, Text, Container } from "w2l";

const artboard = new Artboard({ width: 400, height: 300 });

const box = new Rect({
  width: 200,
  height: 100,
});

const label = new Text({
  content: "Standard Box",
  fontSize: "0.875rem",
});

box.addElement(label);
label.position({
  relativeFrom: label.center,
  relativeTo: box.center,
});

artboard.addElement(box);
// Everything is automatically beautiful!
```

### Themed Charts

```javascript
import { Artboard, BarChart } from "w2l";

const artboard = new Artboard({ width: 600, height: 400 });

const chart = new BarChart({
  width: 500,
  height: 300,
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 78 },
  ],
  orientation: "vertical",
  barSpacing: 0.4, // Narrow, refined bars
  barColor: "#525252", // Dimmed neutral
  showGrid: true,
  showAxes: true,
});

artboard.addElement(chart);
// Professional chart with no theme imports!
```

## Benefits

### ✅ Less Code
No need to import or apply theme manually

### ✅ Consistent Design
All components automatically follow Swiss design principles

### ✅ Easy Customization
Override only what you need

### ✅ Professional Out of the Box
Beautiful visualizations with minimal effort

### ✅ No Breaking Changes
Existing code still works, just looks better

## Implementation Details

### How It Works

Components apply theme defaults in their constructors:

```typescript
// Rect.ts
import { defaultTheme } from "../core/Theme.js";

constructor(config: RectConfig) {
  const defaultStyle = {
    ...defaultTheme.presets.container,
  };
  
  const finalStyle = {
    ...defaultStyle,
    ...config.style, // User overrides
  };
  
  const defaultBoxModel = config.boxModel ?? {
    padding: defaultTheme.spacing[3], // 12px
  };
  
  super(config.width, config.height, defaultBoxModel, finalStyle);
}
```

### Theme Structure

The theme is defined once and referenced automatically:

```typescript
// Theme.ts
export const defaultTheme: Theme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#000000",
    primary: "hsl(358, 85%, 52%)",
    neutral: { /* 7-step scale */ },
    border: "hsl(0, 0%, 90%)",
  },
  typography: { /* fonts, sizes, weights */ },
  spacing: { /* 4px to 96px scale */ },
  borders: { width: 1, radius: { sm: 2 } },
  presets: { /* container, text, charts */ },
};
```

## Advanced: Custom Themes

If you need a custom theme (future feature):

```typescript
import { createTheme, SwissTheme } from "w2l";

const darkTheme = createTheme(SwissTheme, {
  colors: {
    background: "#1A1A1A",
    foreground: "#FFFFFF",
  },
});

// Apply to artboard
const artboard = new Artboard({
  width: 800,
  height: 600,
  theme: darkTheme,
});
```

## Migration Guide

### If You Were Using Manual Styling

**Before:**
```javascript
const box = new Rect({
  width: 200,
  height: 100,
  style: {
    fill: "#FFFFFF",
    stroke: "#E5E5E5",
    strokeWidth: "1",
  },
});
```

**After:**
```javascript
// Just remove the style! It's automatic
const box = new Rect({
  width: 200,
  height: 100,
});
```

### If You Need Different Styling

```javascript
// Override only what you need
const box = new Rect({
  width: 200,
  height: 100,
  style: {
    fill: "#F5F5F5", // Different background
    // stroke and strokeWidth still come from theme
  },
});
```

## Summary

The theming system now makes creating beautiful visualizations effortless. **No imports, no boilerplate, just clean code** that produces professional results automatically. This is how themes should work - invisible until you need them.

See examples:
- `playground/examples/tests/themed-demo.js`
- `playground/examples/tests/themed-charts.js`

