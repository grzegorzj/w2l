/**
 * New layout system - Square
 * A square shape (NewRect with equal width/height)
 */

import { NewRect, type NewRectConfig } from "./Rect.js";

export interface NewSquareConfig {
  size: number;
  style?: NewRectConfig["style"];
  boxModel?: NewRectConfig["boxModel"];
}

/**
 * Square shape - a specialized rectangle where width equals height
 */
export class NewSquare extends NewRect {
  constructor(config: NewSquareConfig) {
    super({
      width: config.size,
      height: config.size,
      style: config.style,
      boxModel: config.boxModel,
    });
  }

  /**
   * Get the side length of the square
   */
  get sideLength(): number {
    return this.width;
  }

  /**
   * Get the diagonal length of the square (side × √2)
   */
  get diagonalLength(): number {
    return this.width * Math.sqrt(2);
  }
}

