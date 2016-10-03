queue()
.defer(d3.xml, "wiggle.svg", "image/svg+xml")
.await(ready);

function ready(error, xml) {

  //Adding our svg file to HTML document
  var importedNode = document.importNode(xml.documentElement, true);
  d3.select("#pathAnimation").node().appendChild(importedNode);

  var svg = d3.select("svg");

  var path = svg.select("path#wiggle").call(transition);
  var startPoint = pathStartPoint(path);

  var marker = svg.append("circle");
  marker.attr("r", 7)
    .attr("id", "marker")
    .attr("transform", "translate(" + startPoint + ")");

  //Get path start point for placing marker
  function pathStartPoint(path) {
    var d = path.attr("d"),
    dsplitted = d.split(" ");
    return dsplitted[1];
  }

  function transition(path) {
    path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash)
        .each("end", function() { d3.select(this).call(transition); });// infinite loop
  }

  function tweenDash() {
    /*
. The basic idea is this: SVG has a style property called stroke-dasharray which can be used to specify lengths of the alternating dashes and gaps that make up a line. So if you specify “5,5” you would have a line 5px long and then a gap 5px long and this pattern would be repeated. But what if you had an overall line/path that is 100px long and you specify “0,100”? You would have no line and a gap of 100px meaning — no line! How about if you specified an array of “1,100”? This would give you a line 1px long and a gap of 100px — since your line is only 100px long, though, in practice this would yield a gap of 99px. Then you can use “2,100”, “3,100” and so on to smoothly fill in the line. This is the idea behind these functions.
    */
        return function(t) {
    var l = path.node().getTotalLength();

    // we want something in the range "0,100" and "100,100" which is proportional to fraction of time-travelled. ; where LengthOfPath=100(say);
    var interpolate = d3.interpolateString("0," + l, l + "," + l); // interpolation of stroke-dasharray style attr
      var marker = d3.select("#marker");

      // t: fraction of time 0-1 since transition began
      // p : coordinates of point on path at a given length along the path.
      var p = path.node().getPointAtLength(t * l);

      // move marker to that point!
      marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker
      return interpolate(t);
    }
  }
}
