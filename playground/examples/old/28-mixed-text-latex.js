/**
 * Example 28: Mixed Text with Embedded LaTeX
 *
 * Demonstrates:
 * - Embedding LaTeX formulas within regular text using $ and $$
 * - Measuring and positioning based on text or formula segments
 * - Highlighting specific segments
 */

import { Artboard, MixedText, Text, Rectangle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 900, height: 800 },
  backgroundColor: "#f8f9fa",
});

// Title
const title = new Text({
  content: "Mixed Text with LaTeX Formulas",
  fontSize: "32px",
  fontFamily: "Arial",
  fontWeight: "bold",
  name: "title",
  style: {
    fill: "#2c3e50",
  },
});

title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: "0px",
  y: "30px",
});

artboard.addElement(title);

// Example 1: Inline formula in sentence
const sentence1 = new MixedText({
  content: "Einstein's famous equation $E = mc^2$ relates energy and mass.",
  fontSize: "20px",
  fontFamily: "Georgia",
  name: "sentence1",
  style: {
    fill: "#2c3e50",
  },
});

sentence1.position({
  relativeFrom: sentence1.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "120px",
});

artboard.addElement(sentence1);
sentence1.zIndex = 10;

// Highlight the LaTeX segment
const segments1 = sentence1.getSegments();
console.log("Sentence 1 segments:", segments1);

segments1.forEach((segment) => {
  if (segment.type === "latex") {
    const bbox = sentence1.getSegmentBoundingBox(segment.index);
    if (bbox) {
      const highlight = new Rectangle({
        width: bbox.width + 8,
        height: bbox.height + 4,
        name: "highlight1",
        style: {
          fill: "#fff3cd",
          stroke: "none",
          opacity: 0.5,
        },
      });

      highlight.zIndex = 5;

      // Position relative to the text element's position
      highlight.position({
        relativeFrom: highlight.topLeft,
        relativeTo: sentence1.topLeft,
        x: `${bbox.x - 4}px`,
        y: `${bbox.y - 2}px`,
      });

      artboard.addElement(highlight);
    }
  }
});

// Example 2: Multiple inline formulas
const sentence2 = new MixedText({
  content: "The Pythagorean theorem $a^2 + b^2 = c^2$ is fundamental, as is Euler's $e^{i\\pi} + 1 = 0$.",
  fontSize: "18px",
  fontFamily: "Georgia",
  name: "sentence2",
  style: {
    fill: "#2c3e50",
  },
});

sentence2.position({
  relativeFrom: sentence2.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "220px",
});

artboard.addElement(sentence2);
sentence2.zIndex = 10;

// Highlight LaTeX segments with different colors
const segments2 = sentence2.getSegments();
console.log("Sentence 2 segments:", segments2);

const colors = ["#d1ecf1", "#f8d7da"];
let colorIndex = 0;

segments2.forEach((segment) => {
  if (segment.type === "latex") {
    const bbox = sentence2.getSegmentBoundingBox(segment.index);
    if (bbox) {
      const highlight = new Rectangle({
        width: bbox.width + 8,
        height: bbox.height + 4,
        name: `highlight2-${segment.index}`,
        style: {
          fill: colors[colorIndex % colors.length],
          stroke: "none",
          opacity: 0.5,
        },
      });

      highlight.zIndex = 5;

      // Position relative to the text element's position
      highlight.position({
        relativeFrom: highlight.topLeft,
        relativeTo: sentence2.topLeft,
        x: `${bbox.x - 4}px`,
        y: `${bbox.y - 2}px`,
      });

      artboard.addElement(highlight);
      colorIndex++;
    }
  }
});

// Example 3: Display mode formula in text
const sentence3 = new MixedText({
  content: "The quadratic formula: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$ solves any quadratic.",
  fontSize: "18px",
  fontFamily: "Georgia",
  name: "sentence3",
  style: {
    fill: "#2c3e50",
  },
});

sentence3.position({
  relativeFrom: sentence3.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "340px",
});

artboard.addElement(sentence3);

// Example 4: Complex mixed content
const sentence4 = new MixedText({
  content: "In calculus, we learn that $\\frac{d}{dx}(x^n) = nx^{n-1}$ and $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$.",
  fontSize: "18px",
  fontFamily: "Georgia",
  name: "sentence4",
  style: {
    fill: "#2c3e50",
  },
});

sentence4.position({
  relativeFrom: sentence4.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "460px",
});

artboard.addElement(sentence4);

// Example 5: Natural language with mathematical notation
const sentence5 = new MixedText({
  content: "The limit definition of derivative is $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}$.",
  fontSize: "18px",
  fontFamily: "Georgia",
  name: "sentence5",
  style: {
    fill: "#2c3e50",
  },
});

sentence5.position({
  relativeFrom: sentence5.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "560px",
});

artboard.addElement(sentence5);

// Add legend
const legend = new Text({
  content: "Legend:\n• Yellow highlight: inline formula\n• Blue/Pink highlights: multiple formulas\n• Use $...$ for inline, $$...$$ for display mode",
  fontSize: "14px",
  fontFamily: "sans-serif",
  lineHeight: 1.6,
  style: {
    fill: "#666",
  },
});

legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.bottomLeft,
  x: "50px",
  y: "-120px",
});

artboard.addElement(legend);

// Display the result
artboard.render();

