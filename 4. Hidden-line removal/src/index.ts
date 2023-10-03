import {
  degreesToRadians,
  rotatePointsAroundX,
  rotatePointsAroundY,
  rotatePointsAroundZ,
  scalePoints,
} from "../utils/utils";

const canvas = document.getElementById("output") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d", {
  willReadFrequently: true,
}) as CanvasRenderingContext2D;

const worldToScreen = (worldX: number, worldY: number, worldZ: number) => {
  return {
    screenX: worldX + canvas.width / 2,
    screenY: canvas.height / 2 - worldY,
    screenZ: worldZ,
  };
};

let frontPoints: { x: number; y: number; z: number }[] = [];
let backPoints: { x: number; y: number; z: number }[] = [];

fetch("/butterfly-pixels.json")
  .then((response) => response.json())
  .then((data) => {
    [frontPoints, backPoints] = [0, -5].map((offset) =>
      data.map((point: { x: number; y: number; z: number }) =>
        scalePoints(point.x, point.y, point.z + offset)
      )
    );
    animate();
  })
  .catch((error) => console.error("Error loading JSON:", error));

const depthBuffer = new Float32Array(canvas.width * canvas.height).fill(
  Infinity
);

const presentDepthBufferImplementation = () => {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const imageDataBuffer = imageData.data;

  [backPoints, frontPoints].forEach((points, index) => {
    const color = index === 0 ? [255, 0, 0, 255] : [0, 255, 0, 255];

    points.forEach((point) => {
      const { x, y, z } = point;
      const { screenX, screenY, screenZ } = worldToScreen(x, y, z);
      const indexBuffer =
        Math.floor(screenX) + Math.floor(screenY) * canvas.width;

      if (depthBuffer[indexBuffer] <= screenZ) return;

      depthBuffer[indexBuffer] = screenZ;

      const offset = indexBuffer * 4;
      imageDataBuffer.set(color, offset);
    });
  });

  context.putImageData(imageData, 0, 0);
};

const animate = () => {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const rotationAngle = degreesToRadians(1);
  backPoints = rotatePointsAroundY(backPoints, rotationAngle);
  frontPoints = rotatePointsAroundY(frontPoints, rotationAngle);
  // backPoints = rotatePointsAroundX(backPoints, rotationAngle);
  // frontPoints = rotatePointsAroundX(frontPoints, rotationAngle);
  // backPoints = rotatePointsAroundZ(backPoints, rotationAngle);
  // frontPoints = rotatePointsAroundZ(frontPoints, rotationAngle);

  depthBuffer.fill(Infinity);
  presentDepthBufferImplementation();
};
