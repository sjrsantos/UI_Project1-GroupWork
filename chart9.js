// Define the custom colors for bars
var barColors = [
  "#66d7d1",
  "#26a69a",
  "#005d6aff",
  "#272932",
  "#ffa630",
  "#e87461",
  "#f34213",
];

// Define the dimensions and margins for the chart
var margin = { top: 30, right: 30, bottom: 100, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3
  .select("#chart-container9")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data from the CSV file
d3.csv("./Charts/top_100_youtubers.csv")
  .then(function (data) {
    // Convert 'followers' to a number and find the maximum followers
    data.forEach(function (d) {
      d.followers = +d.followers;
    });

    // Sort the data by followers in descending order
    data.sort(function (a, b) {
      return b.followers - a.followers;
    });

    // Filter the data to only include the top 10 channels with the most followers
    var top10Data = data.slice(0, 10);

    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        top10Data.map(function (d) {
          return d.ChannelName;
        })
      )
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(top10Data, function (d) {
          return d.followers;
        }),
      ])
      .nice()
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(top10Data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.ChannelName);
      })
      .attr("y", function (d) {
        return y(d.followers);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.followers);
      })
      .attr("fill", function (d, i) {
        return barColors[i % barColors.length];
      });

    // Add Legend
    var legend = svg
      .selectAll(".legend")
      .data(top10Data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + (i * 20 + 10) + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 100)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) {
        return barColors[i % barColors.length];
      });

    legend
      .append("text")
      .attr("x", width - 80)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) {
        return d.ChannelName;
      });

    // Text indicating the channel with the most subscribers
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Channel with Most Subscribers: " + top10Data[0].ChannelName);
  })
  .catch(function (error) {
    console.error("Error loading or parsing data:", error);
  });
