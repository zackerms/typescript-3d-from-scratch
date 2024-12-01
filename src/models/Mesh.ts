import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

export class Mesh {
  constructor(
    public vertices: Vector3[],
    public indices: number[][],
    public position: Vector3 = new Vector3(),
    public rotation: Vector3 = new Vector3(),
    public scale: Vector3 = new Vector3(1, 1, 1),
  ) { }

  getWorldMatrix(): Matrix {
    const cx = Math.cos(this.rotation.x);
    const sx = Math.sin(this.rotation.x);
    const cy = Math.cos(this.rotation.y);
    const sy = Math.sin(this.rotation.y);
    const cz = Math.cos(this.rotation.z);
    const sz = Math.sin(this.rotation.z);

    const rotationMatrix = [
      [cy * cz, -cy * sz, sy, 0],
      [sx * sy * cz + cx * sz, -sx * sy * sz + cx * cz, -sx * cy, 0],
      [-cx * sy * cz + sx * sz, cx * sy * sz + sx * cz, cx * cy, 0],
      [0, 0, 0, 1],
    ];

    return new Matrix([
      [rotationMatrix[0][0] * this.scale.x, rotationMatrix[0][1] * this.scale.y, rotationMatrix[0][2] * this.scale.z, this.position.x],
      [rotationMatrix[1][0] * this.scale.x, rotationMatrix[1][1] * this.scale.y, rotationMatrix[1][2] * this.scale.z, this.position.y],
      [rotationMatrix[2][0] * this.scale.x, rotationMatrix[2][1] * this.scale.y, rotationMatrix[2][2] * this.scale.z, this.position.z],
      [0, 0, 0, 1],
    ]);
  }
}
