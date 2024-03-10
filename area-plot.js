const CFUWithTimestamps = [
  { date: new Date("2022-01-01"), value: 3600 },
  { date: new Date("2022-01-15"), value: 3700 },
  { date: new Date("2022-02-01"), value: 3900 },
  { date: new Date("2022-02-15"), value: 3600 },
  { date: new Date("2022-03-01"), value: 3700 },
  { date: new Date("2022-03-15"), value: 5200 },
];

const areaChart = d3
  .select("#lineChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Extracting dates from CFUWithTimestamps for the x-axis ticks
const tickValues = CFUWithTimestamps.map((d) => d.date);

// Set up x-axis as a time scale
const x = d3
  .scaleTime()
  .domain(d3.extent(CFUWithTimestamps, (d) => d.date)) // Use the extent of dates from your data
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
  .domain([0, d3.max(CFUWithTimestamps, (d) => d.value)]) // Use the max value for domain
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
  .datum(CFUWithTimestamps)
  .attr("fill", "pink") // Fill color for the area
  .attr("d", area);

// Optionally, you can also include the line on top of the area
areaChart
  .append("path")
  .datum(CFUWithTimestamps)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", line); // Re-using the line generator for the boundary
