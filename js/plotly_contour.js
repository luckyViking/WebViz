

Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/iris-data.csv', function(err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    Plotly.d3.csv('/home/luca/Desktop/Master/Sem3/WebViz/python/output/svm_Z.csv', function (data) {
        data = data;
        return data;
    });

    var x = unpack(rows, 'sepal length');
    var y = unpack(rows, 'sepal width');
    var z = unpack(rows, 'petal length');
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
            cNumeric.push(2);
        }
    }



    var contour = {

        z: cNumeric,
        x: x,
        y: y,
        type: 'contour',

    };

    var scatter = {
        x: x,
        y: y,
        group: c,
        type: 'scatter',
        mode: 'markers',
        marker:{
            color:'rgb(255, 255, 255)',
            size: 7,
        },
        transforms: [{
            type: 'groupby',
            groups: c,
            styles:[
                {target: 'Iris-setosa', value: {marker:{color:'rgb(255, 255, 255)'}}},
                {target: 'Iris-versicolor', value: {marker:{color:'rgb(238,198,25)'}}},
                {target: 'Iris-virginica', value: {marker:{color:'rgb(3,231,219)'}}}
            ]
        }],
    }

    var data = [contour, scatter];

    Plotly.newPlot('myDiv', data)


    //Plotly.newPlot('myDiv', data, layout);
});


// ################################################################################################ //
/*

var size = 100
x = new Array(size)
y = new Array(size)
z = new Array(size), i, j;

for(var i = 0; i < size; i++) {
    x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
    z[i] = new Array(size);
}

for(var i = 0; i < size; i++) {
    for(j = 0; j < size; j++) {
        var r2 = x[i]*x[i] + y[j]*y[j];
        z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
    }
}

var data = [ {
    z: z,
    x: x,
    y: y,
    type: 'contour'
}
];

Plotly.newPlot('myDiv', data);*/
