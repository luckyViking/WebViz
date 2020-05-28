
function IrisShapes(){
    d3.selectAll("svg > *").remove();
    $('svg').remove()

    d3.csv("../data/iris.csv", function(data){



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

        let x_min = Math.min.apply(Math, sepal_length) * 0.9;
        let x_max = Math.max.apply(Math, sepal_length)  * 1.1;
        let y_min = Math.min.apply(Math, sepal_width)  * 0.9;
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


        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(5)
        }

        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(5)
        }


        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )


        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )


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

        var line = svg.append("line")
            .attr("class", "myLine")
            .attr("id", "myLine")
            .attr("x1", 0)
            .attr("y1", height)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0,-100) rotate(0)");

        var topLine = svg.append("line")
            .attr("class", "topLine")
            .attr("id", "topLine")
            .attr("x1", 0)
            .attr("y1", height-50)
            .attr("x2", width-50)
            .attr("y2", 0)
            .attr("transform", "translate(0,-100) rotate(0)");

        var bottomLine = svg.append("line")
            .attr("class", "bottomLine")
            .attr("id", "bottomLine")
            .attr("x1", 0)
            .attr("y1", height+50)
            .attr("x2", width+50)
            .attr("y2", 0)
            .attr("transform", "translate(0,-100) rotate(0)");

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


        function handleLineMouseOver(d){

            d3.select(this)
                .style("stroke", "rgba(229,105,56,0.93)")
                .style("stroke-width", 5);

            var line = this;
            var attributes = line.attributes;
            var x1 = attributes.x1.value;
            var x2 = attributes.x2.value;
            var y1 = attributes.y1.value;
            var y2 = attributes.y2.value;

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





    });





}

IrisShapes();

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
