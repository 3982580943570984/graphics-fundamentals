import * as THREE from "three";
import { AffineTransformations } from "./utils/affine-transformations";
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
  document.body.appendChild(renderer.domElement);
  return renderer;
} //}}}

const camera = initCamera();
function initCamera(): THREE.PerspectiveCamera { //{{{
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 100);
  return camera;
} //}}}

const scene = new THREE.Scene();

// Fetch and draw lines
let butterfly = new Butterfly(scene);
butterfly.fetchAndDraw("/butterfly.json");

// Animate Scene
animate();

function animate(): void { //{{{
  requestAnimationFrame(animate);

  butterfly.matrix.identity();
  butterfly.matrixWorldNeedsUpdate = true;

  const xRotationMatrix = AffineTransformations.createXRotationMatrix(
    guiControls.controls.angleX,
  );
  const yRotationMatrix = AffineTransformations.createYRotationMatrix(
    guiControls.controls.angleY,
  );
  const zRotationMatrix = AffineTransformations.createZRotationMatrix(
    guiControls.controls.angleZ,
  );
  const translationMatrix = AffineTransformations.createTranslationMatrix(
    guiControls.controls.dX,
    guiControls.controls.dY,
    guiControls.controls.dZ,
  );
  const scaleMatrix = AffineTransformations.createScalingMatrix(
    guiControls.controls.scaleX,
    guiControls.controls.scaleY,
    guiControls.controls.scaleZ,
  );

  butterfly.applyMatrix4(xRotationMatrix);
  butterfly.applyMatrix4(yRotationMatrix);
  butterfly.applyMatrix4(zRotationMatrix);
  butterfly.applyMatrix4(translationMatrix);
  butterfly.applyMatrix4(scaleMatrix);

  renderer.render(scene, camera);
} //}}}
