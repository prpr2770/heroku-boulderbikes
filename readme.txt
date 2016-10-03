# creating the web-app for the boulder b-bikes project:

# Previous Work Done:

http://www.scribblelive.com/blog/2013/08/28/visualizing-bike-share-programs/



Refernce: http://babs.virot.me/
We bring together different pieces of information that are of interest to the system operator as well as its customers.

TRIP STATS
Total number of trips from one station to another, proportion of trips made by subscribers, and trip distributions over time

AVALABILITY
Average number of bikes/docks and usage patterns (i.e., number of incoming and outgoing trips) at each station.

BIKE ROUTES
Directions from one station to another along with the elevation profile. (Directions courtesy of MapQuest)

With the interactive map, you can easily explore stations in your neighborhood and compare one station with another station nearby (or farther away). Here are some of the interesting questions that can be addressed using this tool.

For operator/transportation planner:

    From a given station, were there fewer trips to stations farther away?
    Which areas attract more tourists/commuters? (based on the proportation of trips by subscribers)
    How does bike availability of neighboring stations compare? Is a customer likely to find a bike at the nearest station if his/her preferred station is full?
    Does a station have imbalanced usage pattern at a certain time of day, which may lead to a full or empty station?
    For a given pair of stations, were there more trips in the downhill direction?
    Based on the nearby photos, what are the trending places or events that may generate a spike in demand? Are there any interesting businesses we might want to partner with?

For customers:

    From my home station, where do other customers bike to?
    How likely will I find an available dock at a station?
    How to bike from one station to another? Is it difficult?
    What are fun things to do around a station?

# ---------------------------------------------------------------------------------------

# My visualization project:

Assuming that the day starts at 0600(dawn) and ends at 1800(dusk) - Map-coloration varies.
Identify the hours of the days when different stations are busiest.
Identify the trips that start and end at the same station.
Identify the trips that start and end at different stations.

Indicate direction routes between the stations


# Map TILES: ref: http://leaflet-extras.github.io/leaflet-providers/preview/

1. Stamen-Watercolor:
var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});

2. Determining path between two points:
http://bl.ocks.org/mbostock/1705868 : Point-along-path interpolation
http://bl.ocks.org/mbostock/5649592 : Stroke-Dash Interpolation
https://bl.ocks.org/mbostock/3916621 : Path Tweening
https://bl.ocks.org/mbostock/3081153 : Circular shape tweening


reference to svg-path: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths


3. http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/
https://developers.google.com/maps/documentation/utilities/polylineutility
http://zevross.com/blog/2014/09/23/convert-google-directions-to-geojson-points-or-polylines/


https://github.com/googlemaps/google-maps-services-python/tree/master/test

http://chriswhong.com/data-visualization/taxitechblog1/
http://chriswhong.com/open-data/taxi-techblog-2-leaflet-d3-and-other-frontend-fun/
http://nyctaxi.herokuapp.com/


4. GoogleAPI References:
https://developers.google.com/maps/documentation/directions/intro#TravelModes
https://developers.google.com/maps/documentation/utilities/polylinealgorithm?csw=1
https://developers.google.com/maps/documentation/utilities/polylineutility


(SRC,DEST) -> routes.JSON from GOOGLE_API
  -> overview_polyline: >> parse it to remove the '\\' and replace by '\'
  -> decode,encode programmatically:   https://github.com/googlemaps/google-maps-services-python
  -> createGeojson() decodes the polyline for each trip and downtime, and creates a properly formatted geoJSON LineString.
  >  These are pushed to a featureCollection, and that featureCollection is sent back to the browser as a response.
