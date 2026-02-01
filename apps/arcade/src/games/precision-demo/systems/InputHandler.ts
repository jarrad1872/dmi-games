export interface InputCallbacks {
  onTap?: (x: number, y: number) => void;
}

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private callbacks: InputCallbacks = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupListeners();
  }

  setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = callbacks;
  }

  private setupListeners(): void {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('touchend', (e) => this.handleTouch(e));
  }

  private handleClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.callbacks.onTap?.(x, y);
  }

  private handleTouch(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const rect = this.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    this.callbacks.onTap?.(x, y);
  }
}
