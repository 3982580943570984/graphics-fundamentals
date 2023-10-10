import * as THREE from "three";
import { Butterfly } from "./classes/butterfly";
import { GUIControls } from "./classes/gui-controls";

// Initialize lil-gui controls
const guiControls = new GUIControls();
guiControls.setupGUI();

// Initialize Three.js components
const renderer = initRenderer();
function initRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

const camera = initCamera();
function initCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
  return camera;
}

const scene = new THREE.Scene();

const pointLight = new THREE.PointLight(0xffffff, 1000, 1000);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1000, 1000);
pointLight1.position.set(-10, -10, -10);
scene.add(pointLight1);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const pointLightHelper1 = new THREE.PointLightHelper(pointLight1);
scene.add(pointLightHelper1);

// Fetch and draw lines
let butterfly = new Butterfly(scene);
butterfly.setPoints("/butterfly.json");
// butterfly.draw();

// Animate Scene
animate();

function animate(): void {
  requestAnimationFrame(animate);

  // pointLight.rotateY((0.3 * Math.PI) / 180);
  // butterfly.rotateX((0.3 * Math.PI) / 180);
  // butterfly.rotateY((0.3 * Math.PI) / 180);
  // butterfly.rotateZ((0.3 * Math.PI) / 180);

  butterfly.rotation.set(
    guiControls.controls.angleX,
    guiControls.controls.angleY,
    guiControls.controls.angleZ
  );

  butterfly.position.set(
    guiControls.controls.dX,
    guiControls.controls.dY,
    guiControls.controls.dZ
  );

  butterfly.scale.set(
    guiControls.controls.scaleX,
    guiControls.controls.scaleY,
    guiControls.controls.scaleZ
  );

  renderer.render(scene, camera);
}
