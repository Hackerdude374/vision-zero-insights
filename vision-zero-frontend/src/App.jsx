import { useState } from "react"
import Navbar from "./components/Navbar"
import CrashMap from "./components/CrashMap"
import CrashDetailsPanel from "./components/CrashDetailsPanel"

function App() {
  const [selectedCrash, setSelectedCrash] = useState(null)

  const handleDownload = () => {
    window.open("https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD", "_blank")
  }

  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/admin/upload?token=${import.meta.env.VITE_ADMIN_TOKEN}`, {
        method: "POST"
      })
      const data = await res.json()
      alert(`✅ Refreshed: ${data.status || data.message}`)
    } catch (err) {
      alert("❌ Refresh failed")
      console.error(err)
    }
  }

  return (
    <div className="w-full h-screen">
      <Navbar
        onDownload={handleDownload}
        onRefresh={handleRefresh}
      />
      <div className="mt-16 h-[calc(100vh-64px)] relative">
        <CrashMap onMarkerClick={setSelectedCrash} />
        {selectedCrash && (
          <CrashDetailsPanel crash={selectedCrash} onClose={() => setSelectedCrash(null)} />
        )}
      </div>
    </div>
  )
}

export default App
