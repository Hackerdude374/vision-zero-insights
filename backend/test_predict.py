import requests

url = "https://vision-zero-insights.onrender.com/api/predict"
data = {
    "borough": "QUEENS",
    "contributing_factor_vehicle_1": "Driver Inattention/Distraction"
}

response = requests.post(url, json=data)
print("Prediction:", response.json())
