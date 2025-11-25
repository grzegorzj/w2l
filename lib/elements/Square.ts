/**
 * New layout system - Square
 * A square shape (Rect with equal width/height)
 */

import { Rect, type RectConfig } from "./Rect.js";

export interface SquareConfig {
  size: number;
  style?: RectConfig["style"];
  boxModel?: RectConfig["boxModel"];
}

/**
 * Square shape - a specialized rectangle where width equals height
 */
export class Square extends Rect {
  constructor(config: SquareConfig) {
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

