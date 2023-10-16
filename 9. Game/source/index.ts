import { Enemy } from "./classes/enemy";
import { Player } from "./classes/player";
import { Projectile } from "./classes/projectile";

import { gsap } from "gsap";
import { Particle } from "./classes/particle";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = innerWidth;
canvas.height = innerHeight;

const playerSpawnPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

let player = new Player(
  context,
  playerSpawnPosition.x,
  playerSpawnPosition.y,
  10,
  "white"
);

const projectileSpawnPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

let projectiles: Projectile[] = [];

function initialize() {
  player = new Player(
    context,
    playerSpawnPosition.x,
    playerSpawnPosition.y,
    10,
    "white"
  );
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreValue.innerHTML = "0";
  modalScoreValue.innerHTML = "0";
}

addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientY - projectileSpawnPosition.y,
    event.clientX - projectileSpawnPosition.x
  );
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };
  projectiles.push(
    new Projectile(
      context,
      projectileSpawnPosition.x,
      projectileSpawnPosition.y,
      5,
      "white",
      velocity
    )
  );
});

let enemies: Enemy[] = [];
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

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
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

const modalScoreValue = document.getElementById(
  "modal-score-value"
) as HTMLHeadElement;
const scoreValue = document.getElementById("score-value") as HTMLSpanElement;
let particles: Particle[] = [];

let animationId: number;
let score: number = 0;
function animate() {
  animationId = requestAnimationFrame(animate);

  context.fillStyle = "rgba(0,0,0,0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();

  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    }
    particle.update();
  });

  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distanceToPlayer - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      modalScoreValue.innerHTML = score.toString();
      modalBoard.style.display = "flex";
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const distanceToProjectile = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      if (distanceToProjectile - enemy.radius - projectile.radius < 1) {
        const numberOfParticles = enemy.radius * 2;
        for (let i = 0; i < numberOfParticles; ++i) {
          particles.push(
            new Particle(
              context,
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }

        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreValue.innerHTML = score.toString();

          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          score += 250;
          scoreValue.innerHTML = score.toString();

          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

const modalBoard = document.getElementById("modal-board") as HTMLDivElement;
const startGameButton = document.getElementById(
  "start-game-btn"
) as HTMLButtonElement;
startGameButton.addEventListener("click", () => {
  initialize();
  animate();
  spawnEnemies();
  modalBoard.style.display = "none";
});
