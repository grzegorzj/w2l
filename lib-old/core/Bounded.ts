/**
 * Bounded element module providing layout box model capabilities.
 *
 * This module defines the Bounded class for elements that occupy rectangular
 * space and support CSS-like box model properties (margin, padding).
 *
 * @module core
 */

import { Element } from "./Element.js";
import type { Point } from "./Artboard.js";
import { parseUnit } from "./units.js";

/**
 * Represents spacing values for margin or padding.
 * Supports CSS-style shorthand notation.
 *
 * @example
 * ```typescript
 * // All sides equal
 * const spacing1: Spacing = "20px";
 * const spacing2: Spacing = 20;
 *
 * // Individual sides
 * const spacing3: Spacing = {
 *   top: "10px",
 *   right: "20px",
 *   bottom: "10px",
 *   left: "20px"
 * };
 * ```
 */
export type Spacing =
  | string
  | number
  | {
      top?: string | number;
      right?: string | number;
      bottom?: string | number;
      left?: string | number;
    };

/**
 * Parsed spacing values in pixels for all four sides.
 */
export interface ParsedSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Abstract base class for elements that occupy bounded rectangular space.
 *
 * Bounded extends Element to add CSS-like box model properties including
 * margin and padding. This makes it suitable for elements that need layout
 * awareness, such as shapes, containers, and other visual components.
 *
 * @remarks
 * The name "Bounded" reflects that these elements have defined boundaries
 * in space and support spacing properties. This is a better term than
 * "layoutable" as it describes what the element *is* rather than what it *does*.
 *
 * Margin affects positioning when using position() with respectMargin option.
 * Padding affects the internal content area of container-like elements.
 *
 * @example
 * ```typescript
 * class MyBoundedElement extends Bounded {
 *   constructor() {
 *     super();
 *     this.margin = "20px";
 *     this.padding = { top: 10, left: 10, right: 10, bottom: 10 };
 *   }
 *
 *   get center(): Point {
 *     return { x: "0px", y: "0px" };
 *   }
 *
 *   render(): string {
 *     return "";
 *   }
 * }
 * ```
 */
export abstract class Bounded extends Element {
  protected _margin: Spacing = 0;
  protected _padding: Spacing = 0;

  /**
   * Constructor to pass name up to Element.
   */
  constructor(name?: string) {
    super(name);
  }

  /**
   * Gets the margin spacing for this element.
   *
   * @returns The current margin value
   */
  get margin(): Spacing {
    return this._margin;
  }

  /**
   * Sets the margin spacing for this element.
   *
   * Margin creates space around the element's outer edge.
   * It affects positioning when using position() with respectMargin: true.
   *
   * @param value - The margin value (supports CSS-like shorthand)
   *
   * @example
   * Set uniform margin
   * ```typescript
   * element.margin = "20px";
   * element.margin = 20;
   * ```
   *
   * @example
   * Set individual sides
   * ```typescript
   * element.margin = {
   *   top: "10px",
   *   right: "20px",
   *   bottom: "10px",
   *   left: "20px"
   * };
   * ```
   */
  set margin(value: Spacing) {
    this._margin = value;
  }

  /**
   * Gets the padding spacing for this element.
   *
   * @returns The current padding value
   */
  get padding(): Spacing {
    return this._padding;
  }

  /**
   * Sets the padding spacing for this element.
   *
   * Padding creates space between the element's content and its border.
   * For containers, this affects where child elements are positioned.
   *
   * @param value - The padding value (supports CSS-like shorthand)
   *
   * @example
   * Set uniform padding
   * ```typescript
   * container.padding = "20px";
   * container.padding = 20;
   * ```
   *
   * @example
   * Set individual sides
   * ```typescript
   * container.padding = {
   *   top: "10px",
   *   right: "20px",
   *   bottom: "10px",
   *   left: "20px"
   * };
   * ```
   */
  set padding(value: Spacing) {
    this._padding = value;
  }

  /**
   * Parses a spacing value into individual side values in pixels.
   *
   * @param spacing - The spacing value to parse
   * @returns Parsed spacing values for all four sides
   * @internal
   */
  protected parseSpacing(spacing: Spacing): ParsedSpacing {
    if (typeof spacing === "string" || typeof spacing === "number") {
      const value = parseUnit(spacing);
      return { top: value, right: value, bottom: value, left: value };
    }

    return {
      top: parseUnit(spacing.top || 0),
      right: parseUnit(spacing.right || 0),
      bottom: parseUnit(spacing.bottom || 0),
      left: parseUnit(spacing.left || 0),
    };
  }

  /**
   * Gets the parsed margin values in pixels.
   *
   * @returns The margin for each side in pixels
   */
  get marginBox(): ParsedSpacing {
    return this.parseSpacing(this._margin);
  }

  /**
   * Gets the parsed padding values in pixels.
   *
   * @returns The padding for each side in pixels
   */
  get paddingBox(): ParsedSpacing {
    return this.parseSpacing(this._padding);
  }

  /**
   * Gets the content area bounds (accounting for padding).
   *
   * @returns The content area point, offset by padding
   *
   * @remarks
   * For containers, this is where child elements should be positioned.
   * Subclasses should override this if they have specific content areas.
   */
  get contentArea(): Point {
    const padding = this.paddingBox;
    return this.toAbsolutePoint(padding.left, padding.top);
  }

  /**
   * CSS Box Model Support
   * 
   * Returns position objects for different box model layers:
   * - borderBox: The outer edge of the element (default positioning system)
   * - contentBox: The content area inside padding
   * - marginBox: The area including margins (outside the border)
   * 
   * Each returns an object with common position points: topLeft, center, bottomRight, etc.
   */

  /**
   * Gets the border box - the outer edge of the element.
   * This is the default box model layer and matches the standard positioning system.
   * 
   * @returns Object with position points for the border box
   * 
   * @example
   * ```typescript
   * const rect = new Rectangle({ width: 200, height: 100 });
   * 
   * // Position another element at the border box edge
   * otherElement.position({
   *   relativeFrom: otherElement.center,
   *   relativeTo: rect.borderBox.topLeft,
   *   x: 0,
   *   y: 0
   * });
   * ```
   */
  getBorderBox() {
    const elem = this as any;
    const width = elem.width || 0;
    const height = elem.height || 0;
    const absPos = this.getAbsolutePosition();
    
    return {
      // Corners
      topLeft: { x: `${absPos.x}px`, y: `${absPos.y}px` },
      topRight: { x: `${absPos.x + width}px`, y: `${absPos.y}px` },
      bottomLeft: { x: `${absPos.x}px`, y: `${absPos.y + height}px` },
      bottomRight: { x: `${absPos.x + width}px`, y: `${absPos.y + height}px` },
      
      // Edge centers
      topCenter: { x: `${absPos.x + width / 2}px`, y: `${absPos.y}px` },
      bottomCenter: { x: `${absPos.x + width / 2}px`, y: `${absPos.y + height}px` },
      leftCenter: { x: `${absPos.x}px`, y: `${absPos.y + height / 2}px` },
      rightCenter: { x: `${absPos.x + width}px`, y: `${absPos.y + height / 2}px` },
      
      // Center
      center: { x: `${absPos.x + width / 2}px`, y: `${absPos.y + height / 2}px` },
      
      // Dimensions
      width,
      height,
    };
  }

  /**
   * Gets the content box - the area inside padding where content is placed.
   * 
   * @returns Object with position points for the content box
   * 
   * @example
   * ```typescript
   * const container = new Rectangle({
   *   width: 200,
   *   height: 100,
   *   padding: "20px"
   * });
   * 
   * // Position content inside the padding
   * text.position({
   *   relativeFrom: text.topLeft,
   *   relativeTo: container.contentBox.topLeft,
   *   x: 0,
   *   y: 0
   * });
   * ```
   */
  getContentBox() {
    const elem = this as any;
    const borderWidth = elem.width || 0;
    const borderHeight = elem.height || 0;
    const padding = this.paddingBox;
    const absPos = this.getAbsolutePosition();
    
    const contentLeft = absPos.x + padding.left;
    const contentTop = absPos.y + padding.top;
    const contentWidth = borderWidth - padding.left - padding.right;
    const contentHeight = borderHeight - padding.top - padding.bottom;
    const contentRight = contentLeft + contentWidth;
    const contentBottom = contentTop + contentHeight;
    const contentCenterX = contentLeft + contentWidth / 2;
    const contentCenterY = contentTop + contentHeight / 2;
    
    return {
      // Corners
      topLeft: { x: `${contentLeft}px`, y: `${contentTop}px` },
      topRight: { x: `${contentRight}px`, y: `${contentTop}px` },
      bottomLeft: { x: `${contentLeft}px`, y: `${contentBottom}px` },
      bottomRight: { x: `${contentRight}px`, y: `${contentBottom}px` },
      
      // Edge centers
      topCenter: { x: `${contentCenterX}px`, y: `${contentTop}px` },
      bottomCenter: { x: `${contentCenterX}px`, y: `${contentBottom}px` },
      leftCenter: { x: `${contentLeft}px`, y: `${contentCenterY}px` },
      rightCenter: { x: `${contentRight}px`, y: `${contentCenterY}px` },
      
      // Center
      center: { x: `${contentCenterX}px`, y: `${contentCenterY}px` },
      
      // Dimensions
      width: contentWidth,
      height: contentHeight,
    };
  }

  /**
   * Gets the margin box - the area including margins around the element.
   * 
   * @returns Object with position points for the margin box
   * 
   * @example
   * ```typescript
   * const box = new Rectangle({
   *   width: 200,
   *   height: 100,
   *   margin: "20px"
   * });
   * 
   * // Position respecting the margin area
   * otherElement.position({
   *   relativeFrom: otherElement.topLeft,
   *   relativeTo: box.marginBox.bottomLeft,
   *   x: 0,
   *   y: 0
   * });
   * ```
   */
  getMarginBox() {
    const elem = this as any;
    const borderWidth = elem.width || 0;
    const borderHeight = elem.height || 0;
    const margin = this.marginBox;  // This uses the getter which returns ParsedSpacing
    const absPos = this.getAbsolutePosition();
    
    const marginLeft = absPos.x - margin.left;
    const marginTop = absPos.y - margin.top;
    const marginWidth = borderWidth + margin.left + margin.right;
    const marginHeight = borderHeight + margin.top + margin.bottom;
    const marginRight = marginLeft + marginWidth;
    const marginBottom = marginTop + marginHeight;
    const marginCenterX = marginLeft + marginWidth / 2;
    const marginCenterY = marginTop + marginHeight / 2;
    
    return {
      // Corners
      topLeft: { x: `${marginLeft}px`, y: `${marginTop}px` },
      topRight: { x: `${marginRight}px`, y: `${marginTop}px` },
      bottomLeft: { x: `${marginLeft}px`, y: `${marginBottom}px` },
      bottomRight: { x: `${marginRight}px`, y: `${marginBottom}px` },
      
      // Edge centers
      topCenter: { x: `${marginCenterX}px`, y: `${marginTop}px` },
      bottomCenter: { x: `${marginCenterX}px`, y: `${marginBottom}px` },
      leftCenter: { x: `${marginLeft}px`, y: `${marginCenterY}px` },
      rightCenter: { x: `${marginRight}px`, y: `${marginCenterY}px` },
      
      // Center
      center: { x: `${marginCenterX}px`, y: `${marginCenterY}px` },
      
      // Dimensions
      width: marginWidth,
      height: marginHeight,
    };
  }

  /**
   * Convenience property for accessing the border box.
   * Equivalent to getBorderBox().
   */
  get borderBox() {
    return this.getBorderBox();
  }

  /**
   * Convenience property for accessing the content box.
   * Equivalent to getContentBox().
   */
  get contentBox() {
    return this.getContentBox();
  }

  /**
   * Gets the bounding box of this element.
   * 
   * Default implementation for rectangular bounded elements.
   * Shapes with special geometry (circles, polygons) should override this.
   * 
   * @param axisAligned - Whether to return axis-aligned bounding box
   * @returns The bounding box
   */
  getBoundingBox(axisAligned: boolean = true): import("./Element.js").BoundingBox {
    // Default implementation for rectangular elements
    // Subclasses should override if they have special geometry or support rotation
    const elem = this as any;
    const width = elem.width || elem.textWidth || 0;
    const height = elem.height || elem.textHeight || 0;
    
    return {
      topLeft: this.toAbsolutePoint(0, 0),
      bottomRight: this.toAbsolutePoint(width, height),
      width,
      height,
      isAxisAligned: true,
    };
  }

  /**
   * Gets the alignment point for this element when positioned by layout containers.
   *
   * **Alignment Semantics (Edge-to-Edge by Default):**
   * - `"top"` → element's **TOP edge** | `"bottom"` → **BOTTOM edge**  
   * - `"left"` → element's **LEFT edge** | `"right"` → **RIGHT edge**
   * - `"center"` → element's **CENTER point**
   *
   * This differs from `.position()` where you choose `relativeFrom` explicitly.
   * Layouts use this method for automatic child positioning with proper edge alignment.
   *
   * **9-Point System:** left+top → topLeft | left+center → leftCenter | center+center → center | etc.
   *
   * **Override for Custom Behavior:** Subclasses can override to always use center or custom logic.
   *
   * @param horizontalAlign - Horizontal alignment: "left", "center", or "right"
   * @param verticalAlign - Vertical alignment: "top", "center", or "bottom"
   * @returns The point to use for alignment
   *
   * @example
   * ```typescript
   * // GridLayout uses this internally
   * const point = element.getAlignmentPoint("left", "top"); // → top-left edge
   * 
   * // Custom: always center
   * class Custom extends Rectangle {
   *   getAlignmentPoint() { return this.center; }
   * }
   * ```
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // For Bounded elements, we need access to width/height
    // These should be available in subclasses (Rectangle, Circle, etc.)
    const width = (this as any).width || 0;
    const height = (this as any).height || 0;
    const radius = (this as any).radius || 0;

    // Get absolute position to return coordinates in absolute space
    const absPos = this.getAbsolutePosition();

    // For circles, use radius-based calculations
    // Note: Circle's currentPosition is already at the center
    if (radius > 0) {
      let x = absPos.x;
      let y = absPos.y;

      // Horizontal positioning
      if (horizontalAlign === "left") {
        x = absPos.x - radius;
      } else if (horizontalAlign === "right") {
        x = absPos.x + radius;
      }
      // "center" uses x = absPos.x (already set)

      // Vertical positioning
      if (verticalAlign === "top") {
        y = absPos.y - radius;
      } else if (verticalAlign === "bottom") {
        y = absPos.y + radius;
      }
      // "center" uses y = absPos.y (already set)

      return { x: `${x}px`, y: `${y}px` };
    }

    // For rectangular elements
    let x = absPos.x;
    let y = absPos.y;

    // Horizontal positioning
    if (horizontalAlign === "center") {
      x = absPos.x + width / 2;
    } else if (horizontalAlign === "right") {
      x = absPos.x + width;
    }
    // "left" uses x = absPos.x (already set)

    // Vertical positioning
    if (verticalAlign === "center") {
      y = absPos.y + height / 2;
    } else if (verticalAlign === "bottom") {
      y = absPos.y + height;
    }
    // "top" uses y = absPos.y (already set)

    return { x: `${x}px`, y: `${y}px` };
  }
}
