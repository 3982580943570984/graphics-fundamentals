import * as THREE from "three";

export class Butterfly extends THREE.Mesh {
  private _points: THREE.Vector2[] = [];

  constructor(private _scene: THREE.Scene) {
    super();
    this.geometry.dispose();
  }

  public setPoints(filePath: string): void {
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => {
        this._points = data.map(
          (point: { x: number; y: number }) =>
            new THREE.Vector2(point.x, point.y)
        );
        this.draw();
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }

  public draw() {
    const shape = new THREE.Shape(this._points);
    const extrudeSettings = {
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2,
    };

    this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xdb4b9f,
      specular: 0x222222,
      shininess: 30,
      side: THREE.DoubleSide,
    });

    this._scene.add(this);
  }
}
