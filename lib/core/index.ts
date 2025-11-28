/**
 * New layout system - Core base classes
 */

export { Element, type Position, type PositionConfig } from "./Element.js";
export { Shape } from "./Shape.js";
export { Rectangle } from "./Rectangle.js";
export { 
  type Theme, 
  SwissTheme, 
  defaultTheme, 
  getTheme, 
  createTheme 
} from "./Theme.js";
export { type Style, type Stylable, styleToSVGAttributes } from "./Stylable.js";

