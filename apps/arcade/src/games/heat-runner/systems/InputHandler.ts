/**
 * Input Handler System
 * Handles swipe-based lane controls for endless runner
 */

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'none';

export interface SwipeResult {
  direction: SwipeDirection;
  velocity: number;
}

export interface InputCallbacks {
  onSwipe?: (direction: SwipeDirection) => void;
  onTap?: (x: number, y: number) => void;
}

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private callbacks: InputCallbacks = {};
  
  // Touch/mouse tracking
  private startX: number = 0;
  private startY: number = 0;
  private startTime: number = 0;
  private isDragging: boolean = false;
  
  // Configurable thresholds
  private readonly SWIPE_THRESHOLD = 30;
  private readonly SWIPE_TIME_LIMIT = 300;
  
  // Keyboard state
  private keys: Set<string> = new Set();
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }
  
  setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = callbacks;
  }
  
  private setupEventListeners(): void {
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }
  
  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isDragging) return;
    const touch = e.touches[0];
    this.checkSwipe(touch.clientX, touch.clientY);
  }
  
  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    this.endDrag();
  }
  
  private handleMouseDown(e: MouseEvent): void {
    this.startDrag(e.clientX, e.clientY);
  }
  
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    this.checkSwipe(e.clientX, e.clientY);
  }
  
  private handleMouseUp(): void {
    this.endDrag();
  }
  
  private handleKeyDown(e: KeyboardEvent): void {
    if (this.keys.has(e.key)) return;
    this.keys.add(e.key);
    
    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        this.callbacks.onSwipe?.('left');
        break;
      case 'd':
      case 'arrowright':
        this.callbacks.onSwipe?.('right');
        break;
      case 'w':
      case 'arrowup':
      case ' ':
        this.callbacks.onSwipe?.('up');
        break;
      case 's':
      case 'arrowdown':
        this.callbacks.onSwipe?.('down');
        break;
    }
  }
  
  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key);
  }
  
  private startDrag(x: number, y: number): void {
    this.startX = x;
    this.startY = y;
    this.startTime = performance.now();
    this.isDragging = true;
  }
  
  private checkSwipe(x: number, y: number): void {
    const dx = x - this.startX;
    const dy = y - this.startY;
    const elapsed = performance.now() - this.startTime;
    
    if (elapsed > this.SWIPE_TIME_LIMIT) {
      this.startX = x;
      this.startY = y;
      this.startTime = performance.now();
      return;
    }
    
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (absDx < this.SWIPE_THRESHOLD && absDy < this.SWIPE_THRESHOLD) {
      return;
    }
    
    let direction: SwipeDirection = 'none';
    if (absDx > absDy) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }
    
    this.callbacks.onSwipe?.(direction);
    this.isDragging = false;
  }
  
  private endDrag(): void {
    if (this.isDragging) {
      const elapsed = performance.now() - this.startTime;
      if (elapsed < 200) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (this.startX - rect.left) * (this.canvas.width / rect.width);
        const y = (this.startY - rect.top) * (this.canvas.height / rect.height);
        this.callbacks.onTap?.(x, y);
      }
    }
    this.isDragging = false;
  }
  
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
