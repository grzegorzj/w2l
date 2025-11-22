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
 *
 * Position model:
 * - _position is always relative to parent (or world if no parent)
 * - getAbsolutePosition() computes world position by walking up parent chain
 * - Position getters (topLeft, center, etc.) return absolute positions
 */
export abstract class NewElement {
  protected _position: Position = { x: 0, y: 0 };
  protected _parent: NewElement | null = null;
  protected children: NewElement[] = [];

  /**
   * Adds a child element to this element.
   * The child will be positioned relative to this element.
   */
  addElement(element: NewElement): void {
    this.children.push(element);
    element._parent = this;
  }

  /**
   * Gets the absolute (world) position of this element.
   * Walks up the parent chain to compute the final position.
   */
  protected getAbsolutePosition(): Position {
    if (!this._parent) {
      // No parent - our relative position is the absolute position
      return { ...this._position };
    }

    // Have parent - add our relative position to parent's absolute position
    const parentPos = this._parent.getAbsolutePosition();
    return {
      x: parentPos.x + this._position.x,
      y: parentPos.y + this._position.y,
    };
  }

  /**
   * Positions the element.
   * Sets the position relative to the parent (or world if no parent).
   *
   * The position is calculated by:
   * 1. Finding the offset between relativeFrom and relativeTo
   * 2. Adding the x,y offsets
   * 3. Setting this as the relative position to parent
   */
  position(config: PositionConfig): void {
    const offsetX = config.relativeTo.x - config.relativeFrom.x + config.x;
    const offsetY = config.relativeTo.y - config.relativeFrom.y + config.y;

    // Calculate current absolute position
    const currentAbsolute = this.getAbsolutePosition();

    // Calculate new absolute position
    const newAbsolute = {
      x: currentAbsolute.x + offsetX,
      y: currentAbsolute.y + offsetY,
    };

    // Convert to relative position
    if (this._parent) {
      const parentAbsolute = this._parent.getAbsolutePosition();
      this._position = {
        x: newAbsolute.x - parentAbsolute.x,
        y: newAbsolute.y - parentAbsolute.y,
      };
    } else {
      // No parent - absolute position equals relative position
      this._position = newAbsolute;
    }
  }

  /**
   * Renders the element to SVG.
   */
  abstract render(): string;
}
