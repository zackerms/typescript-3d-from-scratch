import { Matrix } from "./Matrix";
import { Vector3 } from "./Vector3";

describe("Vector3", () => {
  describe("constructor", () => {
    it("should create a vector with default values", () => {
      const v = new Vector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it("should create a vector with specified values", () => {
      const v = new Vector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe("add", () => {
    it("should add two vectors correctly", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = v1.add(v2);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });
  });

  describe("subtract", () => {
    it("should subtract two vectors correctly", () => {
      const v1 = new Vector3(4, 5, 6);
      const v2 = new Vector3(1, 2, 3);
      const result = v1.subtract(v2);
      expect(result.x).toBe(3);
      expect(result.y).toBe(3);
      expect(result.z).toBe(3);
    });
  });

  describe("multiply", () => {
    it("should multiply vector by scalar correctly", () => {
      const v = new Vector3(1, 2, 3);
      const result = v.multiply(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
      expect(result.z).toBe(6);
    });
  });

  describe("dot", () => {
    it("should calculate dot product correctly", () => {
      const v1 = new Vector3(1, 2, 3);
      const v2 = new Vector3(4, 5, 6);
      const result = v1.dot(v2);
      expect(result).toBe(32); // 1*4 + 2*5 + 3*6 = 32
    });
  });

  describe("cross", () => {
    it("should calculate cross product correctly", () => {
      const v1 = new Vector3(1, 0, 0);
      const v2 = new Vector3(0, 1, 0);
      const result = v1.cross(v2);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });
  });

  describe("length", () => {
    it("should calculate vector length correctly", () => {
      const v = new Vector3(3, 4, 0);
      expect(v.length()).toBe(5);
    });
  });

  describe("normalize", () => {
    it("should normalize vector correctly", () => {
      const v = new Vector3(3, 0, 0);
      const result = v.normalize();
      expect(result.x).toBe(1);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });

    it("should handle zero vector correctly", () => {
      const v = new Vector3(0, 0, 0);
      const result = v.normalize();
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(0);
    });
  });

  describe("transform", () => {
    it("should transform vector by 4x4 matrix correctly", () => {
      const v = new Vector3(1, 2, 3);
      const matrix = new Matrix([
        [1, 0, 0, 1], // Translation by (1,1,1)
        [0, 1, 0, 1],
        [0, 0, 1, 1],
        [0, 0, 0, 1],
      ]);
      const result = v.transform(matrix);
      expect(result.x).toBe(2);
      expect(result.y).toBe(3);
      expect(result.z).toBe(4);
    });
  });
});
