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
 * 
 * You can either:
 * - Provide `width` and `height` (cells will be sized to fit)
 * - Provide `cellWidth`, `cellHeight`, `columns`, and `rows` (total size auto-calculated)
 */
export interface GridLayoutConfig extends Omit<LayoutConfig, 'width' | 'height'> {
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
   * Whether to show cell boundaries for debugging.
   * Renders semi-transparent rectangles for each grid cell.
   * @defaultValue false
   */
  debugShowCells?: boolean;

  /**
   * Width of each cell. If specified with columns, total width is auto-calculated.
   */
  cellWidth?: string | number;

  /**
   * Height of each cell. If specified with rows, total height is auto-calculated.
   */
  cellHeight?: string | number;
  
  /**
   * Total width of the grid. Optional if cellWidth is provided.
   */
  width?: string | number;
  
  /**
   * Total height of the grid. Optional if cellHeight is provided.
   */
  height?: string | number;
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
  private gridConfig: GridLayoutConfig & { width: string | number; height: string | number };
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
    // Auto-calculate width/height if cellWidth/cellHeight are provided
    const columnGap = config.gap !== undefined ? config.gap : config.columnGap || 0;
    const rowGap = config.gap !== undefined ? config.gap : config.rowGap || 0;
    
    let finalWidth = config.width;
    let finalHeight = config.height;
    
    // If cellWidth/cellHeight provided but not width/height, calculate them
    if (config.cellWidth && config.columns && !finalWidth) {
      const cellW = parseUnit(config.cellWidth);
      const gapW = parseUnit(columnGap);
      finalWidth = config.columns * cellW + (config.columns - 1) * gapW;
    }
    
    if (config.cellHeight && config.rows && !finalHeight) {
      const cellH = parseUnit(config.cellHeight);
      const gapH = parseUnit(rowGap);
      finalHeight = config.rows * cellH + (config.rows - 1) * gapH;
    }
    
    // Ensure width and height are set
    if (!finalWidth || !finalHeight) {
      throw new Error('GridLayout requires either (width, height) or (cellWidth, cellHeight, columns, rows)');
    }
    
    super({ ...config, width: finalWidth, height: finalHeight });
    this.gridConfig = {
      columns: config.columns,
      rows: config.rows,
      columnGap,
      rowGap,
      horizontalAlign: config.horizontalAlign || "center",
      verticalAlign: config.verticalAlign || "center",
      fitCells: config.fitCells || false,
      cellWidth: config.cellWidth,
      cellHeight: config.cellHeight,
      width: finalWidth,
      height: finalHeight,
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
    if (this.gridConfig.columns && this.gridConfig.rows) {
      this.calculatedColumns = this.gridConfig.columns;
      this.calculatedRows = this.gridConfig.rows;
    }
    // If only columns specified, calculate rows
    else if (this.gridConfig.columns) {
      this.calculatedColumns = this.gridConfig.columns;
      this.calculatedRows = Math.ceil(elementCount / this.gridConfig.columns);
    }
    // If only rows specified, calculate columns
    else if (this.gridConfig.rows) {
      this.calculatedRows = this.gridConfig.rows;
      this.calculatedColumns = Math.ceil(elementCount / this.gridConfig.rows);
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

    const columnGap = parseUnit(this.gridConfig.columnGap!);
    const rowGap = parseUnit(this.gridConfig.rowGap!);

    // Calculate cell dimensions
    let cellWidth: number;
    let cellHeight: number;

    if (this.gridConfig.cellWidth) {
      cellWidth = parseUnit(this.gridConfig.cellWidth);
    } else {
      const totalColumnGap = columnGap * (this.calculatedColumns - 1);
      cellWidth = (contentWidth - totalColumnGap) / this.calculatedColumns;
    }

    if (this.gridConfig.cellHeight) {
      cellHeight = parseUnit(this.gridConfig.cellHeight);
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
      console.log("[GridLayout] arrangeElements SKIPPED", { isArranged: this.isArranged, elementCount: this.gridElements.length });
      return;
    }

    console.log("[GridLayout] arrangeElements START", { elementCount: this.gridElements.length });

    // IMPORTANT: Arrange child layouts first so they know their dimensions
    // This ensures VStack/HStack/etc children calculate their size before we position them
    this.gridElements.forEach((element) => {
      const elem = element as any;
      if (typeof elem.arrangeElements === 'function') {
        elem.arrangeElements();
      }
    });

    // Calculate grid structure
    this.calculateGridDimensions();
    this.createCells();

    console.log("[GridLayout] Calculated dimensions:", { columns: this.calculatedColumns, rows: this.calculatedRows, cellCount: this.cells.length });

    // Position each element in its cell
    this.gridElements.forEach((element, index) => {
      if (index >= this.cells.length) {
        // More elements than cells - skip extra elements
        return;
      }

      const cell = this.cells[index];
      console.log(`[GridLayout] Positioning element ${index} in cell [${cell.row},${cell.column}] at (${cell.x}, ${cell.y})`);
      this.positionElementInCell(element, cell);
    });

    this.isArranged = true;
    console.log("[GridLayout] arrangeElements COMPLETE");
  }

  /**
   * Positions an element within a grid cell.
   * @internal
   */
  private positionElementInCell(element: Element, cell: GridCell): void {
    const elem = element as any;
    
    // Skip elements that have been explicitly positioned (absolute mode)
    if (elem._isAbsolutePositioned) {
      return;
    }

    // Resize element to fit cell if fitCells is enabled
    if (this.gridConfig.fitCells && element.shouldFitContent) {
      if ("_width" in elem) {
        elem._width = cell.width;
      }
      if ("_height" in elem) {
        elem._height = cell.height;
      }
    }

    // Get element's alignment point (where the element wants to be anchored)
    // This respects the alignment semantics:
    // - "top" align uses the element's TOP edge
    // - "left" align uses the element's LEFT edge  
    // - "center" align uses the element's CENTER
    // Elements can override getAlignmentPoint() to customize this behavior
    const elementPoint = element.getAlignmentPoint(
      this.gridConfig.horizontalAlign!,
      this.gridConfig.verticalAlign!
    );

    // Get cell's target point based on alignment
    let cellTargetX: number;
    let cellTargetY: number;

    // Horizontal alignment
    switch (this.gridConfig.horizontalAlign) {
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
    switch (this.gridConfig.verticalAlign) {
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

    // Calculate offset: where the element's alignment point is relative to its currentPosition
    // getAlignmentPoint returns absolute coordinates, but we need the offset from currentPosition
    const absPos = elem.getAbsolutePosition();
    const elementPointX = parseFloat(String(elementPoint.x));
    const elementPointY = parseFloat(String(elementPoint.y));
    const offsetX = elementPointX - absPos.x;
    const offsetY = elementPointY - absPos.y;
    
    // Set currentPosition so that elementPoint aligns with cellTarget
    const newPosition = {
      x: cellTargetX - offsetX,
      y: cellTargetY - offsetY,
    };
    
    console.log(`[GridLayout] positionElementInCell - cell [${cell.row},${cell.column}]:`, {
      cellTarget: { x: cellTargetX, y: cellTargetY },
      elementName: elem.name || "unnamed",
      elementAbsPos: absPos,
      elementPoint: { x: elementPointX, y: elementPointY },
      offset: { x: offsetX, y: offsetY },
      newPosition
    });
    
    elem.currentPosition = newPosition;
    
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
    
    let cellsDebugSvg = '';
    
    // Optionally render cell boundaries for debugging
    if (this.gridConfig.debugShowCells && this.cells.length > 0) {
      const layoutAbsPos = this.getAbsolutePosition();
      
      this.cells.forEach((cell) => {
        const absX = layoutAbsPos.x + cell.x;
        const absY = layoutAbsPos.y + cell.y;
        
        cellsDebugSvg += `<rect x="${absX}" y="${absY}" width="${cell.width}" height="${cell.height}" fill="none" stroke="#ff0000" stroke-width="1" stroke-dasharray="4,4" opacity="0.5" pointer-events="none"/>`;
      });
    }
    
    return super.render() + cellsDebugSvg;
  }
}

