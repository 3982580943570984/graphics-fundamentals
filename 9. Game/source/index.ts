import { Enemy } from "./classes/enemy";
import { Player } from "./classes/player";
import { Projectile } from "./classes/projectile";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;

const playerSpawnPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const player = new Player(
  context,
  playerSpawnPosition.x,
  playerSpawnPosition.y,
  30,
  "blue"
);

const projectileSpawnPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const projectiles: Projectile[] = [];

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - projectileSpawnPosition.y,
    event.clientX - projectileSpawnPosition.x
  );
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  projectiles.push(
    new Projectile(
      context,
      projectileSpawnPosition.x,
      projectileSpawnPosition.y,
      5,
      "red",
      velocity
    )
  );
});

const enemies: Enemy[] = [];
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? -radius : canvas.height + radius;
    }

    const color = "green";
    const angle = Math.atan2(
      projectileSpawnPosition.y - y,
      projectileSpawnPosition.x - x
    );
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(context, x, y, radius, color, velocity));
  }, 1000);
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();

  projectiles.forEach((projectile) => {
    projectile.update();
  });

  enemies.forEach((enemy) => {
    enemy.update();
  });
}

animate();
spawnEnemies();
