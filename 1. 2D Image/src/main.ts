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
const controls = {
  angleX: 0,
  angleY: 0,
  angleZ: 0,

  dX: 0,
  dY: 0,
  dZ: 0,

  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
};

gui.add(controls, "angleX", 0, 2 * Math.PI).name("Rotation X");
gui.add(controls, "angleY", 0, 2 * Math.PI).name("Rotation Y");
gui.add(controls, "angleZ", 0, 2 * Math.PI).name("Rotation Z");

gui.add(controls, "dX", -50, 50).name("Translation X");
gui.add(controls, "dY", -50, 50).name("Translation Y");
gui.add(controls, "dZ", -50, 50).name("Translation Z");

gui.add(controls, "scaleX", 0, 10).name("Scale X");
gui.add(controls, "scaleY", 0, 10).name("Scale Y");
gui.add(controls, "scaleZ", 0, 10).name("Scale Z");

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

  butterfly.matrix.identity();
  butterfly.matrixWorldNeedsUpdate = true;

  const xRotationMatrix = AffineTransformations.createXRotationMatrix(
    controls.angleX,
  );
  const yRotationMatrix = AffineTransformations.createYRotationMatrix(
    controls.angleY,
  );
  const zRotationMatrix = AffineTransformations.createZRotationMatrix(
    controls.angleZ,
  );
  const translationMatrix = AffineTransformations.createTranslationMatrix(
    controls.dX,
    controls.dY,
    controls.dZ,
  );
  const scaleMatrix = AffineTransformations.createScalingMatrix(
    controls.scaleX,
    controls.scaleY,
    controls.scaleZ,
  );

  butterfly.applyMatrix4(xRotationMatrix);
  butterfly.applyMatrix4(yRotationMatrix);
  butterfly.applyMatrix4(zRotationMatrix);
  butterfly.applyMatrix4(translationMatrix);
  butterfly.applyMatrix4(scaleMatrix);

  renderer.render(scene, camera);
}

