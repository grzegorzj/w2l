/**
 * Base shape module providing fundamental geometric primitives.
 *
 * This module defines the base class for all geometric shapes in the library.
 * Shapes are visual elements that extend Bounded to support box model properties
 * and rendering capabilities specific to geometric primitives.
 *
 * @module core
 */

import { Bounded } from "./Bounded.js";

/**
 * Abstract base class for all geometric shapes in the library.
 *
 * This class extends {@link Bounded} to provide shape-specific functionality.
 * All visual geometric primitives (circles, rectangles, triangles, etc.)
 * inherit from this class.
 *
 * @remarks
 * Shapes in this library are immutable by default. Transformations create
 * new internal states but maintain a clean API for LLMs to work with.
 *
 * All shapes have a center point, which is used as the default reference
 * for positioning and transformations unless otherwise specified.
 *
 * Shapes support margin and padding through the Bounded class, allowing
 * for CSS-like box model layout.
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
export abstract class Shape extends Bounded {
  // Shape-specific methods and properties can be added here
  // All positioning, rotation, translation, margin, and padding are inherited from Bounded
}
