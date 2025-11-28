/**
 * New layout system - Container (Base for layout containers)
 * 
 * LAYOUT STRATEGY: PROACTIVE
 * The parent (Container) tells children where to position themselves.
 * Children are positioned along the main axis with spacing.
 */

import { Rectangle } from "../core/Rectangle.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { type Style } from "../core/Stylable.js";
import { defaultTheme } from "../core/Theme.js";
import { Element, type Position, type PositionConfig } from "../core/Element.js";

/**
 * Container direction - how children are laid out
 * - "horizontal": Stack children left-to-right
 * - "vertical": Stack children top-to-bottom
 * - "none": Position children at content top-left by default, normalize bounds (used by Artboard)
 * - "freeform": CSS-like - children position themselves, parent sizes from (0,0) to max child extent
 */
export type ContainerDirection = "horizontal" | "vertical" | "none" | "freeform";

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

export interface ContainerConfig {
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
 * Container layout that positions children along a main axis (horizontal, vertical, none, or freeform).
 * 
 * LAYOUT MODES:
 * - "horizontal"/"vertical": PROACTIVE - parent controls child positioning along axis
 * - "none": SEMI-REACTIVE - auto-positions at content top-left, normalizes bounds (Artboard)
 * - "freeform": CSS-LIKE REACTIVE - children position themselves, parent sizes and normalizes
 * 
 * FREEFORM MODE (CSS Analogy):
 * - Like CSS: parent has `position: relative`, children have `position: absolute`
 * - Children positioned anywhere (including negative coords relative to content origin)
 * - Container sizes from (0,0) to maximum child extent
 * - If children extend into negative space, container shifts all children to positive coords
 * - Example: child centered at (0,0) with size 100x80 → extends to (-50,-40) to (50,40)
 *   → container shifts child to (50,40) and sizes content to 100x80
 * 
 * Features:
 * - Children positioned in content area (respects padding)
 * - Supports cross-axis alignment (horizontal/vertical stacks only)
 * - Supports reactive sizing (auto width/height based on children)
 * - Supports spread mode: evenly distribute children (horizontal/vertical only)
 */
export class Container extends Rectangle {
  private spacing: number;
  private spread: boolean;
  private horizontalAlignment: HorizontalAlignment;
  private verticalAlignment: VerticalAlignment;
  private direction: ContainerDirection;
  private _autoWidth: boolean;
  private _autoHeight: boolean;
  private _needsBoundsNormalization: boolean = false;
  private _isUpdatingAutoSize: boolean = false;  // Guard against recursion
  private _freeformFinalized: boolean = false;  // Track if freeform layout has been finalized

  constructor(config: ContainerConfig) {
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
    
    // Initialize auto-sized empty containers with padding+border size
    // This ensures empty containers are still visible with their padding/border
    if (this._autoWidth || this._autoHeight) {
      if (this.direction === "none") {
        // For direction "none" (Artboard), use normalizeBounds instead of updateAutoSize
        this.normalizeBounds();
      } else {
        this.updateAutoSize();
      }
    }
  }

  /**
   * Override addElement to position children as they're added.
   * This is the proactive strategy in action.
   */
  addElement(element: Element): void {
    // Add to children array first
    super.addElement(element);
    
    // FREEFORM MODE: Defer layout until finalize() is called
    // Children position themselves freely, container stays at 0x0
    // This avoids the chicken-egg problem of incremental normalization
    if (this.direction === "freeform") {
      // Reset finalization flag so it re-finalizes on next access
      this._freeformFinalized = false;
      // Do nothing here - layout happens in finalizeFreeformLayout()
      return;
    }
    
    // NONE MODE (Artboard): Position children at content top-left by default, normalize bounds
    // This ensures children respect padding and stay within positive coordinates
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
        this.notifyParentOfSizeChange(); // Notify parent so auto-sizing cascades upwards
      }
      return;
    }
    
    // Update auto-sizing if needed (BEFORE positioning)
    // This must happen before positioning so alignment calculations use correct dimensions
    const hadAutoSize = this._autoWidth || this._autoHeight;
    if (hadAutoSize) {
      this.updateAutoSize();
      this.notifyParentOfSizeChange();
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
  private getChildSize(child: Element): number {
    if (this.direction === "vertical") {
      return this.getChildHeight(child);
    } else {
      return this.getChildWidth(child);
    }
  }

  /**
   * Get the height of a child element
   */
  private getChildHeight(child: Element): number {
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
  private getChildWidth(child: Element): number {
    if (typeof (child as any).width === 'number') {
      return (child as any).width;
    } else if (typeof (child as any).radius === 'number') {
      return (child as any).radius * 2;
    }
    return 0;
  }

  /**
   * Notify parent container that our size has changed (for cascading auto-size)
   */
  private notifyParentOfSizeChange(): void {
    if (this._isUpdatingAutoSize) return;  // Prevent recursion
    
    if (this._parent && (this._parent as any).updateAutoSize) {
      const parentContainer = this._parent as Container;
      if ((parentContainer as any)._autoWidth || (parentContainer as any)._autoHeight) {
        // Parent is auto-sizing - notify it to recalculate
        // For direction "none" (Artboard), use normalizeBounds instead of updateAutoSize
        if ((parentContainer as any).direction === "none") {
          (parentContainer as any).normalizeBounds();
        } else {
          (parentContainer as any).updateAutoSize();
        }
        (parentContainer as any).notifyParentOfSizeChange();
      }
    }
  }

  /**
   * Update auto-sizing based on children
   */
  private updateAutoSize(): void {
    if (this._isUpdatingAutoSize) return;  // Prevent recursion
    this._isUpdatingAutoSize = true;
    
    // Get bounding box of all children to handle manually positioned elements
    const childrenBounds = this.getChildrenBoundingBox(false); // Include all children
    const contentBoxBounds = this.getChildrenBoundingBox(true); // Only contentBox-positioned children
    
    // Get our absolute position to calculate relative bounds
    const ourPos = this.getAbsolutePosition();
    
    if (this.direction === "freeform") {
      // Freeform: CSS-like behavior
      // - Children positioned relative to content box at (0,0)
      // - Container sizes from (0,0) to max child extent
      // - Like CSS: position: relative (parent) + position: absolute (children)
      const bounds = childrenBounds;
      
      if (bounds && (this._autoWidth || this._autoHeight)) {
        // Get content box origin in absolute coordinates
        const contentOrigin = this.localToAbsolute(0, 0, "content");
        
        // Calculate how far children extend relative to content box origin
        // This is the distance from (0,0) to the furthest child edge
        const maxXRelative = bounds.maxX - contentOrigin.x;
        const maxYRelative = bounds.maxY - contentOrigin.y;
        
        // Size from content origin (0,0) to max extent
        // This matches CSS behavior: container contains children from its origin
        if (this._autoWidth) {
          this._borderBoxWidth = 
            Math.max(0, maxXRelative) +
            this._boxModel.padding.left + this._boxModel.padding.right +
            this._boxModel.border.left + this._boxModel.border.right;
        }
        
        if (this._autoHeight) {
          this._borderBoxHeight = 
            Math.max(0, maxYRelative) +
            this._boxModel.padding.top + this._boxModel.padding.bottom +
            this._boxModel.border.top + this._boxModel.border.bottom;
        }
      }
    } else if (this.direction === "none") {
      // None (Artboard mode): sizing handled by normalizeBounds()
      // This ensures CSS-like sizing from (0,0) to max extent with proper normalization
      // Do nothing here - normalizeBounds() will handle the sizing
    } else if (this.direction === "vertical") {
      // Vertical stack
      if (this._autoWidth) {
        // Use max child width for stacked children (simpler and more reliable)
        let maxWidth = 0;
        for (const child of this.children) {
          const childWidth = this.getChildWidth(child);
          maxWidth = Math.max(maxWidth, childWidth);
        }
        this._borderBoxWidth = 
          maxWidth + 
          this._boxModel.padding.left + this._boxModel.padding.right +
          this._boxModel.border.left + this._boxModel.border.right;
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
        // Use max child height for stacked children (simpler and more reliable)
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
    
    this._isUpdatingAutoSize = false;  // Reset guard
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
   * Normalize bounds for direction "none" containers with auto-sizing (Artboard mode).
   * This ensures that all children fit within the content box starting from (0,0).
   * 
   * Note: This is NOT used for "freeform" mode, which allows negative coordinates.
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
    // Size from content origin (0,0) to max extent (CSS-like)
    // After shifting (if needed), this ensures children fit from (0,0)
    const requiredContentWidth = maxXRelative - Math.min(0, minXRelative);
    const requiredContentHeight = maxYRelative - Math.min(0, minYRelative);

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
   * Finalize freeform layout after all children have been added.
   * This is a two-phase approach:
   * Phase 1: Children position themselves (assuming container is 0x0)
   * Phase 2: Calculate bbox, size container, normalize children to positive coords
   * 
   * This avoids the chicken-egg problem of incremental normalization.
   * 
   * Call this after adding all children but before positioning the container.
   */
  public finalizeFreeformLayout(): void {
    if (this.direction !== "freeform") return;
    if (!this._autoWidth && !this._autoHeight) return;
    if (this.children.length === 0) return;

    // Get bounding box of all children in their current positions
    const bounds = this.getChildrenBoundingBox(false);
    if (!bounds) return;

    // Our current position (border box origin)
    const borderBoxOrigin = this.getAbsolutePosition();
    
    // Calculate how far children extend relative to our border box
    const minXRelative = bounds.minX - borderBoxOrigin.x;
    const minYRelative = bounds.minY - borderBoxOrigin.y;
    const maxXRelative = bounds.maxX - borderBoxOrigin.x;
    const maxYRelative = bounds.maxY - borderBoxOrigin.y;

    // Calculate content box offset (for sizing)
    const contentBoxOffsetX = this._boxModel.padding.left + this._boxModel.border.left;
    const contentBoxOffsetY = this._boxModel.padding.top + this._boxModel.border.top;

    // Determine shift needed to make all children relative to content box at (0,0)
    const shiftX = Math.min(0, minXRelative - contentBoxOffsetX);
    const shiftY = Math.min(0, minYRelative - contentBoxOffsetY);

    // Shift all children if needed
    if (shiftX < 0 || shiftY < 0) {
      for (const child of this.children) {
        const currentPos = (child as any)._position;
        (child as any)._position = {
          x: currentPos.x - shiftX,
          y: currentPos.y - shiftY,
        };
      }
    }

    // Calculate required content size (from 0,0 to max extent)
    // After shifting, the new bounds are (minXRelative - shiftX) to (maxXRelative - shiftX)
    // Convert to content box coordinates and calculate size
    const minXInContent = (minXRelative - shiftX) - contentBoxOffsetX;
    const maxXInContent = (maxXRelative - shiftX) - contentBoxOffsetX;
    const minYInContent = (minYRelative - shiftY) - contentBoxOffsetY;
    const maxYInContent = (maxYRelative - shiftY) - contentBoxOffsetY;
    
    const requiredContentWidth = maxXInContent - Math.min(0, minXInContent);
    const requiredContentHeight = maxYInContent - Math.min(0, minYInContent);

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
    
    // Mark as finalized
    this._freeformFinalized = true;
  }

  /**
   * Legacy method - kept for compatibility with "none" mode.
   * For freeform mode, use finalizeFreeformLayout() instead.
   */
  private normalizeFreeformBounds(): void {
    if (this.children.length === 0) return;
    if (!this._autoWidth && !this._autoHeight) return;

    // Get our border box origin (children's _position is relative to this)
    const borderBoxOrigin = this.getAbsolutePosition();
    
    // Get absolute position of our content box origin (for sizing calculations)
    const contentOrigin = this.localToAbsolute(0, 0, "content");
    
    // Get bounding box of all children in absolute coordinates
    const bounds = this.getChildrenBoundingBox(false);
    if (!bounds) return;

    // Calculate how far children extend relative to our BORDER BOX (for shifting)
    // This must match the coordinate system of child._position
    const minXRelativeToBorder = bounds.minX - borderBoxOrigin.x;
    const minYRelativeToBorder = bounds.minY - borderBoxOrigin.y;
    
    // Calculate bounds relative to CONTENT BOX (for sizing)
    const minXRelative = bounds.minX - contentOrigin.x;
    const minYRelative = bounds.minY - contentOrigin.y;
    const maxXRelative = bounds.maxX - contentOrigin.x;
    const maxYRelative = bounds.maxY - contentOrigin.y;

    // Determine if we need to shift children (if they extend into negative space relative to content box)
    // Use border-box-relative values for shifting (matches child._position coordinate system)
    const contentBoxOffsetX = contentOrigin.x - borderBoxOrigin.x;
    const contentBoxOffsetY = contentOrigin.y - borderBoxOrigin.y;
    
    const shiftX = Math.min(0, minXRelativeToBorder - contentBoxOffsetX);
    const shiftY = Math.min(0, minYRelativeToBorder - contentBoxOffsetY);

    // If we need to shift, adjust all children positions
    if (shiftX < 0 || shiftY < 0) {
      for (const child of this.children) {
        // Get current position relative to our border box
        const currentPos = (child as any)._position;
        
        // Shift the position to make all coords positive (relative to content box)
        (child as any)._position = {
          x: currentPos.x - shiftX,
          y: currentPos.y - shiftY,
        };
      }
    }

    // Calculate the required content size to fit all children
    // Size from content origin (0,0) to max extent (after shifting)
    const requiredContentWidth = maxXRelative - Math.min(0, minXRelative);
    const requiredContentHeight = maxYRelative - Math.min(0, minYRelative);

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
  private positionChild(child: Element, mainAxisOffset: number): void {
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
  private getChildDefaultReference(child: Element): Position {
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
  private getChildAlignmentPoint(child: Element): { x: number; y: number } {
    // Check for elements with direct anchor points (Text, Latex)
    if ((child as any).topLeft && (child as any).topCenter && (child as any).leftCenter) {
      const element = child as any;
      
      if (this.direction === "vertical") {
        // Vertical stack: align horizontally (left edge, center, or right edge)
        switch (this.horizontalAlignment) {
          case "left":
            return element.leftCenter;   // Left edge, vertically centered
          case "center":
            return element.center;       // Horizontally and vertically centered
          case "right":
            return element.rightCenter;  // Right edge, vertically centered
          default:
            return element.leftCenter;
        }
      } else {
        // Horizontal stack: align vertically (top edge, center, or bottom edge)
        // Use left edge for main axis positioning
        switch (this.verticalAlignment) {
          case "top":
            return element.topLeft;      // Top-left corner
          case "center":
            return element.leftCenter;   // Left edge, vertically centered
          case "bottom":
            return element.bottomLeft;   // Bottom-left corner
          default:
            return element.topLeft;
        }
      }
    } else if ((child as any).borderBox) {
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
  private getCrossAxisOffset(child: Element): number {
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

  /**
   * Ensure freeform layout is finalized before any positioning operations.
   * This is called automatically before accessing position properties or positioning the container.
   */
  protected ensureFreeformFinalized(): void {
    if (this.direction === "freeform" && (this._autoWidth || this._autoHeight) && this.children.length > 0) {
      // Only finalize once - check if we've already finalized by seeing if size is non-zero
      // This is a simple heuristic: if we have children and auto-size, we should have been finalized
      // We'll track this more explicitly with a flag
      if (!this._freeformFinalized) {
        this.finalizeFreeformLayout();
        this._freeformFinalized = true;
      }
    }
  }

  /**
   * Override position getters to auto-finalize freeform layouts.
   * This ensures that when users access container.center (or other position properties),
   * they get the correct value after finalization.
   */
  get center(): Position {
    this.ensureFreeformFinalized();
    return super.center;
  }

  get topLeft(): Position {
    this.ensureFreeformFinalized();
    return super.topLeft;
  }

  get topRight(): Position {
    this.ensureFreeformFinalized();
    return super.topRight;
  }

  get bottomLeft(): Position {
    this.ensureFreeformFinalized();
    return super.bottomLeft;
  }

  get bottomRight(): Position {
    this.ensureFreeformFinalized();
    return super.bottomRight;
  }

  /**
   * Override position() to automatically finalize freeform layouts.
   * This ensures freeform containers are properly sized and normalized
   * before being positioned, without requiring explicit finalizeFreeformLayout() calls.
   */
  position(config: PositionConfig): void {
    // Finalize freeform layout before positioning
    this.ensureFreeformFinalized();
    
    // Call parent's position method
    super.position(config);
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

