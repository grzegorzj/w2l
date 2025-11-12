/**
 * Geometric side (edge) module.
 *
 * Provides a generic Side class that represents an edge of a shape with
 * geometric properties useful for positioning adjacent elements.
 *
 * @module geometry
 */

import type { Point } from "../core/Artboard.js";

/**
 * Configuration for creating a Side.
 */
export interface SideConfig {
  /** Starting point of the side */
  start: { x: number; y: number };
  /** Ending point of the side */
  end: { x: number; y: number };
  /** Current position offset to apply to all coordinates */
  positionOffset?: { x: number; y: number };
}

/**
 * Represents a side (edge) of a geometric shape.
 *
 * The Side class encapsulates the geometric properties of a line segment,
 * providing convenient access to normals, centers, and other properties
 * that are useful when positioning elements relative to shape edges.
 *
 * @remarks
 * Sides automatically calculate both inward and outward normal vectors.
 * 
 * **Important**: This class assumes counter-clockwise vertex ordering (see CONVENTIONS.md).
 * The "outward" direction is determined by the right-hand rule: if you walk from start 
 * to end along a counter-clockwise polygon, outward is to your right (90° clockwise rotation).
 *
 * @example
 * Create a horizontal side pointing right (e.g., top edge of a rectangle)
 * ```typescript
 * // For a counter-clockwise rectangle, top edge goes right-to-left
 * const side = new Side({
 *   start: { x: 100, y: 0 },  // top-right
 *   end: { x: 0, y: 0 }        // top-left
 * });
 *
 * console.log(side.length);          // 100
 * console.log(side.outwardNormal);   // { x: "0px", y: "-1px" } - points up
 * console.log(side.inwardNormal);    // { x: "0px", y: "1px" } - points down
 * ```
 */
export class Side {
  private _start: { x: number; y: number };
  private _end: { x: number; y: number };
  private _positionOffset: { x: number; y: number };

  /**
   * Creates a new Side instance.
   *
   * @param config - Configuration for the side
   */
  constructor(config: SideConfig) {
    this._start = config.start;
    this._end = config.end;
    this._positionOffset = config.positionOffset || { x: 0, y: 0 };
  }

  /**
   * Gets the length of the side in pixels.
   *
   * @returns The Euclidean distance from start to end
   */
  get length(): number {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Gets the starting point of the side.
   *
   * @returns The start point with position offset applied
   */
  get start(): Point {
    return {
      x: `${this._start.x + this._positionOffset.x}px`,
      y: `${this._start.y + this._positionOffset.y}px`,
    };
  }

  /**
   * Gets the ending point of the side.
   *
   * @returns The end point with position offset applied
   */
  get end(): Point {
    return {
      x: `${this._end.x + this._positionOffset.x}px`,
      y: `${this._end.y + this._positionOffset.y}px`,
    };
  }

  /**
   * Gets the center point of the side.
   *
   * @returns The midpoint of the side
   */
  get center(): Point {
    return {
      x: `${(this._start.x + this._end.x) / 2 + this._positionOffset.x}px`,
      y: `${(this._start.y + this._end.y) / 2 + this._positionOffset.y}px`,
    };
  }

  /**
   * Gets the outward-facing unit normal vector.
   *
   * The outward normal points perpendicular to the side, away from
   * the shape's interior (determined by right-hand rule with counter-clockwise winding).
   *
   * @returns A unit vector pointing outward from the side
   *
   * @remarks
   * Formula: For edge direction (dx, dy), outward normal = (-dy, dx) / length
   * This is a 90° clockwise rotation of the edge direction.
   *
   * @example
   * Position an element outward from a side
   * ```typescript
   * element.translate({
   *   along: side.outwardNormal,
   *   distance: "50px"
   * });
   * ```
   */
  get outwardNormal(): Point {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    // Perpendicular vector (rotated 90° clockwise from edge direction)
    return {
      x: `${-dy / length}px`,
      y: `${dx / length}px`,
    };
  }

  /**
   * Gets the inward-facing unit normal vector.
   *
   * The inward normal points perpendicular to the side, toward
   * the shape's interior (opposite of the outward normal).
   *
   * @returns A unit vector pointing inward toward the side
   *
   * @remarks
   * Formula: For edge direction (dx, dy), inward normal = (dy, -dx) / length
   * This is a 90° counter-clockwise rotation of the edge direction.
   *
   * @example
   * Position an element inward from a side
   * ```typescript
   * element.translate({
   *   along: side.inwardNormal,
   *   distance: "20px"
   * });
   * ```
   */
  get inwardNormal(): Point {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    // Perpendicular vector (rotated 90° counter-clockwise from edge direction)
    return {
      x: `${dy / length}px`,
      y: `${-dx / length}px`,
    };
  }

  /**
   * Gets the direction vector of the side (from start to end).
   *
   * @returns A unit vector pointing along the side's direction
   *
   * @example
   * Move along a side's direction
   * ```typescript
   * element.translate({
   *   along: side.direction,
   *   distance: "30px"
   * });
   * ```
   */
  get direction(): Point {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    return {
      x: `${dx / length}px`,
      y: `${dy / length}px`,
    };
  }

  /**
   * Gets the angle of the side in degrees (0° = horizontal right, 90° = down).
   *
   * @returns The angle of the side in degrees
   */
  get angle(): number {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }
}

