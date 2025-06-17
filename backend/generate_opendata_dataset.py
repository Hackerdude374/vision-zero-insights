import pandas as pd

url = "https://data.cityofnewyork.us/resource/h9gi-nx95.csv?$limit=1000"
df = pd.read_csv(url)

df = df[[
    'crash_date', 'borough', 'latitude', 'longitude',
    'number_of_persons_injured', 'contributing_factor_vehicle_1'
]]

df = df.dropna(subset=['latitude', 'longitude'])
df.to_csv('crash_data_cleaned.csv', index=False)
