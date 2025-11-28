/**
 * New layout system - Rect shape element
 */

import { Rectangle } from "../core/Rectangle.js";
import { styleToSVGAttributes, type Style } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

export interface RectConfig {
  width: number;
  height: number;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

/**
 * A rectangular shape element.
 * Basic primitive - no default styling.
 */
export class Rect extends Rectangle {
  constructor(config: RectConfig) {
    super(config.width, config.height, config.boxModel, config.style);
  }

  render(): string {
    const attrs = styleToSVGAttributes(this._style);
    const pos = this.getPositionForBox("border");
    const size = this.getBoxSize("border");
    const transform = this.getTransformAttribute();
    
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");
    
    const rectTag = `<rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" ${attrs} ${transform}/>`;
    
    if (childrenHTML) {
      return `<g>
  ${rectTag}
  ${childrenHTML}
</g>`;
    }
    
    return rectTag;
  }
}

