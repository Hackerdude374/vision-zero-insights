import Navbar from './components/Navbar'
import CrashMap from './components/CrashMap'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <CrashMap />
      </div>
    </div>
  )
}

