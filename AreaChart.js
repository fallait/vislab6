export default function AreaChart(container){
        //console.log(unemployment);
    const listeners = { brushed: null };
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 1000 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleTime()
        .rangeRound([0, width])
    
    const yScale = d3.scaleLinear()
        .range([height, 0])

    const xAxis = d3.axisBottom()
        .scale(xScale)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5, "s")

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    svg.append("path")
        .attr("class", "initpath")


    svg.append("text") 
        .attr("id", "axislbl")
        .attr('x', 0-margin.left)
        .attr('y', -10)
        .text("Number Unemployed")
    
    const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("brush", brushed);

    svg.append("g").attr('class', 'brush').call(brush);

    function brushed(event) {
        if (event.selection) {
            //console.log("brushed", event.selection);
            let selection = event.selection.map((d) => d)
            listeners["brushed"](selection.map(xScale.invert)); // or map(d=> xScale.invert(d))
        }
      }

    function update(data){ 
        //console.log(data);
        xScale.domain(d3.extent(data, function(d) {return +d.date}));
        yScale.domain([0, d3.max(data, function(d) {return +d.total})]);

        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);   
       
        svg.select(".y-axis")  
            .call(yAxis)

        svg.select(".x-axis")
            .attr("class", "axis x-axis")
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
        
        svg.select(".initpath")
            .datum(data)
            .attr("fill", "#cce5df")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.area()
                .x(d=>xScale(d.date))
                .y0(yScale(0))
                .y1(d=>yScale(d.total)))
    }
    function on(event, listener){
        listeners[event] = listener;
    }
    return {update, on}}
    