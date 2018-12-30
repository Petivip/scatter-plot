
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

var margin = { left: 70,
  right: 30,
  top: 30,
  bottom: 30 };

width = 900,
height = 600;

var ft = d3.timeFormat("%M:%S");


var svgcont = d3.select("#gr").append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom).
append("g").
attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var tooltip = d3.select("#gr").append("div").
attr("class", "tooltip").
style("opacity", 0);

var xScale = d3.scaleLinear().range([0, width]);

var yScale = d3.scaleTime().range([0, height]);

function mouseoverhandler(d) {
  tooltip.style("opacity", 0.9);
  tooltip.html(d.Name + ":" + d.Nationality + "<br/>" +
  "Place:" + d.Place + ", Time:" + d.Time + "<br/>" + "Year: " + d.Year + "<br/><br/>" + d.Doping).

  style("left", d3.event.pageX + "px").
  style("top", d3.event.pageY - 28 + "px");
};

function mouseouthandler(d) {
  tooltip.style("opacity", 0);
}

d3.json(url, callback);

function callback(error, data) {
  if (error) throw error;
  var parsedTime;
  data.forEach(function (d) {
    d.Place = +d.Place;
    var parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));

  });

  var yearmin = d3.min(data.map(function (d) {return d.Year - 1;}));
  var yearmax = d3.max(data.map(function (d) {return d.Year + 1;}));

  xScale.domain([yearmin, yearmax]);
  yScale.domain(d3.extent(data, function (d) {
    return d.Time;
  }));

  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  var yAxis = d3.axisLeft(yScale).tickFormat(ft);

  var x = svgcont.append("g").
  attr("class", "x-axis").
  attr("transform", "translate(0," + height + ")").
  call(xAxis);

  svgcont.append('text').
  attr('transform', 'rotate(0,0)').
  attr('x', width - 100).
  attr('y', height + 30).
  style('font-size', 25).
  text('Race Year');

  svgcont.append("g").
  attr("class", "y axis").
  attr("transform", "translate(0, 0)").
  call(yAxis);

  svgcont.append('text').
  attr('transform', 'rotate(-90)').
  attr('x', -130).
  attr('y', -40).
  style('font-size', 25).
  text('Race Time');

  svgcont.selectAll("circle").
  data(data).
  enter().
  append("circle").
  attr("class", "cir").
  attr("r", 6).
  attr("cx", function (d) {return xScale(d.Year);}).
  attr("cy", function (d) {return yScale(d.Time);}).
  attr("fill", function (d) {return d.Doping == "" ? "blue" : "red";}).
  on("mouseover", mouseoverhandler).
  on("mouseout", mouseouthandler);

  var dop = svgcont.append("g").
  attr("transform", "translate(" + (width - 150) + ", " + (height - 200) + ")").
  append("text").
  attr("x", 10).
  attr("y", 5).
  attr("fill", "red").
  text("* Doping allegations");
  var nondop = svgcont.append("g").
  attr("transform", "translate(" + (width - 150) + ", " + (height - 180) + ")").
  append("text").
  attr("x", 10).
  attr("y", 5).
  attr("fill", "blue").
  text("* Non-Doping allegations");

}