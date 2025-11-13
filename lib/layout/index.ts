/**
 * Layout module exports.
 *
 * This module contains layout and positioning utilities including:
 * - {@link Container}: Invisible bounded element for grouping and layout
 * - {@link Layout}: Base class for layout elements that transform children
 * - {@link ColumnsLayout}: Multi-column layout with automatic positioning
 *
 * @module layout
 */

export { Container } from "./Container.js";
export type { ContainerConfig } from "./Container.js";

export { Layout } from "./Layout.js";
export type { LayoutConfig } from "./Layout.js";

export { ColumnsLayout, Column } from "./ColumnsLayout.js";
export type { ColumnsLayoutConfig } from "./ColumnsLayout.js";

