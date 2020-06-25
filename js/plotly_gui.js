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

function StringArray2FloatArray(StringArray){
    var FloatArray = [];
    var ArrayLength = StringArray.length;
    for(var i = 0; i < ArrayLength; i++){
        var float = parseFloat(StringArray[i])
        FloatArray.push(parseFloat(StringArray[i]));
    }
    return FloatArray;
}

function processData(data, svm) {
    //Do SVM stuff here! See: gui.js
    let [svm_X, svm_y] = svm.recordsDataToSvmData(data, ['sepal_length', 'sepal_width'], 'species', 'setosa');
    let s = new svm.default({
        X: svm_X, y: svm_y,
        //
        C: 10, tol: 1e-3, kernel: svm.inner, use_linear_optim: true,
    });
    s.main_routine();
    console.log(s);

    // Define axis from data.
    var x = [[],[]], y = [[],[]], z = [];

    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/iris-data.csv', function(err, rows) {
        function unpack(rows, key) {
            return rows.map(function (row) {
                // return float
                return row[key];
            });
        }



        //TODO  parse to floats
        //var x1 = unpack(rows, 'sepal length');
        var x1 = StringArray2FloatArray(unpack(rows, 'sepal length'));
        var x2 = StringArray2FloatArray(unpack(rows, 'sepal width'));
        var x3 = StringArray2FloatArray(unpack(rows, 'petal length'));
        var x4 = StringArray2FloatArray(unpack(rows, 'petal width'));
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
                cNumeric.push(2);
            }
        }

        var x_min = Math.min.apply(null, x1.filter(function(n) { return !isNaN(n); }));
        var x_max = Math.max.apply(null, x1.filter(function(n) { return !isNaN(n); }));

        var y_min = Math.min.apply(null, x2.filter(function(n) { return !isNaN(n); }));
        var y_max = Math.max.apply(null, x2.filter(function(n) { return !isNaN(n); }));



        // Data of the contour.
        var linX = linspace(x_min, x_max,100);
        var linY = linspace(y_min, y_max, 100);

        var tmp = []
        for(var n=0; n<linX.length; n++){
            for(var p=0; p<linY.length; p++){
                tmp[p] = (s.output([linX[n], linY[p]]));
            }
            //z.push(tmp);
            z[n]=tmp;
            tmp=[];
        }

        const sign = (x) => {
            if (x < 0){return -1}
            if (x > 0){return 1}
            return 0;
        }

        // TODO replace sign with sgimoid or tanh for example
        z = z.map(z => z.map(sign))

        console.log(z)

        createPlot(x1, x2, z, c, cNumeric, s);

    });
}

// Draw the plotly.
function createPlot(xData, yData, zData, labels, labelsNumeric, svm) {


    // Define target div.
    var div = document.getElementById('iris-shapes');

    // Contour plot.
    let x_min = 0.9 * Math.min.apply(Math, xData);
    let x_max = 1.1 * Math.max.apply(Math, xData);
    let y_min = 0.9 * Math.min.apply(Math, yData);
    let y_max = 1.1 * Math.max.apply(Math, yData);

    linX = linspace(x_min, x_max, 100);
    linY = linspace(y_min, y_max, 100);

    var contour = {
        // Lines.
        contours:{
            coloring: 'lines'
        },
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
        type: 'contour',
        line:{
            smoothing: 1.3
        }
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

    var scatterPoints = {
        x: xData.filter((x, i) => svm.alphas[i] <= 0),
        y:yData.filter((x, i) => svm.alphas[i] <= 0),
        mode: 'markers',
        hoverinfo: 'none',
        type:'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] <= 0),
            styles:[
                //{target: -1, value: {marker: {color:'rgb(255,255,255)'}}},
                //{target: 1, value: {marker: {color:'rgba(2,253,12,0.7)'}}}
                {target: 'Iris-setosa', value: {marker:{color:'rgb(89,245,7)'}}},
                {target: 'Iris-versicolor', value: {marker:{color:'rgb(252,252,252)'}}},
                {target: 'Iris-virginica', value: {marker:{color:'rgb(245,7,7)'}}}
            ]
        }],
    }

    var scatterSupportVectors = {
        x: xData.filter((x, i) => svm.alphas[i] > 0),
        y:yData.filter((x, i) => svm.alphas[i] > 0),
        mode: 'markers',
        hoverinfo: 'none',
        type:'scatter',
        transforms: [{
            type: 'groupby',
            groups: labels.filter((x, i) => svm.alphas[i] > 0),
            styles:[
                //{target: -1, value: {marker: {color:'rgb(255,255,255)'}}},
                //{target: 1, value: {marker: {color:'rgba(2,253,12,0.7)'}}}
                {target: 'Iris-setosa', value: {marker:{color:'rgba(127,16,198,0.95)'}}},
                {target: 'Iris-versicolor', value: {marker:{color:'rgba(127,16,198,0.95)'}}},
                {target: 'Iris-virginica', value: {marker:{color:'rgba(127,16,198,0.95)'}}}
            ]
        }],
    }

    var data = [scatterPoints, scatterSupportVectors, contour];

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

