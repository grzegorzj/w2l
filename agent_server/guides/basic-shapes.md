# Basic Shapes Guide

## Overview
This guide covers the fundamental shapes available in the W2L library for creating simple geometric visualizations.

## When to Use This Guide
- Creating basic geometric diagrams
- Building simple illustrations with circles, rectangles, and other primitives
- Learning the fundamentals of the W2L library
- Positioning and styling basic shapes

## Available Basic Shapes

### Circle
A simple circular shape defined by a radius.

**Use Cases:**
- Dots and points
- Circular diagrams
- Venn diagrams
- Wheels and circular elements

**Key Properties:**
- `radius`: The radius of the circle
- `style`: Styling options (fill, stroke, etc.)

**Example:**
```javascript
new Circle({ 
  radius: 50,
  style: { fill: 'blue', stroke: 'black', strokeWidth: 2 }
})
```

### Rect (Rectangle)
A rectangular shape with width and height.

**Use Cases:**
- Boxes and containers
- Bars in charts
- Building blocks for layouts
- Frames and borders

**Key Properties:**
- `width`: The width of the rectangle
- `height`: The height of the rectangle
- `style`: Styling options
- `boxModel`: Optional padding, margin, border settings

**Example:**
```javascript
new Rect({ 
  width: 100, 
  height: 60,
  style: { fill: 'lightblue', stroke: 'navy' }
})
```

### Square
A special case of rectangle where width equals height.

**Use Cases:**
- Perfect squares
- Grid cells
- Icons and symbols

**Key Properties:**
- `size`: The size of the square (both width and height)
- `style`: Styling options

### Triangle
A three-sided polygon with various configuration options.

**Use Cases:**
- Arrows and directional indicators
- Warning symbols
- Geometric patterns
- Mountain representations

**Key Properties:**
- Various configuration options for different triangle types
- `style`: Styling options

### Line
A straight line between two points.

**Use Cases:**
- Connecting elements
- Axes in graphs
- Borders and dividers
- Arrows and pointers

**Key Properties:**
- Start and end positions
- `style`: Including stroke width and color

## Positioning
All shapes support flexible positioning:
- Absolute positioning with x, y coordinates
- Relative positioning to other elements
- Anchor-based positioning (top, center, bottom, left, right)

## Styling
Common style properties for all shapes:
- `fill`: Fill color
- `stroke`: Stroke color
- `strokeWidth`: Width of the stroke
- `opacity`: Transparency level
- `strokeDasharray`: Dashed line pattern

## Best Practices
1. Start with basic shapes before moving to complex components
2. Use consistent sizing and styling for related elements
3. Leverage positioning modes for better layout control
4. Consider using Container layouts for organizing multiple shapes
5. Apply themes for consistent visual design

