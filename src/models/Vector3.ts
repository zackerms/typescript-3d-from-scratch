import { Matrix } from "./Matrix";

export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor({ x = 0, y = 0, z = 0 }: { x?: number; y?: number; z?: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero() {
    return new Vector3({
      x: 0,
      y: 0,
      z: 0,
    });
  }

  add(v: Vector3) {
    return new Vector3({
      x: this.x + v.x,
      y: this.y + v.y,
      z: this.z + v.z,
    });
  }

  subtract(v: Vector3) {
    return new Vector3({
      x: this.x - v.x,
      y: this.y - v.y,
      z: this.z - v.z,
    });
  }

  multiply(scalar: number) {
    return new Vector3({
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
    });
  }

  dot(v: Vector3) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3) {
    return new Vector3({
      x: this.y * v.z - this.z * v.y,
      y: this.z * v.x - this.x * v.z,
      z: this.x * v.y - this.y * v.x,
    });
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  normalize() {
    const len = this.length();
    if (len === 0) return Vector3.zero();
    return this.multiply(1 / len);
  }

  // ベクトルに行列を適用 A * v
  transform(matrix: Matrix) {
    const mtx = matrix.data;
    const w =
      mtx[3][0] * this.x + mtx[3][1] * this.y + mtx[3][2] * this.z + mtx[3][3];
    const newX =
      (mtx[0][0] * this.x +
        mtx[0][1] * this.y +
        mtx[0][2] * this.z +
        mtx[0][3]) /
      w;
    const newY =
      (mtx[1][0] * this.x +
        mtx[1][1] * this.y +
        mtx[1][2] * this.z +
        mtx[1][3]) /
      w;
    const newZ =
      (mtx[2][0] * this.x +
        mtx[2][1] * this.y +
        mtx[2][2] * this.z +
        mtx[2][3]) /
      w;
    return new Vector3({
      x: newX,
      y: newY,
      z: newZ,
    });
  }
}
