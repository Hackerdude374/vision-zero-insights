
# Backend - Flask + PostgreSQL + ML

## 🔧 Purpose
Serves crash data via API and runs an ML model to predict crash severity.

## 🗂️ Important Files
- `app.py`: Main Flask app with API routes like `/api/crashes`
- `model.py`: Trains and saves the ML model (`model.pkl`)
- `db.py`: Connects to PostgreSQL using SQLAlchemy
- `upload_crash_data_to_render_PSQL.py`: Seeds the crash data into the Render PostgreSQL database
- `render.yaml` and `Procfile`: Used to deploy to Render

## ⚙️ Architecture
```
client (Vercel) --> API call --> Flask (Render) --> PostgreSQL (Render)
                                            ↳ model.pkl (ML prediction)
```

## 🔍 Example Route (Flask)
```python
@app.route("/api/crashes")
def get_crashes():
    results = db.session.query(Crash).limit(100).all()
    return jsonify([r.to_dict() for r in results])
```

## ✅ Setup Steps
1. Train model: `python model.py`
2. Upload data: `python upload_crash_data_to_render_PSQL.py`
3. Deploy to Render using `render.yaml`
