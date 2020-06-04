function IrisShapes(svm){
    d3.selectAll("svg > *").remove();
    $('svg').remove()

    d3.csv("../data/iris.csv", function(data){

        let [svm_X, svm_y] = svm.recordsDataToSvmData(data, ['sepal_length', 'sepal_width'], 'species', 'setosa');
        let s = new svm.default({
            X: svm_X, y: svm_y,
            C: 10, tol: 1e-3, kernel: svm.inner, use_linear_optim: true,
        });
        s.main_routine();

        var margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // adapt x and y to data
        let sepal_length = [];
        let sepal_width = [];

        for(let i = 0; i<data.length; i++){
            sepal_length[i] = parseFloat(data[i]['sepal_length']);
            sepal_width[i] = parseFloat(data[i]['sepal_width']);
        }

        // XXX the bounds -2 have been set to debug drawLine()
        let x_min = Math.min.apply(Math, sepal_length) * 0.9;
        x_min = -2;
        let x_max = Math.max.apply(Math, sepal_length)  * 1.1;
        let y_min = Math.min.apply(Math, sepal_width)  * 0.9;
        y_min = -2;
        let y_max = Math.max.apply(Math, sepal_width)  * 1.1;

        // set x range
        var x = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([ 0, width ]);

        // set y range
        var y = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([ height, 0]);

        // Rendering the D3.js graph.
        var svg = d3.select('#iris-shapes')
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")

        /*        var line = d3.select('#iris-shapes')
                    .append("line")
                    .attr("x1", x_min)
                    .attr("x2", x_max)
                    .attr("y1", y_min)
                    .attr("y2", y_max)
                    .attr("stroke-width", 2)
                    .attr("stroke", "red");*/



        // add x axis to svg
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add y axis to svg
        svg.append("g")
            .call(d3.axisLeft(y));

        addGridlines(svg, {height, width, x, y});

        color = d3.scaleOrdinal(data.map(d => d.category), d3.schemeCategory10)

        // add some data
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (data) { return x(data.sepal_length); } )
            .attr("cy", function (data) { return y(data.sepal_width); } )
            .attr("r", 4)
            .style("fill", colorBySpecies)

        {
            // XXX the separating boundary is not drawn correctly
            // 1. we shouldn't calculate the intercept, but the intersection with the plot's bounding box
            // 2. even so, the boundary is totally off. A problem with the SVM?
            let w = s.w;
            let b = s.b;

            // w0*x + w1*y = b
            // if x = 0:
            //   y = b/w1
            // if y = 0:
            //   x = b/w0

            drawLine(svg, [0, b/w[1]], [b/w[0], 0], {scalex: x, scaley: y});
        }

        function colorBySpecies(data){
            if(data.species == 'setosa'){
                return "#6975b3";
            }
            if(data.species == 'versicolor'){
                return "#7db369";
            }
            if(data.species == 'virginica'){
                return "#b3697a";
            }
            else {
                return "#69b3a2";
            }
        }

        animateMouseover(svg);
    });
}

function animateMouseover(svg) {

    var lineText = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("background-color", "lightgrey")
        .style("opacity", 0.5);

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("background-color", "lightgrey")
        .style("opacity", 0.5);

        svg.selectAll('#myLine')
            .on("mouseover", handleLineMouseOver)
            .on("mouseout", handleLineMouseOut)

        svg.selectAll('#topLine')
            .on("mouseover", handleLineMouseOver)
            .on("mouseout", handleLineMouseOut)

        svg.selectAll('#bottomLine')
            .on("mouseover", handleLineMouseOver)
            .on("mouseout", handleLineMouseOut)

        svg.selectAll('circle')
            .on('mouseover', handleMouseOver)
            .on("mouseout", handleMouseOut)

        function handleLineMouseOver(d){

            d3.select(this)
                .style("stroke", "rgba(229,105,56,0.93)")
                .style("stroke-width", 5);

            var line = this;
            var attributes = line.attributes;
            var x1 = attributes['data-x1'].value;
            var x2 = attributes['data-x2'].value;
            var y1 = attributes['data-y1'].value;
            var y2 = attributes['data-y2'].value;

            var slope = Math.round( ((y2 - y1) / (x2 - x1)) *100  ) / 100;

            var div_width = 20;

            div.attr("width", div_width);

            div.transition()
                .duration(500)
                .style("opacity", 1);

            var show = "Seperation Line: <br> Slope: "+slope +"<br>x1: " +x1 +"<br>x2: "+x2 +"<br>y1: " +y1 +"<br>y2: "+y2;
            div.html(show)
                .style("left", (d3.event.pageX) +10 +"px")
                .style("top", (d3.event.pageY) +10 +"px")
        }

        function handleLineMouseOut(d){
            var line = this;
            line.style.stroke="black";
            line.style.strokeWidth="2";

            div.transition()
                .duration(500)
                .style("opacity", 0);
        }

        function handleMouseOver(d){

            d3.select(this)
                .style("fill", "#f54008")
                .attr("r", 8)


            d.div_width = 20;
            div.attr("width", d.div_width);
            div.transition()
                .duration(200)
                .style("opacity", 1);

            var show =  "species: " +d.species +"<br>"
                +"sepal length: " +d.sepal_length +"<br>"
                +"sepal_width: " +d.sepal_width +"<br>"
                +"petal_length: " +d.petal_length +"<br>"
                +"petal_width: " +d.petal_width +"<br>";

            div.html(show)
                .style("left", (d3.event.pageX) +10 +"px")
                .style("top", (d3.event.pageY) +10 +"px")
        }

        function handleMouseOut(d){
            d3.select(this)
                .style("fill", "#69b3a2")
                .attr("r", 4)

            div.transition()
                .duration(500)
                .style("opacity", 0);
        }
}

function drawLine(svg, [x1, y1], [x2, y2], {scalex, scaley}) {
    var line = svg.append("line")
        .attr("class", "myLine")
        .attr("id", "myLine")
        .attr("x1", scalex(x1))
        .attr("y1", scaley(y1))
        .attr("x2", scalex(x2))
        .attr("y2", scaley(y2))
        .attr("data-x1", x1)
        .attr("data-y1", y1)
        .attr("data-x2", x2)
        .attr("data-y2", y2)
        .attr("transform", "translate(0,-100) rotate(0)");

    var topLine = svg.append("line")
        .attr("class", "topLine")
        .attr("id", "topLine")
        .attr("x1", scalex(x1))
        .attr("y1", scaley(y1)-50)
        .attr("x2", scalex(x2)-50)
        .attr("y2", scaley(y2))
        .attr("transform", "translate(0,-100) rotate(0)");

    var bottomLine = svg.append("line")
        .attr("class", "bottomLine")
        .attr("id", "bottomLine")
        .attr("x1", scalex(x1))
        .attr("y1", scaley(y1)+50)
        .attr("x2", scalex(x2)+50)
        .attr("y2", scaley(y2))
        .attr("transform", "translate(0,-100) rotate(0)");
}

function addGridlines(svg, {height, width, x, y}) {
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5);
    }

    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5);
    }


    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
             );


    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
             );
}

/*
$(document).ready(function() {



    $('#reload').click(function(){
        console.log("Reload graph");
    });

    $('#backwards').click(function(){
        console.log("Step backwards");
    });

    $('#forwards').click(function(){
        console.log("Step forwards")
    });


});
*/
