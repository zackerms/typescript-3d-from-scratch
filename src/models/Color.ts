export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = Math.min(1, Math.max(0, r));
    this.g = Math.min(1, Math.max(0, g));
    this.b = Math.min(1, Math.max(0, b));
  }

  multiply(scalar: number) {
    return new Color(this.r * scalar, this.g * scalar, this.b * scalar);
  }

  add(color: Color) {
    return new Color(
      Math.min(1, this.r + color.r),
      Math.min(1, this.g + color.g),
      Math.min(1, this.b + color.b),
    );
  }

  toHex() {
    const r = Math.floor(this.r * 255);
    const g = Math.floor(this.g * 255);
    const b = Math.floor(this.b * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
}
