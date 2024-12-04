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

    // 表面を反時計回りに定義(OpenGL準拠)
    const indices = [
      // 前面 (-Z方向)
      [0, 2, 1],
      [0, 3, 2],

      // 背面 (+Z方向)
      [5, 7, 4],
      [5, 6, 7],

      // 上面 (+Y方向)
      [3, 6, 2],
      [3, 7, 6],

      // 底面 (-Y方向)
      [4, 1, 5],
      [4, 0, 1],

      // 右面 (+X方向)
      [1, 6, 5],
      [1, 2, 6],

      // 左面 (-X方向)
      [4, 3, 0],
      [4, 7, 3],
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
