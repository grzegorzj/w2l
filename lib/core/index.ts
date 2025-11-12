/**
 * Core module exports.
 *
 * This module contains the fundamental building blocks of the library:
 * - {@link Artboard}: The main canvas for visual composition
 * - {@link Element}: Base class for all elements (shapes, containers, etc.)
 * - {@link Shape}: Base class for all geometric shapes
 * - Type definitions for positioning and layout
 *
 * @module core
 */

export { Artboard } from "./Artboard.js";
export type { Point, ArtboardConfig } from "./Artboard.js";
export { Element } from "./Element.js";
export type {
  PositionReference,
  RotateConfig,
  TranslateConfig,
} from "./Element.js";
export { Bounded } from "./Bounded.js";
export type { Spacing, ParsedSpacing } from "./Bounded.js";
export { Shape } from "./Shape.js";
export type { Style, Stylable } from "./Stylable.js";
export { styleToSVGAttributes } from "./Stylable.js";

export { parseUnit, isValidUnit, formatUnit } from "./units.js";
