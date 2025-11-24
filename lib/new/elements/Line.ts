/**
 * New layout system - Line
 * A line segment between two points
 * 
 * Like the original Line, this takes absolute start/end positions directly,
 * making it simple and flexible for connecting points from other elements.
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export interface NewLineConfig {
  /**
   * Starting point of the line (absolute coordinates).
   * Can be a position from another element (e.g., rect.center, triangle.vertices[0])
   */
  start: Position;
  
  /**
   * Ending point of the line (absolute coordinates).
   * Can be a position from another element (e.g., rect.center, circle.center)
   */
  end: Position;
  
  /**
   * Visual styling properties
   */
  style?: Partial<Style>;
}

/**
 * Line shape connecting two points.
 * 
 * Takes absolute start/end positions directly, making it easy to connect
 * points from other elements without manual coordinate calculations.
 * 
 * @example
 * // Connect two shape centers
 * const line = new NewLine({
 *   start: rect1.center,
 *   end: rect2.center,
 *   style: { stroke: "#e74c3c", strokeWidth: 2 }
 * });
 * 
 * @example
 * // Connect triangle vertices
 * const line = new NewLine({
 *   start: triangle.absoluteVertices[0],
 *   end: triangle.absoluteVertices[1],
 *   style: { stroke: "#3498db" }
 * });
 */
export class NewLine extends NewShape {
  private _start: Position;
  private _end: Position;

  constructor(config: NewLineConfig) {
    super(config.style);
    this._start = config.start;
    this._end = config.end;
  }

  /**
   * Get the starting point of the line
   */
  get start(): Position {
    return this._start;
  }

  /**
   * Get the ending point of the line
   */
  get end(): Position {
    return this._end;
  }

  /**
   * Get the center (midpoint) of the line
   */
  get center(): Position {
    return {
      x: (this._start.x + this._end.x) / 2,
      y: (this._start.y + this._end.y) / 2,
    };
  }

  /**
   * Get the length of the line
   */
  get length(): number {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get the angle of the line in degrees
   */
  get angle(): number {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  /**
   * Get the direction vector (normalized)
   */
  get direction(): Position {
    const length = this.length;
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return {
      x: dx / length,
      y: dy / length,
    };
  }

  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    return {
      minX: Math.min(this._start.x, this._end.x),
      minY: Math.min(this._start.y, this._end.y),
      maxX: Math.max(this._start.x, this._end.x),
      maxY: Math.max(this._start.y, this._end.y),
    };
  }

  getCorners(): { x: number; y: number }[] {
    // For a line, return start and end points
    return [this._start, this._end];
  }

  render(): string {
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();
    
    return `<line x1="${this._start.x}" y1="${this._start.y}" x2="${this._end.x}" y2="${this._end.y}" ${attrs} ${transform}/>`;
  }
}

