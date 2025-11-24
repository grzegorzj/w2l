/**
 * New layout system - RegularPolygon
 * A regular polygon with n sides (pentagon, hexagon, octagon, etc.)
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export interface NewRegularPolygonConfig {
  sides: number;      // Number of sides (3 = triangle, 4 = square, 5 = pentagon, etc.)
  radius: number;     // Radius of the circumscribed circle
  rotation?: number;  // Rotation in degrees (0 = flat bottom for even-sided polygons)
  style?: Partial<Style>;
}

/**
 * Regular polygon with n sides inscribed in a circle
 */
export class NewRegularPolygon extends NewShape {
  private sides: number;
  private radius: number;
  private initialRotation: number; // Initial rotation for vertex positioning
  private vertices: Position[];

  constructor(config: NewRegularPolygonConfig) {
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

