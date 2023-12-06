// Encapsulated function to draw the chart for chart-container3
function drawChart3() {
  // Define the dimensions and margins for the chart
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // Remove any existing SVG to avoid duplicates when this function is called multiple times
  d3.select("#chart-container3 svg").remove();

  // Append the svg object to the specific div called 'chart-container3'
  var svg = d3
    .select("#chart-container3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define custom colors for bars
  var barColors = ["#66d7d1", "#26a69a", "#005d6aff", "#272932", "#ffa630"];

  // Load data from the CSV file
  d3.csv("./Charts/top_100_youtubers.csv")
    .then(function (data) {
      // Preprocess data to count YouTubers by Country
      var countsByCountry = {};
      data.forEach(function (d) {
        var country = d.Country;
        if (countsByCountry[country]) {
          countsByCountry[country]++;
        } else {
          countsByCountry[country] = 1;
        }
      });

      // Convert the counts to an array of objects
      var countryCounts = Object.keys(countsByCountry).map(function (key) {
        return { Country: key, Count: countsByCountry[key] };
      });

      // Sort the data by count in descending order
      countryCounts.sort(function (a, b) {
        return b.Count - a.Count;
      });

      // Create scales for the chart
      var xScale = d3
        .scaleBand()
        .domain(
          countryCounts.map(function (d) {
            return d.Country;
          })
        )
        .range([0, width])
        .padding(0.1);

      var yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(countryCounts, function (d) {
            return d.Count;
          }),
        ])
        .range([height, 0]);

      // Create bars for each Country with custom colors
      svg
        .selectAll(".bar")
        .data(countryCounts)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
          return xScale(d.Country);
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function (d) {
          return yScale(d.Count);
        })
        .attr("height", function (d) {
          return height - yScale(d.Count);
        })
        .attr("fill", function (d, i) {
          return barColors[i % barColors.length];
        });

      // Add X axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Add Y axis
      svg.append("g").call(d3.axisLeft(yScale));

      // Add Y axis label
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of YouTubers");

      // Add X axis label
      svg
        .append("text")
        .attr(
          "transform",
          `translate(${width / 2},${height + margin.top + 20})`
        )
        .style("text-anchor", "middle")
        .text("Country");

      // Add Legend
      var legend = svg
        .selectAll(".legend")
        .data(countryCounts)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + (i * 20 - 30) + ")";
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
          // Extract and display the first two letters of the country
          return d.Country.split(" ")
            .map((word) => word.slice(0, 2))
            .join("");
        });
    })
    .catch(function (error) {
      console.error("Error loading the CSV file: ", error);
    });
}

// Call the function to draw the chart
drawChart3();
