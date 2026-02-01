/**
 * Input Handler - Touch and Mouse input
 */

export interface InputCallbacks {
  onPointerDown?: (x: number, y: number) => void;
  onPointerMove?: (x: number, y: number) => void;
  onPointerUp?: () => void;
}

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private callbacks: InputCallbacks = {};
  private isPointerDown: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupListeners();
  }

  private setupListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseUp);

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd);
  }

  private getCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  private handleMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    const { x, y } = this.getCanvasCoords(e.clientX, e.clientY);
    this.isPointerDown = true;
    this.callbacks.onPointerDown?.(x, y);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isPointerDown) return;
    const { x, y } = this.getCanvasCoords(e.clientX, e.clientY);
    this.callbacks.onPointerMove?.(x, y);
  };

  private handleMouseUp = (): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.callbacks.onPointerUp?.();
  };

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const { x, y } = this.getCanvasCoords(touch.clientX, touch.clientY);
    this.isPointerDown = true;
    this.callbacks.onPointerDown?.(x, y);
  };

  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (!this.isPointerDown || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { x, y } = this.getCanvasCoords(touch.clientX, touch.clientY);
    this.callbacks.onPointerMove?.(x, y);
  };

  private handleTouchEnd = (): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;
    this.callbacks.onPointerUp?.();
  };

  setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = callbacks;
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
  }
}
