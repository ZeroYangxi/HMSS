// Set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 30, left: 30 },
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
const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; // Columns
const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]; // Rows

// Build X scales and axis:
const xMap = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xMap));

// Build Y scales and axis:
const yMap = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
svg.append("g").call(d3.axisLeft(yMap));

// Build color scale
const myColor = d3.scaleLinear().range(["white", "#69b3a2"]).domain([1, 100]);

// Two-dimensional array data
const matrixData = [
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
  // Add rows as needed
];

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
  });
