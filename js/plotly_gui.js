// Read and process data.
Plotly.d3.csv('../data/iris.csv', function (data) {
    processData(data)
});


function processData(data) {
    // Define axis from data.
    var x = [], y = [];
    for (var i = 0; i < data.length; i++) {
        row = data[i]
        x.push(row['sepal_length'])
        y.push(row['sepal_width'])
    }

    //Do SVM stuff here!

    // Data of the contour.
    var z = [[10, 10.625, 12.5, 15.625, 20],
        [5.625, 6.25, 8.125, 11.25, 15.625],
        [2.5, 3.125, 5., 8.125, 12.5],
        [0.625, 1.25, 3.125, 6.25, 10.625],
        [0, 0.625, 2.5, 5.625, 10]];

    createPlot(x, y, z);
}

// Draw the plotly.
function createPlot(xData, yData, zData) {
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

    // Scatter plot.
    var scatter = {
        x: xData,
        y: yData,
        mode: 'markers',
        type: 'scatter'
    };

    var data = [contour, scatter];

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

