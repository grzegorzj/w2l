/**
 * New layout system - Container (Base for layout containers)
 * 
 * LAYOUT STRATEGY: PROACTIVE
 * The parent (Container) tells children where to position themselves.
 * Children are positioned along the main axis with spacing.
 */

import { NewRectangle } from "../core/Rectangle.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { type Style } from "../../core/Stylable.js";
import { NewElement, type Position } from "../core/Element.js";

/**
 * Container direction - how children are laid out
 */
export type ContainerDirection = "horizontal" | "vertical" | "none";

/**
 * Alignment on the cross-axis
 * - For vertical containers: horizontal alignment (left, center, right)
 * - For horizontal containers: vertical alignment (top, center, bottom)
 */
export type CrossAxisAlignment = "start" | "center" | "end";

/**
 * Size mode: fixed or auto (reactive to children)
 */
export type SizeMode = number | "auto";

export interface NewContainerConfig {
  width: SizeMode;
  height: SizeMode;
  direction?: ContainerDirection;
  spacing?: number;
  spread?: boolean;
  alignment?: CrossAxisAlignment;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

/**
 * Container layout that positions children along a main axis (horizontal, vertical, or none).
 * 
 * Strategy: PROACTIVE
 * - Parent controls child positioning
 * - Children are positioned in the content area (respects padding)
 * - Children are laid out along the main axis with spacing between them
 * - Supports cross-axis alignment (start, center, end)
 * - Supports reactive sizing (auto width/height based on children)
 * - Supports spread mode: evenly distribute children across available space (requires fixed dimension)
 * - Direction "none" allows manual positioning of children (used by Artboard)
 */
export class NewContainer extends NewRectangle {
  private spacing: number;
  private spread: boolean;
  private alignment: CrossAxisAlignment;
  private direction: ContainerDirection;
  private _autoWidth: boolean;
  private _autoHeight: boolean;

  constructor(config: NewContainerConfig) {
    // Determine fixed vs auto sizing
    const width = typeof config.width === "number" ? config.width : 0;
    const height = typeof config.height === "number" ? config.height : 0;
    
    super(width, height, config.boxModel, config.style);
    
    this.spacing = config.spacing ?? 0;
    this.spread = config.spread ?? false;
    this.alignment = config.alignment ?? "start";
    this.direction = config.direction ?? "none";
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
    
    // If direction is "none", position child at content box top-left if not already positioned
    // This ensures children respect padding by default
    if (this.direction === "none") {
      // Check if the child has been explicitly positioned
      if (!(element as any)._hasExplicitPosition) {
        // Position at content box top-left
        const contentTopLeft = this.localToAbsolute(0, 0, "content");
        element.position({
          relativeFrom: this.getChildDefaultReference(element),
          relativeTo: contentTopLeft,
          x: 0,
          y: 0,
        });
      }
      return;
    }
    
    // Update auto-sizing if needed (BEFORE positioning)
    // This must happen before positioning so alignment calculations use correct dimensions
    const hadAutoSize = this._autoWidth || this._autoHeight;
    if (hadAutoSize) {
      this.updateAutoSize();
    }
    
    // Position all children (or just new one if no auto-sizing and no spread)
    // When auto-sizing changes dimensions OR spread is enabled, we must reposition ALL children
    // because alignment/spacing depends on the container dimensions and all children
    if (hadAutoSize || this.spread) {
      this.layoutAllChildren();
    } else {
      // No auto-sizing and no spread: just position the new child
      let currentOffset = 0;
      for (let i = 0; i < this.children.length - 1; i++) {
        currentOffset += this.getChildSize(this.children[i]) + this.spacing;
      }
      this.positionChild(element, currentOffset);
    }
  }

  /**
   * Get the size of a child element along the main axis
   */
  private getChildSize(child: NewElement): number {
    if (this.direction === "vertical") {
      return this.getChildHeight(child);
    } else {
      return this.getChildWidth(child);
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
    if (this.direction === "vertical") {
      // Vertical stack
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
    } else {
      // Horizontal stack
      if (this._autoWidth) {
        // Calculate total width: sum of children + spacing + padding + border
        let totalWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
          totalWidth += this.getChildWidth(this.children[i]);
          if (i < this.children.length - 1) {
            totalWidth += this.spacing;
          }
        }
        this._borderBoxWidth = 
          totalWidth +
          this._boxModel.padding.left + this._boxModel.padding.right +
          this._boxModel.border.left + this._boxModel.border.right;
      }

      if (this._autoHeight) {
        // Calculate max child height + padding + border
        let maxHeight = 0;
        for (const child of this.children) {
          maxHeight = Math.max(maxHeight, this.getChildHeight(child));
        }
        this._borderBoxHeight = 
          maxHeight +
          this._boxModel.padding.top + this._boxModel.padding.bottom +
          this._boxModel.border.top + this._boxModel.border.bottom;
      }
    }
  }

  /**
   * Layout all children from scratch.
   * Used when auto-sizing changes dimensions and all children need repositioning.
   */
  private layoutAllChildren(): void {
    if (this.children.length === 0) return;

    // Calculate spacing (either fixed or spread)
    const effectiveSpacing = this.calculateEffectiveSpacing();
    
    let currentOffset = 0;
    
    for (const child of this.children) {
      this.positionChild(child, currentOffset);
      currentOffset += this.getChildSize(child) + effectiveSpacing;
    }
  }

  /**
   * Calculate the effective spacing between children.
   * In spread mode, distributes available space evenly.
   * Otherwise, uses the configured spacing.
   */
  private calculateEffectiveSpacing(): number {
    if (!this.spread || this.children.length <= 1) {
      return this.spacing;
    }

    // Spread only works with fixed dimensions
    if (this.direction === "vertical") {
      if (this._autoHeight) return this.spacing; // Can't spread with auto height
      
      // Calculate total size of children
      let totalChildSize = 0;
      for (const child of this.children) {
        totalChildSize += this.getChildHeight(child);
      }
      
      // Available space = content height - total child size
      const availableSpace = this.contentHeight - totalChildSize;
      
      // Distribute evenly between children (n-1 gaps for n children)
      return Math.max(0, availableSpace / (this.children.length - 1));
      
    } else if (this.direction === "horizontal") {
      if (this._autoWidth) return this.spacing; // Can't spread with auto width
      
      // Calculate total size of children
      let totalChildSize = 0;
      for (const child of this.children) {
        totalChildSize += this.getChildWidth(child);
      }
      
      // Available space = content width - total child size
      const availableSpace = this.contentWidth - totalChildSize;
      
      // Distribute evenly between children (n-1 gaps for n children)
      return Math.max(0, availableSpace / (this.children.length - 1));
    }
    
    return this.spacing;
  }

  /**
   * Position a single child at the specified offset along the main axis.
   * This implements the proactive positioning strategy.
   */
  private positionChild(child: NewElement, mainAxisOffset: number): void {
    // Get the alignment point on the child based on alignment setting
    const childReference = this.getChildAlignmentPoint(child);
    
    // Calculate cross-axis offset based on alignment
    const crossAxisOffset = this.getCrossAxisOffset(child);
    
    // Convert local coordinates to absolute world coordinates
    let offsetX: number, offsetY: number;
    if (this.direction === "vertical") {
      offsetX = crossAxisOffset;
      offsetY = mainAxisOffset;
    } else {
      offsetX = mainAxisOffset;
      offsetY = crossAxisOffset;
    }
    
    const targetPosition = this.localToAbsolute(offsetX, offsetY, "content");
    
    // Position child at the calculated absolute position
    child.position({
      relativeFrom: childReference,
      relativeTo: targetPosition,
      x: 0,
      y: 0,
    });
  }

  /**
   * Get the default reference point for a child (for initial positioning).
   * Returns topLeft for rectangles, center for circles.
   */
  private getChildDefaultReference(child: NewElement): Position {
    if ((child as any).borderBox && (child as any).borderBox.topLeft) {
      return (child as any).borderBox.topLeft;
    } else if ((child as any).center) {
      return (child as any).center;
    }
    return { x: 0, y: 0 };
  }

  /**
   * Get the alignment point on a child element based on current alignment setting
   */
  private getChildAlignmentPoint(child: NewElement): { x: number; y: number } {
    if ((child as any).borderBox) {
      // Rectangle-based element
      const rect = child as any;
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally
        switch (this.alignment) {
          case "start":
            return rect.borderBox.topLeft;
          case "center":
            return rect.borderBox.centerTop;
          case "end":
            return rect.borderBox.topRight;
        }
      } else {
        // Horizontal stack: align vertically
        switch (this.alignment) {
          case "start":
            return rect.borderBox.topLeft;
          case "center":
            return rect.borderBox.centerLeft;
          case "end":
            return rect.borderBox.bottomLeft;
        }
      }
    } else if ((child as any).center && (child as any).radius) {
      // Circle - calculate alignment point based on direction and alignment
      const circle = child as any;
      const center = circle.center;
      const radius = circle.radius;
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally, but use TOP of circle for main axis
        switch (this.alignment) {
          case "start":
            return { x: center.x - radius, y: center.y - radius }; // Left edge, top
          case "center":
            return { x: center.x, y: center.y - radius }; // Center, top
          case "end":
            return { x: center.x + radius, y: center.y - radius }; // Right edge, top
        }
      } else {
        // Horizontal stack: align vertically, but use LEFT of circle for main axis
        switch (this.alignment) {
          case "start":
            return { x: center.x - radius, y: center.y - radius }; // Left, top edge
          case "center":
            return { x: center.x - radius, y: center.y }; // Left, center
          case "end":
            return { x: center.x - radius, y: center.y + radius }; // Left, bottom edge
        }
      }
    } else {
      // Unknown element type - use center if available
      return (child as any).center || { x: 0, y: 0 };
    }
  }

  /**
   * Calculate the cross-axis offset for alignment within the content area.
   * This offset represents where the alignment point should be positioned.
   */
  private getCrossAxisOffset(child: NewElement): number {
    if (this.direction === "vertical") {
      // Vertical stack: cross-axis is horizontal
      const availableWidth = this.contentWidth;
      switch (this.alignment) {
        case "start":
          return 0; // Left edge of content area
        case "center":
          return availableWidth / 2; // Center of content area
        case "end":
          return availableWidth; // Right edge of content area
      }
    } else {
      // Horizontal stack: cross-axis is vertical
      const availableHeight = this.contentHeight;
      switch (this.alignment) {
        case "start":
          return 0; // Top edge of content area
        case "center":
          return availableHeight / 2; // Center of content area
        case "end":
          return availableHeight; // Bottom edge of content area
      }
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

