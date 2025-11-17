/**
 * Example 29: Pattern-Based Highlighting
 *
 * Demonstrates:
 * - Finding patterns in text, LaTeX, and mixed content using regex
 * - Highlighting matched elements dynamically
 * - Querying specific LaTeX notation (powers, fractions, etc.)
 * - Combining pattern matching with positioning
 */

import { Artboard, MixedText, Text, Rectangle, LatexText } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 900, height: 900 },
  backgroundColor: "#f8f9fa",
});

// Title
const title = new Text({
  content: "Pattern-Based Highlighting Examples",
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

// Example 1: Find powers in LaTeX within mixed text
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

// Find and highlight "^2" in LaTeX
const powersInSentence1 = sentence1.findMatches(/\^2/, { type: 'latex' });
console.log("Found powers in sentence 1:", powersInSentence1);

powersInSentence1.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight1-${index}`,
    style: {
      fill: "#fff3cd",
      stroke: "none",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence1.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Example 2: Highlight specific words in text
const sentence2 = new MixedText({
  content: "The Pythagorean theorem $a^2 + b^2 = c^2$ is fundamental.",
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

// Highlight the word "theorem" in the text part
const wordsInSentence2 = sentence2.findMatches(/theorem/, { type: 'text' });
console.log("Found 'theorem' in sentence 2:", wordsInSentence2);

wordsInSentence2.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight2-word-${index}`,
    style: {
      fill: "#d4edda",
      stroke: "none",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence2.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Highlight all powers in the LaTeX part
const powersInSentence2 = sentence2.findMatches(/\^2/, { type: 'latex' });
console.log("Found powers in sentence 2:", powersInSentence2);

powersInSentence2.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight2-power-${index}`,
    style: {
      fill: "#f8d7da",
      stroke: "none",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence2.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Example 3: Highlight multiple words with OR pattern
const sentence3 = new Text({
  content: "The quick brown fox jumps over the lazy dog.",
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
sentence3.zIndex = 10;

// Find "fox" or "dog"
const animals = sentence3.findMatches(/fox|dog/);
console.log("Found animals:", animals);

animals.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight3-${index}`,
    style: {
      fill: "#cce5ff",
      stroke: "none",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence3.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Example 4: Find fractions in pure LaTeX
const formula = new LatexText({
  content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  fontSize: "24px",
  displayMode: "display",
  name: "formula",
  style: {},
});

formula.position({
  relativeFrom: formula.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "440px",
});

artboard.addElement(formula);
formula.zIndex = 10;

// Find all fractions
const fractions = formula.findMatches(/\\frac/);
console.log("Found fractions:", fractions);

fractions.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight4-${index}`,
    style: {
      fill: "#e2e3e5",
      stroke: "#6c757d",
      strokeWidth: "2px",
      opacity: 0.3,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: formula.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Example 5: Case-insensitive search
const sentence5 = new MixedText({
  content: "Calculus: $\\frac{d}{dx}(x^n) = nx^{n-1}$ and $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$.",
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
  y: "580px",
});

artboard.addElement(sentence5);
sentence5.zIndex = 10;

// Find all derivatives and integrals (case insensitive)
const calculus = sentence5.findMatches(/(Calculus|dx)/i);
console.log("Found calculus terms:", calculus);

calculus.forEach((match, index) => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    name: `highlight5-${index}`,
    style: {
      fill: "#d1ecf1",
      stroke: "none",
      opacity: 0.5,
    },
  });

  highlight.zIndex = 5;

  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: sentence5.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`,
  });

  artboard.addElement(highlight);
});

// Add legend
const legend = new Text({
  content: "Pattern Matching Features:\n• Yellow: Powers (^2) in LaTeX\n• Green: Specific words in text\n• Pink: Powers in mixed content\n• Blue: Multiple word patterns\n• Gray: LaTeX commands (\\frac)\n• Light blue: Case-insensitive search",
  fontSize: "13px",
  fontFamily: "sans-serif",
  lineHeight: 1.7,
  style: {
    fill: "#666",
  },
});

legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "700px",
});

artboard.addElement(legend);

// Display the result
artboard.render();

