from flask import Flask, jsonify, request
from db import get_recent_crashes
from model import predict_severity

app = Flask(__name__)

@app.route("/api/crashes")
def crashes():
    data = get_recent_crashes(limit=100)
    return jsonify(data)

@app.route("/api/predict", methods=["POST"])
def predict():
    input_data = request.get_json()
    prediction = predict_severity(input_data)
    return jsonify({"predicted_severity": prediction})

if __name__ == "__main__":
    app.run(debug=True)
