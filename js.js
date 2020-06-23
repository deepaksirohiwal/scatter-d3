var margin={top:100, right:20,left:60,bottom:30};
var width=920-margin.right-margin.left;
var height=630-margin.top-margin.bottom;
var svgContainer=d3.select('.main').append('svg')
                    .attr('width',width+margin.right+margin.left)
                    .attr('height',height+margin.top+margin.bottom);
                    
var tooltip=d3.select('.main').append('div')
            .attr('class','tooltip')
            .attr('id','tooltip')
            .style('opacity',0);    
                   
                    
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(data=>{

//X-AXIS
var year= data.map(function(item){
    return item.Year
})

var yearMax= d3.max(year);
var yearMin=d3.min(year);
var x=d3.scaleLinear()
        .range([margin.left,width])
        .domain([yearMin-1,yearMax+1]);
var xAxis=d3.axisBottom(x).tickFormat(d3.format('d'));
var xAxisGroup=svgContainer.append('g')
                .call(xAxis)
                .attr('id','x-axis')
                .attr('transform', 'translate(0,'+height+')')
                

//Y-AXIS
var parsedTime;
var timeFormat = d3.timeFormat("%M:%S");
data.forEach(function(d) {
    d.Place = +d.Place;
    var parsedTime = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    
  });
  var maxMinute=d3.max(data.map(d=>(d.Time)));
  var minMinute=d3.min(data.map(d=>(d.Time)));
var y= d3.scaleTime()
        .range([20,height])
        .domain([minMinute,maxMinute]);

var yAxis=d3.axisLeft(y).tickFormat(timeFormat);
var yAxisGroup=svgContainer.append('g')
                .call(yAxis)
                .attr('id','y-axis')
                .attr('transform', 'translate('+margin.left+',0)');

// ploting the graph
var color = d3.scaleOrdinal(d3.schemeCategory10);
svgContainer.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class','dot')
    .attr('r',6)
    .attr('cx',function(d){return x(d.Year);})
    .attr('cy',function(d){return y(d.Time);})
    .attr('data-xvalue',function(d){return d.Year})
    .attr('data-yvalue',function(d){return d.Time.toISOString()})
    .style('fill',function(d){return color(d.Doping !="")})
    .on('mouseover',function(d){
        tooltip.style('opacity',.9)
        tooltip.attr('data-year',d.Year)
        tooltip.html(d.Name + ": " + d.Nationality + "<br/>"
              + "Year: " +  d.Year + ", Time: " + timeFormat(d.Time) 
              + (d.Doping?"<br/><br/>" + d.Doping:""))
            .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
    })
    
    .on('mouseout', function(d){
        tooltip.style('opacity',0);
    });
    var legendContainer = svgContainer.append("g")
    .attr("id", "legend");

var legend = legendContainer.selectAll("#legend")
.data(color.domain())
.enter().append("g")
.attr("class", "legend-label")
.attr("transform", function(d, i) {
  return "translate(0," + (height/2 - i * 20) + ")";
});

legend.append("rect")
.attr("x", width - 18)
.attr("width", 18)
.attr("height", 18)
.style("fill", color);

legend.append("text")
.attr("x", width - 24)
.attr("y", 9)
.attr("dy", ".35em")
.style("text-anchor", "end")
.text(function(d) {
  if (d) return "Riders with doping allegations";
  else {
    return "No doping allegations";
  };
});

})