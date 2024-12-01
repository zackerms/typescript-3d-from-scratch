import { Camera } from "./Camera";
import { Mesh } from "./Mesh";
import { Vector3 } from "./Vector3";

export class Renderer {
  private depthBuffer: Float32Array;
  public isWireframe: boolean;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    private clearColor: string = "#000000",
  ) {
    this.depthBuffer = new Float32Array(this.width * this.height).fill(Infinity);
    this.isWireframe = false;
  }

  clear() {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawPoint(x: number, y: number, color: string = "#ffffff") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
  }

  // スクリーン座標変換
  projectPoint(point: Vector3) {
    return new Vector3(((point.x + 1) * this.width) / 2, ((1 - point.y) * this.height) / 2, point.z);
  }

  // 三角形の描画
  drawTriangle(p1: Vector3, p2: Vector3, p3: Vector3, color: string = "#ffffff") {
    // 画面外カリング
    if (Math.max(p1.x, p2.x, p3.x) < 0 || Math.min(p1.x, p2.x, p3.x) >= this.width || Math.max(p1.y, p2.y, p3.y) < 0 || Math.min(p1.y, p2.y, p3.y) >= this.height) {
      return;
    }

    // ワイヤーフレームモードで描画（デバッグ用）
    if (this.isWireframe) {
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.closePath();
      this.ctx.stroke();
      return;
    }

    // 三角形を囲む矩形の範囲を計算
    const minX = Math.max(Math.min(p1.x, p2.x, p3.x), 0);
    const maxX = Math.min(Math.max(p1.x, p2.x, p3.x), this.width - 1);
    const minY = Math.max(Math.min(p1.y, p2.y, p3.y), 0);
    const maxY = Math.min(Math.max(p1.y, p2.y, p3.y), this.height - 1);

    // 三角形の内部のピクセルを描画
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const p = { x: x + 0.5, y: y + 0.5 }; // ピクセルの中心

        // エッジ関数を使用してピクセルが三角形の内部にあるかを判定
        // エッジ関数：三角形を画面上のピクセルに変換する関数
        // (x1, y1), (x2, y2) はエッジの端点
        // edge(x, y) = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
        // 性質
        //      点が線分の左側にある場合: edge(x, y) > 0
        //      点が線分の右側にある場合: edge(x, y) < 0
        //      点が線分上にある場合: edge(x, y) = 0
        const e1 = (p.x - p2.x) * (p1.y - p2.y) - (p.y - p2.y) * (p1.x - p2.x);
        const e2 = (p.x - p3.x) * (p2.y - p3.y) - (p.y - p3.y) * (p2.x - p3.x);
        const e3 = (p.x - p1.x) * (p3.y - p1.y) - (p.y - p1.y) * (p3.x - p1.x);

        // 全てのエッジ関数が同じ符号なら、ピクセルは三角形の内部
        if ((e1 >= 0 && e2 >= 0 && e3 >= 0) || (e1 <= 0 && e2 <= 0 && e3 <= 0)) {
          // 深度値の補間
          const area = Math.abs((p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y));
          const w1 = Math.abs((p.x - p2.x) * (p3.y - p2.y) - (p3.x - p2.x) * (p.y - p2.y)) / area;
          const w2 = Math.abs((p.x - p3.x) * (p1.y - p3.y) - (p1.x - p3.x) * (p.y - p3.y)) / area;
          const w3 = 1 - w1 - w2;

          const depth = w1 * p1.z + w2 * p2.z + w3 * p3.z;
          const index = Math.floor(y + x * this.height);

          // 深度テスト
          if (depth < this.depthBuffer[index]) {
            this.depthBuffer[index] = depth;
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  // メッシュの描画
  renderMesh(mesh: Mesh, camera: Camera, color: string = "#ffffff") {
    const worldMatrix = mesh.getWorldMatrix();
    const viewMatrix = camera.getViewMatrix();
    const projectionMatrix = camera.getProjectionMatrix();

    // 変換行列の合成
    const transformMatrix = projectionMatrix.multiply(viewMatrix).multiply(worldMatrix);

    // 各面を描画
    for (const indices of mesh.indices) {
      // 頂点の変換
      const v1 = mesh.vertices[indices[0]].transform(transformMatrix);
      const v2 = mesh.vertices[indices[1]].transform(transformMatrix);
      const v3 = mesh.vertices[indices[2]].transform(transformMatrix);

      // 背面カリング（簡易的な実装）
      const normal = v2.subtract(v1).cross(v3.subtract(v1));
      if (normal.z < 0) {
        // スクリーン座標に変換して描画
        const p1 = this.projectPoint(v1);
        const p2 = this.projectPoint(v2);
        const p3 = this.projectPoint(v3);
        this.drawTriangle(p1, p2, p3, color);
      }
    }
  }
}
