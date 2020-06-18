function IrisShapesPlotly(svm){
    // Read and process data.
    Plotly.d3.csv('../data/iris.csv', function (data) {
        processData(data, svm)
    });
}

function linspace(min, max, N) {
    domain = max - min;
    lin = [];
    d = domain /(N-1);
    for(let i = 0;i < N; i++){
        current = min + (i * d);
        lin.push(current)
    }

    return lin;
}

function processData(data, svm) {
    //Do SVM stuff here! See: gui.js
    let [svm_X, svm_y] = svm.recordsDataToSvmData(data, ['sepal_length', 'sepal_width'], 'species', 'setosa');
    let s = new svm.default({
        X: svm_X, y: svm_y,
        C: 10, tol: 1e-3, kernel: svm.inner, use_linear_optim: true,
    });
    s.main_routine();

    // Define axis from data.
    var x = [[],[]], y = [[],[]], z = [];

    // Data for the scatter.
    for (var i = 0; i < data.length; i++) {
        row = data[i]
        if(row['species'] == 'setosa'){
            x[0].push(parseFloat(row['sepal_length']));
            y[0].push(parseFloat(row['sepal_width']));
        } else {
            x[1].push(parseFloat(row['sepal_length']));
            y[1].push(parseFloat(row['sepal_width']));
        }
    }


    // Data of the contour.
    var linX = linspace(4.12, 8.08,30);
    var linY = linspace(1.88, 4.5200000000000005, 30);
    var tmp = []
    for(var n=0; n<linX.length; n++){
        for(var p=0; p<linY.length; p++){
            tmp[p] = (s.output([linX[n], linY[p]]));
        }
        z[n]=tmp;
        tmp=[];
    }

    console.log(z)

    createPlot(x, y, z, ['Species: Setosa', 'Species: Others']);
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels) {
    // Define target div.
    var div = document.getElementById('iris-shapes');
    // Contour plot.
    var contour = {
        // Lines.
        z: zData,
        x: linspace(4.12, 8.08,30),
        y: linspace(1.88, 4.5200000000000005, 30),
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

