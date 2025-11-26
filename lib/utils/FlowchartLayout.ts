/**
 * Automatic layout algorithms for flowcharts.
 * 
 * Provides hierarchical layout algorithms that automatically position
 * flowchart nodes with proper spacing and visual flow.
 */

import { type Position } from "../core/Element.js";

/**
 * Node for layout algorithm.
 */
export interface LayoutNode {
  id: string;
  width: number;
  height: number;
  position?: Position;
}

/**
 * Connection between nodes.
 */
export interface LayoutConnection {
  from: string;
  to: string;
}

/**
 * Layout direction.
 */
export type LayoutDirection = "vertical" | "horizontal";

/**
 * Layout configuration.
 */
export interface LayoutConfig {
  /**
   * Direction of the main flow.
   * @defaultValue 'vertical'
   */
  direction?: LayoutDirection;

  /**
   * Spacing between nodes on the same level.
   * @defaultValue 60
   */
  nodeSpacing?: number;

  /**
   * Spacing between levels/layers.
   * @defaultValue 100
   */
  levelSpacing?: number;

  /**
   * Margin around the entire layout.
   * @defaultValue 50
   */
  margin?: number;

  /**
   * Starting position for the layout.
   * @defaultValue { x: 0, y: 0 }
   */
  startPosition?: Position;
}

/**
 * Calculate automatic layout for flowchart nodes.
 * Uses a hierarchical layered layout algorithm.
 * 
 * @param nodes - Nodes to layout
 * @param connections - Connections between nodes
 * @param config - Layout configuration
 * @returns Map of node IDs to positions
 */
export function calculateLayout(
  nodes: LayoutNode[],
  connections: LayoutConnection[],
  config: LayoutConfig = {}
): Map<string, Position> {
  const direction = config.direction ?? "vertical";
  const nodeSpacing = config.nodeSpacing ?? 60;
  const levelSpacing = config.levelSpacing ?? 100;
  const margin = config.margin ?? 50;
  const startPosition = config.startPosition ?? { x: 0, y: 0 };

  // First, check if all nodes have explicit positions
  const allPositioned = nodes.every(n => n.position !== undefined);
  if (allPositioned) {
    // All nodes have positions, return them as-is
    const positionMap = new Map<string, Position>();
    for (const node of nodes) {
      positionMap.set(node.id, node.position!);
    }
    return positionMap;
  }

  // Build adjacency lists
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  
  for (const node of nodes) {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  }
  
  for (const conn of connections) {
    outgoing.get(conn.from)?.push(conn.to);
    incoming.get(conn.to)?.push(conn.from);
  }

  // Find root nodes (nodes with no incoming connections)
  const roots = nodes.filter(n => incoming.get(n.id)!.length === 0);
  
  // If no roots found, use the first node
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0]);
  }

  // Assign nodes to layers using BFS
  const layers = assignLayers(nodes, connections, roots);

  // Calculate positions for each layer
  const positions = new Map<string, Position>();
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  let currentOffset = direction === "vertical" 
    ? startPosition.y + margin 
    : startPosition.x + margin;

  for (const layer of layers) {
    // Calculate layer dimensions
    const layerNodes = layer.map(id => nodeMap.get(id)!);
    const maxSize = direction === "vertical"
      ? Math.max(...layerNodes.map(n => n.height))
      : Math.max(...layerNodes.map(n => n.width));

    // Calculate total width/height of layer
    const totalCrossSize = layerNodes.reduce((sum, node, i) => {
      const size = direction === "vertical" ? node.width : node.height;
      return sum + size + (i > 0 ? nodeSpacing : 0);
    }, 0);

    // Center the layer
    let crossOffset = direction === "vertical"
      ? startPosition.x + margin
      : startPosition.y + margin;

    // Position each node in the layer
    for (const nodeId of layer) {
      const node = nodeMap.get(nodeId)!;
      
      if (node.position) {
        // Use explicit position if provided
        positions.set(nodeId, node.position);
      } else {
        // Calculate automatic position
        const nodeSize = direction === "vertical" ? node.width : node.height;
        const nodeCrossCenter = crossOffset + nodeSize / 2;

        if (direction === "vertical") {
          positions.set(nodeId, {
            x: nodeCrossCenter,
            y: currentOffset + maxSize / 2
          });
        } else {
          positions.set(nodeId, {
            x: currentOffset + maxSize / 2,
            y: nodeCrossCenter
          });
        }

        crossOffset += nodeSize + nodeSpacing;
      }
    }

    currentOffset += maxSize + levelSpacing;
  }

  return positions;
}

/**
 * Assign nodes to layers using topological sort with BFS.
 */
function assignLayers(
  nodes: LayoutNode[],
  connections: LayoutConnection[],
  roots: LayoutNode[]
): string[][] {
  const layers: string[][] = [];
  const visited = new Set<string>();
  const nodeLevel = new Map<string, number>();

  // Build adjacency list
  const outgoing = new Map<string, string[]>();
  for (const node of nodes) {
    outgoing.set(node.id, []);
  }
  for (const conn of connections) {
    outgoing.get(conn.from)?.push(conn.to);
  }

  // BFS to assign levels
  const queue: Array<{ id: string; level: number }> = [];
  
  for (const root of roots) {
    queue.push({ id: root.id, level: 0 });
  }

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;

    if (visited.has(id)) {
      // If already visited, potentially update level if this path is longer
      const currentLevel = nodeLevel.get(id)!;
      if (level > currentLevel) {
        // Remove from old layer
        const oldLayer = layers[currentLevel];
        const index = oldLayer.indexOf(id);
        if (index >= 0) {
          oldLayer.splice(index, 1);
        }
        // Add to new layer
        nodeLevel.set(id, level);
        if (!layers[level]) layers[level] = [];
        layers[level].push(id);
      }
      continue;
    }

    visited.add(id);
    nodeLevel.set(id, level);

    // Add to layer
    if (!layers[level]) {
      layers[level] = [];
    }
    layers[level].push(id);

    // Add children to queue
    const children = outgoing.get(id) || [];
    for (const childId of children) {
      queue.push({ id: childId, level: level + 1 });
    }
  }

  // Add any unvisited nodes (disconnected) to the last layer
  const unvisited = nodes.filter(n => !visited.has(n.id));
  if (unvisited.length > 0) {
    const lastLevel = layers.length;
    layers[lastLevel] = unvisited.map(n => n.id);
  }

  return layers;
}

/**
 * Optimize layer ordering to reduce edge crossings.
 * Uses barycenter heuristic.
 */
export function optimizeLayerOrder(
  layers: string[][],
  connections: LayoutConnection[]
): string[][] {
  // Build connection maps
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  for (const conn of connections) {
    if (!outgoing.has(conn.from)) outgoing.set(conn.from, []);
    if (!incoming.has(conn.to)) incoming.set(conn.to, []);
    outgoing.get(conn.from)!.push(conn.to);
    incoming.get(conn.to)!.push(conn.from);
  }

  // Create position maps
  const nodePosition = new Map<string, number>();
  for (let i = 0; i < layers.length; i++) {
    for (let j = 0; j < layers[i].length; j++) {
      nodePosition.set(layers[i][j], j);
    }
  }

  const optimizedLayers = layers.map(layer => [...layer]);

  // Iterate through layers (bottom-up, then top-down)
  for (let pass = 0; pass < 2; pass++) {
    const layerRange = pass === 0 
      ? Array.from({ length: layers.length - 1 }, (_, i) => layers.length - 2 - i)
      : Array.from({ length: layers.length - 1 }, (_, i) => i + 1);

    for (const layerIndex of layerRange) {
      const layer = optimizedLayers[layerIndex];
      
      // Calculate barycenter for each node
      const barycenters = layer.map(nodeId => {
        const neighbors = pass === 0
          ? (outgoing.get(nodeId) || [])
          : (incoming.get(nodeId) || []);
        
        if (neighbors.length === 0) return Infinity;

        const sum = neighbors.reduce((acc, neighborId) => {
          return acc + (nodePosition.get(neighborId) ?? 0);
        }, 0);

        return sum / neighbors.length;
      });

      // Sort nodes by barycenter
      const sorted = layer
        .map((id, i) => ({ id, barycenter: barycenters[i] }))
        .sort((a, b) => a.barycenter - b.barycenter)
        .map(item => item.id);

      optimizedLayers[layerIndex] = sorted;

      // Update positions
      sorted.forEach((id, pos) => nodePosition.set(id, pos));
    }
  }

  return optimizedLayers;
}

