/**
 * Geometric shapes module - Line implementation.
 *
 * Provides a line primitive to connect two points, useful for visualizing
 * connections between shape points, creating diagrams, and drawing guidelines.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Configuration for creating a Line.
 *
 * A line connects two points in space and can be styled with stroke properties.
 */
export interface LineConfig {
  /**
   * Starting point of the line.
   * Can be absolute coordinates or reference points from other elements.
   */
  start: Point;

  /**
   * Ending point of the line.
   * Can be absolute coordinates or reference points from other elements.
   */
  end: Point;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Whether to capture point positions absolutely or maintain reactive bindings.
   * 
   * - `false` (default): Maintains reactive bindings to source elements.
   *   When the source elements move, the line updates automatically.
   * - `true`: Captures current point values and makes them absolute.
   *   The line becomes independent of the source elements.
   *
   * @defaultValue false
   *
   * @example
   * Reactive line that follows elements
   * ```typescript
   * const line = new Line({
   *   start: rect1.center,
   *   end: rect2.center,
   *   absolute: false  // line updates when rect1 or rect2 move
   * });
   * ```
   *
   * @example
   * Static line with fixed positions
   * ```typescript
   * const line = new Line({
   *   start: rect1.center,
   *   end: rect2.center,
   *   absolute: true  // line stays fixed even if rect1 or rect2 move
   * });
   * ```
   */
  absolute?: boolean;

  /**
   * Visual styling properties (stroke, strokeWidth, opacity, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @remarks
   * Lines typically use stroke styling. Fill is ignored for line elements.
   *
   * @example
   * ```typescript
   * {
   *   stroke: "#e74c3c",
   *   strokeWidth: 2,
   *   opacity: 0.8,
   *   strokeDasharray: "5,5"  // dashed line
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Line shape for connecting two points.
 *
 * The Line class provides a simple way to draw lines between any two points,
 * making it easy to visualize connections, create diagrams, or show geometric
 * relationships between shapes.
 *
 * @remarks
 * Lines are particularly useful for:
 * - Connecting shape points (e.g., corners, centers)
 * - Drawing diagonals
 * - Creating diagrams and flowcharts
 * - Visualizing geometric constructions
 *
 * @example
 * Connect two rectangle corners
 * ```typescript
 * const rect = new Rectangle({ width: 200, height: 100 });
 * const line = new Line({
 *   start: rect.topLeft,
 *   end: rect.bottomRight,
 *   style: {
 *     stroke: "#e74c3c",
 *     strokeWidth: 2
 *   }
 * });
 * ```
 *
 * @example
 * Draw a line between two circle centers
 * ```typescript
 * const circle1 = new Circle({ radius: 50 });
 * const circle2 = new Circle({ radius: 50 });
 * circle2.position({
 *   relativeFrom: circle2.center,
 *   relativeTo: circle1.center,
 *   x: "200px",
 *   y: "0px"
 * });
 *
 * const line = new Line({
 *   start: circle1.center,
 *   end: circle2.center,
 *   style: {
 *     stroke: "#3498db",
 *     strokeWidth: 3,
 *     strokeDasharray: "10,5"
 *   }
 * });
 * ```
 */
export class Line extends Shape {
  private config: LineConfig;
  private _start: Point;
  private _end: Point;

  /**
   * Creates a new Line instance.
   *
   * @param config - Configuration for the line
   */
  constructor(config: LineConfig) {
    super(config.name);
    this.config = config;
    this._start = config.start;
    this._end = config.end;

    // Register reactive bindings if absolute is false (default)
    const isAbsolute = config.absolute ?? false;
    
    if (!isAbsolute) {
      // Check if start point has binding metadata
      if (config.start._binding) {
        const binding = config.start._binding;
        this.registerBinding(
          'start',
          binding.element,
          binding.property,
          () => this.updateStartFromBinding()
        );
      }

      // Check if end point has binding metadata
      if (config.end._binding) {
        const binding = config.end._binding;
        this.registerBinding(
          'end',
          binding.element,
          binding.property,
          () => this.updateEndFromBinding()
        );
      }
    }
  }

  /**
   * Gets the starting point of the line.
   *
   * @returns The start point
   */
  get start(): Point {
    return this._start;
  }

  /**
   * Gets the ending point of the line.
   *
   * @returns The end point
   */
  get end(): Point {
    return this._end;
  }

  /**
   * Gets the length of the line in pixels.
   *
   * @returns The Euclidean distance between start and end points
   */
  get length(): number {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Gets the geometric center (midpoint) of the line.
   *
   * @returns The center point of the line
   */
  get center(): Point {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    return {
      x: `${(x1 + x2) / 2}px`,
      y: `${(y1 + y2) / 2}px`,
    };
  }

  /**
   * Gets the angle of the line in degrees.
   *
   * @returns The angle from start to end (0° = right, 90° = down, following SVG convention)
   */
  get angle(): number {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    const dx = x2 - x1;
    const dy = y2 - y1;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  /**
   * Gets the direction vector of the line (normalized).
   *
   * @returns A unit vector pointing from start to end
   */
  get direction(): Point {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    return {
      x: `${dx / length}px`,
      y: `${dy / length}px`,
    };
  }

  /**
   * Gets the perpendicular (normal) vector to the line.
   *
   * @returns A unit vector perpendicular to the line (90° clockwise rotation)
   */
  get perpendicular(): Point {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    // 90° clockwise rotation: (dx, dy) -> (-dy, dx)
    return {
      x: `${-dy / length}px`,
      y: `${dx / length}px`,
    };
  }

  /**
   * Updates the start point from its binding.
   * Called automatically when the bound source element moves.
   * @internal
   */
  private updateStartFromBinding(): void {
    const binding = this._positionBindings.get('start');
    if (binding) {
      this._start = binding.getValue();
    }
  }

  /**
   * Updates the end point from its binding.
   * Called automatically when the bound source element moves.
   * @internal
   */
  private updateEndFromBinding(): void {
    const binding = this._positionBindings.get('end');
    if (binding) {
      this._end = binding.getValue();
    }
  }

  /**
   * Renders the line to SVG.
   *
   * @returns SVG line element representing the line
   */
  render(): string {
    const x1 = parseUnit(this._start.x);
    const y1 = parseUnit(this._start.y);
    const x2 = parseUnit(this._end.x);
    const y2 = parseUnit(this._end.y);

    // Default style if none provided
    const defaultStyle: Partial<Style> = {
      stroke: "#000000",
      strokeWidth: "1",
      fill: "none",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();

    return `${comment}<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${styleAttrs}${transform} />`;
  }
}

