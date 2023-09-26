import * as THREE from "three";

export class AffineTransformations {
  public static createScalingMatrix(sx: number, sy: number, sz: number): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    matrix.set(
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    );
    return matrix;
  }

  public static createRotationMatrix(angle: number): THREE.Matrix4 {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    const matrix = new THREE.Matrix4();
    matrix.set(
      cosTheta, -sinTheta, 0, 0,
      sinTheta, cosTheta, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
    return matrix;
  }

  public static createTranslationMatrix(dx: number, dy: number, dz: number): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    matrix.set(
      1, 0, 0, dx,
      0, 1, 0, dy,
      0, 0, 1, dz,
      0, 0, 0, 1
    );
    return matrix;
  }
}
