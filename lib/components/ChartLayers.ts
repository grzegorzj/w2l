/**
 * Chart Layers - Specific visualization implementations
 *
 * Layers implement different chart types (bar, line, area, scatter, etc.)
 * that can be mixed and composed within a Chart component.
 */

import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type ChartLayer, type ChartContext } from "./Chart.js";

/**
 * Data point for bar charts.
 */
export interface BarDataPoint {
  /** Category/label */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional custom color */
  color?: string;
  /** Optional custom style */
  style?: Partial<Style>;
}

/**
 * Configuration for BarLayer.
 */
export interface BarLayerConfig {
  /** Data points */
  data: BarDataPoint[];
  /** Orientation of bars */
  orientation?: "vertical" | "horizontal";
  /** Spacing between bars as fraction of bar width */
  barSpacing?: number;
  /** Default bar color */
  color?: string;
  /** Default bar style */
  style?: Partial<Style>;
  /** Layer ID */
  id?: string;
}

/**
 * BarLayer - Renders bar charts within a Chart component.
 */
export class BarLayer implements ChartLayer {
  public readonly id?: string;
  private data: BarDataPoint[];
  private orientation: "vertical" | "horizontal";
  private barSpacing: number;
  private color: string;
  private style: Partial<Style>;
  private cachedContext?: ChartContext;

  constructor(config: BarLayerConfig) {
    this.id = config.id;
    this.data = config.data;
    this.orientation = config.orientation || "vertical";
    this.barSpacing = config.barSpacing ?? 0.2;
    this.color = config.color || "#2196f3";
    this.style = config.style || {};
  }

  /**
   * Get the data point at a specific index.
   */
  public getDataPoint(index: number): BarDataPoint | undefined {
    return this.data[index];
  }

  /**
   * Get all data points.
   */
  public getAllDataPoints(): BarDataPoint[] {
    return [...this.data];
  }

  /**
   * Get the center position of a bar in data coordinates.
   * For vertical bars, returns the center X position and the top Y value.
   * For horizontal bars, returns the right X value and center Y position.
   */
  public getBarPosition(indexOrLabel: number | string, context: ChartContext): { x: number; y: number } | undefined {
    let index: number;
    
    if (typeof indexOrLabel === "string") {
      index = this.data.findIndex(d => d.label === indexOrLabel);
      if (index === -1) return undefined;
    } else {
      index = indexOrLabel;
      if (index < 0 || index >= this.data.length) return undefined;
    }

    const dataPoint = this.data[index];
    
    if (this.orientation === "vertical") {
      // Return center X of the bar and top Y value
      return {
        x: index + 0.5,  // Center of category
        y: dataPoint.value,
      };
    } else {
      // Return right X value and center Y of the bar
      return {
        x: dataPoint.value,
        y: index + 0.5,  // Center of category
      };
    }
  }

  /**
   * Get category labels (for categorical X/Y axis).
   */
  public getCategoryLabels(): string[] {
    return this.data.map(d => d.label);
  }

  /**
   * Whether this layer uses categorical X axis.
   */
  public hasCategoricalX(): boolean {
    return this.orientation === "vertical";
  }

  getDataBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    const values = this.data.map((d) => d.value);
    const minValue = Math.min(...values, 0);
    const maxValue = Math.max(...values);

    if (this.orientation === "vertical") {
      return {
        minX: 0,
        maxX: this.data.length,
        minY: minValue,
        maxY: maxValue,
      };
    } else {
      return {
        minX: minValue,
        maxX: maxValue,
        minY: 0,
        maxY: this.data.length,
      };
    }
  }

  render(context: ChartContext): string {
    this.cachedContext = context;
    const parts: string[] = [];
    const n = this.data.length;

    if (this.orientation === "vertical") {
      // Vertical bars
      const totalSpacing = (n + 1) * this.barSpacing;
      const categoryWidth = context.plotArea.width / n;
      const barWidth = categoryWidth * (1 - this.barSpacing);
      const spacing = categoryWidth * this.barSpacing / 2;

      this.data.forEach((dataPoint, i) => {
        const centerX = context.valueToScreenX(i + 0.5);
        const x = centerX - barWidth / 2;
        const barHeight = Math.abs(
          context.valueToScreenY(dataPoint.value) - context.valueToScreenY(0)
        );
        const y = Math.min(
          context.valueToScreenY(dataPoint.value),
          context.valueToScreenY(0)
        );

        const color = dataPoint.color || this.color;
        const styleAttrs = styleToSVGAttributes({
          fill: color,
          stroke: "#424242",
          strokeWidth: "1",
          ...this.style,
          ...dataPoint.style,
        });

        parts.push(
          `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" ${styleAttrs} />`
        );
      });
    } else {
      // Horizontal bars
      const categoryHeight = context.plotArea.height / n;
      const barHeight = categoryHeight * (1 - this.barSpacing);

      this.data.forEach((dataPoint, i) => {
        const centerY = context.valueToScreenY(i + 0.5);
        const y = centerY - barHeight / 2;
        const barWidth = Math.abs(
          context.valueToScreenX(dataPoint.value) - context.valueToScreenX(0)
        );
        const x = Math.min(
          context.valueToScreenX(dataPoint.value),
          context.valueToScreenX(0)
        );

        const color = dataPoint.color || this.color;
        const styleAttrs = styleToSVGAttributes({
          fill: color,
          stroke: "#424242",
          strokeWidth: "1",
          ...this.style,
          ...dataPoint.style,
        });

        parts.push(
          `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" ${styleAttrs} />`
        );
      });
    }

    return parts.join("\n");
  }
}

/**
 * Data point for line/area charts.
 */
export interface LineDataPoint {
  /** X value */
  x: number;
  /** Y value */
  y: number;
  /** Optional label */
  label?: string;
}

/**
 * Configuration for LineLayer.
 */
export interface LineLayerConfig {
  /** Data points */
  data: LineDataPoint[];
  /** Line color */
  color?: string;
  /** Line style */
  lineStyle?: Partial<Style>;
  /** Whether to show markers on data points */
  showMarkers?: boolean;
  /** Marker size */
  markerSize?: number;
  /** Marker style */
  markerStyle?: Partial<Style>;
  /** Line width */
  lineWidth?: number;
  /** Layer ID */
  id?: string;
}

/**
 * LineLayer - Renders line charts within a Chart component.
 */
export class LineLayer implements ChartLayer {
  public readonly id?: string;
  private data: LineDataPoint[];
  private color: string;
  private lineStyle: Partial<Style>;
  private showMarkers: boolean;
  private markerSize: number;
  private markerStyle: Partial<Style>;
  private lineWidth: number;

  constructor(config: LineLayerConfig) {
    this.id = config.id;
    this.data = config.data;
    this.color = config.color || "#2196f3";
    this.lineStyle = config.lineStyle || {};
    this.showMarkers = config.showMarkers ?? true;
    this.markerSize = config.markerSize ?? 6;
    this.markerStyle = config.markerStyle || {};
    this.lineWidth = config.lineWidth ?? 2;
  }

  getDataBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    const xValues = this.data.map((d) => d.x);
    const yValues = this.data.map((d) => d.y);

    return {
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
      minY: Math.min(...yValues),
      maxY: Math.max(...yValues),
    };
  }

  render(context: ChartContext): string {
    if (this.data.length === 0) return "";

    const parts: string[] = [];

    // Build line path
    const points = this.data.map((d) => ({
      x: context.valueToScreenX(d.x),
      y: context.valueToScreenY(d.y),
    }));

    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    // Render line
    const lineStyleAttrs = styleToSVGAttributes({
      stroke: this.color,
      strokeWidth: String(this.lineWidth),
      fill: "none",
      ...this.lineStyle,
    });

    parts.push(`<path d="${pathData}" ${lineStyleAttrs} />`);

    // Render markers
    if (this.showMarkers) {
      const markerStyleAttrs = styleToSVGAttributes({
        fill: this.color,
        stroke: "#ffffff",
        strokeWidth: "2",
        ...this.markerStyle,
      });

      points.forEach((point) => {
        parts.push(
          `<circle cx="${point.x}" cy="${point.y}" r="${this.markerSize}" ${markerStyleAttrs} />`
        );
      });
    }

    return parts.join("\n");
  }
}

/**
 * Configuration for AreaLayer.
 */
export interface AreaLayerConfig {
  /** Data points */
  data: LineDataPoint[];
  /** Fill color */
  color?: string;
  /** Area style */
  style?: Partial<Style>;
  /** Whether to show the top line */
  showLine?: boolean;
  /** Line style (if showLine is true) */
  lineStyle?: Partial<Style>;
  /** Line width */
  lineWidth?: number;
  /** Layer ID */
  id?: string;
}

/**
 * AreaLayer - Renders area charts (filled regions under a line).
 */
export class AreaLayer implements ChartLayer {
  public readonly id?: string;
  private data: LineDataPoint[];
  private color: string;
  private style: Partial<Style>;
  private showLine: boolean;
  private lineStyle: Partial<Style>;
  private lineWidth: number;

  constructor(config: AreaLayerConfig) {
    this.id = config.id;
    this.data = config.data;
    this.color = config.color || "#2196f3";
    this.style = config.style || {};
    this.showLine = config.showLine ?? true;
    this.lineStyle = config.lineStyle || {};
    this.lineWidth = config.lineWidth ?? 2;
  }

  getDataBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    const xValues = this.data.map((d) => d.x);
    const yValues = this.data.map((d) => d.y);

    return {
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
      minY: Math.min(...yValues, 0),
      maxY: Math.max(...yValues),
    };
  }

  render(context: ChartContext): string {
    if (this.data.length < 2) return "";

    const parts: string[] = [];
    const zeroY = context.valueToScreenY(0);

    // Build area path
    const points = this.data.map((d) => ({
      x: context.valueToScreenX(d.x),
      y: context.valueToScreenY(d.y),
    }));

    let pathData = `M ${points[0].x} ${zeroY}`;
    pathData += ` L ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }
    pathData += ` L ${points[points.length - 1].x} ${zeroY}`;
    pathData += ` Z`;

    // Render filled area
    const areaStyleAttrs = styleToSVGAttributes({
      fill: this.color,
      fillOpacity: "0.3",
      stroke: "none",
      ...this.style,
    });

    parts.push(`<path d="${pathData}" ${areaStyleAttrs} />`);

    // Render top line if requested
    if (this.showLine) {
      let linePathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        linePathData += ` L ${points[i].x} ${points[i].y}`;
      }

      const lineStyleAttrs = styleToSVGAttributes({
        stroke: this.color,
        strokeWidth: String(this.lineWidth),
        fill: "none",
        ...this.lineStyle,
      });

      parts.push(`<path d="${linePathData}" ${lineStyleAttrs} />`);
    }

    return parts.join("\n");
  }
}

/**
 * Configuration for ScatterLayer.
 */
export interface ScatterLayerConfig {
  /** Data points */
  data: LineDataPoint[];
  /** Point color */
  color?: string;
  /** Point size */
  pointSize?: number;
  /** Point style */
  style?: Partial<Style>;
  /** Layer ID */
  id?: string;
}

/**
 * ScatterLayer - Renders scatter plots.
 */
export class ScatterLayer implements ChartLayer {
  public readonly id?: string;
  private data: LineDataPoint[];
  private color: string;
  private pointSize: number;
  private style: Partial<Style>;

  constructor(config: ScatterLayerConfig) {
    this.id = config.id;
    this.data = config.data;
    this.color = config.color || "#2196f3";
    this.pointSize = config.pointSize ?? 6;
    this.style = config.style || {};
  }

  getDataBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    const xValues = this.data.map((d) => d.x);
    const yValues = this.data.map((d) => d.y);

    return {
      minX: Math.min(...xValues),
      maxX: Math.max(...xValues),
      minY: Math.min(...yValues),
      maxY: Math.max(...yValues),
    };
  }

  render(context: ChartContext): string {
    const parts: string[] = [];

    const styleAttrs = styleToSVGAttributes({
      fill: this.color,
      stroke: "#ffffff",
      strokeWidth: "2",
      ...this.style,
    });

    this.data.forEach((point) => {
      const x = context.valueToScreenX(point.x);
      const y = context.valueToScreenY(point.y);
      parts.push(
        `<circle cx="${x}" cy="${y}" r="${this.pointSize}" ${styleAttrs} />`
      );
    });

    return parts.join("\n");
  }
}

