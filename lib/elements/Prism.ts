/**
 * Prism - 3D prism with customizable base shape
 * 
 * A prism is a polyhedron with two parallel, congruent faces (bases)
 * connected by rectangular lateral faces.
 */

import { 
  WebGL3DFigure, 
  type WebGL3DConfig, 
  type Material,
  type HighlightedPlane 
} from "./WebGL3DFigure.js";

export type PrismBaseShape = 
  | 'triangular'
  | 'square'
  | 'pentagonal'
  | 'hexagonal'
  | 'octagonal';

export interface PrismConfig extends Omit<WebGL3DConfig, 'width' | 'height'> {
  baseShape: PrismBaseShape | number; // Shape or number of sides
  baseRadius: number; // Radius of the base polygon
  height: number; // Height of the prism
  canvasWidth?: number; // Canvas width (defaults to auto)
  canvasHeight?: number; // Canvas height (defaults to auto)
  material?: Material;
  /** Materials for specific faces */
  faceMaterials?: {
    topBase?: Material;
    bottomBase?: Material;
    lateral?: Material[];
  };
}

/**
 * 3D Prism
 * 
 * @example
 * ```typescript
 * const prism = new Prism({
 *   baseShape: 'hexagonal',
 *   baseRadius: 1,
 *   height: 2,
 *   rotation: [30, 45, 0],
 *   faceMaterials: {
 *     topBase: { color: [0.8, 0.3, 0.3, 0.8], ambient: 0.4, diffuse: 0.6, specular: 0.4, shininess: 16 },
 *   },
 * });
 * 
 * // Get vertices for labeling
 * const vertices = prism.getVertices();
 * const vertices2D = prism.projectPoints3DTo2D(vertices);
 * ```
 */
export class Prism extends WebGL3DFigure {
  private baseRadius: number;
  private prismHeight: number;
  private numSides: number;
  private material: Material;
  private faceMaterials?: PrismConfig['faceMaterials'];
  private vertexPositions: Array<[number, number, number]> = [];

  constructor(config: PrismConfig) {
    // Calculate canvas size if not provided
    const canvasWidth = config.canvasWidth ?? 400;
    const canvasHeight = config.canvasHeight ?? 400;
    
    super({
      ...config,
      width: canvasWidth,
      height: canvasHeight,
    });
    
    this.baseRadius = config.baseRadius;
    this.prismHeight = config.height;
    
    // Determine number of sides
    if (typeof config.baseShape === 'number') {
      this.numSides = config.baseShape;
    } else {
      const shapeMap: Record<PrismBaseShape, number> = {
        triangular: 3,
        square: 4,
        pentagonal: 5,
        hexagonal: 6,
        octagonal: 8,
      };
      this.numSides = shapeMap[config.baseShape];
    }
    
    this.material = config.material ?? {
      color: [0.6, 0.6, 0.8, 1.0],
      ambient: 0.3,
      diffuse: 0.6,
      specular: 0.5,
      shininess: 32,
    };
    
    this.faceMaterials = config.faceMaterials;
  }

  /**
   * Build prism geometry
   */
  protected buildGeometry(): void {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const angleStep = (2 * Math.PI) / this.numSides;
    const halfHeight = this.prismHeight / 2;

    // Generate base vertices (top and bottom)
    const topVertices: Array<[number, number, number]> = [];
    const bottomVertices: Array<[number, number, number]> = [];

    for (let i = 0; i < this.numSides; i++) {
      const angle = i * angleStep;
      const x = this.baseRadius * Math.cos(angle);
      const z = this.baseRadius * Math.sin(angle);
      
      topVertices.push([x, halfHeight, z]);
      bottomVertices.push([x, -halfHeight, z]);
      
      this.vertexPositions.push([x, halfHeight, z]);
      this.vertexPositions.push([x, -halfHeight, z]);
    }

    // Add top base
    const topCenter = vertices.length / 3;
    vertices.push(0, halfHeight, 0);
    normals.push(0, 1, 0);
    
    for (let i = 0; i < this.numSides; i++) {
      const [x, y, z] = topVertices[i];
      vertices.push(x, y, z);
      normals.push(0, 1, 0);
    }
    
    for (let i = 0; i < this.numSides; i++) {
      const next = (i + 1) % this.numSides;
      indices.push(topCenter, topCenter + i + 1, topCenter + next + 1);
    }

    // Add bottom base
    const bottomCenter = vertices.length / 3;
    vertices.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);
    
    for (let i = 0; i < this.numSides; i++) {
      const [x, y, z] = bottomVertices[i];
      vertices.push(x, y, z);
      normals.push(0, -1, 0);
    }
    
    for (let i = 0; i < this.numSides; i++) {
      const next = (i + 1) % this.numSides;
      indices.push(bottomCenter, bottomCenter + next + 1, bottomCenter + i + 1);
    }

    // Add lateral faces
    for (let i = 0; i < this.numSides; i++) {
      const next = (i + 1) % this.numSides;
      const [x1, y1, z1] = topVertices[i];
      const [x2, y2, z2] = topVertices[next];
      const [x3, y3, z3] = bottomVertices[i];
      const [x4, y4, z4] = bottomVertices[next];

      // Calculate face normal (pointing outward)
      const cx = (x1 + x2) / 2;
      const cz = (z1 + z2) / 2;
      const len = Math.sqrt(cx * cx + cz * cz);
      const nx = cx / len;
      const nz = cz / len;

      const baseIdx = vertices.length / 3;
      
      // Four vertices of the rectangular face
      vertices.push(x1, y1, z1);
      normals.push(nx, 0, nz);
      
      vertices.push(x2, y2, z2);
      normals.push(nx, 0, nz);
      
      vertices.push(x3, y3, z3);
      normals.push(nx, 0, nz);
      
      vertices.push(x4, y4, z4);
      normals.push(nx, 0, nz);

      // Two triangles
      indices.push(baseIdx, baseIdx + 2, baseIdx + 1);
      indices.push(baseIdx + 1, baseIdx + 2, baseIdx + 3);
    }

    this.vertices = new Float32Array(vertices);
    this.normals = new Float32Array(normals);
    this.indices = new Uint16Array(indices);
  }

  /**
   * Get all vertices of the prism
   */
  getVertices(): Array<[number, number, number]> {
    return [...this.vertexPositions];
  }

  /**
   * Get vertices of the top base
   */
  getTopBaseVertices(): Array<[number, number, number]> {
    return this.vertexPositions.filter((_, i) => i % 2 === 0);
  }

  /**
   * Get vertices of the bottom base
   */
  getBottomBaseVertices(): Array<[number, number, number]> {
    return this.vertexPositions.filter((_, i) => i % 2 === 1);
  }

  /**
   * Get center of top base
   */
  getTopCenter(): [number, number, number] {
    return [0, this.prismHeight / 2, 0];
  }

  /**
   * Get center of bottom base
   */
  getBottomCenter(): [number, number, number] {
    return [0, -this.prismHeight / 2, 0];
  }

  /**
   * Render the prism
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

