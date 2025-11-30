# Text and LaTeX Guide

## Overview

This guide covers the Text element for displaying text and mathematical notation. The Text class supports plain text, embedded LaTeX formulas, and mixed content with both text and math. It provides powerful annotation capabilities for highlighting and referencing specific parts of formulas.

## When to Use This Guide

- Adding labels to diagrams
- Displaying mathematical formulas
- Creating annotations and descriptions
- Mixing text with mathematical notation
- Highlighting specific parts of equations
- Positioning text relative to other elements

## Creating Text

### Plain Text

```javascript
const text = new Text({
  content: "Hello, World!",
  fontSize: 16,
  fontFamily: "Arial",
  style: { fill: "black" }
});

artboard.add(text);
```

### Basic Configuration

```javascript
const text = new Text({
  content: "Sample text",
  fontSize: 18,           // Font size in pixels or with units ("18px", "1.2rem")
  fontFamily: "serif",    // CSS font-family
  fontWeight: "bold",     // CSS font-weight ("normal", "bold", 400-900)
  lineHeight: 1.4,        // Line height multiplier
  style: {
    fill: "navy",         // Text color
    opacity: 1            // Transparency
  }
});
```

## LaTeX Formulas

### Inline LaTeX

Use single dollar signs `$...$` for inline mathematical notation.

```javascript
const text = new Text({
  content: "The famous equation $E = mc^2$ was discovered by Einstein.",
  fontSize: 16
});

artboard.add(text);
```

### Display Mode LaTeX

Use double dollar signs `$$...$$` for display-style (larger, centered) formulas.

```javascript
const text = new Text({
  content: "The quadratic formula is $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$",
  fontSize: 16
});

artboard.add(text);
```

### Multiple Formulas

Mix text and multiple formulas in a single Text element.

```javascript
const text = new Text({
  content: "Consider $f(x) = x^2$ and $g(x) = 2x$. Their sum is $h(x) = x^2 + 2x$.",
  fontSize: 16
});

artboard.add(text);
```

## Common LaTeX Symbols and Commands

### Greek Letters

```javascript
const text = new Text({
  content: "$\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\theta, \\pi, \\sigma, \\omega$",
  fontSize: 18
});
```

### Fractions

```javascript
const fraction = new Text({
  content: "$\\frac{a}{b}$ or $\\frac{numerator}{denominator}$",
  fontSize: 16
});
```

### Exponents and Subscripts

```javascript
const powers = new Text({
  content: "$x^2, x^{10}, x_1, x_{i,j}, x_i^2$",
  fontSize: 16
});
```

### Square Roots

```javascript
const roots = new Text({
  content: "$\\sqrt{2}, \\sqrt{x^2 + y^2}, \\sqrt[3]{8}$",
  fontSize: 16
});
```

### Sums and Integrals

```javascript
const calculus = new Text({
  content: "$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$",
  fontSize: 16
});

const integral = new Text({
  content: "$\\int_{0}^{1} x^2 dx = \\frac{1}{3}$",
  fontSize: 16
});
```

### Matrices

```javascript
const matrix = new Text({
  content: "$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$",
  fontSize: 16
});
```

### Common Math Functions

```javascript
const functions = new Text({
  content: "$\\sin(x), \\cos(x), \\tan(x), \\log(x), \\ln(x), \\exp(x)$",
  fontSize: 16
});
```

### Relations and Operations

```javascript
const operations = new Text({
  content: "$\\leq, \\geq, \\neq, \\approx, \\equiv, \\pm, \\times, \\div, \\cdot$",
  fontSize: 16
});
```

### Sets

```javascript
const sets = new Text({
  content: "$\\mathbb{R}, \\mathbb{C}, \\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}$",
  fontSize: 16
});
```

### Special Symbols

```javascript
const symbols = new Text({
  content: "$\\infty, \\partial, \\nabla, \\angle, \\perp, \\parallel, \\therefore$",
  fontSize: 16
});
```

## Positioning Text

### Absolute Positioning

```javascript
const text = new Text({
  content: "Positioned text",
  fontSize: 16
});

text.position({
  relativeFrom: text.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50
});

artboard.add(text);
```

### Relative to Element

```javascript
const circle = new Circle({ radius: 50 });
artboard.add(circle);

const label = new Text({
  content: "Circle",
  fontSize: 14
});

// Position below the circle
label.position({
  relativeFrom: label.topCenter,
  relativeTo: circle.center,
  x: 0,
  y: 60
});

artboard.add(label);
```

### Anchor Points

Text supports all standard anchor points:
- `topLeft`, `topCenter`, `topRight`
- `centerLeft`, `center`, `centerRight`
- `bottomLeft`, `bottomCenter`, `bottomRight`

```javascript
const text = new Text({ content: "Centered", fontSize: 16 });

// Center the text on the artboard
text.position({
  relativeFrom: text.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});
```

## Annotating LaTeX Formulas

### Using \cssId{id}{content}

Mark specific parts of a formula with unique IDs for highlighting or referencing.

```javascript
const formula = new Text({
  content: "$\\cssId{coeff}{2}x^{\\cssId{exp}{2}} + \\cssId{const}{5}$",
  fontSize: 20
});

artboard.add(formula);

// Get the annotated element
const coefficient = formula.getElementById("coeff");

if (coefficient) {
  // Highlight by drawing a rectangle behind it
  const highlight = new Rect({
    width: coefficient.bbox.width + 4,
    height: coefficient.bbox.height + 4,
    style: { fill: "yellow", opacity: 0.5 }
  });
  
  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: coefficient.center,
    x: 0,
    y: 0
  });
  
  artboard.add(highlight);
}
```

### Using \class{classname}{content}

Group multiple parts with the same class for batch operations.

```javascript
const formula = new Text({
  content: "$\\class{variable}{x} + \\class{variable}{y} = \\class{constant}{10}$",
  fontSize: 18
});

artboard.add(formula);

// Get all elements with class "variable"
const variables = formula.getElementsByClassName("variable");

variables.forEach(element => {
  // Draw circles around variables
  const circle = new Circle({
    radius: element.bbox.width / 2 + 5,
    style: { fill: "none", stroke: "blue", strokeWidth: 2 }
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: element.center,
    x: 0,
    y: 0
  });
  
  artboard.add(circle);
});
```

### Annotated Element Properties

Annotated elements provide convenient anchor points:

```javascript
const element = formula.getElementById("myId");

if (element) {
  console.log(element.center);       // Center point
  console.log(element.topLeft);      // Top-left corner
  console.log(element.topCenter);    // Top-center
  console.log(element.topRight);     // Top-right corner
  console.log(element.leftCenter);   // Left-center
  console.log(element.rightCenter);  // Right-center
  console.log(element.bottomLeft);   // Bottom-left corner
  console.log(element.bottomCenter); // Bottom-center
  console.log(element.bottomRight);  // Bottom-right corner
  
  // Convenient aliases
  console.log(element.top);          // Same as topCenter
  console.log(element.bottom);       // Same as bottomCenter
  console.log(element.left);         // Same as leftCenter
  console.log(element.right);        // Same as rightCenter
  
  // Bounding box
  console.log(element.bbox);         // { x, y, width, height }
}
```

## Complete Examples

### Labeled Equation with Annotations

```javascript
// Create equation with annotated parts
const equation = new Text({
  content: "$\\cssId{a}{a}x^2 + \\cssId{b}{b}x + \\cssId{c}{c} = 0$",
  fontSize: 24
});

artboard.add(equation);

// Highlight coefficient 'a'
const aCoeff = equation.getElementById("a");
if (aCoeff) {
  const highlight = new Rect({
    width: aCoeff.bbox.width + 6,
    height: aCoeff.bbox.height + 6,
    style: { fill: "yellow", opacity: 0.4 }
  });
  
  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: aCoeff.center,
    x: 0,
    y: 0
  });
  
  artboard.add(highlight);
  
  // Add label below
  const label = new Text({
    content: "quadratic coefficient",
    fontSize: 12,
    style: { fill: "gray" }
  });
  
  label.position({
    relativeFrom: label.topCenter,
    relativeTo: aCoeff.bottomCenter,
    x: 0,
    y: 5
  });
  
  artboard.add(label);
}
```

### Theorem with Mixed Text and Math

```javascript
const theorem = new Text({
  content: "Pythagorean Theorem: For a right triangle with legs $a$ and $b$ and hypotenuse $c$, we have $a^2 + b^2 = c^2$.",
  fontSize: 16,
  fontFamily: "Georgia, serif"
});

theorem.position({
  relativeFrom: theorem.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 40,
  y: 40
});

artboard.add(theorem);
```

### Displayed Equation

```javascript
const displayEquation = new Text({
  content: "$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$",
  fontSize: 20
});

displayEquation.position({
  relativeFrom: displayEquation.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});

artboard.add(displayEquation);
```

### Diagram Labels

```javascript
// Create a triangle
const triangle = new Triangle({
  type: "right",
  a: 100,
  b: 80,
  style: { fill: "lightblue", stroke: "navy", strokeWidth: 2 }
});

artboard.add(triangle);

const sides = triangle.getSides();

// Label sides with LaTeX
const sideA = new Text({ content: "$a$", fontSize: 14 });
sideA.position({
  relativeFrom: sideA.center,
  relativeTo: sides[0].center,
  x: 0,
  y: 15
});
artboard.add(sideA);

const sideB = new Text({ content: "$b$", fontSize: 14 });
sideB.position({
  relativeFrom: sideB.center,
  relativeTo: sides[1].center,
  x: 20,
  y: 0
});
artboard.add(sideB);

const sideC = new Text({ content: "$c$", fontSize: 14 });
sideC.position({
  relativeFrom: sideC.center,
  relativeTo: sides[2].center,
  x: -15,
  y: -10
});
artboard.add(sideC);

// Add formula below
const formula = new Text({
  content: "$a^2 + b^2 = c^2$",
  fontSize: 18
});

formula.position({
  relativeFrom: formula.topCenter,
  relativeTo: triangle.center,
  x: 0,
  y: 80
});

artboard.add(formula);
```

### Highlighting Parts of a Formula

```javascript
// Complex equation with multiple highlighted parts
const equation = new Text({
  content: "$f(x) = \\cssId{leading}{2}x^{\\cssId{degree}{3}} - \\cssId{linear}{5}x + \\cssId{constant}{7}$",
  fontSize: 22
});

artboard.add(equation);

// Different colors for different parts
const colors = {
  leading: "rgba(255, 100, 100, 0.3)",
  degree: "rgba(100, 255, 100, 0.3)",
  linear: "rgba(100, 100, 255, 0.3)",
  constant: "rgba(255, 255, 100, 0.3)"
};

Object.keys(colors).forEach(id => {
  const element = equation.getElementById(id);
  if (element) {
    const highlight = new Rect({
      width: element.bbox.width + 4,
      height: element.bbox.height + 4,
      style: { fill: colors[id] }
    });
    
    highlight.position({
      relativeFrom: highlight.center,
      relativeTo: element.center,
      x: 0,
      y: 0
    });
    
    artboard.add(highlight);
  }
});
```

## Best Practices

1. **Use LaTeX for math** - Wrap mathematical notation in `$...$` for proper formatting
2. **Escape backslashes** - Use `\\` in JavaScript strings for LaTeX commands
3. **Choose appropriate font size** - Match text size to diagram scale
4. **Position from appropriate anchor** - Use topCenter for labels above, bottomCenter for labels below
5. **Annotate for highlighting** - Use `\cssId{}{}` to mark important parts
6. **Use display mode for large formulas** - Use `$$...$$` for standalone equations
7. **Consistent styling** - Use similar font sizes and colors for related labels
8. **Test LaTeX syntax** - Verify LaTeX commands render correctly

## Common LaTeX Patterns

### Equation with Condition

```javascript
const text = new Text({
  content: "$f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x^2 & \\text{if } x < 0 \\end{cases}$",
  fontSize: 18
});
```

### Aligned Equations

```javascript
const text = new Text({
  content: "$\\begin{aligned} x + y &= 5 \\\\ 2x - y &= 1 \\end{aligned}$",
  fontSize: 16
});
```

### Vector Notation

```javascript
const text = new Text({
  content: "$\\vec{v} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$",
  fontSize: 16
});
```

### Limits

```javascript
const text = new Text({
  content: "$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$",
  fontSize: 16
});
```

## Troubleshooting

**LaTeX not rendering?**
- Check backslashes are escaped (`\\` not `\`)
- Verify LaTeX syntax is correct
- Ensure dollar signs are balanced

**Text overlapping elements?**
- Adjust positioning offsets
- Check anchor points are appropriate
- Verify z-order (render order)

**Annotations not found?**
- Ensure `\cssId{}{}` syntax is correct
- Check ID is unique
- Verify formula has rendered before accessing

**Text too small/large?**
- Adjust fontSize property
- Use relative units if needed
- Match scale to diagram size

**Wrong positioning?**
- Use correct anchor point (relativeFrom)
- Check target position (relativeTo)
- Verify offsets (x, y)

