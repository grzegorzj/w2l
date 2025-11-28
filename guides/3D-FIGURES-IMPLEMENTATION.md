# 3D Figures Implementation Summary

This document describes the technical implementation of the 3D figures system in w2l.

## Architecture Overview

The 3D figures system is built on top of the existing Rectangle base class, allowing seamless integration with the layout system while providing full 3D rendering capabilities through WebGL.

### Class Hierarchy

```
Element (abstract)
  └─ Shape (abstract)
      └─ Rectangle (abstract)
          └─ WebGL3DFigure (abstract)
              ├─ Sphere
              ├─ Prism
              ├─ Pyramid
              └─ SolidOfRevolution
```

## Core Components

### 1. WebGL3DFigure (Base Class)

**Location**: `lib/elements/WebGL3DFigure.ts`

The abstract base class that provides:

#### WebGL Rendering Pipeline
- Canvas creation and WebGL context initialization
- Shader compilation and linking
- Vertex and normal buffer management
- Depth testing and blending
- Render-to-texture capability

#### Shaders
Built-in Phong shading model with:
- Vertex shader: Transforms vertices through MVP matrices
- Fragment shader: Calculates lighting (ambient, diffuse, specular)
- Support for multiple light sources

#### 3D Transformations
- **Model Matrix**: Handles object rotation and scale
- **View Matrix**: Implements look-at camera (eye position, target, up vector)
- **Projection Matrix**: Perspective projection with configurable FOV

#### Coordinate Projection
The `projectPoint3DTo2D()` method:
1. Takes a 3D point in model space
2. Transforms through model-view-projection matrices
3. Performs perspective divide
4. Converts from NDC (-1 to 1) to screen space
5. Accounts for the element's position in the SVG canvas
6. Returns absolute SVG coordinates

This enables precise placement of labels and markers at any 3D point.

#### Rendering Flow
```
buildGeometry() → setupShaders() → updateMatrices() → renderScene() → toDataURL() → SVG <image>
```

### 2. Sphere

**Location**: `lib/elements/Sphere.ts`

#### Geometry Generation
Uses UV sphere algorithm:
- Latitude loops (0 to π)
- Longitude loops (0 to 2π)
- Generates vertices, normals (same as normalized position for sphere)
- Creates triangle indices

#### Key Points
- North pole: [0, radius, 0]
- South pole: [0, -radius, 0]
- Equator points: at y=0 with various angles

#### Methods
- `getKeyPoints()`: Returns poles and equator points
- `getPointAtLatLon(lat, lon)`: Get any point on sphere surface

### 3. Prism

**Location**: `lib/elements/Prism.ts`

#### Geometry Generation
1. Calculate base polygon vertices (regular polygon)
2. Create top and bottom bases
3. Generate lateral rectangular faces
4. Calculate outward-facing normals for each face

#### Base Shape Support
- Predefined: triangular (3), square (4), pentagonal (5), hexagonal (6), octagonal (8)
- Custom: any number of sides

#### Methods
- `getVertices()`: All vertices
- `getTopBaseVertices()`: Top base vertices
- `getBottomBaseVertices()`: Bottom base vertices
- `getTopCenter()`, `getBottomCenter()`: Base centers

### 4. Pyramid

**Location**: `lib/elements/Pyramid.ts`

#### Geometry Generation
1. Calculate base polygon vertices
2. Create base face (bottom)
3. Generate lateral triangular faces (base edges to apex)
4. Calculate face normals using cross product

#### Methods
- `getApex()`: Apex position
- `getBaseVertices()`: Base polygon vertices
- `getBaseCenter()`: Center of base
- `getKeyPoints()`: All significant points

### 5. Solid of Revolution

**Location**: `lib/elements/SolidOfRevolution.ts`

#### Geometry Generation
1. Sample the radius function along Y axis
2. For each Y value, create a circle of vertices
3. Connect consecutive circles with quads (2 triangles each)
4. Calculate normals perpendicular to surface
5. Add caps at top/bottom if radius > 0

#### Normal Calculation
Approximates the surface normal by:
1. Computing derivative of radius function (dr/dy)
2. Creating perpendicular vector in cylindrical coordinates
3. Normalizing the result

#### Methods
- `getProfilePoints(n)`: Sample the generating curve
- `getCrossSection(y, n)`: Get circle of points at specific Y
- `getKeyPoints()`: Top, bottom, and max radius point

## Matrix Mathematics

The system implements its own matrix operations (4x4 matrices):

### Matrix Types

1. **Model Matrix**: Rotation × Scale
   - Rotation: Euler angles (X, Y, Z) applied in order
   - Scale: Uniform scaling

2. **View Matrix**: Look-at transformation
   - Forward vector: normalized (target - eye)
   - Right vector: cross(forward, up)
   - Up vector: cross(right, forward)

3. **Projection Matrix**: Perspective projection
   - Field of view (FOV)
   - Aspect ratio (width/height)
   - Near and far clipping planes

### Operations
- `multiplyMatrices(a, b)`: 4x4 matrix multiplication
- `transformPoint(matrix, point)`: 4D point transformation
- `createRotationX/Y/Z(angle)`: Rotation matrices

## Integration with Layout System

### Rectangle Inheritance

By extending Rectangle, 3D figures get:
- Width and height (canvas dimensions)
- Box model (margin, border, padding)
- Position accessors (topLeft, center, etc.)
- Container compatibility

### Positioning

```typescript
const sphere = new Sphere({ width: 400, height: 400, radius: 1.5 });

sphere.position({
  relativeFrom: sphere.center,
  relativeTo: { x: 500, y: 400 },
  x: 0,
  y: 0,
});

// Now projectPoint3DTo2D accounts for this position
const point2D = sphere.projectPoint3DTo2D([1, 0, 0]);
// point2D is in absolute SVG coordinates
```

## Rendering to SVG

### Process
1. Create offscreen canvas (width × pixelRatio, height × pixelRatio)
2. Initialize WebGL context
3. Render 3D scene
4. Convert canvas to data URL (PNG)
5. Embed as SVG `<image>` element

### Caching
- First render creates and caches the data URL
- Subsequent renders use cache unless:
  - Rotation changes
  - Scale changes
  - Materials/lights change
  - Geometry changes

### Anti-aliasing
- `pixelRatio` config option (default: 2)
- Higher values = better quality, larger file size
- Rendered at higher resolution, displayed at normal size

## Performance Characteristics

### Initialization
- First render initializes WebGL context: ~10-50ms
- Geometry generation: ~1-5ms (depends on tessellation)
- Shader compilation: ~5-20ms

### Rendering
- Render to canvas: ~5-20ms (depends on geometry complexity)
- Canvas to data URL: ~10-50ms (depends on size and pixelRatio)

### Memory
- WebGL context: ~5-10MB
- Vertex/normal buffers: Proportional to vertex count
- Cached image: Proportional to canvas size × pixelRatio

### Optimization Tips
1. Reuse figures instead of creating new ones
2. Use reasonable tessellation (32-64 segments)
3. Keep pixelRatio at 2 unless crisp detail needed
4. Dispose figures when done: `figure.dispose()`

## Browser Requirements

### WebGL Support
- All modern browsers support WebGL 1.0
- Fallback: Shows error message if WebGL unavailable

### Canvas API
- Required for `toDataURL()` conversion
- Preserves drawing buffer during conversion

### Security
- Data URLs subject to same-origin policy
- Canvas rendering doesn't violate CORS

## Future Enhancements

### Potential Additions
1. **Plane Highlighting**: Infrastructure exists, needs per-face rendering
2. **Wireframe Mode**: Show edges/vertices
3. **Texture Mapping**: Add images/patterns to surfaces
4. **Shadow Casting**: Enhanced realism
5. **Multiple Materials**: Different materials per face
6. **Animation**: Smooth rotation/transformation

### API Extensions
```typescript
// Future API ideas
figure.setWireframe(true);
figure.highlightFace(faceIndex, material);
figure.animateRotation(from, to, duration);
figure.addTexture(imageUrl);
```

## Testing Considerations

### Unit Tests
- Matrix operations
- Geometry generation (vertex counts, indices)
- Coordinate projection

### Integration Tests
- Rendering in different browsers
- Positioning relative to other elements
- Label placement accuracy

### Visual Tests
- Snapshot testing of rendered output
- Comparison with reference images

## Known Limitations

1. **Browser Only**: Requires WebGL, not available in pure Node.js
2. **Static Output**: Rendered to image, not interactive 3D
3. **File Size**: Data URLs increase SVG size
4. **No Ray Tracing**: Uses simple Phong shading
5. **Single Material**: Each figure has one primary material (multiple materials via highlighting not yet fully implemented)

## Code Quality

### Type Safety
- Full TypeScript with strict mode
- Explicit types for all parameters and returns
- No `any` types

### Documentation
- TSDoc comments on all public methods
- Usage examples in docstrings
- Comprehensive guide in markdown

### Error Handling
- Graceful fallback if WebGL unavailable
- Console warnings for invalid parameters
- Safe default values

## Conclusion

The 3D figures system provides a robust foundation for rendering mathematical 3D shapes in SVG documents. By combining WebGL's rendering power with the library's layout system, it enables creation of publication-quality mathematical diagrams with precise labeling and positioning.

The key innovation is the 3D-to-2D projection system that allows SVG elements (text, lines, etc.) to be positioned at specific 3D coordinates on the rendered figure, maintaining the precision and scalability of vector graphics while leveraging 3D rendering capabilities.

