export type Tool = 'pen' | 'rect' | 'arrow' | 'blackout';

interface Point {
  x: number;
  y: number;
}

interface Shape {
  tool: Tool;
  color: string;
  points: Point[];
}

/**
 * Renders a base screenshot onto a canvas and lets the user draw annotations.
 * Blackout shapes are filled opaque so flattening permanently redacts pixels.
 */
export class Annotator {
  private ctx: CanvasRenderingContext2D;
  private baseImage: HTMLImageElement | null = null;
  private shapes: Shape[] = [];
  private current: Shape | null = null;
  private drawing = false;

  tool: Tool = 'pen';
  color = '#ff3b30';

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
    canvas.addEventListener('pointerdown', this.onDown);
    canvas.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
  }

  async loadImage(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      this.baseImage = img;
      this.canvas.width = img.naturalWidth;
      this.canvas.height = img.naturalHeight;
      this.redraw();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  undo(): void {
    this.shapes.pop();
    this.redraw();
  }

  private toCanvasPoint(e: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  private onDown = (e: PointerEvent) => {
    this.drawing = true;
    this.current = { tool: this.tool, color: this.color, points: [this.toCanvasPoint(e)] };
  };

  private onMove = (e: PointerEvent) => {
    if (!this.drawing || !this.current) return;
    const point = this.toCanvasPoint(e);
    if (this.current.tool === 'pen') {
      this.current.points.push(point);
    } else {
      this.current.points[1] = point;
    }
    this.redraw();
  };

  private onUp = () => {
    if (this.current) {
      this.shapes.push(this.current);
      this.current = null;
    }
    this.drawing = false;
    this.redraw();
  };

  private redraw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.baseImage) ctx.drawImage(this.baseImage, 0, 0);
    const all = this.current ? [...this.shapes, this.current] : this.shapes;
    for (const shape of all) this.drawShape(shape);
  }

  private drawShape(shape: Shape): void {
    const { ctx } = this;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = shape.color;
    const [a, b] = shape.points;
    if (shape.tool === 'pen') {
      ctx.beginPath();
      shape.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    } else if (shape.tool === 'rect' && b) {
      ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
    } else if (shape.tool === 'blackout' && b) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(
        Math.min(a.x, b.x),
        Math.min(a.y, b.y),
        Math.abs(b.x - a.x),
        Math.abs(b.y - a.y)
      );
    } else if (shape.tool === 'arrow' && b) {
      this.drawArrow(a, b, shape.color);
    }
  }

  private drawArrow(from: Point, to: Point, color: string): void {
    const { ctx } = this;
    const head = 16;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - head * Math.cos(angle - Math.PI / 6),
      to.y - head * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      to.x - head * Math.cos(angle + Math.PI / 6),
      to.y - head * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  /** Flattens base image + annotations into a single blob. */
  async toBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/png'
      );
    });
  }

  destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.onDown);
    this.canvas.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
  }
}
