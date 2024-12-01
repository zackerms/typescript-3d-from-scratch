export class Matrix {
    constructor(public data: number[][]) {
    }

    get size() {
        return this.data.length;
    }

    multiply(matrix: Matrix) {
        const result = new Array(this.size).fill(0).map(() => new Array(matrix.size).fill(0));

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < matrix.size; j++) {
                for (let k = 0; k < this.size; k++) {
                    result[i][j] += this.data[i][k] * matrix.data[k][j];
                }
            }
        }

        return new Matrix(result);
    }
}