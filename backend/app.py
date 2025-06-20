from flask import Flask, jsonify, request
from db import get_recent_crashes
from model import predict_severity
from flask_cors import CORS
from geo_utils import make_geodf_from_crash_data, filter_by_bbox_coords

from werkzeug.exceptions import Forbidden
import csv


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
@app.route("/api/crashes")
def crashes():
    borough = request.args.get("borough")
    bbox = request.args.get("bbox")

    data = get_recent_crashes(limit=1000)
    df = pd.DataFrame(data)

    if borough:
        df = filter_by_borough(df, borough)

    if bbox:
        gdf = make_geodf_from_crash_data(df)
        gdf = filter_by_bbox_coords(gdf, bbox)
        df = pd.DataFrame(gdf.drop(columns="geometry"))

    return jsonify(df.to_dict(orient="records"))


@app.route("/api/predict", methods=["POST"])
def predict():
    input_data = request.get_json()
    prediction = predict_severity(input_data)
    return jsonify({"predicted_severity": prediction})

@app.route("/api/admin/upload", methods=["POST"])
def admin_upload():
    # For security: simple token check
    token = request.args.get("token")
    if token != os.getenv("ADMIN_TOKEN"):
        raise Forbidden("Invalid token")

    try:
        with open("crash_data_cleaned.csv", "r") as f:
            reader = csv.DictReader(f)
            conn = psycopg2.connect(DATABASE_URL)
            cur = conn.cursor()
            for row in reader:
                cur.execute("""
                    INSERT INTO crash_data (
                        crash_date, borough, latitude, longitude,
                        number_of_persons_injured, contributing_factor_vehicle_1
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    row["crash_date"],
                    row["borough"],
                    float(row["latitude"]),
                    float(row["longitude"]),
                    int(row["number_of_persons_injured"]),
                    row["contributing_factor_vehicle_1"]
                ))
            conn.commit()
            cur.close()
            conn.close()
            return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/crashes")
def get_crashes():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        SELECT crash_date, borough, latitude, longitude, number_of_persons_injured, contributing_factor_vehicle_1
        FROM crash_data
        LIMIT 500;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([
        {
            "crash_date": row[0],
            "borough": row[1],
            "latitude": row[2],
            "longitude": row[3],
            "number_of_persons_injured": row[4],
            "contributing_factor_vehicle_1": row[5]
        }
        for row in rows
    ])


@app.route("/api/crashes/bbox")
def crashes_bbox():
    args = request.args
    min_lon, min_lat, max_lon, max_lat = map(float, [
        args.get("min_lon"), args.get("min_lat"),
        args.get("max_lon"), args.get("max_lat")
    ])
    data = get_crashes_in_bbox(min_lon, min_lat, max_lon, max_lat)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
