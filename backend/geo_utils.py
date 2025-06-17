# geo_utils.py

from shapely.geometry import Point
import geopandas as gpd
import pandas as pd

# Convert lat/lon into a GeoDataFrame with Point geometry
def make_geodf_from_crash_data(df, lat_col='latitude', lon_col='longitude'):
    df = df.dropna(subset=[lat_col, lon_col])
    gdf = gpd.GeoDataFrame(
        df,
        geometry=gpd.points_from_xy(df[lon_col], df[lat_col]),
        crs='EPSG:4326'
    )
    return gdf

# Filter a GeoDataFrame to crashes within a bounding box
def filter_crashes_in_bbox(gdf, min_lon, min_lat, max_lon, max_lat):
    bbox = gpd.GeoSeries([Point(min_lon, min_lat), Point(max_lon, max_lat)]).total_bounds
    return gdf.cx[min_lon:max_lon, min_lat:max_lat]

# Filter to crashes within a specific borough (assumes borough column exists)
def filter_by_borough(df, borough_name):
    return df[df['borough'].str.upper() == borough_name.upper()]
