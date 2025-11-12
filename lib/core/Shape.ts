/**
 * Base shape module providing fundamental geometric primitives.
 *
 * This module defines the base class and interfaces for all geometric shapes
 * in the library. It provides common positioning, transformation, and rendering
 * capabilities that all shapes inherit.
 *
 * @module core
 */

import type { Point } from "./Artboard.js";
import { parseUnit } from "./units.js";

/**
 * Represents a reference point on a shape for positioning calculations.
 *
 * This interface is used to specify both the source point (relativeFrom) and
 * target point (relativeTo) in positioning operations.
 */
export interface PositionReference {
  /** The point on the current shape to use as reference */
  relativeFrom: Point;
  /** The target point to align with */
  relativeTo: Point;
  /** X offset from the alignment point (supports units like "50px", "2rem", or numbers) */
  x: string | number;
  /** Y offset from the alignment point (supports units like "50px", "2rem", or numbers) */
  y: string | number;
}

/**
 * Configuration for rotating a shape.
 */
export interface RotateConfig {
  /** The reference element or point to rotate relative to */
  relativeTo: any;
  /** Rotation angle in degrees */
  deg: number;
}

/**
 * Configuration for translating (moving) a shape.
 */
export interface TranslateConfig {
  /** The direction vector to move along */
  along: Point;
  /** Distance to move (supports units like "50px", "2rem", or numbers) */
  distance: string | number;
}

/**
 * Abstract base class for all geometric shapes in the library.
 *
 * This class provides the fundamental capabilities that all shapes share:
 * positioning, rotation, translation, and basic geometry calculations.
 *
 * @remarks
 * Shapes in this library are immutable by default. Transformations create
 * new internal states but maintain a clean API for LLMs to work with.
 *
 * All shapes have a center point, which is used as the default reference
 * for positioning and transformations unless otherwise specified.
 *
 * @example
 * ```typescript
 * // Subclasses implement specific shapes
 * class Circle extends Shape {
 *   constructor(radius: number) {
 *     super();
 *     // Implementation
 *   }
 * }
 * ```
 */
export abstract class Shape {
  protected currentPosition: { x: number; y: number } = { x: 0, y: 0 };
  protected rotation: number = 0;

  /**
   * Gets the center point of the shape.
   *
   * @returns The geometric center of the shape
   *
   * @remarks
   * Subclasses must implement this to return their specific center calculation.
   */
  abstract get center(): Point;

  /**
   * Positions the shape relative to another point or shape.
   *
   * This is the primary method for laying out shapes in the visual space.
   * It allows precise alignment between any point on this shape and any
   * point on another shape or in absolute space.
   *
   * @param config - The positioning configuration
   *
   * @example
   * Position a shape's center at the artboard center
   * ```typescript
   * shape.position({
   *   relativeFrom: shape.center,
   *   relativeTo: artboard.center,
   *   x: "0px",
   *   y: "0px"
   * });
   * ```
   *
   * @example
   * Position a shape offset from another shape
   * ```typescript
   * shape2.position({
   *   relativeFrom: shape2.center,
   *   relativeTo: shape1.center,
   *   x: "50px",  // 50px to the right
   *   y: "-20px"  // 20px above
   * });
   * ```
   */
  position(config: PositionReference): void {
    const fromX = parseUnit(config.relativeFrom.x);
    const fromY = parseUnit(config.relativeFrom.y);
    const toX = parseUnit(config.relativeTo.x);
    const toY = parseUnit(config.relativeTo.y);
    const offsetXVal = parseUnit(config.x);
    const offsetYVal = parseUnit(config.y);

    const offsetX = toX - fromX + offsetXVal;
    const offsetY = toY - fromY + offsetYVal;

    this.currentPosition = {
      x: this.currentPosition.x + offsetX,
      y: this.currentPosition.y + offsetY,
    };
  }

  /**
   * Rotates the shape around a reference point or along a reference line.
   *
   * @param config - The rotation configuration
   *
   * @example
   * Rotate a shape 45 degrees relative to a line
   * ```typescript
   * shape.rotate({
   *   relativeTo: line,
   *   deg: 45
   * });
   * ```
   */
  rotate(config: RotateConfig): void {
    this.rotation += config.deg;
  }

  /**
   * Translates (moves) the shape along a direction vector.
   *
   * This method is particularly useful for moving shapes perpendicular to
   * edges or along normal vectors, which is common when positioning elements
   * adjacent to other shapes.
   *
   * @param config - The translation configuration
   *
   * @example
   * Move a shape outward from a triangle's edge
   * ```typescript
   * shape.translate({
   *   along: triangle.side.outwardNormal,
   *   distance: "50px"
   * });
   * ```
   */
  translate(config: TranslateConfig): void {
    // Parse the along values
    const alongX = parseUnit(config.along.x);
    const alongY = parseUnit(config.along.y);
    const distancePx = parseUnit(config.distance);

    // Normalize the direction vector
    const length = Math.sqrt(alongX ** 2 + alongY ** 2);
    const normalized = {
      x: alongX / length,
      y: alongY / length,
    };

    this.currentPosition = {
      x: this.currentPosition.x + normalized.x * distancePx,
      y: this.currentPosition.y + normalized.y * distancePx,
    };
  }

  /**
   * Renders the shape to SVG.
   *
   * @returns SVG string representation of the shape
   *
   * @remarks
   * Subclasses must implement this to provide their specific SVG rendering.
   */
  abstract render(): string;
}
