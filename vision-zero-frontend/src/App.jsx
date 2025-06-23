import { useState } from "react"
import Navbar from "./components/Navbar"
import CrashMap from "./components/CrashMap"

function App() {
  const [showPredict, setShowPredict] = useState(false)

  const handleDownload = () => {
    window.open("https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD", "_blank")
  }
  const token = import.meta.env.VITE_ADMIN_TOKEN
  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/admin/upload?token=${import.meta.env.VITE_ADMIN_TOKEN}`, {
        method: "POST"
      });
      const data = await res.json();
      alert(`✅ Refreshed: ${data.status || data.message}`);
    } catch (err) {
      alert("❌ Refresh failed");
      console.error(err);
    }
  };
  return (
    <div className="w-full h-screen">
      <Navbar
        onDownload={handleDownload}
        onRefresh={handleRefresh}
        onTogglePredict={() => setShowPredict(!showPredict)}
      />
      <div className="mt-16 h-[calc(100vh-64px)]">
        <CrashMap />
      </div>
    </div>
  )
}

export default App
