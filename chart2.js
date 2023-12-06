// Load and parse the CSV data
d3.csv("./Charts/top_100_youtubers.csv").then(function (data) {
  // Set the dimensions of the chart
  var width = 1000;
  var height = 600;

  // Define the dimensions of the chart
  var margin = { top: 10, right: 30, bottom: 70, left: 100 };
  var width = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Create an SVG element within the "chart-container2" div
  var svg = d3
    .select("#chart-container2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Load data from a CSV file
  d3.csv("./Charts/top_100_youtubers.csv").then(function (data) {
    // Convert data types as needed
    data.forEach(function (d) {
      d.Likes = +d.Likes;
      d.followers = +d.followers;
    });

    // Create scales for 'Likes' and 'followers' data
    var xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.Likes;
        }),
      ])
      .range([0, width]);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.followers;
        }),
      ])
      .range([height, 0]);

    // Create circles for each data point
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(d.Likes);
      })
      .attr("cy", function (d) {
        return yScale(d.followers);
      })
      .attr("r", 5) // Radius of the circles
      .style("fill", "#66d7d1"); // Use the specified color

    // Create X and Y axes
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale).ticks(5);

    // Append X and Y axes to the chart
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g").call(yAxis);

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .style("text-anchor", "middle")
      .text("Likes");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Followers");
  });
});
