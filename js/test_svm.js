import Svm from "./svm.js";
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
})