import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { fetchCrashData } from "../api/crashAPI"
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = "pk.eyJ1IjoiamltYm9qb25lczEyMyIsImEiOiJjbWMyMWF2eXYwM21iMm9wejNwOW12bzBlIn0.BIplMo_WDg0a68Ftg_ccUw"

export default function CrashMap({ onMarkerClick }) {
  const mapRef = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.935242, 40.73061],
      zoom: 10
    })

    fetchCrashData()
      .then(data => {
        data.forEach((d) => {
          if (d.longitude && d.latitude) {
            const marker = new mapboxgl.Marker()
              .setLngLat([d.longitude, d.latitude])
              .addTo(map)

            // 🔥 Fix: attach click handler to marker's DOM element
            const el = marker.getElement()
            el.style.cursor = "pointer"
            el.addEventListener("click", () => {
              onMarkerClick(d)
            })
          }
        })
      })
      .catch(console.error)

    return () => map.remove()
  }, [onMarkerClick])

  return <div ref={mapRef} className="w-full h-full" />
}
