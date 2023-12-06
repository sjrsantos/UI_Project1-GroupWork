function createLineChart(dataUrl, containerId) {
  // Load and parse the CSV data
  d3.csv(dataUrl).then(function (data) {
    // Map data to the desired format
    var formattedData = data.map(function (d) {
      return {
        Year: +d.Year,
        "T-Series": +d["T-Series"],
        "ABCkidTV - Nursery Rhymes": +d["ABCkidTV - Nursery Rhymes"],
        "SET India": +d["SET India"],
        PewDiePie: +d.PewDiePie,
        MrBeast: +d.MrBeast,
      };
    });

    // Set the dimensions of the chart
    var width = 800;
    var height = 400;

    // Define the dimensions of the chart
    var margin = { top: 30, right: 30, bottom: 70, left: 90 };

    // Define a custom color scale
    var colorScale = d3
      .scaleOrdinal()
      .domain(Object.keys(formattedData[0]).slice(1))
      .range(["#66d7d1", "#26a69a", "#f34213", "#272932", "#ffbd59"]);

    // Create an SVG element within the specified container
    var svg = d3
      .select("#chart-container4")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales for 'views' data
    var xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(formattedData, function (d) {
          return d.Year;
        })
      )
      .range([0, width - margin.left - margin.right]);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(formattedData, function (d) {
          return d3.max(Object.values(d).slice(1));
        }),
      ])
      .range([height - margin.top - margin.bottom, 0]);

    // Create lines for each channel
    var channels = Object.keys(formattedData[0]).slice(1);

    channels.forEach(function (channel) {
      var channelLine = d3
        .line()
        .x(function (d) {
          return xScale(d.Year);
        })
        .y(function (d) {
          return yScale(d[channel]);
        });

      svg
        .append("path")
        .data([formattedData])
        .attr("class", "line")
        .attr("d", channelLine)
        .style("stroke", colorScale(channel))
        .style("fill", "none")
        .style("stroke-width", 2); // Ajuste conforme necessário
    });

    // Create X axis with year format
    var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d"));

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
      .attr("x", width / 2.5)
      .attr("y", height + margin.top + -90)
      .style("text-anchor", "middle")
      .text("YEAR");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 3)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("AVG VIEWS");

    // Add a legend to the chart
    var legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        "translate(" + (margin.left - 70) + "," + (margin.top - 30) + ")"
      );

    var legendItems = legend
      .selectAll(".legend-item")
      .data(channels)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legendItems
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) {
        return colorScale(d);
      });

    legendItems
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d) {
        return d;
      });
  });
}

createLineChart("./Charts/avg_view_every_year.csv", "#chart-container");
