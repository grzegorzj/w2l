import { WebGL3DFigure, WebGL3DConfig } from "./WebGL3DFigure.js";

export interface CubeConfig extends WebGL3DConfig {
  size?: number;
}

/**
 * A 3D cube figure.
 * 
 * @example
 * ```typescript
 * const cube = new Cube({
 *   x: 50,
 *   y: 50,
 *   width: 200,
 *   height: 200,
 *   size: 2
 * });
 * ```
 */
export class Cube extends WebGL3DFigure {
  private size: number;

  constructor(config: CubeConfig) {
    super(config);
    this.size = config.size ?? 2;
    
    // Set default isometric rotation if not specified
    if (!config.rotation) {
      // Classic isometric angles: arctan(1/√2) for X, 45° for Y
      this.eulerRotation = [Math.atan(1 / Math.sqrt(2)), Math.PI / 4, 0];
    }
    
    // Set default camera position for better view if not specified
    if (!config.camera) {
      // Match reference example: camera at z=-10, but we translate in view matrix
      this.camera.position = [0, 0, 10];
    }
    
    // Set larger default scale to match reference proportions
    if (!config.scale) {
      this.scale = 20; // Make cube visible at proper size
    }
    
    this.buildGeometry();
  }
  
  /**
   * Render scene (for shaded mode - not used in wireframe)
   */
  protected renderScene(): void {
    // Not used for wireframe rendering
  }

  protected buildGeometry(): void {
    const s = this.size / 2;

    // Define 12 edges directly as vertex pairs (like the reference example)
    // Each edge is 2 vertices (start, end)
    this.vertices = new Float32Array([
      // Front face edges
      -s, -s, -s,  s, -s, -s,  // bottom edge
       s, -s, -s,  s,  s, -s,  // right edge
       s,  s, -s, -s,  s, -s,  // top edge
      -s,  s, -s, -s, -s, -s,  // left edge
      
      // Back face edges
      -s, -s,  s,  s, -s,  s,  // bottom edge
       s, -s,  s,  s,  s,  s,  // right edge
       s,  s,  s, -s,  s,  s,  // top edge
      -s,  s,  s, -s, -s,  s,  // left edge
      
      // Connecting edges (front to back)
      -s, -s, -s, -s, -s,  s,  // bottom-left
       s, -s, -s,  s, -s,  s,  // bottom-right
       s,  s, -s,  s,  s,  s,  // top-right
      -s,  s, -s, -s,  s,  s,  // top-left
    ]);

    // For wireframe, we'll directly use these as edges
    // Build edge list: each consecutive pair of vertices is an edge
    this.edges = [];
    for (let i = 0; i < 24; i += 2) {
      this.edges.push([i, i + 1]);
    }

    // Dummy normals (not used in wireframe mode)
    this.normals = new Float32Array(this.vertices.length);
    
    // No indices needed for direct edge rendering
    this.indices = new Uint16Array(0);
  }
}

