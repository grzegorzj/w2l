---
title: Conventions
category: Documentation
---

# W2L Mathematical Conventions

## Coordinate System

W2L uses the standard SVG coordinate system:

- **Origin**: Top-left corner (0, 0)
- **X-axis**: Increases to the right
- **Y-axis**: Increases downward
- **Angles**: 0° points right, increases clockwise (standard SVG convention)

## Polygon Winding Order

**Convention**: All polygons MUST use **counter-clockwise (CCW)** vertex ordering.

### Rationale

Counter-clockwise winding is the standard mathematical convention used in:

- Computer graphics (OpenGL, WebGL - CCW = front face)
- SVG (CCW = positive area)
- Computational geometry (right-hand rule)
- Mathematics textbooks

### Implementation Details

#### Right-Hand Rule for Normals

With counter-clockwise vertex ordering:

- **Outward normal**: Rotate the edge vector 90° clockwise (to the right when walking along edge)
  - For edge vector (dx, dy): outward normal = (-dy, dx)
- **Inward normal**: Rotate the edge vector 90° counter-clockwise (to the left when walking along edge)
  - For edge vector (dx, dy): inward normal = (dy, -dx)

#### Visual Example

```
Rectangle with CCW ordering:

  v0 -----→ v1
   ↑        |
   |        ↓
  v3 ←----- v2

  Order: v0 → v1 → v2 → v3 (counter-clockwise)

  Top side (v0→v1): edge = (width, 0), outward = (0, -1) [points up]
  Right side (v1→v2): edge = (0, height), outward = (1, 0) [points right]
  Bottom side (v2→v3): edge = (-width, 0), outward = (0, 1) [points down]
  Left side (v3→v0): edge = (0, -height), outward = (-1, 0) [points left]
```

#### Triangle Example

```
Right triangle with CCW ordering:

  v2
   |\
   | \
   |  \
   |   \
  v0---v1

  Order: v0 → v1 → v2 (counter-clockwise)
```

## Rotation

- **Positive angles**: Clockwise rotation (following SVG convention)
- **Reference point**: Shapes rotate around their center by default
- **Angle measurement**: Degrees (0° = right, 90° = down, 180° = left, 270° = up)

## Units

- **Default unit**: Pixels (px)
- **Supported units**: px, rem, em, pt, cm, mm, in, pc
- **Unitless numbers**: Treated as pixels

## Shape-Specific Conventions

### Triangles

- Vertices are always ordered counter-clockwise
- For right triangles: the right angle is at v0 by default

### Rectangles

- Vertices start at top-left and proceed counter-clockwise: TL → TR → BR → BL
- Sides are exposed in logical order: [top, right, bottom, left]

### Circles

- Center-based positioning
- Angles follow SVG convention (0° = right, clockwise positive)

## Breaking Changes History

### Version 0.1.x → 0.2.x (Current Refactor)

- **Changed**: All shapes now use counter-clockwise vertex ordering
- **Impact**: Outward and inward normals now point in correct directions
- **Migration**: No API changes, but visual positioning may differ if you relied on the incorrect normal directions

## References

- [SVG Coordinate System](https://www.w3.org/TR/SVG2/coords.html)
- [Right-Hand Rule in Computer Graphics](https://www.cs.oberlin.edu/~bob/cs357/VectorGeometry/VectorGeometry.pdf)
- [Polygon Winding Order](https://en.wikipedia.org/wiki/Curve_orientation)
