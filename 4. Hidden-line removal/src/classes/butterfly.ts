import * as THREE from "three";

export class Butterfly extends THREE.Line {
  private _scene: THREE.Scene;

  constructor( //{{{
    scene: THREE.Scene,
    geometry?: THREE.BufferGeometry,
    material?: THREE.Material | THREE.Material[],
  ) {
    super(geometry, material);
    this._scene = scene;
  } //}}}

  fetchAndDraw(filePath: string): void { //{{{
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => {
        this.drawButterflyPath(data);
        this.matrixAutoUpdate = false;
      })
      .catch((error) => console.error("Error loading JSON:", error));
  } //}}}

  private drawButterflyPath( //{{{
    jsonData: { x: number; y: number; z: number }[],
  ): void {
    let originalPathPoints: THREE.Vector3[] = jsonData.flatMap((point) => [
      new THREE.Vector3(point.x, point.y, point.z),
      new THREE.Vector3(point.x, point.y, -2),
      new THREE.Vector3(point.x, point.y, point.z),
    ]);

    // remove last entry
    originalPathPoints = originalPathPoints.slice(0, -1);

    let shiftedPathPoints: THREE.Vector3[] = jsonData.map((point) => {
      return new THREE.Vector3(point.x, point.y, -2);
    });

    this.geometry = new THREE.BufferGeometry().setFromPoints(
      originalPathPoints.concat(shiftedPathPoints),
    );
    this.material = new THREE.LineBasicMaterial({ color: "white" });

    this._scene.add(this);
  } //}}}
}
