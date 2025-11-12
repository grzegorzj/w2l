/**
 * Geometric shapes module - Rectangle implementation.
 *
 * Provides rectangle primitives with various corner styles including
 * rounded corners and squircle (superellipse) corners.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import { Side } from "./Side.js";

/**
 * Corner style for rectangles.
 * - "sharp": Standard 90-degree corners
 * - "rounded": Circular arc corners
 * - "squircle": Superellipse corners (smoother than circular)
 */
export type CornerStyle = "sharp" | "rounded" | "squircle";

/**
 * Configuration for creating a Rectangle.
 *
 * Supports different corner styles and flexible sizing options.
 */
export interface RectangleConfig {
  /**
   * Width of the rectangle (supports units like "300px", "2rem", or numbers).
   */
  width: string | number;

  /**
   * Height of the rectangle (supports units like "200px", "2rem", or numbers).
   */
  height: string | number;

  /**
   * Corner style for the rectangle.
   * @defaultValue "sharp"
   */
  cornerStyle?: CornerStyle;

  /**
   * Corner radius for rounded or squircle corners (supports units).
   * For rounded corners: this is the circular arc radius.
   * For squircle corners: this defines the curvature extent.
   * @defaultValue 0
   */
  cornerRadius?: string | number;

  /**
   * Fill color of the rectangle.
   * @defaultValue "#000000"
   */
  fill?: string;

  /**
   * Stroke color for the rectangle outline.
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
 * Represents a side (edge) of a rectangle.
 */
export interface RectangleSide extends Side {
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
 * Rectangle shape with comprehensive geometric properties.
 *
 * The Rectangle class provides a high-level interface for creating and
 * manipulating rectangular shapes. It supports sharp corners, rounded corners,
 * and squircle (superellipse) corners for modern design aesthetics.
 *
 * @remarks
 * Squircles are superellipses that provide a smoother, more aesthetically
 * pleasing curve than simple rounded corners. They're commonly used in
 * modern UI design (e.g., iOS app icons).
 *
 * @example
 * Create a basic rectangle
 * ```typescript
 * const rect = new Rectangle({
 *   width: 200,
 *   height: 100,
 *   fill: "#3498db"
 * });
 * ```
 *
 * @example
 * Create a rectangle with rounded corners
 * ```typescript
 * const rect = new Rectangle({
 *   width: "300px",
 *   height: "200px",
 *   cornerStyle: "rounded",
 *   cornerRadius: 20,
 *   fill: "#e74c3c"
 * });
 * ```
 *
 * @example
 * Create a squircle (superellipse)
 * ```typescript
 * const squircle = new Rectangle({
 *   width: 150,
 *   height: 150,
 *   cornerStyle: "squircle",
 *   cornerRadius: 40,
 *   fill: "#2ecc71"
 * });
 * ```
 */
export class Rectangle extends Shape {
  protected config: RectangleConfig;
  protected _width: number;
  protected _height: number;
  protected _cornerRadius: number;

  /**
   * Creates a new Rectangle instance.
   *
   * @param config - Configuration for the rectangle
   */
  constructor(config: RectangleConfig) {
    super();
    this.config = config;
    this._width = parseUnit(config.width);
    this._height = parseUnit(config.height);
    this._cornerRadius = parseUnit(config.cornerRadius || 0);
  }

  /**
   * Gets the width of the rectangle in pixels.
   *
   * @returns The width value
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the height of the rectangle in pixels.
   *
   * @returns The height value
   */
  get height(): number {
    return this._height;
  }

  /**
   * Gets the area of the rectangle in square pixels.
   *
   * @returns The area value (width × height)
   */
  get area(): number {
    return this._width * this._height;
  }

  /**
   * Gets the perimeter of the rectangle in pixels.
   *
   * @returns The perimeter value (2 × width + 2 × height)
   */
  get perimeter(): number {
    return 2 * (this._width + this._height);
  }

  /**
   * Gets the geometric center of the rectangle.
   *
   * @returns The center point of the rectangle
   */
  get center(): Point {
    return {
      x: `${this.currentPosition.x + this._width / 2}px`,
      y: `${this.currentPosition.y + this._height / 2}px`,
    };
  }

  /**
   * Gets the top-left corner of the rectangle.
   *
   * @returns The top-left point
   */
  get topLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the top-right corner of the rectangle.
   *
   * @returns The top-right point
   */
  get topRight(): Point {
    return {
      x: `${this.currentPosition.x + this._width}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the bottom-left corner of the rectangle.
   *
   * @returns The bottom-left point
   */
  get bottomLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this._height}px`,
    };
  }

  /**
   * Gets the bottom-right corner of the rectangle.
   *
   * @returns The bottom-right point
   */
  get bottomRight(): Point {
    return {
      x: `${this.currentPosition.x + this._width}px`,
      y: `${this.currentPosition.y + this._height}px`,
    };
  }

  /**
   * Gets the center of the top edge.
   *
   * @returns The top center point
   */
  get topCenter(): Point {
    return {
      x: `${this.currentPosition.x + this._width / 2}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the center of the bottom edge.
   *
   * @returns The bottom center point
   */
  get bottomCenter(): Point {
    return {
      x: `${this.currentPosition.x + this._width / 2}px`,
      y: `${this.currentPosition.y + this._height}px`,
    };
  }

  /**
   * Gets the center of the left edge.
   *
   * @returns The left center point
   */
  get leftCenter(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this._height / 2}px`,
    };
  }

  /**
   * Gets the center of the right edge.
   *
   * @returns The right center point
   */
  get rightCenter(): Point {
    return {
      x: `${this.currentPosition.x + this._width}px`,
      y: `${this.currentPosition.y + this._height / 2}px`,
    };
  }

  /**
   * Gets the four sides of the rectangle with their geometric properties.
   *
   * The sides are returned in clockwise order: top, right, bottom, left.
   *
   * @returns Array of four rectangle sides
   *
   * @example
   * Access rectangle sides
   * ```typescript
   * const rect = new Rectangle({ width: 200, height: 100 });
   * const [top, right, bottom, left] = rect.sides;
   * ```
   */
  get sides(): [RectangleSide, RectangleSide, RectangleSide, RectangleSide] {
    const x = this.currentPosition.x;
    const y = this.currentPosition.y;
    const w = this._width;
    const h = this._height;

    const createSide = (
      start: { x: number; y: number },
      end: { x: number; y: number }
    ): RectangleSide => {
      return new Side({
        start,
        end,
        positionOffset: { x: 0, y: 0 },
      }) as RectangleSide;
    };

    // Top, Right, Bottom, Left (clockwise)
    return [
      createSide({ x, y }, { x: x + w, y }),
      createSide({ x: x + w, y }, { x: x + w, y: y + h }),
      createSide({ x: x + w, y: y + h }, { x, y: y + h }),
      createSide({ x, y: y + h }, { x, y }),
    ];
  }

  /**
   * Generates a squircle (superellipse) path.
   *
   * @returns SVG path data for a squircle shape
   * @internal
   */
  private generateSquirclePath(): string {
    const x = this.currentPosition.x;
    const y = this.currentPosition.y;
    const w = this._width;
    const h = this._height;
    const r = Math.min(this._cornerRadius, w / 2, h / 2);

    // Squircle uses a superellipse formula with n ≈ 4-5
    // For simplicity, we approximate it with cubic Bezier curves
    // The magic number ~0.55 creates a good approximation of a squircle
    const c = r * 0.55;

    const path = [
      `M ${x + r} ${y}`,
      `L ${x + w - r} ${y}`,
      `C ${x + w - r + c} ${y}, ${x + w} ${y + r - c}, ${x + w} ${y + r}`,
      `L ${x + w} ${y + h - r}`,
      `C ${x + w} ${y + h - r + c}, ${x + w - r + c} ${y + h}, ${x + w - r} ${y + h}`,
      `L ${x + r} ${y + h}`,
      `C ${x + r - c} ${y + h}, ${x} ${y + h - r + c}, ${x} ${y + h - r}`,
      `L ${x} ${y + r}`,
      `C ${x} ${y + r - c}, ${x + r - c} ${y}, ${x + r} ${y}`,
      "Z",
    ].join(" ");

    return path;
  }

  /**
   * Renders the rectangle to SVG.
   *
   * @returns SVG element representing the rectangle
   */
  render(): string {
    const x = this.currentPosition.x;
    const y = this.currentPosition.y;
    const w = this._width;
    const h = this._height;
    const fill = this.config.fill || "#000000";
    const stroke = this.config.stroke || "none";
    const strokeWidth = parseUnit(this.config.strokeWidth || 1);
    const cornerStyle = this.config.cornerStyle || "sharp";

    let transform = "";
    if (this.rotation !== 0) {
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      transform = ` transform="rotate(${this.rotation} ${centerX} ${centerY})"`;
    }

    // Squircle corners
    if (cornerStyle === "squircle" && this._cornerRadius > 0) {
      const path = this.generateSquirclePath();
      return `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${transform} />`;
    }

    // Rounded or sharp corners
    const r = cornerStyle === "rounded" ? Math.min(this._cornerRadius, w / 2, h / 2) : 0;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${transform} />`;
  }
}

