/**
 * Columns utility - Creates a horizontal column layout
 * Built on top of NewContainer
 */

import { NewContainer, type SizeMode, type CrossAxisAlignment } from "./Container.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { type Style } from "../../core/Stylable.js";

export interface ColumnsConfig {
  count: number;
  columnWidth: SizeMode;
  height?: SizeMode;
  gutter?: number;
  alignment?: CrossAxisAlignment;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

export interface ColumnContainer {
  container: NewContainer;
  index: number;
}

/**
 * Columns layout utility
 * Creates a horizontal layout with multiple columns
 */
export class Columns {
  private mainContainer: NewContainer;
  private columns: ColumnContainer[] = [];
  private count: number;

  constructor(config: ColumnsConfig) {
    this.count = config.count;
    const gutter = config.gutter ?? 0;

    // Calculate total width
    const totalWidth =
      config.columnWidth === "auto"
        ? "auto"
        : (config.columnWidth as number) * config.count + gutter * (config.count - 1);

    // Create main container
    this.mainContainer = new NewContainer({
      width: totalWidth,
      height: config.height ?? "auto",
      direction: "horizontal",
      spacing: gutter,
      alignment: config.alignment,
      style: config.style,
      boxModel: config.boxModel,
    });

    // Create columns
    for (let i = 0; i < config.count; i++) {
      const column = new NewContainer({
        width: config.columnWidth,
        height: config.height ?? "auto",
        direction: "none",
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

