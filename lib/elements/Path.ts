/**
 * Path - Custom SVG path element for complex shapes.
 * 
 * Allows rendering arbitrary SVG path data (d attribute).
 */

import { Element, type Position } from "../core/Element.js";
import { type Style, type Stylable, styleToSVGAttributes } from "../core/Stylable.js";

export interface PathConfig {
  /** SVG path data (d attribute) */
  d: string;
  /** Optional styling */
  style?: Partial<Style>;
}

/**
 * Path element for rendering custom SVG paths
 */
export class Path extends Element implements Stylable {
  private _d: string;
  private _style: Partial<Style>;

  constructor(config: PathConfig) {
    super();
    this._d = config.d;
    this._style = config.style || {};
  }

  get style(): Partial<Style> {
    return { ...this._style };
  }

  set style(value: Partial<Style>) {
    this._style = { ...value };
  }

  applyStyle(style: Partial<Style>): void {
    this._style = { ...this._style, ...style };
  }

  /**
   * Get the path data
   */
  get d(): string {
    return this._d;
  }

  /**
   * Set the path data
   */
  set d(value: string) {
    this._d = value;
  }

  /**
   * Bounding box calculation (simplified - uses position only)
   */
  get width(): number {
    return 0; // Path width is not well-defined
  }

  get height(): number {
    return 0; // Path height is not well-defined
  }

  // Position accessors (return current position)
  get topLeft(): Position {
    return this.getAbsolutePosition();
  }

  get topRight(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width, y: pos.y };
  }

  get bottomLeft(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x, y: pos.y + this.height };
  }

  get bottomRight(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width, y: pos.y + this.height };
  }

  get center(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width / 2, y: pos.y + this.height / 2 };
  }

  get topCenter(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width / 2, y: pos.y };
  }

  get bottomCenter(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width / 2, y: pos.y + this.height };
  }

  get centerLeft(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x, y: pos.y + this.height / 2 };
  }

  get centerRight(): Position {
    const pos = this.getAbsolutePosition();
    return { x: pos.x + this.width, y: pos.y + this.height / 2 };
  }

  get top(): Position {
    return this.topCenter;
  }

  get bottom(): Position {
    return this.bottomCenter;
  }

  get left(): Position {
    return this.centerLeft;
  }

  get right(): Position {
    return this.centerRight;
  }

  /**
   * Render the path as SVG
   */
  render(): string {
    const attrs = styleToSVGAttributes(this._style);
    const pos = this.getAbsolutePosition();
    const transform = `transform="translate(${pos.x},${pos.y})"`;
    return `<path d="${this._d}" ${attrs} ${transform}/>`;
  }
}

