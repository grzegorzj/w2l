/**
 * New layout system - Circle class
 */

import { NewShape } from "./NewShape.js";
import { type Position } from "./NewElement.js";
import { styleToSVGAttributes, type Style } from "../core/Stylable.js";

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

  get center(): Position {
    return {
      x: this._position.x,
      y: this._position.y,
    };
  }

  render(): string {
    const attrs = styleToSVGAttributes(this._style);
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");

    const circleTag = `<circle cx="${this._position.x}" cy="${this._position.y}" r="${this._radius}" ${attrs}/>`;

    if (childrenHTML) {
      return `<g>
  ${circleTag}
  ${childrenHTML}
</g>`;
    }

    return circleTag;
  }
}
