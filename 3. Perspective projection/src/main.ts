import * as THREE from "three";
import { GUIControls } from "./classes/gui-controls";
import { Butterfly } from "./classes/butterfly";

// Initialize lil-gui controls
const guiControls = new GUIControls();
guiControls.setupGUI();

// Initialize Three.js components
const renderer = initRenderer();
function initRenderer(): THREE.WebGLRenderer {
  //{{{
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.getContext().disable(renderer.getContext().DEPTH_TEST);
  document.body.appendChild(renderer.domElement);
  return renderer;
} //}}}

const camera = initCamera();
function initCamera(): THREE.Camera {
  //{{{
  const fov = 55; // угол обзора в градусах
  const aspect = window.innerWidth / window.innerHeight; // соотношение сторон
  const near = 0.1; // ближняя плоскость отсечения
  const far = 2000; // дальняя плоскость отсечения

  const top = -near * Math.tan((0.5 * fov * Math.PI) / 180);
  const bottom = -top;
  const left = aspect * bottom;
  const right = aspect * top;

  const perspectiveMatrix = new THREE.Matrix4().makePerspective(
    left,
    right,
    bottom,
    top,
    near,
    far
  );

  const camera = new THREE.Camera();
  camera.projectionMatrix = perspectiveMatrix;
  camera.position.set(0, 0, 50);
  return camera;
} //}}}

const scene = new THREE.Scene();

// Fetch and draw lines
let butterfly = new Butterfly(scene);
butterfly.fetchAndDraw("/butterfly.json");

const size = window.innerHeight / 2;
const divisions = size / 5;
const colorCenterLine = new THREE.Color("blue");
const colorGrid = new THREE.Color("grey");
const gridHelper = new THREE.GridHelper(
  size,
  divisions,
  colorCenterLine,
  colorGrid
);
gridHelper.rotateX(Math.PI / 2);
scene.add(gridHelper);

// Animate Scene
animate();

function animate(): void {
  //{{{
  requestAnimationFrame(animate);

  // ��������� ����� ��������
  butterfly.rotation.set(
    guiControls.controls.angleX,
    guiControls.controls.angleY,
    guiControls.controls.angleZ
  );

  // ��������� ������� �����������
  butterfly.position.set(
    guiControls.controls.dX,
    guiControls.controls.dY,
    guiControls.controls.dZ
  );

  // ��������� ��������
  butterfly.scale.set(
    guiControls.controls.scaleX,
    guiControls.controls.scaleY,
    guiControls.controls.scaleZ
  );

  renderer.render(scene, camera);
} //}}}
