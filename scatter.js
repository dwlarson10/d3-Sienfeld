

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
.text('Select X-Axis variable: ')
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
  .text('Select Y-Axis variable: ')
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
  d3.min([0,d3.min(data,function (d) { return d['postive'] })]),
  d3.max([0,d3.max(data,function (d) { return d['positive'] })])
  ])
.range([0,w])
var yScale = d3.scale.linear()
.domain([
  d3.min([0,d3.min(data,function (d) { return d['positive'] })]),
  d3.max([0,d3.max(data,function (d) { return d['positive'] })])
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
  .attr('cx',function (d) { return xScale(d['positive']) })
  .attr('cy',function (d) { return yScale(d['positive']) })
  .attr('r','5')
  .attr('stroke','black')
  .attr('stroke-width',1)
  .attr('fill',function (d,i) { return colorScale(i) })
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
  .text(function (d) {return '\nepisode: '+ d['episode'] + ' '  + d['title']  +
                       '\nAverage positives: ' + d['positive'] +
                       '\nAverage negative sentiment in lines: ' + d['negative'] +
                       '\nMax Drawdown: ' + d['Maximum Drawdown'] })
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
  .text('positive')
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
  .text('positive')

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
    .attr('cy',function (d) { return yScale(d[value]) })
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
render();

function render() {

    //get dimensions based on window size
    updateDimensions(window.innerWidth);

    //update x and y scales to new dimensions
    x.range([0, width]);
    y.range([height, 0]);

    touchScale.domain([0,width]).range([0,data.length-1]).clamp(true);

    //update svg elements to new dimensions
    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);

    chartWrapper
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //update the axis and line
    xAxis.scale(x);
    yAxis.scale(y).orient(window.innerWidth < breakPoint ? 'right' : 'left');

    if(window.innerWidth < breakPoint) {
      xAxis.ticks(d3.time.month, 2)
    }
    else {
      xAxis.ticks(d3.time.month, 1)
    }

    svg.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.select('.y.axis')
      .call(yAxis);

    path.attr('d', line);
    renderLabels();
  }

  var labels = [
    {
      x: new Date('03-15-2014'),
      y: .17,
      text: 'Test Label 1',
      orient: 'right'
    },
    {
      x: new Date('11-20-2014'),
      y: .24,
      text: 'Test Label 2',
      orient: 'left'
    }
  ]

  function renderLabels() {

    var _labels = chartWrapper.selectAll('text.label');

    if(_labels[0].length > 0) {
      //labels already exist
      _labels
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return y(d.y) })
    }
    else {
      //append labels if function is called for the first time
      _labels
        .data(labels)
        .enter()
        .append('text')
        .classed('label', true)
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return y(d.y) })
        .style('text-anchor', function(d) { return d.orient == 'right' ? 'start' : 'end' })
        .text(function(d) { return d.text });
    }
  }

  function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = winWidth < breakPoint ? 0 : 50;
    margin.left = winWidth < breakPoint ? 0 : 50;
    margin.bottom = 50;

    width = winWidth - margin.left - margin.right;
    height = .7 * width;
  }

  function onTouchMove() {
    var xPos = d3.touches(this)[0][0];
    var d = data[~~touchScale(xPos)];

    locator.attr({
      cx : x(new Date(d.date)),
      cy : y(d.value)
    })
    .style('display', 'block');
  }

  return {
    render : render
  }

});
