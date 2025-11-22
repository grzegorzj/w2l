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

export interface NewVStackConfig {
  width: number;
  height: number;
  spacing?: number;
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
 */
export class NewVStack extends NewRectangle {
  private spacing: number;

  constructor(config: NewVStackConfig) {
    super(config.width, config.height, config.boxModel, config.style);
    this.spacing = config.spacing ?? 0;
  }

  /**
   * Override addElement to position children as they're added.
   * This is the proactive strategy in action.
   */
  addElement(element: NewElement): void {
    // Calculate Y position for this new child based on existing children
    let currentY = 0;
    
    for (const existingChild of this.children) {
      let childHeight = 0;
      
      if (typeof (existingChild as any).height === 'number') {
        childHeight = (existingChild as any).height;
      } else if (typeof (existingChild as any).radius === 'number') {
        childHeight = (existingChild as any).radius * 2;
      }
      
      currentY += childHeight + this.spacing;
    }
    
    // Add to children array
    super.addElement(element);
    
    // Position only the newly added child (proactive strategy)
    this.positionChild(element, currentY);
  }

  /**
   * Position a single child at the specified Y offset.
   * This implements the proactive positioning strategy.
   * 
   * The parent tells the child where to position itself by providing
   * the target position. The child implements the actual positioning.
   */
  private positionChild(child: NewElement, offsetY: number): void {
    // Determine the positioning reference point on the child
    // For rectangles, use borderBox.topLeft (the actual top-left corner)
    // For circles, use center
    const childReference = (child as any).borderBox
      ? (child as any).borderBox.topLeft
      : (child as any).center;
    
    // Convert local coordinates (0, offsetY) to absolute world coordinates
    // This correctly handles nesting by using the helper method
    const targetPosition = this.localToAbsolute(0, offsetY, "content");
    
    // Position child at the calculated absolute position
    // The child.position() method will convert this back to relative-to-parent
    child.position({
      relativeFrom: childReference,
      relativeTo: targetPosition,
      x: 0,
      y: 0,
    });
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

