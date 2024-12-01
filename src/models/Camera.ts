import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

export interface CameraParams {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export class Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor(params: CameraParams) {
    this.position = params.position;
    this.target = params.target;
    this.up = params.up;
    this.fov = params.fov ?? 60;
    this.aspect = params.aspect ?? 1;
    this.near = params.near ?? 0.1;
    this.far = params.far ?? 100;
  }

  // ビュー行列の計算
  getViewMatrix(): Matrix {
    const zAxis = this.position.subtract(this.target).normalize();
    const xAxis = this.up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis);

    return new Matrix([
      [xAxis.x, xAxis.y, xAxis.z, -xAxis.dot(this.position)],
      [yAxis.x, yAxis.y, yAxis.z, -yAxis.dot(this.position)],
      [zAxis.x, zAxis.y, zAxis.z, -zAxis.dot(this.position)],
      [0, 0, 0, 1],
    ]);
  }

  // 透視投影行列の計算
  getProjectionMatrix(): Matrix {
    const fovRad = (this.fov * Math.PI) / 180;
    const f = 1 / Math.tan(fovRad / 2);
    const rangeInv = 1 / (this.near - this.far);

    return new Matrix([
      [f / this.aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (this.near + this.far) * rangeInv, 2 * this.near * this.far * rangeInv],
      [0, 0, -1, 0],
    ]);
  }
}
