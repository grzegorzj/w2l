/**
 * Smart Flowchart with Collision-Free Routing
 * 
 * This example demonstrates:
 * - Automatic collision-free connector routing using A* pathfinding
 * - Proper label spacing that doesn't overlap with nodes
 * - Complex layout with feedback loops
 * - Minimum spacing between elements
 */

import { 
  Artboard, 
  Flowchart,
  SwissTheme 
} from "w2l";

const artboard = new Artboard({
  width: 900,
  height: 700,
  theme: SwissTheme,
});

// Create flowchart with automatic routing
const flowchart = new Flowchart({
  nodes: [
    {
      id: 'start',
      text: 'Start Deploy',
      position: { x: 450, y: 60 },
      width: 140,
      height: 60,
      tint: 'accent'
    },
    {
      id: 'build',
      text: 'Build Application',
      position: { x: 450, y: 150 },
      width: 160,
      height: 60
    },
    {
      id: 'test',
      text: 'Run Tests',
      position: { x: 450, y: 240 },
      width: 140,
      height: 60
    },
    {
      id: 'test-check',
      text: 'Tests Passed?',
      position: { x: 450, y: 330 },
      width: 160,
      height: 60,
      tint: 'muted'
    },
    {
      id: 'fix-bugs',
      text: 'Fix Bugs',
      position: { x: 250, y: 330 },
      width: 140,
      height: 60,
      tint: '#FFE6E6'
    },
    {
      id: 'deploy-staging',
      text: 'Deploy to Staging',
      position: { x: 450, y: 420 },
      width: 180,
      height: 60
    },
    {
      id: 'review',
      text: 'Manual Review',
      position: { x: 450, y: 510 },
      width: 160,
      height: 60,
      tint: 'muted'
    },
    {
      id: 'production',
      text: 'Deploy to Production',
      position: { x: 650, y: 510 },
      width: 180,
      height: 60,
      tint: 'accent'
    },
    {
      id: 'rollback',
      text: 'Rollback',
      position: { x: 250, y: 510 },
      width: 140,
      height: 60,
      tint: '#FFE6E6'
    },
    {
      id: 'complete',
      text: 'Complete',
      position: { x: 650, y: 600 },
      width: 140,
      height: 60,
      tint: 'accent'
    }
  ],
  connections: [
    { from: 'start', to: 'build' },
    { from: 'build', to: 'test' },
    { from: 'test', to: 'test-check' },
    { from: 'test-check', to: 'fix-bugs', label: 'No', fromAnchor: 'left', toAnchor: 'right' },
    { from: 'fix-bugs', to: 'build', label: 'Retry' },  // This will route around obstacles
    { from: 'test-check', to: 'deploy-staging', label: 'Yes' },
    { from: 'deploy-staging', to: 'review' },
    { from: 'review', to: 'production', label: 'Approve', fromAnchor: 'right', toAnchor: 'left' },
    { from: 'review', to: 'rollback', label: 'Reject', fromAnchor: 'left', toAnchor: 'right' },
    { from: 'rollback', to: 'build' },  // This will route around obstacles
    { from: 'production', to: 'complete' }
  ],
  theme: SwissTheme,
  minSpacing: 35,
  nodePadding: 25,
  gridSize: 10
});

artboard.addElement(flowchart);

return artboard.render();

