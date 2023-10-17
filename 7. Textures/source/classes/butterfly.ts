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

    const textureLoader = new THREE.TextureLoader();

    const furBaseColor = textureLoader.load(
      "../../assets/Stylized_Fur_002_basecolor.jpg"
    );
    furBaseColor.wrapS = THREE.RepeatWrapping;
    furBaseColor.wrapT = THREE.RepeatWrapping;
    furBaseColor.repeat.set(0.1, 0.1);

    const furNormalMap = textureLoader.load(
      "../../assets/Stylized_Fur_002_normal.jpg"
    );
    furNormalMap.wrapS = THREE.RepeatWrapping;
    furNormalMap.wrapT = THREE.RepeatWrapping;
    furNormalMap.repeat.set(0.1, 0.1);

    const furHeightMap = textureLoader.load(
      "../../assets/Stylized_Fur_002_height.png"
    );
    furHeightMap.wrapS = THREE.RepeatWrapping;
    furHeightMap.wrapT = THREE.RepeatWrapping;
    furHeightMap.repeat.set(0.1, 0.1);

    const furRoughnessMap = textureLoader.load(
      "../../assets/Stylized_Fur_002_roughness.jpg"
    );
    const furAmbientOcclusionMap = textureLoader.load(
      "../../assets/Stylized_Fur_002_ambientOcclusion.jpg"
    );
    furAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    furAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    furAmbientOcclusionMap.repeat.set(0.1, 0.1);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xdb4b9f,
      specular: 0x222222,
      shininess: 300,

      map: furBaseColor,
      normalMap: furNormalMap,
      displacementMap: furHeightMap,
      // roughnessMap: furRoughnessMap,
      aoMap: furAmbientOcclusionMap,
    });

    this._scene.add(this);
  }
}
