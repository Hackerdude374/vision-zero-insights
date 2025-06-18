# 🧠 Backend - Flask + ML + PostGIS API

---

## 🔧 Stack

- Flask
- Gunicorn (for production)
- psycopg2 (PostgreSQL driver)
- SQLAlchemy
- GeoPandas
- Scikit-Learn
- Render PostgreSQL
- PostGIS (for spatial filtering)

---

## 🔌 Endpoints

### `/api/crashes`
Returns full or filtered crash data

#### Optional Filters:
- `borough=MANHATTAN`
- `bbox=lng1,lat1,lng2,lat2` (bounding box)

```bash
GET /api/crashes?borough=BRONX
```

---

## 🧠 ML Model

### File: `model.py`

```python
from sklearn.linear_model import LogisticRegression

def train_model(data):
    X = data[["injuries", "borough"]]
    y = data["severity"]
    model = LogisticRegression().fit(X, y)
    return model
```

---

## 🌐 Flask Setup

### `app.py`

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/crashes")
def get_crashes():
    ...
```

---

## 📂 Other Key Files

- `geo_utils.py`: contains geospatial helpers like bounding box SQL
- `upload_crash_data_to_render_PSQL.py`: seeds Render DB with crash CSV
- `db.py`: establishes DB connection using `os.environ['DATABASE_URL']`

---

## 🧪 Local Testing

```bash
python app.py
```

- Use Postman or browser to hit `http://localhost:5000/api/crashes`

---

## 🗃️ Render Deployment

- Upload `render.yaml`
- Set `DATABASE_URL` as env var
- Use Gunicorn as start command:
```bash
gunicorn app:app
```