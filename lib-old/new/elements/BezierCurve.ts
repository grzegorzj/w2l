/**
 * New layout system - BezierCurve
 * Quadratic and cubic bezier curves for smooth paths
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export interface NewBezierCurveConfig {
  /**
   * Starting point of the curve.
   */
  start: Position;

  /**
   * Ending point of the curve.
   */
  end: Position;

  /**
   * First control point of the curve.
   * For quadratic curves, this is the only control point.
   * For cubic curves, this is the first control point.
   */
  controlPoint1: Position;

  /**
   * Second control point of the curve (optional).
   * If provided, creates a cubic bezier curve.
   * If not provided, creates a quadratic bezier curve.
   */
  controlPoint2?: Position;

  /**
   * Visual styling properties (stroke, strokeWidth, etc.).
   * Note: Bezier curves are typically stroked rather than filled.
   */
  style?: Partial<Style>;
}

/**
 * Bezier curve shape for creating smooth curved paths.
 *
 * The NewBezierCurve class provides a high-level interface for creating
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
 * @example
 * Create a quadratic bezier curve
 * ```typescript
 * const curve = new NewBezierCurve({
 *   start: { x: 100, y: 100 },
 *   end: { x: 300, y: 100 },
 *   controlPoint1: { x: 200, y: 50 },
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
 * const curve = new NewBezierCurve({
 *   start: { x: 100, y: 100 },
 *   end: { x: 400, y: 100 },
 *   controlPoint1: { x: 200, y: 50 },
 *   controlPoint2: { x: 300, y: 150 },
 *   style: {
 *     stroke: "#e74c3c",
 *     strokeWidth: 2,
 *     fill: "none"
 *   }
 * });
 * ```
 */
export class NewBezierCurve extends NewShape {
  private _start: Position;
  private _end: Position;
  private _controlPoint1: Position;
  private _controlPoint2: Position | null;

  /**
   * Creates a new NewBezierCurve instance.
   *
   * @param config - Configuration for the bezier curve
   */
  constructor(config: NewBezierCurveConfig) {
    super(config.style);

    this._start = config.start;
    this._end = config.end;
    this._controlPoint1 = config.controlPoint1;
    this._controlPoint2 = config.controlPoint2 || null;
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
   * Gets the starting point of the curve in absolute coordinates.
   *
   * @returns The start point
   */
  get start(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._start.x,
      y: absPos.y + this._start.y,
    };
  }

  /**
   * Gets the ending point of the curve in absolute coordinates.
   *
   * @returns The end point
   */
  get end(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._end.x,
      y: absPos.y + this._end.y,
    };
  }

  /**
   * Gets the first control point of the curve in absolute coordinates.
   *
   * @returns The first control point
   */
  get controlPoint1(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._controlPoint1.x,
      y: absPos.y + this._controlPoint1.y,
    };
  }

  /**
   * Gets the second control point of the curve in absolute coordinates (if cubic).
   *
   * @returns The second control point, or null if quadratic
   */
  get controlPoint2(): Position | null {
    if (!this._controlPoint2) return null;
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._controlPoint2.x,
      y: absPos.y + this._controlPoint2.y,
    };
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
   * @returns A point on the curve in absolute coordinates
   *
   * @example
   * Get the midpoint of a curve
   * ```typescript
   * const midpoint = curve.pointAt(0.5);
   * ```
   */
  pointAt(t: number): Position {
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

    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + x,
      y: absPos.y + y,
    };
  }

  /**
   * Gets the geometric center of the curve.
   * This is an approximation using the midpoint at t=0.5.
   *
   * @returns The approximate center point of the curve
   */
  get center(): Position {
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

      const dx = currPoint.x - prevPoint.x;
      const dy = currPoint.y - prevPoint.y;

      length += Math.sqrt(dx * dx + dy * dy);
      prevPoint = currPoint;
    }

    return length;
  }

  /**
   * Gets the bounding box of the curve.
   * This is an approximation using sampled points.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    // Sample points along the curve to find bounds
    const samples = 50;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const point = this.pointAt(t);

      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return { minX, minY, maxX, maxY };
  }

  /**
   * Renders the bezier curve to SVG.
   *
   * @returns SVG path element representing the curve
   */
  render(): string {
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
    const style = { ...defaultStyle, ...this._style };
    const styleAttrs = styleToSVGAttributes(style);

    const transform = this.getTransformAttribute();

    return `<path d="${pathData}" ${styleAttrs} ${transform}/>`;
  }
}

