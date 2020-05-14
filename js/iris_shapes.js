
function IrisShapes(){
    d3.selectAll("svg > *").remove();
    $('svg').remove()

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 860 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // set x range
    var x = d3.scaleLinear()
        .domain([4, 9])
        .range([ 0, width ]);

    // set y range
    var y = d3.scaleLinear()
        .domain([1.5, 5])
        .range([ height, 0]);

    // Rendering the D3.js graph.
    var svg = d3.select('#iris-shapes')
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")



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


    d3.csv("../data/iris.csv", function(data){

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


        // add some data
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (data) { return x(data.sepal_length); } )
            .attr("cy", function (data) { return y(data.sepal_width); } )
            .attr("r", 4)
            .style("fill", "#69b3a2")

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("background-color", "#69b3a2")
            .style("opacity", 0.5);

        svg.selectAll('circle')
            .on('mouseover', handleMouseOver)
            .on("mouseout", handleMouseOut)


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

