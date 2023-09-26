import * as THREE from "three";
import { AffineTransformations } from "./utils/affine-transformations";
import * as dat from "dat.gui";

// Initialize Three.js components
const renderer = initRenderer();
const camera = initCamera();
const scene = new THREE.Scene();

// // Event Listeners{{{
// addMouseWheelListener(camera);
// addMouseDragListener(camera);}}}

// Fetch and draw lines
let butterfly: THREE.Line;
fetchAndDrawLines("../butterfly.json");

const gui = new dat.GUI();
gui;
const controls = {
  angle: 0,
  dx: 0,
  dy: 0,
  dz: 0,
};

gui.add(controls, "angle", 0, Math.PI * 2).name("Rotation Angle");
gui.add(controls, "dx", -50, 50).name("Translation X");
gui.add(controls, "dy", -50, 50).name("Translation Y");
gui.add(controls, "dz", -50, 50).name("Translation Z");

// Animate Scene
animate();

function initRenderer(): THREE.WebGLRenderer { //{{{
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
} //}}}

function initCamera(): THREE.PerspectiveCamera { //{{{
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  return camera;
} //}}}

// function addMouseWheelListener(camera: THREE.PerspectiveCamera): void { //{{{{{{
//   document.addEventListener("wheel", (event) => {
//     camera.fov = event.deltaY < 0
//       ? Math.max(1, camera.fov - 5)
//       : Math.min(180, camera.fov + 5);
//     camera.updateProjectionMatrix();
//   });
// } //}}}
//
// function addMouseDragListener(camera: THREE.PerspectiveCamera): void { //{{{
//   let mouseX = 0, mouseY = 0;
//
//   document.addEventListener("mousedown", (event) => {
//     mouseX = event.clientX;
//     mouseY = event.clientY;
//
//     const onMouseMove = (event: MouseEvent) => {
//       const deltaX = event.clientX - mouseX;
//       const deltaY = event.clientY - mouseY;
//       camera.position.x -= deltaX;
//       camera.position.y += deltaY;
//       mouseX = event.clientX;
//       mouseY = event.clientY;
//     };
//
//     document.addEventListener("mousemove", onMouseMove);
//     document.addEventListener("mouseup", () => {
//       document.removeEventListener("mousemove", onMouseMove);
//     });
//   });
// } //}}}}}}

function fetchAndDrawLines(filePath: string): void { //{{{
  fetch(filePath)
    .then((response) => response.json())
    .then((data) => {
      butterfly = drawLines(data);
      butterfly.matrixAutoUpdate = false;
    })
    .catch((error) => console.error("Error loading JSON:", error));
} //}}}

function drawLines(jsonData: { x: number; y: number; z: number }[]) { //{{{
  const points: THREE.Vector3[] = jsonData.map((point) => {
    return new THREE.Vector3(
      point.x,
      point.y,
      0,
    );
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: "white" });
  const line = new THREE.Line(geometry, material);

  scene.add(line);

  return line;
} //}}}

function animate(): void {
  requestAnimationFrame(animate);
  //
  // Сброс текущих преобразований
  butterfly.matrix.identity();
  butterfly.matrixWorldNeedsUpdate = true;

  const rotationMatrix = AffineTransformations.createRotationMatrix(
    controls.angle,
  );
  const translationMatrix = AffineTransformations.createTranslationMatrix(
    controls.dx,
    controls.dy,
    controls.dz,
  );

  butterfly.applyMatrix4(rotationMatrix);
  butterfly.applyMatrix4(translationMatrix);

  renderer.render(scene, camera);
}
