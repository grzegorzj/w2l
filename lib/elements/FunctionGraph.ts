/**
 * New layout system - FunctionGraph implementation
 *
 * Provides mathematical function plotting with remarkable points detection,
 * covering K-12 mathematics and first-year university level topics.
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

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
  svgPoint?: { x: number; y: number };
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
  start: { x: number; y: number };
  end: { x: number; y: number };
  /** Label for the axis */
  label?: string;
  /** Tick marks along the axis */
  ticks: Array<{
    value: number;
    position: { x: number; y: number };
    label: string;
  }>;
}

/**
 * Configuration for a shaded region between curves.
 */
export interface ShadedRegion {
  /**
   * Index of the top bounding function (from functions array).
   * If undefined, uses the top of the graph range.
   */
  topFunction?: number;
  
  /**
   * Index of the bottom bounding function (from functions array).
   * If undefined, uses y=0 (x-axis) or bottom of range.
   */
  bottomFunction?: number;
  
  /**
   * X-range for the shaded region.
   * If undefined, uses the entire domain.
   */
  domain?: [number, number];
  
  /**
   * Style for the shaded region.
   */
  style?: Partial<Style>;
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
   * Width of the graph area in pixels.
   */
  width: number;

  /**
   * Height of the graph area in pixels.
   */
  height: number;

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

  /**
   * Shaded regions between curves.
   * Allows shading areas bounded by functions.
   */
  shadedRegions?: ShadedRegion[];

  /**
   * Box model (padding, margin, border)
   */
  boxModel?: BoxModel;

  /**
   * Debug mode - shows bounding box
   */
  debug?: boolean;
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
 *     color: "#e74c3c"
 *   },
 *   width: 600,
 *   height: 400,
 *   domain: [-5, 5],
 * });
 * ```
 */
export class FunctionGraph extends Rectangle {
  private config: FunctionGraphConfig;
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
  private shadedRegions: ShadedRegion[];
  private remarkablePointsCache: Map<string, RemarkablePoint[]>;
  private xAxis?: GraphAxis;
  private yAxis?: GraphAxis;
  private debug: boolean;

  constructor(config: FunctionGraphConfig) {
    super(config.width, config.height, config.boxModel, config.style);
    this.config = config;

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
    this.debug = config.debug || false;

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

    // Shaded regions
    this.shadedRegions = config.shadedRegions || [];

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
  private mathToSVG(x: number, y: number): { x: number; y: number } {
    const svgX =
      ((x - this.domain[0]) / (this.domain[1] - this.domain[0])) * this.width;
    const svgY =
      this.height -
      ((y - this.range[0]) / (this.range[1] - this.range[0])) * this.height;
    return { x: svgX, y: svgY };
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
   * Get a specific remarkable point location by type and index.
   * Returns absolute position on the artboard.
   */
  public getRemarkablePoint(
    type: RemarkablePointType,
    index: number = 0
  ): Position | undefined {
    const points = this.getRemarkablePoints(type);
    const point = points[index];

    if (!point?.svgPoint) return undefined;

    // Get absolute position by adding graph's position to relative point
    const absPos = this.getAbsolutePosition();
    const absX = absPos.x + point.svgPoint.x;
    const absY = absPos.y + point.svgPoint.y;

    return {
      x: absX,
      y: absY,
    };
  }

  /**
   * Convert mathematical coordinates to absolute artboard coordinates.
   * This is useful for marking arbitrary points on the graph (e.g., intersections).
   * 
   * @param x - Mathematical x-coordinate
   * @param y - Mathematical y-coordinate
   * @returns Absolute position on the artboard
   * 
   * @example
   * ```typescript
   * // Mark an intersection point at math coordinates (2, 3)
   * const pos = graph.mathToAbsolutePosition(2, 3);
   * const marker = new Circle({ radius: 5 });
   * marker.position({ relativeTo: pos, x: 0, y: 0 });
   * ```
   */
  public mathToAbsolutePosition(x: number, y: number): Position {
    // Convert to local SVG coordinates
    const svgPoint = this.mathToSVG(x, y);
    
    // Get absolute position by adding graph's position to relative point
    const absPos = this.getAbsolutePosition();
    
    return {
      x: absPos.x + svgPoint.x,
      y: absPos.y + svgPoint.y,
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
        points.push(this.mathToSVG(x, y));
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

  /**
   * Generate a closed path for a shaded region between two curves.
   */
  private generateShadedRegionPath(region: ShadedRegion): string {
    // Determine the domain for this region
    const regionDomain: [number, number] = region.domain || this.domain;
    
    // Get the top and bottom functions
    const topFn = region.topFunction !== undefined 
      ? this.functions[region.topFunction]?.fn 
      : undefined;
    const bottomFn = region.bottomFunction !== undefined 
      ? this.functions[region.bottomFunction]?.fn 
      : undefined;
    
    // Sample points along the domain
    const numSamples = Math.max(100, this.samples);
    const step = (regionDomain[1] - regionDomain[0]) / numSamples;
    
    const topPoints: Array<{ x: number; y: number }> = [];
    const bottomPoints: Array<{ x: number; y: number }> = [];
    
    for (let x = regionDomain[0]; x <= regionDomain[1]; x += step) {
      // Determine top y value
      let topY: number;
      if (topFn) {
        topY = topFn(x);
      } else {
        topY = this.range[1]; // Top of graph
      }
      
      // Determine bottom y value
      let bottomY: number;
      if (bottomFn) {
        bottomY = bottomFn(x);
      } else {
        // If no bottom function specified, use y=0 (x-axis) if it's in range, otherwise bottom of range
        bottomY = (this.range[0] <= 0 && this.range[1] >= 0) ? 0 : this.range[0];
      }
      
      // Only add points if both are finite and within range
      if (isFinite(topY) && isFinite(bottomY)) {
        // Clamp to range
        topY = Math.max(this.range[0], Math.min(this.range[1], topY));
        bottomY = Math.max(this.range[0], Math.min(this.range[1], bottomY));
        
        topPoints.push(this.mathToSVG(x, topY));
        bottomPoints.push(this.mathToSVG(x, bottomY));
      }
    }
    
    if (topPoints.length === 0 || bottomPoints.length === 0) {
      return "";
    }
    
    // Build closed path: go along top, then back along bottom (reversed)
    let path = `M ${topPoints[0].x.toFixed(2)} ${topPoints[0].y.toFixed(2)} `;
    
    // Draw along top curve
    for (let i = 1; i < topPoints.length; i++) {
      path += `L ${topPoints[i].x.toFixed(2)} ${topPoints[i].y.toFixed(2)} `;
    }
    
    // Draw along bottom curve (in reverse)
    for (let i = bottomPoints.length - 1; i >= 0; i--) {
      path += `L ${bottomPoints[i].x.toFixed(2)} ${bottomPoints[i].y.toFixed(2)} `;
    }
    
    // Close the path
    path += "Z";
    
    return path.trim();
  }

  // Position getters inherited from Rectangle (topLeft, center, etc.)

  render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();

    // Create container group with transform
    svg += `<g transform="translate(${Number(absPos.x).toFixed(2)}, ${Number(absPos.y).toFixed(2)})">\n`;

    // Add debug border if enabled
    if (this.debug) {
      svg += `  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="none" stroke="#ff0000" stroke-width="2" stroke-dasharray="5,5" />\n`;
    }

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

    // Draw shaded regions (before functions so they appear behind)
    if (this.shadedRegions.length > 0) {
      svg += `  <g class="shaded-regions">\n`;
      
      this.shadedRegions.forEach((region, idx) => {
        const path = this.generateShadedRegionPath(region);
        if (path) {
          const regionStyle: Partial<Style> = {
            fill: "#e0e0e0",
            fillOpacity: 0.3,
            stroke: "none",
            ...region.style,
          };
          const regionAttrs = styleToSVGAttributes(regionStyle);
          svg += `    <path class="shaded-region-${idx}" d="${path}" ${regionAttrs} />\n`;
        }
      });
      
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
          const px = tick.position.x;
          const py = tick.position.y;
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
          const px = tick.position.x;
          const py = tick.position.y;
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
            const px = point.svgPoint.x;
            const py = point.svgPoint.y;
            if (!isNaN(px) && !isNaN(py)) {
              const pointId = `func-graph-remarkable-${point.type}-${pointIndex}`;
              svg += `    <circle id="${pointId}" cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="4" ${rpAttrs} />\n`;
              pointIndex++;
            }
          }
        });
      });

      svg += `  </g>\n`;
    }

    // Render children
    if (this.children.length > 0) {
      const childrenSVG = this.children.map((child) => child.render()).join("\n");
      svg += childrenSVG;
    }

    svg += `</g>\n`;

    return svg;
  }
}

