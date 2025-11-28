/**
 * Sphere - 3D sphere rendered with WebGL
 * 
 * A perfect sphere that can be rotated, scaled, and rendered with
 * customizable materials and lighting. Useful for mathematical
 * visualizations and geometry demonstrations.
 */

import { 
  WebGL3DFigure, 
  type WebGL3DConfig, 
  type Material,
  type HighlightedPlane 
} from "./WebGL3DFigure.js";

export interface SphereConfig extends Omit<WebGL3DConfig, 'highlightedPlanes'> {
  radius: number;
  segments?: number; // Tesselation detail (default: 32)
  material?: Material;
  /** Highlight specific latitude/longitude bands */
  highlightBands?: {
    /** Latitude bands to highlight (angles in degrees, -90 to 90) */
    latitude?: Array<{ angle: number; thickness: number; material: Material }>;
    /** Longitude bands to highlight (angles in degrees, 0 to 360) */
    longitude?: Array<{ angle: number; thickness: number; material: Material }>;
  };
}

/**
 * 3D Sphere
 * 
 * @example
 * ```typescript
 * const sphere = new Sphere({
 *   width: 300,
 *   height: 300,
 *   radius: 1,
 *   segments: 48,
 *   rotation: [20, 30, 0],
 *   material: {
 *     color: [0.3, 0.5, 0.8, 1.0],
 *     ambient: 0.3,
 *     diffuse: 0.7,
 *     specular: 0.8,
 *     shininess: 32,
 *   },
 * });
 * 
 * // Get 2D coordinates of the north pole for labeling
 * const northPole2D = sphere.projectPoint3DTo2D([0, 1, 0]);
 * ```
 */
export class Sphere extends WebGL3DFigure {
  private radius: number;
  private segments: number;
  private material: Material;
  private highlightBands?: SphereConfig['highlightBands'];

  constructor(config: SphereConfig) {
    super(config);
    
    this.radius = config.radius;
    this.segments = config.segments ?? 32;
    this.material = config.material ?? {
      color: [0.7, 0.7, 0.7, 1.0],
      ambient: 0.3,
      diffuse: 0.6,
      specular: 0.5,
      shininess: 32,
    };
    this.highlightBands = config.highlightBands;
  }

  /**
   * Build sphere geometry using UV sphere algorithm
   */
  protected buildGeometry(): void {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    // Generate vertices
    for (let lat = 0; lat <= this.segments; lat++) {
      const theta = (lat * Math.PI) / this.segments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= this.segments; lon++) {
        const phi = (lon * 2 * Math.PI) / this.segments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        // Position (scaled by radius)
        vertices.push(x * this.radius, y * this.radius, z * this.radius);
        
        // Normal (same as normalized position for sphere)
        normals.push(x, y, z);
      }
    }

    // Generate indices
    for (let lat = 0; lat < this.segments; lat++) {
      for (let lon = 0; lon < this.segments; lon++) {
        const first = lat * (this.segments + 1) + lon;
        const second = first + this.segments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.indices = new Uint16Array(indices);
  }

  /**
   * Get key points on the sphere (poles, equator points, etc.)
   * Useful for auto-labeling
   */
  getKeyPoints(): {
    northPole: [number, number, number];
    southPole: [number, number, number];
    equator: Array<[number, number, number]>;
  } {
    const equatorPoints: Array<[number, number, number]> = [];
    const numEquatorPoints = 8;
    
    for (let i = 0; i < numEquatorPoints; i++) {
      const angle = (i * 2 * Math.PI) / numEquatorPoints;
      equatorPoints.push([
        Math.cos(angle) * this.radius,
        0,
        Math.sin(angle) * this.radius,
      ]);
    }

    return {
      northPole: [0, this.radius, 0],
      southPole: [0, -this.radius, 0],
      equator: equatorPoints,
    };
  }

  /**
   * Get a point on the sphere surface given latitude and longitude
   * @param latitude Angle in degrees (-90 to 90)
   * @param longitude Angle in degrees (0 to 360)
   */
  getPointAtLatLon(latitude: number, longitude: number): [number, number, number] {
    const lat = (latitude * Math.PI) / 180;
    const lon = (longitude * Math.PI) / 180;
    
    const x = this.radius * Math.cos(lat) * Math.cos(lon);
    const y = this.radius * Math.sin(lat);
    const z = this.radius * Math.cos(lat) * Math.sin(lon);
    
    return [x, y, z];
  }

  /**
   * Render the sphere with WebGL
   */
  protected renderScene(): void {
    if (!this.gl || !this.canvas) return;

    const gl = this.gl;
    const program = (this as any).program;
    
    if (!program) return;

    // Clear
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update matrices
    this.updateMatrices();

    // Set up buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    // Get attribute locations
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aNormal = gl.getAttribLocation(program, 'aNormal');

    // Set position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    // Set normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    // Set uniforms
    const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');
    const uLightPosition = gl.getUniformLocation(program, 'uLightPosition');
    const uLightColor = gl.getUniformLocation(program, 'uLightColor');
    const uLightIntensity = gl.getUniformLocation(program, 'uLightIntensity');
    const uCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
    const uMaterialColor = gl.getUniformLocation(program, 'uMaterialColor');
    const uAmbient = gl.getUniformLocation(program, 'uAmbient');
    const uDiffuse = gl.getUniformLocation(program, 'uDiffuse');
    const uSpecular = gl.getUniformLocation(program, 'uSpecular');
    const uShininess = gl.getUniformLocation(program, 'uShininess');

    gl.uniformMatrix4fv(uModelMatrix, false, this.modelMatrix);
    gl.uniformMatrix4fv(uViewMatrix, false, this.viewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, this.projectionMatrix);
    gl.uniformMatrix4fv(uNormalMatrix, false, this.modelMatrix); // Simplified

    // Set lighting
    const light = this.lights[0];
    gl.uniform3fv(uLightPosition, light.position);
    gl.uniform3fv(uLightColor, light.color);
    gl.uniform1f(uLightIntensity, light.intensity);
    gl.uniform3fv(uCameraPosition, this.camera.position);

    // Set material
    gl.uniform4fv(uMaterialColor, this.material.color);
    gl.uniform1f(uAmbient, this.material.ambient);
    gl.uniform1f(uDiffuse, this.material.diffuse);
    gl.uniform1f(uSpecular, this.material.specular);
    gl.uniform1f(uShininess, this.material.shininess);

    // Draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    // Clean up
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(normalBuffer);
    gl.deleteBuffer(indexBuffer);
  }
}

