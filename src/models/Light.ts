import { Color } from "./Color";
import { Vector3 } from "./Vector3";

export interface LightProperties {
  position: Vector3;
  color: Color;
  intensity: number;
  range?: number;
}

export class Light {
  position: Vector3;
  color: Color;
  intensity: number;
  range: number

  constructor(properties: LightProperties) {
    this.position = properties.position;
    this.color = properties.color;
    this.intensity = properties.intensity;
    this.range = properties.range ?? 20;
  }
}
