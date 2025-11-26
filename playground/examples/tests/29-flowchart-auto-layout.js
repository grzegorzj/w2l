/**
 * Flowchart with Automatic Layout
 * 
 * This example demonstrates:
 * - Automatic node positioning without manual x, y coordinates
 * - Hierarchical layout with proper spacing
 * - Configurable margins and spacing
 * - Collision-free routing with auto-positioned nodes
 */

import { 
  Artboard, 
  Flowchart,
  SwissTheme 
} from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 700,
  theme: SwissTheme,
});

// Create flowchart WITHOUT explicit positions - they will be calculated automatically!
const flowchart = new Flowchart({
  nodes: [
    {
      id: 'start',
      text: 'User Request',
      width: 140,
      height: 60,
      tint: 'accent'
    },
    {
      id: 'authenticate',
      text: 'Authenticate',
      width: 140,
      height: 60
    },
    {
      id: 'auth-check',
      text: 'Valid Token?',
      width: 140,
      height: 60,
      tint: 'muted'
    },
    {
      id: 'auth-error',
      text: 'Return 401',
      width: 120,
      height: 60,
      tint: '#FFE6E6'
    },
    {
      id: 'validate',
      text: 'Validate Input',
      width: 140,
      height: 60
    },
    {
      id: 'validation-check',
      text: 'Input Valid?',
      width: 140,
      height: 60,
      tint: 'muted'
    },
    {
      id: 'validation-error',
      text: 'Return 400',
      width: 120,
      height: 60,
      tint: '#FFE6E6'
    },
    {
      id: 'process',
      text: 'Process Request',
      width: 160,
      height: 60
    },
    {
      id: 'save',
      text: 'Save to Database',
      width: 160,
      height: 60
    },
    {
      id: 'success',
      text: 'Return 200',
      width: 140,
      height: 60,
      tint: 'accent'
    }
  ],
  connections: [
    { from: 'start', to: 'authenticate' },
    { from: 'authenticate', to: 'auth-check' },
    { from: 'auth-check', to: 'auth-error', label: 'No' },
    { from: 'auth-check', to: 'validate', label: 'Yes' },
    { from: 'validate', to: 'validation-check' },
    { from: 'validation-check', to: 'validation-error', label: 'No' },
    { from: 'validation-check', to: 'process', label: 'Yes' },
    { from: 'process', to: 'save' },
    { from: 'save', to: 'success' }
  ],
  theme: SwissTheme,
  
  // Layout configuration
  layoutDirection: 'vertical',  // Top-to-bottom flow
  nodeSpacing: 80,              // Horizontal spacing between nodes on same level
  levelSpacing: 100,            // Vertical spacing between levels
  layoutMargin: 80,             // Margin around the flowchart
  
  // Routing configuration
  minSpacing: 35,
  nodePadding: 25,
  gridSize: 10
});

artboard.addElement(flowchart);

return artboard.render();

