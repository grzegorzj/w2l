/**
 * Core module exports.
 * 
 * This module contains the fundamental building blocks of the library:
 * - {@link Artboard}: The main canvas for visual composition
 * - {@link Shape}: Base class for all geometric shapes
 * - Type definitions for positioning and layout
 * 
 * @module core
 */

export { Artboard } from "./Artboard.js";
export type { Point, Size, ArtboardConfig } from "./Artboard.js";
export { Shape } from "./Shape.js";
export type { PositionReference, RotateConfig, TranslateConfig } from "./Shape.js";

