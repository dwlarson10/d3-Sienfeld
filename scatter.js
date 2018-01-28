

d3.csv('episodes.csv',function (data) {
// CSV section
var body = d3.select('body')
var selectData = [ { "text" : "anger" },
                 { "text" : "anticipation" },
                 { "text" : "disgust" },
                 { "text" : "fear" },
                 { "text" : "joy" },
                 { "text" : "sadness" },
                 { "text" : "surprise" },
                 { "text" : "trust" },
                 { "text" : "negative" },
                 { "text" : "positive" },
               ]

// Select X-axis Variable
var span = body.append('span')
.text('Choose an emotion for x-axis?: ')
var yInput = body.append('select')
  .attr('id','xSelect')
  .on('change',xChange)
.selectAll('option')
  .data(selectData)
  .enter()
.append('option')
  .attr('value', function (d) { return d.text })
  .text(function (d) { return d.text ;})
body.append('br')

// Select Y-axis Variable
var span = body.append('span')
  .text('Choose an emotion for y-axis:  ')
var yInput = body.append('select')
  .attr('id','ySelect')
  .on('change',yChange)
.selectAll('option')
  .data(selectData)
  .enter()
.append('option')
  .attr('value', function (d) { return d.text })
  .text(function (d) { return d.text ;})
body.append('br')

// Variables
var body = d3.select('body')
var margin = { top: 50, right: 50, bottom: 50, left: 50 }
var w = window.innerWidth - margin.left - margin.right
var h = .7 * w - margin.top - margin.bottom

var formatPercent = d3.format('.2%')
// Scales
var colorScale = d3.scale.category20()
var xScale = d3.scale.linear()
.domain([
  d3.min([0,d3.min(data,function (d) { return d['joy'] })]),
  d3.max([0,d3.max(data,function (d) { return d['trust'] })])
  ])
.range([0,w])
var yScale = d3.scale.linear()
.domain([
  d3.min([0,d3.min(data,function (d) { return d['joy'] })]),
  d3.max([0,d3.max(data,function (d) { return d['trust'] })])
  ])
.range([h,0])
// SVG
var svg = body.append('svg')
  .attr('height',h + margin.top + margin.bottom)
  .attr('width',w + margin.left + margin.right)
.append('g')
  .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
// X-axis
var xAxis = d3.svg.axis()
.scale(xScale)
//.tickFormat(formatPercent)
.ticks(5)
.orient('bottom')
// Y-axis
var yAxis = d3.svg.axis()
.scale(yScale)
//.tickFormat(formatPercent)
.ticks(5)
.orient('left')



// Circles
var circles = svg.selectAll('circle')
  .data(data)
  .enter()
.append('circle')
  .attr('cx',function (d) { return xScale(d['joy']) })
  .attr('cy',function (d) { return yScale(d['trust']) })
  .attr('r','5')
  .attr('stroke','black')
  .attr('stroke-width',1)
  .attr("data-legend",function(d) { return "Season: " + d.season})
  .attr('fill',function (d,i) { return colorScale(d['season']) })
  .on('mouseover', function () {
    d3.select(this)
      .transition()
      .duration(500)
      .attr('r',20)
      .attr('stroke-width',3)
  })
  .on('mouseout', function () {
    d3.select(this)
      .transition()
      .duration(500)
      .attr('r',5)
      .attr('stroke-width',1)
  })
.append('title') // Tooltip
  .text(function (d) {return 'episode: '+ d['episode'] + ' '  + d['title']  +
                       '\nSeason: ' + d['season'] +
                       '\nCharacter with highest of x ' + 'data coming'
                       '\nCharacter with highest of y' + 'data coming' })
// X-axis
svg.append('g')
  .attr('class','axis')
  .attr('id','xAxis')
  .attr('transform', 'translate(0,' + h + ')')
  .call(xAxis)
.append('text') // X-axis Label
  .attr('id','xAxisLabel')
  .attr('y',-10)
  .attr('x',w)
  .attr('dy','.71em')
  .style('text-anchor','end')
  .text('joy')
// Y-axis
svg.append('g')
  .attr('class','axis')
  .attr('id','yAxis')
  .call(yAxis)
.append('text') // y-axis Label
  .attr('id', 'yAxisLabel')
  .attr('transform','rotate(-90)')
  .attr('x',0)
  .attr('y',5)
  .attr('dy','.71em')
  .style('text-anchor','end')
  .text('trust')


svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .attr("data-legend-pos","season")
    .style("font-size","12px")
    .call(d3.legend)


function yChange() {
var value = this.value // get the new y value
yScale // change the yScale
  .domain([
    d3.min([0,d3.min(data,function (d) { return d[value] })]),
    d3.max([0,d3.max(data,function (d) { return d[value] })])
    ])
yAxis.scale(yScale) // change the yScale
d3.select('#yAxis') // redraw the yAxis
  .transition().duration(1000)
  .call(yAxis)
d3.select('#yAxisLabel') // change the yAxisLabel
  .text(value)
d3.selectAll('circle') // move the circles
  .transition().duration(1000)
  .delay(function (d,i) { return i*10})
    .attr('cy',function (d) { return yScale(d[value])})

}

function xChange() {
var value = this.value // get the new x value
xScale // change the xScale
  .domain([
    d3.min([0,d3.min(data,function (d) { return d[value] })]),
    d3.max([0,d3.max(data,function (d) { return d[value] })])
    ])
xAxis.scale(xScale) // change the xScale
d3.select('#xAxis') // redraw the xAxis
  .transition().duration(1000)
  .call(xAxis)
d3.select('#xAxisLabel') // change the xAxisLabel
  .transition().duration(1000)
  .text(value)
d3.selectAll('circle') // move the circles
  .transition().duration(1000)
  .delay(function (d,i) { return i*10})
    .attr('cx',function (d) { return xScale(d[value]) })
  }
})
