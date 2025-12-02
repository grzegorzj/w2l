/**
 * New layout system - RegularPolygon
 * A regular polygon with n sides (pentagon, hexagon, octagon, etc.)
 */

import { Shape } from "../core/Shape.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { type Position } from "../core/Element.js";
import { Side } from "./Side.js";
import { Angle } from "../components/Angle.js";

export interface RegularPolygonConfig {
  sides: number;      // Number of sides (3 = triangle, 4 = square, 5 = pentagon, etc.)
  radius: number;     // Radius of the circumscribed circle
  rotation?: number;  // Rotation in degrees (0 = flat bottom for even-sided polygons)
  style?: Partial<Style>;
}

/**
 * Regular polygon with n sides inscribed in a circle
 */
export class RegularPolygon extends Shape {
  private sides: number;
  private radius: number;
  private initialRotation: number; // Initial rotation for vertex positioning
  private vertices: Position[];

  constructor(config: RegularPolygonConfig) {
    super(config.style);
    this.sides = config.sides;
    this.radius = config.radius;
    this.initialRotation = config.rotation ?? 0;
    
    this.vertices = this.calculateVertices();
  }

  private calculateVertices(): Position[] {
    const vertices: Position[] = [];
    const angleStep = (2 * Math.PI) / this.sides;
    const rotationRad = (this.initialRotation * Math.PI) / 180;

    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep + rotationRad;
      vertices.push({
        x: this.radius * Math.cos(angle),
        y: this.radius * Math.sin(angle),
      });
    }

    return vertices;
  }

  /**
   * Get the center of the polygon
   */
  get center(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x,
      y: absPos.y,
    };
  }

  /**
   * Get the bounding box center (used for alignment in containers)
   */
  get boundingBoxCenter(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + (minY + maxY) / 2,
    };
  }

  /**
   * Get the bounding box top-left corner
   */
  get boundingBoxTopLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    
    return {
      x: absPos.x + minX,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the top-left corner position (bounding box).
   */
  get topLeft(): Position {
    return this.boundingBoxTopLeft;
  }

  /**
   * Get the top-right corner position (bounding box).
   */
  get topRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the bottom-left corner position (bounding box).
   */
  get bottomLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + minX,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the bottom-right corner position (bounding box).
   */
  get bottomRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the center-top position (bounding box).
   */
  get centerTop(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);

    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the center-bottom position (bounding box).
   */
  get centerBottom(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the center-left position (bounding box).
   */
  get centerLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + minX,
      y: absPos.y + (minY + maxY) / 2,
    };
  }

  /**
   * Get the center-right position (bounding box).
   */
  get centerRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + (minY + maxY) / 2,
    };
  }

  /**
   * Convenient alias for centerTop.
   */
  get top(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerTop.
   */
  get topCenter(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottom(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottomCenter(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerLeft.
   */
  get left(): Position {
    return this.centerLeft;
  }

  /**
   * Convenient alias for centerRight.
   */
  get right(): Position {
    return this.centerRight;
  }

  /**
   * Get the bounding box width
   */
  get boundingWidth(): number {
    const xs = this.vertices.map(v => v.x);
    return Math.max(...xs) - Math.min(...xs);
  }

  /**
   * Get the bounding box height
   */
  get boundingHeight(): number {
    const ys = this.vertices.map(v => v.y);
    return Math.max(...ys) - Math.min(...ys);
  }

  /**
   * Get the vertices in absolute coordinates
   */
  get absoluteVertices(): Position[] {
    const absPos = this.getAbsolutePosition();
    return this.vertices.map(v => ({
      x: absPos.x + v.x,
      y: absPos.y + v.y,
    }));
  }

  /**
   * Get the apothem (distance from center to middle of a side)
   */
  get apothem(): number {
    return this.radius * Math.cos(Math.PI / this.sides);
  }

  /**
   * Get the side length
   */
  get sideLength(): number {
    return 2 * this.radius * Math.sin(Math.PI / this.sides);
  }

  /**
   * Get a specific vertex by index
   * @param index - Vertex index (0 to sides-1)
   * @returns Absolute position of the vertex
   */
  getVertex(index: number): Position {
    const verts = this.absoluteVertices;
    return verts[index % this.sides];
  }

  /**
   * Get all sides of the polygon with geometric properties
   * @returns Array of side objects with center, normals, etc.
   */
  getSides(): Array<{
    length: number;
    center: Position;
    start: Position;
    end: Position;
    angle: number;
    outwardNormal: Position;
    inwardNormal: Position;
    direction: Position;
  }> {
    const verts = this.absoluteVertices;
    const sides = [];

    for (let i = 0; i < this.sides; i++) {
      const start = verts[i];
      const end = verts[(i + 1) % this.sides];
      const side = new Side({ start, end });

      sides.push({
        length: side.length,
        center: side.center,
        start: side.start,
        end: side.end,
        angle: side.angle,
        outwardNormal: side.outwardNormal,
        inwardNormal: side.inwardNormal,
        direction: side.direction,
      });
    }

    return sides;
  }

  /**
   * Creates an angle marker for a specific vertex of the polygon.
   *
   * @param vertexIndex - Index of the vertex (0 to sides-1)
   * @param options - Configuration for the angle marker
   * @param options.mode - 'internal' for internal angle, 'external' for external angle
   * @param options.label - Optional label for the angle (e.g., "108°")
   * @param options.radius - Radius of the angle arc (default: 40)
   * @param options.color - Color for the angle marker
   * @param options.style - SVG style for the angle marker
   * @returns Angle element
   *
   * @example
   * ```typescript
   * const pentagon = new RegularPolygon({ sides: 5, radius: 80 });
   * const angle = pentagon.showAngle(0, { mode: 'internal', label: "108°", color: "#ef4444" });
   * artboard.add(pentagon);
   * artboard.add(angle);
   * ```
   */
  showAngle(
    vertexIndex: number,
    options?: {
      mode?: "internal" | "external";
      label?: string;
      radius?: number;
      color?: string;
      style?: Partial<Style>;
    }
  ): Angle {
    const mode = options?.mode ?? "internal";
    const verts = this.absoluteVertices;
    const n = this.sides;

    // Get the two sides that meet at this vertex
    const prevVertexIdx = (vertexIndex - 1 + n) % n;
    const nextVertexIdx = (vertexIndex + 1) % n;

    const incomingSide = new Side({
      start: verts[prevVertexIdx],
      end: verts[vertexIndex],
    });

    const outgoingSide = new Side({
      start: verts[vertexIndex],
      end: verts[nextVertexIdx],
    });

    // Merge color into style if provided
    const finalStyle = options?.color
      ? { ...options.style, stroke: options.color }
      : options?.style;

    return new Angle({
      from: "vertex",
      segments: [incomingSide, outgoingSide],
      mode: mode,
      label: options?.label,
      radius: options?.radius,
      style: finalStyle,
    });
  }

  /**
   * Creates angle markers for vertices of the polygon.
   *
   * @param options - Configuration for the angle markers
   * @param options.mode - 'internal' for internal angles, 'external' for external angles
   * @param options.indices - Optional array of vertex indices to mark (defaults to all)
   * @param options.label - Label for all marked angles (e.g., "108°")
   * @param options.radius - Radius of the angle arcs (default: 40)
   * @param options.color - Color for all angle markers
   * @param options.style - SVG style for the angle markers
   * @returns Array of Angle elements
   *
   * @example
   * ```typescript
   * const hexagon = new RegularPolygon({ sides: 6, radius: 80 });
   * // Mark only vertices 0, 1, and 2
   * const angles = hexagon.showAngles({ 
   *   indices: [0, 1, 2], 
   *   label: "120°",
   *   color: "#ef4444"
   * });
   * artboard.add(hexagon);
   * angles.forEach(angle => artboard.add(angle));
   * ```
   */
  showAngles(options?: {
    mode?: "internal" | "external";
    indices?: number[];
    label?: string;
    radius?: number;
    color?: string;
    style?: Partial<Style>;
  }): Angle[] {
    const mode = options?.mode ?? "internal";
    const indices = options?.indices ?? Array.from({ length: this.sides }, (_, i) => i);
    
    return indices.map(i => 
      this.showAngle(i, { 
        mode,
        label: options?.label,
        radius: options?.radius,
        color: options?.color,
        style: options?.style
      })
    );
  }

  render(): string {
    const verts = this.absoluteVertices;
    const points = verts.map(v => `${v.x},${v.y}`).join(" ");
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();
    
    return `<polygon points="${points}" ${attrs} ${transform}/>`;
  }

  /**
   * Get the bounding box of this polygon in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const bbTopLeft = this.boundingBoxTopLeft;
    return {
      minX: bbTopLeft.x,
      minY: bbTopLeft.y,
      maxX: bbTopLeft.x + this.boundingWidth,
      maxY: bbTopLeft.y + this.boundingHeight,
    };
  }

  /**
   * Get the transformed corners (vertices) after rotation.
   * Returns all vertices after applying rotation.
   */
  getCorners(): { x: number; y: number }[] {
    if (this._rotation === 0) {
      // No rotation - return regular vertices
      return this.absoluteVertices;
    }

    // Get center point for rotation
    const center = this.center;
    const cx = center.x;
    const cy = center.y;

    // Get original vertices
    const vertices = this.absoluteVertices;

    // Rotate each vertex around the center
    const rotationRad = (this._rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    return vertices.map(vertex => {
      // Translate to origin
      const x = vertex.x - cx;
      const y = vertex.y - cy;

      // Rotate
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;

      // Translate back
      return {
        x: rotatedX + cx,
        y: rotatedY + cy,
      };
    });
  }
}

