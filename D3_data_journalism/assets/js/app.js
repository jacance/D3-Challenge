// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
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

// Initial parameters
var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

// Draw out axis with scale
// Create scale to calculate how to allocate the pixel values (chartWidth)
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) *.8,
        d3.max(data, d => d[chosenXAxis]) * 2.4
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
}

// Create scale to calculate how to allocate the pixel values (chartHeight)
function yScale(data, chosenYAxis) { 
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[chosenYAxis])])
    .range([chartHeight, 0]);

    return yLinearScale;
}



// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(raw) {
  console.log(raw);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    // raw.forEach(function(data) {
    //     data.poverty = +data.poverty;
    //     data.healthcare = +data.healthcare;
    //   });


    // Create axis on the chart
    var xLinearScale = xScale(raw, "poverty");
    var yLinearScale = yScale(raw, "healthcare")
    
    // Create ticks and markers along axis
    var bottomAxis = d3.axisBottom(xLinearScale); 
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // Append x axis then transform to put in correct place
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
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

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br> ${d.healthcare}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        attr("value", "poverty") // Value to grab for event listener
        .classed("active", true) // Active and initial parameter
        .text("In Poverty (%)");

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "16px")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

  
}).catch(function(error) {
console.log(error);
});
