/**
 * Geometric shapes module - Triangle implementation.
 *
 * Provides triangle primitives with various configurations including
 * right triangles, equilateral triangles, and custom triangles.
 *
 * @module elements
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import { Side } from "./Side.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Configuration for creating a Triangle.
 *
 * Supports different triangle types with intuitive parameters
 * that are easy for LLMs to work with.
 * Visual styling is handled through the style property using CSS/SVG properties.
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
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (fill, stroke, opacity, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   fill: "#2ecc71",
   *   stroke: "#27ae60",
   *   strokeWidth: 2
   * }
   * ```
   */
  style?: Partial<Style>;
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
    super(config.name);
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
    const { type, a, b, c, orientation = "bottomLeft" } = this.config;
    const aPx = parseUnit(a);
    const bPx = b !== undefined ? parseUnit(b) : aPx;
    const cPx = c !== undefined ? parseUnit(c) : 0;

    if (type === "right") {
      // Right triangle with Pythagorean relationship
      const hypotenuse = Math.sqrt(aPx * aPx + bPx * bPx);

      // Default orientation: right angle at bottom-left
      // Counter-clockwise order: bottom-left → bottom-right → top-left
      switch (orientation) {
        case "bottomLeft":
          return [
            { x: 0, y: bPx }, // v0: bottom-left (right angle)
            { x: aPx, y: bPx }, // v1: bottom-right
            { x: 0, y: 0 }, // v2: top-left
          ];
        case "bottomRight":
          return [
            { x: aPx, y: bPx }, // v0: bottom-right (right angle)
            { x: aPx, y: 0 }, // v1: top-right
            { x: 0, y: bPx }, // v2: bottom-left
          ];
        case "topLeft":
          return [
            { x: 0, y: 0 }, // v0: top-left (right angle)
            { x: 0, y: bPx }, // v1: bottom-left
            { x: aPx, y: 0 }, // v2: top-right
          ];
        case "topRight":
          return [
            { x: aPx, y: 0 }, // v0: top-right (right angle)
            { x: 0, y: 0 }, // v1: top-left
            { x: aPx, y: bPx }, // v2: bottom-right
          ];
        default:
          return [
            { x: 0, y: bPx },
            { x: aPx, y: bPx },
            { x: 0, y: 0 },
          ];
      }
    }

    if (type === "equilateral") {
      // Equilateral triangle with all sides equal to 'a'
      const height = (aPx * Math.sqrt(3)) / 2;
      // Counter-clockwise: bottom-left → bottom-right → top-center
      return [
        { x: 0, y: height }, // v0: bottom-left
        { x: aPx, y: height }, // v1: bottom-right
        { x: aPx / 2, y: 0 }, // v2: top-center
      ];
    }

    if (type === "isosceles") {
      // Isosceles triangle: two sides equal (a and b are the equal sides, or a is base and b is height)
      // Interpretation: 'a' is the base, 'b' is the height
      const height = bPx;
      // Counter-clockwise: bottom-left → bottom-right → top-center
      return [
        { x: 0, y: height }, // v0: bottom-left
        { x: aPx, y: height }, // v1: bottom-right
        { x: aPx / 2, y: 0 }, // v2: top-center
      ];
    }

    if (type === "scalene") {
      // Scalene triangle: all sides different (a, b, c)
      // Use the cosine rule to calculate vertex positions
      // Place first vertex at origin, second along x-axis
      if (cPx === 0) {
        throw new Error(
          "Scalene triangle requires all three sides (a, b, c) to be specified"
        );
      }

      // Using the law of cosines to find angle at v0
      // c² = a² + b² - 2ab·cos(C)
      const angleA = Math.acos(
        (bPx * bPx + cPx * cPx - aPx * aPx) / (2 * bPx * cPx)
      );

      // Counter-clockwise: origin → along x-axis → calculated position
      return [
        { x: 0, y: 0 }, // v0: origin
        { x: cPx, y: 0 }, // v1: along x-axis
        { x: bPx * Math.cos(angleA), y: bPx * Math.sin(angleA) }, // v2: calculated
      ];
    }

    // Fallback (shouldn't reach here)
    return [
      { x: 0, y: 0 },
      { x: aPx, y: 0 },
      { x: aPx / 2, y: bPx },
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
    // Calculate center relative to vertices, then use absolute position
    return this.toAbsolutePoint(
      (v1.x + v2.x + v3.x) / 3,
      (v1.y + v2.y + v3.y) / 3
    );
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
   * Gets the lengths of all three sides of the triangle.
   *
   * @returns Object containing the lengths of sides a, b, and c in pixels
   *
   * @example
   * Check if a triangle satisfies the Pythagorean theorem
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
   * const { sideA, sideB, sideC } = triangle.sideLengths;
   * console.log(sideA * sideA + sideB * sideB === sideC * sideC); // true
   * ```
   */
  get sideLengths(): { sideA: number; sideB: number; sideC: number } {
    const [side1, side2, side3] = this.sides;
    return {
      sideA: side1.length,
      sideB: side2.length,
      sideC: side3.length,
    };
  }

  /**
   * Calculates the angle (in degrees) at a specific vertex.
   *
   * Uses the law of cosines to calculate angles from side lengths.
   *
   * @param vertex - The vertex index (0, 1, or 2)
   * @returns The angle at the specified vertex in degrees
   *
   * @internal
   */
  private calculateAngleAtVertex(vertex: 0 | 1 | 2): number {
    const [v0, v1, v2] = this.vertices;
    const vertices = [v0, v1, v2];

    // Get the three vertices
    const prev = vertices[(vertex + 2) % 3];
    const curr = vertices[vertex];
    const next = vertices[(vertex + 1) % 3];

    // Calculate vectors from current vertex to adjacent vertices
    const vec1 = {
      x: prev.x - curr.x,
      y: prev.y - curr.y,
    };
    const vec2 = {
      x: next.x - curr.x,
      y: next.y - curr.y,
    };

    // Calculate dot product and magnitudes
    const dot = vec1.x * vec2.x + vec1.y * vec2.y;
    const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);

    // Calculate angle using dot product formula
    const angleRad = Math.acos(dot / (mag1 * mag2));
    return (angleRad * 180) / Math.PI;
  }

  /**
   * Gets all three interior angles of the triangle.
   *
   * @returns Object containing the angles at each vertex in degrees
   *
   * @example
   * Get angles of a right triangle
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
   * const { angleA, angleB, angleC } = triangle.angles;
   * console.log(angleA); // 90 degrees (right angle)
   * console.log(angleA + angleB + angleC); // 180 degrees (sum of angles)
   * ```
   *
   * @example
   * Check if a triangle is equilateral
   * ```typescript
   * const triangle = new Triangle({ type: "equilateral", a: 100 });
   * const { angleA, angleB, angleC } = triangle.angles;
   * console.log(angleA, angleB, angleC); // All ~60 degrees
   * ```
   */
  get angles(): { angleA: number; angleB: number; angleC: number } {
    return {
      angleA: this.calculateAngleAtVertex(0),
      angleB: this.calculateAngleAtVertex(1),
      angleC: this.calculateAngleAtVertex(2),
    };
  }

  /**
   * Gets the perimeter of the triangle.
   *
   * @returns The sum of all three side lengths in pixels
   */
  get perimeter(): number {
    const { sideA, sideB, sideC } = this.sideLengths;
    return sideA + sideB + sideC;
  }

  /**
   * Gets the area of the triangle using Heron's formula.
   *
   * @returns The area of the triangle in square pixels
   *
   * @example
   * Calculate area of a right triangle
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
   * console.log(triangle.area); // 6 square pixels (0.5 * 3 * 4)
   * ```
   */
  get area(): number {
    const { sideA, sideB, sideC } = this.sideLengths;
    const s = (sideA + sideB + sideC) / 2; // Semi-perimeter
    return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
  }

  /**
   * Gets the three vertices of the triangle.
   *
   * Vertices are in counter-clockwise order (see CONVENTIONS.md).
   *
   * @returns Array of three vertex points
   *
   * @example
   * Access individual vertices
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
   * const [v0, v1, v2] = triangle.getVertices();
   * ```
   */
  getVertices(): [Point, Point, Point] {
    const [v1, v2, v3] = this.vertices;
    return [
      {
        x: `${v1.x + this.currentPosition.x}px`,
        y: `${v1.y + this.currentPosition.y}px`,
      },
      {
        x: `${v2.x + this.currentPosition.x}px`,
        y: `${v2.y + this.currentPosition.y}px`,
      },
      {
        x: `${v3.x + this.currentPosition.x}px`,
        y: `${v3.y + this.currentPosition.y}px`,
      },
    ];
  }

  /**
   * Checks if the triangle is a right triangle (has a 90-degree angle).
   *
   * @returns True if any angle is approximately 90 degrees
   */
  get isRightTriangle(): boolean {
    const { angleA, angleB, angleC } = this.angles;
    const tolerance = 0.1; // Tolerance for floating point comparison
    return (
      Math.abs(angleA - 90) < tolerance ||
      Math.abs(angleB - 90) < tolerance ||
      Math.abs(angleC - 90) < tolerance
    );
  }

  /**
   * Checks if the triangle is equilateral (all sides equal).
   *
   * @returns True if all sides are approximately equal
   */
  get isEquilateral(): boolean {
    const { sideA, sideB, sideC } = this.sideLengths;
    const tolerance = 0.1;
    return (
      Math.abs(sideA - sideB) < tolerance &&
      Math.abs(sideB - sideC) < tolerance &&
      Math.abs(sideA - sideC) < tolerance
    );
  }

  /**
   * Checks if the triangle is isosceles (two sides equal).
   *
   * @returns True if at least two sides are approximately equal
   */
  get isIsosceles(): boolean {
    const { sideA, sideB, sideC } = this.sideLengths;
    const tolerance = 0.1;
    return (
      Math.abs(sideA - sideB) < tolerance ||
      Math.abs(sideB - sideC) < tolerance ||
      Math.abs(sideA - sideC) < tolerance
    );
  }

  /**
   * Gets the altitudes of the triangle from each vertex to its opposite side.
   *
   * An altitude is the perpendicular line segment from a vertex to the line containing
   * the opposite side. Each altitude includes the foot point (where it meets the opposite
   * side), the length, and the vertex it originates from.
   *
   * @returns Array of three altitude objects, one from each vertex
   *
   * @example
   * Draw altitudes of a triangle
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 300, b: 400 });
   * triangle.altitudes.forEach((altitude) => {
   *   const line = new Line({
   *     start: altitude.vertex,
   *     end: altitude.foot,
   *     style: {
   *       stroke: "#3498db",
   *       strokeWidth: 2,
   *       strokeDasharray: "5,5"
   *     }
   *   });
   *   artboard.addElement(line);
   * });
   * ```
   */
  get altitudes(): Array<{
    vertex: Point;
    foot: Point;
    length: number;
    side: TriangleSide;
  }> {
    const [v0, v1, v2] = this.vertices;
    const [side0, side1, side2] = this.sides;

    // Helper to calculate the foot of the perpendicular from a point to a line
    const getAltitudeFoot = (
      vertex: { x: number; y: number },
      sideStart: { x: number; y: number },
      sideEnd: { x: number; y: number }
    ): { foot: { x: number; y: number }; length: number } => {
      // Vector from side start to side end
      const dx = sideEnd.x - sideStart.x;
      const dy = sideEnd.y - sideStart.y;
      const sideLengthSq = dx * dx + dy * dy;

      // Vector from side start to vertex
      const vx = vertex.x - sideStart.x;
      const vy = vertex.y - sideStart.y;

      // Project vertex onto the line (parameter t along the line)
      const t = (vx * dx + vy * dy) / sideLengthSq;

      // Foot point
      const footX = sideStart.x + t * dx;
      const footY = sideStart.y + t * dy;

      // Distance from vertex to foot
      const distX = vertex.x - footX;
      const distY = vertex.y - footY;
      const length = Math.sqrt(distX * distX + distY * distY);

      return {
        foot: { x: footX, y: footY },
        length,
      };
    };

    // Altitude from v0 to side opposite (side1: v1->v2)
    const altitude0 = getAltitudeFoot(v0, v1, v2);
    // Altitude from v1 to side opposite (side2: v2->v0)
    const altitude1 = getAltitudeFoot(v1, v2, v0);
    // Altitude from v2 to side opposite (side0: v0->v1)
    const altitude2 = getAltitudeFoot(v2, v0, v1);

    return [
      {
        vertex: {
          x: `${v0.x + this.currentPosition.x}px`,
          y: `${v0.y + this.currentPosition.y}px`,
        },
        foot: {
          x: `${altitude0.foot.x + this.currentPosition.x}px`,
          y: `${altitude0.foot.y + this.currentPosition.y}px`,
        },
        length: altitude0.length,
        side: side1, // opposite side
      },
      {
        vertex: {
          x: `${v1.x + this.currentPosition.x}px`,
          y: `${v1.y + this.currentPosition.y}px`,
        },
        foot: {
          x: `${altitude1.foot.x + this.currentPosition.x}px`,
          y: `${altitude1.foot.y + this.currentPosition.y}px`,
        },
        length: altitude1.length,
        side: side2, // opposite side
      },
      {
        vertex: {
          x: `${v2.x + this.currentPosition.x}px`,
          y: `${v2.y + this.currentPosition.y}px`,
        },
        foot: {
          x: `${altitude2.foot.x + this.currentPosition.x}px`,
          y: `${altitude2.foot.y + this.currentPosition.y}px`,
        },
        length: altitude2.length,
        side: side0, // opposite side
      },
    ];
  }

  /**
   * Renders the triangle to SVG.
   *
   * @returns SVG polygon element representing the triangle
   */
  render(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const [v1, v2, v3] = this.vertices;
    const x1 = v1.x + absPos.x;
    const y1 = v1.y + absPos.y;
    const x2 = v2.x + absPos.x;
    const y2 = v2.y + absPos.y;
    const x3 = v3.x + absPos.x;
    const y3 = v3.y + absPos.y;

    const points = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;

    // Default style if none provided
    const defaultStyle: Partial<Style> = {
      fill: "#000000",
      stroke: "none",
      strokeWidth: "1",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();

    return `${comment}<polygon points="${points}" ${styleAttrs}${transform} />`;
  }
}
