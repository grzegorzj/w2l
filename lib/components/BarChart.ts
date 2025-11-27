/**
 * BarChart Component
 *
 * A compound component for creating bar charts with support for:
 * - Vertical and horizontal orientations
 * - Data point highlighting and position retrieval
 * - Remarkable points (max, min, etc.)
 * - Customizable styling
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * A single data point in the bar chart.
 */
export interface BarDataPoint {
  /** Label for this data point */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional custom color for this bar */
  color?: string;
  /** Optional custom style for this bar */
  style?: Partial<Style>;
}

/**
 * Types of remarkable points in a bar chart.
 */
export type BarChartRemarkablePointType =
  | "maximum" // Highest value
  | "minimum" // Lowest value
  | "average" // Average value indicator
  | "median"; // Median value indicator

/**
 * A remarkable point in the bar chart.
 */
export interface BarChartRemarkablePoint {
  /** Type of remarkable point */
  type: BarChartRemarkablePointType;
  /** Index of the data point */
  index: number;
  /** Value at this point */
  value: number;
  /** Label of the data point */
  label: string;
  /** Description */
  description: string;
}

/**
 * Represents a single bar in the chart with position accessors.
 * Provides the same position API as other elements (topLeft, center, etc.).
 */
export class Bar {
  /** Index in the data array */
  public readonly index: number;
  /** Label */
  public readonly label: string;
  /** Value */
  public readonly value: number;
  
  private _bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  private _chart: BarChart;

  constructor(
    index: number,
    label: string,
    value: number,
    bounds: { x: number; y: number; width: number; height: number },
    chart: BarChart
  ) {
    this.index = index;
    this.label = label;
    this.value = value;
    this._bounds = bounds;
    this._chart = chart;
  }

  /**
   * Get the bar's bounds in chart-relative coordinates.
   */
  get bounds(): { x: number; y: number; width: number; height: number } {
    return { ...this._bounds };
  }

  /**
   * Position accessors - return absolute artboard coordinates.
   */

  /**
   * Get the chart's absolute position (used internally by position getters).
   */
  private getChartAbsolutePosition(): Position {
    return (this._chart as any).getAbsolutePosition();
  }

  get topLeft(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x,
      y: absPos.y + this._bounds.y,
    };
  }

  get topCenter(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width / 2,
      y: absPos.y + this._bounds.y,
    };
  }

  get topRight(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width,
      y: absPos.y + this._bounds.y,
    };
  }

  get centerLeft(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x,
      y: absPos.y + this._bounds.y + this._bounds.height / 2,
    };
  }

  get center(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width / 2,
      y: absPos.y + this._bounds.y + this._bounds.height / 2,
    };
  }

  get centerRight(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width,
      y: absPos.y + this._bounds.y + this._bounds.height / 2,
    };
  }

  get bottomLeft(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x,
      y: absPos.y + this._bounds.y + this._bounds.height,
    };
  }

  get bottomCenter(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width / 2,
      y: absPos.y + this._bounds.y + this._bounds.height,
    };
  }

  get bottomRight(): Position {
    const absPos = this.getChartAbsolutePosition();
    return {
      x: absPos.x + this._bounds.x + this._bounds.width,
      y: absPos.y + this._bounds.y + this._bounds.height,
    };
  }

  // Convenient aliases
  get top(): Position {
    return this.topCenter;
  }

  get bottom(): Position {
    return this.bottomCenter;
  }

  get left(): Position {
    return this.centerLeft;
  }

  get right(): Position {
    return this.centerRight;
  }
}

/**
 * Configuration for creating a BarChart.
 */
export interface BarChartConfig {
  /**
   * Data points to display.
   */
  data: BarDataPoint[];

  /**
   * Orientation of the bars.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";

  /**
   * Width of the chart area in pixels.
   */
  width: number;

  /**
   * Height of the chart area in pixels.
   */
  height: number;

  /**
   * Minimum value for the value axis.
   * If not provided, uses 0 or the minimum data value (whichever is lower).
   */
  minValue?: number;

  /**
   * Maximum value for the value axis.
   * If not provided, calculated from data with some padding.
   */
  maxValue?: number;

  /**
   * Spacing between bars as a fraction of bar width.
   * @default 0.2 (20% of bar width)
   */
  barSpacing?: number;

  /**
   * Padding around the chart area (for axes and labels).
   * @default { top: 20, right: 20, bottom: 40, left: 60 }
   */
  chartPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };

  /**
   * Default style for bars.
   */
  barStyle?: Partial<Style>;

  /**
   * Default color for bars.
   */
  barColor?: string;

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
   * Whether to show value labels on bars.
   * @default false
   */
  showValueLabels?: boolean;

  /**
   * Whether to show category labels.
   * @default true
   */
  showCategoryLabels?: boolean;

  /**
   * Number of grid lines to show on value axis.
   * @default 5
   */
  gridLineCount?: number;

  /**
   * Whether to detect and store remarkable points.
   * @default true
   */
  detectRemarkablePoints?: boolean;

  /**
   * Whether to automatically render remarkable points.
   * @default false
   */
  showRemarkablePoints?: boolean;

  /**
   * Style for remarkable point markers.
   */
  remarkablePointStyle?: Partial<Style>;

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
 * BarChart component for creating vertical or horizontal bar charts.
 */
export class BarChart extends Rectangle {
  private data: BarDataPoint[];
  private orientation: "vertical" | "horizontal";
  private minValue: number;
  private maxValue: number;
  private barSpacing: number;
  private chartPadding: Required<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
  private barStyle: Partial<Style>;
  private barColor: string;
  private showGrid: boolean;
  private showAxes: boolean;
  private showValueLabels: boolean;
  private showCategoryLabels: boolean;
  private gridLineCount: number;
  private detectRemarkablePoints: boolean;
  private showRemarkablePoints: boolean;
  private remarkablePointStyle: Partial<Style>;

  private bars: Bar[] = [];
  private remarkablePoints: BarChartRemarkablePoint[] = [];
  private plotAreaWidth: number;
  private plotAreaHeight: number;
  private plotAreaX: number;
  private plotAreaY: number;

  constructor(config: BarChartConfig) {
    const {
      width,
      height,
      style = {},
      boxModel,
      data,
      orientation = "vertical",
      minValue,
      maxValue,
      barSpacing = 0.2,
      chartPadding = {},
      barStyle = {},
      barColor = "#2196f3",
      showGrid = true,
      showAxes = true,
      showValueLabels = false,
      showCategoryLabels = true,
      gridLineCount = 5,
      detectRemarkablePoints: detectRemarkable = true,
      showRemarkablePoints: showRemarkable = false,
      remarkablePointStyle = {},
    } = config;

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

    this.data = data;
    this.orientation = orientation;
    this.barSpacing = barSpacing;
    this.chartPadding = {
      top: chartPadding.top ?? 20,
      right: chartPadding.right ?? 20,
      bottom: chartPadding.bottom ?? 40,
      left: chartPadding.left ?? 60,
    };
    this.barStyle = barStyle;
    this.barColor = barColor;
    this.showGrid = showGrid;
    this.showAxes = showAxes;
    this.showValueLabels = showValueLabels;
    this.showCategoryLabels = showCategoryLabels;
    this.gridLineCount = gridLineCount;
    this.detectRemarkablePoints = detectRemarkable;
    this.showRemarkablePoints = showRemarkable;
    this.remarkablePointStyle = {
      fill: "#ff5722",
      stroke: "#d84315",
      strokeWidth: "2",
      ...remarkablePointStyle,
    };

    // Calculate plot area dimensions
    this.plotAreaWidth = width - this.chartPadding.left - this.chartPadding.right;
    this.plotAreaHeight = height - this.chartPadding.top - this.chartPadding.bottom;
    this.plotAreaX = this.chartPadding.left;
    this.plotAreaY = this.chartPadding.top;

    // Determine value range
    const values = data.map((d) => d.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);

    this.minValue = minValue ?? Math.min(0, dataMin);
    this.maxValue =
      maxValue ?? dataMax + (dataMax - this.minValue) * 0.1; // 10% padding

    // Calculate bar positions
    this.calculateBars();

    // Detect remarkable points
    if (this.detectRemarkablePoints) {
      this.detectRemarkable();
    }
  }

  /**
   * Calculate positions and dimensions for all bars.
   */
  private calculateBars(): void {
    this.bars = [];
    const n = this.data.length;

    if (this.orientation === "vertical") {
      // Vertical bars: x-axis for categories, y-axis for values
      const totalSpacing = (n + 1) * this.barSpacing;
      const barWidth = this.plotAreaWidth / (n + totalSpacing);
      const spacing = barWidth * this.barSpacing;

      this.data.forEach((dataPoint, i) => {
        const x = this.plotAreaX + spacing + i * (barWidth + spacing);
        const normalizedValue =
          (dataPoint.value - this.minValue) / (this.maxValue - this.minValue);
        const barHeight = normalizedValue * this.plotAreaHeight;
        const y =
          this.plotAreaY + this.plotAreaHeight - barHeight;

        this.bars.push(
          new Bar(
            i,
            dataPoint.label,
            dataPoint.value,
            {
              x,
              y,
              width: barWidth,
              height: barHeight,
            },
            this
          )
        );
      });
    } else {
      // Horizontal bars: y-axis for categories, x-axis for values
      const totalSpacing = (n + 1) * this.barSpacing;
      const barHeight = this.plotAreaHeight / (n + totalSpacing);
      const spacing = barHeight * this.barSpacing;

      this.data.forEach((dataPoint, i) => {
        const y = this.plotAreaY + spacing + i * (barHeight + spacing);
        const normalizedValue =
          (dataPoint.value - this.minValue) / (this.maxValue - this.minValue);
        const barWidth = normalizedValue * this.plotAreaWidth;
        const x = this.plotAreaX;

        this.bars.push(
          new Bar(
            i,
            dataPoint.label,
            dataPoint.value,
            {
              x,
              y,
              width: barWidth,
              height: barHeight,
            },
            this
          )
        );
      });
    }
  }

  /**
   * Detect remarkable points (max, min, average, median).
   */
  private detectRemarkable(): void {
    this.remarkablePoints = [];
    const values = this.data.map((d) => d.value);

    // Find maximum
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    this.remarkablePoints.push({
      type: "maximum",
      index: maxIndex,
      value: maxValue,
      label: this.data[maxIndex].label,
      description: `Maximum: ${maxValue} at ${this.data[maxIndex].label}`,
    });

    // Find minimum
    const minValue = Math.min(...values);
    const minIndex = values.indexOf(minValue);
    if (minIndex !== maxIndex) {
      this.remarkablePoints.push({
        type: "minimum",
        index: minIndex,
        value: minValue,
        label: this.data[minIndex].label,
        description: `Minimum: ${minValue} at ${this.data[minIndex].label}`,
      });
    }

    // Calculate average
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    // Find closest to average
    const avgIndex = values.reduce(
      (closest, val, idx) =>
        Math.abs(val - average) < Math.abs(values[closest] - average)
          ? idx
          : closest,
      0
    );
    
    if (avgIndex !== maxIndex && avgIndex !== minIndex) {
      this.remarkablePoints.push({
        type: "average",
        index: avgIndex,
        value: values[avgIndex],
        label: this.data[avgIndex].label,
        description: `Closest to average (${average.toFixed(2)}): ${values[avgIndex]} at ${this.data[avgIndex].label}`,
      });
    }
  }

  /**
   * Get all bars.
   * Each bar has position accessors (topLeft, center, bottomRight, etc.).
   */
  public getBars(): Bar[] {
    return [...this.bars];
  }

  /**
   * Get a specific bar by index.
   * Returns undefined if the bar doesn't exist.
   */
  public getBar(index: number): Bar | undefined {
    return this.bars[index];
  }

  /**
   * Get all detected remarkable points.
   */
  public getRemarkablePoints(): BarChartRemarkablePoint[] {
    return [...this.remarkablePoints];
  }

  /**
   * Get absolute position of a remarkable point.
   * Returns the top center (for vertical) or right center (for horizontal) of the bar.
   */
  public getRemarkablePointPosition(
    point: BarChartRemarkablePoint
  ): Position {
    const bar = this.bars[point.index];
    if (!bar) {
      throw new Error(`Bar at index ${point.index} does not exist`);
    }
    // Return the "value point" - top for vertical bars, right for horizontal
    return this.orientation === "vertical" ? bar.topCenter : bar.centerRight;
  }

  /**
   * Render the bar chart.
   */
  public render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();
    const transform = this.getTransformAttribute();

    // Create container group with transform (like FunctionGraph does)
    svg += `<g transform="translate(${Number(absPos.x).toFixed(2)}, ${Number(absPos.y).toFixed(2)})">\n`;

    // Background rectangle (at 0,0 within the group)
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

    // Render bars
    svg += this.renderBars();

    // Render category labels if enabled
    if (this.showCategoryLabels) {
      svg += this.renderCategoryLabels();
    }

    // Render value labels if enabled
    if (this.showValueLabels) {
      svg += this.renderValueLabels();
    }

    // Render remarkable points if enabled
    if (this.showRemarkablePoints) {
      svg += this.renderRemarkablePoints();
    }

    svg += `</g>\n`;

    return svg;
  }

  /**
   * Render the grid lines.
   */
  private renderGrid(): string {
    const parts: string[] = [];
    const gridStyle = 'stroke="#e0e0e0" stroke-width="0.5" opacity="0.5"';

    if (this.orientation === "vertical") {
      // Horizontal grid lines for value axis
      for (let i = 0; i <= this.gridLineCount; i++) {
        const y =
          this.plotAreaY +
          this.plotAreaHeight -
          (i / this.gridLineCount) * this.plotAreaHeight;
        parts.push(
          `<line x1="${this.plotAreaX}" y1="${y}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${y}" ${gridStyle} />`
        );
      }
    } else {
      // Vertical grid lines for value axis
      for (let i = 0; i <= this.gridLineCount; i++) {
        const x =
          this.plotAreaX + (i / this.gridLineCount) * this.plotAreaWidth;
        parts.push(
          `<line x1="${x}" y1="${this.plotAreaY}" x2="${x}" y2="${this.plotAreaY + this.plotAreaHeight}" ${gridStyle} />`
        );
      }
    }

    return parts.join("\n");
  }

  /**
   * Render the axes.
   */
  private renderAxes(): string {
    const parts: string[] = [];
    const axisStyle = 'stroke="#424242" stroke-width="2"';

    if (this.orientation === "vertical") {
      // Y-axis (value axis)
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${this.plotAreaY}" x2="${this.plotAreaX}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisStyle} />`
      );
      // X-axis (category axis)
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${this.plotAreaY + this.plotAreaHeight}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisStyle} />`
      );

      // Value axis labels
      for (let i = 0; i <= this.gridLineCount; i++) {
        const value =
          this.minValue +
          (i / this.gridLineCount) * (this.maxValue - this.minValue);
        const y =
          this.plotAreaY +
          this.plotAreaHeight -
          (i / this.gridLineCount) * this.plotAreaHeight;
        parts.push(
          `<text x="${this.plotAreaX - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#616161">${value.toFixed(1)}</text>`
        );
      }
    } else {
      // X-axis (value axis)
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${this.plotAreaY + this.plotAreaHeight}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisStyle} />`
      );
      // Y-axis (category axis)
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${this.plotAreaY}" x2="${this.plotAreaX}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisStyle} />`
      );

      // Value axis labels
      for (let i = 0; i <= this.gridLineCount; i++) {
        const value =
          this.minValue +
          (i / this.gridLineCount) * (this.maxValue - this.minValue);
        const x =
          this.plotAreaX + (i / this.gridLineCount) * this.plotAreaWidth;
        parts.push(
          `<text x="${x}" y="${this.plotAreaY + this.plotAreaHeight + 20}" text-anchor="middle" font-size="11" fill="#616161">${value.toFixed(1)}</text>`
        );
      }
    }

    return parts.join("\n");
  }

  /**
   * Render all bars.
   */
  private renderBars(): string {
    const parts: string[] = [];

    this.bars.forEach((bar) => {
      const dataPoint = this.data[bar.index];
      const color = dataPoint.color ?? this.barColor;
      const style = dataPoint.style ?? this.barStyle;

      const styleAttrs = styleToSVGAttributes({
        fill: color,
        stroke: "#424242",
        strokeWidth: "1",
        ...style,
      });

      const bounds = bar.bounds;
      parts.push(
        `<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" ${styleAttrs} />`
      );
    });

    return parts.join("\n");
  }

  /**
   * Render category labels.
   */
  private renderCategoryLabels(): string {
    const parts: string[] = [];

    this.bars.forEach((bar) => {
      if (this.orientation === "vertical") {
        // Labels below x-axis
        const centerX = bar.bounds.x + bar.bounds.width / 2;
        parts.push(
          `<text x="${centerX}" y="${this.plotAreaY + this.plotAreaHeight + 20}" text-anchor="middle" font-size="12" fill="#424242">${bar.label}</text>`
        );
      } else {
        // Labels left of y-axis
        const centerY = bar.bounds.y + bar.bounds.height / 2;
        parts.push(
          `<text x="${this.plotAreaX - 10}" y="${centerY + 4}" text-anchor="end" font-size="12" fill="#424242">${bar.label}</text>`
        );
      }
    });

    return parts.join("\n");
  }

  /**
   * Render value labels on bars.
   */
  private renderValueLabels(): string {
    const parts: string[] = [];

    this.bars.forEach((bar) => {
      const valueStr = bar.value.toFixed(1);
      const bounds = bar.bounds;

      if (this.orientation === "vertical") {
        // Labels above bars
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y;
        parts.push(
          `<text x="${x}" y="${y - 5}" text-anchor="middle" font-size="10" font-weight="bold" fill="#424242">${valueStr}</text>`
        );
      } else {
        // Labels at end of bars
        const x = bounds.x + bounds.width;
        const y = bounds.y + bounds.height / 2;
        parts.push(
          `<text x="${x + 5}" y="${y + 4}" text-anchor="start" font-size="10" font-weight="bold" fill="#424242">${valueStr}</text>`
        );
      }
    });

    return parts.join("\n");
  }

  /**
   * Render remarkable point markers.
   */
  private renderRemarkablePoints(): string {
    const parts: string[] = [];
    const styleAttrs = styleToSVGAttributes(this.remarkablePointStyle);

    this.remarkablePoints.forEach((point) => {
      const bar = this.bars[point.index];
      if (!bar) return;

      // Draw a circle at the value point (top for vertical, right for horizontal)
      const bounds = bar.bounds;
      const x = this.orientation === "vertical" 
        ? bounds.x + bounds.width / 2 
        : bounds.x + bounds.width;
      const y = this.orientation === "vertical"
        ? bounds.y
        : bounds.y + bounds.height / 2;

      parts.push(
        `<circle cx="${x}" cy="${y}" r="5" ${styleAttrs} />`
      );
    });

    return parts.join("\n");
  }
}

