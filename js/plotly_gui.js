/*
function IrisShapesPlotly(svm, dataset, kernel, epsilon){
    // Read and process data.
    Plotly.d3.csv('../data/iris.csv', function (data) {
        processData(data, svm, kernel, epsilon);
    });
}
*/

function loadPlotly(svm, dataset, kernel, epsilon, C) {
    //  Process user input.
    switch (dataset) {
        case 'salmon' :
            var dataPath = '../data/salmon.csv';
            var Xcols = ['length', 'diameter'];
            var axisTitles = ['Length', 'Diameter'];
            var ycol = 'young';
            var target = '1';
            break;
        default:
            var dataPath = '../data/iris.csv';
            var Xcols = ['sepal_length', 'sepal_width'];
            var axisTitles = ['Sepal length', 'Sepal width'];
            var ycol = 'species';
            var target = 'setosa';
            break;
    }

    switch (kernel) {
        case 'polynomial':
            var svmKernel = svm.polynomial;
            break;
        default:
            var svmKernel = svm.inner;
            break;
    }

    // Start.
    Plotly.d3.csv(dataPath, function (data) {
        processData(data, Xcols, ycol, target, svm, svmKernel, epsilon, C, axisTitles);
    });
}


function linspace(min, max, N = 100) {
    domain = max - min;
    lin = [];
    d = domain / (N - 1);

    for (let i = 0; i < N; i++) {
        current = min + (i * d);
        lin.push(current)
    }
    return lin;
}

function sigmoid(x) {
    x = (Math.exp(x)) / (Math.exp(x) + 1);
    return x;
}


function StringArray2FloatArray(StringArray) {
    var FloatArray = [];
    var ArrayLength = StringArray.length;
    for (var i = 0; i < ArrayLength; i++) {
        FloatArray.push(parseFloat(StringArray[i]));
    }
    return FloatArray;
}

function processData(data, Xcols, ycol, target, svm, kernel, epsilon, C, axisTitles) {
     //Do SVM stuff here! See: gui.js
    let [svm_X, svm_y] = svm.recordsDataToSvmData(data, Xcols, ycol, target);
    let s = new svm.default({
        X: svm_X,
        y: svm_y,
        C: C,
        tol: epsilon,
        kernel: kernel,
        use_linear_optim: true,
    });
    s.main_routine();
    console.log(s)

    // Define axis from data.
    function unpack(rows, key) {
        return rows.map(function (row) {
            // return float
            return row[key];
        });
    }

    var x = StringArray2FloatArray(unpack(data, Xcols[0]));
    var y = StringArray2FloatArray(unpack(data, Xcols[1]));
    var labels = unpack(data, ycol);
    var cNumeric = [];

    /*
    for (var n = 0; n < c.length; n++) {
        if (c[n] === 'setosa') {
            cNumeric.push(0);
        }
        if (c[n] === 'versicolor') {
            cNumeric.push(1);
        }
        if (c[n] === 'virginica') {
            cNumeric.push(2);
        }
    }*/

    // Define limits of axis.
    var x_min = Math.min.apply(null, x.filter(function (n) {
        return !isNaN(n);
    }));
    var x_max = Math.max.apply(null, x.filter(function (n) {
        return !isNaN(n);
    }));
    var y_min = Math.min.apply(null, y.filter(function (n) {
        return !isNaN(n);
    }));
    var y_max = Math.max.apply(null, y.filter(function (n) {
        return !isNaN(n);
    }));


    // Data of the contour.
    var linX = linspace(x_min, x_max);
    var linY = linspace(y_min, y_max);
    var z = [], tmp = [];
    for (var n = 0; n < linX.length; n++) {
        for (var p = 0; p < linY.length; p++) {
            tmp[p] = (s.output([linX[n], linY[p]]));
        }
        z[n] = tmp;
        tmp = [];
    }

    /*
    const sign = (x) => {
        if (x < 0) {
            return -1
        }
        if (x > 0) {
            return 1
        }
        return 0;
    }
     z = z.map(z => z.map(sign))
     */

    // Better use sigmoid instead of sign, when using contour plots.
    z = z.map(z => z.map(sigmoid))

    createPlot(x, y, z, labels, s, axisTitles);
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels, svm, axisTitles=['x', 'y']) {

    // Define target div.
    let div = document.getElementById('plot');

    // Limits of the contour plot.
    let x_min = 0.9 * Math.min.apply(Math, xData);
    let x_max = 1.1 * Math.max.apply(Math, xData);
    let y_min = 0.9 * Math.min.apply(Math, yData);
    let y_max = 1.1 * Math.max.apply(Math, yData);

    let linX = linspace(x_min, x_max);
    let linY = linspace(y_min, y_max);

    let contour = {
        // separationLine
        contours: {
            coloring: 'lines'
        },
        z: zData,
        x: linX,
        y: linY,
        ncontours: 2,
        opacity: 1,
        transpose: true,
        hoverinfo: 'none',
        xaxis: 'x1',
        yaxis: 'x2',
        type: 'contour',
        showscale: false,
        colorscale: 'red',
        line: {
            smoothing: 1.3
        }
    };

    let scatterPoints = {
        x: xData.filter((x, i) => svm.alphas[i] <= 0),
        y: yData.filter((x, i) => svm.alphas[i] <= 0),
        mode: 'markers',
        hoverinfo: 'none',
        type: 'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] <= 0),
            /*styles: [
                {target: 'setosa', value: {marker: {color: 'rgb(89,245,7)'}}},
                {target: 'versicolor', value: {marker: {color: 'rgb(252,252,252)'}}},
                {target: 'virginica', value: {marker: {color: 'rgb(245,7,7)'}}}
            ]*/
        }],
    }

    let scatterSupportVectors = {
        x: xData.filter((x, i) => svm.alphas[i] > 0),
        y: yData.filter((x, i) => svm.alphas[i] > 0),
        mode: 'markers',
        name: 'Support Vectors',
        hoverinfo: 'none',
        type: 'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] > 0),
            /*styles: [
                {target: 'setosa', value: {marker: {color: 'rgba(127,16,198,0.95)'}}},
                {target: 'versicolor', value: {marker: {color: 'rgba(127,16,198,0.95)'}}},
                {target: 'virginica', value: {marker: {color: 'rgba(127,16,198,0.95)'}}}
            ]*/
        }],
    }

    let data = [scatterPoints, scatterSupportVectors, contour];

    // Layout settings.
    let layout = {
        showlegend: false,
        xaxis: {
            anchor: 'x1',
            title: axisTitles[0]
        },
        yaxis: {
            anchor: 'x2',
            title: axisTitles[1]
        }
    };

    // Plot.
    Plotly.newPlot(div, data, layout);
}