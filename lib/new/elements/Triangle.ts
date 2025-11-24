/**
 * New layout system - Triangle
 * A triangle shape with various types (right, equilateral, isosceles)
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export type TriangleType = "right" | "equilateral" | "isosceles";
export type TriangleOrientation = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface NewTriangleConfig {
  type: TriangleType;
  a: number;  // First side length
  b?: number; // Second side length (optional for equilateral)
  c?: number; // Third side length (for custom triangles)
  orientation?: TriangleOrientation;
  style?: Partial<Style>;
}

export interface TriangleSide {
  length: number;
  center: Position;
  angle: number; // Angle in degrees
  outwardNormal: Position; // Unit vector
}

/**
 * Triangle shape with automatic vertex calculation
 */
export class NewTriangle extends NewShape {
  private vertices: [Position, Position, Position];
  private _center: Position;
  private _boundingWidth: number;
  private _boundingHeight: number;

  constructor(config: NewTriangleConfig) {
    super(config.style);
    
    const orientation = config.orientation ?? "bottomLeft";
    this.vertices = this.calculateVertices(config, orientation);
    
    // Calculate bounding box and center
    const xs = this.vertices.map(v => v.x);
    const ys = this.vertices.map(v => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    this._boundingWidth = maxX - minX;
    this._boundingHeight = maxY - minY;
    
    // Center is the centroid of the triangle
    this._center = {
      x: (this.vertices[0].x + this.vertices[1].x + this.vertices[2].x) / 3,
      y: (this.vertices[0].y + this.vertices[1].y + this.vertices[2].y) / 3,
    };
  }

  private calculateVertices(
    config: NewTriangleConfig,
    orientation: TriangleOrientation
  ): [Position, Position, Position] {
    const { type, a, b } = config;

    if (type === "right") {
      const sideA = a;
      const sideB = b ?? a; // Default to isosceles right triangle
      const sideC = Math.sqrt(sideA * sideA + sideB * sideB); // Pythagorean theorem

      // Create vertices based on orientation
      switch (orientation) {
        case "bottomLeft":
          return [
            { x: 0, y: 0 },           // Right angle at origin
            { x: sideA, y: 0 },       // Along x-axis
            { x: 0, y: -sideB },      // Along y-axis (up)
          ];
        case "bottomRight":
          return [
            { x: 0, y: 0 },           // Right angle at origin
            { x: -sideA, y: 0 },      // Along negative x-axis
            { x: 0, y: -sideB },      // Along y-axis (up)
          ];
        case "topLeft":
          return [
            { x: 0, y: 0 },           // Right angle at origin
            { x: sideA, y: 0 },       // Along x-axis
            { x: 0, y: sideB },       // Along y-axis (down)
          ];
        case "topRight":
          return [
            { x: 0, y: 0 },           // Right angle at origin
            { x: -sideA, y: 0 },      // Along negative x-axis
            { x: 0, y: sideB },       // Along y-axis (down)
          ];
      }
    } else if (type === "equilateral") {
      const side = a;
      const height = (side * Math.sqrt(3)) / 2;
      
      // Equilateral triangle pointing up
      return [
        { x: -side / 2, y: height / 3 },      // Bottom left
        { x: side / 2, y: height / 3 },       // Bottom right
        { x: 0, y: -2 * height / 3 },         // Top
      ];
    } else if (type === "isosceles") {
      const base = a;
      const height = b ?? a;
      
      // Isosceles triangle pointing up
      return [
        { x: -base / 2, y: height / 2 },      // Bottom left
        { x: base / 2, y: height / 2 },       // Bottom right
        { x: 0, y: -height / 2 },             // Top
      ];
    }

    // Default fallback
    return [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a / 2, y: -(b ?? a) }];
  }

  /**
   * Get the center (centroid) of the triangle
   */
  get center(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._center.x,
      y: absPos.y + this._center.y,
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
   * Get the bounding box width
   */
  get boundingWidth(): number {
    return this._boundingWidth;
  }

  /**
   * Get the bounding box height
   */
  get boundingHeight(): number {
    return this._boundingHeight;
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
   * Get the vertices in absolute coordinates
   */
  get absoluteVertices(): [Position, Position, Position] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x + this.vertices[0].x, y: absPos.y + this.vertices[0].y },
      { x: absPos.x + this.vertices[1].x, y: absPos.y + this.vertices[1].y },
      { x: absPos.x + this.vertices[2].x, y: absPos.y + this.vertices[2].y },
    ];
  }

  /**
   * Get the three sides of the triangle with their geometric properties.
   * Each side includes length, center, angle, and outward normal.
   */
  get sides(): [TriangleSide, TriangleSide, TriangleSide] {
    const verts = this.absoluteVertices;
    
    const createSide = (start: Position, end: Position): TriangleSide => {
      // Calculate length
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate center
      const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };
      
      // Calculate angle in degrees (from horizontal axis)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Calculate outward normal (perpendicular, 90° clockwise rotation)
      // For counter-clockwise winding, outward is to the right of the edge
      // 90° clockwise rotation: (dx, dy) -> (-dy, dx)
      const outwardNormal = {
        x: -dy / length,
        y: dx / length,
      };
      
      return { length, center, angle, outwardNormal };
    };
    
    // Create sides in counter-clockwise order: v0→v1, v1→v2, v2→v0
    return [
      createSide(verts[0], verts[1]),
      createSide(verts[1], verts[2]),
      createSide(verts[2], verts[0]),
    ];
  }

  render(): string {
    const verts = this.absoluteVertices;
    const points = verts.map(v => `${v.x},${v.y}`).join(" ");
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();
    
    return `<polygon points="${points}" ${attrs} ${transform}/>`;
  }

  /**
   * Get the bounding box of this triangle in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const bbTopLeft = this.boundingBoxTopLeft;
    return {
      minX: bbTopLeft.x,
      minY: bbTopLeft.y,
      maxX: bbTopLeft.x + this._boundingWidth,
      maxY: bbTopLeft.y + this._boundingHeight,
    };
  }

  /**
   * Get the transformed corners (vertices) after rotation.
   * Returns the three vertices after applying rotation.
   */
  getTransformedCorners(): { x: number; y: number }[] {
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

