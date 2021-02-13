// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 650;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 20,
  bottom: 60,
  left: 60
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


// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(raw) {
  console.log(raw);

    // Parse Data/Cast as numbers

    raw.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
      });
    
    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(raw, d => d.poverty) - 2,
        d3.max(raw, d => d.poverty) + 2
      ])
      .range([0, chartWidth]);
    
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(raw, d => d.smokes) + 2])
        .range([chartHeight, 0]);
    
    // Create ticks and markers along axis
    var bottomAxis = d3.axisBottom(xLinearScale); 
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append x axis then transform to put in correct place
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append x axis label
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("class", "aText")
        .text("In Poverty (%)")
    
    // Append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // Append y axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Smokes (%)")

    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(raw)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 15)
        .attr("fill", "lightblue")
        .attr("opacity", ".8");

    // Append state abbreviations to circles
    chartGroup.selectAll()
        .data(raw)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.smokes))
        .text(d => d.abbr)
        .attr("font-size", "10")
        .style("fill", "black")
        .classed("stateText", true)
        .attr("opacity", 0.75);
   


  
}).catch(function(error) {
console.log(error);
});