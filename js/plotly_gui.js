/*
function IrisShapesPlotly(svm, dataset, kernel, epsilon){
    // Read and process data.
    Plotly.d3.csv('../data/iris.csv', function (data) {
        processData(data, svm, kernel, epsilon);
    });
}
*/

function loadPlotly(svm, dataset, kernel, epsilon, C, style) {
    //  Process user input.
    switch (dataset) {
        case 'salmon' :
            var dataPath = '../data/salmon.csv';
            var Xcols = ['length', 'diameter'];
            var plotTitle = 'Classification of subadult salmons';
            var axisTitles = ['Length [cm]', 'Diameter [cm]'];
            var ycol = 'young';
            var target = '1';
            break;
        default:
            var dataPath = '../data/iris.csv';
            var Xcols = ['sepal_length', 'sepal_width'];
            var plotTitle = 'Classification of "Setosa" species';
            var axisTitles = ['Sepal length [cm]', 'Sepal width [cm]'];
            var ycol = 'species';
            var target = 'setosa';
            break;
    }

    switch (kernel) {
        case 'polynomial':
            var svmKernel = svm.polynomial;
            break;
        case 'rbf':
            var svmKernel = svm.rbf;
            break;
        default:
            var svmKernel = svm.inner;
            break;
    }

    // Start.
    Plotly.d3.csv(dataPath, function (data) {
        let [x, y, z, labels, s] = processData(data, Xcols, ycol, target, svm, svmKernel, epsilon, C);
        showValues(x, y, z, labels, s);
        createPlot(x, y, z, labels, s, plotTitle, axisTitles, target, style);
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

function processData(data, Xcols, ycol, target, svm, kernel, epsilon, C) {
     //Do SVM stuff here! See: gui.js
    let [svm_X, svm_y] = svm.recordsDataToSvmData(data, Xcols, ycol, target);
    let s = new svm.default({
        X: svm_X,
        y: svm_y,
        C: parseInt(C),
        tol: parseFloat(epsilon),
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

    //createPlot(x, y, z, labels, s, axisTitles);
    return [x, y, z, labels, s]
}

function showValues(xData, yData, zData, labels, svm){
    // Finding the current support vectors.
    let svX = xData.filter((x, i) => svm.alphas[i] > 0);
    let svY = yData.filter((x, i) => svm.alphas[i] > 0);
    let sv = '(' + xData[0] + '|' + yData[0] + ')';
    for(let i = 1; i<svX.length; i++){
        sv += ', (' + svX[i] + '|' + svY[i] + ')';
    }
    $('#values').append('<li><strong>Support Vectors:</strong> ' + sv + '</li>');

    // Calculating the accuracy.
    console.log(labels);
    let acc = 0.0 / xData.length;
    $('#values').append('<li><strong>Accuracy (ACC): </strong>' + acc + '</li>');
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels, svm, plotTitle, axisTitles=['x', 'y'], target, style) {

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
        contours: {
            coloring: style
        },
        colorscale: 'YlGnBu',
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
        line: {
            smoothing: 1.3
        }
    };

    let scatterPoints = {
        // All data points that are no support vectors.
        x: xData.filter((x, i) => svm.alphas[i] <= 0),
        y: yData.filter((x, i) => svm.alphas[i] <= 0),
        mode: 'markers',
        hoverinfo: 'none',
        type: 'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] <= 0),
            style: [
                {target: target, value: {marker: {color: 'rgb(245,7,7)'}}}
            ]
        }],
        marker: {
            size: 8,
            line: {color: 'rgb(0,0,0)', width: 1}
        }
    }

    let scatterSupportVectors = {
        // All data points that are used as support vectors by svm
        x: xData.filter((x, i) => svm.alphas[i] > 0),
        y: yData.filter((x, i) => svm.alphas[i] > 0),
        mode: 'markers',
        name: 'Support Vectors',
        hoverinfo: 'none',
        type: 'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] > 0),
            style: [
                {target: target, value: {marker: {color: 'rgb(245,7,7)'}}},
                {target: '0', value: {marker: {color: 'orange'}}}
            ]
        }],
        marker: {
            size: 8,
            line: {color: 'rgb(0,0,0)', width: 1},
            symbol: 'x'
        }
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
        },
        title: plotTitle
    };

    // Plot.
    Plotly.newPlot(div, data, layout);
}