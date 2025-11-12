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
  /** X offset from the alignment point in pixels */
  x: number;
  /** Y offset from the alignment point in pixels */
  y: number;
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
  /** Distance to move in pixels */
  distance: number;
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
  protected currentPosition: Point = { x: 0, y: 0 };
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
   *   x: 0,
   *   y: 0
   * });
   * ```
   * 
   * @example
   * Position a shape offset from another shape
   * ```typescript
   * shape2.position({
   *   relativeFrom: shape2.center,
   *   relativeTo: shape1.center,
   *   x: 50,  // 50px to the right
   *   y: -20  // 20px above
   * });
   * ```
   */
  position(config: PositionReference): void {
    const offsetX = config.relativeTo.x - config.relativeFrom.x + config.x;
    const offsetY = config.relativeTo.y - config.relativeFrom.y + config.y;
    
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
   *   distance: 50
   * });
   * ```
   */
  translate(config: TranslateConfig): void {
    // Normalize the direction vector
    const length = Math.sqrt(config.along.x ** 2 + config.along.y ** 2);
    const normalized = {
      x: config.along.x / length,
      y: config.along.y / length,
    };
    
    this.currentPosition = {
      x: this.currentPosition.x + normalized.x * config.distance,
      y: this.currentPosition.y + normalized.y * config.distance,
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

