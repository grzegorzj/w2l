/**
 * New layout system - VStack (Vertical Stack)
 * 
 * LEGACY WRAPPER: This is now a thin wrapper around NewStack for backward compatibility.
 * For new code, use NewStack with direction: 'vertical' instead.
 * 
 * LAYOUT STRATEGY: PROACTIVE
 * The parent (VStack) tells children where to position themselves.
 * Children are positioned vertically with spacing in between.
 */

import { NewStack, type CrossAxisAlignment, type SizeMode } from "./NewStack.js";
import { type BoxModel } from "./BoxModel.js";
import { type Style } from "../core/Stylable.js";
import { NewElement } from "./NewElement.js";

/**
 * Horizontal alignment options for VStack children
 * @deprecated Use CrossAxisAlignment ('start' | 'center' | 'end') instead
 */
export type HorizontalAlignment = "left" | "center" | "right";

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
 * This is a backward-compatible wrapper around NewStack.
 * 
 * Strategy: PROACTIVE
 * - Parent controls child positioning
 * - Children are positioned in the content area (respects padding)
 * - Children are stacked top-to-bottom with spacing between them
 * - Supports horizontal alignment (left, center, right)
 * - Supports reactive sizing (auto width/height based on children)
 */
export class NewVStack extends NewStack {
  constructor(config: NewVStackConfig) {
    // Convert legacy alignment to new format
    const alignmentMap: Record<HorizontalAlignment, CrossAxisAlignment> = {
      left: "start",
      center: "center",
      right: "end"
    };
    
    const crossAlignment = config.alignment 
      ? alignmentMap[config.alignment] 
      : "start";
    
    super({
      width: config.width,
      height: config.height,
      direction: "vertical",
      spacing: config.spacing,
      alignment: crossAlignment,
      style: config.style,
      boxModel: config.boxModel
    });
  }

}

