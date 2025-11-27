/**
 * Chart Component - Unified chart system with composable layers
 *
 * A flexible charting component that supports multiple visualization types
 * through a layer-based architecture. Layers (bar, line, area, scatter, etc.)
 * can be mixed and matched, sharing a common coordinate system and axes.
 *
 * Benefits:
 * - Mix chart types (bar + line, area + scatter, etc.)
 * - Shared axes, grid, and coordinate transformation
 * - DRY: Common infrastructure written once
 * - Extensible: Easy to add new layer types
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * Chart context passed to layers for rendering.
 * Provides coordinate transformation and plot area information.
 */
export interface ChartContext {
  /** Convert data X value to screen X coordinate (relative to chart) */
  valueToScreenX: (x: number) => number;
  /** Convert data Y value to screen Y coordinate (relative to chart) */
  valueToScreenY: (y: number) => number;
  /** Convert screen X coordinate back to data value */
  screenToValueX: (x: number) => number;
  /** Convert screen Y coordinate back to data value */
  screenToValueY: (y: number) => number;
  /** Plot area bounds */
  plotArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Data range */
  dataRange: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  /** Parent chart instance (for accessing methods like getAbsolutePosition) */
  chart: Chart;
}

/**
 * Base interface for all chart layers.
 * Layers implement specific visualization types (bar, line, scatter, etc.)
 */
export interface ChartLayer {
  /** Unique identifier for this layer */
  id?: string;
  /** Render this layer to SVG */
  render(context: ChartContext): string;
  /** Get data bounds for this layer (used to calculate overall range) */
  getDataBounds(): { minX: number; maxX: number; minY: number; maxY: number };
  /** Get remarkable points from this layer (optional) */
  getRemarkablePoints?(): any[];
  /** Get categorical labels for X axis (optional, for bar charts with categories) */
  getCategoryLabels?(): string[];
  /** Whether this layer uses categorical X axis */
  hasCategoricalX?(): boolean;
}

/**
 * Configuration for the unified Chart component.
 */
export interface ChartConfig {
  /** Layers to render (bar, line, area, scatter, etc.) */
  layers: ChartLayer[];

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

  /** Title for the chart */
  title?: string;

  /** X-axis label */
  xAxisLabel?: string;

  /** Y-axis label */
  yAxisLabel?: string;

  /** Style for grid lines */
  gridStyle?: Partial<Style>;

  /** Style for axes */
  axisStyle?: Partial<Style>;

  /** Style for axis labels */
  labelStyle?: Partial<Style>;

  /** Box model configuration */
  boxModel?: BoxModel;

  /** Overall chart style */
  style?: Partial<Style>;
}

/**
 * Chart - Unified charting component with composable layers.
 *
 * Provides shared infrastructure (axes, grid, coordinate system) that
 * all layers use. Layers implement specific visualization types.
 *
 * @example
 * ```typescript
 * const chart = new Chart({
 *   width: 600,
 *   height: 400,
 *   layers: [
 *     new BarLayer({ data: salesData }),
 *     new LineLayer({ data: targetData, color: 'red' })
 *   ]
 * });
 * ```
 */
export class Chart extends Rectangle {
  private layers: ChartLayer[];
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
  private title?: string;
  private xAxisLabel?: string;
  private yAxisLabel?: string;
  private gridStyle: Partial<Style>;
  private axisStyle: Partial<Style>;
  private labelStyle: Partial<Style>;

  private plotAreaWidth: number;
  private plotAreaHeight: number;
  private plotAreaX: number;
  private plotAreaY: number;

  constructor(config: ChartConfig) {
    const {
      width,
      height,
      layers,
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
      title,
      xAxisLabel,
      yAxisLabel,
      gridStyle = {},
      axisStyle = {},
      labelStyle = {},
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

    this.layers = layers;
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
    this.title = title;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
    this.gridStyle = {
      stroke: "#e0e0e0",
      strokeWidth: "0.5",
      opacity: "0.5",
      ...gridStyle,
    };
    this.axisStyle = {
      stroke: "#424242",
      strokeWidth: "2",
      ...axisStyle,
    };
    this.labelStyle = {
      fill: "#616161",
      fontSize: "11",
      ...labelStyle,
    };

    // Calculate plot area
    this.plotAreaWidth = width - this.chartPadding.left - this.chartPadding.right;
    this.plotAreaHeight = height - this.chartPadding.top - this.chartPadding.bottom;
    this.plotAreaX = this.chartPadding.left;
    this.plotAreaY = this.chartPadding.top;

    // Calculate data range from all layers
    const bounds = this.calculateDataBounds();
    this.minX = minX ?? bounds.minX;
    this.maxX = maxX ?? bounds.maxX;
    this.minY = minY ?? bounds.minY;
    this.maxY = maxY ?? bounds.maxY;
  }

  /**
   * Calculate the overall data bounds from all layers.
   */
  private calculateDataBounds(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    if (this.layers.length === 0) {
      return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    this.layers.forEach((layer) => {
      const bounds = layer.getDataBounds();
      minX = Math.min(minX, bounds.minX);
      maxX = Math.max(maxX, bounds.maxX);
      minY = Math.min(minY, bounds.minY);
      maxY = Math.max(maxY, bounds.maxY);
    });

    // Add 10% padding to Y range
    const yPadding = (maxY - minY) * 0.1;
    minY = Math.min(0, minY - yPadding);
    maxY = maxY + yPadding;

    return { minX, maxX, minY, maxY };
  }

  /**
   * Convert data X value to screen X coordinate (relative to chart).
   */
  private valueToScreenX(x: number): number {
    const normalized = (x - this.minX) / (this.maxX - this.minX);
    return this.plotAreaX + normalized * this.plotAreaWidth;
  }

  /**
   * Convert data Y value to screen Y coordinate (relative to chart).
   */
  private valueToScreenY(y: number): number {
    const normalized = (y - this.minY) / (this.maxY - this.minY);
    return this.plotAreaY + this.plotAreaHeight - normalized * this.plotAreaHeight;
  }

  /**
   * Convert screen X coordinate back to data value.
   */
  private screenToValueX(screenX: number): number {
    const normalized = (screenX - this.plotAreaX) / this.plotAreaWidth;
    return this.minX + normalized * (this.maxX - this.minX);
  }

  /**
   * Convert screen Y coordinate back to data value.
   */
  private screenToValueY(screenY: number): number {
    const normalized = (this.plotAreaY + this.plotAreaHeight - screenY) / this.plotAreaHeight;
    return this.minY + normalized * (this.maxY - this.minY);
  }

  /**
   * Get the chart context for layers.
   */
  private getChartContext(): ChartContext {
    return {
      valueToScreenX: this.valueToScreenX.bind(this),
      valueToScreenY: this.valueToScreenY.bind(this),
      screenToValueX: this.screenToValueX.bind(this),
      screenToValueY: this.screenToValueY.bind(this),
      plotArea: {
        x: this.plotAreaX,
        y: this.plotAreaY,
        width: this.plotAreaWidth,
        height: this.plotAreaHeight,
      },
      dataRange: {
        minX: this.minX,
        maxX: this.maxX,
        minY: this.minY,
        maxY: this.maxY,
      },
      chart: this,
    };
  }

  /**
   * Convert data coordinates to absolute artboard position.
   * This allows external elements to be positioned relative to data points.
   */
  public dataToAbsolutePosition(x: number, y: number): Position {
    const screenX = this.valueToScreenX(x);
    const screenY = this.valueToScreenY(y);
    const chartPos = this.getAbsolutePosition();
    return {
      x: chartPos.x + screenX,
      y: chartPos.y + screenY,
    };
  }

  /**
   * Get a specific layer by index or ID.
   */
  public getLayer(indexOrId: number | string): ChartLayer | undefined {
    if (typeof indexOrId === "number") {
      return this.layers[indexOrId];
    }
    return this.layers.find((layer) => layer.id === indexOrId);
  }

  /**
   * Get all layers.
   */
  public getLayers(): ChartLayer[] {
    return [...this.layers];
  }

  /**
   * Get the position of a categorical label (for bar charts).
   * Returns the center position of that category in absolute coordinates.
   * 
   * @param categoryIndexOrLabel - Index or label of the category
   * @returns Absolute position of the category center, or undefined if not found
   */
  public getCategoryPosition(categoryIndexOrLabel: number | string): Position | undefined {
    // Find a BarLayer to get category info
    const barLayer = this.layers.find(layer => 
      layer.constructor.name === 'BarLayer'
    ) as any;
    
    if (!barLayer) {
      return undefined;
    }

    let categoryIndex: number;
    
    if (typeof categoryIndexOrLabel === 'string') {
      // Find by label
      const allData = barLayer.getAllDataPoints?.();
      if (!allData) return undefined;
      
      categoryIndex = allData.findIndex((d: any) => d.label === categoryIndexOrLabel);
      if (categoryIndex === -1) return undefined;
    } else {
      categoryIndex = categoryIndexOrLabel;
    }

    // Get the data point to check orientation
    const dataPoint = barLayer.getDataPoint?.(categoryIndex);
    if (!dataPoint) return undefined;

    // For categorical data, the center is at index + 0.5
    // Return the center of the category at the value
    return this.dataToAbsolutePosition(categoryIndex + 0.5, dataPoint.value);
  }

  /**
   * Render grid lines.
   */
  private renderGrid(): string {
    const parts: string[] = [];
    const gridAttrs = styleToSVGAttributes(this.gridStyle);

    // Vertical grid lines
    for (let i = 0; i <= this.xGridLineCount; i++) {
      const x = this.plotAreaX + (i / this.xGridLineCount) * this.plotAreaWidth;
      parts.push(
        `<line x1="${x}" y1="${this.plotAreaY}" x2="${x}" y2="${this.plotAreaY + this.plotAreaHeight}" ${gridAttrs} />`
      );
    }

    // Horizontal grid lines
    for (let i = 0; i <= this.yGridLineCount; i++) {
      const y = this.plotAreaY + this.plotAreaHeight - (i / this.yGridLineCount) * this.plotAreaHeight;
      parts.push(
        `<line x1="${this.plotAreaX}" y1="${y}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${y}" ${gridAttrs} />`
      );
    }

    return parts.join("\n");
  }

  /**
   * Render axes and labels.
   */
  private renderAxes(): string {
    const parts: string[] = [];
    const axisAttrs = styleToSVGAttributes(this.axisStyle);
    const labelAttrs = styleToSVGAttributes(this.labelStyle);

    // Check if we have categorical X axis
    const categoricalLayer = this.layers.find(layer => layer.hasCategoricalX?.());
    const categoryLabels = categoricalLayer?.getCategoryLabels?.() || [];
    const hasCategoricalX = categoryLabels.length > 0;

    // X-axis (at y=0 if in range, otherwise at bottom)
    const xAxisY = this.minY <= 0 && this.maxY >= 0
      ? this.valueToScreenY(0)
      : this.plotAreaY + this.plotAreaHeight;

    parts.push(
      `<line x1="${this.plotAreaX}" y1="${xAxisY}" x2="${this.plotAreaX + this.plotAreaWidth}" y2="${xAxisY}" ${axisAttrs} />`
    );

    // Y-axis (at x=0 if in range, otherwise at left)
    const yAxisX = this.minX <= 0 && this.maxX >= 0
      ? this.valueToScreenX(0)
      : this.plotAreaX;

    parts.push(
      `<line x1="${yAxisX}" y1="${this.plotAreaY}" x2="${yAxisX}" y2="${this.plotAreaY + this.plotAreaHeight}" ${axisAttrs} />`
    );

    // Axis labels
    if (this.showAxisLabels) {
      // X-axis labels (categorical or numeric)
      if (hasCategoricalX) {
        // Render category labels centered under each bar
        categoryLabels.forEach((label, i) => {
          const x = this.valueToScreenX(i + 0.5); // Center of category
          const y = this.plotAreaY + this.plotAreaHeight + 20;
          parts.push(
            `<text x="${x}" y="${y}" text-anchor="middle" ${labelAttrs}>${label}</text>`
          );
        });
      } else {
        // Render numeric labels
        for (let i = 0; i <= this.xGridLineCount; i++) {
          const value = this.minX + (i / this.xGridLineCount) * (this.maxX - this.minX);
          const x = this.plotAreaX + (i / this.xGridLineCount) * this.plotAreaWidth;
          const y = this.plotAreaY + this.plotAreaHeight + 20;
          parts.push(
            `<text x="${x}" y="${y}" text-anchor="middle" ${labelAttrs}>${value.toFixed(1)}</text>`
          );
        }
      }

      // Y-axis labels (always numeric)
      for (let i = 0; i <= this.yGridLineCount; i++) {
        const value = this.minY + (i / this.yGridLineCount) * (this.maxY - this.minY);
        const x = this.plotAreaX - 10;
        const y = this.plotAreaY + this.plotAreaHeight - (i / this.yGridLineCount) * this.plotAreaHeight + 4;
        parts.push(
          `<text x="${x}" y="${y}" text-anchor="end" ${labelAttrs}>${value.toFixed(1)}</text>`
        );
      }

      // X-axis label
      if (this.xAxisLabel) {
        const x = this.plotAreaX + this.plotAreaWidth / 2;
        const y = this.plotAreaY + this.plotAreaHeight + 35;
        parts.push(
          `<text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="bold" fill="#424242">${this.xAxisLabel}</text>`
        );
      }

      // Y-axis label
      if (this.yAxisLabel) {
        const x = 15;
        const y = this.plotAreaY + this.plotAreaHeight / 2;
        parts.push(
          `<text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="bold" fill="#424242" transform="rotate(-90 ${x} ${y})">${this.yAxisLabel}</text>`
        );
      }
    }

    return parts.join("\n");
  }

  /**
   * Render the chart.
   */
  public render(): string {
    let svg = "";
    const absPos = this.getAbsolutePosition();

    svg += `<g transform="translate(${Number(absPos.x).toFixed(2)}, ${Number(absPos.y).toFixed(2)})">\n`;

    // Background
    const attrs = styleToSVGAttributes(this._style);
    const size = this.getBoxSize("border");
    svg += `  <rect x="0" y="0" width="${size.width}" height="${size.height}" ${attrs} />\n`;

    // Title
    if (this.title) {
      const titleX = this.plotAreaX + this.plotAreaWidth / 2;
      svg += `  <text x="${titleX}" y="15" text-anchor="middle" font-size="16" font-weight="bold" fill="#424242">${this.title}</text>\n`;
    }

    // Grid
    if (this.showGrid) {
      svg += this.renderGrid();
    }

    // Axes
    if (this.showAxes) {
      svg += this.renderAxes();
    }

    // Layers
    const context = this.getChartContext();
    this.layers.forEach((layer) => {
      svg += layer.render(context);
    });

    svg += `</g>\n`;

    return svg;
  }
}

