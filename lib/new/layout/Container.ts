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
 * Horizontal alignment
 */
export type HorizontalAlignment = "left" | "center" | "right";

/**
 * Vertical alignment
 */
export type VerticalAlignment = "top" | "center" | "bottom";

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
  horizontalAlignment?: HorizontalAlignment;
  verticalAlignment?: VerticalAlignment;
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
  private horizontalAlignment: HorizontalAlignment;
  private verticalAlignment: VerticalAlignment;
  private direction: ContainerDirection;
  private _autoWidth: boolean;
  private _autoHeight: boolean;
  private _needsBoundsNormalization: boolean = false;

  constructor(config: NewContainerConfig) {
    // Determine fixed vs auto sizing
    const width = typeof config.width === "number" ? config.width : 0;
    const height = typeof config.height === "number" ? config.height : 0;
    
    super(width, height, config.boxModel, config.style);
    
    this.spacing = config.spacing ?? 0;
    this.spread = config.spread ?? false;
    this.horizontalAlignment = config.horizontalAlignment ?? "left";
    this.verticalAlignment = config.verticalAlignment ?? "top";
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
          boxReference: "contentBox",
        });
      }
      
      // For direction "none" with auto-sizing, normalize bounds reactively
      if (this._autoWidth || this._autoHeight) {
        this.normalizeBounds();
      }
      return;
    }
    
    // Update auto-sizing if needed (BEFORE positioning)
    // This must happen before positioning so alignment calculations use correct dimensions
    const hadAutoSize = this._autoWidth || this._autoHeight;
    if (hadAutoSize) {
      this.updateAutoSize();
    }
    
    // Position all children (or just new one if no auto-sizing, no spread, and start alignment)
    // When auto-sizing changes dimensions OR spread is enabled OR main-axis alignment is not "start",
    // we must reposition ALL children because alignment/spacing depends on the container dimensions and all children
    const mainAlignment = this.direction === "vertical" ? this.verticalAlignment : this.horizontalAlignment;
    const isStartAlignment = mainAlignment === (this.direction === "vertical" ? "top" : "left");
    
    if (hadAutoSize || this.spread || !isStartAlignment) {
      this.layoutAllChildren();
    } else {
      // No auto-sizing, no spread, start alignment: just position the new child
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
    // Get bounding box of all children to handle manually positioned elements
    const childrenBounds = this.getChildrenBoundingBox(false); // Include all children
    const contentBoxBounds = this.getChildrenBoundingBox(true); // Only contentBox-positioned children
    
    // Get our absolute position to calculate relative bounds
    const ourPos = this.getAbsolutePosition();
    
    if (this.direction === "none") {
      // No direction: use pure bounding box approach (like Artboard)
      // Use contentBox-positioned children by default, fall back to all children
      const bounds = contentBoxBounds || childrenBounds;
      
      if (bounds && this._autoWidth) {
        this._borderBoxWidth = 
          Math.max(0, bounds.maxX - bounds.minX) +
          this._boxModel.padding.left + this._boxModel.padding.right +
          this._boxModel.border.left + this._boxModel.border.right;
      }
      
      if (bounds && this._autoHeight) {
        this._borderBoxHeight = 
          Math.max(0, bounds.maxY - bounds.minY) +
          this._boxModel.padding.top + this._boxModel.padding.bottom +
          this._boxModel.border.top + this._boxModel.border.bottom;
      }
    } else if (this.direction === "vertical") {
      // Vertical stack
      if (this._autoWidth) {
        // For cross-axis (width), use bounding box if we have manually positioned children
        if (childrenBounds && (childrenBounds.maxX - childrenBounds.minX > 0)) {
          const contentLeft = ourPos.x + this._boxModel.border.left + this._boxModel.padding.left;
          const relativeMaxX = childrenBounds.maxX - contentLeft;
          this._borderBoxWidth = 
            relativeMaxX +
            this._boxModel.padding.left + this._boxModel.padding.right +
            this._boxModel.border.left + this._boxModel.border.right;
        } else {
          // Fallback to max child width for stacked children
        let maxWidth = 0;
        for (const child of this.children) {
          maxWidth = Math.max(maxWidth, this.getChildWidth(child));
        }
        this._borderBoxWidth = 
          maxWidth + 
          this._boxModel.padding.left + this._boxModel.padding.right +
          this._boxModel.border.left + this._boxModel.border.right;
        }
      }

      if (this._autoHeight) {
        // For main-axis (height), prefer stacking calculation but consider positioned children
        let totalHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
          totalHeight += this.getChildHeight(this.children[i]);
          if (i < this.children.length - 1) {
            totalHeight += this.spacing;
          }
        }
        
        // Also check if manually positioned children extend beyond
        if (childrenBounds && (childrenBounds.maxY - childrenBounds.minY > totalHeight)) {
          const contentTop = ourPos.y + this._boxModel.border.top + this._boxModel.padding.top;
          const relativeMaxY = childrenBounds.maxY - contentTop;
          totalHeight = relativeMaxY;
        }
        
        this._borderBoxHeight = 
          totalHeight +
          this._boxModel.padding.top + this._boxModel.padding.bottom +
          this._boxModel.border.top + this._boxModel.border.bottom;
      }
    } else {
      // Horizontal stack
      if (this._autoWidth) {
        // For main-axis (width), prefer stacking calculation but consider positioned children
        let totalWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
          totalWidth += this.getChildWidth(this.children[i]);
          if (i < this.children.length - 1) {
            totalWidth += this.spacing;
          }
        }
        
        // Also check if manually positioned children extend beyond
        if (childrenBounds && (childrenBounds.maxX - childrenBounds.minX > totalWidth)) {
          const contentLeft = ourPos.x + this._boxModel.border.left + this._boxModel.padding.left;
          const relativeMaxX = childrenBounds.maxX - contentLeft;
          totalWidth = relativeMaxX;
        }
        
        this._borderBoxWidth = 
          totalWidth +
          this._boxModel.padding.left + this._boxModel.padding.right +
          this._boxModel.border.left + this._boxModel.border.right;
      }

      if (this._autoHeight) {
        // For cross-axis (height), use bounding box if we have manually positioned children
        if (childrenBounds && (childrenBounds.maxY - childrenBounds.minY > 0)) {
          const contentTop = ourPos.y + this._boxModel.border.top + this._boxModel.padding.top;
          const relativeMaxY = childrenBounds.maxY - contentTop;
          this._borderBoxHeight = 
            relativeMaxY +
            this._boxModel.padding.top + this._boxModel.padding.bottom +
            this._boxModel.border.top + this._boxModel.border.bottom;
        } else {
          // Fallback to max child height for stacked children
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
  }

  /**
   * Calculate the initial offset for main-axis alignment.
   * This determines where children start being positioned along the main axis.
   */
  private calculateMainAxisStartOffset(): number {
    const mainAlignment = this.direction === "vertical" ? this.verticalAlignment : this.horizontalAlignment;
    
    if (mainAlignment === (this.direction === "vertical" ? "top" : "left") || this.spread) {
      return 0;
    }

    // Calculate total size of all children plus spacing
    let totalSize = 0;
    for (let i = 0; i < this.children.length; i++) {
      totalSize += this.getChildSize(this.children[i]);
      if (i < this.children.length - 1) {
        totalSize += this.spacing;
      }
    }

    // Get available space along main axis
    const availableSpace = this.direction === "vertical" ? this.contentHeight : this.contentWidth;

    // Calculate remaining space
    const remainingSpace = availableSpace - totalSize;

    if (mainAlignment === "center") {
      return Math.max(0, remainingSpace / 2);
    } else if (mainAlignment === (this.direction === "vertical" ? "bottom" : "right")) {
      return Math.max(0, remainingSpace);
    }

    return 0;
  }

  /**
   * Normalize bounds for direction "none" containers with auto-sizing.
   * This ensures that all children fit within the content box starting from (0,0).
   * 
   * Process:
   * 1. Get bounding box of all children
   * 2. Calculate required size to fit all children
   * 3. If children extend into negative space, shift all children
   * 4. Resize container to fit the normalized bounds
   */
  protected normalizeBounds(): void {
    if (this.children.length === 0) return;
    if (this.direction !== "none") return;
    if (!this._autoWidth && !this._autoHeight) return;

    // Get absolute position of our content box origin
    const contentOrigin = this.localToAbsolute(0, 0, "content");
    
    // Get bounding box of all children in absolute coordinates
    const bounds = this.getChildrenBoundingBox(false);
    if (!bounds) return;

    // Calculate how far children extend relative to our content box origin
    const minXRelative = bounds.minX - contentOrigin.x;
    const minYRelative = bounds.minY - contentOrigin.y;
    const maxXRelative = bounds.maxX - contentOrigin.x;
    const maxYRelative = bounds.maxY - contentOrigin.y;

    // Determine if we need to shift children (if they extend into negative space)
    const shiftX = Math.min(0, minXRelative);
    const shiftY = Math.min(0, minYRelative);

    // If we need to shift, adjust all children positions
    if (shiftX < 0 || shiftY < 0) {
      for (const child of this.children) {
        // Get current position relative to us
        const currentPos = (child as any)._position;
        
        // Shift the position
        (child as any)._position = {
          x: currentPos.x - shiftX,
          y: currentPos.y - shiftY,
        };
      }
    }

    // Calculate the required content size to fit all children
    // After shifting, bounds start at 0 or positive values
    const requiredContentWidth = maxXRelative - minXRelative;
    const requiredContentHeight = maxYRelative - minYRelative;

    // Update container size
    if (this._autoWidth) {
      this._borderBoxWidth = 
        requiredContentWidth +
        this._boxModel.padding.left + this._boxModel.padding.right +
        this._boxModel.border.left + this._boxModel.border.right;
    }

    if (this._autoHeight) {
      this._borderBoxHeight = 
        requiredContentHeight +
        this._boxModel.padding.top + this._boxModel.padding.bottom +
        this._boxModel.border.top + this._boxModel.border.bottom;
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
    
    // Calculate initial offset based on main-axis alignment
    let currentOffset = this.calculateMainAxisStartOffset();
    
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
    
    // Safety check: ensure we have valid references
    if (!childReference || childReference.x === undefined || childReference.y === undefined) {
      console.error("[Container.positionChild] Invalid child reference:", childReference);
      console.error("  Child type:", (child as any).constructor.name);
      console.error("  Child has borderBox:", !!(child as any).borderBox);
      console.error("  Child has center:", !!(child as any).center);
      console.error("  Child has boundingBoxCenter:", !!(child as any).boundingBoxCenter);
      throw new Error("Cannot position child: invalid reference point");
    }
    
    // Position child at the calculated absolute position
    // Mark as contentBox-relative so container can track it for auto-sizing
    child.position({
      relativeFrom: childReference,
      relativeTo: targetPosition,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });
  }

  /**
   * Get the default reference point for a child (for initial positioning).
   * Returns topLeft for rectangles, center for circles and polygons.
   */
  private getChildDefaultReference(child: NewElement): Position {
    if ((child as any).borderBox && (child as any).borderBox.topLeft) {
      return (child as any).borderBox.topLeft;
    } else if ((child as any).center) {
      // Use center for circles, triangles, and polygons
      return (child as any).center;
    }
    // Fallback to absolute position
    return (child as any).getAbsolutePosition?.() || { x: 0, y: 0 };
  }

  /**
   * Get the alignment point on a child element based on current alignment setting
   */
  private getChildAlignmentPoint(child: NewElement): { x: number; y: number } {
    if ((child as any).borderBox) {
      // Rectangle-based element
      const rect = child as any;
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally using horizontalAlignment
        switch (this.horizontalAlignment) {
          case "left":
            return rect.borderBox.topLeft;
          case "center":
            return rect.borderBox.centerTop;
          case "right":
            return rect.borderBox.topRight;
          default:
            return rect.borderBox.topLeft;
        }
      } else {
        // Horizontal stack: align vertically using verticalAlignment
        switch (this.verticalAlignment) {
          case "top":
            return rect.borderBox.topLeft;
          case "center":
            return rect.borderBox.centerLeft;
          case "bottom":
            return rect.borderBox.bottomLeft;
          default:
            return rect.borderBox.topLeft;
        }
      }
    } else if ((child as any).center && (child as any).radius) {
      // Circle - calculate alignment point based on direction and alignment
      const circle = child as any;
      const center = circle.center;
      const radius = circle.radius;
      
      // Safety check
      if (!center || radius === undefined) {
        return circle.center || { x: 0, y: 0 };
      }
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally, but use TOP of circle for main axis
        switch (this.horizontalAlignment) {
          case "left":
            return { x: center.x - radius, y: center.y - radius }; // Left edge, top
          case "center":
            return { x: center.x, y: center.y - radius }; // Center, top
          case "right":
            return { x: center.x + radius, y: center.y - radius }; // Right edge, top
          default:
            return { x: center.x - radius, y: center.y - radius };
        }
      } else {
        // Horizontal stack: align vertically, but use LEFT of circle for main axis
        switch (this.verticalAlignment) {
          case "top":
            return { x: center.x - radius, y: center.y - radius }; // Left, top edge
          case "center":
            return { x: center.x - radius, y: center.y }; // Left, center
          case "bottom":
            return { x: center.x - radius, y: center.y + radius }; // Left, bottom edge
          default:
            return { x: center.x - radius, y: center.y - radius };
        }
      }
    } else if ((child as any).boundingBoxCenter && (child as any).boundingBoxTopLeft) {
      // Triangle or polygon - use bounding box for alignment
      const shape = child as any;
      const bbCenter = shape.boundingBoxCenter;
      const bbTopLeft = shape.boundingBoxTopLeft;
      const bbWidth = shape.boundingWidth;
      const bbHeight = shape.boundingHeight;
      
      // Safety check: ensure we have valid positions
      if (!bbCenter || !bbTopLeft || bbWidth === undefined || bbHeight === undefined) {
        // Fallback to center if bounding box is not available
        return shape.center || { x: 0, y: 0 };
      }
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally, use TOP of bounding box for main axis
        switch (this.horizontalAlignment) {
          case "left":
            return { x: bbTopLeft.x, y: bbTopLeft.y }; // Left edge, top
          case "center":
            return { x: bbCenter.x, y: bbTopLeft.y }; // Center, top
          case "right":
            return { x: bbTopLeft.x + bbWidth, y: bbTopLeft.y }; // Right edge, top
          default:
            return { x: bbTopLeft.x, y: bbTopLeft.y };
      }
    } else {
        // Horizontal stack: align vertically, use LEFT of bounding box for main axis
        switch (this.verticalAlignment) {
          case "top":
            return { x: bbTopLeft.x, y: bbTopLeft.y }; // Left, top edge
          case "center":
            return { x: bbTopLeft.x, y: bbCenter.y }; // Left, center
          case "bottom":
            return { x: bbTopLeft.x, y: bbTopLeft.y + bbHeight }; // Left, bottom edge
          default:
            return { x: bbTopLeft.x, y: bbTopLeft.y };
        }
      }
    } else if ((child as any).center) {
      // Element with center property (fallback)
      return (child as any).center;
    } else {
      // Ultimate fallback - use absolute position
      return (child as any).getAbsolutePosition?.() || { x: 0, y: 0 };
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
      switch (this.horizontalAlignment) {
        case "left":
          return 0; // Left edge of content area
        case "center":
          return availableWidth / 2; // Center of content area
        case "right":
          return availableWidth; // Right edge of content area
      }
    } else {
      // Horizontal stack: cross-axis is vertical
      const availableHeight = this.contentHeight;
      switch (this.verticalAlignment) {
        case "top":
          return 0; // Top edge of content area
        case "center":
          return availableHeight / 2; // Center of content area
        case "bottom":
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

