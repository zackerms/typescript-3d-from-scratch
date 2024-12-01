import { Matrix } from "./Matrix";

describe('Matrix', () => {
    describe('multiply', () => {
        it('should multiply two 4x4 matrices correctly', () => {
            const m1 = new Matrix([
                [1, 0, 0, 1],
                [0, 1, 0, 2],
                [0, 0, 1, 3],
                [0, 0, 0, 1]
            ]);
            const m2 = new Matrix([
                [1, 0, 0, 4],
                [0, 1, 0, 5],
                [0, 0, 1, 6],
                [0, 0, 0, 1]
            ]);
            const result = m1.multiply(m2);
            expect(result.data).toEqual([
                [1, 0, 0, 5],
                [0, 1, 0, 7],
                [0, 0, 1, 9],
                [0, 0, 0, 1]
            ]);
        });

        it('should handle identity matrix multiplication', () => {
            const identity = new Matrix([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
            const m = new Matrix([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16]
            ]);
            const result = m.multiply(identity);
            expect(result.data).toEqual(m.data);
        });
    });
});