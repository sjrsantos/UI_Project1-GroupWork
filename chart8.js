function drawChart8() {
  // Load and parse the CSV data
  d3.csv("./Charts/top_100_youtubers.csv").then(function (data) {
    // Group data by country and count the occurrences
    var countryCounts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.Country
    );

    // Sort the countryCounts by count in descending order and take the top 3
    var sortedCounts = Array.from(countryCounts)
      .sort((a, b) => d3.descending(a[1], b[1]))
      .slice(0, 3);

    // Extract the top 3 countries and their counts
    var top3Countries = sortedCounts.map((d) => d[0]);
    var top3Counts = sortedCounts.map((d) => d[1]);

    // Set the dimensions of the chart
    var width = 700;
    var height = 600;

    // Define the dimensions of the chart
    var margin = { top: 30, right: 30, bottom: 70, left: 50 };

    // Create custom colors for bars
    var barColors = [
      "#66d7d1",
      "#26a69a",
      "#005d6aff",
      "#272932",
      "#ffa630",
      "#e87461",
      "#f34213",
    ];

    // Create an SVG element within the "chart-container8" div
    var svg = d3
      .select("#chart-container8")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales for 'followers' data
    var xScale = d3
      .scaleLinear()
      .domain([0, d3.max(top3Counts)]) // Adjusted the domain
      .range([0, width - margin.left - margin.right]);

    var yScale = d3
      .scaleBand()
      .domain(top3Countries)
      .range([0, height - margin.top - margin.bottom])
      .padding(0.2); // Adjusted padding to make bars more narrow

    // Create bars for each country
    var bars = svg
      .selectAll("rect")
      .data(top3Counts)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return yScale(top3Countries[i]);
      })
      .attr("width", function (d) {
        return xScale(d);
      })
      .attr("height", yScale.bandwidth())
      .style("fill", function (d, i) {
        return barColors[i % barColors.length];
      });

    // Add labels behind the bars
    svg
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)") // Rotate the text to be vertical
      .attr("x", -150) // Adjusted the x position to be left of the bars
      .attr("y", -margin.left) // Adjusted the y position to be at the top of the chart
      .attr("dy", "1em")
      .style("text-anchor", "center")
      .style("font-size", "14px")
      .text("Country");

    // Create X axis
    var xAxis = d3.axisBottom(xScale).ticks(5);
    svg
      .append("g")
      .attr(
        "transform",
        "translate(0," + (height - margin.top - margin.bottom) + ")"
      )
      .call(xAxis);

    // Create Y axis
    var yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 30)
      .style("text-anchor", "middle")
      .text("Number of YouTubers");

    // Add a title to the chart
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text(
        "Top 1 Country with the Most YouTubers in the Top 100: " +
          top3Countries[0]
      );

    // Add a legend
    var legend = svg
      .selectAll(".legend")
      .data(top3Countries)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + (i * 20 + 10) + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 30)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) {
        return barColors[i % barColors.length];
      });

    legend
      .append("text")
      .attr("x", width + 1)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) {
        return d;
      });
  });
}

// Call the function to draw the chart
drawChart8();
