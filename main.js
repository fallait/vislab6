import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

d3.csv('unemployment.csv', d3.autoType).then(data=>{
    const unemployment = data;
    var row;
    var col;
    for (row = 0; row < unemployment.length; row++){
        var summed = 0;
        for (col in unemployment[row]){
            if (col != "date"){
            //console.log(unemployment[row][col])
            summed = summed + unemployment[row][col];
        }
    }
        unemployment[row].total = summed;
    }
    const StackChart = StackedAreaChart(".chart-container2");
    StackChart.update(data);
    
    const AreaChart1 = AreaChart(".chart-container1");
    AreaChart1.update(data);

    AreaChart1.on("brushed", (range)=>{
        StackChart.filterByDate(range); // coordinating with stackedAreaChart
    })
})