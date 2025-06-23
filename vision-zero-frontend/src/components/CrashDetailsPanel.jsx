import { useEffect, useState } from "react"

export default function CrashDetailsPanel({ crash, onClose }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crash_date: crash.crash_date,
            borough: crash.borough,
            contributing_factor_vehicle_1: crash.contributing_factor_vehicle_1
          })
        })
        const data = await res.json()
        setPrediction(data.predicted_injuries)
      } catch (err) {
        console.error("Prediction error:", err)
        setPrediction("❌ Failed")
      }
      setLoading(false)
    }

    if (crash) fetchPrediction()
  }, [crash])

  return (
    <div className="absolute right-0 top-0 w-full max-w-md h-full bg-white shadow-lg z-50 overflow-y-auto p-6">
      <button onClick={onClose} className="text-gray-500 hover:text-black float-right">✖</button>
      <h2 className="text-xl font-bold mb-4">🚗 Crash Details</h2>
      <p><b>Date:</b> {crash.crash_date}</p>
      <p><b>Borough:</b> {crash.borough}</p>
      <p><b>Factor:</b> {crash.contributing_factor_vehicle_1}</p>
      <p><b>Reported Injuries:</b> {crash.number_of_persons_injured}</p>

      <hr className="my-4" />

      <h3 className="font-semibold text-lg">🤖 Predicted Injuries</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p className="text-2xl font-bold">{prediction}</p>
      )}
    </div>
  )
}
