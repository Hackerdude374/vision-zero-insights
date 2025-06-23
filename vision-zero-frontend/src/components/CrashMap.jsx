import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { fetchCrashData } from "../api/crashAPI"
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = "pk.eyJ1IjoiamltYm9qb25lczEyMyIsImEiOiJjbWMyMWF2eXYwM21iMm9wejNwOW12bzBlIn0.BIplMo_WDg0a68Ftg_ccUw"

export default function CrashMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.935242, 40.73061],
      zoom: 10,
    });

    fetchCrashData()
      .then(data => {
        console.log("Data:", data);
        data.forEach(d => {
          if (d.longitude && d.latitude) {
            new mapboxgl.Marker()
              .setLngLat([d.longitude, d.latitude])
              .setPopup(new mapboxgl.Popup().setText(`${d.borough}: ${d.contributing_factor_vehicle_1}`))
              .addTo(map);
          }
        });
      })
      .catch(console.error);

    return () => map.remove();
  }, []);

  return <div ref={mapRef} className="w-full h-[calc(100vh-64px)]" />;
}