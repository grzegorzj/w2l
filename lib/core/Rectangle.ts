/**
 * New layout system - Rectangle class
 */

import { Shape } from "./Shape.js";
import { type Position } from "./Element.js";
import {
  type BoxModel,
  type ParsedBoxModel,
  parseBoxModel,
  type BoxReference,
} from "../utils/BoxModel.js";
import { BoxAccessor } from "../utils/BoxReference.js";
import { Style } from "../core/Stylable.js";

/**
 * Base class for rectangular elements.
 * Adds width, height, box model, and convenient position getters.
 *
 * Width and height represent the BORDER BOX size (total size).
 * Content size is calculated by subtracting padding and border.
 */
export abstract class Rectangle extends Shape {
  protected _borderBoxWidth: number;
  protected _borderBoxHeight: number;
  protected _boxModel: ParsedBoxModel;
  private _borderBox: BoxAccessor;
  private _paddingBox: BoxAccessor;
  private _contentBox: BoxAccessor;
  private _marginBox: BoxAccessor;

  constructor(
    width: number,
    height: number,
    boxModel?: BoxModel,
    style?: Partial<Style>
  ) {
    super(style);
    // Width and height are the border box dimensions (total size)
    this._borderBoxWidth = width;
    this._borderBoxHeight = height;
    this._boxModel = parseBoxModel(boxModel);

    // Create box accessors
    const self = this;
    this._borderBox = new BoxAccessor("border", () => ({
      getPositionForBox: (ref) => self.getPositionForBox(ref),
      getBoxSize: (ref) => self.getBoxSize(ref),
    }));
    this._paddingBox = new BoxAccessor("padding", () => ({
      getPositionForBox: (ref) => self.getPositionForBox(ref),
      getBoxSize: (ref) => self.getBoxSize(ref),
    }));
    this._contentBox = new BoxAccessor("content", () => ({
      getPositionForBox: (ref) => self.getPositionForBox(ref),
      getBoxSize: (ref) => self.getBoxSize(ref),
    }));
    this._marginBox = new BoxAccessor("margin", () => ({
      getPositionForBox: (ref) => self.getPositionForBox(ref),
      getBoxSize: (ref) => self.getBoxSize(ref),
    }));
  }

  /**
   * Gets the border box width (total width).
   */
  get width(): number {
    return this._borderBoxWidth;
  }

  /**
   * Gets the border box height (total height).
   */
  get height(): number {
    return this._borderBoxHeight;
  }

  /**
   * Gets the content width (width minus padding and border).
   */
  protected get contentWidth(): number {
    return (
      this._borderBoxWidth -
      this._boxModel.padding.left -
      this._boxModel.padding.right -
      this._boxModel.border.left -
      this._boxModel.border.right
    );
  }

  /**
   * Gets the content height (height minus padding and border).
   */
  protected get contentHeight(): number {
    return (
      this._borderBoxHeight -
      this._boxModel.padding.top -
      this._boxModel.padding.bottom -
      this._boxModel.border.top -
      this._boxModel.border.bottom
    );
  }

  get boxModel(): ParsedBoxModel {
    return this._boxModel;
  }

  /**
   * Access border box positions
   */
  get borderBox(): BoxAccessor {
    return this._borderBox;
  }

  /**
   * Access padding box positions
   */
  get paddingBox(): BoxAccessor {
    return this._paddingBox;
  }

  /**
   * Access content box positions
   */
  get contentBox(): BoxAccessor {
    return this._contentBox;
  }

  /**
   * Access margin box positions
   */
  get marginBox(): BoxAccessor {
    return this._marginBox;
  }

  /**
   * Get the position offset for a specific box reference.
   */
  protected getBoxOffset(reference: BoxReference): Position {
    let offsetX = 0;
    let offsetY = 0;

    switch (reference) {
      case "margin":
        // Margin box is the outermost
        offsetX = -this._boxModel.margin.left;
        offsetY = -this._boxModel.margin.top;
        break;
      case "border":
        // Border box
        offsetX = 0;
        offsetY = 0;
        break;
      case "padding":
        // Padding box (inside border)
        offsetX = this._boxModel.border.left;
        offsetY = this._boxModel.border.top;
        break;
      case "content":
        // Content box (inside padding)
        offsetX = this._boxModel.border.left + this._boxModel.padding.left;
        offsetY = this._boxModel.border.top + this._boxModel.padding.top;
        break;
    }

    return { x: offsetX, y: offsetY };
  }

  /**
   * Get absolute position for a specific box reference (default: content).
   * Returns world position, not relative to parent.
   */
  getPositionForBox(reference: BoxReference = "content"): Position {
    const absolutePos = this.getAbsolutePosition();
    const offset = this.getBoxOffset(reference);
    return {
      x: absolutePos.x + offset.x,
      y: absolutePos.y + offset.y,
    };
  }

  /**
   * Helper for positioning children in local coordinate space.
   * Converts a local offset (relative to this element) to an absolute position.
   *
   * Use this when positioning children to ensure correct coordinate space conversion.
   *
   * @param localX - X offset in this element's local space
   * @param localY - Y offset in this element's local space
   * @param boxReference - Which box to measure from (default: content)
   * @returns Absolute position in world coordinates
   */
  protected localToAbsolute(
    localX: number,
    localY: number,
    boxReference: BoxReference = "content"
  ): Position {
    const basePos = this.getAbsolutePosition();
    const offset = this.getBoxOffset(boxReference);
    return {
      x: basePos.x + offset.x + localX,
      y: basePos.y + offset.y + localY,
    };
  }

  /**
   * Get the size (width and height) for a specific box reference.
   */
  getBoxSize(reference: BoxReference): { width: number; height: number } {
    switch (reference) {
      case "content":
        return {
          width: this.contentWidth,
          height: this.contentHeight,
        };

      case "padding":
        return {
          width:
            this.contentWidth +
            this._boxModel.padding.left +
            this._boxModel.padding.right,
          height:
            this.contentHeight +
            this._boxModel.padding.top +
            this._boxModel.padding.bottom,
        };

      case "border":
        return {
          width: this._borderBoxWidth,
          height: this._borderBoxHeight,
        };

      case "margin":
        return {
          width:
            this._borderBoxWidth +
            this._boxModel.margin.left +
            this._boxModel.margin.right,
          height:
            this._borderBoxHeight +
            this._boxModel.margin.top +
            this._boxModel.margin.bottom,
        };
    }
  }

  /**
   * Gets the top-left corner position (border box - the visual boundary).
   */
  get topLeft(): Position {
    return this.borderBox.topLeft;
  }

  /**
   * Gets the top-right corner position (border box - the visual boundary).
   */
  get topRight(): Position {
    return this.borderBox.topRight;
  }

  /**
   * Gets the bottom-left corner position (border box - the visual boundary).
   */
  get bottomLeft(): Position {
    return this.borderBox.bottomLeft;
  }

  /**
   * Gets the bottom-right corner position (border box - the visual boundary).
   */
  get bottomRight(): Position {
    return this.borderBox.bottomRight;
  }

  /**
   * Gets the center position (border box - the visual boundary).
   */
  get center(): Position {
    return this.borderBox.center;
  }

  /**
   * Override to provide the center point for rotation.
   * Rectangles rotate around their center (border box center).
   */
  protected getRotationCenter(): { x: number; y: number } {
    const c = this.center;
    return { x: c.x, y: c.y };
  }

  /**
   * Get the transformed corners after rotation.
   * Returns the four corners in order: topLeft, topRight, bottomRight, bottomLeft
   */
  getCorners(): { x: number; y: number }[] {
    if (this._rotation === 0) {
      // No rotation - return regular corners
      return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
    }

    // Get center point for rotation
    const center = this.center;
    const cx = center.x;
    const cy = center.y;

    // Get original corners
    const corners = [
      this.topLeft,
      this.topRight,
      this.bottomRight,
      this.bottomLeft,
    ];

    // Rotate each corner around the center
    const rotationRad = (this._rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    return corners.map((corner) => {
      // Translate to origin
      const x = corner.x - cx;
      const y = corner.y - cy;

      // Rotate
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;

      // Translate back
      return {
        x: rotatedX + cx,
        y: rotatedY + cy,
      };
    });
  }

  /**
   * Gets the center-left position (border box - the visual boundary).
   */
  get centerLeft(): Position {
    return this.borderBox.centerLeft;
  }

  /**
   * Gets the center-right position (border box - the visual boundary).
   */
  get centerRight(): Position {
    return this.borderBox.centerRight;
  }

  /**
   * Gets the center-top position (border box - the visual boundary).
   */
  get centerTop(): Position {
    return this.borderBox.centerTop;
  }

  /**
   * Gets the center-bottom position (border box - the visual boundary).
   */
  get centerBottom(): Position {
    return this.borderBox.centerBottom;
  }

  /**
   * Convenient alias for centerTop.
   */
  get top(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerTop.
   */
  get topCenter(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottom(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottomCenter(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerLeft.
   */
  get left(): Position {
    return this.centerLeft;
  }

  /**
   * Convenient alias for centerRight.
   */
  get right(): Position {
    return this.centerRight;
  }

  /**
   * Get the bounding box of this rectangle in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    // If rotated, calculate bbox from actual corners
    if (this._rotation !== 0) {
      const corners = this.getCorners();
      const xs = corners.map((c) => c.x);
      const ys = corners.map((c) => c.y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }

    // Not rotated - simple bbox
    const absPos = this.getAbsolutePosition();
    return {
      minX: absPos.x,
      minY: absPos.y,
      maxX: absPos.x + this._borderBoxWidth,
      maxY: absPos.y + this._borderBoxHeight,
    };
  }
}
