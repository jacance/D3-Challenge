// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select div container and append SVG
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append "g" group to SVG area and shift/translate to margins set in chartMargin object 
var chartGroup = svg.append("g")
    // Transform to draw line from top left point, across to right, drawing big rectangle
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    
// Draw out axis with scale
// Create scale to calculate how to allocate the pixel values (900px)
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) *.8,
        d3.max(data, d => d[chosenXAxis]) * 2.4
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
}

// Create scale to calculate how to allocate the pixel values (600px)
function yScale(data, chosenYAxis) { 
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chosenYAxis])])
    .range([chartHeight, 0]);

    return yLinearScale;
}

var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(raw) {
  console.log(raw);

  // Create axis on the chart
  var xLinearScale = xScale(raw, "poverty");
  var yLinearScale = yScale(raw, "healthcare")
  
  // Create ticks and markers along axis
  var bottomAxis = d3.axisBottom(xLinearScale); 
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // Append x axis then transform to put in correct place
  var xAxis = chartGroup.append("g")
  
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
    
    // Append y axis
    chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(raw)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  
}).catch(function(error) {
console.log(error);
});
