import { Color } from "./Color";
import { Vector3 } from "./Vector3";

export interface LightProperties {
  position: Vector3;
  color: Color;
  intensity: number;
}

export class Light {
  position: Vector3;
  color: Color;
  intensity: number;

  constructor(properties: LightProperties) {
    this.position = properties.position;
    this.color = properties.color;
    this.intensity = properties.intensity;
  }
}
