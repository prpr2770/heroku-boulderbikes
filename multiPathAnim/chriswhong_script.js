var timeFactor = 5; //number of minutes in real life to a second in the viz
$('.timeFactor').html(timeFactor); //Displays the timeFactor in the UI.
var tweenToggle = 0;
var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});


var topLeft, bottomRight;

var time = moment();
var map = L.map('map', {
    zoomControl: false
  })
  .addLayer(tiles)
  .setView([40.7127, -74.0059], 14);


var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  g = svg.append("g").attr("class", "leaflet-zoom-hide");

var transform = d3.geo.transform({
    point: projectPoint
  }),
  d3path = d3.geo.path().projection(transform);

var timer;

function updateTimer() {
  time.add('minutes', 1);
  $('.readableTime').text(time.format('h:mm a'));
  $('.date').text(time.format('dddd, MMMM Do YYYY'));
  timer = setTimeout(function() {
    updateTimer()
  }, (1000 / timeFactor));
}



d3.json('/trips', function(data) {

  console.log("Loaded data for medallion: " + data.features[0].properties.medallion);


  var feature = g.selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("class", function(d) { return d.properties.key})
    .attr("style", "opacity:0");

  // what are PointsArray?
  var pointsArray = [];
  var points = g.selectAll(".point")
                    .data(pointsArray);

  var marker = g.append("circle");
  marker.attr("r", 5)
    .attr("id", "marker");

  map.on("viewreset", reset);
  reset();

// =======================================================================
// Iterate()
  var i = 0;
  iterate()
                        function iterate() {

                                var chartInterval = 0;

                                var emptyData = [];


                                var path = svg.select("path.trip" + i)
                                .attr("style", "opacity:.7")
                                .call(transition);



                                function pathStartPoint(path) {
                                var d = path.attr('d');

                                dsplitted = d.split("L")[0].slice(1).split(",");
                                var point = []
                                point[0] = parseInt(dsplitted[0]);
                                point[1] = parseInt(dsplitted[1]);

                                return point;
                                }


                                var startPoint = pathStartPoint(path);
                                marker.attr("transform", "translate(" + startPoint[0] + "," + startPoint[1] + ")");


                                path.each(function(d) {

                                //add the translation of the map's g element
                                startPoint[0] = startPoint[0]; //+ topLeft[0];
                                startPoint[1] = startPoint[1]; //+ topLeft[1];
                                var newLatLon = coordToLatLon(startPoint);
                                pointsArray.push([newLatLon.lng, newLatLon.lat, d.properties.hasfare]);


                                points = g.selectAll(".point")
                                .data(pointsArray)
                                .enter()
                                .append('circle')
                                .attr("r", 5)
                                .attr("class", function(d) {
                                if (d[2]) {
                                return "startPoint point";
                                } else {
                                return "endPoint point";
                                }
                                })
                                .attr("transform", function(d) {
                                return translatePoint(d);
                                });

                                // display marker for given path
                                marker
                                .transition()
                                .duration(500)
                                .attr("r", 5)
                                .attr('style', 'opacity:1');

                                });




                                function transition(path) {

                                g.selectAll

                                path.transition()
                                    .duration(function(d) {
                                          //calculate seconds
                                          var start = Date.parse(d.properties.pickuptime),
                                          finish = Date.parse(d.properties.dropofftime),
                                          duration = finish - start;
                                          duration = duration / 60000; //convert to minutes
                                          duration = duration * (1 / timeFactor) * 1000;
                                          time = moment(d.properties.pickuptime.toString());
                                          $('.readableTime').text(time.format('h:mm a'));
                                          return (duration); })// end duration()
                                    .attrTween("stroke-dasharray", tweenDash);

                                i++; // increment count of path

                                var nextPath = svg.select("path.trip" + i);
                                consle.log("nextPath : " + nextPath)
                                if (nextPath[0][0] == null) { // what does this symbolize?
                                clearTimeout(timer);
                                } else {
                                iterate();
                                }


                              } // end transition()




                        } // end iterate()
// =======================================================================
    function tweenDash(d) {

      var l = path.node().getTotalLength();
      var i = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
      return function(t) {
            var marker = d3.select("#marker");
            var p = path.node().getPointAtLength(t * l);
            marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
            if (tweenToggle == 0) {
                tweenToggle = 1;
                var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
                map.panTo(newCenter, 14);
            } else {
                tweenToggle = 0;
            }
            return i(t);
            }
    } // end tweenDash

  }


  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = d3path.bounds(data);
    topLeft = bounds[0],
      bottomRight = bounds[1];

    svg.attr("width", bottomRight[0] - topLeft[0] + 100)
      .attr("height", bottomRight[1] - topLeft[1] + 100)
      .style("left", topLeft[0] - 50 + "px")
      .style("top", topLeft[1] - 50 + "px");

    g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

    feature.attr("d", d3path);

    // -------------------------------------------------------------------------
    // why update the Points?
    //TODO: Figure out why this doesn't work as points.attr...
    g.selectAll(".point")
      .attr("transform", function(d) {
        return translatePoint(d);
      });


  }




}); // end d3.json


// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}

function translatePoint(d) {
  var point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));

  return "translate(" + point.x + "," + point.y + ")";
}

function coordToLatLon(coord) {
  var point = map.layerPointToLatLng(new L.Point(coord[0], coord[1]));
  return point;
}
