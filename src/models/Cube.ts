import { Material } from "./Material";
import { Mesh } from "./Mesh";
import { Vector3 } from "./Vector3";

export class Cube extends Mesh {
  constructor({ material = new Material({}) }: { material?: Material }) {
    const vertices = [
      new Vector3({ x: -1, y: -1, z: -1 }), // 0
      new Vector3({ x: 1, y: -1, z: -1 }), // 1
      new Vector3({ x: 1, y: 1, z: -1 }), // 2
      new Vector3({ x: -1, y: 1, z: -1 }), // 3
      new Vector3({ x: -1, y: -1, z: 1 }), // 4
      new Vector3({ x: 1, y: -1, z: 1 }), // 5
      new Vector3({ x: 1, y: 1, z: 1 }), // 6
      new Vector3({ x: -1, y: 1, z: 1 }), // 7
    ];

    const indices = [
      [0, 1, 2],
      [0, 2, 3], // 前面
      [5, 4, 7],
      [5, 7, 6], // 背面
      [3, 2, 6],
      [3, 6, 7], // 上面
      [4, 5, 1],
      [4, 1, 0], // 底面
      [1, 5, 6],
      [1, 6, 2], // 右面
      [4, 0, 3],
      [4, 3, 7], // 左面
    ];

    // 各頂点の法線を計算
    const normals = vertices.map(
      (vertex) => vertex.normalize(), // 中心からの方向を法線として使用
    );

    super({
      vertices,
      indices,
      normals,
      material,
    });
  }
}
