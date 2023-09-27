from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template


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

@app.route("/")
def index():
    with engine.connect() as conn:
        result = conn.execute('SELECT * FROM geolocated_dispensaries')

        data = [dict(row) for row in result]   

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)

