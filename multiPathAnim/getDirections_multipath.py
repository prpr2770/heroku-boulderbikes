# getDirections.py opens our bigQuery results CSV, builds out API calls, and appends the appropriate polylines to the raw data.



# Python Referecnce; GoogleMaps Module:  https://github.com/googlemaps/google-maps-services-python

import googlemaps
from datetime import datetime

import json
import geojson
from geojson import Point, MultiPoint, LineString, Feature, FeatureCollection

# decoding the polyline info.
from decode_polyline import *

if __name__=="__main__":

    # parameters
    direction_googlemaps_api_key = 'AIzaSyA0e52hF_LtgxWIJsSnJBybIl1GhJzVsWU'

    src_dest_pairs = []
    """
    Twenty Ninth Street South  40.0161	-105.25807
    15th & Pearl	40.018721	-105.27584
    10th & Walnut	40.016219	-105.282148
    13th & Spruce	40.01909	-105.278898



    """
    src_latlng = (40.0161, -105.25807)
    dest_latlng = (40.018721, -105.27584)

    src_dest_pairs.append((src_latlng,dest_latlng))

    src_latlng = (40.016219, -105.282148)
    dest_latlng = (40.01909, -105.278898)

    src_dest_pairs.append((src_latlng,dest_latlng))

    # obtain the directions on road-driving.
    gmaps = googlemaps.Client(key=direction_googlemaps_api_key)
    list_of_features = []


for (src_latlng, dest_latlng) in src_dest_pairs:
    directions_result = gmaps.directions(src_latlng, dest_latlng, mode="driving") #bicycling

    for result in directions_result:
        polyline = result["overview_polyline"]["points"]
        latlngs = decode_line(polyline)

        # ------------------------------------------------------------
        # create GeoJSON file

        # TODO: extract properties to add into feature!
        # NOTE: Geometry Elements are stored as LONGITUDE-LATITUDE coordinates
        lnglats = [(lng,lat) for (lat,lng) in latlngs]
        a_feature = Feature( geometry=LineString(lnglats) )
        list_of_features.append(a_feature)


    # Create FeatureCollection!
    feature_collection = FeatureCollection(list_of_features)


    # Export GEO-JSON
    with open('./test_multipath_visAnimateTrip.json', 'w') as outfile2:
        #feature_collection_dump = geojson.dumps(feature_collection)
        #json.dump(feature_collection_dump, outfile2)
        outfile2.write(json.dumps(feature_collection,sort_keys=False))
