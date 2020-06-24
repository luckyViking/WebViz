function IrisShapesPlotly(svm){
    // Read and process data.
    Plotly.d3.csv('../data/iris.csv', function (data) {
        processData(data, svm)
    });
}

function linspace(min, max, N) {
    domain = max - min;
    lin = [];
    d = domain / (N-1);

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
    console.log(s);

    // Define axis from data.
    var x = [[],[]], y = [[],[]], z = [];

    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/iris-data.csv', function(err, rows) {
        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }
        var x = unpack(rows, 'sepal length');
        var y = unpack(rows, 'sepal width');
        var zz = unpack(rows, 'petal length');
        var z2 = unpack(rows, 'petal width');
        var c = unpack(rows, 'class');
        var cNumeric = [];

        for(var n = 0; n < c.length; n++){

            if(c[n] == 'Iris-setosa'){
                cNumeric.push(0);
            }
            if(c[n] == 'Iris-versicolor'){
                cNumeric.push(1);
            }
            if(c[n] == 'Iris-virginica'){
                cNumeric.push(1);
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
            //z.push(tmp);
            z[n]=tmp;
            tmp=[];
        }

        console.log(z)

        createPlot(x, zz, z, c, cNumeric);

    });
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels, labelsNumeric) {


    // Define target div.
    var div = document.getElementById('iris-shapes');

    // Contour plot.
    let x_min = 0.9 * Math.min.apply(Math, xData);
    let x_max = 1.1 * Math.max.apply(Math, xData);
    let y_min = 0.9 * Math.min.apply(Math, yData);
    let y_max = 1.1 * Math.max.apply(Math, yData);

    linX = linspace(x_min, x_max, 30);
    linY = linspace(y_min, y_max, 30);

    var contour = {
        // Lines.
        z: zData,
        //x: xData,
        //y: yData,
        x: linX,
        y: linY,
        ncontours: 2,
        opaycity: 0.5,
        transpose: true,
        hoverinfo: 'none',
        xaxis: 'x1',
        yaxis: 'x2',
        type: 'contour'
    };

    var contour2 = {
        x: linX,
        y: linY,
        z: labelsNumeric,
        transpose: true,
        type: 'contour',
        colorscale:'Jet',
    }

    var contour3 = {
        x: xData,
        y: yData,
        opacity: 0,
        z: labelsNumeric,
        //nconcouts: 2,
        type: 'contour',
        colorscale:'Jet'
    }

    var scatter = {
        x: xData,
        y:yData,
        mode: 'markers',
        hoverinfo: 'none',
        type:'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels,
            styles:[
                {target: 'Iris-setosa', value: {marker:{color:'rgb(232,10,10)'}}},
                {target: 'Iris-versicolor', value: {marker:{color:'rgb(252,252,252)'}}},
                {target: 'Iris-virginica', value: {marker:{color:'rgb(255,255,255)'}}}
            ]
        }],
    }

    var data = [scatter, contour];

    // Layout settings.
    var layout = {
        title: 'SVM: Iris with Dot-Kernel',
        showlegend: false,
        showscale: false,
        xaxis: {anchor: 'x1'},
        yaxis: {anchor: 'x2'}
    };

    // Plot.
    Plotly.newPlot(div, data, layout);
}

