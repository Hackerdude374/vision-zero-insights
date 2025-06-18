import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { fetchCrashData } from "../api/crashAPI"
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = "pk.eyJ1IjoiamltYm9qb25lczEyMyIsImEiOiJjbWMyMWF2eXYwM21iMm9wejNwOW12bzBlIn0.BIplMo_WDg0a68Ftg_ccUw"

export default function CrashMap() {
  const mapRef = useRef(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.935242, 40.730610], // NYC center
      zoom: 10,
    })

    fetchCrashData().then(data => {
      console.log("Fetched crash data:", data)
      data.forEach(crash => {
        if (crash.longitude && crash.latitude) {
          new mapboxgl.Marker()
            .setLngLat([crash.longitude, crash.latitude])
            .setPopup(new mapboxgl.Popup().setText(`${crash.borough}: ${crash.contributing_factor_vehicle_1}`))
            .addTo(map)
        }
      })
    })

    return () => map.remove()
  }, [])

  return <div ref={mapRef} className="w-full h-screen" />
}
