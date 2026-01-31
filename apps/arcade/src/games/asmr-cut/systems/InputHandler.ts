/**
 * Input Handler System
 * Handles touch and mouse input with swipe detection
 */

export interface SwipePoint {
  x: number;
  y: number;
  time: number;
}

export interface SwipePath {
  points: SwipePoint[];
  startTime: number;
  endTime: number;
  velocity: { x: number; y: number };
  distance: number;
}

export type InputState = 'idle' | 'dragging' | 'released';

export interface InputCallbacks {
  onSwipeStart?: (point: SwipePoint) => void;
  onSwipeMove?: (point: SwipePoint, path: SwipePoint[]) => void;
  onSwipeEnd?: (path: SwipePath) => void;
  onTap?: (point: SwipePoint) => void;
}

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private state: InputState = 'idle';
  private currentPath: SwipePoint[] = [];
  private callbacks: InputCallbacks = {};
  private lastPoint: SwipePoint | null = null;

  // Configurable thresholds
  private readonly TAP_THRESHOLD = 10; // Max pixels for tap
  private readonly TAP_TIME_THRESHOLD = 200; // Max ms for tap
  private readonly MIN_SWIPE_DISTANCE = 20; // Min pixels for valid swipe

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  /**
   * Set input callbacks
   */
  setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Get current input state
   */
  getState(): InputState {
    return this.state;
  }

  /**
   * Get current path during drag
   */
  getCurrentPath(): SwipePoint[] {
    return this.currentPath;
  }

  private setupEventListeners(): void {
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });

    // Mouse events (for desktop)
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
  }

  private getCanvasPoint(clientX: number, clientY: number): SwipePoint {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      time: performance.now(),
    };
  }

  private handleStart(point: SwipePoint): void {
    this.state = 'dragging';
    this.currentPath = [point];
    this.lastPoint = point;
    this.callbacks.onSwipeStart?.(point);
  }

  private handleMove(point: SwipePoint): void {
    if (this.state !== 'dragging') return;

    // Only add point if it's moved enough (reduces path density)
    if (this.lastPoint) {
      const dx = point.x - this.lastPoint.x;
      const dy = point.y - this.lastPoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) return; // Too close, skip
    }

    this.currentPath.push(point);
    this.lastPoint = point;
    this.callbacks.onSwipeMove?.(point, this.currentPath);
  }

  private handleEnd(): void {
    if (this.state !== 'dragging') return;

    this.state = 'released';

    if (this.currentPath.length < 2) {
      // Single point - check for tap
      if (this.currentPath.length === 1) {
        this.callbacks.onTap?.(this.currentPath[0]);
      }
      this.reset();
      return;
    }

    const first = this.currentPath[0];
    const last = this.currentPath[this.currentPath.length - 1];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = last.time - first.time;

    // Check if this is a tap
    if (distance < this.TAP_THRESHOLD && duration < this.TAP_TIME_THRESHOLD) {
      this.callbacks.onTap?.(first);
      this.reset();
      return;
    }

    // Check if swipe is long enough
    if (distance < this.MIN_SWIPE_DISTANCE) {
      this.reset();
      return;
    }

    // Calculate velocity
    const velocityX = dx / (duration / 1000);
    const velocityY = dy / (duration / 1000);

    const path: SwipePath = {
      points: this.currentPath,
      startTime: first.time,
      endTime: last.time,
      velocity: { x: velocityX, y: velocityY },
      distance,
    };

    this.callbacks.onSwipeEnd?.(path);
    this.reset();
  }

  private reset(): void {
    this.state = 'idle';
    this.currentPath = [];
    this.lastPoint = null;
  }

  // Touch event handlers
  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    const point = this.getCanvasPoint(touch.clientX, touch.clientY);
    this.handleStart(point);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    const point = this.getCanvasPoint(touch.clientX, touch.clientY);
    this.handleMove(point);
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.handleEnd();
  }

  // Mouse event handlers
  private handleMouseDown(e: MouseEvent): void {
    const point = this.getCanvasPoint(e.clientX, e.clientY);
    this.handleStart(point);
  }

  private handleMouseMove(e: MouseEvent): void {
    const point = this.getCanvasPoint(e.clientX, e.clientY);
    this.handleMove(point);
  }

  private handleMouseUp(): void {
    this.handleEnd();
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.removeEventListener('mouseleave', this.handleMouseUp.bind(this));
  }
}
