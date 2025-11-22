/**
 * New layout system - Shape class
 */

import { NewElement, type PositionConfig } from "./NewElement.js";
import { Stylable, Style } from "../core/Stylable.js";

/**
 * Base class for all visual shapes.
 * Adds styling capability to elements.
 */
export abstract class NewShape extends NewElement implements Stylable {
  protected _style: Style = {};

  constructor(style?: Partial<Style>) {
    super();
    if (style) {
      this._style = { ...style };
    }
  }

  get style(): Style {
    return { ...this._style };
  }

  set style(value: Style) {
    this._style = { ...value };
  }

  applyStyle(style: Partial<Style>): void {
    this._style = { ...this._style, ...style };
  }
}

