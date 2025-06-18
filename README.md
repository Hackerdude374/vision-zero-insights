# 🚦 Vision Zero Insights - Fullstack Crash Analytics Platform

Vision Zero Insights is a full-stack NYC traffic crash data analytics platform built to visualize, analyze, and predict crash patterns using open data, geospatial processing, and machine learning.

---

## 🌐 Project Overview

Vision Zero is a multi-agency effort in NYC aimed at eliminating traffic deaths and injuries. This app helps visualize the crash patterns spatially, explore contributing factors, and model injury severity for city analysts and transportation planners.

---

## 🧱 Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Mapbox GL JS
- **Backend:** Flask, Gunicorn, PostgreSQL + PostGIS, scikit-learn
- **Database Hosting:** Render PostgreSQL (cloud)
- **Backend Hosting:** Render (Flask API)
- **Frontend Hosting:** Vercel (React UI)

---

## ⚙️ Architecture

```
React + Vite (Vercel) ---> Flask API (Render) ---> PostgreSQL + PostGIS (Render DB)
                        ⇡                  ⇡
               Tailwind UI           Machine Learning (scikit-learn)
               Mapbox Markers       Geospatial Queries (PostGIS)
```

---

## 🌍 Data Source

- NYC OpenData: [Motor Vehicle Collisions](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95)

---

## 🔥 Key Features

1. **Interactive Mapbox Visualization**
2. **Crash Marker Clustering**
3. **ML Model to Predict Injury Severity**
4. **API Filtering (by borough, bounding box, etc)**
5. **Geo-enabled PostgreSQL for Spatial Queries**
6. **Live React Frontend with Tailwind Design**

---

## 📁 Project Structure

```
vision-zero-insights/
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── geo_utils.py
│   ├── db.py
│   └── upload_crash_data_to_render_PSQL.py
├── vision-zero-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── CrashMap.jsx
│   │   ├── api/
│   │   │   └── crashAPI.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── crash_data_cleaned.csv
├── README_General.txt
```

---

## 🧠 ML Pipeline

```python
# model.py
from sklearn.linear_model import LogisticRegression

# Train model on historical crash data to predict severity
model = LogisticRegression()
model.fit(X_train, y_train)
```

- Inputs: Number of people injured, borough, contributing factor
- Output: Severity label (low, moderate, high)

---

## 🗺️ Spatial DB (PostGIS)

```sql
-- Enables geospatial indexing and filtering
CREATE EXTENSION postgis;
SELECT * FROM crash_data WHERE ST_DWithin(geom, ST_MakePoint(...), radius);
```

---

## 🧪 Testing & Debugging

Use `console.log()` in frontend and `print()` in backend. Use browser dev tools, Flask debug, and Postman.

---

## 💡 Real World Problem Solved

This app empowers:
- 🚓 NYPD with crash heatmaps
- 🚑 EMS planning routes to high-risk zones
- 🏙️ NYC DOT to predict which streets need safety intervention