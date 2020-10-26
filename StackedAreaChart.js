export default function StackedAreaChart(container){    
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleTime()
        .rangeRound([0, width])
    
    const yScale = d3.scaleLinear()
        .range([height, 0])

    const colScale = d3.scaleOrdinal(d3.interpolateInferno)

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
        .text("Number Unemployed per Industry")
    
    const tooltip = svg
        .append("text")
        .attr('x', margin.right)
        .attr('y', margin.top/2)

	function update(data){ 
        console.log(data);
        var keys = data.columns.slice(1)
        //console.log(keys);

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)
        
        var series = stack(data);

        xScale.domain(d3.extent(data, function(d) {return +d.date}));
        colScale.domain(keys).range(d3.schemeBuPu[9]);
        yScale.domain([0, 
            d3.max(series, d=> d3.max(d, d2=>d2[1]))])
            
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);   
        
        //console.log(series[0][1]);
        //console.log(series);
        
        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y1(d => yScale(d[1]))
            .y0(d => yScale(d[0]));

        const areas = svg.selectAll(".area")
            .data(series, d => d.key)

        areas.enter() // or you could use join()
            .append("path")
            .attr("fill", d => colScale(d.key))
            .merge(areas)
            .attr("d", area)
            .on("mouseenter", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text("No Selection"));
        
        svg.select(".y-axis")  
            .call(yAxis)

        svg.select(".x-axis")
            .attr("class", "axis x-axis")
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
    }
    return {update}}