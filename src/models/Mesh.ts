import { Material } from "./Material";
import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

export interface MeshProperties {
  vertices: Vector3[];
  indices: number[][];
  normals: Vector3[];
  material: Material;
}

export class Mesh {
  public vertices: Vector3[];
  public indices: number[][];
  public normals: Vector3[];
  public position: Vector3 = Vector3.zero();
  public rotation: Vector3 = Vector3.zero();
  public scale: Vector3 = new Vector3({ x: 1, y: 1, z: 1 });
  public material: Material = new Material({});

  constructor(properties: MeshProperties) {
    this.vertices = properties.vertices;
    this.indices = properties.indices;
    this.normals = properties.normals;
    this.material = properties.material;
  }

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
      [
        rotationMatrix[0][0] * this.scale.x,
        rotationMatrix[0][1] * this.scale.y,
        rotationMatrix[0][2] * this.scale.z,
        this.position.x,
      ],
      [
        rotationMatrix[1][0] * this.scale.x,
        rotationMatrix[1][1] * this.scale.y,
        rotationMatrix[1][2] * this.scale.z,
        this.position.y,
      ],
      [
        rotationMatrix[2][0] * this.scale.x,
        rotationMatrix[2][1] * this.scale.y,
        rotationMatrix[2][2] * this.scale.z,
        this.position.z,
      ],
      [0, 0, 0, 1],
    ]);
  }

  // 法線変換行列の計算
  getNormalMatrix(worldMatrix: Matrix) {
    const mtx = worldMatrix.data;
    // 平行移動成分を除去
    return new Matrix([
      [mtx[0][0], mtx[0][1], mtx[0][2], 0],
      [mtx[1][0], mtx[1][1], mtx[1][2], 0],
      [mtx[2][0], mtx[2][1], mtx[2][2], 0],
      [0, 0, 0, 1],
    ]);
  }
}
