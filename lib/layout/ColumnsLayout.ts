/**
 * Columns Layout module for creating multi-column layouts.
 *
 * This module provides the ColumnsLayout class that creates a flexible
 * column-based layout system similar to CSS grid columns.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import type { Style } from "../core/Stylable.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating a ColumnsLayout.
 */
export interface ColumnsLayoutConfig
  extends Omit<LayoutConfig, "width" | "height"> {
  /**
   * Number of columns to create.
   */
  count: number;

  /**
   * Space between columns (gutter).
   * @defaultValue 0
   */
  gutter?: string | number;

  /**
   * Width of the columns layout container.
   * Can be specified or will be calculated from column widths.
   */
  width?: string | number;

  /**
   * Height of the columns layout container.
   */
  height?: string | number;

  /**
   * Column width. If not specified, columns will be equal width based on total width.
   */
  columnWidth?: string | number;

  /**
   * Visual styling for individual columns.
   * Each column can have its own style.
   */
  columnStyle?: Partial<Style>;

  /**
   * Vertical alignment for content within columns.
   * @defaultValue "top"
   */
  verticalAlign?: "top" | "center" | "bottom";

  /**
   * Horizontal alignment for content within columns.
   * @defaultValue "left"
   */
  horizontalAlign?: "left" | "center" | "right";

  /**
   * Whether content should resize to fit column width.
   * @defaultValue true
   */
  fitContent?: boolean;
}

/**
 * Represents a single column within a ColumnsLayout.
 *
 * Columns act as sub-containers that hold elements and apply
 * alignment and sizing rules to their content.
 */
export class Column {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _style?: Partial<Style>;
  private elements: Element[] = [];
  private config: {
    verticalAlign: "top" | "center" | "bottom";
    horizontalAlign: "left" | "center" | "right";
    fitContent: boolean;
  };

  /**
   * Creates a new Column instance.
   *
   * @param x - X position of the column
   * @param y - Y position of the column
   * @param width - Width of the column
   * @param height - Height of the column
   * @param style - Optional visual style for the column
   * @param config - Alignment and sizing configuration
   * @internal
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    style?: Partial<Style>,
    config?: {
      verticalAlign: "top" | "center" | "bottom";
      horizontalAlign: "left" | "center" | "right";
      fitContent: boolean;
    }
  ) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._style = style;
    this.config = config || {
      verticalAlign: "top",
      horizontalAlign: "left",
      fitContent: true,
    };
  }

  /**
   * Gets the width of the column.
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the height of the column.
   */
  get height(): number {
    return this._height;
  }

  /**
   * Gets the top-left corner of the column.
   */
  get topLeft(): Point {
    return {
      x: `${this._x}px`,
      y: `${this._y}px`,
    };
  }

  /**
   * Gets the center point of the column.
   */
  get center(): Point {
    return {
      x: `${this._x + this._width / 2}px`,
      y: `${this._y + this._height / 2}px`,
    };
  }

  /**
   * Gets the top-center point of the column.
   */
  get topCenter(): Point {
    return {
      x: `${this._x + this._width / 2}px`,
      y: `${this._y}px`,
    };
  }

  /**
   * Gets the bottom-center point of the column.
   */
  get bottomCenter(): Point {
    return {
      x: `${this._x + this._width / 2}px`,
      y: `${this._y + this._height}px`,
    };
  }

  /**
   * Adds an element to this column.
   *
   * The element will be positioned according to the column's alignment rules.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    this.elements.push(element);
    this.positionElement(element);
  }

  /**
   * Positions an element within the column according to alignment rules.
   *
   * @param element - The element to position
   * @internal
   */
  private positionElement(element: Element): void {
    const elem = element as any;

    // Resize element to fit column width if fitContent is enabled
    if (this.config.fitContent && "width" in elem && "_width" in elem) {
      elem._width = this._width;
    }

    // Get the element's alignment point based on the column's alignment config
    // This uses the element's default alignment behavior (currently edge-based)
    const elementPoint = element.getAlignmentPoint(
      this.config.horizontalAlign,
      this.config.verticalAlign
    );

    // Calculate the column's target point for this alignment
    let columnTargetX = this._x;
    let columnTargetY = this._y;

    // Calculate column target based on alignment
    if (this.config.horizontalAlign === "center") {
      columnTargetX = this._x + this._width / 2;
    } else if (this.config.horizontalAlign === "right") {
      columnTargetX = this._x + this._width;
    }

    if (this.config.verticalAlign === "center") {
      columnTargetY = this._y + this._height / 2;
    } else if (this.config.verticalAlign === "bottom") {
      columnTargetY = this._y + this._height;
    }

    // Calculate the offset needed to align element point to column point
    const elementPointX = parseUnit(elementPoint.x);
    const elementPointY = parseUnit(elementPoint.y);

    const offsetX = columnTargetX - elementPointX;
    const offsetY = columnTargetY - elementPointY;

    // Set the element's position
    if (elem.currentPosition) {
      elem.currentPosition = {
        x: elem.currentPosition.x + offsetX,
        y: elem.currentPosition.y + offsetY,
      };
    }
  }

  /**
   * Gets all elements in this column.
   */
  get children(): Element[] {
    return this.elements;
  }

  /**
   * Renders the column background (if styled) and its children.
   *
   * @returns SVG string
   * @internal
   */
  render(): string {
    const parts: string[] = [];

    // Render column background if it has a style
    if (this._style && (this._style.fill || this._style.stroke)) {
      const styleToSVGAttributes = (style: Partial<Style>): string => {
        const attrs: string[] = [];
        if (style.fill) attrs.push(`fill="${style.fill}"`);
        if (style.stroke) attrs.push(`stroke="${style.stroke}"`);
        if (style.strokeWidth)
          attrs.push(`stroke-width="${style.strokeWidth}"`);
        if (style.opacity !== undefined)
          attrs.push(`opacity="${style.opacity}"`);
        return attrs.join(" ");
      };

      const styleAttrs = styleToSVGAttributes(this._style);
      parts.push(
        `<rect x="${this._x}" y="${this._y}" width="${this._width}" height="${this._height}" ${styleAttrs} />`
      );
    }

    // Render children
    for (const element of this.elements) {
      parts.push(element.render());
    }

    return parts.filter((s) => s.length > 0).join("\n");
  }

  /**
   * Updates the column's position (used when layout moves).
   *
   * @param deltaX - Change in X position
   * @param deltaY - Change in Y position
   * @internal
   */
  updatePosition(deltaX: number, deltaY: number): void {
    this._x += deltaX;
    this._y += deltaY;

    // Update all children positions
    for (const element of this.elements) {
      const elem = element as any;
      if (elem.currentPosition) {
        elem.currentPosition = {
          x: elem.currentPosition.x + deltaX,
          y: elem.currentPosition.y + deltaY,
        };
      }
    }
  }
}

/**
 * ColumnsLayout creates a multi-column layout container.
 *
 * This layout automatically divides its space into equal columns with optional
 * gutters between them. Elements can be added to specific columns, and the
 * layout will handle positioning and alignment automatically.
 *
 * @remarks
 * ColumnsLayout is useful for:
 * - Creating grid-like structures
 * - Organizing content into equal sections
 * - Building responsive layouts
 * - Creating magazine-style layouts
 *
 * @example
 * Create a 3-column layout
 * ```typescript
 * const columns = new ColumnsLayout({
 *   count: 3,
 *   gutter: "20px",
 *   width: "600px",
 *   height: "400px",
 *   columnStyle: { fill: "#f0f0f0" }
 * });
 *
 * // Add elements to specific columns
 * const circle1 = new Circle({ radius: 30 });
 * const circle2 = new Circle({ radius: 30 });
 * const circle3 = new Circle({ radius: 30 });
 *
 * columns.columns[0].addElement(circle1);
 * columns.columns[1].addElement(circle2);
 * columns.columns[2].addElement(circle3);
 *
 * // Position the entire layout
 * columns.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: columns.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 */
export class ColumnsLayout extends Layout {
  private _columns: Column[] = [];
  private columnsConfig: ColumnsLayoutConfig;
  private lastColumnsPosition: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Creates a new ColumnsLayout instance.
   *
   * @param config - Configuration for the columns layout
   */
  constructor(config: ColumnsLayoutConfig) {
    // Calculate dimensions if not provided
    const gutter = parseUnit(config.gutter || 0);
    const columnWidth = config.columnWidth
      ? parseUnit(config.columnWidth)
      : undefined;

    let width: number;
    let height: number;

    if (config.width) {
      width = parseUnit(config.width);
    } else if (columnWidth) {
      // Calculate width from column width and gutters
      width = columnWidth * config.count + gutter * (config.count - 1);
    } else {
      // Default width
      width = 600;
    }

    height = config.height ? parseUnit(config.height) : 400;

    // Call parent constructor with calculated dimensions
    super({
      ...config,
      width,
      height,
    });

    this.columnsConfig = config;
    this.initializeColumns();

    // Store initial position for column delta tracking
    this.lastColumnsPosition = { ...this.currentPosition };
  }

  /**
   * Initializes the columns based on configuration.
   * @internal
   */
  private initializeColumns(): void {
    const padding = this.paddingBox;
    const contentX = this.currentPosition.x + padding.left;
    const contentY = this.currentPosition.y + padding.top;
    const contentWidth = this.width - padding.left - padding.right;
    const contentHeight = this.height - padding.top - padding.bottom;

    const gutter = parseUnit(this.columnsConfig.gutter || 0);
    const count = this.columnsConfig.count;

    // Calculate column width
    const totalGutterWidth = gutter * (count - 1);
    const columnWidth = (contentWidth - totalGutterWidth) / count;

    // Create columns
    for (let i = 0; i < count; i++) {
      const x = contentX + i * (columnWidth + gutter);
      const column = new Column(
        x,
        contentY,
        columnWidth,
        contentHeight,
        this.columnsConfig.columnStyle,
        {
          verticalAlign: this.columnsConfig.verticalAlign || "top",
          horizontalAlign: this.columnsConfig.horizontalAlign || "left",
          fitContent: this.columnsConfig.fitContent !== false,
        }
      );
      this._columns.push(column);
    }
  }

  /**
   * Gets the array of columns.
   *
   * Use this to add elements to specific columns.
   *
   * @example
   * ```typescript
   * const layout = new ColumnsLayout({ count: 3, width: 600, height: 400 });
   * const circle = new Circle({ radius: 30 });
   * layout.columns[0].addElement(circle);
   * ```
   */
  get columns(): Column[] {
    return this._columns;
  }

  /**
   * Updates positions of columns when the layout moves.
   * @internal
   */
  private updateColumnPositions(): void {
    const deltaX = this.currentPosition.x - this.lastColumnsPosition.x;
    const deltaY = this.currentPosition.y - this.lastColumnsPosition.y;

    // Update column positions
    for (const column of this._columns) {
      column.updatePosition(deltaX, deltaY);
    }

    this.lastColumnsPosition = { ...this.currentPosition };
  }

  /**
   * Overrides position to update both children and columns.
   */
  position(config: any): void {
    super.position(config);
    this.updateColumnPositions();
  }

  /**
   * Overrides translate to update both children and columns.
   */
  translate(config: any): void {
    super.translate(config);
    this.updateColumnPositions();
  }

  /**
   * Overrides rotate to update both children and columns.
   */
  rotate(config: any): void {
    super.rotate(config);
    this.updateColumnPositions();
  }

  /**
   * Renders the columns layout.
   *
   * @returns SVG string representation
   */
  render(): string {
    const parts: string[] = [];

    // Render the layout background (if it has a visible style)
    const layoutSVG = super.render();
    if (layoutSVG) {
      parts.push(layoutSVG);
    }

    // Render all columns
    for (const column of this._columns) {
      const columnSVG = column.render();
      if (columnSVG) {
        parts.push(columnSVG);
      }
    }

    return parts.filter((s) => s.length > 0).join("\n");
  }

  /**
   * Overrides addElement to add to the first column by default.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    if (this._columns.length > 0) {
      this._columns[0].addElement(element);
    }
  }
}
