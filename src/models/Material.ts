import { Color } from "./Color";

/**
 * @param color - マテリアルの色
 * @param ambient - 環境光の反射率
 * @param diffuse - 拡散反射率
 * @param specular - 鏡面反射率
 * @param shininess - 光沢度
 */
interface MaterialProperties {
  color?: Color;
  ambient?: number;
  diffuse?: number;
  specular?: number;
  shininess?: number;
}

export class Material {
  color: Color;
  ambient: number;
  diffuse: number;
  specular: number;
  shininess: number;

  constructor(properties: MaterialProperties) {
    this.color = properties.color ?? new Color(1, 1, 1);
    this.ambient = properties.ambient ?? 0.1;
    this.diffuse = properties.diffuse ?? 0.7;
    this.specular = properties.specular ?? 0.2;
    this.shininess = properties.shininess ?? 32;
  }
}
