export class Enemy {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string,
    velocity: { x: number; y: number }
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
