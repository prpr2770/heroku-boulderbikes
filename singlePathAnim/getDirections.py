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
    src_latlng = (39.7444271, -104.9963919)
    dest_latlng = (39.7502833, -104.9983545)


    # obtain the directions on road-driving.
    gmaps = googlemaps.Client(key=direction_googlemaps_api_key)
    directions_result = gmaps.directions(src_latlng, dest_latlng, mode="driving") #bicycling
    print directions_result

    with open('./test1_gmaps_directions.json', 'w') as outfile:
        json.dump(directions_result, outfile)

    # ==========================================================================
    # extract the overview_polyline and then decode_it_into points.
    print("++++++++++++++++++++++++++++++++++++++")

    list_of_features = []
    for result in directions_result:
        polyline = result["overview_polyline"]["points"]
        latlngs = decode_line(polyline)

        # -----------------------------------------------------
        # create strings: to append into JSON file.
        lnglats_lineString = "["
        for (lat,lng) in latlngs:
            lnglats_lineString = lnglats_lineString + "[" + str(lng) +"," + str(lat) + "],"

        # remove last comma
        lnglats_lineString = lnglats_lineString[:-1] + "]"
        result["overview_polyline"]["lineString"] = lnglats_lineString

        # ------------------------------------------------------------
        # create GeoJSON file

        # TODO: extract properties to add into feature!
        # NOTE: Geometry Elements are stored as LONGITUDE-LATITUDE coordinates
        lnglats = [(lng,lat) for (lat,lng) in latlngs]
        a_feature = Feature( geometry=LineString(lnglats) )
        list_of_features.append(a_feature)


    # Create FeatureCollection!
    feature_collection = FeatureCollection(list_of_features)

    # ==========================================================================
    # export updated JSON file
    with open('./test2_gmaps_directions.json', 'w') as outfile1:
        json.dump(directions_result, outfile1,indent=4, sort_keys=False)

    # Export GEO-JSON

    with open('./test3_visAnimateTrip.json', 'w') as outfile2:
        #feature_collection_dump = geojson.dumps(feature_collection)
        #json.dump(feature_collection_dump, outfile2)
        outfile2.write(json.dumps(feature_collection,sort_keys=False))
