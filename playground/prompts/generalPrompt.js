export const GENERAL_PROMPT = `
# Development Planning Phase

Now that you have a conceptual breakdown and styling decisions, create a concrete development plan.

## Planning Guidelines

### 1. Break Down Into Implementable Steps

Organize your implementation into logical steps. Each step should be:
- **Concrete**: Specific elements or groups to create
- **Independent**: Can be understood and implemented separately
- **Ordered**: Later steps can build on earlier ones

Example structure:
1. Create artboard and set up basic structure
2. Implement [main section A]
3. Implement [main section B]
4. Add connectors/relationships
5. Add labels and annotations
6. Apply final positioning and styling

### 2. Identify w2l Components Needed

For each step, identify which w2l components you'll need:
- **Shapes**: Rectangle, Circle, Triangle, Polygon, Path, Line, etc.
- **Text**: Text elements with styling
- **Layout**: Container, GridLayout, ColumnsLayout, SpreadLayout
- **Components**: Arrow, or custom compositions
- **Positioning**: Manual positioning vs. layout systems

### 3. Plan Layout Strategy

Decide how to achieve your layout:

**Option A: Manual Positioning**
- Good for: Simple diagrams with few elements
- Use: \`element.setPosition(x, y)\` or \`element.moveTo(x, y)\`
- Consider: Absolute coordinates, or relative positioning

**Option B: Layout Systems**
- Good for: Complex arrangements, repeated patterns
- Use: \`Container\` with layout strategies:
  - \`GridLayout\`: For grid-based arrangements
  - \`ColumnsLayout\`: For column-based layouts
  - \`SpreadLayout\`: For distributing elements evenly
- Benefits: Automatic spacing, alignment, responsive behavior

**Option C: Hybrid Approach**
- Use layouts for groups/sections
- Manual positioning for fine-tuning or special cases

### 4. Consider Element Hierarchy

Think about parent-child relationships:
- What elements should be positioned in Layouts?
- What should be in containers vs. standalone?
- How does hierarchy affect positioning and z-index?

### 5. Plan for Text and LaTeX

If using text or mathematical notation:
- Where does text/LaTeX appear?
- How should it be positioned (relative to shapes, centered, etc.)?
- What styling (size, color, weight)?

For LaTeX:
- Use Text element with LaTeX string
- Plan positioning carefully (LaTeX rendering creates fixed-size elements)
- Consider using containers to group LaTeX with related shapes

## Expected Output Format

Write a development plan like:

**Implementation Steps**:

1. **[Step Name]** (e.g., "Set up artboard and main container")
   - Components: [List w2l classes you'll use]
   - Approach: [Brief description of how]
   - Key decisions: [Any important choices]

2. **[Step Name]** (e.g., "Create input layer nodes")
   - Components: [Components]
   - Approach: [Approach]
   - Key decisions: [Decisions]

...

**Layout Strategy**: [Overall approach - manual, layout systems, or hybrid]

**Component Hierarchy**: 
\`\`\`
Artboard
  ├─ Container (main)
  │   ├─ Container (section A)
  │   │   ├─ Rectangle
  │   │   ├─ Text
  │   ├─ Container (section B)
  │       ├─ Circle
  │       ├─ Text
  ├─ Arrow (connecting sections)
\`\`\`

**Critical w2l API Notes**:
- [Any specific API details to remember from documentation]
- [Edge cases or gotchas to watch for]

## Example

**Implementation Steps**:

1. **Create artboard and title**
   - Components: Artboard, Text
   - Approach: Create 800x600 artboard, add centered title at top
   - Key decisions: Title at y=40, font size 28

2. **Create three column containers for layers**
   - Components: Container, ColumnsLayout
   - Approach: Main container with ColumnsLayout, 3 columns, gap=120
   - Key decisions: Using layout system for automatic column positioning

3. **Populate each column with nodes**
   - Components: Circle, Text, SpreadLayout
   - Approach: Each column is a container with SpreadLayout, circles + labels
   - Key decisions: Input=3 nodes, Hidden=5 nodes, Output=2 nodes

4. **Add connections between layers**
   - Components: Arrow or Line
   - Approach: Nested loops to create all input→hidden and hidden→output connections
   - Key decisions: Use Line with arrow heads, light gray color

5. **Add layer labels below columns**
   - Components: Text
   - Approach: Position below each column, center-aligned
   - Key decisions: Smaller font (14pt), gray color

**Layout Strategy**: Hybrid - use ColumnsLayout for main structure, SpreadLayout within columns, manual positioning for fine-tuning connections

**Component Hierarchy**: 
\`\`\`
Artboard
  ├─ Text (title)
  ├─ Container (columnsLayout)
  │   ├─ Container (input, spreadLayout)
  │   │   ├─ Circle (node 1)
  │   │   ├─ Circle (node 2)
  │   │   ├─ Circle (node 3)
  │   ├─ Container (hidden, spreadLayout)
  │   │   ├─ ...
  │   ├─ Container (output, spreadLayout)
  │       ├─ ...
  ├─ Lines (connections, added after layout)
  ├─ Text (layer labels)
\`\`\`

**Critical w2l API Notes**:
- Container requires a \`size\` property: \`new Container({ size: { width, height } })\`
- When adding elements to containers, they're positioned relative to container
- For auto-layout, use GridLayout, ColumnsLayout, or SpreadLayout instead of plain Container
- Layout elements automatically arrange children when added
`;
