/**
 * Themed Components - Web-like UI components with automatic styling.
 * 
 * These components are automatically styled with the Swiss design theme
 * for professional, screen-optimized appearance.
 */

export { Card, type CardConfig } from "./Card.js";
export { Legend, type LegendConfig, type LegendItem } from "./Legend.js";
export {
  Timeline,
  TimelinePeriodBar,
  TimelineEventMarker,
  type TimelineConfig,
  type TimelineEvent,
  type TimelinePeriod,
  type TimelineBreak,
} from "./Timeline.js";
export {
  PeriodicElement,
  type ElementData,
  ElementCategory,
  type PeriodicElementConfig,
} from "./PeriodicElement.js";
export {
  PeriodicTable,
  type PeriodicTableConfig,
} from "./PeriodicTable.js";
export {
  ChemFig,
  ChemicalFormula,
  type ChemFigConfig,
  ChemicalStructures,
  ChemicalReactions,
} from "./ChemFig.js";
export {
  Treemap,
  type TreemapConfig,
  type TreemapNode,
} from "./Treemap.js";
export {
  Alluvial,
  type AlluvialConfig,
  type AlluvialNode,
  type AlluvialFlow,
  type AlluvialStage,
  type AlluvialNodeBlock,
} from "./Alluvial.js";

