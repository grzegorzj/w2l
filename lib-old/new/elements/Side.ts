/**
 * Geometric side (edge) module for the new layout system.
 *
 * Provides a generic Side class that represents an edge of a shape with
 * geometric properties useful for positioning adjacent elements.
 *
 * @module elements
 */

import type { Position } from "../core/Element.js";

/**
 * Configuration for creating a NewSide.
 */
export interface NewSideConfig {
  /** Starting point of the side */
  start: Position;
  /** Ending point of the side */
  end: Position;
}

/**
 * Represents a side (edge) of a geometric shape in the new layout system.
 *
 * The NewSide class encapsulates the geometric properties of a line segment,
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
 * const side = new NewSide({
 *   start: { x: 100, y: 0 },  // top-right
 *   end: { x: 0, y: 0 }        // top-left
 * });
 *
 * console.log(side.length);          // 100
 * console.log(side.outwardNormal);   // { x: 0, y: -1 } - points up
 * console.log(side.inwardNormal);    // { x: 0, y: 1 } - points down
 * ```
 */
export class NewSide {
  private _start: Position;
  private _end: Position;

  /**
   * Creates a new NewSide instance.
   *
   * @param config - Configuration for the side
   */
  constructor(config: NewSideConfig) {
    this._start = config.start;
    this._end = config.end;
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
   * @returns The start point
   */
  get start(): Position {
    return { ...this._start };
  }

  /**
   * Gets the ending point of the side.
   *
   * @returns The end point
   */
  get end(): Position {
    return { ...this._end };
  }

  /**
   * Gets the center point of the side.
   *
   * @returns The midpoint of the side
   */
  get center(): Position {
    return {
      x: (this._start.x + this._end.x) / 2,
      y: (this._start.y + this._end.y) / 2,
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
   * const offset = {
   *   x: side.outwardNormal.x * 50,
   *   y: side.outwardNormal.y * 50
   * };
   * ```
   */
  get outwardNormal(): Position {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    // Perpendicular vector (rotated 90° clockwise from edge direction)
    return {
      x: -dy / length,
      y: dx / length,
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
   * const offset = {
   *   x: side.inwardNormal.x * 20,
   *   y: side.inwardNormal.y * 20
   * };
   * element.setPosition({ x: side.center.x + offset.x, y: side.center.y + offset.y });
   * ```
   */
  get inwardNormal(): Position {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    // Perpendicular vector (rotated 90° counter-clockwise from edge direction)
    return {
      x: dy / length,
      y: -dx / length,
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
   * const offset = {
   *   x: side.direction.x * 30,
   *   y: side.direction.y * 30
   * };
   * ```
   */
  get direction(): Position {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    const length = this.length;

    return {
      x: dx / length,
      y: dy / length,
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
