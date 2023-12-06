// Function to load and draw the chart
function drawChart6(selectedCountry) {
  // Clear the previous chart
  d3.select("#chart-container6 svg").remove();

  // Define dimensions and margins for the chart
  var margin = { top: 30, right: 30, bottom: 70, left: 100 };
  var width = 800 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // Create an SVG element within the chart-container6 div
  var svg = d3
    .select("#chart-container6")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the colors for the bars
  var colors = [
    "#66d7d1",
    "#26a69a",
    "#005d6aff",
    "#272932",
    "#ffa630",
    "#e87461",
    "#f34213",
  ];

  // Load data from the CSV file
  d3.csv("./Charts/top_100_youtubers.csv").then(function (data) {
    // Filter data for the selected country
    var filteredData = data.filter(function (d) {
      return d.Country.trim() === selectedCountry.trim();
    });

    // Create an object to count the number of channels by category
    var categoryCounts = {};
    filteredData.forEach(function (d) {
      var category = d.Category;
      if (category in categoryCounts) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    // Convert categoryCounts to an array of objects
    var nestedData = Object.keys(categoryCounts).map(function (key) {
      return { category: key, count: categoryCounts[key] };
    });

    // Sort data by count in descending order
    nestedData.sort(function (a, b) {
      return b.count - a.count;
    });

    // Set the title of the chart based on the selected country
    var chartTitle =
      "Number of YouTube Channels by Category in " +
      getCountryName(selectedCountry);
    d3.select("#chart-title6").text(chartTitle);

    // Create scales for the data
    var xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(nestedData, function (d) {
          return d.count;
        }),
      ])
      .range([0, width]);

    var yScale = d3
      .scaleBand()
      .domain(
        nestedData.map(function (d) {
          return d.category;
        })
      )
      .range([0, height])
      .padding(0.2);

    // Create bars for each category
    svg
      .selectAll("rect")
      .data(nestedData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) {
        return yScale(d.category);
      })
      .attr("width", function (d) {
        return xScale(d.count);
      })
      .attr("height", yScale.bandwidth())
      .style("fill", function (d, i) {
        return colors[i % colors.length]; // Apply colors based on index
      });

    // Create X axis
    var xAxis = d3.axisBottom(xScale).ticks(5);
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
      .attr("y", height + margin.top)
      .style("text-anchor", "middle")
      .text("Number of YouTube Channels");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Category");
  });
}

// Function to handle user input (country selection) for Chart 6
function handleUserInput(chartId) {
  // Get the selected country from the dropdown within this chart container
  var selectedCountry = document.getElementById("countrySelector6").value;

  // Call the updateChart function for the specified chart
  updateChart(selectedCountry, chartId);
}

// Function to update the chart based on the selected country for Chart 6
function updateChart(selectedCountry, chartId) {
  // Load and redraw the chart data for the selected country
  drawChart6(selectedCountry, chartId);
}

// Function to convert country codes to country names (you can extend this as needed)
function getCountryName(countryCode) {
  // Define a map of country codes to country names
  var countryNames = {
    IN: "India",
    US: "United States",
    BR: "Brazil",
    KR: "South Korea",
    CA: "Canada",
    MX: "Mexico",
    RU: "Russia",
    SV: "El Salvador",
    CL: "Chile",
    NO: "Norway",
    PR: "Puerto Rico",
    BY: "Belarus",
    PH: "Philippines",
    TH: "Thailand",
  };

  return countryNames[countryCode] || "Unknown";
}

// Set the default country and draw the initial chart for Chart 6
document.getElementById("countrySelector6").value = "IN";
drawChart6("IN", "chart6");
