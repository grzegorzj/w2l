/**
 * Geometric side (edge) module for the new layout system.
 *
 * Provides a generic Side class that represents an edge of a shape with
 * geometric properties useful for positioning adjacent elements.
 *
 * @module elements
 */

import type { Position } from "../core/Element.js";
import { Text } from "./Text.js";

/**
 * Configuration for creating a Side.
 */
export interface SideConfig {
  /** Starting point of the side */
  start: Position;
  /** Ending point of the side */
  end: Position;
}

/**
 * Configuration for creating a side label.
 */
export interface SideLabelConfig {
  /** Distance from the side's center (in pixels). Defaults to 10 */
  offset?: number;
  /** Font size for the label. Defaults to 16 */
  fontSize?: number;
  /** Whether to position the label inward instead of outward. Defaults to false */
  inward?: boolean;
}

/**
 * Represents a side (edge) of a geometric shape in the new layout system.
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
 * console.log(side.outwardNormal);   // { x: 0, y: -1 } - points up
 * console.log(side.inwardNormal);    // { x: 0, y: 1 } - points down
 * ```
 */
export class Side {
  private _start: Position;
  private _end: Position;

  /**
   * Creates a new Side instance.
   *
   * @param config - Configuration for the side
   */
  constructor(config: SideConfig) {
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
   * element.setPosition({ x: side.center.x + offset.x, y: side.center.y + offset.y });
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
   * element.setPosition({ x: side.start.x + offset.x, y: side.start.y + offset.y });
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

  /**
   * Gets the direction vector (non-normalized) from start to end.
   *
   * @returns The vector from start to end
   */
  get vector(): Position {
    const dx = this._end.x - this._start.x;
    const dy = this._end.y - this._start.y;
    return { x: dx, y: dy };
  }

  /**
   * Find intersection points with another side.
   * Returns array of intersection points (currently max 1 for straight sides).
   * 
   * @param other - The other side to intersect with
   * @param infinite - If true, treats sides as infinite lines. If false, only returns intersections within both segments.
   * @returns Array of intersection points (empty if no intersections)
   */
  getIntersections(other: Side, infinite: boolean = false): Position[] {
    const p1 = this._start;
    const p2 = this._end;
    const p3 = other._start;
    const p4 = other._end;

    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    // Lines are parallel
    if (Math.abs(denom) < 1e-10) {
      return [];
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    // Check if intersection is within both segments (unless infinite)
    if (!infinite && (t < 0 || t > 1 || u < 0 || u > 1)) {
      return [];
    }

    // Calculate intersection point
    const x = x1 + t * (x2 - x1);
    const y = y1 + t * (y2 - y1);

    return [{ x, y }];
  }

  /**
   * Creates a Text label for this side, positioned outward from the center.
   * 
   * @param text - The label text (can include LaTeX, e.g., "$a$")
   * @param config - Optional configuration for the label positioning and styling
   * @returns A Text element positioned at the side's center with outward offset
   * 
   * @example
   * Create a labeled triangle side
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const [side1, side2, side3] = triangle.sides;
   * 
   * const label = side1.createLabel("$a$", { offset: 25, fontSize: 18 });
   * artboard.addElement(label);
   * ```
   */
  createLabel(text: string, config?: SideLabelConfig): Text {
    const offset = config?.offset ?? 10;
    const fontSize = config?.fontSize ?? 16;
    const normal = config?.inward ? this.inwardNormal : this.outwardNormal;
    const center = this.center;
    
    const label = new Text({
      content: text,
      fontSize,
    });
    
    // Calculate target position
    const targetX = center.x + normal.x * offset;
    const targetY = center.y + normal.y * offset;
    
    // Position the label at the side's center with outward/inward offset
    label.position({
      relativeTo: { x: targetX, y: targetY },
      relativeFrom: label.center,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });
    
    return label;
  }
}

