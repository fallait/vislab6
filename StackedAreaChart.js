export default function StackedAreaChart(container){    
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom
    let data;
    let selected = null;
    let xDomain;
    let cutOffMin;
    let cutOffMax;
    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleTime()
        .range([0, width])
    
    const yScale = d3.scaleLinear()
        .range([height, 0])

    const colScale = d3.scaleOrdinal().range(d3.schemeCategory10)

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

	function update(_data){ 
        //console.log(data);
        data = _data;
        let cutOffMin = 0;
        let cutOffMax = Infinity;

        const keys = selected? [selected] : data.columns.slice(1);

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)
        
        var series = stack(data);
        xScale.domain(xDomain? xDomain : d3.extent(data.map((d) => d.date)));
        //console.log(xScale(d3.min(data.map((d)=>d.date))))
        colScale.domain(keys);
        yScale.domain([0, 
            d3.max(series, d=> d3.max(d, d2=>d2[1]))])
            
        const xAxis = d3.axisBottom().scale(xScale);
        const yAxis = d3.axisLeft().scale(yScale);   
        
        const area = d3.area()
            .x(d => xScale(d.data.date))
            .y1(d => yScale(d[1]))
            .y0(d => yScale(d[0]));
        svg.selectAll("path").remove();
        
        var areas = svg.selectAll(".area")
            .data(series, d => d.key)
        
        svg.append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height);

        areas.enter() // or you could use join()
            .append("path")
                .attr("clip-path", "url(#clip)")
                .attr("fill", d => colScale(d.key))
                .merge(areas)
                .attr("d", area)
                .on("mouseenter", (event, d, i) => tooltip.text(d.key))
                .on("mouseout", (event, d, i) => tooltip.text("No Selection"))
                .on("click", (event, d) => {
                    // toggle selected based on d.key
                    if (selected === d.key) {
                  selected = null;
                } else {
                    selected = d.key;
                }
                update(data); // simply update the chart again
            });


        svg.select(".y-axis")  
            .call(yAxis)

        svg.select(".x-axis")
            .attr("class", "axis x-axis")
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
    }
    
    function filterByDate(range) {
        //console.log(range);
        xDomain = range;
        cutOffMin = (Object.values(xDomain)[0])
        //console.log(cutOffMin);
        cutOffMax = (Object.values(xDomain)[1])
        //console.log(cutOffMax);
        update(data);
    }
    return {update, filterByDate}}
