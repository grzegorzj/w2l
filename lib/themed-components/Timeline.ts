/**
 * Timeline - A component for visualizing events and periods across time.
 *
 * Features:
 * - Multiple tracks for stacking non-overlapping periods
 * - Point events (marks in time)
 * - Period spans (bars showing duration)
 * - Year markers and labels
 * - Collapsed intervals for large time gaps
 * - Themed tooltips for events and periods
 * - Position accessors for all elements
 */

import { Container } from "../layout/Container.js";
import { Rect } from "../elements/Rect.js";
import { Line } from "../elements/Line.js";
import { Circle } from "../elements/Circle.js";
import { Text } from "../elements/Text.js";
import { TextArea } from "../elements/TextArea.js";
import { Element, type Position } from "../core/Element.js";
import { type Style } from "../core/Stylable.js";
import { defaultTheme } from "../core/Theme.js";

/**
 * A point event in time.
 */
export interface TimelineEvent {
  /** Time of the event (Date object or timestamp in milliseconds) */
  time: Date | number;
  /** Label for the event */
  label: string;
  /** Color for the event marker */
  color?: string;
  /** Optional long-form description */
  description?: string;
}

/**
 * A period spanning time.
 */
export interface TimelinePeriod {
  /** Start time (Date object or timestamp in milliseconds) */
  start: Date | number;
  /** End time (Date object or timestamp in milliseconds) */
  end: Date | number;
  /** Label for the period */
  label: string;
  /** Color for the period bar */
  color: string;
  /** Which track to display on (0-based, for stacking) */
  track?: number;
  /** Optional style overrides for the bar */
  style?: Partial<Style>;
}

/**
 * A break in the timeline to collapse large gaps.
 */
export interface TimelineBreak {
  /** Start of the collapsed interval */
  start: Date | number;
  /** End of the collapsed interval */
  end: Date | number;
  /** Visual width to allocate to the break (in pixels) */
  width?: number;
}

export interface TimelineConfig {
  /** Total width of the timeline */
  width: number;
  
  /** Time range to display */
  timeRange: {
    start: Date | number;
    end: Date | number;
  };
  
  /** Point events to mark */
  events?: TimelineEvent[];
  
  /** Time periods to display */
  periods?: TimelinePeriod[];
  
  /** Intervals to collapse (for large gaps) */
  breaks?: TimelineBreak[];
  
  /** Show year markers and labels */
  yearMarkers?: boolean | number;
  
  /** Height of each track for periods */
  trackHeight?: number;
  
  /** Spacing between tracks */
  trackSpacing?: number;
  
  /** Height of the main timeline axis */
  axisHeight?: number;
  
  /** Font size for labels */
  fontSize?: number;
}

/**
 * Internal representation of a time segment (for handling breaks).
 */
interface TimeSegment {
  realStart: number;
  realEnd: number;
  visualStart: number;
  visualEnd: number;
  isBreak: boolean;
}

/**
 * Represents a period bar with position accessors.
 */
export class TimelinePeriodBar {
  public rect: Rect;
  private _label?: Container;

  constructor(rect: Rect, label?: Container) {
    this.rect = rect;
    this._label = label;
  }

  get topLeft(): Position { return this.rect.topLeft; }
  get topRight(): Position { return this.rect.topRight; }
  get bottomLeft(): Position { return this.rect.bottomLeft; }
  get bottomRight(): Position { return this.rect.bottomRight; }
  get center(): Position { return this.rect.center; }
  get topCenter(): Position { return this.rect.topCenter; }
  get bottomCenter(): Position { return this.rect.bottomCenter; }
  get centerLeft(): Position { return this.rect.centerLeft; }
  get centerRight(): Position { return this.rect.centerRight; }
  get label(): Container | undefined { return this._label; }
}

/**
 * Represents an event marker with position accessors.
 */
export class TimelineEventMarker {
  public circle: Circle;
  public tooltip: Container;

  constructor(circle: Circle, tooltip: Container) {
    this.circle = circle;
    this.tooltip = tooltip;
  }

  get center(): Position { return this.circle.center; }
  get topLeft(): Position { return this.tooltip.topLeft; }
  get topRight(): Position { return this.tooltip.topRight; }
  get bottomLeft(): Position { return this.tooltip.bottomLeft; }
  get bottomRight(): Position { return this.tooltip.bottomRight; }
  get topCenter(): Position { return this.tooltip.topCenter; }
  get bottomCenter(): Position { return this.tooltip.bottomCenter; }
  get centerLeft(): Position { return this.tooltip.centerLeft; }
  get centerRight(): Position { return this.tooltip.centerRight; }
}

/**
 * Timeline component for visualizing chronological data.
 */
export class Timeline {
  private mainContainer: Container;
  private config: Required<
    Omit<TimelineConfig, "events" | "periods" | "breaks" | "yearMarkers">
  > & {
    events: TimelineEvent[];
    periods: TimelinePeriod[];
    breaks: TimelineBreak[];
    yearMarkers: boolean | number;
  };
  private segments: TimeSegment[] = [];
  private timelineWidth: number;
  private _periodBars: TimelinePeriodBar[] = [];
  private _eventMarkers: TimelineEventMarker[] = [];

  constructor(config: TimelineConfig) {
    this.config = {
      width: config.width,
      timeRange: config.timeRange,
      events: config.events ?? [],
      periods: config.periods ?? [],
      breaks: config.breaks ?? [],
      yearMarkers: config.yearMarkers ?? true,
      trackHeight: config.trackHeight ?? 30,
      trackSpacing: config.trackSpacing ?? 8,
      axisHeight: config.axisHeight ?? 2,
      fontSize: config.fontSize ?? 12,
    };

    this.timelineWidth = this.config.width - 40;
    this.buildTimeSegments();

    const maxTrack = this.config.periods.reduce(
      (max, p) => Math.max(max, p.track ?? 0),
      0
    );
    const periodsHeight =
      (maxTrack + 1) * this.config.trackHeight +
      maxTrack * this.config.trackSpacing;
    const eventsHeight = 80; // Space for event markers below
    const labelsHeight = 30; // Space for year labels
    const totalHeight =
      periodsHeight + eventsHeight + labelsHeight + this.config.axisHeight + 60;

    this.mainContainer = new Container({
      width: this.config.width,
      height: totalHeight,
      direction: "freeform",
      boxModel: { padding: 20 },
    });

    this.buildTimeline();
  }

  private buildTimeSegments(): void {
    const start = this.toTimestamp(this.config.timeRange.start);
    const end = this.toTimestamp(this.config.timeRange.end);

    const sortedBreaks = [...this.config.breaks].sort(
      (a, b) => this.toTimestamp(a.start) - this.toTimestamp(b.start)
    );

    let totalRealTime = end - start;
    let totalBreakWidth = 0;

    for (const breakItem of sortedBreaks) {
      const breakStart = this.toTimestamp(breakItem.start);
      const breakEnd = this.toTimestamp(breakItem.end);
      const breakDuration = breakEnd - breakStart;
      totalRealTime -= breakDuration;
      totalBreakWidth += breakItem.width ?? 40;
    }

    const availableWidth = this.timelineWidth - totalBreakWidth;
    const pxPerMs = availableWidth / totalRealTime;

    let currentRealTime = start;
    let currentVisualX = 0;

    for (const breakItem of sortedBreaks) {
      const breakStart = this.toTimestamp(breakItem.start);
      const breakEnd = this.toTimestamp(breakItem.end);

      if (currentRealTime < breakStart) {
        const segmentDuration = breakStart - currentRealTime;
        const segmentWidth = segmentDuration * pxPerMs;

        this.segments.push({
          realStart: currentRealTime,
          realEnd: breakStart,
          visualStart: currentVisualX,
          visualEnd: currentVisualX + segmentWidth,
          isBreak: false,
        });

        currentVisualX += segmentWidth;
        currentRealTime = breakStart;
      }

      const breakWidth = breakItem.width ?? 40;
      this.segments.push({
        realStart: breakStart,
        realEnd: breakEnd,
        visualStart: currentVisualX,
        visualEnd: currentVisualX + breakWidth,
        isBreak: true,
      });

      currentVisualX += breakWidth;
      currentRealTime = breakEnd;
    }

    if (currentRealTime < end) {
      const segmentDuration = end - currentRealTime;
      const segmentWidth = segmentDuration * pxPerMs;

      this.segments.push({
        realStart: currentRealTime,
        realEnd: end,
        visualStart: currentVisualX,
        visualEnd: currentVisualX + segmentWidth,
        isBreak: false,
      });
    }
  }

  private toTimestamp(time: Date | number): number {
    return time instanceof Date ? time.getTime() : time;
  }

  private timeToX(time: Date | number): number {
    const timestamp = this.toTimestamp(time);

    for (const segment of this.segments) {
      if (timestamp >= segment.realStart && timestamp <= segment.realEnd) {
        if (segment.isBreak) {
          return (segment.visualStart + segment.visualEnd) / 2;
        } else {
          const progress =
            (timestamp - segment.realStart) / (segment.realEnd - segment.realStart);
          return (
            segment.visualStart +
            progress * (segment.visualEnd - segment.visualStart)
          );
        }
      }
    }

    return 0;
  }

  private buildTimeline(): void {
    const baseY = 100; // Y position of the main axis

    // Draw main timeline axis
    this.drawAxis(baseY);

    // Draw year markers
    if (this.config.yearMarkers !== false) {
      this.drawYearMarkers(baseY);
    }

    // Draw breaks
    this.drawBreaks(baseY);

    // Draw periods (above the timeline)
    this.drawPeriods(baseY);

    // Draw events (below the timeline)
    this.drawEvents(baseY);
  }

  private drawAxis(y: number): void {
    for (const segment of this.segments) {
      if (!segment.isBreak) {
        const line = new Line({
          start: { x: segment.visualStart, y: y },
          end: { x: segment.visualEnd, y: y },
          style: {
            stroke: defaultTheme.colors.neutral[800],
            strokeWidth: String(this.config.axisHeight),
          },
        });
        this.mainContainer.addElement(line);
      }
    }
  }

  /**
   * Check if a timestamp falls within a break segment.
   */
  private isInBreak(timestamp: number): boolean {
    for (const segment of this.segments) {
      if (segment.isBreak && timestamp >= segment.realStart && timestamp <= segment.realEnd) {
        return true;
      }
    }
    return false;
  }

  private drawYearMarkers(axisY: number): void {
    const start = this.toTimestamp(this.config.timeRange.start);
    const end = this.toTimestamp(this.config.timeRange.end);
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const interval =
      typeof this.config.yearMarkers === "number" ? this.config.yearMarkers : 10;

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const firstYear = Math.ceil(startYear / interval) * interval;

    for (let year = firstYear; year <= endYear; year += interval) {
      const yearDate = new Date(year, 0, 1);
      const timestamp = yearDate.getTime();

      if (timestamp < start || timestamp > end) continue;

      // Skip years that fall within collapsed intervals
      if (this.isInBreak(timestamp)) continue;

      const x = this.timeToX(timestamp);

      const tick = new Line({
        start: { x, y: axisY - 8 },
        end: { x, y: axisY + 8 },
        style: {
          stroke: defaultTheme.colors.neutral[600],
          strokeWidth: "1",
        },
      });
      this.mainContainer.addElement(tick);

      const label = new Text({
        content: String(year),
        fontSize: this.config.fontSize,
        style: {
          fill: defaultTheme.colors.neutral[600],
          fontFamily: defaultTheme.typography.fontSans,
        },
      });
      label.position({
        relativeTo: { x, y: axisY + 20 },
        relativeFrom: label.topCenter,
        x: 0,
        y: 0,
      });
      this.mainContainer.addElement(label);
    }
  }

  private drawBreaks(axisY: number): void {
    for (const segment of this.segments) {
      if (segment.isBreak) {
        const zigzagHeight = 12;
        const zigzagPoints = [
          { x: segment.visualStart, y: axisY },
          { x: segment.visualStart + 8, y: axisY - zigzagHeight },
          { x: segment.visualStart + 16, y: axisY + zigzagHeight },
          { x: segment.visualEnd - 16, y: axisY - zigzagHeight },
          { x: segment.visualEnd - 8, y: axisY + zigzagHeight },
          { x: segment.visualEnd, y: axisY },
        ];

        for (let i = 0; i < zigzagPoints.length - 1; i++) {
          const line = new Line({
            start: zigzagPoints[i],
            end: zigzagPoints[i + 1],
            style: {
              stroke: defaultTheme.colors.neutral[400],
              strokeWidth: "1.5",
            },
          });
          this.mainContainer.addElement(line);
        }
      }
    }
  }

  private drawPeriods(axisY: number): void {
    for (const period of this.config.periods) {
      const startX = this.timeToX(period.start);
      const endX = this.timeToX(period.end);
      const width = endX - startX;

      if (width <= 0) continue;

      const track = period.track ?? 0;
      const y =
        axisY -
        (track + 1) * this.config.trackHeight -
        track * this.config.trackSpacing -
        10;

      // Calculate border color (slightly darker than fill)
      const borderColor = this.darkenColor(period.color, 0.2);

      // Draw period bar with themed styling
      const bar = new Rect({
        width,
        height: this.config.trackHeight,
        style: {
          fill: period.color,
          stroke: borderColor,
          strokeWidth: "1",
          ...period.style,
        },
        boxModel: { border: 0 }, // No box model border, just visual stroke
      });
      
      // Set border radius using a custom method (we'll need to add this to Rect)
      (bar as any)._borderRadius = defaultTheme.borders.radius.sm;
      
      bar.position({
        relativeTo: { x: startX, y },
        relativeFrom: bar.borderBox.topLeft,
        x: 0,
        y: 0,
      });
      this.mainContainer.addElement(bar);

      let tooltip: Container | undefined;

      // Add label inside bar if there's space, otherwise create tooltip
      if (width > 60) {
        const label = new Text({
          content: period.label,
          fontSize: this.config.fontSize - 1,
          style: {
            fill: "#FFFFFF",
            fontFamily: defaultTheme.typography.fontSans,
            fontWeight: "500",
          },
        });
        label.position({
          relativeTo: { x: startX + width / 2, y: y + this.config.trackHeight / 2 },
          relativeFrom: label.center,
          x: 0,
          y: 0,
        });
        this.mainContainer.addElement(label);
      } else if (width > 20) {
        // Create tooltip above bar for small bars
        tooltip = this.createTooltip(period.label, undefined);
        tooltip.position({
          relativeTo: { x: startX + width / 2, y: y - 5 },
          relativeFrom: tooltip.bottomCenter,
          x: 0,
          y: 0,
        });
        this.mainContainer.addElement(tooltip);
      }

      this._periodBars.push(new TimelinePeriodBar(bar, tooltip));
    }
  }

  private drawEvents(axisY: number): void {
    for (const event of this.config.events) {
      const x = this.timeToX(event.time);
      const color = event.color ?? defaultTheme.colors.primary;

      // Draw event marker (circle)
      const marker = new Circle({
        radius: 5,
        style: {
          fill: color,
          stroke: "#FFFFFF",
          strokeWidth: "2",
        },
      });
      marker.position({
        relativeTo: { x, y: axisY },
        relativeFrom: marker.center,
        x: 0,
        y: 0,
      });
      this.mainContainer.addElement(marker);

      // Create themed tooltip below the axis
      const tooltip = this.createTooltip(event.label, event.description);
      tooltip.position({
        relativeTo: { x, y: axisY + 15 },
        relativeFrom: tooltip.topCenter,
        x: 0,
        y: 0,
      });
      this.mainContainer.addElement(tooltip);

      this._eventMarkers.push(new TimelineEventMarker(marker, tooltip));
    }
  }

  /**
   * Create a themed tooltip container with label and optional description.
   */
  private createTooltip(label: string, description?: string): Container {
    const tooltipContent = new Container({
      width: "auto",
      height: "auto",
      direction: "vertical",
      spacing: 6,
      boxModel: { padding: 8 },
      style: {
        fill: defaultTheme.colors.background,
        stroke: defaultTheme.colors.border,
        strokeWidth: "1",
      },
    });

    // Set border radius
    (tooltipContent as any)._borderRadius = defaultTheme.borders.radius.sm;

    // Add label
    const labelText = new Text({
      content: label,
      fontSize: this.config.fontSize,
      style: {
        fill: defaultTheme.colors.foreground,
        fontFamily: defaultTheme.typography.fontSans,
        fontWeight: "500",
      },
    });
    tooltipContent.addElement(labelText);

    // Add description if provided
    if (description) {
      const descText = new TextArea({
        content: description,
        width: 200,
        fontSize: this.config.fontSize - 1,
        lineHeight: 1.4,
        style: {
          color: defaultTheme.colors.neutral[600],
          fontFamily: defaultTheme.typography.fontSans,
        },
      });
      tooltipContent.addElement(descText);
    }

    return tooltipContent;
  }

  /**
   * Darken a color by a percentage.
   */
  private darkenColor(color: string, amount: number): string {
    // Simple darkening for hex colors
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
      const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
      const b = Math.max(0, (num & 0xff) * (1 - amount));
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return color; // Return as-is for non-hex colors
  }

  /**
   * Get all period bars with position accessors.
   */
  get periodBars(): TimelinePeriodBar[] {
    return this._periodBars;
  }

  /**
   * Get all event markers with position accessors.
   */
  get eventMarkers(): TimelineEventMarker[] {
    return this._eventMarkers;
  }

  /**
   * Get the main container to add to the artboard or parent.
   */
  get container(): Container {
    return this.mainContainer;
  }

  get width(): number {
    return this.config.width;
  }

  get height(): number {
    return this.mainContainer.height;
  }

  // Position accessors for the entire timeline
  get topLeft(): Position { return this.mainContainer.topLeft; }
  get topRight(): Position { return this.mainContainer.topRight; }
  get bottomLeft(): Position { return this.mainContainer.bottomLeft; }
  get bottomRight(): Position { return this.mainContainer.bottomRight; }
  get center(): Position { return this.mainContainer.center; }
  get topCenter(): Position { return this.mainContainer.topCenter; }
  get bottomCenter(): Position { return this.mainContainer.bottomCenter; }
  get centerLeft(): Position { return this.mainContainer.centerLeft; }
  get centerRight(): Position { return this.mainContainer.centerRight; }
}
