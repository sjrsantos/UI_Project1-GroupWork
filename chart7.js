// Function to load and draw Chart7
function drawChart7() {
  // Clear the previous chart
  d3.select("#chart-container7 svg").remove();

  // Define dimensions and margins for the chart
  var margin = { top: 30, right: 30, bottom: 70, left: 100 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // Define custom colors for the bars
  var colors = [
    "#66d7d1",
    "#26a69a",
    "#005d6aff",
    "#272932",
    "#ffa630",
    "#e87461",
    "#f34213",
  ];

  // Create an SVG element within the chart-container7 div
  var svg = d3
    .select("#chart-container7")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Load data from the CSV file
  d3.csv("./Charts/top_100_youtubers.csv", function (d) {
    // Convert string numbers into actual integers
    d.followers = +d.followers;
    return d;
  }).then(function (data) {
    // Sort data by followers in descending order
    data.sort(function (a, b) {
      return b.followers - a.followers;
    });

    // Find the category with the most followers
    var maxFollowersCategory = data[0].Category; // After sorting, the first element has the most followers

    // Set the title of the chart
    var chartTitle =
      "Category with the Most Followers: " + maxFollowersCategory;
    d3.select("#chart-title7").text(chartTitle);

    // Create scales for the data
    var xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.followers;
        }),
      ])
      .range([0, width]);

    var yScale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.Category;
        })
      )
      .range([0, height])
      .padding(0.1);

    // Create a color scale that assigns a specific color to each unique category
    var colorScale = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d.Category;
        })
      )
      .range(colors);

    // Create bars for each category
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) {
        return yScale(d.Category);
      })
      .attr("width", function (d) {
        return xScale(d.followers);
      })
      .attr("height", yScale.bandwidth())
      .style("fill", function (d) {
        return colorScale(d.Category);
      });

    // Create X axis with formatted numbers
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".2s"));
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Create Y axis
    var yAxis = d3.axisLeft(yScale);
    svg.append("g").call(yAxis);

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom / 2)
      .style("text-anchor", "middle")
      .text("Total Followers");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Category");
  });
}

// Call the drawChart7 function to create the chart
drawChart7();
