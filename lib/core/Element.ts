/**
 * New layout system - Base Element class
 */

import { getCurrentArtboard } from "./ArtboardContext.js";

export interface Position {
  x: number;
  y: number;
}

export type BoxReferenceType =
  | "contentBox"
  | "borderBox"
  | "paddingBox"
  | "marginBox"
  | "none";

export interface PositionConfig {
  relativeFrom: Position;
  relativeTo: Position;
  x: number;
  y: number;
  boxReference?: BoxReferenceType; // Track what box was used for relativeTo
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
export abstract class Element {
  protected _position: Position = { x: 0, y: 0 };
  protected _parent: Element | null = null;
  protected children: Element[] = [];
  protected _zIndex?: number;
  private static _creationCounter: number = 0;
  protected _creationIndex: number;
  protected _hasExplicitPosition: boolean = false;
  protected _positionBoxReference: BoxReferenceType = "none"; // Track what box reference was used
  protected _escapeContainerLayout: boolean = false; // If true, element escapes to artboard/freeform ancestor

  constructor() {
    this._creationIndex = Element._creationCounter++;
  }

  /**
   * Checks if this element should escape container layout systems.
   * Elements marked as escape will be added to the artboard instead of layout containers.
   */
  get escapeContainerLayout(): boolean {
    return this._escapeContainerLayout;
  }

  /**
   * Marks this element to escape container layout systems.
   * Use this for elements that need absolute positioning based on global geometry.
   * @internal
   */
  protected markEscapeContainerLayout(): void {
    this._escapeContainerLayout = true;
  }

  /**
   * Auto-add this element to the current artboard if one exists.
   * Should be called by leaf element classes (Shape subclasses) but not containers.
   *
   * Note: This is automatically overridden if you explicitly add the element to
   * a different parent (like a Container). Elements can only have ONE parent.
   *
   * @example
   * // Shape auto-adds to artboard
   * const circle = new Circle({ radius: 50 });
   *
   * // Adding to container removes from artboard (one parent only)
   * const container = new Container({ direction: "horizontal" });
   * container.add(circle); // Now circle's parent is container, not artboard
   *
   * @internal
   */
  protected autoAddToArtboard(): void {
    const artboard = getCurrentArtboard();
    if (artboard && artboard !== this) {
      artboard.addElement(this);
    }
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
   *
   * **Important**: An element can only have ONE parent at a time.
   * If the element is already a child of another element (including the artboard),
   * it will be automatically removed from that parent before being added here.
   * This prevents elements from appearing in multiple places.
   *
   * @example
   * // Shape auto-adds to artboard on creation
   * const circle = new Circle({ radius: 50 });
   *
   * // Adding to container removes it from artboard
   * const container = new Container({ direction: "horizontal" });
   * container.add(circle); // circle is now ONLY in container, not artboard
   */
  addElement(element: Element): void {
    // Enforce one-parent-only policy: Remove from previous parent if it has one
    // This is critical for auto-add to artboard feature - when a shape is created,
    // it auto-adds to artboard, but if you then add it to a container, we must
    // remove it from the artboard to prevent it appearing in both places
    let oldParentAbsolutePos = { x: 0, y: 0 };
    if (element._parent) {
      // Store old parent's absolute position for coordinate conversion
      oldParentAbsolutePos = element._parent.getAbsolutePosition();

      const oldParent = element._parent;
      const index = oldParent.children.indexOf(element);
      if (index > -1) {
        oldParent.children.splice(index, 1);
      }
      // Clear parent reference
      element._parent = null;
    }

    // If element has an explicit position, it needs to be converted to be relative to this parent
    // The element's current position is relative to its old parent (or absolute if it had no parent)
    if (element._hasExplicitPosition) {
      // Calculate element's absolute position (relative to old parent + old parent's absolute pos)
      const elementAbsolutePos = {
        x: element._position.x + oldParentAbsolutePos.x,
        y: element._position.y + oldParentAbsolutePos.y,
      };

      // Get this (new) parent's absolute position
      const thisAbsolutePos = this.getAbsolutePosition();

      // Convert to position relative to new parent
      element._position = {
        x: elementAbsolutePos.x - thisAbsolutePos.x,
        y: elementAbsolutePos.y - thisAbsolutePos.y,
      };
    }

    this.children.push(element);
    element._parent = this;
  }

  /**
   * Shorthand alias for addElement().
   * Useful for more concise code when adding children.
   *
   * @example
   * parent.add(new Rectangle({ width: 100, height: 100 }));
   */
  add(element: Element): Element {
    this.addElement(element);
    return element;
  }

  /**
   * Gets the parent element of this element.
   * Returns null if this element has no parent (root level).
   */
  getParent(): Element | null {
    return this._parent;
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

    // Store box reference information
    this._positionBoxReference = config.boxReference ?? "none";

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
    child: Element,
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
   * Get the bounding box of this element in absolute coordinates.
   * Returns null if the element doesn't have a defined size.
   */
  getBoundingBox(): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null {
    // This method should be overridden by subclasses that have a size
    return null;
  }

  /**
   * Get the bounding box of all children (recursively) in absolute coordinates.
   * Only includes children that should contribute to parent's auto-sizing.
   *
   * @param includeContentBoxOnly - If true, only include children positioned relative to contentBox
   */
  getChildrenBoundingBox(
    includeContentBoxOnly: boolean = false
  ): { minX: number; minY: number; maxX: number; maxY: number } | null {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let hasAnyChild = false;

    const processChild = (child: Element) => {
      // Skip if we only want contentBox-positioned children and this isn't one
      if (
        includeContentBoxOnly &&
        child._positionBoxReference !== "contentBox" &&
        child._positionBoxReference !== "none"
      ) {
        return;
      }

      const childBox = child.getBoundingBox();
      if (childBox) {
        minX = Math.min(minX, childBox.minX);
        minY = Math.min(minY, childBox.minY);
        maxX = Math.max(maxX, childBox.maxX);
        maxY = Math.max(maxY, childBox.maxY);
        hasAnyChild = true;
      }

      // Recursively process grandchildren
      for (const grandchild of child.children) {
        processChild(grandchild);
      }
    };

    for (const child of this.children) {
      processChild(child);
    }

    return hasAnyChild ? { minX, minY, maxX, maxY } : null;
  }

  /**
   * Check if this element should be included in parent's auto-sizing.
   * By default, elements positioned relative to contentBox are included.
   */
  shouldIncludeInParentAutoSize(): boolean {
    return (
      this._positionBoxReference === "contentBox" ||
      this._positionBoxReference === "none"
    );
  }

  /**
   * Renders the element to SVG.
   */
  abstract render(): string;
}
