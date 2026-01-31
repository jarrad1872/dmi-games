/**
 * Slice System
 * Handles cut detection and object splitting
 */

import { SwipePath, SwipePoint } from './InputHandler';

export interface SliceResult {
  hit: boolean;
  entryPoint?: { x: number; y: number };
  exitPoint?: { x: number; y: number };
  cutAngle?: number;
  precision?: number; // 0-1, how centered the cut was
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if a line segment intersects a rectangle
 */
function lineIntersectsRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: BoundingBox
): { intersects: boolean; entry?: { x: number; y: number }; exit?: { x: number; y: number } } {
  const left = rect.x;
  const right = rect.x + rect.width;
  const top = rect.y;
  const bottom = rect.y + rect.height;

  // Check each edge of the rectangle
  const edges = [
    { x1: left, y1: top, x2: right, y2: top },     // Top
    { x1: right, y1: top, x2: right, y2: bottom }, // Right
    { x1: left, y1: bottom, x2: right, y2: bottom }, // Bottom
    { x1: left, y1: top, x2: left, y2: bottom },   // Left
  ];

  const intersections: { x: number; y: number; t: number }[] = [];

  for (const edge of edges) {
    const intersection = lineLineIntersection(
      x1, y1, x2, y2,
      edge.x1, edge.y1, edge.x2, edge.y2
    );

    if (intersection) {
      intersections.push(intersection);
    }
  }

  if (intersections.length < 2) {
    return { intersects: false };
  }

  // Sort by t value (position along the swipe line)
  intersections.sort((a, b) => a.t - b.t);

  return {
    intersects: true,
    entry: { x: intersections[0].x, y: intersections[0].y },
    exit: { x: intersections[intersections.length - 1].x, y: intersections[intersections.length - 1].y },
  };
}

/**
 * Calculate intersection point of two line segments
 */
function lineLineIntersection(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): { x: number; y: number; t: number } | null {
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  if (Math.abs(denom) < 0.0001) {
    return null; // Lines are parallel
  }

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1),
      t,
    };
  }

  return null;
}

export class SliceSystem {
  /**
   * Check if a swipe path intersects with a bounding box
   */
  checkSlice(path: SwipePath, bounds: BoundingBox): SliceResult {
    if (path.points.length < 2) {
      return { hit: false };
    }

    // Use simplified line from first to last point for main detection
    const first = path.points[0];
    const last = path.points[path.points.length - 1];

    const result = lineIntersectsRect(
      first.x, first.y,
      last.x, last.y,
      bounds
    );

    if (!result.intersects || !result.entry || !result.exit) {
      return { hit: false };
    }

    // Calculate cut angle
    const dx = result.exit.x - result.entry.x;
    const dy = result.exit.y - result.entry.y;
    const cutAngle = Math.atan2(dy, dx);

    // Calculate precision (how centered the cut was)
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    // Midpoint of the cut
    const cutMidX = (result.entry.x + result.exit.x) / 2;
    const cutMidY = (result.entry.y + result.exit.y) / 2;

    // Distance from center
    const distFromCenter = Math.sqrt(
      Math.pow(cutMidX - centerX, 2) +
      Math.pow(cutMidY - centerY, 2)
    );

    // Normalize precision (closer to center = higher precision)
    const maxDist = Math.sqrt(Math.pow(bounds.width / 2, 2) + Math.pow(bounds.height / 2, 2));
    const precision = Math.max(0, 1 - (distFromCenter / maxDist));

    return {
      hit: true,
      entryPoint: result.entry,
      exitPoint: result.exit,
      cutAngle,
      precision,
    };
  }

  /**
   * Check if a single point is inside a bounding box
   */
  pointInBounds(point: SwipePoint, bounds: BoundingBox): boolean {
    return (
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }

  /**
   * Get the swipe velocity (for physics impulse)
   */
  getSwipeVelocity(path: SwipePath): { x: number; y: number; magnitude: number } {
    const magnitude = Math.sqrt(
      path.velocity.x * path.velocity.x +
      path.velocity.y * path.velocity.y
    );

    return {
      x: path.velocity.x,
      y: path.velocity.y,
      magnitude,
    };
  }

  /**
   * Calculate impulse direction perpendicular to cut
   */
  getImpulseDirections(cutAngle: number, strength: number = 200): {
    left: { x: number; y: number };
    right: { x: number; y: number };
  } {
    // Perpendicular to cut angle
    const perpAngle = cutAngle + Math.PI / 2;

    return {
      left: {
        x: Math.cos(perpAngle) * strength,
        y: Math.sin(perpAngle) * strength,
      },
      right: {
        x: Math.cos(perpAngle + Math.PI) * strength,
        y: Math.sin(perpAngle + Math.PI) * strength,
      },
    };
  }
}
