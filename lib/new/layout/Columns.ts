/**
 * Columns utility - Creates a horizontal column layout
 * Built on top of NewContainer
 */

import { NewContainer, type SizeMode, type HorizontalAlignment, type VerticalAlignment } from "./Container.js";
import { type BoxModel, parseBoxModel } from "../utils/BoxModel.js";
import { type Style } from "../../core/Stylable.js";

export interface ColumnsConfig {
  count: number;
  columnWidth: SizeMode;
  height?: SizeMode;
  gutter?: number;
  verticalAlignment?: VerticalAlignment; // Vertical alignment of items within each column (top/center/bottom)
  horizontalAlignment?: HorizontalAlignment; // Horizontal alignment of items within each column (left/center/right)
  columnSpacing?: number; // Vertical spacing between items within a column
  columnStyle?: Partial<Style>; // Style for individual column containers
  columnBoxModel?: BoxModel; // Box model for individual column containers
  style?: Partial<Style>; // Style for the main container
  boxModel?: BoxModel; // Box model for the main container
}

export interface ColumnContainer {
  container: NewContainer;
  index: number;
}

/**
 * Columns layout utility
 * Creates a horizontal layout with multiple columns that auto-stack their children vertically
 */
export class Columns {
  private mainContainer: NewContainer;
  private columns: ColumnContainer[] = [];
  private count: number;

  constructor(config: ColumnsConfig) {
    this.count = config.count;
    const gutter = config.gutter ?? 0;

    // Parse box models to account for padding/border in total size
    const parsedBoxModel = parseBoxModel(config.boxModel);
    const horizontalPadding = parsedBoxModel.padding.left + parsedBoxModel.padding.right + 
                              parsedBoxModel.border.left + parsedBoxModel.border.right;
    const verticalPadding = parsedBoxModel.padding.top + parsedBoxModel.padding.bottom +
                            parsedBoxModel.border.top + parsedBoxModel.border.bottom;

    // Parse column box model to account for padding/border
    const parsedColumnBoxModel = parseBoxModel(config.columnBoxModel);
    const columnHorizontalPadding = parsedColumnBoxModel.padding.left + parsedColumnBoxModel.padding.right + 
                                     parsedColumnBoxModel.border.left + parsedColumnBoxModel.border.right;
    const columnVerticalPadding = parsedColumnBoxModel.padding.top + parsedColumnBoxModel.padding.bottom +
                                   parsedColumnBoxModel.border.top + parsedColumnBoxModel.border.bottom;

    // Calculate actual column border box size (columnWidth is content size, add padding)
    const actualColumnWidth = 
      config.columnWidth === "auto" 
        ? "auto" 
        : (config.columnWidth as number) + columnHorizontalPadding;

    // Calculate total width (all columns + gutters + main padding)
    const totalWidth =
      config.columnWidth === "auto"
        ? "auto"
        : (actualColumnWidth as number) * config.count + gutter * (config.count - 1) + horizontalPadding;

    // Calculate total height (column height + main padding)
    const totalHeight = 
      config.height === undefined || config.height === "auto"
        ? "auto"
        : (config.height as number) + columnVerticalPadding + verticalPadding;

    // Create main container (horizontal layout of columns)
    this.mainContainer = new NewContainer({
      width: totalWidth,
      height: totalHeight,
      direction: "horizontal",
      spacing: gutter,
      // No alignment needed for main container (columns always start at top)
      style: config.style,
      boxModel: config.boxModel,
    });

    // Calculate column border box height
    const columnBorderBoxHeight = 
      config.height === undefined || config.height === "auto"
        ? "auto"
        : (config.height as number) + columnVerticalPadding;

    // Create columns as vertical containers that auto-stack children
    for (let i = 0; i < config.count; i++) {
      const column = new NewContainer({
        width: actualColumnWidth,
        height: columnBorderBoxHeight,
        direction: "vertical",
        spacing: config.columnSpacing ?? 0,
        horizontalAlignment: config.horizontalAlignment ?? "center", // Horizontal alignment of items
        verticalAlignment: config.verticalAlignment ?? "top", // Vertical alignment of items
        style: config.columnStyle,
        boxModel: config.columnBoxModel,
      });

      this.columns.push({
        container: column,
        index: i,
      });

      this.mainContainer.addElement(column);
    }
  }

  /**
   * Get the main container (to add to artboard)
   */
  get container(): NewContainer {
    return this.mainContainer;
  }

  /**
   * Get a specific column by index (0-indexed)
   */
  getColumn(index: number): NewContainer {
    if (index < 0 || index >= this.count) {
      throw new Error(`Column ${index} is out of bounds`);
    }
    return this.columns[index].container;
  }

  /**
   * Get all columns
   */
  getColumns(): ColumnContainer[] {
    return this.columns;
  }
}

