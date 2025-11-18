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
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Size specification for rectangular dimensions.
 * Supports CSS-style units (px, rem, em, %) or "auto" for automatic sizing.
 * Used by rectangles, artboards, containers, and other rectangular elements.
 *
 * @example
 * ```typescript
 * const fixedSize: RectangleSize = { width: "800px", height: "600px" };
 * const remSize: RectangleSize = { width: "50rem", height: "37.5rem" };
 * const autoSize: RectangleSize = { width: "auto", height: "auto" };
 * const numericSize: RectangleSize = { width: 800, height: 600 }; // Also supported
 * ```
 */
export interface RectangleSize {
  /** Width with units (e.g., "800px", "50rem") or "auto" for content-based sizing */
  width: string | number | "auto";
  /** Height with units (e.g., "600px", "37.5rem") or "auto" for content-based sizing */
  height: string | number | "auto";
}

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
 * Visual styling is handled through the style property using CSS/SVG properties.
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
    super(config.name);
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
   * Transforms a point by applying rotation around the rectangle's center.
   *
   * @param localX - X coordinate relative to top-left corner (before rotation)
   * @param localY - Y coordinate relative to top-left corner (before rotation)
   * @returns The transformed point in world coordinates
   * @internal
   */
  private transformPoint(
    localX: number,
    localY: number,
    propertyName?: string
  ): Point {
    // Use absolute position to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;

    const totalRotation = this.getTotalRotation();

    // If no rotation, just return the local position offset by absolute position
    if (totalRotation === 0) {
      const resultX = `${x + localX}px`;
      const resultY = `${y + localY}px`;

      // If property name is provided, create a bound point
      if (propertyName) {
        return this.createBoundPoint(resultX, resultY, propertyName);
      }

      return {
        x: resultX,
        y: resultY,
      };
    }

    // Calculate center of rectangle (rotation pivot point)
    const centerX = x + this._width / 2;
    const centerY = y + this._height / 2;

    // Point relative to rectangle's top-left
    const pointX = x + localX;
    const pointY = y + localY;

    // Translate point to origin (relative to center)
    const relX = pointX - centerX;
    const relY = pointY - centerY;

    // Rotate
    const angleRad = (totalRotation * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const rotatedX = relX * cos - relY * sin;
    const rotatedY = relX * sin + relY * cos;

    // Translate back
    const resultX = `${centerX + rotatedX}px`;
    const resultY = `${centerY + rotatedY}px`;

    // If property name is provided, create a bound point
    if (propertyName) {
      return this.createBoundPoint(resultX, resultY, propertyName);
    }

    return {
      x: resultX,
      y: resultY,
    };
  }

  /**
   * Gets the geometric center of the rectangle.
   *
   * @returns The center point of the rectangle (accounting for rotation)
   *
   * @remarks
   * The center is the rotation pivot point and doesn't move with rotation.
   */
  get center(): Point {
    // Use absolute position to account for parent hierarchy
    return this.toAbsolutePoint(this._width / 2, this._height / 2, "center");
  }

  /**
   * Gets the top-left corner of the rectangle.
   *
   * @returns The actual transformed position of the top-left corner
   *
   * @remarks
   * This returns the literal position after applying all transformations.
   * For a rotated rectangle, this is NOT the same as currentPosition.
   */
  get topLeft(): Point {
    return this.transformPoint(0, 0, "topLeft");
  }

  /**
   * Gets the top-right corner of the rectangle.
   *
   * @returns The actual transformed position of the top-right corner
   */
  get topRight(): Point {
    return this.transformPoint(this._width, 0, "topRight");
  }

  /**
   * Gets the bottom-left corner of the rectangle.
   *
   * @returns The actual transformed position of the bottom-left corner
   */
  get bottomLeft(): Point {
    return this.transformPoint(0, this._height, "bottomLeft");
  }

  /**
   * Gets the bottom-right corner of the rectangle.
   *
   * @returns The actual transformed position of the bottom-right corner
   */
  get bottomRight(): Point {
    return this.transformPoint(this._width, this._height, "bottomRight");
  }

  /**
   * Gets the center of the top edge.
   *
   * @returns The actual transformed position of the top edge center
   */
  get topCenter(): Point {
    return this.transformPoint(this._width / 2, 0, "topCenter");
  }

  /**
   * Gets the center of the bottom edge.
   *
   * @returns The actual transformed position of the bottom edge center
   */
  get bottomCenter(): Point {
    return this.transformPoint(this._width / 2, this._height, "bottomCenter");
  }

  /**
   * Gets the center of the left edge.
   *
   * @returns The actual transformed position of the left edge center
   */
  get leftCenter(): Point {
    return this.transformPoint(0, this._height / 2, "leftCenter");
  }

  /**
   * Gets the center of the right edge.
   *
   * @returns The actual transformed position of the right edge center
   */
  get rightCenter(): Point {
    return this.transformPoint(this._width, this._height / 2, "rightCenter");
  }

  /**
   * Convenient alias for topCenter.
   *
   * @returns The actual transformed position of the top edge center
   */
  get top(): Point {
    return this.topCenter;
  }

  /**
   * Convenient alias for bottomCenter.
   *
   * @returns The actual transformed position of the bottom edge center
   */
  get bottom(): Point {
    return this.bottomCenter;
  }

  /**
   * Convenient alias for leftCenter.
   *
   * @returns The actual transformed position of the left edge center
   */
  get left(): Point {
    return this.leftCenter;
  }

  /**
   * Convenient alias for rightCenter.
   *
   * @returns The actual transformed position of the right edge center
   */
  get right(): Point {
    return this.rightCenter;
  }

  /**
   * Gets the four sides of the rectangle with their geometric properties.
   *
   * Each side's direction follows counter-clockwise vertex ordering (see CONVENTIONS.md).
   * The sides are returned in logical order: top, left, bottom, right.
   *
   * @returns Array of four rectangle sides
   *
   * @example
   * Access rectangle sides
   * ```typescript
   * const rect = new Rectangle({ width: 200, height: 100 });
   * const [top, left, bottom, right] = rect.sides;
   *
   * // Outward normals point away from the rectangle:
   * // - top.outwardNormal points up
   * // - left.outwardNormal points left
   * // - bottom.outwardNormal points down
   * // - right.outwardNormal points right
   * ```
   */
  get sides(): [RectangleSide, RectangleSide, RectangleSide, RectangleSide] {
    // Use absolute position to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;
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

    // Counter-clockwise vertex order: TL → BL → BR → TR
    // Each side follows this ordering for correct outward normals
    return [
      createSide({ x: x + w, y }, { x, y }), // Top: TR → TL (going left)
      createSide({ x, y }, { x, y: y + h }), // Left: TL → BL (going down)
      createSide({ x, y: y + h }, { x: x + w, y: y + h }), // Bottom: BL → BR (going right)
      createSide({ x: x + w, y: y + h }, { x: x + w, y }), // Right: BR → TR (going up)
    ];
  }

  /**
   * Gets the primary diagonal of the rectangle (top-left to bottom-right).
   *
   * @returns Object with diagonal start, end, center, length, and normal vectors
   *
   * @example
   * Draw the diagonal
   * ```typescript
   * const rect = new Rectangle({ width: 200, height: 100 });
   * const line = new Line({
   *   start: rect.diagonal.start,
   *   end: rect.diagonal.end,
   *   style: { stroke: "#e74c3c", strokeWidth: 2 }
   * });
   * ```
   */
  get diagonal(): {
    start: Point;
    end: Point;
    center: Point;
    length: number;
    outwardNormal: Point;
    inwardNormal: Point;
  } {
    const tl = this.topLeft;
    const br = this.bottomRight;
    const length = Math.sqrt(this._width ** 2 + this._height ** 2);

    // Direction vector: from TL to BR
    const dx = this._width;
    const dy = this._height;

    // Outward normal: perpendicular to diagonal, pointing away from center
    // For TL->BR diagonal, rotate 90° clockwise: (dx, dy) -> (-dy, dx)
    const outwardX = -dy / length;
    const outwardY = dx / length;

    return {
      start: tl,
      end: br,
      center: this.center,
      length,
      outwardNormal: {
        x: `${outwardX}px`,
        y: `${outwardY}px`,
      },
      inwardNormal: {
        x: `${-outwardX}px`,
        y: `${-outwardY}px`,
      },
    };
  }

  /**
   * Gets the secondary diagonal of the rectangle (top-right to bottom-left).
   *
   * @returns Object with diagonal start, end, center, length, and normal vectors
   *
   * @example
   * Draw the anti-diagonal
   * ```typescript
   * const rect = new Rectangle({ width: 200, height: 100 });
   * const line = new Line({
   *   start: rect.antiDiagonal.start,
   *   end: rect.antiDiagonal.end,
   *   style: { stroke: "#3498db", strokeWidth: 2 }
   * });
   * ```
   */
  get antiDiagonal(): {
    start: Point;
    end: Point;
    center: Point;
    length: number;
    outwardNormal: Point;
    inwardNormal: Point;
  } {
    const tr = this.topRight;
    const bl = this.bottomLeft;
    const length = Math.sqrt(this._width ** 2 + this._height ** 2);

    // Direction vector: from TR to BL
    const dx = -this._width;
    const dy = this._height;

    // Outward normal: perpendicular to diagonal, pointing away from center
    // For TR->BL diagonal, rotate 90° clockwise: (dx, dy) -> (-dy, dx)
    const outwardX = -dy / length;
    const outwardY = dx / length;

    return {
      start: tr,
      end: bl,
      center: this.center,
      length,
      outwardNormal: {
        x: `${outwardX}px`,
        y: `${outwardY}px`,
      },
      inwardNormal: {
        x: `${-outwardX}px`,
        y: `${-outwardY}px`,
      },
    };
  }

  /**
   * Generates a squircle (superellipse) path.
   *
   * @returns SVG path data for a squircle shape
   * @internal
   */
  private generateSquirclePath(): string {
    // Use absolute position to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;
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
   * Gets the bounding box of the rectangle.
   *
   * @param axisAligned - If true, returns axis-aligned bounding box (accounts for rotation).
   *                      If false, returns oriented bounding box (ignores rotation).
   * @returns The bounding box
   *
   * @example
   * ```typescript
   * const rect = new Rectangle({ width: 100, height: 50 });
   * rect.rotate({ deg: 45 });
   *
   * // Get axis-aligned bounding box (space occupied on screen)
   * const aabb = rect.getBoundingBox(true);
   * // Returns larger box that encompasses rotated rectangle
   *
   * // Get oriented bounding box (rectangle's actual dimensions)
   * const obb = rect.getBoundingBox(false);
   * // Returns 100x50, ignoring rotation
   * ```
   */
  getBoundingBox(
    axisAligned: boolean = true
  ): import("../core/Element.js").BoundingBox {
    const absPos = this.getAbsolutePosition();

    if (!axisAligned || this.getTotalRotation() === 0) {
      // Oriented bounding box or no rotation - just use width/height
      return {
        topLeft: this.toAbsolutePoint(0, 0),
        bottomRight: this.toAbsolutePoint(this._width, this._height),
        width: this._width,
        height: this._height,
        isAxisAligned: this.getTotalRotation() === 0,
      };
    }

    // Axis-aligned bounding box with rotation
    // Get all four corners and find min/max
    const corners = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
    ];

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    corners.forEach((corner) => {
      const x = parseFloat(corner.x.toString().replace("px", ""));
      const y = parseFloat(corner.y.toString().replace("px", ""));
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    return {
      topLeft: { x: `${minX}px`, y: `${minY}px` },
      bottomRight: { x: `${maxX}px`, y: `${maxY}px` },
      width: maxX - minX,
      height: maxY - minY,
      isAxisAligned: true,
    };
  }

  /**
   * Renders the rectangle to SVG.
   *
   * @returns SVG element representing the rectangle
   */
  render(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;
    const w = this._width;
    const h = this._height;
    const cornerStyle = this.config.cornerStyle || "sharp";

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

    // Squircle corners
    if (cornerStyle === "squircle" && this._cornerRadius > 0) {
      const path = this.generateSquirclePath();
      return `${comment}<path d="${path}" ${styleAttrs}${transform} />`;
    }

    // Rounded or sharp corners
    const r =
      cornerStyle === "rounded"
        ? Math.min(this._cornerRadius, w / 2, h / 2)
        : 0;
    return `${comment}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" ${styleAttrs}${transform} />`;
  }
}
