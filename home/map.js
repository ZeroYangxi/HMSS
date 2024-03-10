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
let margin = { top: 0, right: 50, bottom: 50, left: 0 },
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

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
  .selectAll("*")
  .style("opacity", 0); // Make the X axis invisible;

// Build Y scales and axis:
const yMap = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
svg.append("g").call(d3.axisLeft(yMap)).selectAll("*").style("opacity", 0); // Make the Y axis invisible;

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
  .style("opacity", 0.6)
  // Existing attributes like 'x', 'y', 'width', 'height', 'fill', etc.
  .on("mouseover", function (event, d) {
    tooltip
      .style("visibility", "visible")
      .style("opacity", 1) // Make tooltip fully opaque
      .text(`CFU: ${d.value}`);
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
    const clickedValue = d.value;
    const CFUalert = 2000;
    //alert
    if (d.value > CFUalert) {
      window.alert("CFU is too high!");
    }
    // Generate new random data
    // Generate new data, keeping the last value's value as the clicked value
    const newData = CFUWithTimestamps.map((item, index, array) => {
      if (index === array.length - 1) {
        // Check if it is the last item
        return { date: item.date, value: clickedValue }; // Set the last item's value to the clicked value
      } else if (item.date === "2022-03-15") {
        // Your original condition for a specific date, if needed
        return {
          /* some modification for this specific date */
        };
      } else {
        // For all other items, adjust the value randomly
        return {
          date: item.date,
          value: item.value + Math.floor(Math.random() * 2000) - 1000,
        };
      }
    });

    // Update the area plot with this new data
    updateAreaPlot(newData);
  });

function updateAreaPlot(newData) {
  let marginArea = { top: 0, right: 50, bottom: 50, left: 50 },
    widthArea = 400 - margin.left - margin.right,
    heightArea = 400 - margin.top - margin.bottom;
  // Clear the existing area chart
  d3.select(".areaChart").select("svg").remove();

  const areaChart = d3
    .select(".areaChart")
    .append("svg")
    .attr("width", widthArea + marginArea.left + marginArea.right)
    .attr("height", heightArea + marginArea.top + marginArea.bottom)
    .append("g")
    .attr("transform", `translate(${marginArea.left},${marginArea.top})`);

  // Extracting dates fromnewData for the x-axis ticks
  const tickValues = newData.map((d) => d.date);

  // Set up x-axis as a time scale
  const x = d3
    .scaleTime()
    .domain(d3.extent(newData, (d) => d.date)) // Use the extent of dates from your data
    .range([0, widthArea]);
  areaChart
    .append("g")
    .attr("transform", `translate(0,${heightArea})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(tickValues) // Use the dates from your data as tick values
        .tickFormat(d3.timeFormat("%b %d")) // Format ticks as 'Month day'
    )
    .selectAll("*") // Select all elements of the x-axis
    .attr("stroke", "#000000");

  // Set up y-axis as a linear scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(newData, (d) => d.value) * 1.2]) // Use the max value for domain
    // 将最大值乘以一个系数（如1.1）来留出额外空间
    .range([heightArea, 0]);

  areaChart
    .append("g")
    .call(d3.axisLeft(y))
    .selectAll("*") // Select all elements of the x-axis
    .attr("stroke", "#000000");

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
    .y0(heightArea)
    .y1((d) => y(d.value)); // Position line based on CFU value

  // Draw the area
  areaChart
    .append("path")
    .datum(newData)
    .attr("fill", "#ce9b9b")
    // Fill color for the area
    .attr("d", area)
    .attr("opacity", 0) // 初始设置为透明，准备动画
    .transition() // 开始动画
    .duration(1000) // 动画持续时间
    .attr("opacity", 1); // 动画结束时透明度变为1;

  // include the line on top of the area
  areaChart
    .append("path")
    .datum(newData)
    .attr("fill", "none")
    .attr("d", area)
    .attr("stroke", "#7a3e3e")
    .attr("stroke-width", 2)
    .attr("d", line);

  // add data-point
  areaChart
    .selectAll(".data-point")
    .data(newData)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", function (d) {
      return x(d.date);
    }) // x of the circle
    .attr("cy", function (d) {
      return y(d.value);
    }) // y
    .attr("r", 4) // radius of circle
    .style("fill", "#7a3e3e")
    .style("stroke", "#ffffff")
    .style("stroke-width", 1.5);

  // data-label text for each data point
  areaChart
    .selectAll(".data-label")
    .data(newData)
    .enter()
    .append("text") // 为每个数据点创建一个文本元素
    .attr("class", "data-label")
    .attr("x", function (d) {
      return x(d.date);
    }) // 设置文本的x坐标
    .attr("y", function (d) {
      return y(d.value) - 6;
    }) // 设置文本的y坐标，稍微向上偏移，以不遮挡数据点
    .text(function (d) {
      return d.value;
    }) // 设置文本内容为数据点的值
    .attr("text-anchor", "middle") // 文本对齐方式设置为中间，以使文本在数据点上方居中对齐
    .style("font-size", "12px") // 设置文本的字体大小
    .style("fill", "#333333"); // 设置文本的填充颜色
}
