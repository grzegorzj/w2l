/**
 * Geometric shapes module - BezierCurve implementation.
 *
 * Provides bezier curve primitives for smooth, curved paths.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * A point with numeric coordinates (used internally for calculations).
 */
interface NumericPoint {
  x: number;
  y: number;
}

/**
 * Configuration for creating a BezierCurve.
 *
 * Supports both quadratic (2 control points) and cubic (3 control points) bezier curves.
 * Visual styling is handled through the style property using CSS/SVG properties.
 */
export interface BezierCurveConfig {
  /**
   * Starting point of the curve.
   * Can be a Point object with string coordinates or numeric values.
   */
  start: Point | NumericPoint;

  /**
   * Ending point of the curve.
   * Can be a Point object with string coordinates or numeric values.
   */
  end: Point | NumericPoint;

  /**
   * First control point of the curve.
   * For quadratic curves, this is the only control point.
   * For cubic curves, this is the first control point.
   */
  controlPoint1: Point | NumericPoint;

  /**
   * Second control point of the curve (optional).
   * If provided, creates a cubic bezier curve.
   * If not provided, creates a quadratic bezier curve.
   */
  controlPoint2?: Point | NumericPoint;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (stroke, strokeWidth, etc.).
   * Uses standard CSS/SVG property names.
   *
   * Note: Bezier curves are typically stroked rather than filled.
   *
   * @example
   * ```typescript
   * {
   *   stroke: "#3498db",
   *   strokeWidth: 3,
   *   fill: "none"
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Bezier curve shape for creating smooth curved paths.
 *
 * The BezierCurve class provides a high-level interface for creating
 * quadratic and cubic bezier curves. Bezier curves are defined by start
 * and end points along with one or two control points that define the
 * curvature.
 *
 * @remarks
 * - Quadratic bezier curves use one control point (controlPoint1)
 * - Cubic bezier curves use two control points (controlPoint1 and controlPoint2)
 * - The curve does not necessarily pass through the control points
 * - Control points determine the direction and magnitude of the curve
 *
 * Bezier curves are useful for creating smooth, organic shapes and connections
 * between elements.
 *
 * @example
 * Create a quadratic bezier curve
 * ```typescript
 * const curve = new BezierCurve({
 *   start: { x: "100px", y: "100px" },
 *   end: { x: "300px", y: "100px" },
 *   controlPoint1: { x: "200px", y: "50px" },
 *   style: {
 *     stroke: "#3498db",
 *     strokeWidth: 3,
 *     fill: "none"
 *   }
 * });
 * ```
 *
 * @example
 * Create a cubic bezier curve
 * ```typescript
 * const curve = new BezierCurve({
 *   start: { x: "100px", y: "100px" },
 *   end: { x: "400px", y: "100px" },
 *   controlPoint1: { x: "200px", y: "50px" },
 *   controlPoint2: { x: "300px", y: "150px" },
 *   style: {
 *     stroke: "#e74c3c",
 *     strokeWidth: 2,
 *     fill: "none"
 *   }
 * });
 * ```
 *
 * @example
 * Create a smooth S-curve connection
 * ```typescript
 * const curve = new BezierCurve({
 *   start: circle1.rightCenter,
 *   end: circle2.leftCenter,
 *   controlPoint1: { x: "200px", y: "100px" },
 *   controlPoint2: { x: "400px", y: "300px" },
 *   style: {
 *     stroke: "#2ecc71",
 *     strokeWidth: 2,
 *     fill: "none",
 *     strokeDasharray: "5,5"
 *   }
 * });
 * ```
 */
export class BezierCurve extends Shape {
  private config: BezierCurveConfig;
  private _start: NumericPoint;
  private _end: NumericPoint;
  private _controlPoint1: NumericPoint;
  private _controlPoint2: NumericPoint | null;

  /**
   * Creates a new BezierCurve instance.
   *
   * @param config - Configuration for the bezier curve
   */
  constructor(config: BezierCurveConfig) {
    super(config.name);
    this.config = config;

    this._start = this.parsePoint(config.start);
    this._end = this.parsePoint(config.end);
    this._controlPoint1 = this.parsePoint(config.controlPoint1);
    this._controlPoint2 = config.controlPoint2
      ? this.parsePoint(config.controlPoint2)
      : null;
  }

  /**
   * Parse a point to numeric coordinates.
   * @internal
   */
  private parsePoint(point: Point | NumericPoint): NumericPoint {
    if (typeof point.x === "string" || typeof point.y === "string") {
      return {
        x: typeof point.x === "string" ? parseUnit(point.x) : point.x,
        y: typeof point.y === "string" ? parseUnit(point.y) : point.y,
      };
    }
    return point as NumericPoint;
  }

  /**
   * Gets whether this is a cubic bezier curve (has two control points).
   *
   * @returns True if cubic, false if quadratic
   */
  get isCubic(): boolean {
    return this._controlPoint2 !== null;
  }

  /**
   * Gets the starting point of the curve.
   *
   * @returns The start point
   */
  get start(): Point {
    return this.toAbsolutePoint(this._start.x, this._start.y);
  }

  /**
   * Gets the ending point of the curve.
   *
   * @returns The end point
   */
  get end(): Point {
    return this.toAbsolutePoint(this._end.x, this._end.y);
  }

  /**
   * Gets the first control point of the curve.
   *
   * @returns The first control point
   */
  get controlPoint1(): Point {
    return this.toAbsolutePoint(this._controlPoint1.x, this._controlPoint1.y);
  }

  /**
   * Gets the second control point of the curve (if cubic).
   *
   * @returns The second control point, or null if quadratic
   */
  get controlPoint2(): Point | null {
    if (!this._controlPoint2) return null;
    return this.toAbsolutePoint(this._controlPoint2.x, this._controlPoint2.y);
  }

  /**
   * Gets a point on the curve at parameter t.
   *
   * For quadratic curves, uses the formula:
   * B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
   *
   * For cubic curves, uses the formula:
   * B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
   *
   * @param t - Parameter from 0 to 1 (0 = start, 1 = end)
   * @returns A point on the curve
   *
   * @example
   * Get the midpoint of a curve
   * ```typescript
   * const midpoint = curve.pointAt(0.5);
   * ```
   *
   * @example
   * Sample points along a curve
   * ```typescript
   * for (let i = 0; i <= 10; i++) {
   *   const t = i / 10;
   *   const point = curve.pointAt(t);
   *   // Use point for positioning or visualization
   * }
   * ```
   */
  pointAt(t: number): Point {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t));

    let x: number, y: number;

    if (this._controlPoint2) {
      // Cubic bezier
      const t2 = t * t;
      const t3 = t2 * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;

      x =
        mt3 * this._start.x +
        3 * mt2 * t * this._controlPoint1.x +
        3 * mt * t2 * this._controlPoint2.x +
        t3 * this._end.x;

      y =
        mt3 * this._start.y +
        3 * mt2 * t * this._controlPoint1.y +
        3 * mt * t2 * this._controlPoint2.y +
        t3 * this._end.y;
    } else {
      // Quadratic bezier
      const t2 = t * t;
      const mt = 1 - t;
      const mt2 = mt * mt;

      x =
        mt2 * this._start.x +
        2 * mt * t * this._controlPoint1.x +
        t2 * this._end.x;

      y =
        mt2 * this._start.y +
        2 * mt * t * this._controlPoint1.y +
        t2 * this._end.y;
    }

    return this.toAbsolutePoint(x, y);
  }

  /**
   * Gets the geometric center of the curve.
   * This is an approximation using the midpoint at t=0.5.
   *
   * @returns The approximate center point of the curve
   */
  get center(): Point {
    return this.pointAt(0.5);
  }

  /**
   * Gets the approximate length of the curve.
   *
   * Uses adaptive subdivision to estimate the arc length.
   * More accurate for curves with less extreme curvature.
   *
   * @param segments - Number of segments to use for approximation (default: 100)
   * @returns The approximate length of the curve in pixels
   */
  getLength(segments: number = 100): number {
    let length = 0;
    let prevPoint = this.pointAt(0);

    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const currPoint = this.pointAt(t);

      const dx = parseUnit(currPoint.x) - parseUnit(prevPoint.x);
      const dy = parseUnit(currPoint.y) - parseUnit(prevPoint.y);

      length += Math.sqrt(dx * dx + dy * dy);
      prevPoint = currPoint;
    }

    return length;
  }

  /**
   * Gets the bounding box of the curve.
   * This is an approximation using sampled points.
   *
   * @param axisAligned - Whether to return axis-aligned (true) or oriented (false) bounding box
   * @returns The bounding box
   */
  getBoundingBox(
    axisAligned: boolean = true
  ): import("../core/Element.js").BoundingBox {
    // Sample points along the curve to find bounds
    const samples = 50;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point = this.pointAt(t);
      const x = parseUnit(point.x);
      const y = parseUnit(point.y);

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return {
      topLeft: { x: `${minX}px`, y: `${minY}px` },
      bottomRight: { x: `${maxX}px`, y: `${maxY}px` },
      width: maxX - minX,
      height: maxY - minY,
      isAxisAligned: true,
    };
  }

  /**
   * Renders the bezier curve to SVG.
   *
   * @returns SVG path element representing the curve
   */
  render(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const startX = this._start.x + absPos.x;
    const startY = this._start.y + absPos.y;
    const cp1X = this._controlPoint1.x + absPos.x;
    const cp1Y = this._controlPoint1.y + absPos.y;
    const endX = this._end.x + absPos.x;
    const endY = this._end.y + absPos.y;

    let pathData: string;

    if (this._controlPoint2) {
      // Cubic bezier
      const cp2X = this._controlPoint2.x + absPos.x;
      const cp2Y = this._controlPoint2.y + absPos.y;
      pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    } else {
      // Quadratic bezier
      pathData = `M ${startX} ${startY} Q ${cp1X} ${cp1Y}, ${endX} ${endY}`;
    }

    // Default style if none provided (bezier curves are typically stroked, not filled)
    const defaultStyle: Partial<Style> = {
      fill: "none",
      stroke: "#000000",
      strokeWidth: "2",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();

    return `${comment}<path d="${pathData}" ${styleAttrs}${transform} />`;
  }
}

