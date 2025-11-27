/**
 * DonutChart Component
 *
 * A compound component for creating donut and pie charts with support for:
 * - Customizable inner radius (0 for pie chart, >0 for donut)
 * - Data point highlighting and position retrieval
 * - Remarkable points (max, min, etc.)
 * - Percentage labels and values
 * - Customizable styling
 */

import { Rectangle } from "../core/Rectangle.js";
import { type Position } from "../core/Element.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * A single data point in the donut chart.
 */
export interface DonutDataPoint {
  /** Label for this data point */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional custom color for this slice */
  color?: string;
  /** Optional custom style for this slice */
  style?: Partial<Style>;
}

/**
 * Types of remarkable points in a donut chart.
 */
export type DonutChartRemarkablePointType =
  | "maximum" // Largest slice
  | "minimum" // Smallest slice
  | "majority" // Slice that's >50%
  | "average"; // Average value indicator

/**
 * A remarkable point in the donut chart.
 */
export interface DonutChartRemarkablePoint {
  /** Type of remarkable point */
  type: DonutChartRemarkablePointType;
  /** Index of the data point */
  index: number;
  /** Value at this point */
  value: number;
  /** Percentage of total */
  percentage: number;
  /** Label of the data point */
  label: string;
  /** Description */
  description: string;
}

/**
 * Represents a single slice in the chart with position accessors.
 * Provides position API for the slice center, midpoint, and edges.
 */
export class DonutSlice {
  /** Index in the data array */
  public readonly index: number;
  /** Label */
  public readonly label: string;
  /** Value */
  public readonly value: number;
  /** Percentage of total */
  public readonly percentage: number;
  /** Start angle in radians */
  public readonly startAngle: number;
  /** End angle in radians */
  public readonly endAngle: number;
  
  private _centerX: number;
  private _centerY: number;
  private _outerRadius: number;
  private _innerRadius: number;
  private _chart: DonutChart;

  constructor(
    index: number,
    label: string,
    value: number,
    percentage: number,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number,
    outerRadius: number,
    innerRadius: number,
    chart: DonutChart
  ) {
    this.index = index;
    this.label = label;
    this.value = value;
    this.percentage = percentage;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this._centerX = centerX;
    this._centerY = centerY;
    this._outerRadius = outerRadius;
    this._innerRadius = innerRadius;
    this._chart = chart;
  }

  /**
   * Get the angle at the middle of this slice.
   */
  get midAngle(): number {
    return (this.startAngle + this.endAngle) / 2;
  }

  /**
   * Position accessors - return absolute artboard coordinates.
   */

  /** Center of the donut/pie chart */
  get center(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    return {
      x: chartPos.x + this._centerX,
      y: chartPos.y + this._centerY,
    };
  }

  /** Midpoint of the slice at the outer edge */
  get outerMidpoint(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    const angle = this.midAngle;
    return {
      x: chartPos.x + this._centerX + this._outerRadius * Math.cos(angle),
      y: chartPos.y + this._centerY + this._outerRadius * Math.sin(angle),
    };
  }

  /** Midpoint of the slice at the inner edge */
  get innerMidpoint(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    const angle = this.midAngle;
    return {
      x: chartPos.x + this._centerX + this._innerRadius * Math.cos(angle),
      y: chartPos.y + this._centerY + this._innerRadius * Math.sin(angle),
    };
  }

  /** Midpoint of the slice between inner and outer radius (for labels) */
  get labelPosition(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    const angle = this.midAngle;
    const radius = (this._outerRadius + this._innerRadius) / 2;
    return {
      x: chartPos.x + this._centerX + radius * Math.cos(angle),
      y: chartPos.y + this._centerY + radius * Math.sin(angle),
    };
  }

  /** Position just outside the slice for external labels */
  get externalLabelPosition(): Position {
    const chartPos = (this._chart as any).getAbsolutePosition();
    const angle = this.midAngle;
    const offset = 20; // pixels outside the outer edge
    return {
      x: chartPos.x + this._centerX + (this._outerRadius + offset) * Math.cos(angle),
      y: chartPos.y + this._centerY + (this._outerRadius + offset) * Math.sin(angle),
    };
  }
}

/**
 * Configuration for a DonutChart.
 */
export interface DonutChartConfig {
  /** Data points to display */
  data: DonutDataPoint[];
  
  /** Width of the chart */
  width: number;
  
  /** Height of the chart */
  height: number;
  
  /** Inner radius (0 for pie chart, >0 for donut). Can be absolute or percentage of outer radius */
  innerRadius?: number | string; // e.g., 0, 50, "50%"
  
  /** Default colors for slices (cycles through if more data points than colors) */
  colors?: string[];
  
  /** Whether to show percentage labels on slices */
  showLabels?: boolean;
  
  /** Whether to show legend */
  showLegend?: boolean;
  
  /** Starting angle in degrees (0 = right, 90 = top, etc.) */
  startAngle?: number;
  
  /** Style for the slices */
  sliceStyle?: Partial<Style>;
  
  /** Style for the labels */
  labelStyle?: Partial<Style>;
  
  /** Whether to automatically detect and track remarkable points */
  detectRemarkablePoints?: boolean;
  
  /** Corner radius for rounded slice corners (0 = sharp corners) */
  cornerRadius?: number;
  
  /** Box model configuration */
  boxModel?: BoxModel;
  
  /** Overall style */
  style?: Partial<Style>;
}

/**
 * DonutChart - A compound component for rendering donut/pie charts.
 * 
 * Extends Rectangle, so it can be positioned like any other element.
 * Provides methods to:
 * - Get positions of individual slices
 * - Access remarkable points (max, min, etc.)
 * - Retrieve slice data for highlighting
 */
export class DonutChart extends Rectangle {
  private config: Required<Omit<DonutChartConfig, "boxModel" | "style" | "innerRadius" | "cornerRadius">> & {
    innerRadius: number | string;
    cornerRadius: number;
  };
  private slices: DonutSlice[] = [];
  private remarkablePoints: DonutChartRemarkablePoint[] = [];
  private total: number = 0;

  constructor(config: DonutChartConfig) {
    const {
      width,
      height,
      boxModel,
      style,
      data,
      innerRadius = "50%",
      colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF9F40"
      ],
      showLabels = false,
      showLegend = false,
      startAngle = -90, // Start at top
      sliceStyle = {},
      labelStyle = {},
      detectRemarkablePoints = true,
      cornerRadius = 0,
    } = config;

    super(width, height, boxModel, style);

    this.config = {
      data,
      width,
      height,
      innerRadius,
      colors,
      showLabels,
      showLegend,
      startAngle,
      sliceStyle,
      labelStyle,
      detectRemarkablePoints,
      cornerRadius,
    };

    this.calculateSlices();
    if (detectRemarkablePoints) {
      this.detectRemarkable();
    }
  }

  /**
   * Calculate slice positions and angles.
   */
  private calculateSlices(): void {
    const { data, colors, startAngle } = this.config;
    
    // Calculate total
    this.total = data.reduce((sum, d) => sum + Math.abs(d.value), 0);
    
    if (this.total === 0) {
      console.warn("DonutChart: Total value is 0, no slices to display");
      return;
    }

    // Calculate dimensions
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.9; // Leave some padding
    
    // Parse inner radius
    let innerRadius = 0;
    if (typeof this.config.innerRadius === "string" && this.config.innerRadius.endsWith("%")) {
      const percent = parseFloat(this.config.innerRadius) / 100;
      innerRadius = outerRadius * percent;
    } else {
      innerRadius = Number(this.config.innerRadius);
    }

    // Convert start angle to radians
    const startAngleRad = (startAngle * Math.PI) / 180;
    let currentAngle = startAngleRad;

    // Create slices
    this.slices = data.map((point, index) => {
      const percentage = (Math.abs(point.value) / this.total) * 100;
      const angleSize = (Math.abs(point.value) / this.total) * 2 * Math.PI;
      const endAngle = currentAngle + angleSize;

      const slice = new DonutSlice(
        index,
        point.label,
        point.value,
        percentage,
        currentAngle,
        endAngle,
        centerX,
        centerY,
        outerRadius,
        innerRadius,
        this
      );

      currentAngle = endAngle;
      return slice;
    });
  }

  /**
   * Detect remarkable points in the data.
   */
  private detectRemarkable(): void {
    if (this.slices.length === 0) return;

    const { data } = this.config;

    // Find maximum slice
    let maxIndex = 0;
    let maxValue = data[0].value;
    data.forEach((d, i) => {
      if (d.value > maxValue) {
        maxValue = d.value;
        maxIndex = i;
      }
    });

    this.remarkablePoints.push({
      type: "maximum",
      index: maxIndex,
      value: maxValue,
      percentage: this.slices[maxIndex].percentage,
      label: data[maxIndex].label,
      description: `Largest slice: ${data[maxIndex].label} (${this.slices[maxIndex].percentage.toFixed(1)}%)`,
    });

    // Find minimum slice
    let minIndex = 0;
    let minValue = data[0].value;
    data.forEach((d, i) => {
      if (d.value < minValue) {
        minValue = d.value;
        minIndex = i;
      }
    });

    this.remarkablePoints.push({
      type: "minimum",
      index: minIndex,
      value: minValue,
      percentage: this.slices[minIndex].percentage,
      label: data[minIndex].label,
      description: `Smallest slice: ${data[minIndex].label} (${this.slices[minIndex].percentage.toFixed(1)}%)`,
    });

    // Check for majority (>50%)
    const majorityIndex = this.slices.findIndex((s) => s.percentage > 50);
    if (majorityIndex >= 0) {
      this.remarkablePoints.push({
        type: "majority",
        index: majorityIndex,
        value: data[majorityIndex].value,
        percentage: this.slices[majorityIndex].percentage,
        label: data[majorityIndex].label,
        description: `Majority: ${data[majorityIndex].label} (${this.slices[majorityIndex].percentage.toFixed(1)}%)`,
      });
    }

    // Calculate average
    const average = this.total / data.length;
    this.remarkablePoints.push({
      type: "average",
      index: -1, // Not tied to a specific slice
      value: average,
      percentage: (average / this.total) * 100,
      label: "Average",
      description: `Average value: ${average.toFixed(2)} (${((average / this.total) * 100).toFixed(1)}%)`,
    });
  }

  /**
   * Get a slice by index.
   */
  public getSlice(index: number): DonutSlice | undefined {
    return this.slices[index];
  }

  /**
   * Get all slices.
   */
  public getAllSlices(): DonutSlice[] {
    return [...this.slices];
  }

  /**
   * Get remarkable points of a specific type.
   */
  public getRemarkablePoints(
    type?: DonutChartRemarkablePointType
  ): DonutChartRemarkablePoint[] {
    if (type) {
      return this.remarkablePoints.filter((p) => p.type === type);
    }
    return [...this.remarkablePoints];
  }

  /**
   * Get the center position of the chart in absolute coordinates.
   */
  public getCenterPosition(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.config.width / 2,
      y: absPos.y + this.config.height / 2,
    };
  }

  /**
   * Generate SVG path for a donut/pie slice with optional rounded corners.
   */
  private generateSlicePath(slice: DonutSlice): string {
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.9;
    const cornerRadius = Math.min(this.config.cornerRadius, outerRadius * 0.2); // Cap at 20% of radius
    
    let innerRadius = 0;
    if (typeof this.config.innerRadius === "string" && this.config.innerRadius.endsWith("%")) {
      const percent = parseFloat(this.config.innerRadius) / 100;
      innerRadius = outerRadius * percent;
    } else {
      innerRadius = Number(this.config.innerRadius);
    }

    const { startAngle, endAngle } = slice;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // If no corner radius or very small, use sharp corners
    if (cornerRadius < 0.5) {
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      
      if (innerRadius === 0) {
        return [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
          `Z`,
        ].join(" ");
      } else {
        const x3 = centerX + innerRadius * Math.cos(endAngle);
        const y3 = centerY + innerRadius * Math.sin(endAngle);
        const x4 = centerX + innerRadius * Math.cos(startAngle);
        const y4 = centerY + innerRadius * Math.sin(startAngle);
        
        return [
          `M ${x1} ${y1}`,
          `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
          `L ${x3} ${y3}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
          `Z`,
        ].join(" ");
      }
    }
    
    // WITH ROUNDED CORNERS - adjust the path to include rounded corners
    // For a donut, we have 4 corners to round
    
    if (innerRadius === 0) {
      // Pie chart - only round the two outer corners
      // Calculate the angle offset needed for the corner radius
      const angleOffset = cornerRadius / outerRadius;
      
      const x1 = centerX + outerRadius * Math.cos(startAngle + angleOffset);
      const y1 = centerY + outerRadius * Math.sin(startAngle + angleOffset);
      const x2 = centerX + outerRadius * Math.cos(endAngle - angleOffset);
      const y2 = centerY + outerRadius * Math.sin(endAngle - angleOffset);
      
      // Corner start point (inset from outer arc start)
      const cx1 = centerX + (outerRadius - cornerRadius) * Math.cos(startAngle);
      const cy1 = centerY + (outerRadius - cornerRadius) * Math.sin(startAngle);
      
      // Corner end point (inset from outer arc end)
      const cx2 = centerX + (outerRadius - cornerRadius) * Math.cos(endAngle);
      const cy2 = centerY + (outerRadius - cornerRadius) * Math.sin(endAngle);
      
      return [
        `M ${centerX} ${centerY}`,
        `L ${cx1} ${cy1}`,
        `Q ${centerX + outerRadius * Math.cos(startAngle)} ${centerY + outerRadius * Math.sin(startAngle)} ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `Q ${centerX + outerRadius * Math.cos(endAngle)} ${centerY + outerRadius * Math.sin(endAngle)} ${cx2} ${cy2}`,
        `Z`,
      ].join(" ");
    } else {
      // Donut chart - round all 4 corners
      const angleOffset = cornerRadius / outerRadius;
      const innerAngleOffset = cornerRadius / innerRadius;
      
      // Outer arc points (with angle offset for rounding)
      const ox1 = centerX + outerRadius * Math.cos(startAngle + angleOffset);
      const oy1 = centerY + outerRadius * Math.sin(startAngle + angleOffset);
      const ox2 = centerX + outerRadius * Math.cos(endAngle - angleOffset);
      const oy2 = centerY + outerRadius * Math.sin(endAngle - angleOffset);
      
      // Inner arc points (with angle offset for rounding)
      const ix1 = centerX + innerRadius * Math.cos(startAngle + innerAngleOffset);
      const iy1 = centerY + innerRadius * Math.sin(startAngle + innerAngleOffset);
      const ix2 = centerX + innerRadius * Math.cos(endAngle - innerAngleOffset);
      const iy2 = centerY + innerRadius * Math.sin(endAngle - innerAngleOffset);
      
      // Corner control points
      const outerStartCorner = { 
        x: centerX + (outerRadius - cornerRadius) * Math.cos(startAngle),
        y: centerY + (outerRadius - cornerRadius) * Math.sin(startAngle)
      };
      const outerEndCorner = { 
        x: centerX + (outerRadius - cornerRadius) * Math.cos(endAngle),
        y: centerY + (outerRadius - cornerRadius) * Math.sin(endAngle)
      };
      const innerEndCorner = { 
        x: centerX + (innerRadius + cornerRadius) * Math.cos(endAngle),
        y: centerY + (innerRadius + cornerRadius) * Math.sin(endAngle)
      };
      const innerStartCorner = { 
        x: centerX + (innerRadius + cornerRadius) * Math.cos(startAngle),
        y: centerY + (innerRadius + cornerRadius) * Math.sin(startAngle)
      };
      
      return [
        // Start at outer arc start (after rounding)
        `M ${ox1} ${oy1}`,
        // Outer arc
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${ox2} ${oy2}`,
        // Round corner from outer to side edge
        `Q ${centerX + outerRadius * Math.cos(endAngle)} ${centerY + outerRadius * Math.sin(endAngle)} ${outerEndCorner.x} ${outerEndCorner.y}`,
        // Side edge to inner arc
        `L ${innerEndCorner.x} ${innerEndCorner.y}`,
        // Round corner onto inner arc
        `Q ${centerX + innerRadius * Math.cos(endAngle)} ${centerY + innerRadius * Math.sin(endAngle)} ${ix2} ${iy2}`,
        // Inner arc (reverse direction)
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
        // Round corner from inner to side edge
        `Q ${centerX + innerRadius * Math.cos(startAngle)} ${centerY + innerRadius * Math.sin(startAngle)} ${innerStartCorner.x} ${innerStartCorner.y}`,
        // Side edge back to outer arc
        `L ${outerStartCorner.x} ${outerStartCorner.y}`,
        // Round corner onto outer arc
        `Q ${centerX + outerRadius * Math.cos(startAngle)} ${centerY + outerRadius * Math.sin(startAngle)} ${ox1} ${oy1}`,
        `Z`,
      ].join(" ");
    }
  }

  /**
   * Render the donut chart as SVG.
   */
  public render(): string {
    const { data, colors, sliceStyle, showLabels, labelStyle } = this.config;
    const absPos = this.getAbsolutePosition();
    
    const slicesMarkup = this.slices.map((slice, index) => {
      const dataPoint = data[index];
      const color = dataPoint.color || colors[index % colors.length];
      
      // Merge styles: default -> config sliceStyle -> dataPoint style
      const mergedStyle: Partial<Style> = {
        fill: color,
        stroke: "#ffffff",
        strokeWidth: "2" as any,
        ...sliceStyle,
        ...dataPoint.style,
      };
      
      const pathData = this.generateSlicePath(slice);
      const styleAttrs = styleToSVGAttributes(mergedStyle);
      
      return `<path d="${pathData}" ${styleAttrs} />`;
    });

    // Labels
    let labelsMarkup = "";
    if (showLabels) {
      labelsMarkup = this.slices.map((slice) => {
        const pos = slice.labelPosition;
        const chartPos = this.getAbsolutePosition();
        const relX = pos.x - chartPos.x;
        const relY = pos.y - chartPos.y;
        
        const mergedLabelStyle: Partial<Style> = {
          fill: "#ffffff",
          fontSize: "14" as any,
          fontWeight: "bold",
          textAnchor: "middle",
          ...labelStyle,
        };
        
        const styleAttrs = styleToSVGAttributes(mergedLabelStyle);
        const text = `${slice.percentage.toFixed(1)}%`;
        
        return `<text x="${relX}" y="${relY}" ${styleAttrs} dominant-baseline="middle">${text}</text>`;
      }).join("\n");
    }

    return `
      <g transform="translate(${absPos.x}, ${absPos.y})">
        ${slicesMarkup.join("\n")}
        ${labelsMarkup}
      </g>
    `;
  }
}

