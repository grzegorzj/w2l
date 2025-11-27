/**
 * RadarChart Component (also known as Spider Chart or Web Chart)
 *
 * A compound component for creating radar/spider charts with support for:
 * - Multiple data series overlaid on the same axes
 * - Customizable number of axes (3 or more)
 * - Position retrieval for data points
 * - Remarkable points (max values per axis)
 * - Customizable styling
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * A data series for the radar chart.
 */
export interface RadarSeries {
  /** Name of this series */
  name: string;
  /** Values for each axis (must match the number of axes) */
  data: number[];
  /** Optional color for this series */
  color?: string;
  /** Optional style for this series */
  style?: Partial<Style>;
  /** Whether to fill the area */
  filled?: boolean;
}

/**
 * Types of remarkable points in a radar chart.
 */
export type RadarChartRemarkablePointType =
  | "maximum" // Highest value on an axis
  | "minimum" // Lowest value on an axis
  | "peak"; // Highest point across all series

/**
 * A remarkable point in the radar chart.
 */
export interface RadarChartRemarkablePoint {
  /** Type of remarkable point */
  type: RadarChartRemarkablePointType;
  /** Axis index */
  axisIndex: number;
  /** Series index (if applicable) */
  seriesIndex?: number;
  /** Value at this point */
  value: number;
  /** Axis label */
  label: string;
  /** Description */
  description: string;
}

/**
 * Configuration for creating a RadarChart.
 */
export interface RadarChartConfig {
  /**
   * Axis labels (defines the number of axes).
   */
  axes: string[];

  /**
   * Data series to display.
   */
  series: RadarSeries[];

  /**
   * Width of the chart area in pixels.
   */
  width: number;

  /**
   * Height of the chart area in pixels.
   */
  height: number;

  /**
   * Maximum value for all axes.
   * If not provided, calculated from data.
   */
  maxValue?: number;

  /**
   * Minimum value for all axes.
   * @default 0
   */
  minValue?: number;

  /**
   * Number of grid levels to show.
   * @default 5
   */
  gridLevels?: number;

  /**
   * Whether to show grid lines.
   * @default true
   */
  showGrid?: boolean;

  /**
   * Whether to show axis lines.
   * @default true
   */
  showAxes?: boolean;

  /**
   * Whether to show axis labels.
   * @default true
   */
  showLabels?: boolean;

  /**
   * Whether to show value labels on grid levels.
   * @default false
   */
  showValueLabels?: boolean;

  /**
   * Whether to detect and store remarkable points.
   * @default true
   */
  detectRemarkablePoints?: boolean;

  /**
   * Background style for the chart area.
   */
  style?: Partial<Style>;

  /**
   * Box model configuration.
   */
  boxModel?: BoxModel;
}

/**
 * RadarChart component for creating spider/radar charts.
 */
export class RadarChart extends Rectangle {
  private axes: string[];
  private series: RadarSeries[];
  private minValue: number;
  private maxValue: number;
  private gridLevels: number;
  private showGrid: boolean;
  private showAxes: boolean;
  private showLabels: boolean;
  private showValueLabels: boolean;
  private detectRemarkablePoints: boolean;

  private remarkablePoints: RadarChartRemarkablePoint[] = [];
  private centerX: number;
  private centerY: number;
  private radius: number;

  constructor(config: RadarChartConfig) {
    const {
      width,
      height,
      style = {},
      boxModel,
      axes,
      series,
      minValue = 0,
      maxValue,
      gridLevels = 5,
      showGrid = true,
      showAxes = true,
      showLabels = true,
      showValueLabels = false,
      detectRemarkablePoints: detectRemarkable = true,
    } = config;

    // Validation
    if (axes.length < 3) {
      throw new Error("RadarChart: At least 3 axes are required");
    }
    for (const s of series) {
      if (s.data.length !== axes.length) {
        throw new Error(`RadarChart: Series "${s.name}" data length must match axes length`);
      }
    }

    // Create rectangle for the chart area
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

    this.axes = axes;
    this.series = series;
    this.minValue = minValue;
    this.gridLevels = gridLevels;
    this.showGrid = showGrid;
    this.showAxes = showAxes;
    this.showLabels = showLabels;
    this.showValueLabels = showValueLabels;
    this.detectRemarkablePoints = detectRemarkable;

    // Calculate center and radius
    const padding = 80; // Padding for labels
    this.centerX = width / 2;
    this.centerY = height / 2;
    this.radius = Math.min(width, height) / 2 - padding;

    // Determine value range
    const allValues = series.flatMap(s => s.data);
    const dataMax = Math.max(...allValues);
    this.maxValue = maxValue ?? dataMax * 1.1; // 10% padding

    // Detect remarkable points
    if (this.detectRemarkablePoints) {
      this.detectRemarkable();
    }
  }

  /**
   * Get the angle for a given axis (in radians).
   * 0 is at the top, increasing clockwise.
   */
  private getAxisAngle(axisIndex: number): number {
    return (Math.PI * 2 * axisIndex) / this.axes.length - Math.PI / 2;
  }

  /**
   * Get the position for a value on a specific axis.
   * Returns chart-relative coordinates.
   */
  private getAxisPosition(axisIndex: number, value: number): { x: number; y: number } {
    const angle = this.getAxisAngle(axisIndex);
    const normalizedValue = (value - this.minValue) / (this.maxValue - this.minValue);
    const distance = normalizedValue * this.radius;
    
    return {
      x: this.centerX + distance * Math.cos(angle),
      y: this.centerY + distance * Math.sin(angle),
    };
  }

  /**
   * Get the absolute position for a value on a specific axis.
   * Returns artboard coordinates.
   */
  public getDataPointPosition(seriesIndex: number, axisIndex: number): Position {
    const series = this.series[seriesIndex];
    if (!series) {
      throw new Error(`RadarChart: Series at index ${seriesIndex} does not exist`);
    }
    
    const value = series.data[axisIndex];
    if (value === undefined) {
      throw new Error(`RadarChart: No data for axis ${axisIndex} in series ${seriesIndex}`);
    }

    const pos = this.getAxisPosition(axisIndex, value);
    const absPos = this.getAbsolutePosition();

    return {
      x: absPos.x + pos.x,
      y: absPos.y + pos.y,
    };
  }

  /**
   * Get the center position of the chart in artboard coordinates.
   */
  public getCenterPosition(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.centerX,
      y: absPos.y + this.centerY,
    };
  }

  /**
   * Detect remarkable points (max/min values per axis).
   */
  private detectRemarkable(): void {
    this.remarkablePoints = [];

    // Find max and min for each axis across all series
    for (let axisIndex = 0; axisIndex < this.axes.length; axisIndex++) {
      const axisValues = this.series.map(s => s.data[axisIndex]);
      const maxValue = Math.max(...axisValues);
      const minValue = Math.min(...axisValues);
      const maxSeriesIndex = axisValues.indexOf(maxValue);
      const minSeriesIndex = axisValues.indexOf(minValue);

      this.remarkablePoints.push({
        type: "maximum",
        axisIndex,
        seriesIndex: maxSeriesIndex,
        value: maxValue,
        label: this.axes[axisIndex],
        description: `Maximum on ${this.axes[axisIndex]}: ${maxValue} (${this.series[maxSeriesIndex].name})`,
      });

      if (minValue !== maxValue) {
        this.remarkablePoints.push({
          type: "minimum",
          axisIndex,
          seriesIndex: minSeriesIndex,
          value: minValue,
          label: this.axes[axisIndex],
          description: `Minimum on ${this.axes[axisIndex]}: ${minValue} (${this.series[minSeriesIndex].name})`,
        });
      }
    }

    // Find overall peak value
    let peakValue = -Infinity;
    let peakSeriesIndex = 0;
    let peakAxisIndex = 0;

    for (let i = 0; i < this.series.length; i++) {
      for (let j = 0; j < this.series[i].data.length; j++) {
        if (this.series[i].data[j] > peakValue) {
          peakValue = this.series[i].data[j];
          peakSeriesIndex = i;
          peakAxisIndex = j;
        }
      }
    }

    this.remarkablePoints.push({
      type: "peak",
      axisIndex: peakAxisIndex,
      seriesIndex: peakSeriesIndex,
      value: peakValue,
      label: this.axes[peakAxisIndex],
      description: `Overall peak: ${peakValue} on ${this.axes[peakAxisIndex]} (${this.series[peakSeriesIndex].name})`,
    });
  }

  /**
   * Get all detected remarkable points.
   */
  public getRemarkablePoints(): RadarChartRemarkablePoint[] {
    return [...this.remarkablePoints];
  }

  /**
   * Render the radar chart.
   */
  public render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();

    // Create container group
    svg += `<g transform="translate(${Number(absPos.x).toFixed(2)}, ${Number(absPos.y).toFixed(2)})">\n`;

    // Background rectangle
    const attrs = styleToSVGAttributes(this._style);
    const size = this.getBoxSize("border");
    svg += `  <rect x="0" y="0" width="${size.width}" height="${size.height}" ${attrs} />\n`;

    // Render grid if enabled
    if (this.showGrid) {
      svg += this.renderGrid();
    }

    // Render axes if enabled
    if (this.showAxes) {
      svg += this.renderAxes();
    }

    // Render data series
    svg += this.renderSeries();

    // Render labels if enabled
    if (this.showLabels) {
      svg += this.renderLabels();
    }

    svg += `</g>\n`;

    return svg;
  }

  /**
   * Render the grid (concentric polygons).
   */
  private renderGrid(): string {
    const parts: string[] = [];
    const gridStyle = 'stroke="#e0e0e0" stroke-width="1" fill="none" opacity="0.5"';

    for (let level = 1; level <= this.gridLevels; level++) {
      const levelRadius = (level / this.gridLevels) * this.radius;
      const points: string[] = [];

      for (let i = 0; i < this.axes.length; i++) {
        const angle = this.getAxisAngle(i);
        const x = this.centerX + levelRadius * Math.cos(angle);
        const y = this.centerY + levelRadius * Math.sin(angle);
        points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
      }

      parts.push(`<polygon points="${points.join(" ")}" ${gridStyle} />`);

      // Add value labels if enabled
      if (this.showValueLabels) {
        const value = (level / this.gridLevels) * this.maxValue;
        const angle = this.getAxisAngle(0);
        const labelX = this.centerX + levelRadius * Math.cos(angle);
        const labelY = this.centerY + levelRadius * Math.sin(angle);
        parts.push(
          `<text x="${labelX}" y="${labelY - 5}" text-anchor="middle" font-size="9" fill="#999999">${value.toFixed(0)}</text>`
        );
      }
    }

    return parts.join("\n");
  }

  /**
   * Render the axes (lines from center to outer edge).
   */
  private renderAxes(): string {
    const parts: string[] = [];
    const axisStyle = 'stroke="#424242" stroke-width="1.5"';

    for (let i = 0; i < this.axes.length; i++) {
      const angle = this.getAxisAngle(i);
      const x = this.centerX + this.radius * Math.cos(angle);
      const y = this.centerY + this.radius * Math.sin(angle);
      
      parts.push(
        `<line x1="${this.centerX}" y1="${this.centerY}" x2="${x}" y2="${y}" ${axisStyle} />`
      );
    }

    return parts.join("\n");
  }

  /**
   * Render axis labels.
   */
  private renderLabels(): string {
    const parts: string[] = [];
    const labelDistance = this.radius + 30;

    for (let i = 0; i < this.axes.length; i++) {
      const angle = this.getAxisAngle(i);
      const x = this.centerX + labelDistance * Math.cos(angle);
      const y = this.centerY + labelDistance * Math.sin(angle);
      
      // Adjust text anchor based on position
      let textAnchor = "middle";
      if (Math.cos(angle) > 0.5) textAnchor = "start";
      else if (Math.cos(angle) < -0.5) textAnchor = "end";

      parts.push(
        `<text x="${x}" y="${y + 4}" text-anchor="${textAnchor}" font-size="12" font-weight="bold" fill="#424242">${this.axes[i]}</text>`
      );
    }

    return parts.join("\n");
  }

  /**
   * Render all data series.
   */
  private renderSeries(): string {
    const parts: string[] = [];
    const colorPalette = [
      "#2196f3", "#4caf50", "#ff9800", "#f44336",
      "#9c27b0", "#00bcd4", "#ffeb3b", "#795548"
    ];

    this.series.forEach((series, seriesIndex) => {
      const color = series.color ?? colorPalette[seriesIndex % colorPalette.length];
      const filled = series.filled ?? true;
      
      // Build polygon points
      const points: string[] = [];
      for (let i = 0; i < series.data.length; i++) {
        const pos = this.getAxisPosition(i, series.data[i]);
        points.push(`${pos.x.toFixed(2)},${pos.y.toFixed(2)}`);
      }

      // Render filled area
      if (filled) {
        const fillStyle = styleToSVGAttributes({
          fill: color,
          opacity: 0.3,
          stroke: "none",
          ...series.style,
        });
        parts.push(`<polygon points="${points.join(" ")}" ${fillStyle} />`);
      }

      // Render outline
      const strokeStyle = styleToSVGAttributes({
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        ...series.style,
      });
      parts.push(`<polygon points="${points.join(" ")}" ${strokeStyle} />`);

      // Render data points
      for (let i = 0; i < series.data.length; i++) {
        const pos = this.getAxisPosition(i, series.data[i]);
        const pointStyle = styleToSVGAttributes({
          fill: color,
          stroke: "#ffffff",
          strokeWidth: "2",
        });
        parts.push(`<circle cx="${pos.x}" cy="${pos.y}" r="4" ${pointStyle} />`);
      }
    });

    return parts.join("\n");
  }
}

