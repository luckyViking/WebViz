import Svm, {polynomial, rbf} from "./svm.js";
import * as assert from "assert";

describe("SVM", () => {
    it("can calculate the output properly", () => {
        let data = [
            [4, 8],
            [2, 7],
        ];
        let labels = [
            +1,
            -1,
        ];
        let svm = new Svm({ X: data, y: labels, C: undefined, tol: 1E-3, kernel: undefined, use_linear_optim: true });
        svm.w = [0.4, 1.0];
        svm.b = 9;

        let outputs = [Math.fround(svm.output(0)), Math.fround(svm.output(1))];
        let expected = [
            Math.fround(4 * 0.4 + 8 - 9),
            Math.fround(2 * 0.4 + 7 - 9),
        ];

        assert.deepStrictEqual(outputs, expected);
        assert.deepEqual(outputs.map(Math.sign), labels);
    });

    it("is able to find correct boundary", () => {
        let data = [
            // label +1
            [4, 8],
            [4, 10],
            [7, 10],
            [8, 7],
            [9, 6],
            [9, 7],
            [10, 10],
            // label -1
            [1, 3],
            [2, 5],
            [2, 7],
            [4, 4],
            [4, 6],
            [7, 5],
            [8, 3],
        ];
        let labels = [
            +1, +1, +1, +1, +1, +1, +1,
            -1, -1, -1, -1, -1, -1, -1,
        ];

        let svm = new Svm({ X: data, y: labels, C: 10, tol: 1E-3, kernel: null, use_linear_optim: true });
        svm.main_routine();

        let output = []
        for (let i = 0; i < data.length; i++) {
            output.push(Math.sign(svm.output(i)));
        }

        assert.deepStrictEqual(output, labels);
    })

    it("is able to use a polynomial kernel", () => {
        let data = [
            // label -1
            [1, 13],
            [1, 18],
            [2, 9],
            [3, 6],
            [6, 3],
            [9, 2],
            [13, 1],
            [18, 1],
            // label +1
            [3, 15],
            [6, 11],
            [6, 6],
            [9, 5],
            [10, 10],
            [11, 5],
            [12, 6],
            [16, 3],
        ];

        let labels = [
            -1, -1, -1, -1, -1, -1, -1, -1,
            +1, +1, +1, +1, +1, +1, +1, +1,
        ];

        let svm = new Svm({ X: data, y: labels, C: 10, tol: 1E-3, kernel: polynomial, use_linear_optim: false });
        svm.main_routine();

        let output = []
        for (let i = 0; i < data.length; i++) {
            output.push(Math.sign(svm.output(i)));
        }

        assert.deepStrictEqual(output, labels);
    });

    it("can use an RBF kernel", () => {
        let data = [
            // label -1
            [6, 5],
            [9, 2],
            [6, 9],
            [13, 4],
            [14, 8],
            [12, 11],
            [10, 13],
            // label +1
            [8, 6],
            [9, 5],
            [11, 5],
            [12, 6],
            [11, 8],
            [8, 8],
            [8, 10],
            [10, 10],
        ];

        let labels = [
            -1, -1, -1, -1, -1, -1, -1,
            +1, +1, +1, +1, +1, +1, +1, +1,
        ];

        let svm = new Svm({ X: data, y: labels, C: 10, tol: 1E-3, kernel: (a, b) => rbf(a, b, 0.1), use_linear_optim: false });
        svm.main_routine();

        let output = []
        for (let i = 0; i < data.length; i++) {
            output.push(Math.sign(svm.output(i)));
        }

        assert.deepStrictEqual(output, labels);
    });
})