/**
 * Pathfinding utilities for collision-free connector routing.
 * 
 * Uses A* algorithm with orthogonal movement to find paths that avoid obstacles.
 */

import { type Position } from "../core/Element.js";

/**
 * Rectangle obstacle for pathfinding.
 */
export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Grid node for A* pathfinding.
 */
interface GridNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to end
  f: number; // Total cost
  parent: GridNode | null;
}

/**
 * Find an orthogonal path between two points that avoids obstacles.
 * Uses A* algorithm with Manhattan distance heuristic.
 * 
 * @param start - Starting position
 * @param end - Ending position
 * @param obstacles - Array of rectangular obstacles to avoid
 * @param gridSize - Grid cell size (smaller = more precise but slower)
 * @param padding - Additional padding around obstacles
 * @returns Array of waypoints forming the path
 */
export function findPath(
  start: Position,
  end: Position,
  obstacles: Obstacle[],
  gridSize: number = 10,
  padding: number = 20
): Position[] {
  // Expand obstacles with padding
  const expandedObstacles = obstacles.map(obs => ({
    x: obs.x - padding,
    y: obs.y - padding,
    width: obs.width + padding * 2,
    height: obs.height + padding * 2,
  }));

  // Calculate grid bounds
  const allPoints = [
    start,
    end,
    ...expandedObstacles.flatMap(obs => [
      { x: obs.x, y: obs.y },
      { x: obs.x + obs.width, y: obs.y + obs.height },
    ]),
  ];

  const minX = Math.floor(Math.min(...allPoints.map(p => p.x)) / gridSize) * gridSize;
  const maxX = Math.ceil(Math.max(...allPoints.map(p => p.x)) / gridSize) * gridSize;
  const minY = Math.floor(Math.min(...allPoints.map(p => p.y)) / gridSize) * gridSize;
  const maxY = Math.ceil(Math.max(...allPoints.map(p => p.y)) / gridSize) * gridSize;

  // Snap start and end to grid
  const gridStart = {
    x: Math.round(start.x / gridSize) * gridSize,
    y: Math.round(start.y / gridSize) * gridSize,
  };
  const gridEnd = {
    x: Math.round(end.x / gridSize) * gridSize,
    y: Math.round(end.y / gridSize) * gridSize,
  };

  // Check if a position is inside any obstacle
  const isBlocked = (x: number, y: number): boolean => {
    return expandedObstacles.some(obs =>
      x >= obs.x &&
      x <= obs.x + obs.width &&
      y >= obs.y &&
      y <= obs.y + obs.height
    );
  };

  // Manhattan distance heuristic
  const heuristic = (x: number, y: number): number => {
    return Math.abs(x - gridEnd.x) + Math.abs(y - gridEnd.y);
  };

  // A* algorithm
  const openSet: GridNode[] = [];
  const closedSet = new Set<string>();
  const nodeKey = (x: number, y: number) => `${x},${y}`;

  // Start node
  const startNode: GridNode = {
    x: gridStart.x,
    y: gridStart.y,
    g: 0,
    h: heuristic(gridStart.x, gridStart.y),
    f: heuristic(gridStart.x, gridStart.y),
    parent: null,
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    // Check if we reached the goal
    if (current.x === gridEnd.x && current.y === gridEnd.y) {
      // Reconstruct path
      const path: Position[] = [];
      let node: GridNode | null = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }
      
      // Simplify path by removing redundant points
      return simplifyPath(path);
    }

    closedSet.add(nodeKey(current.x, current.y));

    // Check all neighbors (orthogonal only)
    const neighbors = [
      { x: current.x + gridSize, y: current.y },
      { x: current.x - gridSize, y: current.y },
      { x: current.x, y: current.y + gridSize },
      { x: current.x, y: current.y - gridSize },
    ];

    for (const neighbor of neighbors) {
      // Skip if out of bounds
      if (
        neighbor.x < minX ||
        neighbor.x > maxX ||
        neighbor.y < minY ||
        neighbor.y > maxY
      ) {
        continue;
      }

      // Skip if blocked or already evaluated
      const key = nodeKey(neighbor.x, neighbor.y);
      if (isBlocked(neighbor.x, neighbor.y) || closedSet.has(key)) {
        continue;
      }

      const g = current.g + gridSize;
      const h = heuristic(neighbor.x, neighbor.y);
      const f = g + h;

      // Check if this neighbor is already in open set
      const existingNode = openSet.find(
        n => n.x === neighbor.x && n.y === neighbor.y
      );

      if (existingNode) {
        // Update if we found a better path
        if (g < existingNode.g) {
          existingNode.g = g;
          existingNode.f = f;
          existingNode.parent = current;
        }
      } else {
        // Add new node to open set
        openSet.push({
          x: neighbor.x,
          y: neighbor.y,
          g,
          h,
          f,
          parent: current,
        });
      }
    }
  }

  // No path found, return direct path
  return [start, end];
}

/**
 * Simplify a path by removing redundant intermediate points.
 * Keeps only points where direction changes.
 */
function simplifyPath(path: Position[]): Position[] {
  if (path.length <= 2) return path;

  const simplified: Position[] = [path[0]];

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const current = path[i];
    const next = path[i + 1];

    // Check if direction changes
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;

    // If direction changes, keep this point
    if (dx1 !== dx2 || dy1 !== dy2) {
      simplified.push(current);
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

/**
 * Calculate optimal label position on a path segment.
 * Places label on the longest straight segment, away from nodes.
 * 
 * @param path - Path waypoints
 * @param minDistanceFromEnds - Minimum distance from path ends
 * @returns Position for the label
 */
export function calculateLabelPosition(
  path: Position[],
  minDistanceFromEnds: number = 30
): Position {
  if (path.length < 2) {
    return path[0];
  }

  // Find the longest segment
  let longestSegmentIndex = 0;
  let longestLength = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1].x - path[i].x;
    const dy = path[i + 1].y - path[i].y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length > longestLength) {
      longestLength = length;
      longestSegmentIndex = i;
    }
  }

  // Place label on the longest segment
  const start = path[longestSegmentIndex];
  const end = path[longestSegmentIndex + 1];

  // If segment is long enough, place label with padding from ends
  if (longestLength > minDistanceFromEnds * 2) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    const t = minDistanceFromEnds / segmentLength;

    return {
      x: start.x + dx * (0.5 + t * 0.5),
      y: start.y + dy * (0.5 + t * 0.5),
    };
  }

  // Otherwise, place at midpoint
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
}

