/**
 * Elements module - FunctionGraph implementation.
 *
 * Provides mathematical function plotting with remarkable points detection,
 * covering K-12 mathematics and first-year university level topics.
 *
 * @module elements
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Types of remarkable points that can be detected on a function or its graph.
 */
export type RemarkablePointType =
  | "root" // x-intercept (where y = 0)
  | "y-intercept" // y-intercept (where x = 0)
  | "local-maximum" // Local maximum point
  | "local-minimum" // Local minimum point
  | "inflection-point" // Inflection point (where concavity changes)
  | "vertical-asymptote" // Vertical asymptote location
  | "discontinuity" // Point of discontinuity
  | "critical-point"; // Critical point (derivative = 0 or undefined)

/**
 * A remarkable point on a function or graph, providing semantic information
 * about mathematically significant locations.
 */
export interface RemarkablePoint {
  /** Type of remarkable point */
  type: RemarkablePointType;
  /** X-coordinate of the point */
  x: number;
  /** Y-coordinate of the point (may be undefined for asymptotes) */
  y?: number;
  /** Human-readable description */
  description: string;
  /** SVG coordinate of the point on the graph */
  svgPoint?: Point;
}

/**
 * Configuration for a single function to plot.
 */
export interface PlottedFunction {
  /** The mathematical function to plot, takes x and returns y */
  fn: (x: number) => number;
  /** Style for this specific function's curve */
  style?: Partial<Style>;
  /** Color for the function curve (shorthand for style.stroke) */
  color?: string;
  /** Whether to show points at sample locations */
  showPoints?: boolean;
}

/**
 * Information about a graph axis.
 */
export interface GraphAxis {
  /** The axis direction */
  direction: "horizontal" | "vertical";
  /** The value where this axis is drawn (e.g., y=0 for x-axis) */
  value: number;
  /** SVG coordinates for the axis line */
  start: Point;
  end: Point;
  /** Label for the axis */
  label?: string;
  /** Tick marks along the axis */
  ticks: Array<{
    value: number;
    position: Point;
    label: string;
  }>;
}

/**
 * Configuration for creating a FunctionGraph.
 */
export interface FunctionGraphConfig {
  /**
   * Single function or array of functions to plot.
   */
  functions: PlottedFunction | PlottedFunction[];

  /**
   * Width of the graph area in pixels (or with units).
   */
  width: string | number;

  /**
   * Height of the graph area in pixels (or with units).
   */
  height: string | number;

  /**
   * Domain (x-axis range) to plot.
   * @default [-10, 10]
   */
  domain?: [number, number];

  /**
   * Range (y-axis range) to plot.
   * If not provided, automatically calculated from function values.
   */
  range?: [number, number];

  /**
   * Number of samples to take when plotting functions.
   * Higher values create smoother curves but are more expensive.
   * @default 200
   */
  samples?: number;

  /**
   * Whether to show the coordinate grid.
   * @default true
   */
  showGrid?: boolean;

  /**
   * Grid spacing in x and y directions.
   * If not provided, automatically calculated based on pixel density.
   * @default auto-calculated for ~50-80 pixels between labels
   */
  gridSpacing?: [number, number];

  /**
   * Minimum pixel density between axis labels (used for auto-calculating gridSpacing).
   * @default 50
   */
  minLabelDensity?: number;

  /**
   * Whether to show axes.
   * @default true
   */
  showAxes?: boolean;

  /**
   * Whether to show axis labels and tick marks.
   * @default true
   */
  showLabels?: boolean;

  /**
   * Title for the graph.
   */
  title?: string;

  /**
   * Whether to automatically detect remarkable points.
   * Set to false to disable detection entirely.
   * @default true
   */
  detectRemarkablePoints?: boolean;

  /**
   * Whether to automatically render remarkable points on the graph.
   * If false, points can still be retrieved via getRemarkablePoints() and drawn manually.
   * @default false
   */
  showRemarkablePoints?: boolean;

  /**
   * Style for remarkable point markers (when showRemarkablePoints is true).
   */
  remarkablePointStyle?: Partial<Style>;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties for the graph container.
   */
  style?: Partial<Style>;

  /**
   * Style for the axes.
   */
  axisStyle?: Partial<Style>;

  /**
   * Style for the grid.
   */
  gridStyle?: Partial<Style>;
}

/**
 * FunctionGraph - Mathematical function plotting component.
 *
 * Provides comprehensive function graphing capabilities with automatic
 * detection of remarkable points (roots, extrema, inflection points, etc.).
 * Designed to cover K-12 mathematics and first-year university topics.
 *
 * @example
 * ```typescript
 * // Plot a quadratic function
 * const graph = new FunctionGraph({
 *   functions: {
 *     fn: (x) => x * x - 4,
 *     label: "f(x) = x² - 4",
 *     color: "#e74c3c"
 *   },
 *   width: 600,
 *   height: 400,
 *   domain: [-5, 5],
 * });
 *
 * // Access remarkable points
 * const roots = graph.getRemarkablePoints("root");
 * const extrema = graph.getRemarkablePoints("local-minimum");
 * ```
 *
 * @example
 * ```typescript
 * // Plot multiple functions
 * const graph = new FunctionGraph({
 *   functions: [
 *     { fn: (x) => Math.sin(x), label: "sin(x)", color: "#3498db" },
 *     { fn: (x) => Math.cos(x), label: "cos(x)", color: "#e74c3c" }
 *   ],
 *   width: 800,
 *   height: 400,
 *   domain: [-2 * Math.PI, 2 * Math.PI],
 * });
 * ```
 */
export class FunctionGraph extends Shape {
  private config: FunctionGraphConfig;
  private width: number;
  private height: number;
  private functions: PlottedFunction[];
  private domain: [number, number];
  private range: [number, number];
  private samples: number;
  private showGrid: boolean;
  private gridSpacing: [number, number];
  private minLabelDensity: number;
  private showAxes: boolean;
  private showLabels: boolean;
  private title?: string;
  private detectRemarkablePoints: boolean;
  private showRemarkablePoints: boolean;
  private remarkablePointStyle: Partial<Style>;
  private axisStyle: Partial<Style>;
  private gridStyle: Partial<Style>;
  private remarkablePointsCache: Map<string, RemarkablePoint[]>;
  private xAxis?: GraphAxis;
  private yAxis?: GraphAxis;

  constructor(config: FunctionGraphConfig) {
    super(config.name);
    this.config = config;

    // Parse dimensions
    this.width = parseUnit(config.width);
    this.height = parseUnit(config.height);

    // Normalize functions to array
    this.functions = Array.isArray(config.functions)
      ? config.functions
      : [config.functions];

    // Set domain and range
    this.domain = config.domain || [-10, 10];
    this.samples = config.samples || 200;
    this.range = config.range || this.calculateRange();

    // Configuration options
    this.showGrid = config.showGrid !== false;
    this.minLabelDensity = config.minLabelDensity || 50;
    // Calculate optimal grid spacing after range is known
    this.gridSpacing = config.gridSpacing || this.calculateOptimalGridSpacing();
    this.showAxes = config.showAxes !== false;
    this.showLabels = config.showLabels !== false;
    this.title = config.title;
    this.detectRemarkablePoints = config.detectRemarkablePoints !== false;
    this.showRemarkablePoints = config.showRemarkablePoints || false;

    // Styles
    this.remarkablePointStyle = config.remarkablePointStyle || {
      fill: "blue",
      stroke: "#c0392b",
      strokeWidth: "2px",
    };
    this.axisStyle = config.axisStyle || {
      stroke: "#2c3e50",
      strokeWidth: "2px",
    };
    this.gridStyle = config.gridStyle || {
      stroke: "#ecf0f1",
      strokeWidth: "1px",
    };

    // Initialize caches
    this.remarkablePointsCache = new Map();

    // Compute axes
    if (this.showAxes) {
      this.computeAxes();
    }

    // Detect remarkable points for all functions
    if (this.detectRemarkablePoints) {
      this.functions.forEach((func, idx) => {
        this.computeRemarkablePoints(func, idx);
      });
    }
  }

  /**
   * Calculate optimal grid spacing based on pixel density.
   * Ensures labels are at least minLabelDensity pixels apart.
   * Uses "nice" numbers (1, 2, 5, 10, 20, 50, 100, etc.) for spacing.
   */
  private calculateOptimalGridSpacing(): [number, number] {
    const niceNumbers = [1, 2, 2.5, 5];

    const calculateSpacing = (range: number, pixels: number): number => {
      // Calculate how many labels we can fit with minimum density
      const maxLabels = Math.floor(pixels / this.minLabelDensity);

      // Avoid division by zero
      if (maxLabels <= 0) return range;

      // Calculate rough spacing needed
      const roughSpacing = range / maxLabels;

      // Find the magnitude (power of 10)
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughSpacing)));

      // Find the nice number that's closest but larger than roughSpacing
      const normalized = roughSpacing / magnitude;
      let niceNumber = niceNumbers[niceNumbers.length - 1];

      for (let i = 0; i < niceNumbers.length; i++) {
        if (niceNumbers[i] >= normalized) {
          niceNumber = niceNumbers[i];
          break;
        }
      }

      const spacing = niceNumber * magnitude;

      // If this spacing is still too small, go up to next nice number
      if ((pixels / range) * spacing < this.minLabelDensity * 0.8) {
        const nextIndex = niceNumbers.indexOf(niceNumber) + 1;
        if (nextIndex < niceNumbers.length) {
          return niceNumbers[nextIndex] * magnitude;
        } else {
          return niceNumbers[0] * magnitude * 10;
        }
      }

      return spacing;
    };

    const xRange = this.domain[1] - this.domain[0];
    const yRange = this.range[1] - this.range[0];

    const xSpacing = calculateSpacing(xRange, this.width);
    const ySpacing = calculateSpacing(yRange, this.height);

    return [xSpacing, ySpacing];
  }

  /**
   * Calculate the appropriate range based on function values in the domain.
   */
  private calculateRange(): [number, number] {
    let minY = Infinity;
    let maxY = -Infinity;

    this.functions.forEach((func) => {
      const step = (this.domain[1] - this.domain[0]) / this.samples;
      for (let x = this.domain[0]; x <= this.domain[1]; x += step) {
        const y = func.fn(x);
        if (isFinite(y)) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    });

    // Add 10% padding
    const padding = (maxY - minY) * 0.1;
    return [minY - padding, maxY + padding];
  }

  /**
   * Convert mathematical coordinates to SVG coordinates (relative to graph origin).
   */
  private mathToSVG(x: number, y: number): Point {
    const svgX =
      ((x - this.domain[0]) / (this.domain[1] - this.domain[0])) * this.width;
    const svgY =
      this.height -
      ((y - this.range[0]) / (this.range[1] - this.range[0])) * this.height;
    return { x: svgX, y: svgY };
  }

  /**
   * Convert SVG coordinates to mathematical coordinates.
   */
  private svgToMath(svgX: number, svgY: number): { x: number; y: number } {
    const x =
      (svgX / this.width) * (this.domain[1] - this.domain[0]) + this.domain[0];
    const y =
      this.range[1] - (svgY / this.height) * (this.range[1] - this.range[0]);
    return { x, y };
  }

  /**
   * Compute axis information.
   */
  private computeAxes(): void {
    // X-axis (horizontal, at y=0 if visible)
    const xAxisY = Math.max(this.range[0], Math.min(0, this.range[1]));
    const xStart = this.mathToSVG(this.domain[0], xAxisY);
    const xEnd = this.mathToSVG(this.domain[1], xAxisY);

    this.xAxis = {
      direction: "horizontal",
      value: xAxisY,
      start: xStart,
      end: xEnd,
      label: "x",
      ticks: [],
    };

    // Generate x-axis ticks
    const xTickSpacing = this.gridSpacing[0];
    const xTickStart = Math.ceil(this.domain[0] / xTickSpacing) * xTickSpacing;
    for (let x = xTickStart; x <= this.domain[1]; x += xTickSpacing) {
      if (Math.abs(x) < 1e-10) continue; // Skip origin
      const pos = this.mathToSVG(x, xAxisY);
      this.xAxis.ticks.push({
        value: x,
        position: pos,
        label: this.formatNumber(x),
      });
    }

    // Y-axis (vertical, at x=0 if visible)
    const yAxisX = Math.max(this.domain[0], Math.min(0, this.domain[1]));
    const yStart = this.mathToSVG(yAxisX, this.range[0]);
    const yEnd = this.mathToSVG(yAxisX, this.range[1]);

    this.yAxis = {
      direction: "vertical",
      value: yAxisX,
      start: yStart,
      end: yEnd,
      label: "y",
      ticks: [],
    };

    // Generate y-axis ticks
    const yTickSpacing = this.gridSpacing[1];
    const yTickStart = Math.ceil(this.range[0] / yTickSpacing) * yTickSpacing;
    for (let y = yTickStart; y <= this.range[1]; y += yTickSpacing) {
      if (Math.abs(y) < 1e-10) continue; // Skip origin
      const pos = this.mathToSVG(yAxisX, y);
      this.yAxis.ticks.push({
        value: y,
        position: pos,
        label: this.formatNumber(y),
      });
    }
  }

  /**
   * Format a number for display on axis labels.
   */
  private formatNumber(n: number): string {
    if (Math.abs(n) < 1e-10) return "0";
    if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.01 && n !== 0)) {
      return n.toExponential(1);
    }
    return n.toFixed(Math.abs(n) < 1 ? 2 : Math.abs(n) < 10 ? 1 : 0);
  }

  /**
   * Numerical derivative approximation using central difference method.
   */
  private derivative(fn: (x: number) => number, x: number, h = 1e-5): number {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }

  /**
   * Numerical second derivative approximation.
   */
  private secondDerivative(
    fn: (x: number) => number,
    x: number,
    h = 1e-5
  ): number {
    return (fn(x + h) - 2 * fn(x) + fn(x - h)) / (h * h);
  }

  /**
   * Find roots (x-intercepts) using a combination of bracketing and Newton's method.
   */
  private findRoots(fn: (x: number) => number): number[] {
    const roots: number[] = [];
    const step = (this.domain[1] - this.domain[0]) / (this.samples * 2);
    const tolerance = 1e-6;

    // First pass: find sign changes (bracketing)
    let prevX = this.domain[0];
    let prevY = fn(prevX);

    for (let x = this.domain[0] + step; x <= this.domain[1]; x += step) {
      const y = fn(x);

      if (isFinite(prevY) && isFinite(y) && Math.sign(prevY) !== Math.sign(y)) {
        // Sign change detected, refine with Newton's method
        let root = (prevX + x) / 2;
        let iterations = 0;
        const maxIterations = 20;

        while (iterations < maxIterations) {
          const fRoot = fn(root);
          if (Math.abs(fRoot) < tolerance) break;

          const fPrime = this.derivative(fn, root);
          if (Math.abs(fPrime) < 1e-10) break; // Avoid division by zero

          root = root - fRoot / fPrime;
          iterations++;
        }

        // Verify root is in domain and unique
        if (
          root >= this.domain[0] &&
          root <= this.domain[1] &&
          Math.abs(fn(root)) < tolerance
        ) {
          if (!roots.some((r) => Math.abs(r - root) < tolerance)) {
            roots.push(root);
          }
        }
      }

      prevX = x;
      prevY = y;
    }

    return roots.sort((a, b) => a - b);
  }

  /**
   * Find local extrema (maxima and minima) by locating critical points.
   */
  private findExtrema(
    fn: (x: number) => number
  ): Array<{ x: number; y: number; type: "maximum" | "minimum" }> {
    const extrema: Array<{
      x: number;
      y: number;
      type: "maximum" | "minimum";
    }> = [];
    const step = (this.domain[1] - this.domain[0]) / (this.samples * 2);
    const tolerance = 1e-6;

    // Find critical points where f'(x) ≈ 0
    let prevX = this.domain[0];
    let prevDeriv = this.derivative(fn, prevX);

    for (let x = this.domain[0] + step; x <= this.domain[1]; x += step) {
      const deriv = this.derivative(fn, x);

      // Sign change in derivative indicates a critical point
      if (
        isFinite(prevDeriv) &&
        isFinite(deriv) &&
        Math.sign(prevDeriv) !== Math.sign(deriv)
      ) {
        // Refine critical point location
        let criticalX = (prevX + x) / 2;
        let iterations = 0;
        const maxIterations = 20;

        while (iterations < maxIterations) {
          const fPrime = this.derivative(fn, criticalX);
          if (Math.abs(fPrime) < tolerance) break;

          const fDoublePrime = this.secondDerivative(fn, criticalX);
          if (Math.abs(fDoublePrime) < 1e-10) break;

          criticalX = criticalX - fPrime / fDoublePrime;
          iterations++;
        }

        // Use second derivative test to classify
        if (
          criticalX >= this.domain[0] &&
          criticalX <= this.domain[1] &&
          Math.abs(this.derivative(fn, criticalX)) < tolerance
        ) {
          const secondDeriv = this.secondDerivative(fn, criticalX);
          if (Math.abs(secondDeriv) > tolerance) {
            const y = fn(criticalX);
            if (isFinite(y)) {
              extrema.push({
                x: criticalX,
                y: y,
                type: secondDeriv < 0 ? "maximum" : "minimum",
              });
            }
          }
        }
      }

      prevX = x;
      prevDeriv = deriv;
    }

    return extrema;
  }

  /**
   * Find inflection points where concavity changes.
   */
  private findInflectionPoints(fn: (x: number) => number): number[] {
    const inflectionPoints: number[] = [];
    const step = (this.domain[1] - this.domain[0]) / (this.samples * 2);
    const tolerance = 1e-6;

    let prevX = this.domain[0];
    let prevSecondDeriv = this.secondDerivative(fn, prevX);

    for (let x = this.domain[0] + step; x <= this.domain[1]; x += step) {
      const secondDeriv = this.secondDerivative(fn, x);

      // Sign change in second derivative indicates inflection point
      if (
        isFinite(prevSecondDeriv) &&
        isFinite(secondDeriv) &&
        Math.sign(prevSecondDeriv) !== Math.sign(secondDeriv)
      ) {
        const inflectionX = (prevX + x) / 2;
        if (
          inflectionX >= this.domain[0] &&
          inflectionX <= this.domain[1] &&
          isFinite(fn(inflectionX))
        ) {
          if (
            !inflectionPoints.some(
              (ip) => Math.abs(ip - inflectionX) < tolerance
            )
          ) {
            inflectionPoints.push(inflectionX);
          }
        }
      }

      prevX = x;
      prevSecondDeriv = secondDeriv;
    }

    return inflectionPoints.sort((a, b) => a - b);
  }

  /**
   * Detect vertical asymptotes and discontinuities.
   */
  private findAsymptotesAndDiscontinuities(
    fn: (x: number) => number
  ): Array<{ x: number; type: "asymptote" | "discontinuity" }> {
    const results: Array<{ x: number; type: "asymptote" | "discontinuity" }> =
      [];
    const step = (this.domain[1] - this.domain[0]) / (this.samples * 2);
    const jumpThreshold = (this.range[1] - this.range[0]) * 0.5;

    let prevX = this.domain[0];
    let prevY = fn(prevX);

    for (let x = this.domain[0] + step; x <= this.domain[1]; x += step) {
      const y = fn(x);

      // Check for discontinuity or asymptote
      if (
        (isFinite(prevY) && !isFinite(y)) ||
        (!isFinite(prevY) && isFinite(y)) ||
        (isFinite(prevY) && isFinite(y) && Math.abs(y - prevY) > jumpThreshold)
      ) {
        const discontinuityX = (prevX + x) / 2;
        const type =
          !isFinite(y) || !isFinite(prevY) ? "asymptote" : "discontinuity";

        // Avoid duplicates
        if (!results.some((r) => Math.abs(r.x - discontinuityX) < step * 2)) {
          results.push({ x: discontinuityX, type });
        }
      }

      prevX = x;
      prevY = y;
    }

    return results;
  }

  /**
   * Compute all remarkable points for a given function.
   */
  private computeRemarkablePoints(
    func: PlottedFunction,
    funcIndex: number
  ): void {
    const points: RemarkablePoint[] = [];
    const fn = func.fn;

    // Find roots (x-intercepts)
    const roots = this.findRoots(fn);
    roots.forEach((x) => {
      const svgPoint = this.mathToSVG(x, 0);
      points.push({
        type: "root",
        x,
        y: 0,
        description: `Root at x = ${this.formatNumber(x)}`,
        svgPoint,
      });
    });

    // Find y-intercept
    if (this.domain[0] <= 0 && this.domain[1] >= 0) {
      const y = fn(0);
      if (isFinite(y) && y >= this.range[0] && y <= this.range[1]) {
        const svgPoint = this.mathToSVG(0, y);
        points.push({
          type: "y-intercept",
          x: 0,
          y,
          description: `Y-intercept at (0, ${this.formatNumber(y)})`,
          svgPoint,
        });
      }
    }

    // Find extrema
    const extrema = this.findExtrema(fn);
    extrema.forEach((ext) => {
      const svgPoint = this.mathToSVG(ext.x, ext.y);
      points.push({
        type: ext.type === "maximum" ? "local-maximum" : "local-minimum",
        x: ext.x,
        y: ext.y,
        description: `${ext.type === "maximum" ? "Local maximum" : "Local minimum"} at (${this.formatNumber(ext.x)}, ${this.formatNumber(ext.y)})`,
        svgPoint,
      });
    });

    // Find inflection points
    const inflectionPoints = this.findInflectionPoints(fn);
    inflectionPoints.forEach((x) => {
      const y = fn(x);
      if (isFinite(y)) {
        const svgPoint = this.mathToSVG(x, y);
        points.push({
          type: "inflection-point",
          x,
          y,
          description: `Inflection point at (${this.formatNumber(x)}, ${this.formatNumber(y)})`,
          svgPoint,
        });
      }
    });

    // Find asymptotes and discontinuities
    const asymptotes = this.findAsymptotesAndDiscontinuities(fn);
    asymptotes.forEach((asym) => {
      points.push({
        type:
          asym.type === "asymptote" ? "vertical-asymptote" : "discontinuity",
        x: asym.x,
        description: `${asym.type === "asymptote" ? "Vertical asymptote" : "Discontinuity"} at x = ${this.formatNumber(asym.x)}`,
      });
    });

    this.remarkablePointsCache.set(`function-${funcIndex}`, points);
  }

  /**
   * Get all remarkable points of a specific type.
   *
   * @param type - The type of remarkable point to retrieve
   * @param functionIndex - Optional index of specific function (if multiple functions plotted)
   * @returns Array of remarkable points matching the type
   *
   * @example
   * ```typescript
   * const roots = graph.getRemarkablePoints("root");
   * const maxima = graph.getRemarkablePoints("local-maximum");
   * ```
   */
  public getRemarkablePoints(
    type?: RemarkablePointType,
    functionIndex?: number
  ): RemarkablePoint[] {
    const allPoints: RemarkablePoint[] = [];

    if (functionIndex !== undefined) {
      const points =
        this.remarkablePointsCache.get(`function-${functionIndex}`) || [];
      allPoints.push(...points);
    } else {
      // Collect from all functions
      this.remarkablePointsCache.forEach((points) => {
        allPoints.push(...points);
      });
    }

    if (type) {
      return allPoints.filter((p) => p.type === type);
    }

    return allPoints;
  }

  /**
   * Get the x-axis information.
   */
  public get xAxisInfo(): GraphAxis | undefined {
    return this.xAxis;
  }

  /**
   * Get the y-axis information.
   */
  public get yAxisInfo(): GraphAxis | undefined {
    return this.yAxis;
  }

  /**
   * Get a specific remarkable point location by type and index.
   * Returns absolute position on the artboard.
   * Useful for positioning labels or other elements relative to remarkable points.
   *
   * @example
   * ```typescript
   * const firstRoot = graph.getRemarkablePoint("root", 0);
   * label.position({
   *   relativeFrom: label.topCenter,
   *   relativeTo: firstRoot,
   *   x: 0,
   *   y: 20
   * });
   * ```
   */
  public getRemarkablePoint(
    type: RemarkablePointType,
    index: number = 0
  ): Point | undefined {
    // IMPORTANT: Ensure parent layouts are arranged before querying positions
    // This ensures getAbsolutePosition() returns the correct position
    this.ensureParentLayoutsArranged();

    const points = this.getRemarkablePoints(type);
    const point = points[index];

    if (!point?.svgPoint) return undefined;

    // Calculate the global index for this point across all cached remarkable points
    let globalIndex = 0;
    let found = false;

    for (const cachedPoints of this.remarkablePointsCache.values()) {
      for (let i = 0; i < cachedPoints.length; i++) {
        const cachedPoint = cachedPoints[i];
        if (cachedPoint.svgPoint) {
          if (cachedPoint.type === type && cachedPoint === point) {
            found = true;
            break;
          }
          globalIndex++;
        }
      }
      if (found) break;
    }

    // Render to DOM temporarily and query position
    const pointId = `${this.name}-remarkable-${type}-${globalIndex}`;
    const position = this.getRemarkablePointPositionFromDOM(pointId);

    console.log(
      `[getRemarkablePoint] type=${type}, index=${index}, globalIndex=${globalIndex}`
    );
    console.log(`[getRemarkablePoint] Point ID: ${pointId}`);
    console.log(`[getRemarkablePoint] Position from DOM:`, position);

    return position;
  }

  /**
   * Ensures all parent layouts in the hierarchy are arranged.
   * This guarantees getAbsolutePosition() returns correct values.
   * @private
   */
  private ensureParentLayoutsArranged(): void {
    let current: any = this._parent;
    const parents: any[] = [];

    // Collect all parents up to the root
    while (current) {
      parents.unshift(current); // Add to front so we arrange from root down
      current = current._parent;
    }

    // Arrange from root down, forcing re-arrangement if needed
    parents.forEach((parent) => {
      if (typeof parent.arrangeElements === "function") {
        // Reset isArranged flag to force re-arrangement
        if ("isArranged" in parent) {
          parent.isArranged = false;
        }
        parent.arrangeElements();
      }
    });
  }

  /**
   * Render the graph temporarily to the DOM and query the position of a remarkable point
   * relative to the graph's internal coordinate space.
   * @private
   */
  private getRemarkablePointPositionFromDOM(
    pointId: string
  ): Point | undefined {
    // Create a temporary container
    const container = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    container.setAttribute("width", "10000");
    container.setAttribute("height", "10000");
    container.style.position = "absolute";
    container.style.left = "-10000px";
    container.style.top = "-10000px";
    container.style.visibility = "hidden";

    // Render the graph WITHOUT the outer transform (just a plain group at 0,0)
    // This way we get positions relative to the graph's internal coordinate space
    const graphContent = this.renderGraphContent();
    container.innerHTML = `<g>${graphContent}</g>`;
    document.body.appendChild(container);

    // Find the remarkable point circle
    const pointElement = container.querySelector(`#${CSS.escape(pointId)}`);

    if (pointElement && pointElement instanceof SVGElement) {
      const bbox = pointElement.getBoundingClientRect();
      const containerBbox = container.getBoundingClientRect();

      // Get center of the circle relative to the container (which is at 0,0 in the graph's space)
      const graphRelativeX = bbox.left - containerBbox.left + bbox.width / 2;
      const graphRelativeY = bbox.top - containerBbox.top + bbox.height / 2;

      console.log(`[getRemarkablePointPositionFromDOM] Found point ${pointId}`);
      console.log(
        `[getRemarkablePointPositionFromDOM] Graph-relative position: (${graphRelativeX}, ${graphRelativeY})`
      );

      // Now add the graph's current absolute position to get the final absolute position
      const absPos = this.getAbsolutePosition();
      const finalX = absPos.x + graphRelativeX;
      const finalY = absPos.y + graphRelativeY;

      console.log(
        `[getRemarkablePointPositionFromDOM] Graph absolute position: (${absPos.x}, ${absPos.y})`
      );
      console.log(
        `[getRemarkablePointPositionFromDOM] Final absolute position: (${finalX}, ${finalY})`
      );

      document.body.removeChild(container);

      return {
        x: `${finalX}px`,
        y: `${finalY}px`,
      };
    }

    console.log(
      `[getRemarkablePointPositionFromDOM] Point ${pointId} not found in DOM`
    );
    document.body.removeChild(container);
    return undefined;
  }

  /**
   * Get the absolute position of a specific axis label by its value.
   * Returns absolute coordinates on the artboard.
   *
   * @param axis - Which axis to search ('x' or 'y')
   * @param value - The numeric value to find on the axis
   * @returns The absolute SVG position of the label tick mark, or undefined if not found
   *
   * @example
   * ```typescript
   * // Get position of x=2 label
   * const pos = graph.getLabelPosition('x', 2);
   * if (pos) {
   *   marker.position({ relativeFrom: marker.center, relativeTo: pos });
   * }
   * ```
   */
  public getLabelPosition(axis: "x" | "y", value: number): Point | undefined {
    // Ensure parent layouts are arranged before querying positions
    this.ensureParentLayoutsArranged();

    const axisInfo = axis === "x" ? this.xAxis : this.yAxis;
    console.log(`[getLabelPosition] axis=${axis}, value=${value}`);

    if (!axisInfo) {
      console.log(`[getLabelPosition] No axis info found!`);
      return undefined;
    }

    console.log(
      `[getLabelPosition] Available ticks:`,
      axisInfo.ticks.map((t) => ({ value: t.value, position: t.position }))
    );
    const tick = axisInfo.ticks.find((t) => Math.abs(t.value - value) < 1e-6);

    if (!tick) {
      console.log(`[getLabelPosition] No tick found for value ${value}`);
      return undefined;
    }

    // Return absolute position as a proper Point (strings with px units)
    const absPos = this.getAbsolutePosition();
    const absX = Number(absPos.x) + Number(tick.position.x);
    const absY = Number(absPos.y) + Number(tick.position.y);

    console.log(
      `[getLabelPosition] Relative: (${tick.position.x}, ${tick.position.y}), Graph absolute: (${absPos.x}, ${absPos.y}), Result: (${absX}, ${absY})`
    );

    return {
      x: `${absX}px`,
      y: `${absY}px`,
    };
  }

  /**
   * Get all label positions for an axis.
   * Returns an array of {value, position, label} objects with absolute positions.
   *
   * @param axis - Which axis to get labels from ('x' or 'y')
   * @returns Array of label information including absolute positions
   *
   * @example
   * ```typescript
   * const xLabels = graph.getAllLabelPositions('x');
   * xLabels.forEach(label => {
   *   console.log(`Label "${label.label}" at value ${label.value}: ${label.position.x}, ${label.position.y}`);
   * });
   * ```
   */
  public getAllLabelPositions(
    axis: "x" | "y"
  ): Array<{ value: number; position: Point; label: string }> {
    // Ensure parent layouts are arranged before querying positions
    this.ensureParentLayoutsArranged();

    const axisInfo = axis === "x" ? this.xAxis : this.yAxis;
    if (!axisInfo) return [];

    const absPos = this.getAbsolutePosition();

    return axisInfo.ticks.map((tick) => {
      const absX = Number(absPos.x) + Number(tick.position.x);
      const absY = Number(absPos.y) + Number(tick.position.y);

      return {
        value: tick.value,
        position: {
          x: `${absX}px`,
          y: `${absY}px`,
        },
        label: tick.label,
      };
    });
  }

  /**
   * Convert a mathematical coordinate to absolute SVG coordinate.
   * Returns absolute coordinates on the artboard.
   *
   * @param x - Mathematical x coordinate
   * @param y - Mathematical y coordinate
   * @returns Absolute SVG position
   *
   * @example
   * ```typescript
   * // Position an annotation at mathematical point (2, 3)
   * const pos = graph.coordinateToPosition(2, 3);
   * annotation.position({ relativeFrom: annotation.center, relativeTo: pos });
   * ```
   */
  public coordinateToPosition(x: number, y: number): Point {
    // Ensure parent layouts are arranged before querying positions
    this.ensureParentLayoutsArranged();

    const relPos = this.mathToSVG(x, y);
    const absPos = this.getAbsolutePosition();
    const absX = Number(absPos.x) + Number(relPos.x);
    const absY = Number(absPos.y) + Number(relPos.y);

    console.log(
      `[coordinateToPosition] Math (${x}, ${y}) -> Relative (${relPos.x}, ${relPos.y}) -> Absolute (${absX}, ${absY})`
    );
    console.log(
      `[coordinateToPosition] Domain: [${this.domain[0]}, ${this.domain[1]}], Range: [${this.range[0]}, ${this.range[1]}]`
    );
    console.log(
      `[coordinateToPosition] Graph size: ${this.width} x ${this.height}`
    );

    return {
      x: `${absX}px`,
      y: `${absY}px`,
    };
  }

  /**
   * Sample a function and return path data points.
   */
  private sampleFunction(
    func: PlottedFunction
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const step = (this.domain[1] - this.domain[0]) / this.samples;

    for (let x = this.domain[0]; x <= this.domain[1]; x += step) {
      const y = func.fn(x);
      if (isFinite(y) && y >= this.range[0] && y <= this.range[1]) {
        points.push(this.mathToSVG(x, y) as { x: number; y: number });
      } else if (points.length > 0) {
        // Break path at discontinuities
        points.push({ x: NaN, y: NaN });
      }
    }

    return points;
  }

  /**
   * Generate SVG path string from points, handling discontinuities.
   */
  private pointsToPath(points: Array<{ x: number; y: number }>): string {
    if (points.length === 0) return "";

    let path = "";
    let inPath = false;

    points.forEach((point, i) => {
      if (isNaN(point.x) || isNaN(point.y)) {
        inPath = false;
      } else {
        if (!inPath) {
          path += `M ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
          inPath = true;
        } else {
          path += `L ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
        }
      }
    });

    return path.trim();
  }

  get center(): Point {
    return this.toAbsolutePoint(this.width / 2, this.height / 2, "center");
  }

  get topLeft(): Point {
    return this.toAbsolutePoint(0, 0, "topLeft");
  }

  get topRight(): Point {
    return this.toAbsolutePoint(this.width, 0, "topRight");
  }

  get bottomLeft(): Point {
    return this.toAbsolutePoint(0, this.height, "bottomLeft");
  }

  get bottomRight(): Point {
    return this.toAbsolutePoint(this.width, this.height, "bottomRight");
  }

  get topCenter(): Point {
    return this.toAbsolutePoint(this.width / 2, 0, "topCenter");
  }

  get bottomCenter(): Point {
    return this.toAbsolutePoint(this.width / 2, this.height, "bottomCenter");
  }

  get leftCenter(): Point {
    return this.toAbsolutePoint(0, this.height / 2, "leftCenter");
  }

  get rightCenter(): Point {
    return this.toAbsolutePoint(this.width, this.height / 2, "rightCenter");
  }

  /**
   * Render the internal graph content without the outer transform group.
   * Used for DOM-based position queries.
   * @private
   */
  private renderGraphContent(): string {
    let svg = "";

    // Add title if provided
    if (this.title) {
      svg += `  <text x="${(this.width / 2).toFixed(2)}" y="-10" text-anchor="middle" font-size="16" font-weight="bold">${this.title}</text>\n`;
    }

    // Draw grid
    if (this.showGrid) {
      svg += `  <g class="grid">\n`;
      const gridAttrs = styleToSVGAttributes(this.gridStyle);

      // Vertical grid lines
      const xStep = this.gridSpacing[0];
      const xStart = Math.ceil(this.domain[0] / xStep) * xStep;
      for (let x = xStart; x <= this.domain[1]; x += xStep) {
        const svgX =
          ((x - this.domain[0]) / (this.domain[1] - this.domain[0])) *
          this.width;
        svg += `    <line x1="${svgX.toFixed(2)}" y1="0" x2="${svgX.toFixed(2)}" y2="${this.height}" ${gridAttrs} />\n`;
      }

      // Horizontal grid lines
      const yStep = this.gridSpacing[1];
      const yStart = Math.ceil(this.range[0] / yStep) * yStep;
      for (let y = yStart; y <= this.range[1]; y += yStep) {
        const svgY =
          this.height -
          ((y - this.range[0]) / (this.range[1] - this.range[0])) * this.height;
        svg += `    <line x1="0" y1="${svgY.toFixed(2)}" x2="${this.width}" y2="${svgY.toFixed(2)}" ${gridAttrs} />\n`;
      }

      svg += `  </g>\n`;
    }

    // Draw axes
    if (this.showAxes && this.xAxis && this.yAxis) {
      const axisAttrs = styleToSVGAttributes(this.axisStyle);
      svg += `  <g class="axes">\n`;

      // X-axis
      const xStart = this.xAxis.start;
      const xEnd = this.xAxis.end;
      svg += `    <line x1="${xStart.x}" y1="${xStart.y}" x2="${xEnd.x}" y2="${xEnd.y}" ${axisAttrs} />\n`;

      // X-axis ticks and labels
      if (this.showLabels) {
        this.xAxis.ticks.forEach((tick) => {
          const px = Number(tick.position.x);
          const py = Number(tick.position.y);
          svg += `    <line x1="${px.toFixed(2)}" y1="${(py - 5).toFixed(2)}" x2="${px.toFixed(2)}" y2="${(py + 5).toFixed(2)}" ${axisAttrs} />\n`;
          svg += `    <text x="${px.toFixed(2)}" y="${(py + 20).toFixed(2)}" text-anchor="middle" font-size="12">${tick.label}</text>\n`;
        });
      }

      // Y-axis
      const yStart = this.yAxis.start;
      const yEnd = this.yAxis.end;
      svg += `    <line x1="${yStart.x}" y1="${yStart.y}" x2="${yEnd.x}" y2="${yEnd.y}" ${axisAttrs} />\n`;

      // Y-axis ticks and labels
      if (this.showLabels) {
        this.yAxis.ticks.forEach((tick) => {
          const px = Number(tick.position.x);
          const py = Number(tick.position.y);
          svg += `    <line x1="${(px - 5).toFixed(2)}" y1="${py.toFixed(2)}" x2="${(px + 5).toFixed(2)}" y2="${py.toFixed(2)}" ${axisAttrs} />\n`;
          svg += `    <text x="${(px - 10).toFixed(2)}" y="${(py + 4).toFixed(2)}" text-anchor="end" font-size="12">${tick.label}</text>\n`;
        });
      }

      svg += `  </g>\n`;
    }

    // Draw functions
    svg += `  <g class="functions">\n`;
    this.functions.forEach((func, idx) => {
      const points = this.sampleFunction(func);
      const path = this.pointsToPath(points);

      if (path) {
        const color = func.color || "#3498db";
        const funcStyle: Partial<Style> = {
          stroke: color,
          strokeWidth: "2px",
          fill: "none",
          ...func.style,
        };
        const funcAttrs = styleToSVGAttributes(funcStyle);

        svg += `    <path d="${path}" ${funcAttrs} />\n`;

        // Draw points if requested
        if (func.showPoints) {
          points.forEach((point) => {
            if (!isNaN(point.x) && !isNaN(point.y)) {
              svg += `    <circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="2" fill="${color}" />\n`;
            }
          });
        }
      }
    });
    svg += `  </g>\n`;

    // Draw remarkable points (only if explicitly enabled)
    if (this.showRemarkablePoints && this.detectRemarkablePoints) {
      svg += `  <g class="remarkable-points">\n`;
      const rpAttrs = styleToSVGAttributes(this.remarkablePointStyle);

      let pointIndex = 0;
      this.remarkablePointsCache.forEach((points) => {
        points.forEach((point) => {
          if (point.svgPoint) {
            const px = Number(point.svgPoint.x);
            const py = Number(point.svgPoint.y);
            if (!isNaN(px) && !isNaN(py)) {
              const pointId = `${this.name}-remarkable-${point.type}-${pointIndex}`;
              svg += `    <circle id="${pointId}" cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="4" ${rpAttrs} />\n`;
              pointIndex++;
            }
          }
        });
      });

      svg += `  </g>\n`;
    }

    return svg;
  }

  render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();

    // Add comment
    svg += `<!-- ${this.name} -->\n`;

    // Create container group with transform
    svg += `<g transform="translate(${absPos.x.toFixed(2)}, ${absPos.y.toFixed(2)})">\n`;

    // Render the graph content
    svg += this.renderGraphContent();

    svg += `</g>\n`;

    return svg;
  }
}
