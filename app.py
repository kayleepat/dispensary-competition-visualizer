from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import json


# from pathlib import Path
from sqlalchemy import create_engine, inspect
import pandas as pd

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///mmtc_dispensaries.sqlite")

################################################
# Flask Setup
################################################
app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/v1.0/geoJSON")
def geoJsonify():
    with engine.connect() as conn:
        result = conn.execute('SELECT * FROM geolocated_dispensaries')

        geoData = [dict(row) for row in result]
        
        geoJson = {
            "type": "FeatureCollection",
            "features": [
            {
                "type": "Feature",
                "geometry" : {
                    "type": "Point",
                    "coordinates": [d["longitude"], d["latitude"]],
                    },
                "properties" : d,
            } for d in geoData if (d['longitude'] != '' and d['latitude'] != '')]
        }

    return geoJson


if __name__ == '__main__':
    app.run(debug=True)

