function loadGraph(container, dataset){
    // Clear the page before creating a new graph.
    d3.selectAll("svg > *").remove();
    $('svg').remove()

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 860 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Rendering the D3.js graph.
    var svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Create graph with data according to selection.
    if(dataset==='random') {
        console.error("Not implemented yet");
    } else if(dataset===""){
        console.error("Not implemented yet");
    } else if(dataset==='iris'){
        d3.csv("../data/iris.csv", function(data){
            //Source: https://archive.ics.uci.edu/ml/datasets/Iris
            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 9])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 5])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));


            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.sepal_length); } )
                .attr("cy", function (d) { return y(d.sepal_width); } )
                .attr("r", 2.5)
                .style("fill", "#69b3a2")
        })
    } else if(dataset=='haberman'){
        // Source: https://archive.ics.uci.edu/ml/datasets/Haberman%27s+Survival
        d3.csv("../data/haberman.csv", function(data){
            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 100])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));


            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.age); } )
                .attr("cy", function (d) { return y(d.year); } )
                .attr("r", 2.5)
                .style("fill", "#69b3a2")
        })
    } else if(dataset==='abalone'){
        // Source: http://archive.ics.uci.edu/ml/datasets/Abalone
        d3.csv("../data/abalone.csv", function(data){
            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 1])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 25])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));


            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.length); } )
                .attr("cy", function (d) { return y(d.rings); } )
                .attr("r", 2.5)
                .style("fill", "#69b3a2")
        })
    } else {
        d3.csv("../data/example.csv", function(data) {


            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 4000])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 500000])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.GrLivArea); } )
                .attr("cy", function (d) { return y(d.SalePrice); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")

        })
    }
}


$(document).ready(function(){

    // Init graph when document is loaded.
    loadGraph("#plot", null)

    // Selection of dataset to plot.
    $("#selector").click(function(event){
        event.preventDefault();

        var set = $("#dataset").val();
        console.log("Load dataset: " + set);

        loadGraph("#plot", set)

    });

});