# Example 32: Quadratic Intersection Challenge (9th Grade)

## Overview

This example demonstrates a challenging 9th-grade math problem with a comprehensive visual explainer. It showcases the use of containers with vertical and horizontal layouts to organize explanations alongside interactive visualizations.

## The Problem

Students are asked to find the intersection points of two functions and estimate the enclosed area:
- **f(x) = -x² + 4** (a downward-opening parabola)
- **g(x) = x - 2** (a linear function)

### Tasks:
1. Find the x-coordinates where these functions intersect
2. Determine the y-coordinates at these intersection points  
3. Estimate the area of the region bounded by these two curves

## Why This is Hard for 9th Graders

This problem is appropriately challenging because it requires:
- **Algebraic manipulation**: Setting functions equal and rearranging
- **Solving quadratic equations**: Using factoring or the quadratic formula
- **Understanding function intersections**: Conceptualizing where graphs meet
- **Coordinate substitution**: Finding corresponding y-values
- **Geometric visualization**: Understanding bounded regions
- **Area estimation**: Using geometric approximations (trapezoidal method)
- **Working with negatives**: Dealing with negative coefficients

## Technical Implementation

### Layout Structure

The example uses a **horizontal container** to split the artboard into two main sections:

#### Left Side: Visual Graph
- **Container with vertical layout** holding:
  - Problem statement (Text)
  - Function definitions (Latex)
  - Interactive function graph (FunctionGraph)
  - Graph label (Text)

#### Right Side: Step-by-Step Solution
- **Container with vertical layout** containing 4 step containers:
  - Each step uses a colored container with:
    - Step title
    - Explanatory text
    - LaTeX equations
    - Sub-containers for parallel calculations (Step 3)

### Key Features Demonstrated

1. **Nested Container Layouts**
   - Main horizontal container splits content into graph and solution
   - Vertical containers organize step-by-step explanations
   - Nested horizontal container in Step 3 for side-by-side calculations

2. **FunctionGraph Component**
   - Plots multiple functions with different colors
   - Shows grid and axes
   - Configurable domain and range

3. **Visual Markers**
   - Uses freeform container to overlay intersection points
   - Circle markers with labels
   - Semi-transparent rectangle highlighting bounded region
   - Coordinate transformation from math space to graph space

4. **LaTeX Rendering**
   - Display mode for equations
   - Inline LaTeX in explanatory text
   - Mathematical notation for clarity

5. **Color-Coded Steps**
   - Each step has a distinct background color
   - Helps visual organization and readability
   - Creates a structured learning experience

## How to Use in Playground

1. Start the playground: `npm run playground` from project root
2. Click "Load File" button
3. Navigate to: `playground/examples/tests/32-quadratic-intersection-area.js`
4. Click "Run Code" or press Cmd/Ctrl+Enter

## Expected Output

A 1400×900 pixel artboard showing:
- **Left**: Function graph with highlighted intersection points and bounded region
- **Right**: Complete step-by-step solution with:
  - Step 1: Setting up the equation
  - Step 2: Solving the quadratic (factoring)
  - Step 3: Finding y-coordinates (with parallel layout)
  - Step 4: Estimating the area

## Educational Value

This type of problem bridges:
- **Algebra II concepts**: Quadratic equations, factoring
- **Geometry**: Coordinate plane, area estimation
- **Pre-Calculus**: Function intersections, bounded regions
- **Critical thinking**: Multiple solution methods, estimation techniques

## APIs Used

From `/lib`:
- `Artboard` - Main canvas
- `Container` - Layout organization (horizontal, vertical)
- `FunctionGraph` - Function plotting
- `Text` - Plain text labels and explanations
- `Latex` - Mathematical notation
- `Circle` - Intersection point markers
- `Rect` - Highlight region
- Positioning system with relative positioning

