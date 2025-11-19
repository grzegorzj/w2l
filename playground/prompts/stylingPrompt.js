export const STYLING_PROMPT = `
# Styling Phase

In this phase, decide on the visual style and aesthetics for your diagram.

## Default Style Guidelines

Unless the user specifies otherwise, follow these defaults:

### Color Palette
- **Primary shapes**: Use soft, modern colors
  - Blues: #3B82F6 (primary), #60A5FA (lighter)
  - Greens: #10B981 (success), #34D399 (lighter)
  - Purples: #8B5CF6 (accent), #A78BFA (lighter)
  - Oranges: #F59E0B (warning), #FBBF24 (lighter)
  - Grays: #6B7280 (text), #9CA3AF (secondary text), #E5E7EB (borders)

- **Backgrounds**: 
  - White (#FFFFFF) or very light gray (#F9FAFB)
  - For emphasis: Light tints of primary colors with 10-20% opacity

- **Text**:
  - Headings: #111827 (dark gray/black)
  - Body text: #374151 (medium gray)
  - Secondary text: #6B7280 (light gray)

### Typography
- **Font**: System default (Arial/sans-serif)
- **Sizes**:
  - Large headings: 24-32pt
  - Subheadings: 18-20pt
  - Body text: 14-16pt
  - Labels: 12-14pt
  - Small annotations: 10-12pt
- **Weights**: 
  - Headings: bold
  - Body: normal
  - Labels: normal or semi-bold for emphasis

### Shape Styling
- **Strokes**: 
  - Default width: 2px
  - Thin: 1px (for subtle elements)
  - Thick: 3-4px (for emphasis)
  - Color: Usually darker shade of fill, or gray for neutral

- **Fills**:
  - Use solid colors with appropriate opacity
  - For backgrounds: 80-100% opacity
  - For overlays: 20-40% opacity

- **Corners**:
  - Rectangles: 8-12px border radius for modern look
  - Use 0px for technical/grid-like diagrams
  - Circles: Always fully rounded

### Spacing & Layout
- **Padding**: 16-24px around text in containers
- **Margins**: 20-40px between major sections
- **Gaps**: 12-16px between related elements
- **Alignment**: Center-align headings, left-align body text

### Arrows & Connectors
- **Stroke width**: 2px standard, 3px for emphasis
- **Colors**: Match the element they're connecting, or use neutral gray
- **Arrow heads**: Medium size (8-12px)
- **Style**: Straight lines for formal/technical, curved for organic/flow

## Style Customization

If user specifies a style, adapt accordingly:

### Minimalist
- Reduce stroke widths to 1px
- Use monochrome (black/white/grays only)
- Increase whitespace
- Remove unnecessary decorations

### Bold/Vibrant
- Increase stroke widths to 3-4px
- Use saturated, bright colors
- High contrast
- Stronger shadows or borders

### Technical/Engineering
- Use monospace font for labels
- Sharp corners (no border radius)
- Grid-aligned positioning
- Precise, measured spacing
- Technical colors (blues, greens)

### Playful/Creative
- Varied colors and sizes
- Rounded corners everywhere
- Asymmetric layouts
- Hand-drawn style strokes

## Decision Checklist

For your current task, decide:

1. **Color scheme**: What colors will you use for each element type?
2. **Typography**: What font sizes and weights?
3. **Shape styles**: What stroke widths, fill opacities, border radii?
4. **Spacing**: How much space between elements?
5. **Special effects**: Any shadows, gradients, or special treatments?

Write these decisions clearly before moving to implementation.
`;

