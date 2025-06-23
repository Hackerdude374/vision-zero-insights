import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CrashDetailsPanel({ crash, onClose }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      console.log("🔍 Sending to /api/predict:", {
        crash_date: crash.crash_date,
        borough: crash.borough,
        contributing_factor_vehicle_1: crash.contributing_factor_vehicle_1
      });

      try {
        const res = await fetch("https://vision-zero-insights.onrender.com/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crash_date: crash.crash_date,
            borough: crash.borough,
            contributing_factor_vehicle_1: crash.contributing_factor_vehicle_1
          })
        });

        const data = await res.json();
        console.log("✅ ML prediction response:", data);
        setPrediction(data.predicted_severity); // "low", "medium", "high"
      } catch (err) {
        console.error("❌ Prediction error:", err);
        setPrediction("❌ Failed");
      }

      setLoading(false);
    };

    if (crash) fetchPrediction();
  }, [crash]);

  const severityToInjuries = {
    low: 1,
    medium: 3,
    high: 5
  };

  const chartData = [
    { label: "Reported", value: crash.number_of_persons_injured },
    {
      label: "Predicted",
      value: severityToInjuries[prediction?.toLowerCase?.()] || 0
    }
  ];

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

      {!loading && prediction !== null && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">📊 Injury Stats Breakdown</h3>
          <div className="mt-2 p-4 border rounded bg-gray-50">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
