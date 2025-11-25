/**
 * New layout system - Line
 * A line segment that works with the positioning system
 * 
 * The line stores a relative offset from start to end, and uses getAbsolutePosition()
 * to properly render when positioned, just like other shapes (Circle, Rectangle, etc.)
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export interface NewLineConfig {
  /**
   * Starting point of the line (relative to positioning).
   * Use { x: 0, y: 0 } and then position the line using .position()
   */
  start: Position;
  
  /**
   * Ending point of the line (relative to start).
   * This is an offset from the start point.
   */
  end: Position;
  
  /**
   * Visual styling properties
   */
  style?: Partial<Style>;
}

/**
 * Line shape that works with the positioning system.
 * 
 * The line's start point acts as its position reference, and the end point
 * is stored as a relative offset. Use .position() to place the line's start.
 * 
 * @example
 * // Create a line from (0,0) to (100, 50) relative offset
 * const line = new NewLine({
 *   start: { x: 0, y: 0 },
 *   end: { x: 100, y: 50 },
 *   style: { stroke: "#e74c3c", strokeWidth: 2 }
 * });
 * 
 * // Position the line's start point at a shape's center
 * line.position({
 *   relativeFrom: line.start,
 *   relativeTo: circle.center,
 *   x: 0,
 *   y: 0,
 *   boxReference: "contentBox"
 * });
 */
export class NewLine extends NewShape {
  private _startOffset: Position;  // Offset from element's position
  private _endOffset: Position;    // Offset from element's position

  constructor(config: NewLineConfig) {
    super(config.style);
    this._startOffset = config.start;
    this._endOffset = config.end;
  }

  /**
   * Get the starting point of the line (absolute coordinates after positioning)
   */
  get start(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._startOffset.x,
      y: absPos.y + this._startOffset.y,
    };
  }

  /**
   * Get the ending point of the line (absolute coordinates after positioning)
   */
  get end(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._endOffset.x,
      y: absPos.y + this._endOffset.y,
    };
  }

  /**
   * Get the center (midpoint) of the line
   */
  get center(): Position {
    const start = this.start;
    const end = this.end;
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }

  /**
   * Get the length of the line
   */
  get length(): number {
    const dx = this._endOffset.x - this._startOffset.x;
    const dy = this._endOffset.y - this._startOffset.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get the angle of the line in degrees
   */
  get angle(): number {
    const dx = this._endOffset.x - this._startOffset.x;
    const dy = this._endOffset.y - this._startOffset.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  /**
   * Get the direction vector (normalized)
   */
  get direction(): Position {
    const length = this.length;
    const dx = this._endOffset.x - this._startOffset.x;
    const dy = this._endOffset.y - this._startOffset.y;
    return {
      x: dx / length,
      y: dy / length,
    };
  }

  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    const start = this.start;
    const end = this.end;
    return {
      minX: Math.min(start.x, end.x),
      minY: Math.min(start.y, end.y),
      maxX: Math.max(start.x, end.x),
      maxY: Math.max(start.y, end.y),
    };
  }

  getCorners(): { x: number; y: number }[] {
    // For a line, return start and end points
    return [this.start, this.end];
  }

  render(): string {
    // Use getAbsolutePosition() to respect positioning, just like Circle does
    const absPos = this.getAbsolutePosition();
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();
    
    const x1 = absPos.x + this._startOffset.x;
    const y1 = absPos.y + this._startOffset.y;
    const x2 = absPos.x + this._endOffset.x;
    const y2 = absPos.y + this._endOffset.y;
    
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs} ${transform}/>`;
  }
}

