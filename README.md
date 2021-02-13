# Data Journalism and D3

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

Analyze the current trends shaping people's lives, as well as creating charts, graphs, and interactive elements to help newspaper readers understand observed trends.

This project focuses on understanding health risks facing particular demographics. The analysis requires sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set is based on 2014 ACS 1-year estimates from the [US Census Bureau](https://data.census.gov/cedsci/). The current data set includes data on rates of income, obesity, poverty, etc. by state.


## Task

### Core Assignment:

![4-scatter](Images/4-scatter.jpg)

Create a scatter plot between two of the data variables. This project analyzes `Poverty vs. Smokers`.

Using D3 techniques, create a scatter plot that represents each state with circle elements. Code this graphic in the `app.js` file of your homework directory—make sure you pull in the data from `data.csv` by using the `d3.csv` function.

* Include state abbreviations in the circles.

* Create and situate your axes and labels to the left and bottom of the chart.

* Note: `python -m http.server` is used to run the visualization. This will host the page at `localhost:8000` in your web browser.

- - -

### Bonus: 


#### 1. More Data, More Dynamics

Include more demographics and more risk factors. Place additional labels in scatter plot and give them click events so that users can decide which data to display. Animate the transitions for circles' locations as well as the range of axes.


#### 2. Incorporate d3-tip

Implement D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to circles and display each tooltip with the data that the user has selected. Utilizes the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged).

- - -

### Technologies

* D3

* SVG

*JavaScript

* HTML

