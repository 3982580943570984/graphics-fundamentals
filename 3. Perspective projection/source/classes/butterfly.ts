import * as THREE from "three";

export class Butterfly extends THREE.Line {
  private _scene: THREE.Scene;
  private _points: THREE.Vector3[] = [];

  constructor(
    //{{{
    scene: THREE.Scene,
    geometry?: THREE.BufferGeometry,
    material?: THREE.Material | THREE.Material[]
  ) {
    super(geometry, material);
    this._scene = scene;
  } //}}}

  public fetchAndDraw(filePath: string): void {
    //{{{
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => {
        const originalPathPoints = this.createOriginalPathPoints(data);
        const shiftedPathPoints = this.createShiftedPathPoints(data);

        this._points = [...originalPathPoints, ...shiftedPathPoints];

        this.drawButterflyPath();
      })
      .catch((error) => console.error("Error loading JSON:", error));
  } //}}}

  private createOriginalPathPoints(data: any[]): THREE.Vector3[] {
    //{{{
    const points = data.flatMap((point) => [
      new THREE.Vector3(point.x, point.y, point.z),
      new THREE.Vector3(point.x, point.y, 1),
      new THREE.Vector3(point.x, point.y, point.z),
    ]);

    // Удалить последний элемент
    return points.slice(0, -1);
  } //}}}

  private createShiftedPathPoints(data: any[]): THREE.Vector3[] {
    //{{{
    return data.map((point) => new THREE.Vector3(point.x, point.y, 1));
  } //}}}

  private drawButterflyPath(): void {
    //{{{
    this.geometry = new THREE.BufferGeometry().setFromPoints(this._points);
    this.material = new THREE.LineBasicMaterial({ color: "white" });
    this._scene.add(this);
  } //}}}
}
