import psycopg2
import csv
import os

# Your Render DB URL
DATABASE_URL = "postgresql://visionzero_db_user:6s2vRfmAsALLhYtZYVegJZUJYi0YZIyI@dpg-d18bhkogjchc73eogai0-a.oregon-postgres.render.com/visionzero_db"

# Connect to the Render DB
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# 1. Create table if not exists
cur.execute("""
CREATE TABLE IF NOT EXISTS crash_data (
    crash_date DATE,
    borough TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    number_of_persons_injured INTEGER,
    contributing_factor_vehicle_1 TEXT
);
""")

# 2. Load CSV and insert rows
with open("crash_data_cleaned.csv", "r") as f:
    reader = csv.DictReader(f)
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

# 3. Add PostGIS geometry column if not exists
cur.execute("""
    ALTER TABLE crash_data 
    ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
""")

# 4. Populate geom using lon/lat
cur.execute("""
    UPDATE crash_data
    SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
    WHERE longitude IS NOT NULL AND latitude IS NOT NULL;
""")

# 5. Commit and close
conn.commit()
cur.close()
conn.close()

print("✅ Upload + PostGIS geom complete!")
