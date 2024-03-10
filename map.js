// Two-dimensional array data
const matrixData = [
  [3421, 3510, 3876, 3558, 3665],
  [5244, 4812, 3456, 3666, 5455],
  [3652, 3522, 3888, 3544, 5442],
  [5465, 3789, 3577, 5488, 3388],
  [5533, 5258, 5555, 3589, 5253],
];

let CFUWithTimestamps = [
  { date: new Date("2022-01-01"), value: 3600 },
  { date: new Date("2022-01-15"), value: 3700 },
  { date: new Date("2022-02-01"), value: 3900 },
  { date: new Date("2022-02-15"), value: 3600 },
  { date: new Date("2022-03-01"), value: 3700 },
  { date: new Date("2022-03-15"), value: 5200 },
];

// Set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = 450 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3
  .select(".map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Labels of row and columns -> the groups and variables of the heatmap
const myGroups = ["Maternity", "Surgical", "Medical", "ER", "Passway"]; // Columns
const myVars = ["W01", "W02", "W03", "W04", "W05"]; // Rows

// Build X scales and axis:
const xMap = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xMap))
  .selectAll("text")
  .style("font-size", "16px");

// Build Y scales and axis:
const yMap = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
svg
  .append("g")
  .call(d3.axisLeft(yMap))
  .selectAll("text")
  .style("font-size", "16px");

// Build color scale
const myColor = d3
  .scaleLinear()
  .range(["white", "#880808"])
  .domain([3000, 6600]);

// Convert the two-dimensional array into an array of objects for D3
const data = [];
matrixData.forEach((row, rowIndex) => {
  row.forEach((value, columnIndex) => {
    data.push({
      group: myGroups[columnIndex],
      variable: myVars[rowIndex],
      value: value,
    });
  });
});

// Select the tooltip div
const tooltip = d3.select("#tooltip");

// Use the converted data to create the heatmap
svg
  .selectAll()
  .data(data, function (d) {
    return d.group + ":" + d.variable;
  })
  .join("rect")
  .attr("x", function (d) {
    return xMap(d.group);
  })
  .attr("y", function (d) {
    return yMap(d.variable);
  })
  .attr("width", xMap.bandwidth())
  .attr("height", yMap.bandwidth())
  .style("fill", function (d) {
    return myColor(d.value);
  })
  // Existing attributes like 'x', 'y', 'width', 'height', 'fill', etc.
  .on("mouseover", function (event, d) {
    tooltip
      .style("visibility", "visible")
      .style("opacity", 1) // Make tooltip fully opaque
      .text(`Group: ${d.group}, Variable: ${d.variable}, Value: ${d.value}`);
    d3.select(this).style("stroke", "darkblue").style("stroke-width", 2);
  })
  .on("mousemove", function (event, d) {
    tooltip
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px");
  })
  .on("mouseout", function (event, d) {
    tooltip
      .style("opacity", 0) // Transition to transparent
      .transition()
      .delay(200)
      .style("visibility", "hidden"); // Hide tooltip after transition
    d3.select(this).style("stroke", "none").style("stroke-width", 0);
  })
  .on("click", function (event, d) {
    // Generate new random data
    const newData = CFUWithTimestamps.map((item) => ({
      date: item.date,
      value: item.value + Math.floor(Math.random() * 2000) - 1000, // Randomly adjust value
    }));

    // Update the area plot with this new data
    updateAreaPlot(newData);
  });

function updateAreaPlot(newData) {
  // Clear the existing area chart
  d3.select(".areaChart").select("svg").remove();

  const areaChart = d3
    .select(".areaChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Extracting dates fromnewData for the x-axis ticks
  const tickValues = newData.map((d) => d.date);

  // Set up x-axis as a time scale
  const x = d3
    .scaleTime()
    .domain(d3.extent(newData, (d) => d.date)) // Use the extent of dates from your data
    .range([0, width]);
  areaChart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(tickValues) // Use the dates from your data as tick values
        .tickFormat(d3.timeFormat("%b %d"))
    ); // Format ticks as 'Month day'

  // Set up y-axis as a linear scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(newData, (d) => d.value)]) // Use the max value for domain
    .range([height, 0]);

  areaChart.append("g").call(d3.axisLeft(y));

  // Define the area
  const area = d3
    .area()
    // .curve(d3.curveMonotoneX) //This makes the line smoother
    .x((d) => x(d.date)) // Position line based on date
    .y0(height)
    .y1((d) => y(d.value)); // Position line based on CFU value

  // Define the line
  const line = d3
    .area()
    // .curve(d3.curveMonotoneX) //This makes the line smoother
    .x((d) => x(d.date)) // Position line based on date
    .y0(height)
    .y1((d) => y(d.value)); // Position line based on CFU value

  // Draw the area
  areaChart
    .append("path")
    .datum(newData)
    .attr("fill", "#E97451") // Fill color for the area
    .attr("d", area);

  // Optionally, you can also include the line on top of the area
  areaChart
    .append("path")
    .datum(newData)
    .attr("fill", "none")
    .attr("stroke", "#AA4A44")
    .attr("stroke-width", 2)
    .attr("d", line); // Re-using the line generator for the boundary
}
