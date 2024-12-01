import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

export class Mesh {
  constructor(
    public vertices: Vector3[],
    public indices: number[][],
    public position: Vector3 = new Vector3(),
    public rotation: Vector3 = new Vector3(),
    public scale: Vector3 = new Vector3(1, 1, 1),
  ) {}

  getWorldMatrix(): Matrix {
    // 簡略化のため、Y軸周りの回転のみ実装
    const cosY = Math.cos(this.rotation.y);
    const sinY = Math.sin(this.rotation.y);

    return new Matrix([
      [cosY * this.scale.x, 0, sinY * this.scale.z, this.position.x],
      [0, this.scale.y, 0, this.position.y],
      [-sinY * this.scale.x, 0, cosY * this.scale.z, this.position.z],
      [0, 0, 0, 1],
    ]);
  }
}
