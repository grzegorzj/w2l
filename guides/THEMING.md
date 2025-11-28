# Theming System

The W2L library includes a comprehensive theming system inspired by modern Swiss design principles. The theme system provides a consistent, professional visual language across all components.

## Design Philosophy

The default Swiss theme follows these principles:

- **Dimmed, Professional Colors**: No flashy colors; all colors are muted and refined
- **Delicate Highlighting**: Subtle borders and backgrounds for emphasis
- **Screen-Optimized**: Small paddings, small border radiuses, designed for digital display
- **Clean Typography**: Clear hierarchy using Space Grotesk and Inter font families
- **Narrow Bars**: Charts use narrow bars (60% width) for a refined, non-stark appearance

## Quick Start

### Using the Default Theme

```typescript
import { Artboard, ThemedBox, defaultTheme } from "w2l";

// Create an artboard with theme
const artboard = new Artboard({
  width: 800,
  height: 600,
  theme: defaultTheme,
});

// Create a themed box (automatically styled)
const box = new ThemedBox({
  width: 200,
  height: 100,
});
```

### Applying Theme to Components

#### Manual Style Application

```typescript
import { Text, defaultTheme } from "w2l";

const heading = new Text({
  text: "My Heading",
  style: {
    ...defaultTheme.presets.heading,
    fontSize: defaultTheme.typography.sizes["3xl"],
  },
});

const paragraph = new Text({
  text: "Body text",
  style: defaultTheme.presets.text,
});
```

#### Themed Charts

```typescript
import { BarChart, defaultTheme } from "w2l";

const chart = new BarChart({
  width: 400,
  height: 300,
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    // ...
  ],
  barSpacing: 0.4, // Narrow bars
  barColor: defaultTheme.colors.neutral[600],
  barStyle: defaultTheme.presets.barChart.bar,
  style: {
    fill: defaultTheme.colors.background,
    stroke: defaultTheme.colors.border,
    strokeWidth: String(defaultTheme.borders.width),
  },
});
```

## Theme Structure

The theme object contains the following sections:

### Colors

```typescript
{
  background: "#FFFFFF",
  foreground: "#000000",
  primary: "hsl(358, 85%, 52%)", // Swiss Red
  neutral: {
    50: "#FAFAFA",   // Lightest
    100: "#F5F5F5",
    200: "#E5E5E5",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    800: "#262626",  // Darkest
  },
  border: "hsl(0, 0%, 90%)",
}
```

### Typography

```typescript
{
  fontDisplay: "Space Grotesk, sans-serif", // For headings
  fontSans: "Inter, sans-serif",            // For body text
  sizes: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem",// 30px
    "5xl": "3rem",    // 48px
    "7xl": "4.5rem",  // 72px
  },
  weights: {
    light: 300,
    medium: 500,
    bold: 700,
  },
}
```

### Spacing

```typescript
{
  1: 4,    // 4px
  2: 8,    // 8px
  3: 12,   // 12px
  4: 16,   // 16px
  6: 24,   // 24px
  8: 32,   // 32px
  12: 48,  // 48px
  16: 64,  // 64px
  24: 96,  // 96px
}
```

### Presets

The theme includes predefined style presets for common use cases:

#### Container Preset

```typescript
{
  fill: "#FFFFFF",
  stroke: "hsl(0, 0%, 90%)",
  strokeWidth: "1",
}
```

#### Text Preset

```typescript
{
  fill: "#262626",
  fontFamily: "Inter, sans-serif",
  fontSize: "1rem",
  fontWeight: "400",
}
```

#### Heading Preset

```typescript
{
  fill: "#000000",
  fontFamily: "Space Grotesk, sans-serif",
  fontSize: "1.5rem",
  fontWeight: "700",
}
```

#### Highlight Preset

```typescript
{
  fill: "#FAFAFA",
  stroke: "#737373",
  strokeWidth: "1",
}
```

#### Chart Presets

```typescript
{
  barChart: {
    bar: {
      fill: "#737373",
      stroke: "#525252",
      strokeWidth: "0.5",
    },
    barWidth: 0.6, // 60% width for narrow bars
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
  // Similar presets for lineChart and graph...
}
```

## Creating Custom Themes

### Extending the Default Theme

```typescript
import { createTheme, SwissTheme } from "w2l";

const myTheme = createTheme(SwissTheme, {
  colors: {
    primary: "hsl(220, 85%, 52%)", // Custom blue
  },
  presets: {
    container: {
      fill: "#F5F5F5", // Light gray background
    },
  },
});
```

### Creating a Theme from Scratch

```typescript
import { type Theme } from "w2l";

const darkTheme: Theme = {
  name: "Dark",
  colors: {
    background: "#1A1A1A",
    foreground: "#FFFFFF",
    primary: "hsl(200, 85%, 52%)",
    neutral: {
      50: "#2A2A2A",
      100: "#333333",
      200: "#404040",
      400: "#666666",
      500: "#808080",
      600: "#999999",
      800: "#CCCCCC",
    },
    border: "hsl(0, 0%, 30%)",
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
  // ... rest of theme properties
};
```

## Components with Built-in Theme Support

### ThemedBox

The `ThemedBox` component automatically applies theme styles:

```typescript
import { ThemedBox, defaultTheme } from "w2l";

// Standard box
const box = new ThemedBox({
  width: 150,
  height: 100,
});

// Highlighted box
const highlightBox = new ThemedBox({
  width: 150,
  height: 100,
  style: defaultTheme.presets.highlight,
});

// Custom styled box
const customBox = new ThemedBox({
  width: 150,
  height: 100,
  style: {
    fill: defaultTheme.colors.neutral[50],
    stroke: defaultTheme.colors.primary,
    strokeWidth: "2",
  },
});
```

### Artboard with Theme

```typescript
import { Artboard, defaultTheme } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
  theme: defaultTheme, // Automatically applies theme background
});

// Access theme
const theme = artboard.getTheme();
```

## Best Practices

1. **Use Theme Constants**: Reference theme values instead of hardcoding colors and sizes
   ```typescript
   // Good
   style: { fill: theme.colors.neutral[600] }
   
   // Avoid
   style: { fill: "#525252" }
   ```

2. **Apply Consistent Spacing**: Use theme spacing scale for layouts
   ```typescript
   new Container({
     spacing: theme.spacing[4], // 16px
     boxModel: {
       padding: theme.spacing[3], // 12px
     },
   });
   ```

3. **Use Presets**: Start with presets and customize as needed
   ```typescript
   new Text({
     text: "Content",
     style: {
       ...theme.presets.text,
       fontSize: theme.typography.sizes.xl, // Override size
     },
   });
   ```

4. **Chart Styling**: Apply theme consistently to charts
   ```typescript
   new BarChart({
     // ...data
     barSpacing: 0.4, // Narrow bars
     barColor: theme.colors.neutral[600],
     barStyle: theme.presets.barChart.bar,
   });
   ```

## Examples

See the following examples in the playground:

- `playground/examples/tests/themed-demo.js` - Basic theme demonstration
- `playground/examples/tests/themed-charts.js` - Themed charts showcase

## API Reference

### Theme Interface

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  sizing: ThemeSizing;
  borders: ThemeBorders;
  grid: ThemeGrid;
  presets: ThemePresets;
}
```

### Functions

- `getTheme(name?: string): Theme` - Get a theme by name
- `createTheme(base: Theme, overrides: Partial<Theme>): Theme` - Create custom theme
- `defaultTheme: Theme` - The default Swiss theme instance

### Themed Components

- `ThemedBox` - Rectangular container with automatic theme styling
- `Artboard` - Root canvas with optional theme support

## Future Enhancements

Planned improvements to the theme system:

- [ ] Additional built-in themes (light, dark, high-contrast)
- [ ] Theme context propagation (parent-to-child theme inheritance)
- [ ] More themed components (ThemedText, ThemedChart, etc.)
- [ ] Theme animation and transitions
- [ ] CSS variable export for web integration

