/**
 * New layout system - Base Element class
 */

export interface Position {
  x: number;
  y: number;
}

export interface PositionConfig {
  relativeFrom: Position;
  relativeTo: Position;
  x: number;
  y: number;
}

/**
 * Base class for all elements in the new layout system.
 * Every element has a position in 2D space and can have children.
 */
export abstract class NewElement {
  protected _position: Position = { x: 0, y: 0 };
  protected _parent: NewElement | null = null;
  protected children: NewElement[] = [];
  protected _absolutePositioned: boolean = false;

  /**
   * Adds a child element to this element.
   * The child will be positioned relative to this element by default.
   */
  addElement(element: NewElement): void {
    this.children.push(element);
    element._parent = this;
  }

  /**
   * Gets the absolute position of this element (accounting for parent positions).
   */
  protected getAbsolutePosition(): Position {
    if (!this._parent || this._absolutePositioned) {
      return { ...this._position };
    }

    const parentPos = this._parent.getAbsolutePosition();
    return {
      x: parentPos.x + this._position.x,
      y: parentPos.y + this._position.y,
    };
  }

  /**
   * Positions the element relative to another point.
   * When called explicitly, marks the element as absolutely positioned.
   */
  position(config: PositionConfig): void {
    const offsetX = config.relativeTo.x - config.relativeFrom.x + config.x;
    const offsetY = config.relativeTo.y - config.relativeFrom.y + config.y;

    // If we have a parent and we're currently relatively positioned,
    // we need to convert to absolute first
    if (this._parent && !this._absolutePositioned) {
      const absolutePos = this.getAbsolutePosition();
      this._position = {
        x: absolutePos.x + offsetX,
        y: absolutePos.y + offsetY,
      };
    } else {
      this._position = {
        x: this._position.x + offsetX,
        y: this._position.y + offsetY,
      };
    }

    // Mark as absolutely positioned
    this._absolutePositioned = true;
  }

  /**
   * Renders the element to SVG.
   */
  abstract render(): string;
}
