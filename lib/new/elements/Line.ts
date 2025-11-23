/**
 * New layout system - Line
 * A line segment between two points
 */

import { NewShape } from "../core/Shape.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type Position } from "../core/Element.js";

export interface NewLineConfig {
  start: Position;
  end: Position;
  style?: Partial<Style>;
}

/**
 * Line shape connecting two points
 */
export class NewLine extends NewShape {
  private startPoint: Position;
  private endPoint: Position;

  constructor(config: NewLineConfig) {
    super(config.style);
    this.startPoint = config.start;
    this.endPoint = config.end;
  }

  /**
   * Get the center point of the line
   */
  get center(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + (this.startPoint.x + this.endPoint.x) / 2,
      y: absPos.y + (this.startPoint.y + this.endPoint.y) / 2,
    };
  }

  /**
   * Get the start point in absolute coordinates
   */
  get start(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.startPoint.x,
      y: absPos.y + this.startPoint.y,
    };
  }

  /**
   * Get the end point in absolute coordinates
   */
  get end(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.endPoint.x,
      y: absPos.y + this.endPoint.y,
    };
  }

  /**
   * Get the length of the line
   */
  get length(): number {
    const dx = this.endPoint.x - this.startPoint.x;
    const dy = this.endPoint.y - this.startPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  render(): string {
    const start = this.start;
    const end = this.end;
    const attrs = styleToSVGAttributes(this._style);
    
    return `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" ${attrs}/>`;
  }
}

