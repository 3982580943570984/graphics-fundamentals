import * as THREE from "three";
import { GUIControls } from "./classes/gui-controls";
import { Butterfly } from "./classes/butterfly";

// Initialize lil-gui controls
const guiControls = new GUIControls();
guiControls.setupGUI();

// Initialize Three.js components
const renderer = initRenderer();
function initRenderer(): THREE.WebGLRenderer { //{{{
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.getContext().disable(renderer.getContext().DEPTH_TEST);
  document.body.appendChild(renderer.domElement);
  return renderer;
} //}}}

const camera = initCamera();
function initCamera(): THREE.Camera {//{{{
  const camera = new THREE.Camera();
  camera.position.set(0, 0, 100);

  const fov = 60 * (Math.PI / 180); // Convert FOV to radians
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.001;
  const far = 1000;

  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);

  camera.projectionMatrix.set(
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, 2 * far * near * nf,
    0, 0, -1, 0
  );

  return camera;
}//}}}


const scene = new THREE.Scene();

// Fetch and draw lines
let butterfly = new Butterfly(scene);
butterfly.fetchAndDraw("/butterfly.json");

const create_grid = () => {//{{{
  const size = window.innerHeight / 2;
  const divisions = size / 5;
  const colorCenterLine = new THREE.Color("blue");
  const colorGrid = new THREE.Color("grey");
  const gridHelper = new THREE.GridHelper(
    size,
    divisions,
    colorCenterLine,
    colorGrid,
  );
  gridHelper.rotateX(Math.PI / 2);
  scene.add(gridHelper);
};//}}}
create_grid();

// Animate Scene
animate();
function animate(): void { //{{{
  requestAnimationFrame(animate);

  butterfly.rotation.set(
    guiControls.controls.angleX,
    guiControls.controls.angleY,
    guiControls.controls.angleZ,
  );

  butterfly.position.set(
    guiControls.controls.dX,
    guiControls.controls.dY,
    guiControls.controls.dZ,
  );

  butterfly.scale.set(
    guiControls.controls.scaleX,
    guiControls.controls.scaleY,
    guiControls.controls.scaleZ,
  );

  renderer.render(scene, camera);
} //}}}
