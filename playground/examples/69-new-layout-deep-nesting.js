/**
 * Example: New Layout System - Deep Nesting
 * 
 * Demonstrates deeply nested VStacks (3 levels).
 * Shows that relative positioning works correctly
 * through multiple levels of hierarchy.
 */

import { NewArtboard, NewVStack, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#2c3e50'
});

// Level 1: Outermost VStack
const level1 = new NewVStack({
  width: 700,
  height: 550,
  spacing: 20,
  boxModel: { padding: 30 },
  style: {
    fill: '#34495e',
    stroke: '#1abc9c',
    strokeWidth: 3
  }
});

level1.position({
  relativeFrom: level1.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Level 2: Middle VStack (nested in level1)
const level2 = new NewVStack({
  width: 640,
  height: 220,
  spacing: 15,
  boxModel: { padding: 25 },
  style: {
    fill: '#16a085',
    stroke: '#1abc9c',
    strokeWidth: 2
  }
});

// Level 3: Innermost VStack (nested in level2)
const level3 = new NewVStack({
  width: 590,
  height: 120,
  spacing: 10,
  boxModel: { padding: 15 },
  style: {
    fill: '#1abc9c',
    stroke: '#16a085',
    strokeWidth: 2
  }
});

// Innermost items (level 4 - leaf nodes)
const innerItem1 = new NewRect({
  width: 560,
  height: 30,
  style: {
    fill: '#f1c40f',
    stroke: '#f39c12',
    strokeWidth: 2
  }
});

const innerItem2 = new NewRect({
  width: 560,
  height: 30,
  style: {
    fill: '#f1c40f',
    stroke: '#f39c12',
    strokeWidth: 2
  }
});

// Add to level 3
level3.addElement(innerItem1);
level3.addElement(innerItem2);

// Another item at level 2
const level2Item = new NewRect({
  width: 590,
  height: 40,
  style: {
    fill: '#3498db',
    stroke: '#2980b9',
    strokeWidth: 2
  }
});

// Add to level 2
level2.addElement(level3);
level2.addElement(level2Item);

// Items at level 1
const level1Item1 = new NewRect({
  width: 640,
  height: 50,
  style: {
    fill: '#9b59b6',
    stroke: '#8e44ad',
    strokeWidth: 2
  }
});

const level1Item2 = new NewRect({
  width: 640,
  height: 50,
  style: {
    fill: '#e74c3c',
    stroke: '#c0392b',
    strokeWidth: 2
  }
});

// Add to level 1
level1.addElement(level2);
level1.addElement(level1Item1);
level1.addElement(level1Item2);

// Add to artboard
artboard.addElement(level1);

return artboard.render();

