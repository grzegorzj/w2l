/**
 * New layout system - Circle class
 */

import { NewShape } from "../core/Shape.js";
import { type Position } from "../core/Element.js";
import { styleToSVGAttributes, type Style } from "../../core/Stylable.js";

export interface NewCircleConfig {
  radius: number;
  style?: Partial<Style>;
}

/**
 * A simple circle element for testing positioning.
 */
export class NewCircle extends NewShape {
  private _radius: number;

  constructor(config: NewCircleConfig) {
    super(config.style);
    this._radius = config.radius;
  }

  get radius(): number {
    return this._radius;
  }

  /**
   * Gets the absolute center position of the circle.
   */
  get center(): Position {
    return this.getAbsolutePosition();
  }

  render(): string {
    const absolutePos = this.getAbsolutePosition();
    const attrs = styleToSVGAttributes(this._style);
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");

    const circleTag = `<circle cx="${absolutePos.x}" cy="${absolutePos.y}" r="${this._radius}" ${attrs}/>`;

    if (childrenHTML) {
      return `<g>
  ${circleTag}
  ${childrenHTML}
</g>`;
    }

    return circleTag;
  }

  /**
   * Get the bounding box of this circle in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const absCenter = this.center;
    return {
      minX: absCenter.x - this._radius,
      minY: absCenter.y - this._radius,
      maxX: absCenter.x + this._radius,
      maxY: absCenter.y + this._radius,
    };
  }
}
