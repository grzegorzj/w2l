/**
 * Grid Layout module for creating grid-based layouts.
 *
 * This module provides the GridLayout class that arranges elements in a
 * grid pattern with configurable rows, columns, and gaps.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating a GridLayout.
 */
export interface GridLayoutConfig extends LayoutConfig {
  /**
   * Number of columns in the grid.
   * If not specified, columns will be calculated from rows and element count.
   */
  columns?: number;

  /**
   * Number of rows in the grid.
   * If not specified, rows will be calculated from columns and element count.
   */
  rows?: number;

  /**
   * Gap between columns (horizontal spacing).
   * @defaultValue 0
   */
  columnGap?: string | number;

  /**
   * Gap between rows (vertical spacing).
   * @defaultValue 0
   */
  rowGap?: string | number;

  /**
   * Uniform gap for both rows and columns.
   * Overrides columnGap and rowGap if specified.
   */
  gap?: string | number;

  /**
   * Horizontal alignment of elements within grid cells.
   * @defaultValue "center"
   */
  horizontalAlign?: "left" | "center" | "right";

  /**
   * Vertical alignment of elements within grid cells.
   * @defaultValue "center"
   */
  verticalAlign?: "top" | "center" | "bottom";

  /**
   * Whether elements should resize to fit grid cells.
   * @defaultValue false
   */
  fitCells?: boolean;

  /**
   * Width of each cell. If not specified, cells will be equal width.
   */
  cellWidth?: string | number;

  /**
   * Height of each cell. If not specified, cells will be equal height.
   */
  cellHeight?: string | number;
}

/**
 * Represents a cell position in the grid.
 */
interface GridCell {
  row: number;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * GridLayout arranges elements in a grid pattern.
 *
 * This layout automatically positions elements in a grid with configurable
 * rows, columns, and spacing. Elements are placed in cells from left to right,
 * top to bottom.
 *
 * @remarks
 * GridLayout is useful for:
 * - Creating icon grids
 * - Building dashboard layouts
 * - Arranging image galleries
 * - Creating button grids
 * - Building periodic table-style layouts
 *
 * **Important Note on Immutability:**
 * Once elements are added and the layout is positioned/rendered, the grid
 * arrangement is fixed. The grid calculates its structure based on the
 * elements present at arrangement time. Adding elements after positioning
 * may not automatically update the grid. Add all elements before positioning
 * the layout for best results.
 *
 * @example
 * Create a 3x3 grid
 * ```typescript
 * const grid = new GridLayout({
 *   columns: 3,
 *   rows: 3,
 *   width: 400,
 *   height: 400,
 *   gap: 10,
 *   horizontalAlign: "center",
 *   verticalAlign: "center"
 * });
 *
 * // Add 9 elements
 * for (let i = 0; i < 9; i++) {
 *   const circle = new Circle({ radius: 20 });
 *   grid.addElement(circle);
 * }
 *
 * // Position the grid
 * grid.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: grid.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 *
 * @example
 * Auto-calculate rows based on columns
 * ```typescript
 * const grid = new GridLayout({
 *   columns: 4,  // 4 columns
 *   // rows will be calculated automatically based on element count
 *   width: 500,
 *   height: 300,
 *   columnGap: 15,
 *   rowGap: 10
 * });
 * ```
 *
 * @example
 * Fixed cell sizes
 * ```typescript
 * const grid = new GridLayout({
 *   columns: 5,
 *   cellWidth: 80,
 *   cellHeight: 80,
 *   gap: 5
 * });
 * ```
 */
export class GridLayout extends Layout {
  protected config: GridLayoutConfig;
  private gridElements: Element[] = [];
  private cells: GridCell[] = [];
  private isArranged: boolean = false;
  private calculatedColumns: number = 0;
  private calculatedRows: number = 0;

  /**
   * Creates a new GridLayout instance.
   *
   * @param config - Configuration for the grid layout
   */
  constructor(config: GridLayoutConfig) {
    super(config);
    this.config = {
      columns: config.columns,
      rows: config.rows,
      columnGap: config.gap !== undefined ? config.gap : config.columnGap || 0,
      rowGap: config.gap !== undefined ? config.gap : config.rowGap || 0,
      horizontalAlign: config.horizontalAlign || "center",
      verticalAlign: config.verticalAlign || "center",
      fitCells: config.fitCells || false,
      ...config,
    };
  }

  /**
   * Adds an element to the grid.
   *
   * Elements will be placed in grid cells from left to right, top to bottom.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    // Add to parent's children manager
    super.addElement(element);

    // Track for grid arrangement
    this.gridElements.push(element);

    // Mark that we need to re-arrange
    this.isArranged = false;
  }

  /**
   * Calculates grid dimensions based on configuration and element count.
   * @internal
   */
  private calculateGridDimensions(): void {
    const elementCount = this.gridElements.length;

    if (elementCount === 0) {
      this.calculatedColumns = 0;
      this.calculatedRows = 0;
      return;
    }

    // If both columns and rows are specified, use them
    if (this.config.columns && this.config.rows) {
      this.calculatedColumns = this.config.columns;
      this.calculatedRows = this.config.rows;
    }
    // If only columns specified, calculate rows
    else if (this.config.columns) {
      this.calculatedColumns = this.config.columns;
      this.calculatedRows = Math.ceil(elementCount / this.config.columns);
    }
    // If only rows specified, calculate columns
    else if (this.config.rows) {
      this.calculatedRows = this.config.rows;
      this.calculatedColumns = Math.ceil(elementCount / this.config.rows);
    }
    // If neither specified, create a square-ish grid
    else {
      this.calculatedColumns = Math.ceil(Math.sqrt(elementCount));
      this.calculatedRows = Math.ceil(elementCount / this.calculatedColumns);
    }
  }

  /**
   * Creates the grid cell structure.
   * @internal
   */
  private createCells(): void {
    this.cells = [];

    const padding = this.paddingBox;
    const contentX = padding.left;
    const contentY = padding.top;
    const contentWidth = this.width - padding.left - padding.right;
    const contentHeight = this.height - padding.top - padding.bottom;

    const columnGap = parseUnit(this.config.columnGap!);
    const rowGap = parseUnit(this.config.rowGap!);

    // Calculate cell dimensions
    let cellWidth: number;
    let cellHeight: number;

    if (this.config.cellWidth) {
      cellWidth = parseUnit(this.config.cellWidth);
    } else {
      const totalColumnGap = columnGap * (this.calculatedColumns - 1);
      cellWidth = (contentWidth - totalColumnGap) / this.calculatedColumns;
    }

    if (this.config.cellHeight) {
      cellHeight = parseUnit(this.config.cellHeight);
    } else {
      const totalRowGap = rowGap * (this.calculatedRows - 1);
      cellHeight = (contentHeight - totalRowGap) / this.calculatedRows;
    }

    // Create cells
    for (let row = 0; row < this.calculatedRows; row++) {
      for (let col = 0; col < this.calculatedColumns; col++) {
        const x = contentX + col * (cellWidth + columnGap);
        const y = contentY + row * (cellHeight + rowGap);

        this.cells.push({
          row,
          column: col,
          x,
          y,
          width: cellWidth,
          height: cellHeight,
        });
      }
    }
  }

  /**
   * Arranges elements in the grid.
   * @internal
   */
  private arrangeElements(): void {
    if (this.isArranged || this.gridElements.length === 0) {
      return;
    }

    // Calculate grid structure
    this.calculateGridDimensions();
    this.createCells();

    // Position each element in its cell
    this.gridElements.forEach((element, index) => {
      if (index >= this.cells.length) {
        // More elements than cells - skip extra elements
        return;
      }

      const cell = this.cells[index];
      this.positionElementInCell(element, cell);
    });

    this.isArranged = true;
  }

  /**
   * Positions an element within a grid cell.
   * @internal
   */
  private positionElementInCell(element: Element, cell: GridCell): void {
    const elem = element as any;

    // Resize element to fit cell if fitCells is enabled
    if (this.config.fitCells && element.shouldFitContent) {
      if ("_width" in elem) {
        elem._width = cell.width;
      }
      if ("_height" in elem) {
        elem._height = cell.height;
      }
    }

    // Get element's alignment point
    const elementPoint = element.getAlignmentPoint(
      this.config.horizontalAlign!,
      this.config.verticalAlign!
    );

    // Get cell's target point based on alignment
    let cellTargetX: number;
    let cellTargetY: number;

    // Horizontal alignment
    switch (this.config.horizontalAlign) {
      case "left":
        cellTargetX = cell.x;
        break;
      case "right":
        cellTargetX = cell.x + cell.width;
        break;
      case "center":
      default:
        cellTargetX = cell.x + cell.width / 2;
    }

    // Vertical alignment
    switch (this.config.verticalAlign) {
      case "top":
        cellTargetY = cell.y;
        break;
      case "bottom":
        cellTargetY = cell.y + cell.height;
        break;
      case "center":
      default:
        cellTargetY = cell.y + cell.height / 2;
    }

    // Set currentPosition in RELATIVE coordinates (relative to parent grid)
    // getAbsolutePosition() will add the parent's position when rendering
    elem.currentPosition = {
      x: cellTargetX,
      y: cellTargetY,
    };
    
    // Notify dependent elements (e.g., elements positioned relative to this one)
    // This ensures reactive positioning works correctly
    if (typeof elem.notifyDependents === 'function') {
      elem.notifyDependents();
    }
  }

  /**
   * Gets the grid dimensions (columns and rows).
   * Only available after elements have been arranged.
   *
   * @returns Object with columns and rows count
   */
  getGridDimensions(): { columns: number; rows: number } {
    if (!this.isArranged) {
      this.arrangeElements();
    }
    return {
      columns: this.calculatedColumns,
      rows: this.calculatedRows,
    };
  }

  /**
   * Gets the cell at a specific row and column.
   * Only available after elements have been arranged.
   *
   * @param row - Row index (0-based)
   * @param column - Column index (0-based)
   * @returns Cell information or undefined if not found
   */
  getCell(row: number, column: number): GridCell | undefined {
    if (!this.isArranged) {
      this.arrangeElements();
    }
    return this.cells.find((cell) => cell.row === row && cell.column === column);
  }

  /**
   * Overrides position to arrange elements after positioning the layout.
   */
  position(config: any): void {
    // Move the layout first
    super.position(config);
    
    // Now arrange children based on layout's new position
    this.arrangeElements();
    
    // Reset tracking so children's newly set positions are used as the baseline
    // for future transformations
    this.childrenManager.resetTracking();
  }

  /**
   * Overrides render to arrange elements before rendering.
   */
  render(): string {
    this.arrangeElements();
    return super.render();
  }
}

