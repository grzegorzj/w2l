/**
 * Base class for 3D figures using WebGL rendering
 * 
 * This class provides a foundation for rendering 3D mathematical figures
 * using WebGL. The rendered 3D scene is converted to a data URL and embedded
 * in the final SVG output.
 * 
 * Features:
 * - WebGL-based 3D rendering with perspective projection
 * - Rotation in 3D space
 * - Plane highlighting with z-index support
 * - 3D to 2D coordinate projection for label placement
 * - Integration with the layout system via Rectangle
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

export interface Camera {
  position: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  fov: number; // Field of view in degrees
}

export interface Light {
  position: [number, number, number];
  color: [number, number, number];
  intensity: number;
}

export interface Material {
  color: [number, number, number, number]; // RGBA
  ambient: number;
  diffuse: number;
  specular: number;
  shininess: number;
}

export interface HighlightedPlane {
  /** Indices into the vertices array defining the plane */
  indices: number[];
  /** Material properties for this plane */
  material: Material;
  /** Z-index for rendering order (higher = on top) */
  zIndex?: number;
}

export type RenderMode = "wireframe" | "solid" | "shaded";
export type ProjectionType = "orthographic" | "perspective";

export interface WebGL3DConfig {
  width: number;
  height: number;
  camera?: Camera;
  lights?: Light[];
  rotation?: [number, number, number]; // Euler angles in degrees (x, y, z)
  scale?: number;
  backgroundColor?: [number, number, number, number]; // RGBA
  style?: Partial<Style>;
  boxModel?: BoxModel;
  /** Planes to highlight with special materials */
  highlightedPlanes?: HighlightedPlane[];
  /** Resolution multiplier for anti-aliasing (default: 2) */
  pixelRatio?: number;
  /** Rendering mode: wireframe (default, math textbook style), solid (flat shading), or shaded (Phong lighting) */
  renderMode?: RenderMode;
  /** Projection type: orthographic (default, isometric) or perspective */
  projectionType?: ProjectionType;
  /** Show hidden edges as dashed lines (wireframe mode only, default: true) */
  showHiddenEdges?: boolean;
  /** Stroke color for edges (wireframe mode, default: "#000000") */
  edgeColor?: string;
  /** Stroke width for edges (wireframe mode, default: 1.5) */
  edgeWidth?: number;
  /** Fill color for faces (solid mode, default: "#f0f0f0") */
  faceColor?: string;
}

/**
 * Abstract base class for WebGL-rendered 3D figures
 */
export abstract class WebGL3DFigure extends Rectangle {
  protected canvas: HTMLCanvasElement | null = null;
  protected gl: WebGLRenderingContext | null = null;
  protected camera: Camera;
  protected lights: Light[];
  protected eulerRotation: [number, number, number];
  protected scale: number;
  protected backgroundColor: [number, number, number, number];
  protected highlightedPlanes: HighlightedPlane[];
  protected pixelRatio: number;
  protected renderMode: RenderMode;
  protected projectionType: ProjectionType;
  protected showHiddenEdges: boolean;
  protected edgeColor: string;
  protected edgeWidth: number;
  protected faceColor: string;
  
  // Cached rendering
  protected cachedDataUrl: string | null = null;
  protected cachedSvgEdges: string | null = null;
  protected needsRerender: boolean = true;

  // Projection matrices
  protected viewMatrix: Float32Array = new Float32Array(16);
  protected projectionMatrix: Float32Array = new Float32Array(16);
  protected modelMatrix: Float32Array = new Float32Array(16);
  
  // Geometry data - subclasses will populate these
  protected vertices: Float32Array = new Float32Array(0);
  protected normals: Float32Array = new Float32Array(0);
  protected indices: Uint16Array = new Uint16Array(0);
  protected edges: Array<[number, number]> = []; // Edge list as vertex index pairs

  constructor(config: WebGL3DConfig) {
    super(config.width, config.height, config.boxModel, config.style);
    
    // Rendering style - default to wireframe for math textbook look
    this.renderMode = config.renderMode ?? "wireframe";
    this.projectionType = config.projectionType ?? "orthographic";
    this.showHiddenEdges = config.showHiddenEdges ?? true;
    this.edgeColor = config.edgeColor ?? "#000000";
    this.edgeWidth = config.edgeWidth ?? 1.5;
    this.faceColor = config.faceColor ?? "#f0f0f0";
    
    // Camera defaults to isometric view
    this.camera = config.camera ?? {
      position: [4, 3, 5],
      target: [0, 0, 0],
      up: [0, 1, 0],
      fov: 45, // Only used in perspective mode
    };
    
    this.lights = config.lights ?? [
      {
        position: [5, 5, 5],
        color: [1, 1, 1],
        intensity: 1.0,
      },
    ];
    
    this.eulerRotation = config.rotation ?? [20, 30, 0]; // Slightly rotated for isometric effect
    this.scale = config.scale ?? 1;
    this.backgroundColor = config.backgroundColor ?? [1, 1, 1, 1];
    this.highlightedPlanes = config.highlightedPlanes ?? [];
    this.pixelRatio = config.pixelRatio ?? 2;
  }

  /**
   * Initialize WebGL context and set up rendering
   */
  protected initWebGL(): void {
    if (typeof document === 'undefined') {
      console.warn('WebGL 3D figures require a browser environment');
      return;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    
    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    this.gl = gl;
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Set clear color
    gl.clearColor(...this.backgroundColor);
    
    // Set viewport
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
    // Build geometry
    this.buildGeometry();
    
    // Setup shaders and buffers
    this.setupShaders();
  }

  /**
   * Abstract method - subclasses implement to build their specific geometry
   */
  protected abstract buildGeometry(): void;

  /**
   * Setup shaders and WebGL programs
   */
  protected setupShaders(): void {
    if (!this.gl) return;

    const vertexShaderSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uNormalMatrix;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);
        vPosition = worldPosition.xyz;
        vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
        gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec3 uLightPosition;
      uniform vec3 uLightColor;
      uniform float uLightIntensity;
      uniform vec3 uCameraPosition;
      uniform vec4 uMaterialColor;
      uniform float uAmbient;
      uniform float uDiffuse;
      uniform float uSpecular;
      uniform float uShininess;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPosition - vPosition);
        vec3 viewDir = normalize(uCameraPosition - vPosition);
        vec3 halfDir = normalize(lightDir + viewDir);
        
        // Ambient
        vec3 ambient = uAmbient * uMaterialColor.rgb;
        
        // Diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = uDiffuse * diff * uLightColor * uLightIntensity * uMaterialColor.rgb;
        
        // Specular
        float spec = pow(max(dot(normal, halfDir), 0.0), uShininess);
        vec3 specular = uSpecular * spec * uLightColor * uLightIntensity;
        
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, uMaterialColor.a);
      }
    `;

    // Compile shaders and create program (implementation continues...)
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    const program = this.gl.createProgram();
    if (!program) return;
    
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(program));
      return;
    }
    
    this.gl.useProgram(program);
    
    // Store program for later use
    (this as any).program = program;
  }

  /**
   * Compile a shader
   */
  protected compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  /**
   * Set rotation of the 3D figure (Euler angles in degrees)
   */
  setRotation(x: number, y: number, z: number): void {
    this.eulerRotation = [x, y, z];
    this.needsRerender = true;
    this.cachedDataUrl = null;
    this.cachedSvgEdges = null;
  }

  /**
   * Get current rotation (Euler angles in degrees)
   */
  getRotation(): [number, number, number] {
    return [...this.eulerRotation] as [number, number, number];
  }

  /**
   * Set scale of the 3D figure
   */
  setScale(scale: number): void {
    this.scale = scale;
    this.needsRerender = true;
    this.cachedDataUrl = null;
    this.cachedSvgEdges = null;
  }

  /**
   * Add or update a highlighted plane
   */
  highlightPlane(plane: HighlightedPlane): void {
    const existingIndex = this.highlightedPlanes.findIndex(
      p => JSON.stringify(p.indices) === JSON.stringify(plane.indices)
    );
    
    if (existingIndex >= 0) {
      this.highlightedPlanes[existingIndex] = plane;
    } else {
      this.highlightedPlanes.push(plane);
    }
    
    this.needsRerender = true;
    this.cachedDataUrl = null;
  }

  /**
   * Project a 3D point to 2D screen coordinates
   * Returns coordinates in the final SVG coordinate system
   */
  projectPoint3DTo2D(point3D: [number, number, number]): Position {
    // Build transformation matrices
    this.updateMatrices();
    
    // Transform point through model-view-projection pipeline
    const mvpMatrix = this.multiplyMatrices(
      this.projectionMatrix,
      this.multiplyMatrices(this.viewMatrix, this.modelMatrix)
    );
    
    // Transform the point
    const point4D = [point3D[0], point3D[1], point3D[2], 1.0];
    const transformed = this.transformPoint(mvpMatrix, point4D);
    
    // Perspective divide
    if (transformed[3] !== 0) {
      transformed[0] /= transformed[3];
      transformed[1] /= transformed[3];
      transformed[2] /= transformed[3];
    }
    
    // Convert from NDC (-1 to 1) to screen space (0 to width/height)
    const screenX = (transformed[0] + 1) * 0.5 * this.width;
    const screenY = (1 - transformed[1]) * 0.5 * this.height; // Flip Y
    
    // Convert to absolute SVG coordinates
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + screenX,
      y: absPos.y + screenY,
    };
  }

  /**
   * Get multiple 3D points projected to 2D
   * Useful for labeling vertices of 3D shapes
   */
  projectPoints3DTo2D(points3D: Array<[number, number, number]>): Position[] {
    return points3D.map(p => this.projectPoint3DTo2D(p));
  }

  /**
   * Update transformation matrices
   */
  protected updateMatrices(): void {
    // Model matrix (rotation + scale)
    this.modelMatrix = this.createModelMatrix(this.eulerRotation, this.scale);
    
    // View matrix (camera)
    this.viewMatrix = this.createViewMatrix(
      this.camera.position,
      this.camera.target,
      this.camera.up
    );
    
    // Projection matrix (orthographic or perspective)
    if (this.projectionType === "orthographic") {
      // Match the reference example: larger view for proper sizing
      const aspect = this.width / this.height;
      const size = 4; // Larger orthographic view size (like -4 to 4 in reference)
      this.projectionMatrix = this.createOrthographicMatrix(
        -size * aspect, size * aspect, -size, size, 0.1, 100
      );
    } else {
      this.projectionMatrix = this.createProjectionMatrix(
        this.camera.fov,
        this.width / this.height,
        0.1,
        100
      );
    }
  }

  /**
   * Create model matrix from rotation and scale
   */
  protected createModelMatrix(rotation: [number, number, number], scale: number): Float32Array {
    const matrix = new Float32Array(16);
    
    // Start with identity
    matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
    
    // Apply scale
    matrix[0] = scale;
    matrix[5] = scale;
    matrix[10] = scale;
    
    // Apply rotations (X, then Y, then Z)
    const rx = rotation[0] * Math.PI / 180;
    const ry = rotation[1] * Math.PI / 180;
    const rz = rotation[2] * Math.PI / 180;
    
    const rotX = this.createRotationX(rx);
    const rotY = this.createRotationY(ry);
    const rotZ = this.createRotationZ(rz);
    
    let result = this.multiplyMatrices(rotZ, rotY);
    result = this.multiplyMatrices(result, rotX);
    result = this.multiplyMatrices(result, matrix);
    
    return result;
  }

  /**
   * Create view matrix (look-at)
   */
  protected createViewMatrix(
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number]
  ): Float32Array {
    const matrix = new Float32Array(16);
    
    // Calculate forward vector (from eye to target)
    const fx = target[0] - eye[0];
    const fy = target[1] - eye[1];
    const fz = target[2] - eye[2];
    const fLen = Math.sqrt(fx*fx + fy*fy + fz*fz);
    const f = [fx/fLen, fy/fLen, fz/fLen];
    
    // Calculate right vector (cross product of forward and up)
    const rx = f[1]*up[2] - f[2]*up[1];
    const ry = f[2]*up[0] - f[0]*up[2];
    const rz = f[0]*up[1] - f[1]*up[0];
    const rLen = Math.sqrt(rx*rx + ry*ry + rz*rz);
    const r = [rx/rLen, ry/rLen, rz/rLen];
    
    // Calculate up vector (cross product of right and forward)
    const ux = r[1]*f[2] - r[2]*f[1];
    const uy = r[2]*f[0] - r[0]*f[2];
    const uz = r[0]*f[1] - r[1]*f[0];
    
    // Build view matrix
    matrix[0] = r[0]; matrix[4] = r[1]; matrix[8] = r[2]; matrix[12] = -(r[0]*eye[0] + r[1]*eye[1] + r[2]*eye[2]);
    matrix[1] = ux;   matrix[5] = uy;   matrix[9] = uz;   matrix[13] = -(ux*eye[0] + uy*eye[1] + uz*eye[2]);
    matrix[2] = -f[0]; matrix[6] = -f[1]; matrix[10] = -f[2]; matrix[14] = (f[0]*eye[0] + f[1]*eye[1] + f[2]*eye[2]);
    matrix[3] = 0;    matrix[7] = 0;    matrix[11] = 0;    matrix[15] = 1;
    
    return matrix;
  }

  /**
   * Create perspective projection matrix
   */
  protected createProjectionMatrix(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Float32Array {
    const matrix = new Float32Array(16);
    const f = 1.0 / Math.tan((fov * Math.PI / 180) / 2);
    
    matrix[0] = f / aspect;
    matrix[5] = f;
    matrix[10] = (far + near) / (near - far);
    matrix[11] = -1;
    matrix[14] = (2 * far * near) / (near - far);
    
    return matrix;
  }

  /**
   * Create orthographic projection matrix (for isometric view)
   */
  protected createOrthographicMatrix(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Float32Array {
    const matrix = new Float32Array(16);
    
    matrix[0] = 2 / (right - left);
    matrix[5] = 2 / (top - bottom);
    matrix[10] = -2 / (far - near);
    matrix[12] = -(right + left) / (right - left);
    matrix[13] = -(top + bottom) / (top - bottom);
    matrix[14] = -(far + near) / (far - near);
    matrix[15] = 1; // Important for orthographic projection!
    matrix[15] = 1;
    
    return matrix;
  }

  // Matrix utility functions
  protected createRotationX(angle: number): Float32Array {
    const matrix = new Float32Array(16);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix[0] = 1; matrix[5] = c; matrix[6] = -s; matrix[10] = c; matrix[9] = s; matrix[15] = 1;
    return matrix;
  }

  protected createRotationY(angle: number): Float32Array {
    const matrix = new Float32Array(16);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix[0] = c; matrix[2] = s; matrix[5] = 1; matrix[8] = -s; matrix[10] = c; matrix[15] = 1;
    return matrix;
  }

  protected createRotationZ(angle: number): Float32Array {
    const matrix = new Float32Array(16);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix[0] = c; matrix[1] = -s; matrix[4] = s; matrix[5] = c; matrix[10] = 1; matrix[15] = 1;
    return matrix;
  }

  protected multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] = 
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
    
    return result;
  }

  protected transformPoint(matrix: Float32Array, point: number[]): number[] {
    const result = [0, 0, 0, 0];
    
    for (let i = 0; i < 4; i++) {
      result[i] = 
        matrix[i * 4 + 0] * point[0] +
        matrix[i * 4 + 1] * point[1] +
        matrix[i * 4 + 2] * point[2] +
        matrix[i * 4 + 3] * point[3];
    }
    
    return result;
  }

  /**
   * Render the WebGL scene and return data URL
   */
  protected renderToDataUrl(): string {
    if (this.cachedDataUrl && !this.needsRerender) {
      return this.cachedDataUrl;
    }

    if (!this.gl || !this.canvas) {
      this.initWebGL();
    }

    if (!this.gl || !this.canvas) {
      return '';
    }

    // Render the scene
    this.renderScene();
    
    // Convert to data URL
    this.cachedDataUrl = this.canvas.toDataURL('image/png');
    this.needsRerender = false;
    
    return this.cachedDataUrl;
  }

  /**
   * Render the WebGL scene
   */
  protected abstract renderScene(): void;

  /**
   * Render to SVG
   */
  render(): string {
    if (this.renderMode === "wireframe") {
      return this.renderWireframe();
    } else {
      const dataUrl = this.renderToDataUrl();
      const absPos = this.getAbsolutePosition();
      const transform = this.getTransformAttribute();
      
      return `<image x="${absPos.x}" y="${absPos.y}" width="${this.width}" height="${this.height}" href="${dataUrl}" ${transform}/>`;
    }
  }

  /**
   * Render as wireframe SVG (math textbook style)
   */
  protected renderWireframe(): string {
    if (this.cachedSvgEdges && !this.needsRerender) {
      return this.cachedSvgEdges;
    }

    // Build geometry if not already done
    if (this.vertices.length === 0) {
      this.buildGeometry();
    }

    this.updateMatrices();
    
    // Build edge list if not already done
    if (this.edges.length === 0) {
      this.buildEdges();
    }

    const absPos = this.getAbsolutePosition();
    let svg = `<g transform="translate(${absPos.x},${absPos.y})">`;

    // Add background if not transparent
    if (this.backgroundColor[3] > 0) {
      const [r, g, b, a] = this.backgroundColor.map(v => Math.round(v * 255));
      svg += `<rect width="${this.width}" height="${this.height}" fill="rgba(${r},${g},${b},${a})"/>`;
    }

    // Combine view and model matrices
    const mvMatrix = this.multiplyMatrices(this.viewMatrix, this.modelMatrix);
    
    // Project edges and determine visibility
    const projectedEdges: Array<{
      x1: number; y1: number; x2: number; y2: number;
      depth: number; isVisible: boolean;
    }> = [];
    
    for (const [i1, i2] of this.edges) {
      const v1 = [this.vertices[i1 * 3], this.vertices[i1 * 3 + 1], this.vertices[i1 * 3 + 2]];
      const v2 = [this.vertices[i2 * 3], this.vertices[i2 * 3 + 1], this.vertices[i2 * 3 + 2]];
      
      // Transform to view space for depth calculation
      const mv1 = this.transformPoint(mvMatrix, [...v1, 1]);
      const mv2 = this.transformPoint(mvMatrix, [...v2, 1]);
      
      // Project to screen space
      const p1 = this.projectPoint3DTo2D(v1 as [number, number, number]);
      const p2 = this.projectPoint3DTo2D(v2 as [number, number, number]);
      
      // Convert to local coordinates
      const x1 = p1.x - absPos.x;
      const y1 = p1.y - absPos.y;
      const x2 = p2.x - absPos.x;
      const y2 = p2.y - absPos.y;
      
      // Bounds check - skip edges that are completely off canvas
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      
      const margin = 50; // Small margin for edges that partially cross
      if (maxX < -margin || minX > this.width + margin ||
          maxY < -margin || minY > this.height + margin) {
        continue;
      }
      
      // Calculate average depth for sorting (more negative = closer to camera)
      const avgDepth = (mv1[2] + mv2[2]) / 2;
      
      // Determine visibility based on depth
      // For orthographic: check if edge is facing towards camera
      // Simplified: for now, consider front half as visible
      const isVisible = avgDepth < 0;
      
      projectedEdges.push({ x1, y1, x2, y2, depth: avgDepth, isVisible });
    }

    // Sort by depth (back to front)
    projectedEdges.sort((a, b) => a.depth - b.depth);

    // Render back faces first (if showing hidden edges)
    if (this.showHiddenEdges) {
      for (const edge of projectedEdges) {
        if (!edge.isVisible) {
          svg += `<line x1="${edge.x1.toFixed(2)}" y1="${edge.y1.toFixed(2)}" `;
          svg += `x2="${edge.x2.toFixed(2)}" y2="${edge.y2.toFixed(2)}" `;
          svg += `stroke="${this.edgeColor}" stroke-width="${this.edgeWidth}" `;
          svg += `stroke-dasharray="4,4" opacity="0.35" stroke-linecap="round"/>`;
        }
      }
    }

    // Render front faces
    for (const edge of projectedEdges) {
      if (edge.isVisible) {
        svg += `<line x1="${edge.x1.toFixed(2)}" y1="${edge.y1.toFixed(2)}" `;
        svg += `x2="${edge.x2.toFixed(2)}" y2="${edge.y2.toFixed(2)}" `;
        svg += `stroke="${this.edgeColor}" stroke-width="${this.edgeWidth}" `;
        svg += `stroke-linecap="round"/>`;
      }
    }

    svg += `</g>`;
    
    this.cachedSvgEdges = svg;
    this.needsRerender = false;
    
    return svg;
  }

  /**
   * Build edge list from geometry - subclasses should override if they have a better edge list
   */
  protected buildEdges(): void {
    // Default: extract edges from triangle indices
    const edgeSet = new Set<string>();
    
    for (let i = 0; i < this.indices.length; i += 3) {
      const i1 = this.indices[i];
      const i2 = this.indices[i + 1];
      const i3 = this.indices[i + 2];
      
      // Add three edges of the triangle (avoiding duplicates)
      const edges = [
        [Math.min(i1, i2), Math.max(i1, i2)],
        [Math.min(i2, i3), Math.max(i2, i3)],
        [Math.min(i3, i1), Math.max(i3, i1)]
      ];
      
      for (const [a, b] of edges) {
        const key = `${a},${b}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          this.edges.push([a, b]);
        }
      }
    }
  }

  /**
   * Clean up WebGL resources
   */
  dispose(): void {
    if (this.gl && this.canvas) {
      // Clean up WebGL resources
      const loseContext = this.gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
      this.canvas = null;
      this.gl = null;
    }
  }
}

