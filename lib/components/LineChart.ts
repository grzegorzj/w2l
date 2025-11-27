/**
 * LineChart Component
 *
 * A compound component for creating line charts with support for:
 * - Single or multiple line series
 * - Data point highlighting and position retrieval
 * - Remarkable points (max, min, crossings, inflection points)
 * - Customizable styling with markers and lines
 * - Grid and axes
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * A single data point in the line chart.
 */
export interface LineDataPoint {
  /** X value */
  x: number;
  /** Y value */
  y: number;
  /** Optional label for this point */
  label?: string;
}

/**
 * A series of data points with styling.
 */
export interface LineSeries {
  /** Series name/label */
  name: string;
  /** Data points */
  data: LineDataPoint[];
  /** Color for this series */
  color?: string;
  /** Line style */
  lineStyle?: Partial<Style>;
  /** Marker style */
  markerStyle?: Partial<Style>;
  /** Whether to show markers on data points */
  showMarkers?: boolean;
}

/**
 * Types of remarkable points in a line chart.
 */
export type LineChartRemarkablePointType =
  | "maximum" // Highest y value
  | "minimum" // Lowest y value
  | "localMaximum" // Local peak
  | "localMinimum" // Local valley
  | "inflection" // Change in curvature
  | "crossing" // Crosses zero or another line
  | "start" // First point
  | "end"; // Last point

/**
 * A remarkable point in the line chart.
 */
export interface LineChartRemarkablePoint {
  /** Type of remarkable point */
  type: LineChartRemarkablePointType;
  /** Series index */
  seriesIndex: number;
  /** Data point index within the series */
  dataIndex: number;
  /** X value */
  x: number;
  /** Y value */
  y: number;
  /** Label/description */
  description: string;
}

/**
 * Represents a single data point with position accessors.
 */
export class DataPoint {
  /** Series index */
  public readonly seriesIndex: number;
  /** Index in the data array */
  public readonly index: number;
  /** X value */
  public readonly x: number;
  /** Y value */
  public readonly y: number;
  /** Label */
  public readonly label?: string;

  private _screenX: number;
  private _screenY: number;
  private _chart: LineChart;

  constructor(
    seriesIndex: number,
    index: number,
    x: number,
    y: number,
    screenX: number,
    screenY: number,
    chart: LineChart,
    label?: string
  ) {
    this.seriesIndex = seriesIndex;
    this.index = index;
    this.x = x;
    this.y = y;
    this._screenX = screenX;
    this._screenY = screenY;
    this._chart = chart;
    this.label = label;
  }

  /**
   * Get the position in absolute artboard coordinates.
   */
  get position(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    return {
      x: chartPos.x + this._screenX,
      y: chartPos.y + this._screenY,
    };
  }

  /**
   * Get the screen position relative to the chart.
   */
  get screenPosition(): { x: number; y: number } {
    return { x: this._screenX, y: this._screenY };
  }
}

/**
 * Configuration for a LineChart.
 */
export interface LineChartConfig {
  /** Series to display */
  series: LineSeries[];

  /** Width of the chart */
  width: number;

  /** Height of the chart */
  height: number;

  /** Minimum X value (auto-calculated if not provided) */
  minX?: number;

  /** Maximum X value (auto-calculated if not provided) */
  maxX?: number;

  /** Minimum Y value (auto-calculated if not provided) */
  minY?: number;

  /** Maximum Y value (auto-calculated if not provided) */
  maxY?: number;

  /** Padding around the chart area (for axes and labels) */
  chartPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /** Whether to show grid lines */
  showGrid?: boolean;

  /** Whether to show axes */
  showAxes?: boolean;

  /** Whether to show axis labels */
  showAxisLabels?: boolean;

  /** Number of grid lines on X axis */
  xGridLineCount?: number;

  /** Number of grid lines on Y axis */
  yGridLineCount?: number;

  /** Default line width */
  lineWidth?: number;

  /** Default marker size */
  markerSize?: number;

  /** Whether to fill area under the line */
  fillArea?: boolean;

  /** Whether to smooth the line (Bezier curves) */
  smoothLines?: boolean;

  /** Whether to detect remarkable points */
  detectRemarkablePoints?: boolean;

  /** Whether to show remarkable point markers */
  showRemarkablePoints?: boolean;

  /** Style for remarkable point markers */
  remarkablePointStyle?: Partial<Style>;

  /** Box model configuration */
  boxModel?: BoxModel;

  /** Overall style */
  style?: Partial<Style>;
}

/**
 * LineChart - A compound component for rendering line charts.
 *
 * Extends Rectangle, so it can be positioned like any other element.
 * Supports multiple series, remarkable points detection, and position retrieval.
 */
export class LineChart extends Rectangle {
  private series: LineSeries[];
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private chartPadding: Required<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
  private showGrid: boolean;
  private showAxes: boolean;
  private showAxisLabels: boolean;
  private xGridLineCount: number;
  private yGridLineCount: number;
  private lineWidth: number;
  private markerSize: number;
  private fillArea: boolean;
  private smoothLines: boolean;
  private detectRemarkablePointsFlag: boolean;
  private showRemarkablePointsFlag: boolean;
  private remarkablePointStyle: Partial<Style>;

  private dataPoints: DataPoint[][] = []; // [seriesIndex][dataIndex]
  private remarkablePoints: LineChartRemarkablePoint[] = [];
  private plotAreaWidth: number;
  private plotAreaHeight: number;
  private plotAreaX: number;
  private plotAreaY: number;

  constructor(config: LineChartConfig) {
    const {
      width,
      height,
      series,
      minX,
      maxX,
      minY,
      maxY,
      chartPadding = {},
      showGrid = true,
      showAxes = true,
      showAxisLabels = true,
      xGridLineCount = 5,
      yGridLineCount = 5,
      lineWidth = 2,
      markerSize = 6,
      fillArea = false,
      smoothLines = false,
      detectRemarkablePoints = true,
      showRemarkablePoints = false,
      remarkablePointStyle = {},
      boxModel,
      style = {},
    } = config;

    super(
      width,
      height,
      boxModel,
      {
        fill: "#ffffff",
        stroke: "#e0e0e0",
        strokeWidth: "1",
        ...style,
      }
    );

    this.series = series;
    this.chartPadding = {
      top: chartPadding.top ?? 20,
      right: chartPadding.right ?? 20,
      bottom: chartPadding.bottom ?? 40,
      left: chartPadding.left ?? 60,
    };
    this.showGrid = showGrid;
    this.showAxes = showAxes;
    this.showAxisLabels = showAxisLabels;
    this.xGridLineCount = xGridLineCount;
    this.yGridLineCount = yGridLineCount;
    this.lineWidth = lineWidth;
    this.markerSize = markerSize;
    this.fillArea = fillArea;
    this.smoothLines = smoothLines;
    this.detectRemarkablePointsFlag = detectRemarkablePoints;
    this.showRemarkablePointsFlag = showRemarkablePoints;
    this.remarkablePointStyle = {
      fill: "#ff5722",
      stroke: "#d84315",
      strokeWidth: "2",
      ...remarkablePointStyle,
    };

    // Calculate plot area
    this.plotAreaWidth = width - this.chartPadding.left - this.chartPadding.right;
    this.plotAreaHeight = height - this.chartPadding.top - this.chartPadding.bottom;
    this.plotAreaX = this.chartPadding.left;
    this.plotAreaY = this.chartPadding.top;

    // Calculate data ranges
    const allPoints = series.flatMap((s) => s.data);
    const xValues = allPoints.map((p) => p.x);
    const yValues = allPoints.map((p) => p.y);

    this.minX = minX ?? Math.min(...xValues);
    this.maxX = maxX ?? Math.max(...xValues);
    this.minY = minY ?? Math.min(...yValues, 0);
    this.maxY = maxY ?? Math.max(...yValues) * 1.1; // 10% padding

    // Process data points
    this.calculateDataPoints();

    // Detect remarkable points
    if (this.detectRemarkablePointsFlag) {
      this.detectRemarkable();
    }
  }

  /**
   * Calculate screen positions for all data points.
   */
  private calculateDataPoints(): void {
    this.dataPoints = this.series.map((series, seriesIndex) =>
      series.data.map((point, pointIndex) => {
        const screenX = this.valueToScreenX(point.x);
        const screenY = this.valueToScreenY(point.y);
        return new DataPoint(
          seriesIndex,
          pointIndex,
          point.x,
          point.y,
          screenX,
          screenY,
          this,
          point.label
        );
      })
    );
  }

  /**
   * Convert a data X value to screen X coordinate (relative to chart).
   */
  private valueToScreenX(x: number): number {
    const normalized = (x - this.minX) / (this.maxX - this.minX);
    return this.plotAreaX + normalized * this.plotAreaWidth;
  }

  /**
   * Convert a data Y value to screen Y coordinate (relative to chart).
   */
  private valueToScreenY(y: number): number {
    const normalized = (y - this.minY) / (this.maxY - this.minY);
    return this.plotAreaY + this.plotAreaHeight - normalized * this.plotAreaHeight;
  }

  /**
   * Detect remarkable points in the data.
   */
  private detectRemarkable(): void {
    this.remarkablePoints = [];

    this.series.forEach((series, seriesIndex) => {
      const points = series.data;
      if (points.length === 0) return;

      // Find global maximum and minimum
      let maxY = points[0].y;
      let maxIndex = 0;
      let minY = points[0].y;
      let minIndex = 0;

      points.forEach((point, i) => {
        if (point.y > maxY) {
          maxY = point.y;
          maxIndex = i;
        }
        if (point.y < minY) {
          minY = point.y;
          minIndex = i;
        }
      });

      // Add global maximum
      this.remarkablePoints.push({
        type: "maximum",
        seriesIndex,
        dataIndex: maxIndex,
        x: points[maxIndex].x,
        y: maxY,
        description: `Maximum: ${maxY.toFixed(2)} at x=${points[maxIndex].x.toFixed(2)}`,
      });

      // Add global minimum
      if (minIndex !== maxIndex) {
        this.remarkablePoints.push({
          type: "minimum",
          seriesIndex,
          dataIndex: minIndex,
          x: points[minIndex].x,
          y: minY,
          description: `Minimum: ${minY.toFixed(2)} at x=${points[minIndex].x.toFixed(2)}`,
        });
      }

      // Detect local maxima and minima
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1].y;
        const curr = points[i].y;
        const next = points[i + 1].y;

        if (curr > prev && curr > next) {
          this.remarkablePoints.push({
            type: "localMaximum",
            seriesIndex,
            dataIndex: i,
            x: points[i].x,
            y: curr,
            description: `Local max: ${curr.toFixed(2)} at x=${points[i].x.toFixed(2)}`,
          });
        } else if (curr < prev && curr < next) {
          this.remarkablePoints.push({
            type: "localMinimum",
            seriesIndex,
            dataIndex: i,
            x: points[i].x,
            y: curr,
            description: `Local min: ${curr.toFixed(2)} at x=${points[i].x.toFixed(2)}`,
          });
        }
      }

      // Detect zero crossings
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i].y;
        const next = points[i + 1].y;

        if ((curr > 0 && next < 0) || (curr < 0 && next > 0)) {
          // Linear interpolation to find crossing point
          const t = -curr / (next - curr);
          const crossX = points[i].x + t * (points[i + 1].x - points[i].x);

          this.remarkablePoints.push({
            type: "crossing",
            seriesIndex,
            dataIndex: i,
            x: crossX,
            y: 0,
            description: `Zero crossing at x=${crossX.toFixed(2)}`,
          });
        }
      }

      // Add start and end points
      if (points.length > 0) {
        this.remarkablePoints.push({
          type: "start",
          seriesIndex,
          dataIndex: 0,
          x: points[0].x,
          y: points[0].y,
          description: `Start: (${points[0].x.toFixed(2)}, ${points[0].y.toFixed(2)})`,
        });

        this.remarkablePoints.push({
          type: "end",
          seriesIndex,
          dataIndex: points.length - 1,
          x: points[points.length - 1].x,
          y: points[points.length - 1].y,
          description: `End: (${points[points.length - 1].x.toFixed(2)}, ${points[points.length - 1].y.toFixed(2)})`,
        });
      }
    });
  }

  /**
   * Get all data points for a specific series.
   */
  public getSeriesDataPoints(seriesIndex: number): DataPoint[] {
    return this.dataPoints[seriesIndex] ? [...this.dataPoints[seriesIndex]] : [];
  }

  /**
   * Get a specific data point.
   */
  public getDataPoint(seriesIndex: number, dataIndex: number): DataPoint | undefined {
    return this.dataPoints[seriesIndex]?.[dataIndex];
  }

  /**
   * Get all data points from all series.
   */
  public getAllDataPoints(): DataPoint[][] {
    return this.dataPoints.map((series) => [...series]);
  }

  /**
   * Get remarkable points, optionally filtered by type.
   */
  public getRemarkablePoints(type?: LineChartRemarkablePointType): LineChartRemarkablePoint[] {
    if (type) {
      return this.remarkablePoints.filter((p) => p.type === type);
    }
    return [...this.remarkablePoints];
  }

  /**
   * Get the position of a remarkable point in absolute coordinates.
   */
  public getRemarkablePointPosition(point: LineChartRemarkablePoint): Position {
    const dataPoint = this.dataPoints[point.seriesIndex]?.[point.dataIndex];
    if (dataPoint) {
      return dataPoint.position;
    }
    
    // For interpolated points (like crossings), calculate position
    const screenX = this.valueToScreenX(point.x);
    const screenY = this.valueToScreenY(point.y);
    const chartPos = this.getAbsolutePosition();
    
    return {
      x: chartPos.x + screenX,
      y: chartPos.y + screenY,
    };
  }

  /**
   * Render the line chart.
   */
  public render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();

    svg += `<g transform="translate(${Number(absPos.x).toFixed(2)}, ${Number(absPos.y).toFixed(2)})">\n`;

    // Background
    const attrs = styleToSVGAttributes(this._style);
    const size = this.getBoxSize("border");
    svg += `  <rect x="0" y="0" width="${size.width}" height="${size.height}" ${attrs} />\n`;

    // Grid
    if (this.showGrid) {
      svg += this.renderGrid();
    }

    // Axes
    if (this.showAxes) {
      svg += this.renderAxes();
    }

    // Area fill (if enabled)
    if (this.fillArea) {
      svg += this.renderAreaFill();
    }

    // Lines
    svg += this.renderLines();

    // Markers
    svg += this.renderMarkers();

    // Remarkable points
    if (this.showRemarkablePointsFlag) {
      svg += this.renderRemarkablePointMarkers();
    }

    svg += `</g>\n`;

    return svg;
  }

  /**
   * Render grid lines.
   */
  private renderGrid(): string {
    const parts: string[] = [];
    const gridStyle = 'stroke="#e0e0e0" stroke-width="0.5" opacity="0.5"';

    // Vertical grid lines
    for (let i = 0; i <= this.xGridLineCount; i++) {
      const x = this.plotAreaX + (i / this.xGridLineCount) * this.plotAreaWidth;
      parts.push(
        `<line x1="${x}" y1="${this.plotAreaY}" x2="${x}" y2="${this.plotAreaY + this.plotAreaHeight}" ${gridStyle} />`
      );
    }

    // Horizontal grid lines
    for (let i = 0; i <= this.yGridLineCount; i++) {
      const y = this.plotAreaY + this.plotAreaHeight - (i / this.yGridLineCount) * this.plotAreaHeight;
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${y}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${y}" ${gridStyle} />`
      );
    }

    return parts.join("\n");
  }

  /**
   * Render axes and labels.
   */
  private renderAxes(): string {
    const parts: string[] = [];
    const axisStyle = 'stroke="#424242" stroke-width="2"';

    // X-axis
    const xAxisY = this.valueToScreenY(0);
    parts.push(
      `<line x1="${this.plotAreaX}" y1="${xAxisY}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${xAxisY}" ${axisStyle} />`
    );

    // Y-axis
    parts.push(
      `<line x1="${this.plotAreaX}" y1="${this.plotAreaY}" x2="${this.plotAreaX}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisStyle} />`
    );

    // Axis labels
    if (this.showAxisLabels) {
      // X-axis labels
      for (let i = 0; i <= this.xGridLineCount; i++) {
        const value = this.minX + (i / this.xGridLineCount) * (this.maxX - this.minX);
        const x = this.plotAreaX + (i / this.xGridLineCount) * this.plotAreaWidth;
        parts.push(
          `<text x="${x}" y="${this.plotAreaY + this.plotAreaHeight + 20}" text-anchor="middle" font-size="11" fill="#616161">${value.toFixed(1)}</text>`
        );
      }

      // Y-axis labels
      for (let i = 0; i <= this.yGridLineCount; i++) {
        const value = this.minY + (i / this.yGridLineCount) * (this.maxY - this.minY);
        const y = this.plotAreaY + this.plotAreaHeight - (i / this.yGridLineCount) * this.plotAreaHeight;
        parts.push(
          `<text x="${this.plotAreaX - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#616161">${value.toFixed(1)}</text>`
        );
      }
    }

    return parts.join("\n");
  }

  /**
   * Render area fill under lines.
   */
  private renderAreaFill(): string {
    const parts: string[] = [];

    this.series.forEach((series, seriesIndex) => {
      const points = this.dataPoints[seriesIndex];
      if (points.length < 2) return;

      const color = series.color || this.getDefaultColor(seriesIndex);
      const zeroY = this.valueToScreenY(0);

      // Build path
      let pathData = `M ${points[0].screenPosition.x} ${zeroY}`;
      pathData += ` L ${points[0].screenPosition.x} ${points[0].screenPosition.y}`;

      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].screenPosition.x} ${points[i].screenPosition.y}`;
      }

      pathData += ` L ${points[points.length - 1].screenPosition.x} ${zeroY}`;
      pathData += ` Z`;

      parts.push(
        `<path d="${pathData}" fill="${color}" opacity="0.2" />`
      );
    });

    return parts.join("\n");
  }

  /**
   * Render lines.
   */
  private renderLines(): string {
    const parts: string[] = [];

    this.series.forEach((series, seriesIndex) => {
      const points = this.dataPoints[seriesIndex];
      if (points.length < 2) return;

      const color = series.color || this.getDefaultColor(seriesIndex);
      const lineStyle = series.lineStyle || {};

      let pathData = `M ${points[0].screenPosition.x} ${points[0].screenPosition.y}`;

      if (this.smoothLines && points.length > 2) {
        // Smooth line using quadratic bezier curves
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1].screenPosition;
          const curr = points[i].screenPosition;
          
          if (i === points.length - 1) {
            pathData += ` L ${curr.x} ${curr.y}`;
          } else {
            const next = points[i + 1].screenPosition;
            const cpX = curr.x;
            const cpY = curr.y;
            const endX = (curr.x + next.x) / 2;
            const endY = (curr.y + next.y) / 2;
            pathData += ` Q ${cpX} ${cpY}, ${endX} ${endY}`;
          }
        }
      } else {
        // Straight lines
        for (let i = 1; i < points.length; i++) {
          pathData += ` L ${points[i].screenPosition.x} ${points[i].screenPosition.y}`;
        }
      }

      const styleAttrs = styleToSVGAttributes({
        stroke: color,
        strokeWidth: String(this.lineWidth),
        fill: "none",
        ...lineStyle,
      });

      parts.push(`<path d="${pathData}" ${styleAttrs} />`);
    });

    return parts.join("\n");
  }

  /**
   * Render data point markers.
   */
  private renderMarkers(): string {
    const parts: string[] = [];

    this.series.forEach((series, seriesIndex) => {
      if (series.showMarkers === false) return;

      const points = this.dataPoints[seriesIndex];
      const color = series.color || this.getDefaultColor(seriesIndex);
      const markerStyle = series.markerStyle || {};

      const styleAttrs = styleToSVGAttributes({
        fill: color,
        stroke: "#ffffff",
        strokeWidth: "2",
        ...markerStyle,
      });

      points.forEach((point) => {
        parts.push(
          `<circle cx="${point.screenPosition.x}" cy="${point.screenPosition.y}" r="${this.markerSize}" ${styleAttrs} />`
        );
      });
    });

    return parts.join("\n");
  }

  /**
   * Render remarkable point markers.
   */
  private renderRemarkablePointMarkers(): string {
    const parts: string[] = [];
    const styleAttrs = styleToSVGAttributes(this.remarkablePointStyle);

    // Only render remarkable points that have corresponding data points
    this.remarkablePoints
      .filter((p) => p.type !== "crossing") // Skip interpolated points for now
      .forEach((point) => {
        const dataPoint = this.dataPoints[point.seriesIndex]?.[point.dataIndex];
        if (!dataPoint) return;

        const pos = dataPoint.screenPosition;
        parts.push(
          `<circle cx="${pos.x}" cy="${pos.y}" r="${this.markerSize + 2}" ${styleAttrs} />`
        );
      });

    return parts.join("\n");
  }

  /**
   * Get default color for a series.
   */
  private getDefaultColor(seriesIndex: number): string {
    const colors = [
      "#2196f3", "#f44336", "#4caf50", "#ff9800", "#9c27b0",
      "#00bcd4", "#ffeb3b", "#795548", "#607d8b", "#e91e63"
    ];
    return colors[seriesIndex % colors.length];
  }
}

