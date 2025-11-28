/**
 * Pyramid - 3D pyramid with customizable base shape
 * 
 * A pyramid is a polyhedron formed by connecting a polygonal base
 * and an apex point.
 */

import { 
  WebGL3DFigure, 
  type WebGL3DConfig, 
  type Material 
} from "./WebGL3DFigure.js";

export type PyramidBaseShape = 
  | 'triangular'
  | 'square'
  | 'pentagonal'
  | 'hexagonal'
  | 'octagonal';

export interface PyramidConfig extends Omit<WebGL3DConfig, 'width' | 'height'> {
  baseShape: PyramidBaseShape | number; // Shape or number of sides
  baseRadius: number; // Radius of the base polygon
  height: number; // Height from base to apex
  canvasWidth?: number;
  canvasHeight?: number;
  material?: Material;
  /** Materials for specific faces */
  faceMaterials?: {
    base?: Material;
    lateral?: Material[];
  };
}

/**
 * 3D Pyramid
 * 
 * @example
 * ```typescript
 * const pyramid = new Pyramid({
 *   baseShape: 'square',
 *   baseRadius: 1,
 *   height: 1.5,
 *   rotation: [20, 45, 0],
 *   faceMaterials: {
 *     base: { color: [0.8, 0.3, 0.3, 0.9], ambient: 0.4, diffuse: 0.6, specular: 0.4, shininess: 16 },
 *   },
 * });
 * 
 * // Get apex position for labeling
 * const apex = pyramid.getApex();
 * const apex2D = pyramid.projectPoint3DTo2D(apex);
 * ```
 */
export class Pyramid extends WebGL3DFigure {
  private baseRadius: number;
  private pyramidHeight: number;
  private numSides: number;
  private material: Material;
  private faceMaterials?: PyramidConfig['faceMaterials'];
  private baseVertices: Array<[number, number, number]> = [];
  private apexPosition: [number, number, number];

  constructor(config: PyramidConfig) {
    const canvasWidth = config.canvasWidth ?? 400;
    const canvasHeight = config.canvasHeight ?? 400;
    
    super({
      ...config,
      width: canvasWidth,
      height: canvasHeight,
    });
    
    this.baseRadius = config.baseRadius;
    this.pyramidHeight = config.height;
    
    // Determine number of sides
    if (typeof config.baseShape === 'number') {
      this.numSides = config.baseShape;
    } else {
      const shapeMap: Record<PyramidBaseShape, number> = {
        triangular: 3,
        square: 4,
        pentagonal: 5,
        hexagonal: 6,
        octagonal: 8,
      };
      this.numSides = shapeMap[config.baseShape];
    }
    
    this.material = config.material ?? {
      color: [0.8, 0.6, 0.4, 1.0],
      ambient: 0.3,
      diffuse: 0.6,
      specular: 0.5,
      shininess: 32,
    };
    
    this.faceMaterials = config.faceMaterials;
    
    // Calculate apex position
    this.apexPosition = [0, this.pyramidHeight / 2, 0];
  }

  /**
   * Build pyramid geometry
   */
  protected buildGeometry(): void {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const angleStep = (2 * Math.PI) / this.numSides;
    const baseY = -this.pyramidHeight / 2;
    const apexY = this.pyramidHeight / 2;

    // Generate base vertices
    for (let i = 0; i < this.numSides; i++) {
      const angle = i * angleStep;
      const x = this.baseRadius * Math.cos(angle);
      const z = this.baseRadius * Math.sin(angle);
      this.baseVertices.push([x, baseY, z]);
    }

    // Add base (bottom)
    const baseCenter = vertices.length / 3;
    vertices.push(0, baseY, 0);
    normals.push(0, -1, 0);
    
    for (let i = 0; i < this.numSides; i++) {
      const [x, y, z] = this.baseVertices[i];
      vertices.push(x, y, z);
      normals.push(0, -1, 0);
    }
    
    // Base triangles (reversed winding for bottom face)
    for (let i = 0; i < this.numSides; i++) {
      const next = (i + 1) % this.numSides;
      indices.push(baseCenter, baseCenter + next + 1, baseCenter + i + 1);
    }

    // Add lateral faces (triangles from base edges to apex)
    for (let i = 0; i < this.numSides; i++) {
      const next = (i + 1) % this.numSides;
      const [x1, y1, z1] = this.baseVertices[i];
      const [x2, y2, z2] = this.baseVertices[next];

      // Calculate face normal
      // Triangle: (x1,y1,z1), (x2,y2,z2), (0,apexY,0)
      const v1x = x2 - x1;
      const v1y = y2 - y1;
      const v1z = z2 - z1;
      const v2x = 0 - x1;
      const v2y = apexY - y1;
      const v2z = 0 - z1;
      
      // Cross product
      let nx = v1y * v2z - v1z * v2y;
      let ny = v1z * v2x - v1x * v2z;
      let nz = v1x * v2y - v1y * v2x;
      
      // Normalize
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const baseIdx = vertices.length / 3;
      
      // Three vertices of the triangular face
      vertices.push(x1, y1, z1);
      normals.push(nx, ny, nz);
      
      vertices.push(x2, y2, z2);
      normals.push(nx, ny, nz);
      
      vertices.push(0, apexY, 0); // Apex
      normals.push(nx, ny, nz);

      // Triangle
      indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
    }

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.indices = new Uint16Array(indices);
  }

  /**
   * Get the apex (top point) of the pyramid
   */
  getApex(): [number, number, number] {
    return [...this.apexPosition] as [number, number, number];
  }

  /**
   * Get vertices of the base
   */
  getBaseVertices(): Array<[number, number, number]> {
    return [...this.baseVertices];
  }

  /**
   * Get center of the base
   */
  getBaseCenter(): [number, number, number] {
    return [0, -this.pyramidHeight / 2, 0];
  }

  /**
   * Get all significant points (apex + base vertices + base center)
   */
  getKeyPoints(): {
    apex: [number, number, number];
    baseCenter: [number, number, number];
    baseVertices: Array<[number, number, number]>;
  } {
    return {
      apex: this.getApex(),
      baseCenter: this.getBaseCenter(),
      baseVertices: this.getBaseVertices(),
    };
  }

  /**
   * Render the pyramid
   */
  protected renderScene(): void {
    if (!this.gl || !this.canvas) return;

    const gl = this.gl;
    const program = (this as any).program;
    
    if (!program) return;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

    // Get locations
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aNormal = gl.getAttribLocation(program, 'aNormal');

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

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
    gl.uniformMatrix4fv(uNormalMatrix, false, this.modelMatrix);

    const light = this.lights[0];
    gl.uniform3fv(uLightPosition, light.position);
    gl.uniform3fv(uLightColor, light.color);
    gl.uniform1f(uLightIntensity, light.intensity);
    gl.uniform3fv(uCameraPosition, this.camera.position);

    gl.uniform4fv(uMaterialColor, this.material.color);
    gl.uniform1f(uAmbient, this.material.ambient);
    gl.uniform1f(uDiffuse, this.material.diffuse);
    gl.uniform1f(uSpecular, this.material.specular);
    gl.uniform1f(uShininess, this.material.shininess);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(normalBuffer);
    gl.deleteBuffer(indexBuffer);
  }
}

