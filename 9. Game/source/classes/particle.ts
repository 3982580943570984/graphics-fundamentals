const friction = 0.99;

export class Particle {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
  alpha: number = 1;

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
    this.context.save();

    this.context.globalAlpha = this.alpha;

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fillStyle = this.color;
    this.context.fill();

    this.context.restore();
  }

  update() {
    this.draw();

    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.005;
  }
}
