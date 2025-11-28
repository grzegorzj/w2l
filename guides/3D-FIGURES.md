# 3D Figures with WebGL

This guide covers the 3D figure rendering system in the w2l library. Unlike other elements that use pure SVG, 3D figures use WebGL for rendering and then embed the result as an image in the final SVG output.

## Overview

The 3D figures system provides:

- **WebGL-based rendering** - Full 3D graphics with lighting, materials, and perspective
- **3D to 2D projection** - Methods to convert 3D coordinates to 2D SVG space for precise label placement
- **Auto-labeling support** - Get key points (vertices, centers, etc.) in both 3D and 2D
- **Rotation and scaling** - Full control over camera position and object transformations
- **Plane highlighting** - Emphasize specific faces with custom materials and z-index ordering

## Available 3D Figures

### 1. Sphere

A perfect sphere with customizable tessellation.

```typescript
import { Sphere } from 'w2l';

const sphere = new Sphere({
  width: 300,
  height: 300,
  radius: 1.5,
  segments: 48, // Higher = smoother
  rotation: [20, 30, 0], // X, Y, Z rotation in degrees
  material: {
    color: [0.3, 0.5, 0.9, 1.0], // RGBA
    ambient: 0.3,
    diffuse: 0.7,
    specular: 0.9,
    shininess: 64,
  },
  camera: {
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: 45,
  },
});

// Get key points
const keyPoints = sphere.getKeyPoints();
// { northPole, southPole, equator }

// Project to 2D for labeling
const northPole2D = sphere.projectPoint3DTo2D(keyPoints.northPole);

// Get a point at specific latitude/longitude
const point = sphere.getPointAtLatLon(30, 45); // 30°N, 45°E
```

### 2. Prism

A prism with a polygonal base (triangular, square, pentagonal, hexagonal, octagonal, or custom).

```typescript
import { Prism } from 'w2l';

const prism = new Prism({
  baseShape: 'hexagonal', // or 'square', 'pentagonal', etc.
  // Or use a number: baseShape: 7 (for heptagonal)
  baseRadius: 1.0,
  height: 2.0,
  rotation: [20, 40, 0],
  material: {
    color: [0.9, 0.5, 0.3, 1.0],
    ambient: 0.3,
    diffuse: 0.6,
    specular: 0.5,
    shininess: 32,
  },
});

// Get vertices
const topVertices = prism.getTopBaseVertices();
const bottomVertices = prism.getBottomBaseVertices();
const allVertices = prism.getVertices();

// Project to 2D
const topVertices2D = prism.projectPoints3DTo2D(topVertices);
```

### 3. Pyramid

A pyramid with a polygonal base and apex.

```typescript
import { Pyramid } from 'w2l';

const pyramid = new Pyramid({
  baseShape: 'square',
  baseRadius: 1.2,
  height: 1.8,
  rotation: [20, 30, 0],
  material: {
    color: [0.9, 0.8, 0.3, 1.0],
    ambient: 0.3,
    diffuse: 0.6,
    specular: 0.5,
    shininess: 32,
  },
});

// Get key points
const keyPoints = pyramid.getKeyPoints();
// { apex, baseCenter, baseVertices }

// Project apex to 2D for labeling
const apex2D = pyramid.projectPoint3DTo2D(keyPoints.apex);
```

### 4. Solid of Revolution

Create solids by revolving a curve around the Y-axis. Perfect for visualizing calculus concepts.

```typescript
import { SolidOfRevolution } from 'w2l';

// Paraboloid: r(y) = sqrt(y)
const paraboloid = new SolidOfRevolution({
  radiusFunction: (y) => Math.sqrt(y) * 0.9,
  yStart: 0,
  yEnd: 1.5,
  ySegments: 40,
  radialSegments: 48,
  rotation: [20, 30, 0],
  material: {
    color: [0.3, 0.5, 0.9, 1.0],
    ambient: 0.3,
    diffuse: 0.6,
    specular: 0.7,
    shininess: 48,
  },
});

// Common shapes as functions:

// Sphere: r(y) = sqrt(1 - y^2)
const sphere = new SolidOfRevolution({
  radiusFunction: (y) => Math.sqrt(1 - y * y),
  yStart: -1,
  yEnd: 1,
});

// Cone: r(y) = 1 - y
const cone = new SolidOfRevolution({
  radiusFunction: (y) => 1 - y,
  yStart: 0,
  yEnd: 1,
});

// Hyperboloid: r(y) = sqrt(a^2 + y^2)
const hyperboloid = new SolidOfRevolution({
  radiusFunction: (y) => Math.sqrt(0.25 + y * y),
  yStart: -1,
  yEnd: 1,
});

// Get profile curve points
const profilePoints = paraboloid.getProfilePoints(20);

// Get cross-section at a specific y
const crossSection = paraboloid.getCrossSection(0.5, 16);
```

## 3D to 2D Projection

The key feature that enables proper labeling is the ability to project 3D coordinates to 2D SVG space:

```typescript
const sphere = new Sphere({
  width: 400,
  height: 400,
  radius: 1.5,
  rotation: [20, 30, 0],
});

sphere.position({
  relativeFrom: sphere.center,
  relativeTo: { x: 500, y: 400 },
  x: 0,
  y: 0,
});

artboard.addElement(sphere);

// Get a 3D point on the sphere
const point3D = sphere.getPointAtLatLon(45, 60); // [x, y, z]

// Project to 2D SVG coordinates
const point2D = sphere.projectPoint3DTo2D(point3D); // { x, y }

// Now you can position labels at this exact location
const label = new Text({ content: "P" });
label.position({
  relativeFrom: label.center,
  relativeTo: point2D,
  x: 0,
  y: -20, // Offset above the point
});
artboard.addElement(label);
```

The projection takes into account:
- The 3D figure's model transformation (rotation, scale)
- The camera position and orientation
- The perspective projection
- The figure's position in the SVG canvas

## Materials and Lighting

All 3D figures support customizable materials and lights:

```typescript
const material = {
  color: [0.8, 0.3, 0.3, 1.0], // RGBA (0-1 range)
  ambient: 0.3,   // Ambient lighting contribution
  diffuse: 0.6,   // Diffuse lighting contribution
  specular: 0.8,  // Specular highlights
  shininess: 64,  // Shininess exponent (higher = sharper highlights)
};

const lights = [
  {
    position: [5, 5, 5],      // Light position in 3D space
    color: [1, 1, 1],         // Light color (RGB, 0-1)
    intensity: 1.2,           // Light intensity
  },
  {
    position: [-3, -2, 3],    // Second light source
    color: [0.5, 0.5, 0.7],   // Colored light
    intensity: 0.4,
  },
];

const figure = new Sphere({
  width: 400,
  height: 400,
  radius: 1.5,
  material,
  lights,
});
```

## Camera Control

Control the viewpoint and perspective:

```typescript
const camera = {
  position: [0, 2, 5],    // Camera position in 3D space
  target: [0, 0, 0],      // Point the camera looks at
  up: [0, 1, 0],          // Up direction vector
  fov: 45,                // Field of view in degrees
};

const figure = new Sphere({
  width: 400,
  height: 400,
  radius: 1.5,
  camera,
});
```

## Rotation and Scaling

Transform the 3D object:

```typescript
const figure = new Pyramid({
  baseShape: 'square',
  baseRadius: 1.0,
  height: 1.5,
  rotation: [30, 45, 0],  // Euler angles in degrees (X, Y, Z)
  scale: 1.2,              // Uniform scale factor
});

// You can also change these after creation:
figure.setRotation(45, 60, 0);
figure.setScale(1.5);
```

## Complete Example: Labeled Sphere

```typescript
import { Artboard, Sphere, Text, Circle } from 'w2l';

const artboard = new Artboard({
  width: 800,
  height: 800,
  style: { fill: "#ffffff" },
});

// Create sphere
const sphere = new Sphere({
  width: 500,
  height: 500,
  radius: 2,
  segments: 64,
  rotation: [15, 25, 0],
  material: {
    color: [0.2, 0.4, 0.8, 1.0],
    ambient: 0.4,
    diffuse: 0.7,
    specular: 1.0,
    shininess: 128,
  },
});

sphere.position({
  relativeFrom: sphere.center,
  relativeTo: { x: 400, y: 400 },
  x: 0,
  y: 0,
});

artboard.addElement(sphere);

// Get and label key points
const keyPoints = sphere.getKeyPoints();

// North pole
const northPole2D = sphere.projectPoint3DTo2D(keyPoints.northPole);
const northLabel = new Text({
  content: "N (North Pole)",
  fontSize: 16,
});
northLabel.position({
  relativeFrom: northLabel.center,
  relativeTo: northPole2D,
  x: 0,
  y: -25,
});
artboard.addElement(northLabel);

// Add marker
const marker = new Circle({
  radius: 5,
  style: { fill: "#d32f2f" },
});
marker.position({
  relativeFrom: marker.center,
  relativeTo: northPole2D,
  x: 0,
  y: 0,
});
artboard.addElement(marker);

// Label custom points
const customPoint = sphere.getPointAtLatLon(30, 45);
const customPoint2D = sphere.projectPoint3DTo2D(customPoint);
// ... add label at customPoint2D

export default artboard.render();
```

## Performance Considerations

- **WebGL Context**: 3D figures create a WebGL context. This requires a browser environment (won't work in pure Node.js without a headless GL implementation)
- **Rendering Cache**: The rendered image is cached. Only re-renders when rotation, scale, or other properties change
- **Tessellation**: Higher segment counts produce smoother results but slower rendering
  - Sphere: 32-64 segments is usually sufficient
  - Solids of Revolution: 32-48 segments for both axes
- **Pixel Ratio**: The `pixelRatio` config option (default: 2) controls resolution. Higher values = crisper but larger images

## Browser Requirements

3D figures require:
- WebGL support (available in all modern browsers)
- Canvas API
- The `toDataURL()` method for canvas-to-image conversion

## Integration with Layout System

3D figures extend `Rectangle`, so they work seamlessly with the layout system:

```typescript
import { Container, Sphere, Pyramid, Prism } from 'w2l';

const container = new Container({
  direction: 'horizontal',
  gap: 40,
  horizontalAlignment: 'center',
});

container.addElement(new Sphere({ width: 250, height: 250, radius: 1 }));
container.addElement(new Pyramid({ baseShape: 'square', baseRadius: 1, height: 1.5 }));
container.addElement(new Prism({ baseShape: 'hexagonal', baseRadius: 1, height: 2 }));
```

## Advanced: Plane Highlighting

(Note: Full plane highlighting is supported by the base class but not yet fully implemented in subclasses. This is for future expansion.)

```typescript
const prism = new Prism({
  baseShape: 'hexagonal',
  baseRadius: 1,
  height: 2,
});

// Highlight a specific plane
prism.highlightPlane({
  indices: [0, 1, 2, 3], // Vertex indices defining the plane
  material: {
    color: [1.0, 0.3, 0.3, 0.8],
    ambient: 0.5,
    diffuse: 0.7,
    specular: 0.3,
    shininess: 16,
  },
  zIndex: 10, // Render on top
});
```

## Tips and Best Practices

1. **Start Simple**: Begin with default camera and lighting, then adjust
2. **Use Key Points**: Leverage the built-in methods like `getKeyPoints()` for labeling
3. **Project Consistently**: Always project 3D points to 2D after the figure is positioned
4. **Lighting**: Use 2-3 lights for best visual results
5. **Rotation**: Small rotations (15-30°) often look best for educational diagrams
6. **Material Colors**: Use slightly desaturated colors for a professional look

## Examples

See the test examples for complete demonstrations:
- `playground/examples/tests/3d-figures-demo.js` - Overview of all figure types
- `playground/examples/tests/3d-sphere-labeled.js` - Detailed sphere with labels
- `playground/examples/tests/3d-pyramid-prism.js` - Pyramids and prisms comparison
- `playground/examples/tests/3d-solids-of-revolution.js` - Various solids of revolution

