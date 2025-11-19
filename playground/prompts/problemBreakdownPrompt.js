export const PROBLEM_BREAKDOWN_PROMPT = `
# Problem Breakdown Phase

In this phase, develop a rough conceptual idea of what should be shown on screen WITHOUT any implementation details.

## Guidelines

1. **Understand the User's Intent**
   - What is the core visual message or diagram they want to create?
   - What are the key elements that must be present?
   - What relationships or connections exist between elements?

2. **Identify Visual Hierarchy**
   - What are the main sections or groupings?
   - What should be emphasized or de-emphasized?
   - What is the natural reading/viewing order?

3. **Think About Layout Structure**
   - Is this a single focal point or multiple sections?
   - Does it need rows, columns, or a grid structure?
   - How should elements be spatially organized?

4. **Consider Content Types**
   - Text labels, headings, or annotations?
   - Shapes (geometric primitives)?
   - Mathematical notation or formulas?
   - Arrows or connectors showing relationships?
   - Images or complex visual elements?

## Expected Output Format

Write a brief, structured breakdown like:

**Goal**: [One sentence describing what we're creating]

**Main Sections**:
1. [Section name]: [What it contains and its purpose]
2. [Section name]: [What it contains and its purpose]
...

**Key Elements**:
- [Element type]: [Purpose and rough content]
- [Element type]: [Purpose and rough content]
...

**Relationships**:
- [How elements connect or relate to each other]

**Layout Approach**:
- [High-level spatial organization - e.g., "3-column layout", "centered with surrounding elements", "hierarchical tree"]

## Example

**Goal**: Create a visual representation of a neural network layer

**Main Sections**:
1. Input Layer: Shows 3 input nodes on the left
2. Hidden Layer: Shows 5 nodes in the center
3. Output Layer: Shows 2 output nodes on the right
4. Labels: Title at top, layer names below each column

**Key Elements**:
- Circles: Representing neurons/nodes in each layer
- Arrows: Showing connections from input → hidden → output
- Text: Title "Neural Network Architecture" and layer labels
- Color coding: Input nodes (blue), hidden (green), output (orange)

**Relationships**:
- All input nodes connect to all hidden nodes
- All hidden nodes connect to all output nodes
- Connections flow left to right

**Layout Approach**:
- 3-column grid layout for the three layers
- Vertical spread layout within each column for nodes
- Title centered at top
- Labels centered below each column
`;

