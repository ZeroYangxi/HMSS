// import CFU30 from "./data.js";

// Declare the chart dimensions and margins.

const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3
  .scaleUtc()
  .domain([new Date("2023-01-01"), new Date("2024-01-01")])
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3
  .scaleLinear()
  .domain([0, 100])
  .range([height - marginBottom, marginTop]);

/* Implement bar chart */

const CFU30 = [3355, 3145, 3643, 3329, 3408, 5426, 5688];

let barHeight = 20;
let barChart = d3
  .select(".bar-chart")
  .selectAll("rect")
  .data(CFU30)
  .enter()
  .append("rect")
  .attr("width", function (d) {
    return d;
  }) //a function that takes a data point as an argument and returns that value.
  //the width of each bar will correspond to its value in the data array.
  .attr("height", barHeight - 1) // -1 create a gap between each bar
  .attr("transform", function (d, index) {
    return "translate(0," + index * barHeight + ")";
  })
  .attr("fill", function (d) {
    if (d < 200) return "green";
    else if (d < 500) return "yellow";
    else return "red";
  }); // each bar lays vertically not overlapping each other

/* Manually Input the file */

/* What we want is N
// N = 5a * 10^4 * (b * t)^(-1)
// a = count of colonies per petri dish
// b = area of dish surface (in cm2)
// t = exposure time
// N = michrobial CFU / m3 of indoor air */

/*
N 500~2000 high: yellow/orange
N > 2000 very high: red
N <500 expected, safe : green*/
