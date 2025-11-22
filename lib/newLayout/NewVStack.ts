/**
 * New layout system - VStack (Vertical Stack)
 * 
 * LAYOUT STRATEGY: PROACTIVE
 * The parent (VStack) tells children where to position themselves.
 * Children are positioned vertically with spacing in between.
 */

import { NewRectangle } from "./NewRectangle.js";
import { type BoxModel } from "./BoxModel.js";
import { type Style } from "../core/Stylable.js";
import { NewElement } from "./NewElement.js";

/**
 * Horizontal alignment options for VStack children
 */
export type HorizontalAlignment = "left" | "center" | "right";

/**
 * Size mode: fixed or auto (reactive to children)
 */
export type SizeMode = number | "auto";

export interface NewVStackConfig {
  width: SizeMode;
  height: SizeMode;
  spacing?: number;
  alignment?: HorizontalAlignment;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

/**
 * Vertical stack layout that positions children vertically with spacing.
 * 
 * Strategy: PROACTIVE
 * - Parent controls child positioning
 * - Children are positioned in the content area (respects padding)
 * - Children are stacked top-to-bottom with spacing between them
 * - Supports horizontal alignment (left, center, right)
 * - Supports reactive sizing (auto width/height based on children)
 */
export class NewVStack extends NewRectangle {
  private spacing: number;
  private alignment: HorizontalAlignment;
  private _autoWidth: boolean;
  private _autoHeight: boolean;

  constructor(config: NewVStackConfig) {
    // Determine fixed vs auto sizing
    const width = typeof config.width === "number" ? config.width : 0;
    const height = typeof config.height === "number" ? config.height : 0;
    
    super(width, height, config.boxModel, config.style);
    
    this.spacing = config.spacing ?? 0;
    this.alignment = config.alignment ?? "left";
    this._autoWidth = config.width === "auto";
    this._autoHeight = config.height === "auto";
  }

  /**
   * Override addElement to position children as they're added.
   * This is the proactive strategy in action.
   */
  addElement(element: NewElement): void {
    // Add to children array first
    super.addElement(element);
    
    // Update auto-sizing if needed (BEFORE positioning)
    // This must happen before positioning so alignment calculations use correct dimensions
    const hadAutoSize = this._autoWidth || this._autoHeight;
    if (hadAutoSize) {
      this.updateAutoSize();
    }
    
    // Position all children (or just new one if no auto-sizing)
    // When auto-sizing changes dimensions, we must reposition ALL children
    // because alignment depends on the container width
    if (hadAutoSize) {
      this.layoutAllChildren();
    } else {
      // No auto-sizing: just position the new child
      let currentY = 0;
      for (let i = 0; i < this.children.length - 1; i++) {
        currentY += this.getChildHeight(this.children[i]) + this.spacing;
      }
      this.positionChild(element, currentY);
    }
  }

  /**
   * Layout all children from scratch.
   * Used when auto-sizing changes dimensions and all children need repositioning.
   */
  private layoutAllChildren(): void {
    let currentY = 0;
    
    for (const child of this.children) {
      this.positionChild(child, currentY);
      currentY += this.getChildHeight(child) + this.spacing;
    }
  }

  /**
   * Get the height of a child element
   */
  private getChildHeight(child: NewElement): number {
    if (typeof (child as any).height === 'number') {
      return (child as any).height;
    } else if (typeof (child as any).radius === 'number') {
      return (child as any).radius * 2;
    }
    return 0;
  }

  /**
   * Get the width of a child element
   */
  private getChildWidth(child: NewElement): number {
    if (typeof (child as any).width === 'number') {
      return (child as any).width;
    } else if (typeof (child as any).radius === 'number') {
      return (child as any).radius * 2;
    }
    return 0;
  }

  /**
   * Update auto-sizing based on children
   */
  private updateAutoSize(): void {
    if (this._autoWidth) {
      // Calculate max child width + padding + border
      let maxWidth = 0;
      for (const child of this.children) {
        maxWidth = Math.max(maxWidth, this.getChildWidth(child));
      }
      this._borderBoxWidth = 
        maxWidth + 
        this._boxModel.padding.left + this._boxModel.padding.right +
        this._boxModel.border.left + this._boxModel.border.right;
    }

    if (this._autoHeight) {
      // Calculate total height: sum of children + spacing + padding + border
      let totalHeight = 0;
      for (let i = 0; i < this.children.length; i++) {
        totalHeight += this.getChildHeight(this.children[i]);
        if (i < this.children.length - 1) {
          totalHeight += this.spacing;
        }
      }
      this._borderBoxHeight = 
        totalHeight +
        this._boxModel.padding.top + this._boxModel.padding.bottom +
        this._boxModel.border.top + this._boxModel.border.bottom;
    }
  }

  /**
   * Position a single child at the specified Y offset.
   * This implements the proactive positioning strategy.
   * 
   * The parent tells the child where to position itself by providing
   * the target position. The child implements the actual positioning.
   */
  private positionChild(child: NewElement, offsetY: number): void {
    // Get the alignment point on the child based on alignment setting
    const childReference = this.getChildAlignmentPoint(child);
    
    // Calculate X offset based on alignment
    const offsetX = this.getAlignmentOffsetX(child);
    
    // Convert local coordinates to absolute world coordinates
    // This correctly handles nesting by using the helper method
    const targetPosition = this.localToAbsolute(offsetX, offsetY, "content");
    
    // Position child at the calculated absolute position
    // The child.position() method will convert this back to relative-to-parent
    child.position({
      relativeFrom: childReference,
      relativeTo: targetPosition,
      x: 0,
      y: 0,
    });
  }

  /**
   * Get the alignment point on a child element based on current alignment setting
   */
  private getChildAlignmentPoint(child: NewElement): { x: number; y: number } {
    if ((child as any).borderBox) {
      // Rectangle-based element
      const rect = child as any;
      switch (this.alignment) {
        case "left":
          return rect.borderBox.topLeft;
        case "center":
          return rect.borderBox.centerTop;
        case "right":
          return rect.borderBox.topRight;
      }
    } else {
      // Circle or other element - use center
      return (child as any).center;
    }
  }

  /**
   * Calculate the X offset for alignment within the content area.
   * This offset represents where the alignment point should be positioned.
   */
  private getAlignmentOffsetX(child: NewElement): number {
    const availableWidth = this.contentWidth;

    switch (this.alignment) {
      case "left":
        return 0; // Left edge of content area
      case "center":
        return availableWidth / 2; // Center of content area
      case "right":
        return availableWidth; // Right edge of content area
    }
  }

  render(): string {
    // Render the container background (if styled)
    const bgSVG = this._style && Object.keys(this._style).length > 0
      ? `<rect x="${this.borderBox.topLeft.x}" y="${this.borderBox.topLeft.y}" width="${this.width}" height="${this.height}" fill="${this._style.fill || 'none'}" stroke="${this._style.stroke || 'none'}" stroke-width="${this._style.strokeWidth || 0}"/>\n`
      : '';
    
    // Render children
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");
    
    if (childrenHTML) {
      return `<g>
  ${bgSVG}${childrenHTML}
</g>`;
    }
    
    return bgSVG;
  }
}

