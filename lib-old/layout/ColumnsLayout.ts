/**
 * Columns Layout module for creating multi-column layouts.
 *
 * This module provides the ColumnsLayout class that creates a flexible
 * column-based layout system similar to CSS grid columns.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import { Rectangle } from "../elements/Rectangle.js";
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
   * @defaultValue false
   */
  fitContent?: boolean;
}

/**
 * Represents a single column within a ColumnsLayout.
 *
 * Columns are rectangles that act as sub-containers, holding elements
 * and applying alignment and sizing rules to their content.
 *
 * By extending Rectangle, Column inherits all geometric properties and
 * reference points (topLeft, center, bottomRight, etc.) without duplication.
 */
export class Column extends Rectangle {
  private elements: Element[] = [];
  private alignmentConfig: {
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
    // Initialize as a Rectangle
    super({
      width,
      height,
      style,
    });

    // Set position after construction
    this.currentPosition = { x, y };
    this.alignmentConfig = config || {
      verticalAlign: "top",
      horizontalAlign: "left",
      fitContent: false,
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

  // Reference points (topLeft, center, bottomRight, etc.) are inherited from Rectangle

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

    // Resize element to fit column width if both:
    // 1. fitContent is enabled for this column
    // 2. The element allows fitting (element.shouldFitContent returns true)
    if (
      this.alignmentConfig.fitContent &&
      element.shouldFitContent &&
      "width" in elem &&
      "_width" in elem
    ) {
      elem._width = this._width;
    }

    // Get element's alignment point (where the element wants to be anchored)
    // This respects the alignment semantics:
    // - "top" align uses the element's TOP edge
    // - "left" align uses the element's LEFT edge
    // - "center" align uses the element's CENTER
    // Elements can override getAlignmentPoint() to customize this behavior
    const elementPoint = element.getAlignmentPoint(
      this.alignmentConfig.horizontalAlign,
      this.alignmentConfig.verticalAlign
    );

    // Get the column's target point based on alignment using inherited reference points
    let columnTarget: Point;

    // Combine horizontal and vertical alignment to get the right reference point
    if (
      this.alignmentConfig.horizontalAlign === "left" &&
      this.alignmentConfig.verticalAlign === "top"
    ) {
      columnTarget = this.topLeft;
    } else if (
      this.alignmentConfig.horizontalAlign === "left" &&
      this.alignmentConfig.verticalAlign === "center"
    ) {
      columnTarget = this.leftCenter;
    } else if (
      this.alignmentConfig.horizontalAlign === "left" &&
      this.alignmentConfig.verticalAlign === "bottom"
    ) {
      columnTarget = this.bottomLeft;
    } else if (
      this.alignmentConfig.horizontalAlign === "center" &&
      this.alignmentConfig.verticalAlign === "top"
    ) {
      columnTarget = this.topCenter;
    } else if (
      this.alignmentConfig.horizontalAlign === "center" &&
      this.alignmentConfig.verticalAlign === "center"
    ) {
      columnTarget = this.center;
    } else if (
      this.alignmentConfig.horizontalAlign === "center" &&
      this.alignmentConfig.verticalAlign === "bottom"
    ) {
      columnTarget = this.bottomCenter;
    } else if (
      this.alignmentConfig.horizontalAlign === "right" &&
      this.alignmentConfig.verticalAlign === "top"
    ) {
      columnTarget = this.topRight;
    } else if (
      this.alignmentConfig.horizontalAlign === "right" &&
      this.alignmentConfig.verticalAlign === "center"
    ) {
      columnTarget = this.rightCenter;
    } else {
      // right + bottom
      columnTarget = this.bottomRight;
    }

    const columnTargetX = parseUnit(columnTarget.x);
    const columnTargetY = parseUnit(columnTarget.y);

    // Calculate offset: where the element's alignment point is relative to its currentPosition
    // getAlignmentPoint returns absolute coordinates, but we need the offset from currentPosition
    const absPos = elem.getAbsolutePosition();
    const elementPointX = parseUnit(elementPoint.x);
    const elementPointY = parseUnit(elementPoint.y);
    const offsetX = elementPointX - absPos.x;
    const offsetY = elementPointY - absPos.y;

    // Set currentPosition so that elementPoint aligns with columnTarget
      elem.currentPosition = {
      x: columnTargetX - offsetX,
      y: columnTargetY - offsetY,
      };
  }

  /**
   * Gets all elements in this column.
   */
  get children(): Element[] {
    return this.elements;
  }

  /**
   * Renders the column background (if styled).
   *
   * Children are rendered separately by the Artboard's z-index system.
   * This ensures proper z-ordering between columns and their children.
   *
   * @returns SVG string of column background only
   * @internal
   */
  render(): string {
    // Render only the column background using inherited Rectangle.render()
    // Children will be rendered separately by the Artboard with proper z-ordering
    return super.render();
  }

  /**
   * Updates the column's position (used when layout moves).
   *
   * @param deltaX - Change in X position
   * @param deltaY - Change in Y position
   * @internal
   */
  updatePosition(deltaX: number, deltaY: number): void {
    this.currentPosition = {
      x: this.currentPosition.x + deltaX,
      y: this.currentPosition.y + deltaY,
    };

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
          fitContent: this.columnsConfig.fitContent === true,
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
   * Override children getter to include columns for proper z-index sorting.
   * This ensures the Artboard can collect and sort columns and their children.
   *
   * @returns Array of columns (which themselves have children)
   */
  get children(): Element[] {
    return this._columns as unknown as Element[];
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
   * Renders the columns layout background only.
   *
   * Columns and their children are rendered separately by the Artboard's z-index system.
   *
   * @returns SVG string representation of just the layout background
   */
  render(): string {
    // Render only the layout background
    // Columns will be rendered separately by the Artboard with proper z-ordering
    return super.render();
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
