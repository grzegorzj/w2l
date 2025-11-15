/**
 * Children Manager module for handling child element transformations.
 *
 * This module provides a helper class that manages child elements and their
 * transformations when a parent layout moves, rotates, or translates.
 *
 * @module layout
 * @internal
 */

import type { Element } from "../core/Element.js";

/**
 * Tracks the relationship between an element and its parent layout.
 * @internal
 */
interface ChildBinding {
  /** The child element */
  element: Element;
  /** Whether the element is layout-bound (true) or absolute-positioned (false) */
  isLayoutBound: boolean;
  /** Original position offset when added (for future use) */
  originalOffset?: { x: number; y: number };
}

/**
 * Helper class that manages child elements for layouts and containers.
 *
 * This class encapsulates all logic for:
 * - Tracking child elements
 * - Managing layout-bound vs absolute positioning
 * - Transforming children when parent moves/rotates
 *
 * @remarks
 * Used internally by Container and Layout classes to avoid code duplication.
 *
 * @internal
 */
export class ChildrenManager {
  private children: ChildBinding[] = [];
  private lastPosition: { x: number; y: number };
  private lastRotation: number;

  /**
   * Creates a new ChildrenManager.
   *
   * @param getPosition - Function to get current position of the parent
   * @param getRotation - Function to get current rotation of the parent
   */
  constructor(
    private getPosition: () => { x: number; y: number },
    private getRotation: () => number
  ) {
    this.lastPosition = { ...getPosition() };
    this.lastRotation = getRotation();
  }

  /**
   * Adds a child element.
   *
   * @param element - The element to add
   * @param parentContext - Reference to the parent (for setting _parentLayout)
   */
  addChild(element: Element, parentContext: any): void {
    const elementPos = (element as any).currentPosition || { x: 0, y: 0 };
    const parentPos = this.getPosition();

    this.children.push({
      element,
      isLayoutBound: true,
      originalOffset: {
        x: elementPos.x - parentPos.x,
        y: elementPos.y - parentPos.y,
      },
    });

    // Set parent relationship using the proper method
    if (typeof element.setParent === 'function') {
      element.setParent(parentContext);
    }

    // Also mark the element as belonging to this parent (legacy support)
    (element as any)._parentLayout = parentContext;
  }

  /**
   * Removes a child element.
   *
   * @param element - The element to remove
   */
  removeChild(element: Element): void {
    const index = this.children.findIndex((b) => b.element === element);
    if (index !== -1) {
      this.children.splice(index, 1);
      
      // Clear parent relationship
      if (typeof element.setParent === 'function') {
        element.setParent(null);
      }
      
      // Also clear legacy property
      delete (element as any)._parentLayout;
    }
  }

  /**
   * Gets all child elements.
   */
  getChildren(): Element[] {
    return this.children.map((b) => b.element);
  }

  /**
   * Gets all layout-bound child elements.
   */
  getLayoutBoundChildren(): Element[] {
    return this.children
      .filter((b) => b.isLayoutBound)
      .map((b) => b.element);
  }

  /**
   * Marks a child element as absolute-positioned.
   *
   * @param element - The element to mark
   */
  markChildAsAbsolute(element: Element): void {
    const binding = this.children.find((b) => b.element === element);
    if (binding) {
      binding.isLayoutBound = false;
    }
  }

  /**
   * Updates positions of all layout-bound children.
   * Call this after the parent has moved or rotated.
   */
  updateChildPositions(): void {
    const currentPos = this.getPosition();
    const currentRot = this.getRotation();

    const deltaX = currentPos.x - this.lastPosition.x;
    const deltaY = currentPos.y - this.lastPosition.y;
    const deltaRotation = currentRot - this.lastRotation;

    for (const binding of this.children) {
      if (binding.isLayoutBound) {
        const child = binding.element as any;

        // Move child by the same delta
        if (deltaX !== 0 || deltaY !== 0) {
          child.currentPosition = {
            x: child.currentPosition.x + deltaX,
            y: child.currentPosition.y + deltaY,
          };
        }

        // Rotate child by the same delta
        // Add a rotation transform to the child's transform array
        if (deltaRotation !== 0 && "transforms" in child) {
          child.transforms.push({
            type: "rotation",
            params: { deg: deltaRotation },
          });
        }

        // Recursively update children of children (if this child is a container/layout)
        if (typeof child.childrenManager !== 'undefined' && 
            typeof child.childrenManager.updateChildPositions === 'function') {
          child.childrenManager.updateChildPositions();
        }
      }
    }

    this.lastPosition = { ...currentPos };
    this.lastRotation = currentRot;
  }

  /**
   * Resets the tracking (updates last position/rotation without transforming children).
   * Useful when initializing or after manual position changes.
   */
  resetTracking(): void {
    this.lastPosition = { ...this.getPosition() };
    this.lastRotation = this.getRotation();
  }
}

