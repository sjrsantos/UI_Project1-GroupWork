// Function to draw the pie chart
function drawChart() {
  // Get width and height from the current browser viewport
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Calculate available width for the chart
  const chartWidth = width * 0.4; // Adjust as needed
  const chartHeight = height * 0.4; // Adjust as needed

  // Calculate the position of the chart and legend
  const chartX = chartWidth / 2; // Center the chart horizontally
  const chartY = chartHeight / 2; // Center the chart vertically
  const legendX = chartWidth + 20; // Position the legend to the right of the chart
  const legendY = 20; // Adjust as needed for the legend's vertical position

  // Define the custom colors
  const customColors = [
    "#66d7d1",
    "#26a69a",
    "#005d6aff",
    "#272932",
    "#ffa630",
    "#e87461",
    "#f34213",
  ];

  // Remove any existing SVG to avoid duplicates upon resizing
  d3.select("#chart-container1 svg").remove();

  // Create SVG container for the chart
  const svg = d3
    .select("#chart-container1")
    .append("svg")
    .attr("width", chartWidth + 200) // Adjust for the legend width
    .attr("height", chartHeight);

  // Reading the CSV file
  d3.csv("./Charts/top_100_youtubers.csv")
    .then(function (data) {
      // Process data to count categories
      let categoryCounts = {};
      data.forEach(function (row) {
        let category = row["Category"];
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      // Create a pie generator
      const pie = d3.pie().value((d) => d[1]);
      const dataReady = pie(Object.entries(categoryCounts));

      // Calculate the radius of the pie chart based on the available width and height
      const radius = Math.min(chartWidth, chartHeight) / 2 - 40;

      // Build and position the pie chart
      const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
      const pieChart = svg
        .append("g")
        .attr("transform", `translate(${chartX}, ${chartY})`);

      const arcs = pieChart
        .selectAll("path")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => customColors[i % customColors.length]) // Use custom colors
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

      // Legend setup
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendX}, ${legendY})`);

      const legendItems = legend
        .selectAll(".legend-item")
        .data(dataReady)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legendItems
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", (d, i) => customColors[i % customColors.length]); // Use custom colors

      legendItems
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text((d) => d.data[0]);
    })
    .catch(function (error) {
      console.error("Error loading the CSV file:", error);
    });
}

// Initial call to draw the chart
drawChart();

// Redraw the chart every time the window is resized
window.addEventListener("resize", drawChart);
