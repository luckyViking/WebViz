function IrisShapesPlotly(svm){
    // Read and process data.
    Plotly.d3.csv('../data/iris.csv', function (data) {
        processData(data, svm)
    });
}

function processData(data, svm) {
    //Do SVM stuff here! See: gui.js
    let [svm_X, svm_y] = svm.recordsDataToSvmData(data, ['sepal_length', 'sepal_width'], 'species', 'setosa');
    let s = new svm.default({
        X: svm_X, y: svm_y,
        C: 10, tol: 1e-3, kernel: svm.inner, use_linear_optim: true,
    });
    s.main_routine();
    console.log(s);

    // Data of the contour.
    var z = [[10, 10.625, 12.5, 15.625, 20],
        [5.625, 6.25, 8.125, 11.25, 15.625],
        [2.5, 3.125, 5., 8.125, 12.5],
        [0.625, 1.25, 3.125, 6.25, 10.625],
        [0, 0.625, 2.5, 5.625, 10]];

    // Define axis from data.
    var x = [[],[]], y = [[],[]];
    for (var i = 0; i < data.length; i++) {
        row = data[i]
        if(row['species'] == 'setosa'){
            x[0].push(row['sepal_length']);
            y[0].push(row['sepal_width']);
        } else {
            x[1].push(row['sepal_length']);
            y[1].push(row['sepal_width']);
        }
    }

    createPlot(x, y, z, ['Setosa', 'Others']);
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels) {
    // Define target div.
    var div = document.getElementById('iris-shapes');
    // Contour plot.
    var contour = {
        // Lines.
        z: zData,
        //x: xData,
        //y: yData,
        x: [4, 5, 6, 7, 8, 9],
        y: [1, 2, 3, 4, 5, 6],
        contours: {
            coloring: 'lines'
        },
        xaxis: 'x1',
        yaxis: 'x2',
        type: 'contour'
    };

    // Scatter plots.
    var scatter1 = {
        x: xData[0],
        y: yData[0],
        name: labels[0],
        mode: 'markers',
        type: 'scatter'
    };

    var scatter2 = {
        x: xData[1],
        y: yData[1],
        name: labels[1],
        mode: 'markers',
        type: 'scatter'
    }

    var data = [contour, scatter1, scatter2];

    // Layout settings.
    var layout = {
        title: 'Plotting with Plotly',
        showlegend: false,
        showscale: false,
        xaxis: {anchor: 'x1'},
        yaxis: {anchor: 'x2'}
    };

    // Plot.
    Plotly.newPlot(div, data, layout);
}

