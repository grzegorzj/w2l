/**
 * Geometric shapes module - RegularPolygon implementation.
 *
 * Provides regular polygon primitives (shapes with all sides and angles equal)
 * including pentagons, hexagons, octagons, and other n-sided polygons.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import { Side } from "./Side.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Configuration for creating a RegularPolygon.
 *
 * Supports intuitive parameters that are easy for LLMs to work with.
 * Visual styling is handled through the style property using CSS/SVG properties.
 */
export interface RegularPolygonConfig {
  /**
   * Number of sides (must be 3 or greater).
   * - 3: Triangle
   * - 4: Square
   * - 5: Pentagon
   * - 6: Hexagon
   * - 7: Heptagon
   * - 8: Octagon
   * - etc.
   */
  sides: number;

  /**
   * Size parameter (supports units like "100px", "2rem", or numbers).
   * Can represent either radius or sideLength depending on sizeMode.
   */
  size: string | number;

  /**
   * How to interpret the size parameter.
   * - "radius": Size is the distance from center to vertex (circumradius)
   * - "sideLength": Size is the length of each side
   * @defaultValue "radius"
   */
  sizeMode?: "radius" | "sideLength";

  /**
   * Rotation offset in degrees (0° places first vertex pointing right).
   * @defaultValue 0
   */
  rotation?: number;

  /**
   * Visual styling properties (fill, stroke, opacity, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   fill: "#3498db",
   *   stroke: "#2c3e50",
   *   strokeWidth: 2,
   *   opacity: 0.8
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Represents a side (edge) of a regular polygon.
 */
export interface PolygonSide extends Side {
  /** Length of the side in pixels */
  length: number;

  /** Center point of the side */
  center: Point;

  /** Starting point of the side */
  start: Point;

  /** Ending point of the side */
  end: Point;

  /** Outward-facing normal vector */
  outwardNormal: Point;

  /** Inward-facing normal vector */
  inwardNormal: Point;
}

/**
 * Regular polygon shape with comprehensive geometric properties.
 *
 * The RegularPolygon class provides a high-level interface for creating and
 * manipulating regular polygons (shapes with all sides and angles equal).
 * It automatically calculates geometric properties like vertices, sides, angles,
 * and provides convenient access to positioning points.
 *
 * @remarks
 * Regular polygons follow counter-clockwise vertex ordering (see CONVENTIONS.md).
 * The first vertex is positioned according to the rotation parameter, with 0°
 * pointing to the right (standard mathematical convention).
 *
 * @example
 * Create a hexagon
 * ```typescript
 * const hexagon = new RegularPolygon({
 *   sides: 6,
 *   size: 50,
 *   fill: "#3498db"
 * });
 * ```
 *
 * @example
 * Create an octagon with specific side length
 * ```typescript
 * const octagon = new RegularPolygon({
 *   sides: 8,
 *   size: "60px",
 *   sizeMode: "sideLength",
 *   fill: "#e74c3c",
 *   stroke: "#c0392b",
 *   strokeWidth: 2
 * });
 * ```
 *
 * @example
 * Create a pentagon with custom rotation
 * ```typescript
 * const pentagon = new RegularPolygon({
 *   sides: 5,
 *   size: 80,
 *   rotation: 90, // First vertex points down
 *   fill: "#2ecc71"
 * });
 * ```
 */
export class RegularPolygon extends Shape {
  private config: RegularPolygonConfig;
  private _radius: number;
  private _sideCount: number;
  private _baseRotation: number;
  private vertices: Array<{ x: number; y: number }>;

  /**
   * Creates a new RegularPolygon instance.
   *
   * @param config - Configuration for the regular polygon
   *
   * @throws {Error} If sides is less than 3
   */
  constructor(config: RegularPolygonConfig) {
    super();
    
    if (config.sides < 3) {
      throw new Error("RegularPolygon requires at least 3 sides");
    }

    this.config = config;
    this._sideCount = config.sides;
    this._baseRotation = config.rotation || 0;

    const sizePx = parseUnit(config.size);
    const sizeMode = config.sizeMode || "radius";

    // Calculate radius based on size mode
    if (sizeMode === "sideLength") {
      // Convert side length to circumradius
      // For regular polygon: R = s / (2 * sin(π/n))
      const angleRad = Math.PI / this._sideCount;
      this._radius = sizePx / (2 * Math.sin(angleRad));
    } else {
      this._radius = sizePx;
    }

    this.vertices = this.calculateVertices();
  }

  /**
   * Calculates the vertices of the regular polygon.
   *
   * Vertices are ordered counter-clockwise for correct normal calculation (see CONVENTIONS.md).
   *
   * @returns Array of vertices
   * @internal
   */
  private calculateVertices(): Array<{ x: number; y: number }> {
    const vertices: Array<{ x: number; y: number }> = [];
    const angleStep = (2 * Math.PI) / this._sideCount;
    const baseAngleRad = (this._baseRotation * Math.PI) / 180;

    for (let i = 0; i < this._sideCount; i++) {
      // Counter-clockwise ordering: angles decrease (or increase in negative direction)
      const angle = baseAngleRad + i * angleStep;
      vertices.push({
        x: this._radius * Math.cos(angle),
        y: this._radius * Math.sin(angle),
      });
    }

    return vertices;
  }

  /**
   * Gets the number of sides of the polygon.
   *
   * @returns The number of sides
   */
  get sideCount(): number {
    return this._sideCount;
  }

  /**
   * Gets the circumradius (distance from center to vertex) in pixels.
   *
   * @returns The circumradius value
   */
  get radius(): number {
    return this._radius;
  }

  /**
   * Gets the side length of the polygon in pixels.
   *
   * @returns The length of each side
   */
  get sideLength(): number {
    // For regular polygon: s = 2R * sin(π/n)
    const angleRad = Math.PI / this._sideCount;
    return 2 * this._radius * Math.sin(angleRad);
  }

  /**
   * Gets the inradius (distance from center to side midpoint) in pixels.
   *
   * Also known as the apothem.
   *
   * @returns The inradius value
   */
  get inradius(): number {
    // For regular polygon: r = R * cos(π/n)
    const angleRad = Math.PI / this._sideCount;
    return this._radius * Math.cos(angleRad);
  }

  /**
   * Gets the interior angle of the polygon in degrees.
   *
   * All interior angles are equal in a regular polygon.
   *
   * @returns The interior angle in degrees
   *
   * @example
   * Check interior angles
   * ```typescript
   * const hexagon = new RegularPolygon({ sides: 6, size: 50 });
   * console.log(hexagon.interiorAngle); // 120 degrees
   *
   * const octagon = new RegularPolygon({ sides: 8, size: 50 });
   * console.log(octagon.interiorAngle); // 135 degrees
   * ```
   */
  get interiorAngle(): number {
    // Formula: (n - 2) * 180 / n
    return ((this._sideCount - 2) * 180) / this._sideCount;
  }

  /**
   * Gets the perimeter of the polygon in pixels.
   *
   * @returns The perimeter (sum of all side lengths)
   */
  get perimeter(): number {
    return this.sideLength * this._sideCount;
  }

  /**
   * Gets the area of the polygon in square pixels.
   *
   * @returns The area value
   *
   * @example
   * Calculate area of a hexagon
   * ```typescript
   * const hexagon = new RegularPolygon({ sides: 6, size: 50 });
   * console.log(hexagon.area);
   * ```
   */
  get area(): number {
    // Formula: (1/2) * perimeter * inradius
    return (this.perimeter * this.inradius) / 2;
  }

  /**
   * Gets the geometric center of the polygon.
   *
   * @returns The center point of the polygon
   */
  get center(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets all vertices of the polygon.
   *
   * Vertices are in counter-clockwise order (see CONVENTIONS.md).
   *
   * @returns Array of vertex points
   *
   * @example
   * Access individual vertices
   * ```typescript
   * const pentagon = new RegularPolygon({ sides: 5, size: 50 });
   * const vertices = pentagon.getVertices();
   * vertices.forEach((v, i) => {
   *   console.log(`Vertex ${i}: (${v.x}, ${v.y})`);
   * });
   * ```
   */
  getVertices(): Point[] {
    return this.vertices.map((v) => ({
      x: `${v.x + this.currentPosition.x}px`,
      y: `${v.y + this.currentPosition.y}px`,
    }));
  }

  /**
   * Gets all sides of the polygon with their geometric properties.
   *
   * Each side includes its length, center point, endpoints, and normal vectors.
   * Sides follow counter-clockwise vertex ordering (see CONVENTIONS.md).
   *
   * @returns Array of polygon sides
   *
   * @example
   * Access sides of a hexagon
   * ```typescript
   * const hexagon = new RegularPolygon({ sides: 6, size: 50 });
   * hexagon.getSides().forEach((side, i) => {
   *   console.log(`Side ${i}: length = ${side.length}`);
   *   console.log(`  Outward normal: (${side.outwardNormal.x}, ${side.outwardNormal.y})`);
   * });
   * ```
   */
  getSides(): PolygonSide[] {
    const sides: PolygonSide[] = [];

    for (let i = 0; i < this.vertices.length; i++) {
      const start = this.vertices[i];
      const end = this.vertices[(i + 1) % this.vertices.length];

      sides.push(
        new Side({
          start,
          end,
          positionOffset: this.currentPosition,
        }) as PolygonSide
      );
    }

    return sides;
  }

  /**
   * Gets a point on a specific vertex of the polygon.
   *
   * @param index - The vertex index (0 to sideCount-1)
   * @returns The point at the specified vertex
   *
   * @example
   * Get all vertices using vertex indices
   * ```typescript
   * const pentagon = new RegularPolygon({ sides: 5, size: 50 });
   * for (let i = 0; i < 5; i++) {
   *   const vertex = pentagon.getVertex(i);
   *   console.log(`Vertex ${i}: (${vertex.x}, ${vertex.y})`);
   * }
   * ```
   */
  getVertex(index: number): Point {
    const i = index % this.vertices.length;
    const v = this.vertices[i];
    return {
      x: `${v.x + this.currentPosition.x}px`,
      y: `${v.y + this.currentPosition.y}px`,
    };
  }

  /**
   * Gets a point at the center of a specific side.
   *
   * @param index - The side index (0 to sideCount-1)
   * @returns The point at the center of the specified side
   *
   * @example
   * Position elements at the center of each side
   * ```typescript
   * const octagon = new RegularPolygon({ sides: 8, size: 80 });
   * for (let i = 0; i < 8; i++) {
   *   const sideCenter = octagon.getSideCenter(i);
   *   // Position element at sideCenter
   * }
   * ```
   */
  getSideCenter(index: number): Point {
    const sides = this.getSides();
    const i = index % sides.length;
    return sides[i].center;
  }

  /**
   * Standard reference points for positioning.
   * Since regular polygons are inscribed in a circle, these represent the bounding box.
   */

  get topLeft(): Point {
    return {
      x: `${this.currentPosition.x - this._radius}px`,
      y: `${this.currentPosition.y - this._radius}px`,
    };
  }

  get topCenter(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y - this._radius}px`,
    };
  }

  get topRight(): Point {
    return {
      x: `${this.currentPosition.x + this._radius}px`,
      y: `${this.currentPosition.y - this._radius}px`,
    };
  }

  get leftCenter(): Point {
    return {
      x: `${this.currentPosition.x - this._radius}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  get rightCenter(): Point {
    return {
      x: `${this.currentPosition.x + this._radius}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  get bottomLeft(): Point {
    return {
      x: `${this.currentPosition.x - this._radius}px`,
      y: `${this.currentPosition.y + this._radius}px`,
    };
  }

  get bottomCenter(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this._radius}px`,
    };
  }

  get bottomRight(): Point {
    return {
      x: `${this.currentPosition.x + this._radius}px`,
      y: `${this.currentPosition.y + this._radius}px`,
    };
  }

  /**
   * Gets the bounding box of the polygon.
   *
   * @returns Object with bounding box properties
   */
  get boundingBox(): {
    topLeft: Point;
    bottomRight: Point;
    width: number;
    height: number;
  } {
    return {
      topLeft: this.topLeft,
      bottomRight: this.bottomRight,
      width: this._radius * 2,
      height: this._radius * 2,
    };
  }

  /**
   * Renders the regular polygon to SVG.
   *
   * @returns SVG polygon element representing the regular polygon
   */
  render(): string {
    const points = this.vertices
      .map((v) => {
        const x = v.x + this.currentPosition.x;
        const y = v.y + this.currentPosition.y;
        return `${x},${y}`;
      })
      .join(" ");

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

    return `<polygon points="${points}" ${styleAttrs}${transform} />`;
  }
}

