// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 90,
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
        d3.max(data, d => d[chosenXAxis]) * 1.2
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

// Function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
    
    console.log(circlesGroup)
  
    return circlesGroup;
  }


// Function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty (%): ";
    }
    else if (chosenXAxis === "age") {
      label = "Age: ";
    }
    else if (chosenXAxis === "income") {
      label = "Household Income (Median): $";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${label}${d[chosenXAxis]}<br>Lacks Healthcare (%): ${d.healthcare}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this); // Needs 'this' as second argument otherwise error
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return circlesGroup;
}


// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(raw) {
  console.log(raw);

    // Parse Data/Cast as numbers
    raw.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age
      });
    
    // xLinearScale function above csv import
    var xLinearScale = xScale(raw, chosenXAxis);
    
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(raw, d => d.healthcare)])
        .range([chartHeight, 0]);
    
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

        // Append state abbreviations to circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(raw)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "lightblue")
        .attr("opacity", ".8");


    // Create group for x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // Value to grab for event listener
        .classed("active", true) // Active and initial parameter
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // Value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

      var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // Value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)")

    
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)")

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)")

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    
    // chartGroup.call(toolTip);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function(){
          var value = d3.select(this).attr("value");
          if (value !== chosenXAxis) {

            chosenXAxis = value;

            xLinearScale = xScale(raw, chosenXAxis);

            xAxis = renderAxes(xLinearScale, xAxis);

            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


            
            // Conditions to set active label on click
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false)
                ageLabel
                    .classed("active", false)
                    .classed ("inactive", true)
                incomeLabel
                    .classed("active", false)
                    .classed ("inactive", true)
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true)
                ageLabel
                    .classed("active", true)
                    .classed ("inactive", false)
                incomeLabel
                    .classed("active", false)
                    .classed ("inactive", true)
            }
            else if (chosenXAxis === "income") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true)
                ageLabel
                    .classed("active", false)
                    .classed ("inactive", true)
                incomeLabel
                    .classed("active", true)
                    .classed ("inactive", false)
            }
          }
        })


  
}).catch(function(error) {
console.log(error);
});