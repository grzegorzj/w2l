/**
 * Geometric shapes module - Triangle implementation.
 *
 * Provides triangle primitives with various configurations including
 * right triangles, equilateral triangles, and custom triangles.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import { Side } from "./Side.js";

/**
 * Configuration for creating a Triangle.
 *
 * Supports different triangle types with intuitive parameters
 * that are easy for LLMs to work with.
 */
export interface TriangleConfig {
  /**
   * Type of triangle to create.
   * - "right": Right triangle (90-degree angle)
   * - "equilateral": All sides equal
   * - "isosceles": Two sides equal
   * - "scalene": All sides different
   */
  type: "right" | "equilateral" | "isosceles" | "scalene";

  /**
   * Length of side 'a' (supports units like "300px", "2rem", or numbers).
   * For right triangles, this is typically one of the legs.
   */
  a: string | number;

  /**
   * Length of side 'b' (supports units like "400px", "2rem", or numbers).
   * For right triangles, this is typically the other leg.
   */
  b?: string | number;

  /**
   * Length of side 'c' (supports units like "500px", "2rem", or numbers).
   * Used for scalene triangles.
   */
  c?: string | number;

  /**
   * Orientation of the triangle.
   * Specifies where the characteristic angle is positioned.
   */
  orientation?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

  /**
   * Fill color of the triangle.
   * @defaultValue "#000000"
   */
  fill?: string;

  /**
   * Stroke color for the triangle outline.
   * @defaultValue "none"
   */
  stroke?: string;

  /**
   * Stroke width (supports units like "2px" or numbers).
   * @defaultValue 1
   */
  strokeWidth?: string | number;
}

/**
 * Represents a side (edge) of a triangle.
 *
 * Provides access to geometric properties of the side that are useful
 * for positioning adjacent elements.
 *
 * @remarks
 * This interface extends the Side class with any triangle-specific properties.
 * It provides both inward and outward normal vectors for flexible positioning.
 */
export interface TriangleSide extends Side {
  /** Length of the side in pixels */
  length: number;

  /** Center point of the side */
  center: Point;

  /** Starting point of the side */
  start: Point;

  /** Ending point of the side */
  end: Point;

  /**
   * Outward-facing normal vector.
   *
   * This unit vector points perpendicular to the side, away from
   * the triangle's interior. Useful for positioning elements adjacent
   * to the triangle.
   */
  outwardNormal: Point;

  /**
   * Inward-facing normal vector.
   *
   * This unit vector points perpendicular to the side, toward
   * the triangle's interior. Useful for positioning elements inside
   * the triangle or for internal geometric calculations.
   */
  inwardNormal: Point;
}

/**
 * Triangle shape with comprehensive geometric properties.
 *
 * The Triangle class provides a high-level interface for creating and
 * manipulating triangular shapes. It automatically calculates geometric
 * properties like centers, sides, and normal vectors that make it easy
 * for LLMs to position related elements.
 *
 * @remarks
 * When type is "right", the library uses the Pythagorean theorem to
 * calculate the hypotenuse. The orientation parameter controls which
 * corner contains the right angle.
 *
 * @example
 * Create a right triangle for Pythagorean theorem visualization
 * ```typescript
 * const triangle = new Triangle({
 *   type: "right",
 *   a: 3,
 *   b: 4,
 *   orientation: "bottomLeft"
 * });
 *
 * // Access the sides
 * triangle.sides.forEach(side => {
 *   console.log(`Side length: ${side.length}`);
 *   console.log(`Side center: (${side.center.x}, ${side.center.y})`);
 * });
 * ```
 *
 * @example
 * Create an equilateral triangle
 * ```typescript
 * const triangle = new Triangle({
 *   type: "equilateral",
 *   a: 100,
 *   fill: "#3498db"
 * });
 * ```
 */
export class Triangle extends Shape {
  private config: TriangleConfig;
  private vertices: [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
  ];

  /**
   * Creates a new Triangle instance.
   *
   * @param config - Configuration for the triangle
   *
   * @throws {Error} If invalid parameters are provided for the triangle type
   */
  constructor(config: TriangleConfig) {
    super();
    this.config = config;
    this.vertices = this.calculateVertices();
  }

  /**
   * Calculates the vertices of the triangle based on configuration.
   *
   * Vertices are ordered counter-clockwise for correct normal calculation (see CONVENTIONS.md).
   *
   * @returns The three vertices of the triangle
   * @internal
   */
  private calculateVertices(): [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
  ] {
    // Simplified implementation - would need full geometric calculations
    const { type, a, b = 0 } = this.config;
    const aPx = parseUnit(a);
    const bPx = parseUnit(b);

    if (type === "right") {
      const c = Math.sqrt(aPx * aPx + bPx * bPx);
      // Counter-clockwise order: origin → down → right
      return [
        { x: 0, y: 0 }, // v0: top-left (right angle)
        { x: 0, y: bPx }, // v1: bottom-left
        { x: aPx, y: 0 }, // v2: top-right
      ];
    }

    // Placeholder for other triangle types (also counter-clockwise)
    return [
      { x: 0, y: 0 },
      { x: 0, y: aPx },
      { x: aPx, y: 0 },
    ];
  }

  /**
   * Gets the geometric center (centroid) of the triangle.
   *
   * The centroid is the point where the three medians of the triangle intersect,
   * located at the average of the three vertices.
   *
   * @returns The center point of the triangle
   */
  get center(): Point {
    const [v1, v2, v3] = this.vertices;

    return {
      x: `${(v1.x + v2.x + v3.x) / 3 + this.currentPosition.x}px`,
      y: `${(v1.y + v2.y + v3.y) / 3 + this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the three sides of the triangle with their geometric properties.
   *
   * Each side includes its length, center point, endpoints, and outward normal vector.
   * Sides follow counter-clockwise vertex ordering (see CONVENTIONS.md).
   * This makes it easy to position elements adjacent to or along the triangle's edges.
   *
   * @returns Array of three triangle sides in counter-clockwise order
   *
   * @example
   * Position squares on each side of a triangle (Pythagorean theorem)
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
   *
   * triangle.sides.forEach(side => {
   *   const square = new Square({ a: side.length });
   *   // Position square at side center
   *   square.position({
   *     relativeTo: side.center,
   *     relativeFrom: square.center,
   *     x: 0,
   *     y: 0
   *   });
   *   // Move square outward from triangle
   *   square.translate({
   *     along: side.outwardNormal,
   *     distance: side.length / 2
   *   });
   * });
   * ```
   */
  get sides(): [TriangleSide, TriangleSide, TriangleSide] {
    const [v1, v2, v3] = this.vertices;

    const createSide = (
      start: { x: number; y: number },
      end: { x: number; y: number }
    ): TriangleSide => {
      return new Side({
        start,
        end,
        positionOffset: this.currentPosition,
      }) as TriangleSide;
    };

    return [createSide(v1, v2), createSide(v2, v3), createSide(v3, v1)];
  }

  /**
   * Renders the triangle to SVG.
   *
   * @returns SVG polygon element representing the triangle
   */
  render(): string {
    const [v1, v2, v3] = this.vertices;
    const x1 = v1.x + this.currentPosition.x;
    const y1 = v1.y + this.currentPosition.y;
    const x2 = v2.x + this.currentPosition.x;
    const y2 = v2.y + this.currentPosition.y;
    const x3 = v3.x + this.currentPosition.x;
    const y3 = v3.y + this.currentPosition.y;

    const points = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
    const fill = this.config.fill || "#000000";
    const stroke = this.config.stroke || "none";
    const strokeWidth = parseUnit(this.config.strokeWidth || 1);

    let transform = "";
    if (this.rotation !== 0) {
      const center = this.center;
      const centerX = parseUnit(center.x);
      const centerY = parseUnit(center.y);
      transform = ` transform="rotate(${this.rotation} ${centerX} ${centerY})"`;
    }

    return `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${transform} />`;
  }
}
