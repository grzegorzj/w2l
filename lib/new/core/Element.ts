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
  protected _zIndex?: number;
  private static _creationCounter: number = 0;
  protected _creationIndex: number;
  protected _hasExplicitPosition: boolean = false;

  constructor() {
    this._creationIndex = NewElement._creationCounter++;
  }

  /**
   * Gets the z-index of this element.
   */
  get zIndex(): number | undefined {
    return this._zIndex;
  }

  /**
   * Sets the z-index of this element.
   * Higher values render on top.
   */
  set zIndex(value: number | undefined) {
    this._zIndex = value;
  }

  /**
   * Adds a child element to this element.
   * The child will be positioned relative to this element.
   */
  addElement(element: NewElement): void {
    // If element had no parent but has a position, convert from absolute to relative
    if (!element._parent && element._hasExplicitPosition) {
      const elementAbsolutePos = { ...element._position }; // This was absolute
      const thisAbsolutePos = this.getAbsolutePosition(); // Parent's absolute position
      
      // Convert to relative position
      element._position = {
        x: elementAbsolutePos.x - thisAbsolutePos.x,
        y: elementAbsolutePos.y - thisAbsolutePos.y,
      };
    }
    
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

    // Mark that this element has been explicitly positioned
    this._hasExplicitPosition = true;
  }

  /**
   * Helper for positioning a child element.
   * Correctly handles coordinate space conversion.
   *
   * @param child - The child element to position
   * @param childReference - The reference point on the child (e.g., child.topLeft)
   * @param parentReference - The absolute target position in world coordinates
   * @param offsetX - Additional X offset
   * @param offsetY - Additional Y offset
   */
  protected positionChildAt(
    child: NewElement,
    childReference: Position,
    parentReference: Position,
    offsetX: number = 0,
    offsetY: number = 0
  ): void {
    child.position({
      relativeFrom: childReference,
      relativeTo: parentReference,
      x: offsetX,
      y: offsetY,
    });
  }

  /**
   * Renders the element to SVG.
   */
  abstract render(): string;
}
