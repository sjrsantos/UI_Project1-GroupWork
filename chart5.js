function drawBarChart() {
  const customColors = ["#66d7d1", "#ffa630", "#26a69a", "#e87461"];
  // SVG setup
  const margin = { top: 40, right: 80, bottom: 40, left: 250 }, // Increased right margin for the legend
    width = 900 - margin.right - margin.left, // Increased SVG width
    height = 800 - margin.top - margin.bottom;

  const svg = d3
    .select("#chart-container5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Reading the CSV file
  d3.csv("./Charts/top_100_youtubers.csv")
    .then(function (data) {
      // Assuming data columns: ChannelName, Income q1, Income q2, Income q3, Income q4

      // Data processing
      data.forEach((d) => {
        d["Income q1"] = +d["Income q1"];
        d["Income q2"] = +d["Income q2"];
        d["Income q3"] = +d["Income q3"];
        d["Income q4"] = +d["Income q4"];
      });

      // Sort channels by total annual income and select top 5
      data.sort(
        (a, b) =>
          b["Income q1"] +
          b["Income q2"] +
          b["Income q3"] +
          b["Income q4"] -
          (a["Income q1"] + a["Income q2"] + a["Income q3"] + a["Income q4"])
      );
      const topChannels = data.slice(0, 5);

      // Set up scales
      const xScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(topChannels, (d) =>
            d3.max([
              d["Income q1"],
              d["Income q2"],
              d["Income q3"],
              d["Income q4"],
            ])
          ),
        ])
        .range([0, width]);

      const yScale = d3
        .scaleBand()
        .range([0, height])
        .domain(topChannels.map((d) => d.ChannelName))
        .padding(0.1);

      const yAxis = d3.axisLeft(yScale);
      svg.append("g").call(yAxis);

      const xAxis = d3.axisBottom(xScale);
      svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

      // Drawing the bars
      const quarters = ["Income q1", "Income q2", "Income q3", "Income q4"];
      const barWidth = yScale.bandwidth() / quarters.length;

      quarters.forEach((quarter, index) => {
        svg
          .selectAll(`.bar-${quarter}`)
          .data(topChannels)
          .enter()
          .append("rect")
          .attr("class", `bar-${quarter}`)
          .attr("x", (d) => xAxis)
          .attr("y", (d) => yScale(d.ChannelName) + barWidth * index)
          .attr("width", (d) => xScale(d[quarter]))
          .attr("height", barWidth)
          .attr("fill", customColors[index]); // Use custom colors
      });

      // Adding title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Top 5 YouTube Channels Quarterly Income");

      // Add legend
      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 80}, 10)`); // Adjust position as needed

      const quarter = ["Income q1", "Income q2", "Income q3", "Income q4"];

      quarters.forEach((quarter, index) => {
        const legendRow = legend
          .append("g")
          .attr("transform", `translate(0, ${index * 15})`);

        legendRow
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", customColors[index]);

        legendRow
          .append("text")
          .attr("x", 10) // Adjust the x-coordinate for text
          .attr("y", 10)
          .attr("text-anchor", "start")
          .style("text-transform", "capitalize")
          .text(quarter);
      });
    })
    .catch(function (error) {
      console.error("Error: ", error);
    });
}

drawBarChart();
