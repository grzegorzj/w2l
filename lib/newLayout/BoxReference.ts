/**
 * New layout system - Box Reference Helper
 * 
 * Provides explicit access to different box model layers.
 */

import { type Position } from "./NewElement.js";
import { type BoxReference as BoxRefType } from "./BoxModel.js";

/**
 * Helper class to access positions for a specific box model layer.
 */
export class BoxAccessor {
  constructor(
    private boxRef: BoxRefType,
    private getRectangle: () => {
      getPositionForBox: (ref: BoxRefType) => Position;
      getBoxSize: (ref: BoxRefType) => { width: number; height: number };
    }
  ) {}

  /**
   * Top-left corner
   */
  get topLeft(): Position {
    return this.getRectangle().getPositionForBox(this.boxRef);
  }

  /**
   * Top-right corner
   */
  get topRight(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width,
      y: pos.y,
    };
  }

  /**
   * Bottom-left corner
   */
  get bottomLeft(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x,
      y: pos.y + size.height,
    };
  }

  /**
   * Bottom-right corner
   */
  get bottomRight(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width,
      y: pos.y + size.height,
    };
  }

  /**
   * Center position
   */
  get center(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width / 2,
      y: pos.y + size.height / 2,
    };
  }

  /**
   * Center-left position
   */
  get centerLeft(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x,
      y: pos.y + size.height / 2,
    };
  }

  /**
   * Center-right position
   */
  get centerRight(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width,
      y: pos.y + size.height / 2,
    };
  }

  /**
   * Center-top position
   */
  get centerTop(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width / 2,
      y: pos.y,
    };
  }

  /**
   * Center-bottom position
   */
  get centerBottom(): Position {
    const rect = this.getRectangle();
    const pos = rect.getPositionForBox(this.boxRef);
    const size = rect.getBoxSize(this.boxRef);
    return {
      x: pos.x + size.width / 2,
      y: pos.y + size.height,
    };
  }
}

