/**
 * Layout module exports.
 *
 * This module contains layout and positioning utilities including:
 * - {@link Container}: Invisible bounded element for grouping and layout
 * - {@link Layout}: Base class for layout elements that transform children
 * - {@link ColumnsLayout}: Multi-column layout with automatic positioning
 * - {@link SpreadLayout}: Distributes elements evenly with flexible spacing
 * - {@link GridLayout}: Arranges elements in a grid pattern
 *
 * @module layout
 */

export { Container } from "./Container.js";
export type { ContainerConfig } from "./Container.js";

export { Layout } from "./Layout.js";
export type { LayoutConfig } from "./Layout.js";

export { ColumnsLayout, Column } from "./ColumnsLayout.js";
export type { ColumnsLayoutConfig } from "./ColumnsLayout.js";

export { SpreadLayout } from "./SpreadLayout.js";
export type { SpreadLayoutConfig } from "./SpreadLayout.js";

export { GridLayout } from "./GridLayout.js";
export type { GridLayoutConfig } from "./GridLayout.js";

