# db.py
import psycopg2
import os

# You can store this in an .env file or Render's Environment settings
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_recent_crashes(limit=100):
    query = """
        SELECT crash_date, borough, latitude, longitude,
               number_of_persons_injured, contributing_factor_vehicle_1
        FROM crash_data
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        ORDER BY crash_date DESC
        LIMIT %s;
    """
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute(query, (limit,))
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        results = [dict(zip(columns, row)) for row in rows]
        cur.close()
        conn.close()
        return results
    except Exception as e:
        print("DB error:", e)
        return []
