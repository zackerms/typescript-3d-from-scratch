import { Camera } from "./Camera";
import { Color } from "./Color";
import { Light } from "./Light";
import { Material } from "./Material";
import { Mesh } from "./Mesh";
import { Vector3 } from "./Vector3";

export class Renderer {
  private depthBuffer: Float32Array;
  public isWireframe: boolean;

  private static EPSILON = 0.00001;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number,
    private clearColor: string = "#000000",
  ) {
    this.depthBuffer = new Float32Array(this.width * this.height).fill(
      Infinity,
    );
    this.isWireframe = false;
  }

  clear() {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.depthBuffer.fill(Infinity);
  }

  drawPoint(x: number, y: number, color: string = "#ffffff") {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
  }

  // スクリーン座標変換
  projectPoint(point: Vector3) {
    return new Vector3({
      x: ((point.x + 1) * this.width) / 2,
      y: ((1 - point.y) * this.height) / 2,
      z: point.z,
    });
  }

  calculateLighting({
    point,
    normal,
    viewDirection,
    material,
    lights,
  }: {
    point: Vector3;
    normal: Vector3;
    viewDirection: Vector3;
    material: Material;
    lights: Light[];
  }) {
    let finalColor = new Color(0, 0, 0);

    // 環境光
    const ambientColor = material.color.multiply(material.ambient);
    finalColor = finalColor.add(ambientColor);

    for (const light of lights) {
      const lightVector = light.position.subtract(point);
      const distance = lightVector.length();
      const lightDir = lightVector.normalize();

      // 距離に応じた減衰
      const attenuation = 1.0 / (1.0 + Math.pow(distance / light.range, 2));

      // 拡散反射光
      const diffuseFactor = Math.max(normal.dot(lightDir), 0);
      const diffuseColor = material.color.multiply(
        material.diffuse * diffuseFactor,
      );

      // 鏡面反射光
      const reflectionDir = normal
        .multiply(normal.dot(lightDir) * 2)
        .subtract(lightDir)
        .normalize();
      const specularFactor = Math.pow(
        Math.max(reflectionDir.dot(viewDirection), 0),
        material.shininess,
      );
      const specularColor = light.color.multiply(
        material.specular * specularFactor,
      );

      // color = ambient + diffuse * intensity + specular * intensity
      finalColor = finalColor.add(
        diffuseColor
          .multiply(light.intensity * attenuation)
          .add(specularColor.multiply(light.intensity * attenuation)),
      );
    }

    return new Color(
      Math.min(finalColor.r, 1),
      Math.min(finalColor.g, 1),
      Math.min(finalColor.b, 1),
    );
  }

  // 三角形の描画
  drawTriangle({
    p1,
    p2,
    p3,
    n1,
    n2,
    n3,
    worldPos1,
    worldPos2,
    worldPos3,
    material,
    lights,
    camera,
  }: {
    p1: Vector3;
    p2: Vector3;
    p3: Vector3;
    n1: Vector3;
    n2: Vector3;
    n3: Vector3;
    worldPos1: Vector3;
    worldPos2: Vector3;
    worldPos3: Vector3;
    material: Material;
    lights: Light[];
    camera: Camera;
  }) {
    // 画面外カリング
    if (
      Math.max(p1.x, p2.x, p3.x) < 0 ||
      Math.min(p1.x, p2.x, p3.x) >= this.width ||
      Math.max(p1.y, p2.y, p3.y) < 0 ||
      Math.min(p1.y, p2.y, p3.y) >= this.height
    ) {
      return;
    }

    // ワイヤーフレームモードで描画（デバッグ用）
    if (this.isWireframe) {
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(p3.x, p3.y);
      this.ctx.closePath();
      this.ctx.stroke();
      return;
    }

    // 三角形を囲む矩形の範囲を計算
    const minX = Math.floor(Math.max(Math.min(p1.x, p2.x, p3.x), 0));
    const maxX = Math.ceil(
      Math.min(Math.max(p1.x, p2.x, p3.x), this.width - 1),
    );
    const minY = Math.floor(Math.max(Math.min(p1.y, p2.y, p3.y), 0));
    const maxY = Math.ceil(
      Math.min(Math.max(p1.y, p2.y, p3.y), this.height - 1),
    );

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
        if (
          (e1 >= -Renderer.EPSILON &&
            e2 >= -Renderer.EPSILON &&
            e3 >= -Renderer.EPSILON) ||
          (e1 <= Renderer.EPSILON &&
            e2 <= Renderer.EPSILON &&
            e3 <= Renderer.EPSILON)
        ) {
          // 深度値(各ピクセルがカメラからどれだけ離れているか)の補間
          const area = Math.abs(
            (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y),
          );
          const w1 =
            Math.abs(
              (p.x - p2.x) * (p3.y - p2.y) - (p3.x - p2.x) * (p.y - p2.y),
            ) / area;
          const w2 =
            Math.abs(
              (p.x - p3.x) * (p1.y - p3.y) - (p1.x - p3.x) * (p.y - p3.y),
            ) / area;
          const w3 = 1 - w1 - w2;

          const depth = w1 * p1.z + w2 * p2.z + w3 * p3.z;
          const index = y * Math.round(this.width) + x;

          // 深度テスト（現在の深度値と比較して手前にある場合のみ描画）
          if (depth < this.depthBuffer[index]) {
            this.depthBuffer[index] = depth;

            // 法線の補間
            const normal = new Vector3({
              x: w1 * n1.x + w2 * n2.x + w3 * n3.x,
              y: w1 * n1.y + w2 * n2.y + w3 * n3.y,
              z: w1 * n1.z + w2 * n2.z + w3 * n3.z,
            }).normalize();

            // ワールド座標の補間
            const worldPos = new Vector3({
              x: w1 * worldPos1.x + w2 * worldPos2.x + w3 * worldPos3.x,
              y: w1 * worldPos1.y + w2 * worldPos2.y + w3 * worldPos3.y,
              z: w1 * worldPos1.z + w2 * worldPos2.z + w3 * worldPos3.z,
            });

            // カメラへの方向ベクトル
            const viewDirection = camera.position
              .subtract(worldPos)
              .normalize();

            // ライティング計算
            const color = this.calculateLighting({
              point: worldPos,
              normal,
              viewDirection,
              material,
              lights,
            });

            this.ctx.fillStyle = color.toHex();
            this.ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  // メッシュの描画
  renderMesh({
    mesh,
    camera,
    lights,
  }: {
    mesh: Mesh;
    camera: Camera;
    lights: Light[];
  }) {
    const worldMatrix = mesh.getWorldMatrix();
    const viewMatrix = camera.getViewMatrix();
    const projectionMatrix = camera.getProjectionMatrix();
    const normalMatrix = mesh.getNormalMatrix(worldMatrix);

    // 変換行列の合成
    const transformMatrix = projectionMatrix
      .multiply(viewMatrix)
      .multiply(worldMatrix);

    // 各面を描画
    for (const indices of mesh.indices) {
      // 頂点の変換
      const v1 = mesh.vertices[indices[0]].transform(transformMatrix);
      const v2 = mesh.vertices[indices[1]].transform(transformMatrix);
      const v3 = mesh.vertices[indices[2]].transform(transformMatrix);

      // クリップ空間への変換
      const clipPos1 = v1.transform(transformMatrix);
      const clipPos2 = v2.transform(transformMatrix);
      const clipPos3 = v3.transform(transformMatrix);

      // 背面カリング: 視点から見えない面（裏面）を描画から除外する処理
      const edge1 = clipPos2.subtract(clipPos1);
      const edge2 = clipPos3.subtract(clipPos1);
      const normal = edge1.cross(edge2);
      if (normal.z < Renderer.EPSILON) {
        // スクリーン座標に変換して描画
        const p1 = this.projectPoint(v1);
        const p2 = this.projectPoint(v2);
        const p3 = this.projectPoint(v3);

        // ワールド座標での頂点位置
        const worldPos1 = v1.transform(worldMatrix);
        const worldPos2 = v2.transform(worldMatrix);
        const worldPos3 = v3.transform(worldMatrix);

        const n1 = mesh.normals[indices[0]].transform(normalMatrix);
        const n2 = mesh.normals[indices[1]].transform(normalMatrix);
        const n3 = mesh.normals[indices[2]].transform(normalMatrix);

        this.drawTriangle({
          p1,
          p2,
          p3,
          n1,
          n2,
          n3,
          worldPos1,
          worldPos2,
          worldPos3,
          camera,
          material: mesh.material,
          lights,
        });
      }
    }
  }
}
