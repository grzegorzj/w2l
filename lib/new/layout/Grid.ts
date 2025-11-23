/**
 * Grid utility - Creates a grid layout with rows and columns
 * Built on top of NewContainer
 */

import { NewContainer, type SizeMode, type CrossAxisAlignment } from "./Container.js";
import { type BoxModel, parseBoxModel } from "../utils/BoxModel.js";
import { type Style } from "../../core/Stylable.js";

export interface GridConfig {
  rows: number;
  columns: number;
  cellWidth: SizeMode;
  cellHeight: SizeMode;
  gutter?: number;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

export interface GridCell {
  container: NewContainer;
  row: number;
  column: number;
}

/**
 * Grid layout utility
 * Creates a grid of cells that can be accessed by row/column
 */
export class Grid {
  private mainContainer: NewContainer;
  private cells: GridCell[][] = [];
  private rows: number;
  private columns: number;

  constructor(config: GridConfig) {
    this.rows = config.rows;
    this.columns = config.columns;
    const gutter = config.gutter ?? 0;

    // Parse cell box model to account for padding/border
    const parsedCellBoxModel = parseBoxModel(config.boxModel);
    const cellHorizontalPadding = parsedCellBoxModel.padding.left + parsedCellBoxModel.padding.right + 
                                   parsedCellBoxModel.border.left + parsedCellBoxModel.border.right;
    const cellVerticalPadding = parsedCellBoxModel.padding.top + parsedCellBoxModel.padding.bottom +
                                 parsedCellBoxModel.border.top + parsedCellBoxModel.border.bottom;

    // Calculate cell border box dimensions (cellWidth/Height are content sizes, add padding)
    const cellBorderBoxWidth = 
      config.cellWidth === "auto" 
        ? "auto" 
        : (config.cellWidth as number) + cellHorizontalPadding;
    
    const cellBorderBoxHeight = 
      config.cellHeight === "auto" 
        ? "auto" 
        : (config.cellHeight as number) + cellVerticalPadding;

    // Create main container (no style - just a layout wrapper)
    this.mainContainer = new NewContainer({
      width: "auto",  // Auto-size to fit rows
      height: "auto",  // Auto-size to fit rows
      direction: "vertical",
      spacing: gutter,
    });

    // Create rows
    for (let row = 0; row < config.rows; row++) {
      const rowContainer = new NewContainer({
        width: "auto",  // Auto-size to fit cells
        height: cellBorderBoxHeight,
        direction: "horizontal",
        spacing: gutter,
      });

      this.cells[row] = [];

      // Create cells in this row
      for (let col = 0; col < config.columns; col++) {
        const cell = new NewContainer({
          width: cellBorderBoxWidth,
          height: cellBorderBoxHeight,
          direction: "none",
          style: config.style,  // Apply style to cells
          boxModel: config.boxModel,  // Apply boxModel to cells
        });

        this.cells[row][col] = {
          container: cell,
          row,
          column: col,
        };

        rowContainer.addElement(cell);
      }

      this.mainContainer.addElement(rowContainer);
    }
  }

  /**
   * Get the main container (to add to artboard)
   */
  get container(): NewContainer {
    return this.mainContainer;
  }

  /**
   * Get a specific cell by row and column (0-indexed)
   */
  getCell(row: number, column: number): NewContainer {
    if (row < 0 || row >= this.rows || column < 0 || column >= this.columns) {
      throw new Error(`Cell (${row}, ${column}) is out of bounds`);
    }
    return this.cells[row][column].container;
  }

  /**
   * Get all cells as a 2D array
   */
  getCells(): GridCell[][] {
    return this.cells;
  }

  /**
   * Get all cells in a specific row
   */
  getRow(row: number): GridCell[] {
    if (row < 0 || row >= this.rows) {
      throw new Error(`Row ${row} is out of bounds`);
    }
    return this.cells[row];
  }

  /**
   * Get all cells in a specific column
   */
  getColumn(column: number): GridCell[] {
    if (column < 0 || column >= this.columns) {
      throw new Error(`Column ${column} is out of bounds`);
    }
    return this.cells.map((row) => row[column]);
  }
}

