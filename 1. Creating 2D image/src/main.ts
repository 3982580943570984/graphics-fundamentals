import * as THREE from "three";

// Initialize Three.js components
const renderer = initRenderer();
const camera = initCamera();
const scene = new THREE.Scene();

// Event Listeners
addMouseWheelListener(camera);
addMouseDragListener(camera);

// Fetch and draw lines
fetchAndDrawLines("../xy_coordinates.json");

// Animate Scene
animate();

function initRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function initCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 500);
  camera.lookAt(0, 0, 0);
  return camera;
}

function addMouseWheelListener(camera: THREE.PerspectiveCamera): void {
  document.addEventListener("wheel", (event) => {
    camera.fov = event.deltaY < 0
      ? Math.max(1, camera.fov - 5)
      : Math.min(180, camera.fov + 5);
    camera.updateProjectionMatrix();
  });
}

function addMouseDragListener(camera: THREE.PerspectiveCamera): void {
  let mouseX = 0, mouseY = 0;

  document.addEventListener("mousedown", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    const onMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      camera.position.x -= deltaX;
      camera.position.y += deltaY;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMouseMove);
    });
  });
}

function fetchAndDrawLines(filePath: string): void {
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => drawLines(data))
    .catch((error) => console.error("Error loading JSON:", error));
}

function drawLines(jsonData: { X: number; Y: number }[]): void {
  const imageWidth = 2875;
  const imageHeight = 2759;

  const screenWidth = 1750;
  const screenHeight = 1080;

  const scaleFactorX = screenWidth / imageWidth;
  const scaleFactorY = screenHeight / imageHeight;

  const points: THREE.Vector3[] = jsonData.map((point) => {
    const newX = point.X - (imageWidth / 2);
    const newY = point.Y - (imageHeight / 2);

    const scaledX = newX * scaleFactorX;
    const scaledY = newY * scaleFactorY;
    return new THREE.Vector3(
      scaledX / 3.5,
      -scaledY / 2,
      0,
    );
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "white" });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
