import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

/**
 * カメラクラス
 * 
 */
export class Camera {
    /**
     * 
     * @param position カメラの位置
     * @param target カメラの注視点
     * @param up カメラの上方向
     * @param fov 視覚角 
     * @param aspect アスペクト比
     * @param near ニアクリップ面
     * @param far ファークリップ面
     */
    constructor(
        private position: Vector3, 
        private target: Vector3, 
        private up: Vector3,
        private fov: number = 60,
        public aspect: number = 1,
        private near: number = 0.1,
        private far: number = 1000
    ) {
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
            [0, 0, 0, 1]
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
            [0, 0, -1, 0]
        ]);
    }
}
