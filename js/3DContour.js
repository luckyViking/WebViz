Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/iris-data.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row)
        { return row[key]; });}

    var x = unpack(rows, 'sepal length');
    var y = unpack(rows, 'sepal width');
    var z = unpack(rows, 'petal length');
    var z2 = unpack(rows, 'petal width');
    var c = unpack(rows, 'class');


    var x_min = Math.min.apply(null, x.filter(function(n) { return !isNaN(n); }));
    var x_max = Math.max.apply(null, x.filter(function(n) { return !isNaN(n); }));

    var y_min = Math.min.apply(null, y.filter(function(n) { return !isNaN(n); }));
    var y_max = Math.max.apply(null, y.filter(function(n) { return !isNaN(n); }));

    var trace1 = {
        x: x,
        y: y,
        z: z,
        group: c,

        mode: 'markers',
        transforms: [{
            type: 'groupby',
            groups: c,
            styles:[
                {target: 'Iris-setosa', value: {marker:{color:'blue'}}},
                {target: 'Iris-versicolor', value: {marker:{color:'red'}}},
                {target: 'Iris-virginica', value: {marker:{color:'green'}}}
            ]
        }],
        marker: {
            size: 3,
            //color: x,
            //colorscale: 'plotly',
            opacity: 0.8},

        type: 'scatter3d'
    };

    //
    var trace2 = {
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 1,
        line: {
            width: 1,
            color: 'rgb(170,165,165)',
            reversescale: false
        }
    };

    // plane
    var trace3 = {
        type: 'mesh3d',
        x: [x_min, x_min, x_max, x_max],
        y: [y_min, y_max, y_min, y_max],
        z: [2, 2, 4, 4],
        delaunayaxis: x,
        color: 'red',
        opacity: 0.2,

    };

    var size = 15;
    var z_data = [];
    for(var i = 0; i < size; i++){
        z_data.push(linspace(2.5,1.75,size))
    }

    var contour = {
        type: 'surface',
        x: linspace(x_min, x_max, 15),
        y: linspace(y_min, y_max, 15),
        z: z_data,
        opacity: 0.5,
        color: "rgb(255,255,255)",


    }

    var data = [trace1, contour];
    var layout = {
        xaxis:{
            fixedrange: true,
            type: 'linear',
            range:[0,6]
        },
        yaxis:{
            fixedrange: true,
            type: 'linear',
            range:[0,6]
        },
        zaxis:{
            fixedrange: true,
            type: 'linear',
            range:[0,10]
        },
        margin: {
            l: 50,
            r: 0,
            b: 0,
            t: 0
        }};


    Plotly.newPlot('myDiv', data, layout);
});

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