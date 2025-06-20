
import psycopg2
import csv
import os

# ✅ Set your database URL
DATABASE_URL = "postgresql://visionzero_db_user:6s2vRfmAsALLhYtZYVegJZUJYi0YZIyI@dpg-d18bhkogjchc73eogai0-a.oregon-postgres.render.com/visionzero_db"

# ✅ Connect to the PostgreSQL database
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

try:
    # ✅ 1. Enable PostGIS extension (if not already enabled)
    cur.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
    print("✅ PostGIS extension verified or installed")

    # ✅ 2. Create table if it doesn't exist
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
    print("✅ crash_data table ready")

    # ✅ 3. Load data from CSV file and insert into crash_data table
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
    print("✅ Data inserted from CSV")

    # ✅ 4. Add geometry column if it doesn't exist
    cur.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name='crash_data' AND column_name='geom'
            ) THEN
                ALTER TABLE crash_data ADD COLUMN geom geometry(Point, 4326);
            END IF;
        END
        $$;
    """)
    print("✅ Geometry column added or already exists")

    # ✅ 5. Populate geom column using lat/lon
    cur.execute("""
        UPDATE crash_data
        SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
        WHERE longitude IS NOT NULL AND latitude IS NOT NULL;
    """)
    print("✅ Geometry column populated")

    # ✅ 6. Commit and clean up
    conn.commit()
    print("✅ Upload + PostGIS geom complete!")

except Exception as e:
    print("❌ Error during script execution:", e)

finally:
    cur.close()
    conn.close()
