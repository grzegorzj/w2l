/**
 * Theme system for consistent styling across elements.
 * 
 * Provides a centralized theming system that can be applied to various
 * components in the library. Themes control colors, strokes, borders,
 * typography, and other visual properties.
 * 
 * Inspired by modern Swiss design principles:
 * - Dimmed, professional color palette
 * - Delicate highlighting with subtle borders
 * - Clean typography and consistent spacing
 * - Designed for screen display
 */

import { type Style } from "./Stylable.js";

/**
 * Theme configuration for styling elements consistently.
 */
export interface Theme {
  /**
   * Theme name identifier.
   */
  name: string;

  /**
   * Color palette - dimmed and professional.
   */
  colors: {
    /** Primary background color */
    background: string;
    /** Primary foreground/text color */
    foreground: string;
    /** Swiss Red accent color */
    primary: string;
    /** Neutral shades for backgrounds and UI elements */
    neutral: {
      50: string;
      100: string;
      200: string;
      400: string;
      500: string;
      600: string;
      800: string;
    };
    /** Border color */
    border: string;
  };

  /**
   * Typography settings - Swiss design aesthetics.
   */
  typography: {
    /** Display font family (for headings) */
    fontDisplay: string;
    /** Sans-serif font family (for body) */
    fontSans: string;
    /** Font sizes */
    sizes: {
      xs: string;
      sm: string;
      base: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "5xl": string;
      "7xl": string;
    };
    /** Font weights */
    weights: {
      light: number;
      medium: number;
      bold: number;
    };
  };

  /**
   * Spacing scale - consistent rhythm.
   */
  spacing: {
    1: number;
    2: number;
    3: number;
    4: number;
    6: number;
    8: number;
    12: number;
    16: number;
    24: number;
  };

  /**
   * Sizing scale.
   */
  sizing: {
    8: number;
    20: number;
    /** Max width constraints */
    maxW: {
      xl: number;
      "2xl": number;
      "7xl": number;
    };
  };

  /**
   * Border styles - delicate and refined.
   */
  borders: {
    /** Default border width */
    width: number;
    /** Border radius */
    radius: {
      sm: number;
      full: number;
    };
  };

  /**
   * Grid system.
   */
  grid: {
    /** Base grid size */
    size: number;
  };

  /**
   * Predefined styles for common use cases.
   */
  presets: {
    /** Style for primary boxes/containers */
    container: Partial<Style>;
    /** Style for text elements */
    text: Partial<Style>;
    /** Style for headings */
    heading: Partial<Style>;
    /** Style for connectors/lines */
    connector: Partial<Style>;
    /** Style for highlighted/accented elements */
    highlight: Partial<Style>;
    /** Style for bar charts */
    barChart: {
      bar: Partial<Style>;
      barWidth: number;
      axis: Partial<Style>;
      grid: Partial<Style>;
    };
    /** Style for line charts */
    lineChart: {
      line: Partial<Style>;
      point: Partial<Style>;
      axis: Partial<Style>;
      grid: Partial<Style>;
    };
    /** Style for graphs */
    graph: {
      axis: Partial<Style>;
      grid: Partial<Style>;
      plot: Partial<Style>;
    };
  };
}

/**
 * Default Swiss Design inspired theme.
 * 
 * Features:
 * - Modern, dimmed color palette (no flashy colors)
 * - Delicate highlighting with subtle borders
 * - Small paddings and border radiuses
 * - Designed for screen display
 * - Narrow bars for graphs (no stark design)
 * - Professional and refined aesthetics
 */
export const SwissTheme: Theme = {
  name: "Swiss",
  
  colors: {
    background: "#FFFFFF",
    foreground: "#000000",
    primary: "hsl(358, 85%, 52%)", // Swiss Red
    neutral: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      400: "#A3A3A3",
      500: "#737373",
      600: "#525252",
      800: "#262626",
    },
    border: "hsl(0, 0%, 90%)",
  },

  typography: {
    fontDisplay: "Space Grotesk, sans-serif",
    fontSans: "Inter, sans-serif",
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "5xl": "3rem",
      "7xl": "4.5rem",
    },
    weights: {
      light: 300,
      medium: 500,
      bold: 700,
    },
  },

  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: 24,
    8: 32,
    12: 48,
    16: 64,
    24: 96,
  },

  sizing: {
    8: 32,
    20: 80,
    maxW: {
      xl: 576,
      "2xl": 672,
      "7xl": 1280,
    },
  },

  borders: {
    width: 1,
    radius: {
      sm: 4,
      full: 9999,
    },
  },

  grid: {
    size: 40,
  },

  presets: {
    container: {
      fill: "#FFFFFF",
      stroke: "hsl(0, 0%, 90%)",
      strokeWidth: "1",
    },
    text: {
      fill: "#262626",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px", // Screen-optimized
      fontWeight: "400",
    },
    heading: {
      fill: "#000000",
      fontFamily: "Space Grotesk, sans-serif",
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    connector: {
      stroke: "#525252",
      strokeWidth: "1",
      fill: "none",
    },
    highlight: {
      fill: "#FAFAFA",
      stroke: "#737373",
      strokeWidth: "1",
    },
    barChart: {
      bar: {
        fill: "#737373",
        stroke: "#525252",
        strokeWidth: "0.5",
      },
      barWidth: 0.6, // Narrow bars (60% of available space)
      axis: {
        stroke: "#525252",
        strokeWidth: "1",
      },
      grid: {
        stroke: "#E5E5E5",
        strokeWidth: "0.5",
        opacity: "0.5",
      },
    },
    lineChart: {
      line: {
        stroke: "#737373",
        strokeWidth: "2",
        fill: "none",
      },
      point: {
        fill: "#525252",
        stroke: "#FFFFFF",
        strokeWidth: "2",
      },
      axis: {
        stroke: "#525252",
        strokeWidth: "1",
      },
      grid: {
        stroke: "#E5E5E5",
        strokeWidth: "0.5",
        opacity: "0.5",
      },
    },
    graph: {
      axis: {
        stroke: "#525252",
        strokeWidth: "1",
      },
      grid: {
        stroke: "#E5E5E5",
        strokeWidth: "0.5",
        opacity: "0.5",
      },
      plot: {
        stroke: "#737373",
      strokeWidth: "2",
        fill: "none",
      },
    },
  },
};

/**
 * Get a theme by name or use default.
 * 
 * @param name - Theme name (currently only 'swiss' is implemented)
 * @returns The requested theme
 */
export function getTheme(name: string = "swiss"): Theme {
  // For now, we only have one theme
  // In the future, we could add more themes here
  return SwissTheme;
}

/**
 * Create a custom theme by extending an existing theme.
 * 
 * @param baseTheme - The base theme to extend
 * @param overrides - Partial theme properties to override
 * @returns A new theme with the overrides applied
 * 
 * @example
 * ```typescript
 * const myTheme = createTheme(SwissTheme, {
 *   colors: {
 *     primary: "hsl(220, 85%, 52%)", // Custom blue
 *   },
 *   presets: {
 *     container: {
 *       fill: "#F5F5F5",
 *     },
 *   },
 * });
 * ```
 */
export function createTheme(
  baseTheme: Theme,
  overrides: Partial<Theme>
): Theme {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
      neutral: {
        ...baseTheme.colors.neutral,
        ...(overrides.colors as any)?.neutral,
      },
    },
    typography: {
      ...baseTheme.typography,
      ...overrides.typography,
      sizes: {
        ...baseTheme.typography.sizes,
        ...(overrides.typography as any)?.sizes,
      },
      weights: {
        ...baseTheme.typography.weights,
        ...(overrides.typography as any)?.weights,
      },
    },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    sizing: {
      ...baseTheme.sizing,
      ...overrides.sizing,
      maxW: {
        ...baseTheme.sizing.maxW,
        ...(overrides.sizing as any)?.maxW,
      },
    },
    borders: {
      ...baseTheme.borders,
      ...overrides.borders,
      radius: {
        ...baseTheme.borders.radius,
        ...(overrides.borders as any)?.radius,
      },
    },
    grid: { ...baseTheme.grid, ...overrides.grid },
    presets: {
      ...baseTheme.presets,
      ...overrides.presets,
      container: { ...baseTheme.presets.container, ...(overrides.presets as any)?.container },
      text: { ...baseTheme.presets.text, ...(overrides.presets as any)?.text },
      heading: { ...baseTheme.presets.heading, ...(overrides.presets as any)?.heading },
      connector: { ...baseTheme.presets.connector, ...(overrides.presets as any)?.connector },
      highlight: { ...baseTheme.presets.highlight, ...(overrides.presets as any)?.highlight },
      barChart: {
        ...baseTheme.presets.barChart,
        ...(overrides.presets as any)?.barChart,
        bar: { ...baseTheme.presets.barChart.bar, ...(overrides.presets as any)?.barChart?.bar },
        axis: { ...baseTheme.presets.barChart.axis, ...(overrides.presets as any)?.barChart?.axis },
        grid: { ...baseTheme.presets.barChart.grid, ...(overrides.presets as any)?.barChart?.grid },
      },
      lineChart: {
        ...baseTheme.presets.lineChart,
        ...(overrides.presets as any)?.lineChart,
        line: { ...baseTheme.presets.lineChart.line, ...(overrides.presets as any)?.lineChart?.line },
        point: { ...baseTheme.presets.lineChart.point, ...(overrides.presets as any)?.lineChart?.point },
        axis: { ...baseTheme.presets.lineChart.axis, ...(overrides.presets as any)?.lineChart?.axis },
        grid: { ...baseTheme.presets.lineChart.grid, ...(overrides.presets as any)?.lineChart?.grid },
      },
      graph: {
        ...baseTheme.presets.graph,
        ...(overrides.presets as any)?.graph,
        axis: { ...baseTheme.presets.graph.axis, ...(overrides.presets as any)?.graph?.axis },
        grid: { ...baseTheme.presets.graph.grid, ...(overrides.presets as any)?.graph?.grid },
        plot: { ...baseTheme.presets.graph.plot, ...(overrides.presets as any)?.graph?.plot },
      },
    },
  };
}

/**
 * Default theme instance (Swiss design).
 * Use this as the base for your visualizations.
 */
export const defaultTheme = SwissTheme;

