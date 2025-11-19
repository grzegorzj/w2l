/**
 * Layout module exports.
 *
 * This module contains layout and positioning utilities including:
 * - {@link Container}: Invisible bounded element for grouping and layout
 * - {@link Layout}: Base class for layout elements that transform children
 * - {@link ColumnsLayout}: Multi-column layout with automatic positioning
 * - {@link SpreadLayout}: Distributes elements evenly with flexible spacing
 * - {@link VStack}: Stacks elements vertically (one under another)
 * - {@link HStack}: Stacks elements horizontally (side by side)
 * - {@link ZStack}: Layers elements on the z-axis (stacked on top)
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

export { VStack } from "./VStack.js";
export type { VStackConfig } from "./VStack.js";

export { HStack } from "./HStack.js";
export type { HStackConfig } from "./HStack.js";

export { ZStack } from "./ZStack.js";
export type { ZStackConfig } from "./ZStack.js";

export { GridLayout } from "./GridLayout.js";
export type { GridLayoutConfig } from "./GridLayout.js";

