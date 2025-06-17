import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
model_file = "model.pkl"
# In-memory ML model setup
model = None
features = ['borough', 'contributing_factor']
label = 'injury_severity'

# Manual label engineering from injury count
def load_and_train_model():
    global model
    try:
        if os.path.exists(model_file):
            model = joblib.load(model_file)
            print("✅ Loaded pre-trained model")
            return
        # Load from DB or CSV
        df = pd.read_csv('crash_data_cleaned.csv')

        # Preprocess
        df['injury_severity'] = df['number_of_persons_injured'].apply(lambda x: 'low' if x == 0 else 'high')
        df = df.dropna(subset=['borough', 'contributing_factor_vehicle_1'])

        df = df.rename(columns={'contributing_factor_vehicle_1': 'contributing_factor'})

        # Encode categoricals
        df = pd.get_dummies(df, columns=features)

        X = df.drop(['injury_severity', 'crash_date', 'latitude', 'longitude', 'number_of_persons_injured'], axis=1)
        y = df['injury_severity']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        model = RandomForestClassifier()
        model.fit(X_train, y_train)
        
        # Save for reuse
        joblib.dump(model, model_file)
        print("✅ Model trained")
    except Exception as e:
        print("❌ Model training failed:", e)

# Run once at startup
load_and_train_model()

# Predict from input
def predict_severity(data):
    global model
    try:
        input_df = pd.DataFrame([data])
        input_df = pd.get_dummies(input_df)

        # Align with training columns
        model_features = model.feature_names_in_
        for col in model_features:
            if col not in input_df.columns:
                input_df[col] = 0

        input_df = input_df[model_features]
        prediction = model.predict(input_df)[0]
        return prediction
    except Exception as e:
        print("❌ Prediction failed:", e)
        return "unknown"
